import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import type { productCreateSchema, productReviewSchema, productUpdateSchema } from "./schemas.js";
import type { z } from "zod";

const MAX_IMAGES = 4;

export async function getPartnerProfileForUser(userId: string) {
  return prisma.partnerProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true, displayName: true, phone: true } } },
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
  return prisma.product.findMany({
    where: { partnerProfileId: profile.id, status: { not: "ARCHIVED" } },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createProduct(userId: string, input: z.infer<typeof productCreateSchema>) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) {
    return { ok: false as const, error: "Profil partenaire requis." };
  }
  if (profile.status !== "APPROVED") {
    return { ok: false as const, error: "Catalogue disponible après validation de votre candidature." };
  }
  const product = await prisma.product.create({
    data: {
      partnerProfileId: profile.id,
      ownerUserId: userId,
      category: input.category,
      title: input.title,
      description: input.description,
      pricingMode: input.pricingMode,
      quantityHint: input.quantityHint,
      status: "DRAFT",
    },
  });
  await writeAuditLog({
    action: "PRODUCT_CREATED",
    actorId: userId,
    targetType: "Product",
    targetId: product.id,
  });
  return { ok: true as const, product };
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
  if (product.status === "APPROVED") {
    return { ok: false as const, error: "Désactivez ou dupliquez la fiche pour modifier une fiche publiée." };
  }
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(input.category ? { category: input.category } : {}),
      ...(input.title ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.pricingMode ? { pricingMode: input.pricingMode } : {}),
      ...(input.quantityHint !== undefined ? { quantityHint: input.quantityHint } : {}),
    },
  });
  await writeAuditLog({
    action: "PRODUCT_UPDATED",
    actorId: userId,
    targetType: "Product",
    targetId: updated.id,
  });
  return { ok: true as const, product: updated };
}

export async function submitProductForReview(userId: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, ownerUserId: userId },
    include: { images: true },
  });
  if (!product) return { ok: false as const, error: "Produit introuvable." };
  const updated = await prisma.product.update({
    where: { id: productId },
    data: { status: "PENDING_REVIEW" },
  });
  await writeAuditLog({
    action: "PRODUCT_SUBMITTED",
    actorId: userId,
    targetType: "Product",
    targetId: productId,
    metadata: { images: product.images.length },
  });
  return { ok: true as const, product: updated };
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
      images: { select: { id: true, sortOrder: true }, orderBy: { sortOrder: "asc" }, take: 4 },
    },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });
}

export async function submitPartnerProfile(userId: string, data: { organizationName?: string; zone?: string; description?: string }) {
  const profile = await prisma.partnerProfile.findUnique({ where: { userId } });
  if (!profile) return { ok: false as const, error: "Profil introuvable." };
  const updated = await prisma.partnerProfile.update({
    where: { id: profile.id },
    data: {
      organizationName: data.organizationName ?? profile.organizationName,
      zone: data.zone ?? profile.zone,
      description: data.description ?? profile.description,
      status: "SUBMITTED",
    },
  });
  await writeAuditLog({
    action: "APPLICATION_SUBMITTED",
    actorId: userId,
    targetType: "PartnerProfile",
    targetId: profile.id,
  });
  return { ok: true as const, profile: updated };
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
