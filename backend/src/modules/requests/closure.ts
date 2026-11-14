import type { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import type {
  CloseDossierInput,
  SaveDepositDecisionInput,
  SavePartnerPayoutInput,
} from "./schemas.js";
import { getRequestDetail } from "./service.js";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

async function loadRequest(id: string) {
  return prisma.serviceRequest.findUnique({ where: { id } });
}

function returnReady(payload: Record<string, unknown>) {
  const logistics = asRecord(payload.logistics);
  const returnFlow = asRecord(logistics.returnFlow);
  const depot = asRecord(returnFlow.depot);
  const pickup = asRecord(returnFlow.pickup);
  return Boolean(pickup.recorded && depot.allValidated) || logistics.status === "return_closed";
}

function pushClosureActivity(closure: Record<string, unknown>, label: string, actorId: string) {
  const previous = Array.isArray(closure.activity) ? [...closure.activity] : [];
  previous.unshift({ at: new Date().toISOString(), label, actorId });
  return previous.slice(0, 40);
}

function moneyDeposit(payload: Record<string, unknown>) {
  const payment = asRecord(payload.payment);
  const deposit = asRecord(payment.deposit);
  if (deposit.amount != null && String(deposit.amount).trim()) return String(deposit.amount);
  const proposal = asRecord(payload.proposal);
  if (proposal.depositAmount != null) return String(proposal.depositAmount);
  return "";
}

function partnerDue(payload: Record<string, unknown>) {
  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : [];
  const partnerRows = selection.filter((row) => row.ownerKind !== "onloutou");
  let total = 0;
  for (const row of partnerRows) {
    const raw = String(row.partnerAmount ?? row.amountPartner ?? row.partnerPrice ?? "").replace(/\s/g, "").replace(",", ".");
    const n = Number(raw);
    if (!Number.isNaN(n)) total += n;
  }
  if (total > 0) return String(Math.round(total));
  const proposal = asRecord(payload.proposal);
  if (proposal.partnerTotal != null) return String(proposal.partnerTotal);
  return "";
}

export async function saveDepositDecision(
  requestId: string,
  input: SaveDepositDecisionInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!returnReady(payload)) {
    return { ok: false as const, error: "Validez d’abord le retour (reprise + contrôle dépôt) avant de traiter le dépôt." };
  }
  if (asRecord(payload.closure).closed) {
    return { ok: false as const, error: "Dossier déjà clôturé." };
  }

  const held = moneyDeposit(payload);
  const kind = input.kind ?? "full";
  if (kind !== "full" && !(input.explanation?.trim())) {
    return { ok: false as const, error: "Une explication est requise pour une restitution partielle ou une retenue." };
  }

  const closurePrev = asRecord(payload.closure);
  const decision = {
    kind,
    heldAmount: held,
    refundAmount: kind === "full" ? held : String(input.refundAmount ?? "").trim(),
    retainAmount: kind === "retain" || kind === "partial" ? String(input.retainAmount ?? "").trim() : "",
    explanation: input.explanation?.trim() || (kind === "full" ? "Aucune retenue proposée : retour conforme." : ""),
    channel: input.channel?.trim() || "Canal validé manuellement",
    approverLabel: input.approverLabel?.trim() || "",
    submitted: Boolean(input.submit),
    submittedAt: input.submit ? new Date().toISOString() : asRecord(closurePrev.depositDecision).submittedAt ?? null,
    reference: String(asRecord(closurePrev.depositDecision).reference || `REMB-${String(request.reference).slice(-3)}`),
    executed: false,
  };

  const closure = {
    ...closurePrev,
    depositDecision: decision,
    activity: pushClosureActivity(
      closurePrev,
      decision.submitted ? "Décision de dépôt soumise à validation" : "Brouillon décision de dépôt enregistré",
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: {
        ...payload,
        closure,
        payment: {
          ...asRecord(payload.payment),
          deposit: {
            ...asRecord(asRecord(payload.payment).deposit),
            amount: held || asRecord(asRecord(payload.payment).deposit).amount,
            decisionKind: kind,
            decisionSubmitted: decision.submitted,
          },
        },
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: decision.submitted
            ? `Décision de dépôt (${kind}) soumise. Aucun remboursement n’est exécuté automatiquement.`
            : "Brouillon de décision de dépôt enregistré.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: decision.submitted ? "DEPOSIT_DECISION_SUBMITTED" : "DEPOSIT_DECISION_SAVED", kind, autoRefund: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function savePartnerPayout(
  requestId: string,
  input: SavePartnerPayoutInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!returnReady(payload)) {
    return { ok: false as const, error: "Validez d’abord le retour avant de préparer un reversement." };
  }
  if (asRecord(payload.closure).closed) {
    return { ok: false as const, error: "Dossier déjà clôturé." };
  }

  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : [];
  const hasPartner = selection.some((row) => row.ownerKind !== "onloutou");
  if (!hasPartner) {
    return { ok: false as const, error: "Aucun article partenaire : pas de reversement à préparer." };
  }

  const proposed = String(input.amount ?? partnerDue(payload)).trim();
  if (!proposed) {
    return { ok: false as const, error: "Indiquez le montant proposé au reversement." };
  }

  const closurePrev = asRecord(payload.closure);
  const payout = {
    amount: proposed,
    adjustments: input.adjustments?.trim() || "Aucun",
    deductions: input.deductions?.trim() || "Aucune",
    beneficiary: input.beneficiary?.trim() || String(selection.find((row) => row.ownerKind !== "onloutou")?.ownerName || "Partenaire"),
    channel: input.channel?.trim() || "Canal validé manuellement",
    validatorLabel: input.validatorLabel?.trim() || "",
    preparedBy: input.preparedBy?.trim() || "Responsable dossier",
    note: input.note?.trim() || "",
    submitted: Boolean(input.submit),
    submittedAt: input.submit ? new Date().toISOString() : asRecord(closurePrev.partnerPayout).submittedAt ?? null,
    reference: String(asRecord(closurePrev.partnerPayout).reference || `REV-${String(request.reference).slice(-3)}`),
    authorized: false,
    executed: false,
  };

  const closure = {
    ...closurePrev,
    partnerPayout: payout,
    activity: pushClosureActivity(
      closurePrev,
      payout.submitted ? "Reversement partenaire soumis à validation" : "Brouillon reversement partenaire enregistré",
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, closure } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: payout.submitted
            ? `Reversement partenaire ${payout.reference} soumis. Aucun paiement n’est exécuté automatiquement.`
            : "Brouillon de reversement partenaire enregistré.",
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: payout.submitted ? "PARTNER_PAYOUT_SUBMITTED" : "PARTNER_PAYOUT_SAVED", autoPaid: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function closeDossier(
  requestId: string,
  input: CloseDossierInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  if (!returnReady(payload)) {
    return { ok: false as const, error: "Le retour n’est pas encore validé." };
  }
  const closurePrev = asRecord(payload.closure);
  if (closurePrev.closed) {
    return { ok: false as const, error: "Dossier déjà clôturé." };
  }

  const deposit = asRecord(closurePrev.depositDecision);
  const payout = asRecord(closurePrev.partnerPayout);
  const selection = Array.isArray(asRecord(payload.selection).items)
    ? (asRecord(payload.selection).items as unknown[]).map((row) => asRecord(row))
    : [];
  const hasPartner = selection.some((row) => row.ownerKind !== "onloutou");

  if (!deposit.submitted) {
    return { ok: false as const, error: "Soumettez d’abord la décision de dépôt de garantie." };
  }
  if (hasPartner && !payout.submitted) {
    return { ok: false as const, error: "Soumettez d’abord le reversement partenaire (ou signalez l’absence de partenaire)." };
  }

  const closedAt = new Date().toISOString();
  const closure = {
    ...closurePrev,
    closed: true,
    closedAt,
    closeDate: input.closeDate || closedAt.slice(0, 10),
    closeReason: input.closeReason?.trim() || "Location terminée sans incident",
    closeNote: input.closeNote?.trim() || "",
    activity: pushClosureActivity(closurePrev, "Dossier clôturé et archivé", actorId),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: "CLOSED",
      payload: {
        ...payload,
        closure,
        rental: {
          ...asRecord(payload.rental),
          status: "closed",
          closedAt,
        },
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: "CLOSED",
          note: `Dossier clôturé. Motif : ${closure.closeReason}. Les exécutions de remboursement/reversement restent des suites financières séparées.`,
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "DOSSIER_CLOSED", from: request.status, to: "CLOSED" },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}
