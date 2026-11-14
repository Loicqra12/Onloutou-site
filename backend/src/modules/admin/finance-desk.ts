import type { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function str(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function num(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

type RequestRow = {
  id: string;
  reference: string;
  status: string;
  contactName: string;
  organization: string | null;
  contactEmail: string | null;
  payload: unknown;
  updatedAt: Date;
  assignee: { displayName: string | null; email: string } | null;
};

async function loadRequests(take = 120): Promise<RequestRow[]> {
  return prisma.serviceRequest.findMany({
    take,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      reference: true,
      status: true,
      contactName: true,
      organization: true,
      contactEmail: true,
      payload: true,
      updatedAt: true,
      assignee: { select: { displayName: true, email: true } },
    },
  });
}

function clientName(row: RequestRow) {
  return row.organization || row.contactName || "Client";
}

function assigneeName(row: RequestRow) {
  return row.assignee?.displayName || row.assignee?.email || null;
}

function selectionItems(payload: Record<string, unknown>) {
  const selection = asRecord(payload.selection);
  return Array.isArray(selection.items) ? selection.items.map((row) => asRecord(row)) : [];
}

function articleLabel(payload: Record<string, unknown>) {
  const items = selectionItems(payload);
  if (!items.length) return str(payload.familyLabel) || "—";
  const first = items[0]!;
  return `${str(first.reference) || str(first.title)}${items.length > 1 ? ` (+${items.length - 1})` : ""}`;
}

function paymentOpsFromRequest(row: RequestRow) {
  const payload = asRecord(row.payload);
  const payment = asRecord(payload.payment);
  const ops: {
    id: string;
    reference: string;
    requestId: string;
    dossier: string;
    client: string;
    type: "acompte" | "solde" | "remboursement";
    channel: string;
    amount: number | null;
    date: string | null;
    status: string;
    assignee: string | null;
  }[] = [];

  const initial = asRecord(payment.initial);
  if (initial.verified || initial.amount != null) {
    ops.push({
      id: `${row.id}:initial`,
      reference: str(initial.reference) || `PAY-${row.reference.slice(-5)}-A`,
      requestId: row.id,
      dossier: row.reference,
      client: clientName(row),
      type: "acompte",
      channel: str(initial.channel) || "Non précisé",
      amount: num(initial.amount),
      date: str(initial.receivedAt || initial.verifiedAt) || null,
      status: initial.verified ? (initial.reconciled ? "confirmed" : "to_reconcile") : "pending",
      assignee: assigneeName(row),
    });
  }

  const balance = asRecord(payment.balance);
  if (balance.verified || balance.amount != null) {
    ops.push({
      id: `${row.id}:balance`,
      reference: str(balance.reference) || `PAY-${row.reference.slice(-5)}-S`,
      requestId: row.id,
      dossier: row.reference,
      client: clientName(row),
      type: "solde",
      channel: str(balance.channel) || "Non précisé",
      amount: num(balance.amount),
      date: str(balance.receivedAt || balance.verifiedAt) || null,
      status: balance.verified ? (balance.reconciled ? "confirmed" : "to_reconcile") : "pending",
      assignee: assigneeName(row),
    });
  }

  const depositDecision = asRecord(asRecord(payload.closure).depositDecision);
  if (depositDecision.submitted) {
    const kind = str(depositDecision.kind) || "full";
    const refundAmount =
      kind === "full"
        ? num(depositDecision.heldAmount || depositDecision.refundAmount)
        : num(depositDecision.refundAmount);
    ops.push({
      id: `${row.id}:refund`,
      reference: str(depositDecision.reference) || `REMB-${row.reference.slice(-3)}`,
      requestId: row.id,
      dossier: row.reference,
      client: clientName(row),
      type: "remboursement",
      channel: str(depositDecision.channel) || "Canal manuel",
      amount: refundAmount,
      date: str(depositDecision.submittedAt) || null,
      status: depositDecision.executed ? "refunded" : "to_refund",
      assignee: assigneeName(row),
    });
  }

  return ops;
}

export async function listPayments(query: { q?: string; type?: string; status?: string }) {
  const rows = await loadRequests();
  let items = rows.flatMap(paymentOpsFromRequest);
  if (query.q) {
    const q = query.q.toLowerCase();
    items = items.filter(
      (op) =>
        op.reference.toLowerCase().includes(q) ||
        op.dossier.toLowerCase().includes(q) ||
        op.client.toLowerCase().includes(q),
    );
  }
  if (query.type && query.type !== "all") items = items.filter((op) => op.type === query.type);
  if (query.status && query.status !== "all") items = items.filter((op) => op.status === query.status);

  const counts = {
    toReconcile: items.filter((op) => op.status === "to_reconcile").length,
    confirmedToday: items.filter((op) => {
      if (op.status !== "confirmed" || !op.date) return false;
      return op.date.slice(0, 10) === new Date().toISOString().slice(0, 10);
    }).length,
    refundsToValidate: items.filter((op) => op.type === "remboursement" && op.status === "to_refund").length,
    failures: items.filter((op) => op.status === "failed").length,
  };

  return { items, total: items.length, counts };
}

export async function getPaymentDetail(opId: string) {
  const [requestId, kind] = opId.split(":");
  if (!requestId || !kind) return { ok: false as const, error: "Opération introuvable." };
  const row = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      reference: true,
      status: true,
      contactName: true,
      organization: true,
      contactEmail: true,
      payload: true,
      updatedAt: true,
      assignee: { select: { displayName: true, email: true } },
    },
  });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  const op = paymentOpsFromRequest(row).find((item) => item.id === opId);
  if (!op) return { ok: false as const, error: "Paiement introuvable sur ce dossier." };

  const payload = asRecord(row.payload);
  const payment = asRecord(payload.payment);
  const initial = asRecord(payment.initial);
  const balance = asRecord(payment.balance);
  const paid = (num(initial.amount) || 0) + (num(balance.amount) || 0);
  const proposal = asRecord(payload.proposal);
  const totalDue = num(proposal.totalClient || proposal.clientTotal || proposal.total) || paid || null;

  return {
    ok: true as const,
    payment: {
      ...op,
      note: "ONLOUTOU encaisse le client. Le reversement partenaire est une opération distincte.",
      dossierId: row.id,
      timeline: [
        { label: "Enregistré / vérifié", at: op.date, done: Boolean(op.date) },
        { label: "Rapprochement", at: null, done: op.status === "confirmed" || op.status === "refunded" },
        { label: "Clôture financière dossier", at: null, done: row.status === "CLOSED" },
      ],
      allocation: {
        totalDue,
        paid,
        remaining: totalDue != null ? Math.max(0, totalDue - paid) : null,
      },
      receipt: str(asRecord(kind === "balance" ? balance : initial).proofLabel) || null,
      events: Array.isArray(asRecord(payload.closure).activity)
        ? (asRecord(payload.closure).activity as unknown[]).slice(0, 8).map((ev) => {
            const e = asRecord(ev);
            return { at: str(e.at), label: str(e.label) };
          })
        : [],
    },
  };
}

export async function reconcilePayment(opId: string, actorId: string, ip?: string) {
  const [requestId, kind] = opId.split(":");
  if (!requestId || (kind !== "initial" && kind !== "balance")) {
    return { ok: false as const, error: "Seuls les encaissements client peuvent être rapprochés ici." };
  }
  const row = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(row.payload);
  const payment = asRecord(payload.payment);
  const bucket = asRecord(payment[kind]);
  if (!bucket.verified) return { ok: false as const, error: "Vérifiez d’abord le paiement sur le dossier." };

  const nextPayment = {
    ...payment,
    [kind]: { ...bucket, reconciled: true, reconciledAt: new Date().toISOString(), reconciledBy: actorId },
  };
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, payment: nextPayment } as Prisma.InputJsonValue,
      events: {
        create: {
          status: row.status,
          note: `Rapprochement enregistré pour ${kind === "initial" ? "acompte" : "solde"}.`,
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
    metadata: { event: "PAYMENT_RECONCILED", kind },
    ip,
  });
  return getPaymentDetail(opId);
}

function depositFromRequest(row: RequestRow) {
  const payload = asRecord(row.payload);
  const payment = asRecord(payload.payment);
  const deposit = asRecord(payment.deposit);
  const closure = asRecord(payload.closure);
  const decision = asRecord(closure.depositDecision);
  const proposal = asRecord(payload.proposal);
  const amount = num(deposit.amount || decision.heldAmount || proposal.depositAmount);
  const required = str(proposal.deposit) === "required" || amount != null || Boolean(decision.kind);
  if (!required && !decision.submitted && amount == null) return null;

  const returnFlow = asRecord(asRecord(payload.logistics).returnFlow);
  const depot = asRecord(returnFlow.depot);
  let status = "to_collect";
  if (deposit.verified || deposit.collected) status = "held";
  if (decision.submitted && !decision.executed) status = "decision_pending";
  if (decision.executed) status = "restored";
  if (str(decision.kind) === "retain" && decision.submitted) status = "retain_pending";

  return {
    id: row.id,
    reference: str(decision.reference) || `DEP-${row.reference.slice(-5)}`,
    requestId: row.id,
    dossier: row.reference,
    client: clientName(row),
    article: articleLabel(payload),
    amount,
    collection: deposit.verified || deposit.collected ? "collected" : amount != null ? "expected" : "unknown",
    returnStatus: depot.allValidated ? "controlled" : asRecord(returnFlow.pickup).recorded ? "picked" : "open",
    incident: Boolean(asRecord(payload.incident).open),
    decision: str(decision.kind) || null,
    decisionSubmitted: Boolean(decision.submitted),
    status,
    assignee: assigneeName(row),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listDeposits(query: { q?: string; status?: string }) {
  const rows = await loadRequests();
  let items = rows.map(depositFromRequest).filter(Boolean) as NonNullable<ReturnType<typeof depositFromRequest>>[];
  if (query.q) {
    const q = query.q.toLowerCase();
    items = items.filter(
      (d) =>
        d.reference.toLowerCase().includes(q) ||
        d.dossier.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q),
    );
  }
  if (query.status && query.status !== "all") items = items.filter((d) => d.status === query.status);

  const sum = (list: typeof items) => list.reduce((acc, d) => acc + (d.amount || 0), 0);
  const toCollect = items.filter((d) => d.status === "to_collect");
  const held = items.filter((d) => d.status === "held" || d.status === "decision_pending" || d.status === "retain_pending");
  const decisions = items.filter((d) => d.status === "decision_pending" || d.status === "retain_pending");

  return {
    items,
    total: items.length,
    counts: {
      toCollect: toCollect.length,
      toCollectAmount: sum(toCollect),
      held: held.length,
      heldAmount: sum(held),
      decisionsPending: decisions.length,
      decisionsAmount: sum(decisions),
      lateRestitutions: 0,
      lateAmount: 0,
    },
    banner:
      "Le dépôt est détenu par ONLOUTOU jusqu’au retour contrôlé. Toute retenue exige un bilan, un incident lié et une décision traçable. Aucun prélèvement automatique.",
  };
}

export async function getDepositDetail(requestId: string) {
  const row = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      reference: true,
      status: true,
      contactName: true,
      organization: true,
      contactEmail: true,
      contactPhone: true,
      payload: true,
      updatedAt: true,
      assignee: { select: { displayName: true, email: true } },
    },
  });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  const base = depositFromRequest(row);
  if (!base) return { ok: false as const, error: "Aucun dépôt suivi sur ce dossier." };

  const payload = asRecord(row.payload);
  const payment = asRecord(payload.payment);
  const deposit = asRecord(payment.deposit);
  const decision = asRecord(asRecord(payload.closure).depositDecision);
  const returnFlow = asRecord(asRecord(payload.logistics).returnFlow);
  const start = str(payload.startDate);
  const end = str(payload.endDate);

  return {
    ok: true as const,
    deposit: {
      ...base,
      clientPhone: row.contactPhone,
      clientEmail: row.contactEmail,
      period: start || end ? `${start || "?"} – ${end || "?"}` : null,
      collectionProof: {
        channel: str(deposit.channel) || null,
        reference: str(deposit.reference) || null,
        at: str(deposit.verifiedAt || deposit.collectedAt) || null,
      },
      decisionDetail: {
        kind: str(decision.kind) || null,
        explanation: str(decision.explanation) || null,
        refundAmount: num(decision.refundAmount),
        retainAmount: num(decision.retainAmount),
        heldAmount: num(decision.heldAmount || deposit.amount),
        submitted: Boolean(decision.submitted),
        channel: str(decision.channel) || null,
        reference: str(decision.reference) || null,
      },
      returnNote: asRecord(returnFlow.depot).allValidated
        ? "Retour contrôlé enregistré sur le dossier."
        : "Retour non encore validé au dépôt.",
      openDecisionPath: `/dossiers/${row.id}?tab=finances&view=deposit`,
      banner:
        "Le dépôt est détenu par ONLOUTOU jusqu’au retour contrôlé. Aucun prélèvement automatique sur le dépôt.",
    },
  };
}

function payoutFromRequest(row: RequestRow) {
  const payload = asRecord(row.payload);
  const closure = asRecord(payload.closure);
  const payout = asRecord(closure.partnerPayout);
  const items = selectionItems(payload).filter((item) => item.ownerKind !== "onloutou");
  if (!items.length && !payout.submitted && !payout.amount) return null;

  const partnerName = str(payout.beneficiary) || str(items[0]?.ownerName) || "Partenaire";
  const returnFlow = asRecord(asRecord(payload.logistics).returnFlow);
  const depot = asRecord(returnFlow.depot);
  let status = "eligible";
  if (payout.blocked) status = "blocked";
  else if (payout.executed) status = "paid";
  else if (payout.scheduled) status = "scheduled";
  else if (payout.submitted) status = "pending_validation";
  else if (!depot.allValidated) status = "to_check";

  return {
    id: row.id,
    reference: str(payout.reference) || `REV-${row.reference.slice(-3)}`,
    requestId: row.id,
    dossier: row.reference,
    partner: partnerName,
    article: articleLabel(payload),
    returnConfirmed: Boolean(depot.allValidated),
    returnAt: str(asRecord(returnFlow.pickup).recordedAt) || null,
    amount: num(payout.amount),
    adjustments: str(payout.adjustments) || "Aucun",
    deductions: str(payout.deductions) || "Aucune",
    eligibleAt: str(payout.submittedAt) || (depot.allValidated ? row.updatedAt.toISOString() : null),
    status,
    blockReason: str(payout.blockReason) || null,
    assignee: assigneeName(row),
  };
}

export async function listPayouts(query: { q?: string; status?: string }) {
  const rows = await loadRequests();
  let items = rows.map(payoutFromRequest).filter(Boolean) as NonNullable<ReturnType<typeof payoutFromRequest>>[];

  const partnerRevenues = await prisma.partnerRevenue.findMany({
    take: 80,
    orderBy: { updatedAt: "desc" },
    include: {
      partnerProfile: { select: { organizationName: true } },
      product: { select: { title: true, reference: true } },
      location: { select: { reference: true } },
      payout: true,
    },
  });

  for (const rev of partnerRevenues) {
    items.push({
      id: `rev:${rev.id}`,
      reference: rev.reference,
      requestId: rev.location.reference,
      dossier: rev.location.reference,
      partner: rev.partnerProfile.organizationName,
      article: `${rev.product.reference || ""} ${rev.product.title}`.trim(),
      returnConfirmed: true,
      returnAt: null,
      amount: rev.netAmount,
      adjustments: `Commission ${rev.commissionBps / 100}% (à valider contractuellement)`,
      deductions: "Selon commission enregistrée",
      eligibleAt: rev.createdAt.toISOString(),
      status: rev.payout ? "paid" : rev.status === "PENDING" ? "pending_validation" : "eligible",
      blockReason: null,
      assignee: null,
    });
  }

  if (query.q) {
    const q = query.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.partner.toLowerCase().includes(q) ||
        p.dossier.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q),
    );
  }
  if (query.status && query.status !== "all") items = items.filter((p) => p.status === query.status);

  return {
    items,
    total: items.length,
    counts: {
      eligible: items.filter((p) => p.status === "eligible").length,
      pendingValidation: items.filter((p) => p.status === "pending_validation").length,
      scheduled: items.filter((p) => p.status === "scheduled").length,
      blocked: items.filter((p) => p.status === "blocked").length,
    },
    note: "Les commissions et délais de reversement restent à valider contractuellement.",
  };
}

export async function getPayoutDetail(id: string) {
  if (id.startsWith("rev:")) {
    const revId = id.slice(4);
    const rev = await prisma.partnerRevenue.findUnique({
      where: { id: revId },
      include: {
        partnerProfile: true,
        product: true,
        location: true,
        payout: true,
      },
    });
    if (!rev) return { ok: false as const, error: "Reversement introuvable." };
    return {
      ok: true as const,
      payout: {
        id,
        reference: rev.reference,
        partner: rev.partnerProfile.organizationName,
        commune: rev.partnerProfile.commune,
        dossier: rev.location.reference,
        article: rev.product.title,
        amount: rev.netAmount,
        grossAmount: rev.grossAmount,
        commissionAmount: rev.commissionAmount,
        commissionBps: rev.commissionBps,
        status: rev.payout ? "paid" : "pending_validation",
        source: "partner_revenue",
        note: "Commission issue du module partenaire. Barème définitif à valider avant production.",
        steps: [
          { label: "Éligibilité", done: true },
          { label: "Montant contrôlé", done: true },
          { label: "Approbation finance", done: Boolean(rev.payout) },
          { label: "Paiement exécuté", done: Boolean(rev.payout) },
          { label: "Reçu déposé", done: Boolean(rev.payout) },
        ],
        openPath: null,
      },
    };
  }

  const row = await prisma.serviceRequest.findUnique({
    where: { id },
    select: {
      id: true,
      reference: true,
      status: true,
      contactName: true,
      organization: true,
      contactEmail: true,
      payload: true,
      updatedAt: true,
      assignee: { select: { displayName: true, email: true } },
    },
  });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  const base = payoutFromRequest(row);
  if (!base) return { ok: false as const, error: "Aucun reversement partenaire sur ce dossier." };
  const payout = asRecord(asRecord(asRecord(row.payload).closure).partnerPayout);

  return {
    ok: true as const,
    payout: {
      ...base,
      source: "dossier_closure",
      preparedBy: str(payout.preparedBy) || null,
      validatorLabel: str(payout.validatorLabel) || null,
      channel: str(payout.channel) || null,
      note: "Aucun paiement automatique. Soumission ≠ exécution.",
      steps: [
        { label: "Éligibilité", done: base.returnConfirmed },
        { label: "Montant contrôlé", done: Boolean(base.amount) },
        { label: "Approbation finance", done: Boolean(payout.submitted) },
        { label: "Paiement exécuté", done: Boolean(payout.executed) },
        { label: "Reçu déposé", done: Boolean(payout.receiptDeposited) },
      ],
      openPath: `/dossiers/${row.id}?tab=finances&view=payout`,
    },
  };
}

export async function schedulePayout(requestId: string, actorId: string, ip?: string) {
  if (requestId.startsWith("rev:")) {
    return { ok: false as const, error: "Programmation des revenus partenaire : à brancher après validation des commissions." };
  }
  const row = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(row.payload);
  const closure = asRecord(payload.closure);
  const payout = asRecord(closure.partnerPayout);
  if (!payout.submitted) return { ok: false as const, error: "Soumettez d’abord le reversement sur le dossier." };

  const next = {
    ...closure,
    partnerPayout: {
      ...payout,
      scheduled: true,
      scheduledAt: new Date().toISOString(),
      scheduledBy: actorId,
    },
  };
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, closure: next } as Prisma.InputJsonValue,
      events: {
        create: {
          status: row.status,
          note: "Reversement partenaire approuvé et programmé. Exécution bancaire non déclenchée ici.",
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
    metadata: { event: "PARTNER_PAYOUT_SCHEDULED" },
    ip,
  });
  return getPayoutDetail(requestId);
}

export async function blockPayout(requestId: string, reason: string, actorId: string, ip?: string) {
  if (requestId.startsWith("rev:")) {
    return { ok: false as const, error: "Blocage des revenus partenaire hors dossier : non disponible ici." };
  }
  const row = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  if (!reason.trim()) return { ok: false as const, error: "Un motif de blocage est requis." };
  const payload = asRecord(row.payload);
  const closure = asRecord(payload.closure);
  const payout = asRecord(closure.partnerPayout);
  const next = {
    ...closure,
    partnerPayout: {
      ...payout,
      blocked: true,
      blockReason: reason.trim(),
      blockedAt: new Date().toISOString(),
      blockedBy: actorId,
    },
  };
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, closure: next } as Prisma.InputJsonValue,
      events: {
        create: { status: row.status, note: `Reversement bloqué : ${reason.trim()}`, actorId },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "PARTNER_PAYOUT_BLOCKED", reason: reason.trim() },
    ip,
  });
  return getPayoutDetail(requestId);
}

function invoiceFromRequest(row: RequestRow) {
  const payload = asRecord(row.payload);
  const payment = asRecord(payload.payment);
  const initial = asRecord(payment.initial);
  const billing = asRecord(payload.billing);
  const hasPayment = Boolean(initial.verified || initial.amount);
  if (!hasPayment && !billing.draft && row.status !== "CLOSED" && row.status !== "QUOTED") return null;

  const issued = Boolean(billing.issued);
  const status = issued ? (billing.paid ? "paid" : "issued") : "draft";
  return {
    id: row.id,
    reference: str(billing.reference) || `BROUILLON-${row.reference.slice(-5)}`,
    provisional: !issued,
    type: str(billing.type) || "facture",
    dossier: row.reference,
    client: clientName(row),
    date: str(billing.issuedAt) || row.updatedAt.toISOString(),
    dueDate: str(billing.dueDate) || null,
    total: num(billing.total || asRecord(payload.proposal).totalClient || initial.amount),
    paymentStatus: initial.verified ? (asRecord(payment.balance).verified ? "paid" : "partial") : "unpaid",
    status,
    assignee: assigneeName(row),
  };
}

export async function listInvoices(query: { q?: string; status?: string }) {
  const rows = await loadRequests();
  let items = rows.map(invoiceFromRequest).filter(Boolean) as NonNullable<ReturnType<typeof invoiceFromRequest>>[];
  if (query.q) {
    const q = query.q.toLowerCase();
    items = items.filter(
      (i) =>
        i.reference.toLowerCase().includes(q) ||
        i.dossier.toLowerCase().includes(q) ||
        i.client.toLowerCase().includes(q),
    );
  }
  if (query.status && query.status !== "all") items = items.filter((i) => i.status === query.status);

  return {
    items,
    total: items.length,
    counts: {
      toIssue: items.filter((i) => i.status === "draft").length,
      issuedThisMonth: items.filter((i) => {
        if (i.status === "draft" || !i.date) return false;
        const d = new Date(i.date);
        const now = new Date();
        return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
      }).length,
      creditNotes: 0,
      exportsPending: 0,
    },
    banner:
      "Numérotation, TVA et règles fiscales à valider avec le comptable avant mise en production. Aucune facture définitive n’est émise automatiquement ici.",
  };
}

export async function getInvoiceDetail(requestId: string) {
  const row = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      reference: true,
      status: true,
      contactName: true,
      organization: true,
      contactEmail: true,
      contactPhone: true,
      zone: true,
      payload: true,
      updatedAt: true,
      assignee: { select: { displayName: true, email: true } },
    },
  });
  if (!row) return { ok: false as const, error: "Dossier introuvable." };
  const base = invoiceFromRequest(row);
  if (!base) return { ok: false as const, error: "Aucun document de facturation amorcé pour ce dossier." };

  const payload = asRecord(row.payload);
  const items = selectionItems(payload);
  const lines =
    items.length > 0
      ? items.map((item, index) => ({
          id: str(item.productId) || String(index),
          label: str(item.title) || "Article",
          qty: num(item.quantity) || 1,
          unitPrice: num(item.clientAmount || item.amountClient || item.price) ,
          total: num(item.clientAmount || item.amountClient || item.price),
        }))
      : [
          {
            id: "line-1",
            label: str(payload.familyLabel) || "Prestation de location",
            qty: 1,
            unitPrice: base.total,
            total: base.total,
          },
        ];

  const payment = asRecord(payload.payment);
  const initial = asRecord(payment.initial);

  return {
    ok: true as const,
    invoice: {
      ...base,
      issuer: "ONLOUTOU (émetteur à confirmer juridiquement)",
      clientDetail: {
        name: clientName(row),
        email: row.contactEmail,
        phone: row.contactPhone,
        zone: row.zone,
      },
      lines,
      payments: initial.verified
        ? [
            {
              reference: str(initial.reference) || `PAY-${row.reference.slice(-5)}`,
              amount: num(initial.amount),
              channel: str(initial.channel) || "—",
              at: str(initial.receivedAt || initial.verifiedAt),
            },
          ]
        : [],
      journalNote: "Écritures comptables (411 / 706…) non générées : plan comptable et TVA à valider.",
      controls: {
        numbering: "Provisoire — à valider",
        lockAfterIssue: false,
        accountingValidation: "À valider",
      },
      openPath: `/dossiers/${row.id}?tab=finances`,
    },
  };
}
