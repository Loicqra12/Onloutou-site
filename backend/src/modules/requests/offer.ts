import { customAlphabet } from "nanoid";
import type { Prisma } from "@prisma/client";
import type { Env } from "../../config/env.js";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import {
  mailFailedMessage,
  mailUnavailableMessage,
  proposalOfferEmailText,
  sendMail,
} from "../../lib/mailer.js";
import { generateToken } from "../../lib/tokens.js";
import { rangeAvailability, type ArticleTerms, type UnavailabilityInput } from "../catalog/article-validation.js";
import { publicImageUrl } from "../documents/storage.js";
import { notifyPartner } from "../ops/service.js";
import type {
  ConfirmRentalInput,
  CreatePartnerDemandInput,
  FollowUpProposalInput,
  ParkCheckInput,
  RecordAgreementInput,
  SaveProposalInput,
  SaveSelectionInput,
  SearchArticlesQuery,
  TransmitProposalInput,
  VerifyPaymentInput,
} from "./schemas.js";
import { getRequestDetail } from "./service.js";

const demSuffix = customAlphabet("0123456789ABCDEFGHJKMNPQRSTUVWXYZ", 6);
const propSuffix = customAlphabet("0123456789ABCDEFGHJKMNPQRSTUVWXYZ", 4);

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asTerms(value: unknown): ArticleTerms {
  return asRecord(value) as ArticleTerms;
}

function ownerKind(name: string): "onloutou" | "partner" {
  return /onloutou/i.test(name) ? "onloutou" : "partner";
}

function mapUnavails(rows: { startDate: Date; endDate: Date; quantity: number; reason?: string | null }[]): UnavailabilityInput[] {
  return rows.map((row) => ({
    startDate: isoDate(row.startDate),
    endDate: isoDate(row.endDate),
    quantity: row.quantity,
    reason: row.reason,
  }));
}

function generateDemandReference(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `DEM-${y}${m}${d}-${demSuffix()}`;
}

function generateProposalReference(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `PROP-${y}${m}${d}-${propSuffix()}`;
}

function defaultValidUntil(now = new Date()): string {
  const date = new Date(now.getTime());
  date.setUTCDate(date.getUTCDate() + 4);
  return isoDate(date);
}

function pushActivity(
  proposal: Record<string, unknown>,
  label: string,
  actorId: string,
): Record<string, unknown>[] {
  const previous = Array.isArray(proposal.activity) ? [...proposal.activity] : [];
  previous.unshift({ at: new Date().toISOString(), label, actorId });
  return previous.slice(0, 40);
}

function statusHint(input: {
  ownerKind: "onloutou" | "partner";
  demandStatus?: string | null;
  replyKind?: string | null;
  parkChecked?: boolean;
  note?: string | null;
}): { label: string; tone: "warn" | "info" | "ok" | "muted"; note?: string } {
  if (input.ownerKind === "onloutou") {
    if (input.parkChecked) return { label: "Parc contrôlé · À confirmer", tone: "ok" };
    return { label: "Contrôle du parc requis", tone: "warn" };
  }
  if (input.demandStatus === "PENDING") return { label: "En attente de réponse", tone: "info" };
  if (input.demandStatus === "ANSWERED" && input.replyKind === "AVAILABLE") {
    return { label: "Disponible (réponse partenaire)", tone: "ok" };
  }
  if (input.demandStatus === "ANSWERED" && input.replyKind === "ADJUSTMENT") {
    return { label: "Ajustement proposé", tone: "info" };
  }
  if (input.demandStatus === "ANSWERED" && input.replyKind === "UNAVAILABLE") {
    return { label: "Indisponible", tone: "warn" };
  }
  if (input.note) return { label: "Alternative · À confirmer", tone: "muted", note: input.note };
  return { label: "Réponse partenaire requise", tone: "info" };
}

export async function searchArticlesForAdmin(query: SearchArticlesQuery) {
  const q = query.q?.trim() ?? "";
  const rows = await prisma.product.findMany({
    where: {
      status: "APPROVED",
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { reference: { contains: q, mode: "insensitive" } },
              { categorySlug: { contains: q, mode: "insensitive" } },
              { familySlug: { contains: q, mode: "insensitive" } },
              { partnerProfile: { organizationName: { contains: q, mode: "insensitive" } } },
              { partnerProfile: { commercialName: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(query.commune
        ? { partnerProfile: { commune: { equals: query.commune, mode: "insensitive" } } }
        : {}),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      unavailabilities: true,
      partnerProfile: {
        select: {
          id: true,
          organizationName: true,
          commercialName: true,
          commune: true,
          status: true,
          userId: true,
        },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 40,
  });

  const start = query.startDate || "";
  const end = query.endDate || "";

  return rows
    .map((row) => {
      const ownerName = row.partnerProfile.commercialName || row.partnerProfile.organizationName;
      const kind = ownerKind(ownerName);
      const terms = asTerms(row.terms);
      const commune = String(terms.commune ?? row.partnerProfile.commune ?? "—");
      const total = Number(terms.quantity ?? 0);
      const periods = mapUnavails(row.unavailabilities);
      const stock =
        start && end && total
          ? rangeAvailability(total, periods, start, end)
          : { total, unavailable: 0, available: total };
      return {
        id: row.id,
        title: row.title,
        reference: row.reference,
        category: row.category,
        familySlug: row.familySlug,
        categorySlug: row.categorySlug,
        imageUrl: row.images[0] ? publicImageUrl(row.images[0].storageKey) : null,
        ownerKind: kind,
        ownerName,
        partnerProfileId: row.partnerProfile.id,
        partnerApproved: row.partnerProfile.status === "APPROVED",
        commune,
        stock,
        hint: statusHint({
          ownerKind: kind,
          note: kind === "partner" && stock.available === 0 && total > 0 ? "Capacité ou période à faire accepter au client" : null,
        }),
      };
    })
    .filter((row) => {
      if (query.owner === "onloutou") return row.ownerKind === "onloutou";
      if (query.owner === "partner") return row.ownerKind === "partner";
      return true;
    });
}

async function loadRequest(id: string) {
  return prisma.serviceRequest.findUnique({ where: { id } });
}

function selectionFromPayload(payload: Record<string, unknown>) {
  const selection = asRecord(payload.selection);
  const items = Array.isArray(selection.items) ? selection.items : [];
  return items.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object");
}

export async function saveDossierSelection(requestId: string, input: SaveSelectionInput, actorId: string, ip?: string) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };

  const productIds = input.items.map((row) => row.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "APPROVED" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      partnerProfile: { select: { organizationName: true, commercialName: true, commune: true, status: true } },
    },
  });
  if (products.length !== productIds.length) {
    return { ok: false as const, error: "Un ou plusieurs articles ne sont plus disponibles au catalogue." };
  }

  const payload = asRecord(request.payload);
  const previous = selectionFromPayload(payload);
  const demands = Array.isArray(payload.partnerDemands) ? payload.partnerDemands : [];
  const parkChecks = Array.isArray(payload.parkChecks) ? payload.parkChecks : [];

  const items = input.items.map((row) => {
    const product = products.find((p) => p.id === row.productId)!;
    const ownerName = product.partnerProfile.commercialName || product.partnerProfile.organizationName;
    const kind = ownerKind(ownerName);
    const prev = previous.find((item) => item.productId === row.productId);
    const linkedDemand = demands.find(
      (d) => d && typeof d === "object" && (d as Record<string, unknown>).productId === row.productId,
    ) as Record<string, unknown> | undefined;
    const park = parkChecks.find(
      (d) => d && typeof d === "object" && (d as Record<string, unknown>).productId === row.productId,
    ) as Record<string, unknown> | undefined;
    const hint = statusHint({
      ownerKind: kind,
      demandStatus: typeof linkedDemand?.status === "string" ? linkedDemand.status : null,
      replyKind: typeof linkedDemand?.replyKind === "string" ? linkedDemand.replyKind : null,
      parkChecked: Boolean(park),
    });
    return {
      productId: product.id,
      title: product.title,
      reference: product.reference,
      quantity: row.quantity,
      imageUrl: product.images[0] ? publicImageUrl(product.images[0].storageKey) : null,
      ownerKind: kind,
      ownerName,
      commune: String(asTerms(product.terms).commune ?? product.partnerProfile.commune ?? "—"),
      demandId: typeof prev?.demandId === "string" ? prev.demandId : typeof linkedDemand?.demandId === "string" ? linkedDemand.demandId : null,
      hint,
    };
  });

  const nextPayload = {
    ...payload,
    selection: {
      items,
      savedAt: new Date().toISOString(),
      reserved: false,
    },
    reserved: false,
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: nextPayload as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Sélection enregistrée (${items.length} article${items.length > 1 ? "s" : ""}). Aucun stock bloqué.`,
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
    metadata: { event: "SELECTION_SAVED", count: items.length, reserved: false },
    ip,
  });

  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function createAdminPartnerDemand(
  requestId: string,
  input: CreatePartnerDemandInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };

  const product = await prisma.product.findFirst({
    where: { id: input.productId, status: "APPROVED" },
    include: {
      partnerProfile: {
        select: {
          id: true,
          userId: true,
          organizationName: true,
          commercialName: true,
          status: true,
          commune: true,
        },
      },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });
  if (!product) return { ok: false as const, error: "Article introuvable ou non publié." };
  if (product.partnerProfile.status !== "APPROVED") {
    return { ok: false as const, error: "Le partenaire n’est pas encore approuvé." };
  }
  const ownerName = product.partnerProfile.commercialName || product.partnerProfile.organizationName;
  if (ownerKind(ownerName) === "onloutou") {
    return { ok: false as const, error: "Pour le parc ONLOUTOU, utilisez le contrôle interne, pas une demande partenaire." };
  }

  const start = new Date(`${input.startDate}T00:00:00.000Z`);
  const end = new Date(`${input.endDate}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return { ok: false as const, error: "Indiquez une période valide." };
  }

  const services = [input.delivery ? "Livraison" : null, input.pickup ? "Reprise" : null].filter(Boolean).join(" et ");
  const brief = [
    input.message.trim(),
    services ? `Services : ${services}.` : null,
    input.placeLabel?.trim() ? `Lieu : ${input.placeLabel.trim()}.` : null,
    input.replyByDate
      ? `Réponse souhaitée avant le ${input.replyByDate}${input.replyByTime ? ` à ${input.replyByTime}` : ""}.`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const reference = generateDemandReference();
  const demand = await prisma.partnerDemand.create({
    data: {
      reference,
      partnerProfileId: product.partnerProfileId,
      productId: product.id,
      status: "PENDING",
      requestedQty: input.quantity,
      startDate: start,
      endDate: end,
      commune: input.commune,
      deliveryRequested: input.delivery,
      brief,
      toClarify: ["Disponibilité", "Prix", "Livraison / reprise", "Conditions particulières"],
    },
  });

  await notifyPartner({
    userId: product.partnerProfile.userId,
    kind: "DEMAND",
    title: "Nouvelle demande de disponibilité",
    body: `${product.title} · ${input.quantity} · ${input.startDate} → ${input.endDate} · ${input.commune}`,
    href: `/espace-partenaire/demandes/${demand.id}`,
  });

  const payload = asRecord(request.payload);
  const selection = asRecord(payload.selection);
  const items = Array.isArray(selection.items) ? [...selection.items] : [];
  const updatedItems = items.map((raw) => {
    const row = asRecord(raw);
    if (row.productId !== product.id) return row;
    return {
      ...row,
      demandId: demand.id,
      hint: statusHint({ ownerKind: "partner", demandStatus: "PENDING" }),
    };
  });
  if (!updatedItems.some((row) => asRecord(row).productId === product.id)) {
    updatedItems.push({
      productId: product.id,
      title: product.title,
      reference: product.reference,
      quantity: input.quantity,
      imageUrl: product.images[0] ? publicImageUrl(product.images[0].storageKey) : null,
      ownerKind: "partner",
      ownerName,
      commune: input.commune,
      demandId: demand.id,
      hint: statusHint({ ownerKind: "partner", demandStatus: "PENDING" }),
    });
  }

  const partnerDemands = Array.isArray(payload.partnerDemands) ? [...payload.partnerDemands] : [];
  partnerDemands.push({
    demandId: demand.id,
    reference: demand.reference,
    productId: product.id,
    status: "PENDING",
    replyKind: null,
    createdAt: new Date().toISOString(),
  });

  const nextPayload = {
    ...payload,
    selection: { ...selection, items: updatedItems, reserved: false },
    partnerDemands,
    reserved: false,
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: nextPayload as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Demande ${demand.reference} transmise à ${ownerName}. Aucune location confirmée.`,
          actorId,
        },
      },
    },
  });

  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId,
    targetType: "PartnerDemand",
    targetId: demand.id,
    metadata: {
      event: "PARTNER_DEMAND_CREATED",
      requestId,
      productId: product.id,
      notifyEmail: Boolean(input.notifyEmail),
    },
    ip,
  });

  return {
    ok: true as const,
    demand: {
      id: demand.id,
      reference: demand.reference,
      status: demand.status,
      partnerName: ownerName,
      productTitle: product.title,
    },
    request: await getRequestDetail(requestId),
  };
}

export async function saveParkCheck(requestId: string, input: ParkCheckInput, actorId: string, ip?: string) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const product = await prisma.product.findFirst({
    where: { id: input.productId, status: "APPROVED" },
    include: { partnerProfile: { select: { commercialName: true, organizationName: true } } },
  });
  if (!product) return { ok: false as const, error: "Article introuvable." };
  const ownerName = product.partnerProfile.commercialName || product.partnerProfile.organizationName;
  if (ownerKind(ownerName) !== "onloutou") {
    return { ok: false as const, error: "Ce contrôle concerne uniquement le parc ONLOUTOU." };
  }

  const payload = asRecord(request.payload);
  const parkChecks = Array.isArray(payload.parkChecks) ? [...payload.parkChecks] : [];
  const nextCheck = {
    productId: product.id,
    checkedAt: new Date().toISOString(),
    note: input.note?.trim() || "Contrôle du parc enregistré. Disponibilité à confirmer, aucun article réservé.",
  };
  const idx = parkChecks.findIndex((row) => asRecord(row).productId === product.id);
  if (idx >= 0) parkChecks[idx] = nextCheck;
  else parkChecks.push(nextCheck);

  const selection = asRecord(payload.selection);
  const items = Array.isArray(selection.items)
    ? selection.items.map((raw) => {
        const row = asRecord(raw);
        if (row.productId !== product.id) return row;
        return { ...row, hint: statusHint({ ownerKind: "onloutou", parkChecked: true }) };
      })
    : [];

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: {
        ...payload,
        parkChecks,
        selection: { ...selection, items, reserved: false },
        reserved: false,
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Parc ONLOUTOU contrôlé pour ${product.title}. Aucun article réservé.`,
          actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: { event: "PARK_CHECK", productId: product.id },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function saveDossierProposal(requestId: string, input: SaveProposalInput, actorId: string, ip?: string) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };

  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  const wasSent = previous.status === "sent" || previous.sentToClient === true;
  const proposal = {
    ...previous,
    status: wasSent ? "sent" : "draft",
    reference: typeof previous.reference === "string" ? previous.reference : generateProposalReference(),
    version: typeof previous.version === "number" ? previous.version : 1,
    validUntil: input.validUntil || (typeof previous.validUntil === "string" ? previous.validUntil : defaultValidUntil()),
    lines: input.lines,
    deliveryFee: input.deliveryFee ?? "",
    pickupFee: input.pickupFee ?? "",
    deliveryIncluded: Boolean(input.deliveryIncluded),
    pickupIncluded: Boolean(input.pickupIncluded),
    paymentInitial: input.paymentInitial ?? "",
    balanceDue: input.balanceDue ?? "",
    deposit: input.deposit ?? "todo",
    billingValidated: input.billingValidated ?? Boolean(previous.billingValidated),
    billingEntity: previous.billingEntity ?? "todo",
    taxTreatment: previous.taxTreatment ?? "todo",
    reserved: false,
    sentToClient: Boolean(previous.sentToClient),
    activity: pushActivity(previous, "Brouillon de proposition enregistré", actorId),
    savedAt: new Date().toISOString(),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, proposal, reserved: false } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: "Brouillon de proposition enregistré. Aucun article réservé. Aucune offre envoyée au client.",
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
    metadata: { event: "PROPOSAL_DRAFT_SAVED", reserved: false, sentToClient: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function markProposalReady(requestId: string, actorId: string, ip?: string) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  if (!previous.lines || !Array.isArray(previous.lines) || previous.lines.length === 0) {
    return { ok: false as const, error: "Enregistrez d’abord un brouillon de proposition." };
  }
  if (!request.contactEmail && !request.contactPhone) {
    return { ok: false as const, error: "Vérifiez les coordonnées du client avant transmission." };
  }
  const proposal = {
    ...previous,
    status: previous.status === "sent" ? "sent" : "ready",
    reference: typeof previous.reference === "string" ? previous.reference : generateProposalReference(),
    version: typeof previous.version === "number" ? previous.version : 1,
    validUntil: typeof previous.validUntil === "string" ? previous.validUntil : defaultValidUntil(),
    billingValidated: true,
    reserved: false,
    activity: pushActivity(previous, "Proposition vérifiée avant transmission", actorId),
    verifiedAt: new Date().toISOString(),
  };
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: request.status === "RECEIVED" ? "QUOTED" : request.status,
      payload: { ...payload, proposal, reserved: false } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status === "RECEIVED" ? "QUOTED" : request.status,
          note: `Proposition ${String(proposal.reference)} vérifiée. Prête à transmettre. Aucun article réservé.`,
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
    metadata: { event: "PROPOSAL_READY", reference: proposal.reference },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function transmitProposal(
  requestId: string,
  input: TransmitProposalInput,
  actorId: string,
  env: Env,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  if (previous.status !== "ready" && previous.status !== "sent" && previous.status !== "draft") {
    return { ok: false as const, error: "Préparez et vérifiez la proposition avant transmission." };
  }
  if (!Array.isArray(previous.lines) || previous.lines.length === 0) {
    return { ok: false as const, error: "La proposition ne contient aucun article tarifé." };
  }

  const reference = typeof previous.reference === "string" ? previous.reference : generateProposalReference();
  const version = typeof previous.version === "number" ? previous.version : 1;
  const shareToken = typeof previous.shareToken === "string" ? previous.shareToken : generateToken(24);
  const shareUrl = `${env.APP_ORIGIN.replace(/\/$/, "")}/proposition/${shareToken}`;
  const emailTo = (input.email || request.contactEmail || "").trim();
  const subject =
    input.subject?.trim() ||
    `Votre proposition de location ONLOUTOU · ${reference}`;
  const message =
    input.message?.trim() ||
    `Bonjour ${request.contactName},\n\nVoici notre proposition de location ${reference}.\n\nCette proposition ne réserve aucun article.`;

  let emailSent = false;
  let emailNote = "Transmission enregistrée sans e-mail.";
  if (input.mode === "email") {
    if (!emailTo) return { ok: false as const, error: "Indiquez un e-mail destinataire." };
    const content = proposalOfferEmailText({
      contactName: request.contactName,
      subject,
      body: message,
      shareUrl,
      reference,
    });
    const sent = await sendMail(env, { to: emailTo, subject: content.subject, text: content.text });
    if (!sent.ok) {
      emailNote =
        sent.reason === "not_configured" ? mailUnavailableMessage() : mailFailedMessage();
    } else {
      emailSent = true;
      emailNote = `E-mail envoyé à ${emailTo}.`;
    }
  }

  const proposal = {
    ...previous,
    status: "sent",
    reference,
    version,
    shareToken,
    shareUrl,
    sentToClient: true,
    sentAt: new Date().toISOString(),
    sentChannel: input.mode,
    emailSent,
    emailTo: emailTo || null,
    subject,
    message,
    clientResponse: "waiting",
    reserved: false,
    activity: pushActivity(
      previous,
      input.mode === "email"
        ? emailSent
          ? `Proposition envoyée par e-mail à ${emailTo}`
          : `Tentative d’envoi e-mail : ${emailNote}`
        : "Lien sécurisé préparé pour partage",
      actorId,
    ),
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: "WAITING_CLIENT",
      payload: { ...payload, proposal, reserved: false } as Prisma.InputJsonValue,
      events: {
        create: {
          status: "WAITING_CLIENT",
          note: `${emailNote} Lien : ${shareUrl}. Aucun article réservé. Location non confirmée.`,
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
    metadata: {
      event: "PROPOSAL_TRANSMITTED",
      mode: input.mode,
      emailSent,
      reference,
      version,
      reserved: false,
    },
    ip,
  });

  return {
    ok: true as const,
    emailSent,
    emailNote,
    shareUrl,
    request: await getRequestDetail(requestId),
  };
}

export async function scheduleProposalFollowUp(
  requestId: string,
  input: FollowUpProposalInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  if (previous.status !== "sent") {
    return { ok: false as const, error: "Planifiez une relance après transmission de la proposition." };
  }
  const proposal = {
    ...previous,
    followUpDue: input.dueDate,
    followUpNote: input.note?.trim() || "Suivre la réponse du client",
    activity: pushActivity(previous, `Relance planifiée pour le ${input.dueDate}`, actorId),
  };
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: { ...payload, proposal } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Relance planifiée pour le ${input.dueDate}. ${proposal.followUpNote}`,
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
    metadata: { event: "PROPOSAL_FOLLOW_UP", dueDate: input.dueDate },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function createProposalVersion(requestId: string, actorId: string, ip?: string) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  if (!previous.lines) return { ok: false as const, error: "Aucune proposition à versionner." };
  const nextVersion = (typeof previous.version === "number" ? previous.version : 1) + 1;
  const proposal = {
    ...previous,
    status: "draft",
    version: nextVersion,
    reference: typeof previous.reference === "string" ? previous.reference : generateProposalReference(),
    sentToClient: false,
    sentAt: null,
    emailSent: false,
    clientResponse: null,
    shareToken: generateToken(24),
    reserved: false,
    activity: pushActivity(previous, `Nouvelle version ${nextVersion} créée`, actorId),
    savedAt: new Date().toISOString(),
  };
  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: "QUOTED",
      payload: { ...payload, proposal, reserved: false } as Prisma.InputJsonValue,
      events: {
        create: {
          status: "QUOTED",
          note: `Nouvelle version ${nextVersion} de ${String(proposal.reference)}. Aucun article réservé.`,
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
    metadata: { event: "PROPOSAL_NEW_VERSION", version: nextVersion },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function listRequestDemands(requestId: string) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const links = Array.isArray(payload.partnerDemands) ? payload.partnerDemands : [];
  const ids = links
    .map((row) => asRecord(row).demandId)
    .filter((id): id is string => typeof id === "string");
  if (ids.length === 0) return { ok: true as const, items: [] as const };

  const rows = await prisma.partnerDemand.findMany({
    where: { id: { in: ids } },
    include: {
      product: { select: { id: true, title: true, reference: true } },
      partnerProfile: { select: { commercialName: true, organizationName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    ok: true as const,
    items: rows.map((row) => ({
      id: row.id,
      reference: row.reference,
      status: row.status,
      replyKind: row.replyKind,
      productId: row.productId,
      productTitle: row.product.title,
      productReference: row.product.reference,
      partnerName: row.partnerProfile.commercialName || row.partnerProfile.organizationName,
      requestedQty: row.requestedQty,
      startDate: isoDate(row.startDate),
      endDate: isoDate(row.endDate),
      repliedAt: row.repliedAt?.toISOString() ?? null,
    })),
  };
}

function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/\s/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function proposalMoney(payload: Record<string, unknown>) {
  const proposal = asRecord(payload.proposal);
  const selection = selectionFromPayload(payload);
  const lines = Array.isArray(proposal.lines) ? proposal.lines.map((row) => asRecord(row)) : [];
  let articlesTotal = 0;
  for (const line of lines) {
    const item = selection.find((row) => row.productId === line.productId);
    const qty = Number(item?.quantity) || 1;
    articlesTotal += (parseAmount(line.clientPrice) ?? 0) * qty;
  }
  const delivery = proposal.deliveryIncluded ? 0 : parseAmount(proposal.deliveryFee) ?? 0;
  const pickup = proposal.pickupIncluded ? 0 : parseAmount(proposal.pickupFee) ?? 0;
  const grandTotal = articlesTotal + delivery + pickup;
  const paymentInitial = String(proposal.paymentInitial ?? "");
  let initialDue = 0;
  if (paymentInitial === "acompte_30") initialDue = Math.round(grandTotal * 0.3);
  else if (paymentInitial === "acompte_50") initialDue = Math.round(grandTotal * 0.5);
  else if (paymentInitial === "total") initialDue = grandTotal;
  const balanceDue = Math.max(0, grandTotal - initialDue);
  return {
    proposal,
    selection,
    grandTotal,
    initialDue,
    balanceDue,
    deposit: String(proposal.deposit ?? "todo"),
    paymentInitial,
    startDate: typeof payload.startDate === "string" ? payload.startDate : "",
    endDate: typeof payload.endDate === "string" ? payload.endDate : "",
  };
}

export async function recordClientAgreement(
  requestId: string,
  input: RecordAgreementInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  if (previous.status !== "sent" && previous.sentToClient !== true) {
    return { ok: false as const, error: "Transmettez d’abord la proposition au client." };
  }
  if (asRecord(payload.rental).status === "confirmed") {
    return { ok: false as const, error: "La location est déjà confirmée." };
  }

  const acceptedAt = input.acceptedAt?.trim() || new Date().toISOString();
  const version = Number(previous.version) || 1;
  const reference = String(previous.reference ?? "PROP —");
  const proposal = {
    ...previous,
    clientResponse: "accepted",
    acceptedAt,
    acceptedChannel: input.channel,
    acceptedVersion: version,
    activity: pushActivity(previous, `Accord client reçu sur ${reference} V${version}`, actorId),
  };
  const rental = {
    ...asRecord(payload.rental),
    agreementReceived: true,
    agreementAt: acceptedAt,
    agreementChannel: input.channel,
    agreementVersion: version,
    agreementReference: reference,
    status: "agreement",
    reserved: false,
    note: input.note?.trim() || null,
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      status: "WAITING_CLIENT",
      payload: {
        ...payload,
        proposal,
        rental,
        reserved: false,
        paymentRecorded: Boolean(asRecord(asRecord(payload.payment).initial).verified),
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: "WAITING_CLIENT",
          note: `Accord reçu sur ${reference} version ${version} (${input.channel}). Paiement et disponibilités restent à vérifier. Aucun article réservé.`,
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
    metadata: { event: "CLIENT_AGREEMENT", channel: input.channel, version, reserved: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function verifyInitialPayment(
  requestId: string,
  input: VerifyPaymentInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  const rental = asRecord(payload.rental);
  if (previous.clientResponse !== "accepted" && !rental.agreementReceived) {
    return { ok: false as const, error: "Enregistrez d’abord l’accord client sur la proposition." };
  }
  if (rental.status === "confirmed") {
    return { ok: false as const, error: "La location est déjà confirmée." };
  }
  const money = proposalMoney(payload);
  const amount = parseAmount(input.amount);
  if (amount === null || amount <= 0) {
    return { ok: false as const, error: "Indiquez le montant reçu." };
  }

  const verifiedAt = input.receivedAt?.trim() || new Date().toISOString();
  const payment = {
    ...asRecord(payload.payment),
    initial: {
      verified: true,
      amount,
      expectedAmount: money.initialDue || null,
      channel: input.channel,
      bankReference: input.bankReference?.trim() || null,
      documentLabel: input.documentLabel?.trim() || "Justificatif client",
      receivedAt: verifiedAt,
      verifiedAt: new Date().toISOString(),
      allocation: "Paiement initial",
      note: input.note?.trim() || null,
    },
  };
  const proposal = {
    ...previous,
    activity: pushActivity(previous, "Paiement initial vérifié et affecté au dossier", actorId),
  };
  const nextRental = {
    ...rental,
    status: "payment_verified",
    reserved: false,
  };

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      payload: {
        ...payload,
        proposal,
        payment,
        rental: nextRental,
        reserved: false,
        paymentRecorded: true,
      } as Prisma.InputJsonValue,
      events: {
        create: {
          status: request.status,
          note: `Paiement initial vérifié (${amount} FCFA) et affecté au dossier. Cette action ne confirme pas la location.`,
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
    metadata: { event: "PAYMENT_VERIFIED", amount, channel: input.channel, reserved: false },
    ip,
  });
  return { ok: true as const, request: await getRequestDetail(requestId) };
}

export async function confirmAndReserveRental(
  requestId: string,
  input: ConfirmRentalInput,
  actorId: string,
  ip?: string,
) {
  const request = await loadRequest(requestId);
  if (!request) return { ok: false as const, error: "Dossier introuvable." };
  const payload = asRecord(request.payload);
  const previous = asRecord(payload.proposal);
  const rental = asRecord(payload.rental);
  const payment = asRecord(asRecord(payload.payment).initial);
  if (previous.clientResponse !== "accepted" && !rental.agreementReceived) {
    return { ok: false as const, error: "L’accord client est requis avant confirmation." };
  }
  if (!payment.verified) {
    return { ok: false as const, error: "Vérifiez et affectez le paiement initial avant de confirmer." };
  }
  if (rental.status === "confirmed") {
    return { ok: false as const, error: "La location est déjà confirmée." };
  }

  const money = proposalMoney(payload);
  if (!money.startDate || !money.endDate) {
    return { ok: false as const, error: "Les dates de location sont manquantes." };
  }
  if (money.selection.length === 0) {
    return { ok: false as const, error: "Aucun article à réserver." };
  }

  const productIds = money.selection
    .map((row) => (typeof row.productId === "string" ? row.productId : null))
    .filter((id): id is string => Boolean(id));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { unavailabilities: true },
  });
  if (products.length !== productIds.length) {
    return { ok: false as const, error: "Un article de la sélection est introuvable." };
  }

  const availability: { productId: string; title: string; reference: string | null; available: number; required: number; ok: boolean }[] = [];
  for (const item of money.selection) {
    const productId = String(item.productId);
    const product = products.find((row) => row.id === productId)!;
    const total = Number(asTerms(product.terms).quantity ?? 0);
    const qty = Number(item.quantity) || 1;
    const stock = rangeAvailability(total, mapUnavails(product.unavailabilities), money.startDate, money.endDate);
    availability.push({
      productId,
      title: String(item.title ?? product.title),
      reference: typeof item.reference === "string" ? item.reference : product.reference,
      available: stock.available,
      required: qty,
      ok: stock.available >= qty,
    });
  }
  const blocking = availability.filter((row) => !row.ok);
  if (blocking.length > 0) {
    return {
      ok: false as const,
      error: `Disponibilité insuffisante : ${blocking.map((row) => `${row.title} (${row.available}/${row.required})`).join(", ")}.`,
    };
  }

  const reference = String(previous.reference ?? request.reference);
  const reservedAt = new Date().toISOString();
  const unavailabilityIds: string[] = [];

  await prisma.$transaction(async (tx) => {
    for (const item of money.selection) {
      const productId = String(item.productId);
      const qty = Number(item.quantity) || 1;
      const created = await tx.productUnavailability.create({
        data: {
          productId,
          startDate: new Date(`${money.startDate}T00:00:00.000Z`),
          endDate: new Date(`${money.endDate}T00:00:00.000Z`),
          quantity: qty,
          reason: `Réservation ${request.reference} · ${reference}`,
        },
      });
      unavailabilityIds.push(created.id);
    }

    const proposal = {
      ...previous,
      reserved: true,
      activity: pushActivity(previous, "Location confirmée · articles réservés", actorId),
    };
    const nextRental = {
      ...rental,
      status: "confirmed",
      reserved: true,
      reservedAt,
      confirmedAt: reservedAt,
      periodStart: money.startDate,
      periodEnd: money.endDate,
      unavailabilityIds,
      items: money.selection.map((row) => ({
        productId: row.productId,
        title: row.title,
        reference: row.reference ?? null,
        quantity: Number(row.quantity) || 1,
        ownerKind: row.ownerKind,
        ownerName: row.ownerName,
        imageUrl: row.imageUrl ?? null,
      })),
      tasks: [
        { id: "delivery", label: "Organiser la livraison", status: "todo" },
        { id: "park", label: "Préparer les articles du parc", status: "todo" },
        { id: "partner", label: "Coordonner la collecte partenaire", status: "todo" },
        { id: "client_message", label: "Préparer le message de confirmation client", status: "todo" },
      ],
      handoverBlocked: true,
      balanceDue: money.balanceDue,
      depositRequired: money.deposit === "required",
      note: input.note?.trim() || null,
      availabilityCheckedAt: reservedAt,
    };

    await tx.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: "WAITING_CLIENT",
        payload: {
          ...payload,
          proposal,
          rental: nextRental,
          selection: { ...asRecord(payload.selection), reserved: true },
          reserved: true,
          paymentRecorded: true,
        } as Prisma.InputJsonValue,
        events: {
          create: {
            status: "WAITING_CLIENT",
            note: `Location confirmée. ${money.selection.length} article(s) réservé(s) du ${money.startDate} au ${money.endDate}. Remise non autorisée tant que solde, dépôt et contrôles de départ ne sont pas remplis.`,
            actorId,
          },
        },
      },
    });
  });

  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "ServiceRequest",
    targetId: requestId,
    metadata: {
      event: "RENTAL_CONFIRMED",
      reserved: true,
      unavailabilityIds,
      periodStart: money.startDate,
      periodEnd: money.endDate,
    },
    ip,
  });

  return { ok: true as const, request: await getRequestDetail(requestId) };
}
