import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { publicImageUrl } from "../documents/storage.js";
import { rangeAvailability, type ArticleTerms, type UnavailabilityInput } from "../catalog/article-validation.js";
import type { demandReplySchema } from "./schemas.js";
import type { z } from "zod";
import type { PartnerDemandReply, PartnerDemandStatus } from "@prisma/client";

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function asTerms(value: unknown): ArticleTerms {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as ArticleTerms;
  return {};
}

function mapUnavails(rows: { startDate: Date; endDate: Date; quantity: number; reason?: string | null }[]): UnavailabilityInput[] {
  return rows.map((row) => ({
    startDate: isoDate(row.startDate),
    endDate: isoDate(row.endDate),
    quantity: row.quantity,
    reason: row.reason,
  }));
}

function clarifyList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function serializeDemand(demand: {
  id: string;
  reference: string;
  status: PartnerDemandStatus;
  requestedQty: number;
  startDate: Date;
  endDate: Date;
  commune: string;
  deliveryRequested: boolean;
  brief: string | null;
  toClarify: unknown;
  replyKind: PartnerDemandReply | null;
  replyQty: number | null;
  replyStart: Date | null;
  replyEnd: Date | null;
  replyDelivery: string | null;
  replyFees: string | null;
  replyMessage: string | null;
  repliedAt: Date | null;
  outcome?: string | null;
  outcomeNote?: string | null;
  createdAt: Date;
  location?: { id: string; reference: string; status: string } | null;
  product: {
    id: string;
    title: string;
    familySlug: string | null;
    terms: unknown;
    images: { id: string; sortOrder: number; storageKey: string }[];
    unavailabilities: { startDate: Date; endDate: Date; quantity: number; reason: string | null }[];
  };
  partnerProfile: { commercialName: string | null; organizationName: string; commune: string | null };
}) {
  const terms = asTerms(demand.product.terms);
  const total = Number(terms.quantity ?? 0);
  const periods = mapUnavails(demand.product.unavailabilities);
  const stock = rangeAvailability(total, periods, isoDate(demand.startDate), isoDate(demand.endDate));
  return {
    id: demand.id,
    reference: demand.reference,
    status: demand.status,
    requestedQty: demand.requestedQty,
    startDate: isoDate(demand.startDate),
    endDate: isoDate(demand.endDate),
    commune: demand.commune,
    deliveryRequested: demand.deliveryRequested,
    brief: demand.brief,
    toClarify: clarifyList(demand.toClarify),
    replyKind: demand.replyKind,
    replyQty: demand.replyQty,
    replyStart: demand.replyStart ? isoDate(demand.replyStart) : null,
    replyEnd: demand.replyEnd ? isoDate(demand.replyEnd) : null,
    replyDelivery: demand.replyDelivery,
    replyFees: demand.replyFees,
    replyMessage: demand.replyMessage,
    repliedAt: demand.repliedAt?.toISOString() ?? null,
    outcome: demand.outcome ?? "WAITING",
    outcomeNote: demand.outcomeNote ?? null,
    location: demand.location ?? null,
    createdAt: demand.createdAt.toISOString(),
    stock,
    product: {
      id: demand.product.id,
      title: demand.product.title,
      familySlug: demand.product.familySlug,
      terms,
      imageUrl: demand.product.images[0] ? publicImageUrl(demand.product.images[0].storageKey) : null,
      unavailabilities: periods,
    },
    partner: {
      name: demand.partnerProfile.commercialName || demand.partnerProfile.organizationName,
      commune: demand.partnerProfile.commune,
    },
  };
}

const demandInclude = {
  product: {
    include: {
      images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
      unavailabilities: true,
    },
  },
  partnerProfile: { select: { commercialName: true, organizationName: true, commune: true } },
  location: { select: { id: true, reference: true, status: true } },
};

export async function listPartnerDemands(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { items: [], counts: { all: 0, pending: 0, answered: 0, closed: 0 } };
  const rows = await prisma.partnerDemand.findMany({
    where: { partnerProfileId: profile.id },
    include: demandInclude,
    orderBy: { createdAt: "desc" },
  });
  const items = rows.map(serializeDemand);
  const counts = {
    all: items.length,
    pending: items.filter((row) => row.status === "PENDING").length,
    answered: items.filter((row) => row.status === "ANSWERED").length,
    closed: items.filter((row) => row.status === "CLOSED").length,
  };
  return { items, counts };
}

export async function getPartnerDemand(userId: string, id: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false as const, error: "Profil introuvable." };
  const demand = await prisma.partnerDemand.findFirst({
    where: { id, partnerProfileId: profile.id },
    include: demandInclude,
  });
  if (!demand) return { ok: false as const, error: "Demande introuvable." };
  return { ok: true as const, demand: serializeDemand(demand) };
}

export async function respondPartnerDemand(userId: string, id: string, input: z.infer<typeof demandReplySchema>) {
  const current = await getPartnerDemand(userId, id);
  if (!current.ok) return current;
  const outcome = current.demand.outcome ?? "WAITING";
  const locked = current.demand.status === "CLOSED" || current.demand.location || ["SELECTED", "DECLINED", "CANCELLED", "EXPIRED"].includes(outcome);
  if (locked) {
    return { ok: false as const, error: "Cette réponse ne peut plus être modifiée : ONLOUTOU a déjà tranché, ou une location est confirmée." };
  }
  if (current.demand.status !== "PENDING" && current.demand.status !== "ANSWERED") {
    return { ok: false as const, error: "Cette demande a déjà une réponse." };
  }
  const editing = current.demand.status === "ANSWERED";
  const qty = input.kind === "UNAVAILABLE" ? 0 : Number(input.quantity ?? current.demand.requestedQty);
  if (input.kind !== "UNAVAILABLE" && qty < 1) {
    return { ok: false as const, error: "Indiquez la quantité proposée." };
  }
  if (input.kind === "AVAILABLE" && qty !== current.demand.requestedQty) {
    return { ok: false as const, error: "Pour une disponibilité totale, la quantité doit correspondre à la demande." };
  }
  if (input.kind === "ADJUSTMENT" && qty >= current.demand.requestedQty) {
    return { ok: false as const, error: "Un ajustement propose une quantité inférieure à la demande." };
  }
  const updated = await prisma.partnerDemand.update({
    where: { id },
    data: {
      status: "ANSWERED",
      replyKind: input.kind,
      replyQty: qty,
      replyStart: input.startDate ? new Date(`${input.startDate}T00:00:00.000Z`) : new Date(`${current.demand.startDate}T00:00:00.000Z`),
      replyEnd: input.endDate ? new Date(`${input.endDate}T00:00:00.000Z`) : new Date(`${current.demand.endDate}T00:00:00.000Z`),
      replyDelivery: input.delivery ?? null,
      replyFees: input.fees ?? null,
      replyMessage: input.message.trim(),
      repliedAt: new Date(),
    },
    include: demandInclude,
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId: userId,
    targetType: "PartnerDemand",
    targetId: id,
    metadata: { kind: input.kind, quantity: qty, event: editing ? "PARTNER_DEMAND_REPLY_EDITED" : "PARTNER_DEMAND_REPLIED" },
  });
  return { ok: true as const, demand: serializeDemand(updated) };
}
