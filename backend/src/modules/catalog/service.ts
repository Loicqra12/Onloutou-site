import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import type { productCreateSchema, productReviewSchema, productUpdateSchema } from "./schemas.js";
import type { z } from "zod";
import { publicImageUrl } from "../documents/storage.js";
import { getCategory, getFamily, type ArticleFamily } from "./taxonomy.js";
import { validateUnavailabilities, type ArticleTerms, type UnavailabilityInput } from "./article-validation.js";
import type { Prisma, ProductCategory } from "@prisma/client";

const MAX_IMAGES = 4;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { images: true; unavailabilities: true };
}>;

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function asTerms(value: unknown): ArticleTerms {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as ArticleTerms;
  return {};
}

function asSpecs(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, string>;
  return {};
}

function mapUnavailabilities(rows: { startDate: Date; endDate: Date; quantity: number; id?: string }[]): UnavailabilityInput[] {
  return rows.map((row) => ({
    startDate: isoDate(row.startDate),
    endDate: isoDate(row.endDate),
    quantity: row.quantity,
  }));
}

export function serializePartnerProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    reference: product.reference,
    title: product.title,
    description: product.description,
    status: product.status,
    rejectionReason: product.rejectionReason,
    category: product.category,
    familySlug: product.familySlug,
    categorySlug: product.categorySlug,
    categoryRequest: product.categoryRequest,
    condition: product.condition,
    specs: asSpecs(product.specs),
    terms: asTerms(product.terms),
    corrections: product.corrections ?? {},
    quantityHint: product.quantityHint,
    publishedAt: product.publishedAt?.toISOString() ?? null,
    images: product.images.map((image) => ({
      id: image.id,
      sortOrder: image.sortOrder,
      url: publicImageUrl(image.storageKey),
    })),
    unavailabilities: product.unavailabilities.map((row) => ({
      id: row.id,
      startDate: isoDate(row.startDate),
      endDate: isoDate(row.endDate),
      quantity: row.quantity,
      reason: row.reason,
    })),
  };
}

const productInclude = { images: { orderBy: { sortOrder: "asc" as const } }, unavailabilities: { orderBy: { startDate: "asc" as const } } };

async function loadPartnerProduct(productId: string, userId?: string, includeArchived = false) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      ...(userId ? { ownerUserId: userId } : {}),
      ...(includeArchived ? {} : { status: { not: "ARCHIVED" } }),
    },
    include: productInclude,
  });
}

async function productHasOpenLocation(productId: string) {
  return prisma.partnerLocation.findFirst({
    where: { productId, status: { in: ["TO_PREPARE", "IN_PROGRESS", "TO_RETURN", "INCIDENT"] } },
    select: { id: true },
  });
}

async function nextArticleReference(): Promise<string> {
  const rows = await prisma.product.findMany({
    where: { reference: { startsWith: "ART-" } },
    select: { reference: true },
  });
  let max = 0;
  for (const row of rows) {
    const match = /^ART-(\d+)$/.exec(row.reference ?? "");
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `ART-${String(max + 1).padStart(3, "0")}`;
}

function categoryFromFamily(familySlug?: string | null, fallback: ProductCategory = "OTHER"): ProductCategory {
  const family = getFamily(familySlug) as ArticleFamily | undefined;
  return (family?.productCategory ?? fallback) as ProductCategory;
}

function normalizeTitle(title?: string | null): string {
  const trimmed = title?.trim() ?? "";
  return trimmed || "Nouvelle fiche";
}

function preparedUnavailabilities(periods: UnavailabilityInput[] | undefined): UnavailabilityInput[] {
  if (!periods) return [];
  return periods.filter((row) => row.startDate?.trim() && row.endDate?.trim());
}

function checkUnavailabilityOrError(terms: ArticleTerms | undefined, periods: UnavailabilityInput[]): string | null {
  if (periods.length === 0) return null;
  const total = Number(terms?.quantity ?? 0);
  if (!total) {
    return "Indiquez la quantité totale avant d’ajouter une indisponibilité.";
  }
  const result = validateUnavailabilities(total, periods);
  return result.ok ? null : result.error;
}

export function submitReadinessError(product: ProductWithRelations): string | null {
  const title = product.title.trim();
  if (title.length < 3 || title === "Nouvelle fiche") {
    return "Indiquez le nom de l’article.";
  }
  if (!product.familySlug || !product.categorySlug || !getCategory(product.familySlug, product.categorySlug)) {
    return "Le classement (famille et catégorie) doit être résolu avant l’envoi.";
  }
  if (!product.condition?.trim()) return "Indiquez l’état de l’article.";
  if (!product.description?.trim()) return "Ajoutez une description.";
  if (product.images.length < 1) return "Ajoutez au moins une photo principale.";
  const terms = asTerms(product.terms);
  const qty = Number(terms.quantity ?? 0);
  if (terms.rentalMode === "LOT" && (!terms.lotCount || !terms.piecesPerLot)) {
    return "Précisez le nombre de lots et le nombre de pièces par lot.";
  }
  if (!qty || !terms.rentalMode || terms.priceAmount == null || !terms.pricePeriod || !terms.minDuration || !terms.depositKind || !terms.commune || !(terms.pickup || terms.delivery)) {
    return "Complétez les conditions de location avant l’envoi.";
  }
  if (terms.delivery && (!terms.deliveryZone?.trim() || !terms.deliveryFees?.trim())) {
    return "Précisez la zone et les frais de livraison.";
  }
  const periods = mapUnavailabilities(product.unavailabilities);
  const unavailError = checkUnavailabilityOrError(terms, periods);
  return unavailError;
}

export async function getPartnerProfileForUser(userId: string) {
  return prisma.partnerProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true, displayName: true, phone: true, emailVerifiedAt: true, termsAcceptedAt: true } } },
  });
}

export async function assertPartnerApproved(userId: string) {
  const profile = await getPartnerProfileForUser(userId);
  if (!profile) return { ok: false as const, error: "Profil partenaire introuvable." };
  if (profile.status !== "APPROVED") {
    return { ok: false as const, error: "Compte en attente de validation.", status: profile.status };
  }
  return { ok: true as const, profile };
}

export async function listPartnerProducts(userId: string) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return [];
  const products = await prisma.product.findMany({
    where: { partnerProfileId: profile.id },
    include: productInclude,
    orderBy: { updatedAt: "desc" },
  });
  return products.map(serializePartnerProduct);
}

export async function getPartnerProduct(userId: string, productId: string) {
  const product = await loadPartnerProduct(productId, userId, true);
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  return { ok: true as const, product: serializePartnerProduct(product) };
}

export async function createProduct(userId: string, input: z.infer<typeof productCreateSchema>) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) {
    return { ok: false as const, error: "Profil partenaire requis." };
  }
  if (profile.status === "REJECTED") {
    return { ok: false as const, error: "Votre candidature a été refusée. Vous ne pouvez pas ajouter d’article pour le moment." };
  }
  const familySlug = input.familySlug ?? null;
  const category = input.category ?? categoryFromFamily(familySlug);
  const product = await prisma.product.create({
    data: {
      partnerProfileId: profile.id,
      ownerUserId: userId,
      category,
      title: normalizeTitle(input.title),
      description: input.description ?? null,
      pricingMode: input.pricingMode ?? "ON_QUOTE",
      quantityHint: input.quantityHint ?? null,
      status: "DRAFT",
      reference: await nextArticleReference(),
      familySlug,
      categorySlug: input.categorySlug ?? null,
      categoryRequest: input.categoryRequest ?? null,
      condition: input.condition ?? null,
      specs: (input.specs ?? {}) as Prisma.InputJsonValue,
      terms: (input.terms ?? {}) as Prisma.InputJsonValue,
    },
    include: productInclude,
  });
  await writeAuditLog({
    action: "PRODUCT_CREATED",
    actorId: userId,
    targetType: "Product",
    targetId: product.id,
  });
  return { ok: true as const, product: serializePartnerProduct(product) };
}

export async function updateProduct(
  userId: string,
  productId: string,
  input: z.infer<typeof productUpdateSchema>,
) {
  const product = await prisma.product.findFirst({
    where: { id: productId, ownerUserId: userId, status: { not: "ARCHIVED" } },
  });
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (product.status === "APPROVED" || product.status === "PENDING_REVIEW") {
    return { ok: false as const, error: product.status === "APPROVED"
      ? "Désactivez ou dupliquez la fiche pour modifier une fiche publiée."
      : "Cette fiche est en vérification. Attendez la décision ou une demande de correction." };
  }
  const familySlug = input.familySlug === undefined ? product.familySlug : input.familySlug;
  const terms = input.terms === undefined ? asTerms(product.terms) : input.terms;
  const periods = input.unavailabilities === undefined ? undefined : preparedUnavailabilities(input.unavailabilities);
  if (periods) {
    const unavailError = checkUnavailabilityOrError(terms, periods);
    if (unavailError) return { ok: false as const, error: unavailError };
  }
  const category = input.category ?? (familySlug ? categoryFromFamily(familySlug, product.category) : undefined);
  const quantityHint = input.quantityHint ?? (terms?.quantity ?? undefined);
  const updated = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        ...(category ? { category } : {}),
        ...(input.title !== undefined ? { title: normalizeTitle(input.title) } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.pricingMode ? { pricingMode: input.pricingMode } : {}),
        ...(quantityHint !== undefined ? { quantityHint } : {}),
        ...(input.familySlug !== undefined ? { familySlug: input.familySlug } : {}),
        ...(input.categorySlug !== undefined ? { categorySlug: input.categorySlug } : {}),
        ...(input.categoryRequest !== undefined ? { categoryRequest: input.categoryRequest } : {}),
        ...(input.condition !== undefined ? { condition: input.condition } : {}),
        ...(input.specs !== undefined ? { specs: input.specs as Prisma.InputJsonValue } : {}),
        ...(input.terms !== undefined ? { terms: input.terms as Prisma.InputJsonValue } : {}),
      },
    });
    if (periods) {
      await tx.productUnavailability.deleteMany({ where: { productId } });
      if (periods.length > 0) {
        await tx.productUnavailability.createMany({
          data: periods.map((row) => ({
            productId,
            startDate: new Date(`${row.startDate}T00:00:00.000Z`),
            endDate: new Date(`${row.endDate}T00:00:00.000Z`),
            quantity: row.quantity,
            reason: row.reason?.trim() || null,
          })),
        });
      }
    }
    return tx.product.findFirstOrThrow({ where: { id: productId }, include: productInclude });
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId: userId,
    targetType: "Product",
    targetId: updated.id,
  });
  return { ok: true as const, product: serializePartnerProduct(updated) };
}

export async function submitProductForReview(userId: string, productId: string) {
  const approved = await assertPartnerApproved(userId);
  if (!approved.ok) return approved;
  const product = await loadPartnerProduct(productId, userId);
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (product.status !== "DRAFT" && product.status !== "REJECTED") {
    return { ok: false as const, error: "Seules les fiches en brouillon ou à corriger peuvent être envoyées." };
  }
  const readiness = submitReadinessError(product);
  if (readiness) return { ok: false as const, error: readiness };
  const updated = await prisma.product.update({
    where: { id: productId },
    data: { status: "PENDING_REVIEW", rejectionReason: null },
    include: productInclude,
  });
  await writeAuditLog({
    action: "PRODUCT_SUBMITTED",
    actorId: userId,
    targetType: "Product",
    targetId: productId,
    metadata: { images: product.images.length, reference: product.reference },
  });
  return { ok: true as const, product: serializePartnerProduct(updated) };
}

export async function reviewProduct(
  reviewerId: string,
  productId: string,
  input: z.infer<typeof productReviewSchema>,
  ip?: string,
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  const status =
    input.decision === "APPROVED"
      ? "APPROVED"
      : input.decision === "REJECTED"
        ? "REJECTED"
        : input.decision === "DISABLED"
          ? "DISABLED"
          : "ARCHIVED";
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      status,
      rejectionReason: input.reason,
      corrections: (input.corrections ?? (status === "REJECTED" ? product.corrections : {})) as Prisma.InputJsonValue,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
      publishedAt: status === "APPROVED" ? new Date() : product.publishedAt,
    },
  });
  await writeAuditLog({
    action:
      status === "APPROVED"
        ? "PRODUCT_APPROVED"
        : status === "REJECTED"
          ? "PRODUCT_REJECTED"
          : "PRODUCT_ARCHIVED",
    actorId: reviewerId,
    targetType: "Product",
    targetId: productId,
    ip,
  });
  return { ok: true as const, product: updated };
}

export async function attachProductImage(input: {
  userId: string;
  productId: string;
  storageKey: string;
  mimeType: string;
  byteSize: number;
}) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, ownerUserId: input.userId },
    include: { images: true },
  });
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (product.images.length >= MAX_IMAGES) {
    return { ok: false as const, error: "Quatre images maximum par fiche." };
  }
  const image = await prisma.productImage.create({
    data: {
      productId: product.id,
      storageKey: input.storageKey,
      mimeType: input.mimeType,
      byteSize: input.byteSize,
      sortOrder: product.images.length,
      isPublic: true,
    },
  });
  return { ok: true as const, image };
}

export async function replaceProductImage(input: {
  userId: string;
  productId: string;
  imageId: string;
  storageKey: string;
  mimeType: string;
  byteSize: number;
}) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, ownerUserId: input.userId },
    include: { images: true },
  });
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  const current = product.images.find((row) => row.id === input.imageId);
  if (!current) return { ok: false as const, error: "Photo introuvable." };
  const image = await prisma.productImage.update({
    where: { id: current.id },
    data: { storageKey: input.storageKey, mimeType: input.mimeType, byteSize: input.byteSize },
  });
  return { ok: true as const, image };
}

export async function updateProductAvailability(
  userId: string,
  productId: string,
  periods: UnavailabilityInput[],
) {
  const product = await loadPartnerProduct(productId, userId);
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (product.status !== "APPROVED" && product.status !== "DISABLED") {
    return { ok: false as const, error: "La disponibilité se gère sur une fiche publiée." };
  }
  const terms = asTerms(product.terms);
  const prepared = preparedUnavailabilities(periods);
  const unavailError = checkUnavailabilityOrError(terms, prepared);
  if (unavailError) return { ok: false as const, error: unavailError };
  const updated = await prisma.$transaction(async (tx) => {
    await tx.productUnavailability.deleteMany({ where: { productId } });
    if (prepared.length > 0) {
      await tx.productUnavailability.createMany({
        data: prepared.map((row) => ({
          productId,
          startDate: new Date(`${row.startDate}T00:00:00.000Z`),
          endDate: new Date(`${row.endDate}T00:00:00.000Z`),
          quantity: row.quantity,
          reason: row.reason?.trim() || null,
        })),
      });
    }
    return tx.product.findFirstOrThrow({ where: { id: productId }, include: productInclude });
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId: userId,
    targetType: "Product",
    targetId: productId,
    metadata: { event: "PRODUCT_AVAILABILITY_UPDATED" },
  });
  return { ok: true as const, product: serializePartnerProduct(updated) };
}

export async function setProductPaused(userId: string, productId: string, paused: boolean) {
  const product = await loadPartnerProduct(productId, userId);
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (paused && product.status !== "APPROVED") {
    return { ok: false as const, error: "Seule une fiche publiée peut être mise en pause." };
  }
  if (!paused && product.status !== "DISABLED") {
    return { ok: false as const, error: "Cette fiche n’est pas en pause." };
  }
  const updated = await prisma.product.update({
    where: { id: productId },
    data: { status: paused ? "DISABLED" : "APPROVED" },
    include: productInclude,
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId: userId,
    targetType: "Product",
    targetId: productId,
    metadata: { event: paused ? "PRODUCT_PAUSED" : "PRODUCT_RESUMED" },
  });
  return { ok: true as const, product: serializePartnerProduct(updated) };
}

export async function archivePartnerProduct(userId: string, productId: string) {
  const product = await loadPartnerProduct(productId, userId);
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (product.status === "PENDING_REVIEW") {
    return { ok: false as const, error: "Cette fiche est en vérification. Attendez la décision avant de l’archiver." };
  }
  if (product.status === "DRAFT") {
    return { ok: false as const, error: "Un brouillon se supprime, il ne s’archive pas." };
  }
  if (await productHasOpenLocation(productId)) {
    return { ok: false as const, error: "Une location est encore en cours sur cet article. Archivez-le après la reprise." };
  }
  const updated = await prisma.product.update({
    where: { id: productId },
    data: { status: "ARCHIVED" },
    include: productInclude,
  });
  await writeAuditLog({
    action: "PRODUCT_ARCHIVED",
    actorId: userId,
    targetType: "Product",
    targetId: productId,
  });
  return { ok: true as const, product: serializePartnerProduct(updated) };
}

export async function deletePartnerProduct(userId: string, productId: string) {
  const product = await loadPartnerProduct(productId, userId, true);
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  if (product.status === "PENDING_REVIEW") {
    return { ok: false as const, error: "Cette fiche est en vérification. Elle ne peut pas être supprimée." };
  }
  if (product.status !== "DRAFT" && !(product.status === "REJECTED" && !product.publishedAt)) {
    return { ok: false as const, error: "Seuls un brouillon ou une fiche jamais publiée peuvent être supprimés. Archivez les autres." };
  }
  const [demands, locations] = await Promise.all([
    prisma.partnerDemand.count({ where: { productId } }),
    prisma.partnerLocation.count({ where: { productId } }),
  ]);
  if (demands > 0 || locations > 0) {
    return { ok: false as const, error: "Cette fiche a déjà une demande ou une location. Archivez-la plutôt que de la supprimer." };
  }
  await prisma.product.delete({ where: { id: productId } });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId: userId,
    targetType: "Product",
    targetId: productId,
    metadata: { event: "PRODUCT_DELETED", reference: product.reference },
  });
  return { ok: true as const };
}

export async function listPublicCatalog() {
  // Champs publics uniquement : pas d'identifiant interne (propriétaire, relecteur), ni motif de refus, ni organisation.
  return prisma.product.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      category: true,
      title: true,
      description: true,
      pricingMode: true,
      publishedAt: true,
      images: { select: { id: true, sortOrder: true, storageKey: true }, orderBy: { sortOrder: "asc" }, take: 4 },
    },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });
}

type PartnerProfileFields = {
  organizationName?: string;
  zone?: string;
  description?: string;
  personKind?: "INDIVIDUAL" | "PROFESSIONAL";
  phone?: string;
  commune?: string;
  commercialName?: string | null;
  legalName?: string | null;
  displayName?: string;
};

function profileWriteData(profile: {
  organizationName: string;
  zone: string | null;
  description: string | null;
  personKind: "INDIVIDUAL" | "PROFESSIONAL" | null;
  commune: string | null;
  commercialName: string | null;
  legalName: string | null;
}, data: PartnerProfileFields) {
  const commercialName = data.commercialName === undefined ? profile.commercialName : data.commercialName;
  const legalName = data.legalName === undefined ? profile.legalName : data.legalName;
  const description = data.description === undefined ? profile.description : (data.description.trim() || null);
  return {
    organizationName: data.organizationName ?? profile.organizationName,
    zone: data.zone ?? data.commune ?? profile.zone,
    description,
    personKind: data.personKind ?? profile.personKind,
    commune: data.commune ?? profile.commune,
    commercialName,
    legalName,
  };
}

export async function updatePartnerProfile(userId: string, data: PartnerProfileFields) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false as const, error: "Profil introuvable." };
  if (profile.status === "APPROVED") {
    return { ok: false as const, error: "Le profil validé se met à jour avec l’équipe ONLOUTOU." };
  }
  const userData: { phone?: string; displayName?: string } = {};
  if (data.phone !== undefined) userData.phone = data.phone;
  if (data.displayName !== undefined) userData.displayName = data.displayName;
  if (Object.keys(userData).length > 0) {
    await prisma.user.update({ where: { id: userId }, data: userData });
  }
  await prisma.partnerProfile.update({
    where: { id: profile.id },
    data: profileWriteData(profile, data),
  });
  return { ok: true as const, profile: await getPartnerProfileForUser(userId) };
}

export async function submitPartnerProfile(userId: string, data: PartnerProfileFields & { personKind: "INDIVIDUAL" | "PROFESSIONAL"; phone: string; commune: string }) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false as const, error: "Profil introuvable." };
  if (profile.status === "APPROVED") {
    return { ok: false as const, error: "Ce profil est déjà approuvé." };
  }
  if (!data.description?.trim()) {
    return { ok: false as const, error: "Décrivez votre activité en quelques mots." };
  }
  const userData: { phone?: string; displayName?: string } = { phone: data.phone };
  if (data.displayName !== undefined) userData.displayName = data.displayName;
  await prisma.user.update({ where: { id: userId }, data: userData });
  await prisma.partnerProfile.update({
    where: { id: profile.id },
    data: {
      ...profileWriteData(profile, data),
      status: "SUBMITTED",
    },
  });
  await writeAuditLog({
    action: "APPLICATION_SUBMITTED",
    actorId: userId,
    targetType: "PartnerProfile",
    targetId: profile.id,
  });
  return { ok: true as const, profile: await getPartnerProfileForUser(userId) };
}

export async function reviewPartnerApplication(
  reviewerId: string,
  profileId: string,
  decision: "APPROVED" | "REJECTED",
  reason?: string,
  ip?: string,
) {
  const profile = await prisma.partnerProfile.findUnique({ where: { id: profileId }, include: { user: true } });
  if (!profile) return { ok: false as const, error: "Candidature introuvable." };
  const updated = await prisma.partnerProfile.update({
    where: { id: profileId },
    data: {
      status: decision,
      rejectionReason: decision === "REJECTED" ? reason : null,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
    },
  });
  await writeAuditLog({
    action: decision === "APPROVED" ? "APPLICATION_APPROVED" : "APPLICATION_REJECTED",
    actorId: reviewerId,
    targetType: "PartnerProfile",
    targetId: profileId,
    metadata: { reason },
    ip,
  });
  return { ok: true as const, profile: updated };
}

export async function reviewDriverApplication(
  reviewerId: string,
  profileId: string,
  decision: "APPROVED" | "REJECTED",
  reason?: string,
  ip?: string,
) {
  const profile = await prisma.driverProfile.findUnique({ where: { id: profileId } });
  if (!profile) return { ok: false as const, error: "Candidature introuvable." };
  const updated = await prisma.driverProfile.update({
    where: { id: profileId },
    data: {
      status: decision,
      rejectionReason: decision === "REJECTED" ? reason : null,
      reviewedAt: new Date(),
      reviewedById: reviewerId,
    },
  });
  await writeAuditLog({
    action: decision === "APPROVED" ? "APPLICATION_APPROVED" : "APPLICATION_REJECTED",
    actorId: reviewerId,
    targetType: "DriverProfile",
    targetId: profileId,
    metadata: { reason },
    ip,
  });
  return { ok: true as const, profile: updated };
}
