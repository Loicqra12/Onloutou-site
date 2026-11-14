import { prisma } from "../../db.js";
import { publicImageUrl } from "../documents/storage.js";
import type { PartnerNotificationKind } from "@prisma/client";
import { pendingRevenueCount } from "../finance/service.js";

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export async function notifyPartner(input: {
  userId: string;
  kind: PartnerNotificationKind;
  title: string;
  body: string;
  href?: string | null;
}) {
  return prisma.partnerNotification.create({
    data: {
      userId: input.userId,
      kind: input.kind,
      title: input.title,
      body: input.body,
      href: input.href ?? null,
    },
  });
}

const locationInclude = {
  product: { include: { images: { orderBy: { sortOrder: "asc" as const }, take: 1 } } },
  demand: { select: { id: true, reference: true, brief: true, replyMessage: true, replyKind: true } },
  revenue: { select: { id: true, reference: true, status: true, netAmount: true } },
};

function serializeLocation(row: {
  id: string;
  reference: string;
  status: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  commune: string;
  delivery: string | null;
  fees: string | null;
  addressNote: string | null;
  onloutouNote: string | null;
  createdAt: Date;
  product: { id: string; title: string; familySlug: string | null; terms: unknown; images: { storageKey: string }[] };
  demand: { id: string; reference: string; brief: string | null; replyMessage: string | null; replyKind: string | null };
  revenue: { id: string; reference: string; status: string; netAmount: number } | null;
}) {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    quantity: row.quantity,
    startDate: isoDate(row.startDate),
    endDate: isoDate(row.endDate),
    commune: row.commune,
    delivery: row.delivery,
    fees: row.fees,
    addressNote: row.addressNote,
    onloutouNote: row.onloutouNote,
    createdAt: row.createdAt.toISOString(),
    product: {
      id: row.product.id,
      title: row.product.title,
      familySlug: row.product.familySlug,
      terms: row.product.terms,
      imageUrl: row.product.images[0] ? publicImageUrl(row.product.images[0].storageKey) : null,
    },
    demand: row.demand,
    revenue: row.revenue,
  };
}

export async function listPartnerLocations(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { items: [], counts: { all: 0, prepare: 0, progress: 0, returned: 0, done: 0 } };
  const rows = await prisma.partnerLocation.findMany({
    where: { partnerProfileId: profile.id },
    include: locationInclude,
    orderBy: { startDate: "asc" },
  });
  const items = rows.map(serializeLocation);
  const counts = {
    all: items.length,
    prepare: items.filter((row) => row.status === "TO_PREPARE").length,
    progress: items.filter((row) => row.status === "IN_PROGRESS").length,
    returned: items.filter((row) => row.status === "TO_RETURN" || row.status === "INCIDENT").length,
    done: items.filter((row) => row.status === "COMPLETED").length,
  };
  return { items, counts };
}

export async function getPartnerLocation(userId: string, id: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false as const, error: "Profil introuvable." };
  const row = await prisma.partnerLocation.findFirst({
    where: { id, partnerProfileId: profile.id },
    include: locationInclude,
  });
  if (!row) return { ok: false as const, error: "Location introuvable." };
  return { ok: true as const, location: serializeLocation(row) };
}

export async function listPartnerNotifications(userId: string) {
  const rows = await prisma.partnerNotification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  return {
    items: rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      body: row.body,
      href: row.href,
      readAt: row.readAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
    unread: rows.filter((row) => !row.readAt).length,
  };
}

export async function markNotificationsRead(userId: string, ids?: string[]) {
  await prisma.partnerNotification.updateMany({
    where: { userId, readAt: null, ...(ids?.length ? { id: { in: ids } } : {}) },
    data: { readAt: new Date() },
  });
  return listPartnerNotifications(userId);
}

export async function partnerInboxCounts(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) {
    return { pendingDemandCount: 0, pendingLocationCount: 0, unreadNotificationCount: 0, pendingRevenueCount: 0 };
  }
  const [pendingDemandCount, pendingLocationCount, unreadNotificationCount, pendingRevenueCountValue] = await Promise.all([
    prisma.partnerDemand.count({ where: { partnerProfileId: profile.id, status: "PENDING" } }),
    prisma.partnerLocation.count({
      where: { partnerProfileId: profile.id, status: { in: ["TO_PREPARE", "TO_RETURN", "INCIDENT"] } },
    }),
    prisma.partnerNotification.count({ where: { userId, readAt: null } }),
    pendingRevenueCount(userId),
  ]);
  return { pendingDemandCount, pendingLocationCount, unreadNotificationCount, pendingRevenueCount: pendingRevenueCountValue };
}
