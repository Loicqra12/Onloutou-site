import type { Prisma } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { reviewDriverApplication, reviewPartnerApplication } from "../catalog/service.js";

function maskEmail(email: string | null | undefined) {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const keep = Math.min(2, local.length);
  return `${local.slice(0, keep)}•••@${domain}`;
}

function maskPhone(phone: string | null | undefined) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "•••";
  return `${phone.slice(0, Math.min(4, phone.length))} •• •• ${digits.slice(-2)}`;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function listClients(query: { q?: string; role?: string; status?: string; take?: number; skip?: number }) {
  const take = Math.min(query.take ?? 40, 100);
  const skip = query.skip ?? 0;
  const q = query.q?.trim();

  const where: Prisma.UserWhereInput = {
    role:
      query.role === "CLIENT" || query.role === "PARTNER" || query.role === "DRIVER"
        ? query.role
        : { in: ["CLIENT", "PARTNER", "DRIVER"] },
    ...(query.status === "ACTIVE" || query.status === "SUSPENDED" || query.status === "PENDING_EMAIL"
      ? { status: query.status }
      : {}),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { displayName: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, total, newThisMonth, pendingVerify, activeDossiers] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        partnerProfile: { select: { id: true, status: true, organizationName: true, commune: true } },
        driverProfile: { select: { id: true, status: true, fullName: true, zone: true } },
      },
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    }),
    prisma.user.count({ where }),
    prisma.user.count({
      where: { role: { in: ["CLIENT", "PARTNER", "DRIVER"] }, createdAt: { gte: startOfMonth() } },
    }),
    prisma.user.count({
      where: {
        role: { in: ["CLIENT", "PARTNER", "DRIVER"] },
        OR: [{ status: "PENDING_EMAIL" }, { emailVerifiedAt: null }],
      },
    }),
    prisma.serviceRequest.count({ where: { status: { notIn: ["CLOSED", "CANCELLED"] } } }),
  ]);

  const emails = rows.map((u) => u.email.toLowerCase());
  const dossierGroups = emails.length
    ? await prisma.serviceRequest.groupBy({
        by: ["contactEmail"],
        where: { contactEmail: { in: emails, mode: "insensitive" } },
        _count: { _all: true },
      })
    : [];
  const dossierByEmail = new Map(
    dossierGroups.map((g) => [String(g.contactEmail || "").toLowerCase(), g._count._all]),
  );

  const items = rows.map((u) => {
    const roles: string[] = [];
    if (u.role === "CLIENT" || dossierByEmail.has(u.email.toLowerCase())) roles.push("CLIENT");
    if (u.partnerProfile) roles.push("PARTNER");
    if (u.driverProfile) roles.push("DRIVER");
    if (!roles.length) roles.push(u.role);
    return {
      id: u.id,
      displayName: u.displayName || u.partnerProfile?.organizationName || u.driverProfile?.fullName || u.email.split("@")[0],
      email: u.email,
      emailMasked: maskEmail(u.email),
      phone: u.phone,
      phoneMasked: maskPhone(u.phone),
      role: u.role,
      roles: [...new Set(roles)],
      status: u.status,
      verified: Boolean(u.emailVerifiedAt),
      commune: u.partnerProfile?.commune || u.driverProfile?.zone || null,
      dossierCount: dossierByEmail.get(u.email.toLowerCase()) ?? 0,
      lastActivityAt: u.lastLoginAt?.toISOString() || u.updatedAt.toISOString(),
      createdAt: u.createdAt.toISOString(),
      partnerStatus: u.partnerProfile?.status ?? null,
      driverStatus: u.driverProfile?.status ?? null,
    };
  });

  return {
    items,
    total,
    counts: {
      users: total,
      newThisMonth,
      activeDossiers,
      toVerify: pendingVerify,
    },
  };
}

export async function getClientDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      partnerProfile: true,
      driverProfile: true,
    },
  });
  if (!user || user.role === "ADMIN" || user.role === "STAFF") {
    return { ok: false as const, error: "Utilisateur introuvable." };
  }

  const dossiers = await prisma.serviceRequest.findMany({
    where: {
      OR: [
        { contactEmail: { equals: user.email, mode: "insensitive" } },
        { submitterUserId: user.id },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 12,
    select: {
      id: true,
      reference: true,
      status: true,
      type: true,
      organization: true,
      updatedAt: true,
      createdAt: true,
      assignee: { select: { displayName: true, email: true } },
    },
  });

  const activity = await prisma.auditLog.findMany({
    where: {
      OR: [{ actorId: user.id }, { targetId: user.id }, { targetId: user.partnerProfile?.id }, { targetId: user.driverProfile?.id }],
    },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: { id: true, action: true, createdAt: true, metadata: true, targetType: true },
  });

  const roles: string[] = [];
  if (user.role === "CLIENT" || dossiers.length) roles.push("CLIENT");
  if (user.partnerProfile) roles.push("PARTNER");
  if (user.driverProfile) roles.push("DRIVER");
  if (!roles.length) roles.push(user.role);

  return {
    ok: true as const,
    user: {
      id: user.id,
      displayName: user.displayName || user.partnerProfile?.organizationName || user.driverProfile?.fullName || user.email.split("@")[0],
      email: user.email,
      emailMasked: maskEmail(user.email),
      phone: user.phone,
      phoneMasked: maskPhone(user.phone),
      role: user.role,
      roles: [...new Set(roles)],
      status: user.status,
      verified: Boolean(user.emailVerifiedAt),
      termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      commune: user.partnerProfile?.commune || user.driverProfile?.zone || null,
      personKind: user.partnerProfile?.personKind ?? null,
      partnerProfile: user.partnerProfile
        ? {
            id: user.partnerProfile.id,
            organizationName: user.partnerProfile.organizationName,
            status: user.partnerProfile.status,
          }
        : null,
      driverProfile: user.driverProfile
        ? {
            id: user.driverProfile.id,
            fullName: user.driverProfile.fullName,
            status: user.driverProfile.status,
          }
        : null,
      dossiers: dossiers.map((d) => ({
        id: d.id,
        reference: d.reference,
        status: d.status,
        type: d.type,
        organization: d.organization,
        updatedAt: d.updatedAt.toISOString(),
        assignee: d.assignee?.displayName || d.assignee?.email || null,
      })),
      activity: activity.map((a) => ({
        id: a.id,
        action: a.action,
        targetType: a.targetType,
        createdAt: a.createdAt.toISOString(),
      })),
      consents: {
        email: Boolean(user.emailVerifiedAt || user.termsAcceptedAt),
        phone: Boolean(user.phone),
        whatsapp: false,
        retention: "3 ans après la dernière activité (politique à confirmer)",
      },
    },
  };
}

export async function listPartners(query: { q?: string; status?: string; take?: number; skip?: number }) {
  const take = Math.min(query.take ?? 40, 100);
  const skip = query.skip ?? 0;
  const q = query.q?.trim();
  const where = {
    ...(query.status ? { status: query.status as never } : { status: { not: "DRAFT" as const } }),
    ...(q
      ? {
          OR: [
            { organizationName: { contains: q, mode: "insensitive" as const } },
            { commercialName: { contains: q, mode: "insensitive" as const } },
            { commune: { contains: q, mode: "insensitive" as const } },
            { user: { email: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [rows, total, toVerify, approved] = await Promise.all([
    prisma.partnerProfile.findMany({
      where,
      include: {
        user: { select: { email: true, displayName: true, phone: true, status: true } },
        products: { select: { id: true, status: true, title: true, publishedAt: true } },
        documents: { where: { deletedAt: null }, select: { id: true, kind: true, createdAt: true, scanStatus: true } },
        _count: { select: { products: true, documents: true } },
      },
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    }),
    prisma.partnerProfile.count({ where }),
    prisma.partnerProfile.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    prisma.partnerProfile.count({ where: { status: "APPROVED" } }),
  ]);

  const published = await prisma.product.count({
    where: { status: "APPROVED", publishedAt: { not: null } },
  });

  return {
    items: rows.map((p) => ({
      id: p.id,
      organizationName: p.organizationName,
      commercialName: p.commercialName,
      partnerType: p.partnerType,
      personKind: p.personKind,
      commune: p.commune,
      zone: p.zone,
      status: p.status,
      emailMasked: maskEmail(p.user.email),
      phoneMasked: maskPhone(p.user.phone),
      articlesPublished: p.products.filter((x) => x.status === "APPROVED" && x.publishedAt).length,
      articlesTotal: p._count.products,
      documentsCount: p._count.documents,
      updatedAt: p.updatedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
    total,
    counts: {
      active: approved,
      toVerify,
      documentsExpiring: 0,
      articlesPublished: published,
    },
  };
}

export async function getPartnerDetail(profileId: string) {
  const profile = await prisma.partnerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: { select: { id: true, email: true, displayName: true, phone: true, status: true, createdAt: true } },
      products: {
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: {
          id: true,
          title: true,
          status: true,
          reference: true,
          publishedAt: true,
          updatedAt: true,
        },
      },
      documents: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, kind: true, mimeType: true, createdAt: true, scanStatus: true, retainUntil: true },
      },
    },
  });
  if (!profile) return { ok: false as const, error: "Partenaire introuvable." };

  const activeDossiers = await prisma.serviceRequest.count({
    where: {
      status: { notIn: ["CLOSED", "CANCELLED"] },
      OR: [
        { contactEmail: { equals: profile.user.email, mode: "insensitive" } },
        { organization: { contains: profile.organizationName, mode: "insensitive" } },
      ],
    },
  });

  const history = await prisma.auditLog.findMany({
    where: { targetId: profile.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, action: true, createdAt: true, metadata: true },
  });

  const steps = [
    { key: "identity", label: "Identité", done: Boolean(profile.organizationName) },
    { key: "contact", label: "Coordonnées", done: Boolean(profile.user.email || profile.user.phone) },
    { key: "documents", label: "Documents", done: profile.documents.length > 0 },
    { key: "review", label: "Entretien", done: Boolean(profile.reviewedAt) || profile.status === "APPROVED" },
    { key: "decision", label: "Décision", done: profile.status === "APPROVED" || profile.status === "REJECTED" },
  ];

  return {
    ok: true as const,
    partner: {
      id: profile.id,
      organizationName: profile.organizationName,
      commercialName: profile.commercialName,
      legalName: profile.legalName,
      partnerType: profile.partnerType,
      personKind: profile.personKind,
      commune: profile.commune,
      zone: profile.zone,
      description: profile.description,
      status: profile.status,
      rejectionReason: profile.rejectionReason,
      reviewedAt: profile.reviewedAt?.toISOString() ?? null,
      email: profile.user.email,
      emailMasked: maskEmail(profile.user.email),
      phoneMasked: maskPhone(profile.user.phone),
      userStatus: profile.user.status,
      createdAt: profile.createdAt.toISOString(),
      activeDossiers,
      steps,
      products: profile.products.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        reference: p.reference,
        paused: p.status === "APPROVED" && !p.publishedAt,
        updatedAt: p.updatedAt.toISOString(),
      })),
      documents: profile.documents.map((d) => ({
        id: d.id,
        kind: d.kind,
        mimeType: d.mimeType,
        scanStatus: d.scanStatus,
        createdAt: d.createdAt.toISOString(),
        retainUntil: d.retainUntil?.toISOString() ?? null,
      })),
      history: history.map((h) => ({
        id: h.id,
        action: h.action,
        createdAt: h.createdAt.toISOString(),
      })),
      note: "L’approbation du profil ne publie pas automatiquement les articles.",
    },
  };
}

export async function reviewPartner(
  reviewerId: string,
  profileId: string,
  decision: "APPROVED" | "REJECTED",
  reason: string | undefined,
  ip?: string,
) {
  return reviewPartnerApplication(reviewerId, profileId, decision, reason, ip);
}

export async function listDrivers(query: { q?: string; status?: string; take?: number; skip?: number }) {
  const take = Math.min(query.take ?? 40, 100);
  const skip = query.skip ?? 0;
  const q = query.q?.trim();
  const where = {
    ...(query.status ? { status: query.status as never } : { status: { not: "DRAFT" as const } }),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { zone: { contains: q, mode: "insensitive" as const } },
            { vehicleInfo: { contains: q, mode: "insensitive" as const } },
            { user: { email: { contains: q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [rows, total, approved, pendingDocs] = await Promise.all([
    prisma.driverProfile.findMany({
      where,
      include: {
        user: { select: { email: true, displayName: true, phone: true, status: true, lastLoginAt: true } },
        documents: { where: { deletedAt: null }, select: { id: true, kind: true, createdAt: true, scanStatus: true } },
        _count: { select: { documents: true } },
      },
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    }),
    prisma.driverProfile.count({ where }),
    prisma.driverProfile.count({ where: { status: "APPROVED" } }),
    prisma.driverProfile.count({
      where: {
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED"] },
        documents: { none: {} },
      },
    }),
  ]);

  const availableNow = rows.filter((d) => d.status === "APPROVED" && d.user.status === "ACTIVE").length;

  return {
    items: rows.map((d) => ({
      id: d.id,
      fullName: d.fullName,
      zone: d.zone,
      vehicleInfo: d.vehicleInfo,
      status: d.status,
      accountStatus: d.user.status,
      availability: d.user.status === "SUSPENDED" ? "unavailable" : d.status === "APPROVED" ? "available" : "pending",
      emailMasked: maskEmail(d.user.email),
      phoneMasked: maskPhone(d.user.phone),
      documentsCount: d._count.documents,
      lastLoginAt: d.user.lastLoginAt?.toISOString() ?? null,
      updatedAt: d.updatedAt.toISOString(),
      createdAt: d.createdAt.toISOString(),
    })),
    total,
    counts: {
      active: approved,
      availableNow,
      missionsToday: 0,
      documentsToRenew: pendingDocs,
    },
  };
}

export async function getDriverDetail(profileId: string) {
  const profile = await prisma.driverProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          phone: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      },
      documents: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, kind: true, mimeType: true, createdAt: true, scanStatus: true, retainUntil: true },
      },
    },
  });
  if (!profile) return { ok: false as const, error: "Livreur introuvable." };

  const history = await prisma.auditLog.findMany({
    where: { OR: [{ targetId: profile.id }, { actorId: profile.userId }] },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, action: true, createdAt: true },
  });

  return {
    ok: true as const,
    driver: {
      id: profile.id,
      fullName: profile.fullName,
      zone: profile.zone,
      zones: profile.zone ? profile.zone.split(/[,;/]+/).map((z) => z.trim()).filter(Boolean) : [],
      vehicleInfo: profile.vehicleInfo,
      status: profile.status,
      rejectionReason: profile.rejectionReason,
      reviewedAt: profile.reviewedAt?.toISOString() ?? null,
      accountStatus: profile.user.status,
      availability: profile.user.status === "SUSPENDED" ? "unavailable" : profile.status === "APPROVED" ? "available" : "pending",
      email: profile.user.email,
      emailMasked: maskEmail(profile.user.email),
      phoneMasked: maskPhone(profile.user.phone),
      lastLoginAt: profile.user.lastLoginAt?.toISOString() ?? null,
      createdAt: profile.createdAt.toISOString(),
      userId: profile.userId,
      missions: [] as { id: string; label: string; status: string }[],
      missionsNote: "Aucune mission planifiée n’est encore liée à ce profil dans le système.",
      incidents: [] as { id: string; label: string; status: string }[],
      documents: profile.documents.map((d) => ({
        id: d.id,
        kind: d.kind,
        mimeType: d.mimeType,
        scanStatus: d.scanStatus,
        createdAt: d.createdAt.toISOString(),
        retainUntil: d.retainUntil?.toISOString() ?? null,
      })),
      history: history.map((h) => ({
        id: h.id,
        action: h.action,
        createdAt: h.createdAt.toISOString(),
      })),
      access: {
        method: "Identifiant + mot de passe",
        canReset: true,
        canSuspend: profile.user.status !== "SUSPENDED",
      },
    },
  };
}

export async function reviewDriver(
  reviewerId: string,
  profileId: string,
  decision: "APPROVED" | "REJECTED",
  reason: string | undefined,
  ip?: string,
) {
  return reviewDriverApplication(reviewerId, profileId, decision, reason, ip);
}

export async function setUserAccountStatus(
  actorId: string,
  userId: string,
  status: "ACTIVE" | "SUSPENDED",
  ip?: string,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role === "ADMIN") return { ok: false as const, error: "Compte introuvable ou non modifiable." };
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status, authEpoch: status === "SUSPENDED" ? { increment: 1 } : undefined },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "User",
    targetId: userId,
    metadata: { event: "USER_ACCOUNT_STATUS", status },
    ip,
  });
  return { ok: true as const, user: updated };
}
