import { prisma } from "../../db.js";
import { publicImageUrl } from "../documents/storage.js";
import { asTerms, computeLocationGross, DEFAULT_COMMISSION_BPS, splitCommission } from "./billing.js";

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function monthBounds(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { start, end };
}

const revenueInclude = {
  product: { include: { images: { orderBy: { sortOrder: "asc" as const }, take: 1 } } },
  location: true,
  payout: true,
};

function serializeRevenue(row: {
  id: string;
  reference: string;
  status: string;
  grossAmount: number;
  commissionBps: number;
  commissionAmount: number;
  netAmount: number;
  createdAt: Date;
  product: { id: string; title: string; familySlug: string | null; terms: unknown; images: { storageKey: string }[] };
  location: {
    id: string;
    reference: string;
    status: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
    commune: string;
  };
  payout: {
    id: string;
    reference: string;
    amount: number;
    method: string;
    paidAt: Date;
    note: string | null;
  } | null;
}) {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    grossAmount: row.grossAmount,
    commissionBps: row.commissionBps,
    commissionRate: row.commissionBps / 100,
    commissionAmount: row.commissionAmount,
    netAmount: row.netAmount,
    createdAt: row.createdAt.toISOString(),
    product: {
      id: row.product.id,
      title: row.product.title,
      familySlug: row.product.familySlug,
      terms: asTerms(row.product.terms),
      imageUrl: row.product.images[0] ? publicImageUrl(row.product.images[0].storageKey) : null,
    },
    location: {
      id: row.location.id,
      reference: row.location.reference,
      status: row.location.status,
      quantity: row.location.quantity,
      startDate: isoDate(row.location.startDate),
      endDate: isoDate(row.location.endDate),
      commune: row.location.commune,
    },
    payout: row.payout
      ? {
          id: row.payout.id,
          reference: row.payout.reference,
          amount: row.payout.amount,
          method: row.payout.method,
          paidAt: row.payout.paidAt.toISOString(),
          note: row.payout.note,
        }
      : null,
  };
}

function serializePayout(row: {
  id: string;
  reference: string;
  amount: number;
  method: string;
  paidAt: Date;
  note: string | null;
  revenues: { id: string; reference: string; netAmount: number; location: { reference: string }; product: { title: string } }[];
}) {
  return {
    id: row.id,
    reference: row.reference,
    amount: row.amount,
    method: row.method,
    paidAt: row.paidAt.toISOString(),
    note: row.note,
    revenues: row.revenues.map((item) => ({
      id: item.id,
      reference: item.reference,
      netAmount: item.netAmount,
      locationRef: item.location.reference,
      productTitle: item.product.title,
    })),
  };
}

async function nextReference(prefix: "REV" | "PAY"): Promise<string> {
  const rows =
    prefix === "REV"
      ? await prisma.partnerRevenue.findMany({ where: { reference: { startsWith: "REV-" } }, select: { reference: true } })
      : await prisma.partnerPayout.findMany({ where: { reference: { startsWith: "PAY-" } }, select: { reference: true } });
  let max = 0;
  for (const row of rows) {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(row.reference);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export async function createRevenueForCompletedLocation(locationId: string) {
  const location = await prisma.partnerLocation.findUnique({
    where: { id: locationId },
    include: { product: true, partnerProfile: true, revenue: true },
  });
  if (!location) return { ok: false as const, error: "Location introuvable." };
  if (location.status !== "COMPLETED") {
    return { ok: false as const, error: "Un revenu n’est créé que pour une location terminée." };
  }
  if (location.revenue) return { ok: true as const, revenueId: location.revenue.id, created: false };
  const terms = asTerms(location.product.terms);
  const grossAmount = computeLocationGross(terms, location.quantity, location.startDate, location.endDate);
  if (grossAmount <= 0) {
    return { ok: false as const, error: "Le tarif de la fiche ne permet pas de calculer un montant." };
  }
  const split = splitCommission(grossAmount, location.partnerProfile.commissionBps ?? DEFAULT_COMMISSION_BPS);
  const created = await prisma.partnerRevenue.create({
    data: {
      reference: await nextReference("REV"),
      partnerProfileId: location.partnerProfileId,
      locationId: location.id,
      productId: location.productId,
      grossAmount,
      commissionBps: split.commissionBps,
      commissionAmount: split.commissionAmount,
      netAmount: split.netAmount,
      status: "PENDING",
    },
  });
  return { ok: true as const, revenueId: created.id, created: true };
}

export async function listPartnerFinance(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) {
    return {
      items: [],
      payouts: [],
      counts: { all: 0, pending: 0, paid: 0 },
      totals: { pendingNet: 0, receivedThisMonth: 0, commissionThisMonth: 0, billedThisMonth: 0 },
    };
  }
  const { start, end } = monthBounds();
  const [rows, payouts] = await Promise.all([
    prisma.partnerRevenue.findMany({
      where: { partnerProfileId: profile.id },
      include: revenueInclude,
      orderBy: { createdAt: "desc" },
    }),
    prisma.partnerPayout.findMany({
      where: { partnerProfileId: profile.id },
      include: {
        revenues: {
          select: {
            id: true,
            reference: true,
            netAmount: true,
            location: { select: { reference: true } },
            product: { select: { title: true } },
          },
        },
      },
      orderBy: { paidAt: "desc" },
    }),
  ]);
  const items = rows.map(serializeRevenue);
  const pending = items.filter((row) => row.status === "PENDING");
  const paidThisMonth = items.filter(
    (row) => row.status === "PAID" && row.payout && row.payout.paidAt >= start.toISOString() && row.payout.paidAt < end.toISOString(),
  );
  const receivedThisMonth = payouts
    .filter((row) => row.paidAt >= start && row.paidAt < end)
    .reduce((sum, row) => sum + row.amount, 0);
  return {
    items,
    payouts: payouts.map(serializePayout),
    counts: {
      all: items.length,
      pending: pending.length,
      paid: items.filter((row) => row.status === "PAID").length,
    },
    totals: {
      pendingNet: pending.reduce((sum, row) => sum + row.netAmount, 0),
      receivedThisMonth,
      commissionThisMonth: paidThisMonth.reduce((sum, row) => sum + row.commissionAmount, 0),
      billedThisMonth: paidThisMonth.length,
    },
  };
}

export async function getPartnerRevenue(userId: string, id: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false as const, error: "Profil introuvable." };
  const row = await prisma.partnerRevenue.findFirst({
    where: { id, partnerProfileId: profile.id },
    include: revenueInclude,
  });
  if (!row) return { ok: false as const, error: "Revenu introuvable." };
  return { ok: true as const, revenue: serializeRevenue(row) };
}

export async function pendingRevenueCount(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return 0;
  return prisma.partnerRevenue.count({ where: { partnerProfileId: profile.id, status: "PENDING" } });
}
