import type { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { publicImageUrl } from "../documents/storage.js";
import { familyLabel, getFamily } from "../catalog/taxonomy.js";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function str(value: unknown) {
  return value == null ? "" : String(value).trim();
}

type Intervention = {
  id: string;
  reference: string;
  productId: string;
  stage: "signale" | "diagnostic" | "en_cours" | "validation" | "clos";
  priority: "P1" | "P2" | "P3";
  problem: string;
  assigneeLabel: string;
  immobilizedAt: string | null;
  siteLabel: string;
  checklist: Record<string, boolean>;
  notes: string;
  costNote: string;
  createdAt: string;
  updatedAt: string;
};

function readInterventions(corrections: unknown): Intervention[] {
  const root = asRecord(corrections);
  const board = asRecord(root.maintenance);
  const list = Array.isArray(board.interventions) ? board.interventions : [];
  return list.map((row) => {
    const item = asRecord(row);
    return {
      id: str(item.id),
      reference: str(item.reference),
      productId: str(item.productId),
      stage: (str(item.stage) as Intervention["stage"]) || "signale",
      priority: (str(item.priority) as Intervention["priority"]) || "P2",
      problem: str(item.problem),
      assigneeLabel: str(item.assigneeLabel),
      immobilizedAt: str(item.immobilizedAt) || null,
      siteLabel: str(item.siteLabel),
      checklist: asRecord(item.checklist) as Record<string, boolean>,
      notes: str(item.notes),
      costNote: str(item.costNote),
      createdAt: str(item.createdAt) || new Date().toISOString(),
      updatedAt: str(item.updatedAt) || new Date().toISOString(),
    };
  });
}

function writeInterventions(corrections: unknown, interventions: Intervention[]) {
  const root = asRecord(corrections);
  return {
    ...root,
    maintenance: {
      ...asRecord(root.maintenance),
      interventions,
    },
  };
}

function isOnloutouOwned(organizationName: string, reference: string | null, specs: Record<string, unknown>) {
  if (str(specs.ownerKind).toLowerCase() === "onloutou") return true;
  if (/onloutou/i.test(organizationName)) return true;
  if ((reference || "").toUpperCase().startsWith("ONL-")) return true;
  return false;
}

function availabilityOf(product: {
  status: string;
  unavailabilities: { startDate: Date; endDate: Date; reason: string | null }[];
  locations: { status: string }[];
  corrections: unknown;
}) {
  const openLoc = product.locations.some((l) => ["TO_PREPARE", "IN_PROGRESS", "TO_RETURN"].includes(l.status));
  if (openLoc) return "rented";
  const interventions = readInterventions(product.corrections).filter((i) => i.stage !== "clos");
  if (interventions.length) return "maintenance";
  const today = new Date();
  const blocked = product.unavailabilities.some((u) => u.startDate <= today && u.endDate >= today);
  if (blocked) return "unavailable";
  if (product.status === "APPROVED") return "available";
  if (product.status === "PENDING_REVIEW") return "pending";
  if (product.status === "DISABLED") return "paused";
  return "unavailable";
}

function publicationOf(status: string) {
  if (status === "APPROVED") return "published";
  if (status === "PENDING_REVIEW") return "pending";
  if (status === "DISABLED") return "paused";
  if (status === "REJECTED") return "rejected";
  if (status === "DRAFT") return "draft";
  return status.toLowerCase();
}

function nextAction(availability: string, publication: string) {
  if (publication === "pending") return "Valider la fiche";
  if (publication === "paused") return "Reprendre la publication";
  if (availability === "maintenance") return "Suivre la maintenance";
  if (availability === "rented") return "Suivre le retour";
  return "Aucune";
}

const productListInclude = {
  partnerProfile: { select: { id: true, organizationName: true, commune: true, zone: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
  unavailabilities: true,
  locations: { select: { status: true, commune: true, reference: true }, orderBy: { updatedAt: "desc" as const }, take: 5 },
} satisfies Prisma.ProductInclude;

function serializeListItem(
  product: Prisma.ProductGetPayload<{ include: typeof productListInclude }>,
) {
  const specs = asRecord(product.specs);
  const ownerName = product.partnerProfile.organizationName;
  const onl = isOnloutouOwned(ownerName, product.reference, specs);
  const availability = availabilityOf(product);
  const publication = publicationOf(product.status);
  const image = product.images[0];
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    reference: product.reference || `ART-${product.id.slice(-4).toUpperCase()}`,
    familySlug: product.familySlug,
    familyLabel: familyLabel(product.familySlug) || product.category,
    categorySlug: product.categorySlug,
    ownerName,
    ownerKind: onl ? "onloutou" : "partner",
    location: product.partnerProfile.commune || product.partnerProfile.zone || product.locations[0]?.commune || "—",
    publication,
    availability,
    nextAction: nextAction(availability, publication),
    status: product.status,
    condition: product.condition,
    imageUrl: image ? publicImageUrl(image.storageKey) : null,
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function listArticles(query: {
  q?: string;
  owner?: string;
  family?: string;
  publication?: string;
  availability?: string;
  view?: string;
  take?: number;
  skip?: number;
}) {
  const take = Math.min(query.take ?? 40, 100);
  const skip = query.skip ?? 0;
  const statusFilter: Prisma.ProductWhereInput["status"] =
    query.publication === "published"
      ? "APPROVED"
      : query.publication === "pending"
        ? "PENDING_REVIEW"
        : query.publication === "paused"
          ? "DISABLED"
          : query.publication === "draft"
            ? "DRAFT"
            : { not: "ARCHIVED" };

  const where: Prisma.ProductWhereInput = {
    status: statusFilter,
    ...(query.family ? { familySlug: query.family } : {}),
    ...(query.q?.trim()
      ? {
          OR: [
            { title: { contains: query.q.trim(), mode: "insensitive" } },
            { reference: { contains: query.q.trim(), mode: "insensitive" } },
            { description: { contains: query.q.trim(), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total, approved, pending, allForCounts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productListInclude,
      orderBy: { updatedAt: "desc" },
      take: 200,
      skip: 0,
    }),
    prisma.product.count({ where }),
    prisma.product.count({ where: { status: "APPROVED" } }),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: productListInclude,
      take: 300,
    }),
  ]);

  let items = rows.map(serializeListItem);
  if (query.owner === "onloutou") items = items.filter((i) => i.ownerKind === "onloutou");
  if (query.owner === "partner") items = items.filter((i) => i.ownerKind === "partner");
  if (query.availability && query.availability !== "all") {
    items = items.filter((i) => i.availability === query.availability);
  }
  if (query.view === "disponibles") items = items.filter((i) => i.availability === "available");
  if (query.view === "location") items = items.filter((i) => i.availability === "rented");
  if (query.view === "maintenance") items = items.filter((i) => i.availability === "maintenance");
  if (query.view === "partenaires") items = items.filter((i) => i.publication === "pending");

  const counted = allForCounts.map(serializeListItem);
  const page = items.slice(skip, skip + take);

  return {
    items: page,
    total: items.length,
    rawTotal: total,
    counts: {
      actifs: approved,
      enLocation: counted.filter((i) => i.availability === "rented").length,
      aControler: counted.filter((i) => i.availability === "maintenance" || i.availability === "unavailable").length,
      enAttente: pending,
    },
  };
}

export async function getArticleDetail(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      partnerProfile: true,
      images: { orderBy: { sortOrder: "asc" } },
      unavailabilities: { orderBy: { startDate: "asc" } },
      locations: { orderBy: { updatedAt: "desc" }, take: 10 },
      reviewer: { select: { displayName: true, email: true } },
    },
  });
  if (!product) return { ok: false as const, error: "Article introuvable." };

  const specs = asRecord(product.specs);
  const terms = asRecord(product.terms);
  const listShape = serializeListItem({
    ...product,
    partnerProfile: {
      id: product.partnerProfile.id,
      organizationName: product.partnerProfile.organizationName,
      commune: product.partnerProfile.commune,
      zone: product.partnerProfile.zone,
    },
    images: product.images.slice(0, 1),
    locations: product.locations,
  });

  const dossiers = await prisma.serviceRequest.findMany({
    where: { status: { notIn: ["CANCELLED"] } },
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: { id: true, reference: true, status: true, payload: true, updatedAt: true },
  });
  const linked = dossiers
    .filter((d) => {
      const selection = asRecord(asRecord(d.payload).selection);
      const items = Array.isArray(selection.items) ? selection.items : [];
      return items.some((row) => asRecord(row).productId === product.id);
    })
    .slice(0, 8)
    .map((d) => ({
      id: d.id,
      reference: d.reference,
      status: d.status,
      updatedAt: d.updatedAt.toISOString(),
    }));

  const interventions = readInterventions(product.corrections).filter((i) => i.productId === product.id || !i.productId);
  const family = getFamily(product.familySlug);

  return {
    ok: true as const,
    article: {
      ...listShape,
      description: product.description,
      condition: product.condition,
      quantityHint: product.quantityHint,
      specs,
      terms,
      publishedAt: product.publishedAt?.toISOString() ?? null,
      createdAt: product.createdAt.toISOString(),
      reviewedAt: product.reviewedAt?.toISOString() ?? null,
      reviewer: product.reviewer?.displayName || product.reviewer?.email || null,
      rejectionReason: product.rejectionReason,
      images: product.images.map((img) => ({
        id: img.id,
        url: publicImageUrl(img.storageKey),
        sortOrder: img.sortOrder,
      })),
      unavailabilities: product.unavailabilities.map((u) => ({
        id: u.id,
        startDate: u.startDate.toISOString().slice(0, 10),
        endDate: u.endDate.toISOString().slice(0, 10),
        quantity: u.quantity,
        reason: u.reason,
      })),
      locations: product.locations.map((l) => ({
        id: l.id,
        reference: l.reference,
        status: l.status,
        commune: l.commune,
      })),
      dossiers: linked,
      interventions: interventions.filter((i) => i.stage !== "clos").slice(0, 5),
      familyCategories: family?.categories.map((c) => c.label) ?? [],
      ownershipNote: "Le propriétaire ne peut pas être modifié silencieusement. Tout changement doit être journalisé.",
      acquisitionNote: "Données d’acquisition : à compléter (non stockées encore).",
    },
  };
}

export async function setArticlePublication(
  actorId: string,
  productId: string,
  action: "pause" | "resume" | "approve" | "reject",
  reason?: string,
  ip?: string,
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: "Article introuvable." };

  let status = product.status;
  if (action === "pause") {
    if (product.status !== "APPROVED") return { ok: false as const, error: "Seule une fiche publiée peut être mise en pause." };
    status = "DISABLED";
  } else if (action === "resume") {
    if (product.status !== "DISABLED") return { ok: false as const, error: "Cette fiche n’est pas en pause." };
    status = "APPROVED";
  } else if (action === "approve") {
    status = "APPROVED";
  } else if (action === "reject") {
    if (!reason?.trim()) return { ok: false as const, error: "Motif de refus requis." };
    status = "REJECTED";
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      status,
      publishedAt: status === "APPROVED" ? product.publishedAt ?? new Date() : product.publishedAt,
      rejectionReason: action === "reject" ? reason!.trim() : null,
      reviewedAt: action === "approve" || action === "reject" ? new Date() : product.reviewedAt,
      reviewedById: action === "approve" || action === "reject" ? actorId : product.reviewedById,
    },
  });
  await writeAuditLog({
    action: action === "approve" ? "PRODUCT_APPROVED" : action === "reject" ? "PRODUCT_REJECTED" : "PRODUCT_UPDATED",
    actorId,
    targetType: "Product",
    targetId: productId,
    metadata: { event: `ARTICLE_${action.toUpperCase()}`, reason },
    ip,
  });
  return getArticleDetail(productId);
}

export async function listParcOnloutou(query: { q?: string; family?: string }) {
  const result = await listArticles({
    q: query.q,
    family: query.family,
    owner: "onloutou",
    take: 100,
  });
  const items = result.items;
  return {
    lead: "Biens détenus et exploités directement par ONLOUTOU.",
    items,
    total: items.length,
    counts: {
      articles: items.length,
      disponibles: items.filter((i) => i.availability === "available").length,
      loues: items.filter((i) => i.availability === "rented").length,
      maintenance: items.filter((i) => i.availability === "maintenance").length,
      aControler: items.filter((i) => i.availability === "unavailable" || i.nextAction.includes("contrôl")).length,
    },
    alerts: {
      controlesEnRetard: 0,
      documentsExpirant: 0,
      retoursAControler: items.filter((i) => i.availability === "rented").length,
    },
    tasks: [
      ...(items.filter((i) => i.availability === "maintenance").length
        ? [{ label: `Suivre ${items.filter((i) => i.availability === "maintenance").length} maintenance(s)`, level: "priority" }]
        : []),
      ...(items.filter((i) => i.availability === "rented").length
        ? [{ label: `Surveiller ${items.filter((i) => i.availability === "rented").length} retour(s) de location`, level: "todo" }]
        : []),
    ],
    byFamily: Object.entries(
      items.reduce<Record<string, number>>((acc, item) => {
        acc[item.familyLabel] = (acc[item.familyLabel] || 0) + 1;
        return acc;
      }, {}),
    ).map(([label, count]) => ({ label, count })),
    bySite: Object.entries(
      items.reduce<Record<string, number>>((acc, item) => {
        acc[item.location || "Autre"] = (acc[item.location || "Autre"] || 0) + 1;
        return acc;
      }, {}),
    ).map(([label, count]) => ({ label, count })),
    emptyNote:
      items.length === 0
        ? "Aucun bien marqué ONLOUTOU pour l’instant. Les articles catalogue sont surtout partenaires ; un bien propre nécessite ownerKind=onloutou, référence ONL-… ou partenaire ONLOUTOU."
        : null,
  };
}

export async function listMaintenance() {
  const products = await prisma.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    include: {
      partnerProfile: { select: { organizationName: true, commune: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: 200,
  });

  const cards: (Intervention & {
    productTitle: string;
    productReference: string | null;
    ownerName: string;
    imageUrl: string | null;
  })[] = [];

  for (const product of products) {
    for (const intervention of readInterventions(product.corrections)) {
      if (intervention.stage === "clos") continue;
      cards.push({
        ...intervention,
        productId: product.id,
        productTitle: product.title,
        productReference: product.reference,
        ownerName: product.partnerProfile.organizationName,
        imageUrl: product.images[0] ? publicImageUrl(product.images[0].storageKey) : null,
        siteLabel: intervention.siteLabel || product.partnerProfile.commune || "—",
      });
    }
  }

  const columns = {
    signale: cards.filter((c) => c.stage === "signale"),
    diagnostic: cards.filter((c) => c.stage === "diagnostic"),
    en_cours: cards.filter((c) => c.stage === "en_cours"),
    validation: cards.filter((c) => c.stage === "validation"),
  };

  return {
    counts: {
      enMaintenance: cards.length,
      diagnostic: columns.diagnostic.length,
      pieces: cards.filter((c) => c.checklist.pieces === false).length,
      prets: columns.validation.length,
    },
    columns,
    items: cards,
  };
}

export async function createMaintenance(
  actorId: string,
  input: {
    productId: string;
    problem: string;
    priority?: "P1" | "P2" | "P3";
    assigneeLabel?: string;
    siteLabel?: string;
  },
  ip?: string,
) {
  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product) return { ok: false as const, error: "Article introuvable." };
  if (!input.problem.trim()) return { ok: false as const, error: "Décrivez le problème." };

  const interventions = readInterventions(product.corrections);
  const now = new Date().toISOString();
  const created: Intervention = {
    id: `mnt_${Date.now().toString(36)}`,
    reference: `INT-${String(interventions.length + 1).padStart(3, "0")}`,
    productId: product.id,
    stage: "signale",
    priority: input.priority || "P2",
    problem: input.problem.trim(),
    assigneeLabel: input.assigneeLabel?.trim() || "",
    immobilizedAt: now,
    siteLabel: input.siteLabel?.trim() || "",
    checklist: {
      diagnostic: false,
      pieces: false,
      travaux: false,
      controle: false,
      remise: false,
    },
    notes: "",
    costNote: "",
    createdAt: now,
    updatedAt: now,
  };
  interventions.unshift(created);
  await prisma.product.update({
    where: { id: product.id },
    data: { corrections: writeInterventions(product.corrections, interventions) as Prisma.InputJsonValue },
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId,
    targetType: "Product",
    targetId: product.id,
    metadata: { event: "MAINTENANCE_CREATED", reference: created.reference },
    ip,
  });
  return { ok: true as const, intervention: created };
}

export async function updateMaintenance(
  actorId: string,
  productId: string,
  interventionId: string,
  input: Partial<{
    stage: Intervention["stage"];
    priority: Intervention["priority"];
    problem: string;
    assigneeLabel: string;
    siteLabel: string;
    notes: string;
    costNote: string;
    checklist: Record<string, boolean>;
  }>,
  ip?: string,
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: "Article introuvable." };
  const interventions = readInterventions(product.corrections);
  const index = interventions.findIndex((i) => i.id === interventionId);
  if (index < 0) return { ok: false as const, error: "Intervention introuvable." };

  const current = interventions[index]!;
  const next: Intervention = {
    ...current,
    stage: input.stage || current.stage,
    priority: input.priority || current.priority,
    problem: input.problem?.trim() || current.problem,
    assigneeLabel: input.assigneeLabel ?? current.assigneeLabel,
    siteLabel: input.siteLabel ?? current.siteLabel,
    notes: input.notes ?? current.notes,
    costNote: input.costNote ?? current.costNote,
    checklist: { ...current.checklist, ...(input.checklist || {}) },
    updatedAt: new Date().toISOString(),
  };
  interventions[index] = next;
  await prisma.product.update({
    where: { id: productId },
    data: { corrections: writeInterventions(product.corrections, interventions) as Prisma.InputJsonValue },
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId,
    targetType: "Product",
    targetId: productId,
    metadata: { event: "MAINTENANCE_UPDATED", reference: next.reference, stage: next.stage },
    ip,
  });
  return { ok: true as const, intervention: next };
}
