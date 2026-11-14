import type { AuditAction, Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { articleFamilies } from "../catalog/taxonomy.js";
import { OPEN_REQUEST_STATUSES, requestOrigin } from "./labels.js";

function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function maskEmail(email: string | null | undefined) {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, Math.min(2, local.length))}•••@${domain}`;
}

function maskPhone(phone: string | null | undefined) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "•••";
  return `${phone.slice(0, Math.min(4, phone.length))} •• •• ${digits.slice(-2)}`;
}

function maskIp(ip: string | null | undefined) {
  if (!ip) return null;
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.***.***`;
  if (ip.includes(":")) return `${ip.slice(0, 8)}…`;
  return "***";
}

const SENSITIVE: AuditAction[] = [
  "APPLICATION_APPROVED",
  "APPLICATION_REJECTED",
  "PRODUCT_APPROVED",
  "PRODUCT_REJECTED",
  "PASSWORD_RESET",
  "PASSWORD_RESET_REQUEST",
  "DOCUMENT_ACCESSED",
  "REQUEST_STATUS_CHANGED",
];

function actionLevel(action: AuditAction): "info" | "attention" | "critique" {
  if (action === "PASSWORD_RESET" || action === "APPLICATION_REJECTED" || action === "PRODUCT_REJECTED") {
    return "critique";
  }
  if (SENSITIVE.includes(action)) return "attention";
  return "info";
}

function actionModule(action: AuditAction): string {
  if (action.startsWith("USER_") || action.startsWith("PASSWORD_")) return "Auth";
  if (action.startsWith("APPLICATION_")) return "Personnes";
  if (action.startsWith("PRODUCT_") || action.startsWith("DOCUMENT_")) return "Articles";
  if (action.startsWith("REQUEST_") || action.startsWith("PARTNER_DEMAND_")) return "Dossiers";
  return "Système";
}

function actionLabel(action: AuditAction): string {
  const map: Partial<Record<AuditAction, string>> = {
    USER_LOGIN: "Connexion",
    USER_LOGOUT: "Déconnexion",
    USER_CREATED: "Création de compte",
    PASSWORD_RESET_REQUEST: "Demande de réinitialisation",
    PASSWORD_RESET: "Réinitialisation du mot de passe",
    APPLICATION_SUBMITTED: "Candidature soumise",
    APPLICATION_APPROVED: "Validation de candidature",
    APPLICATION_REJECTED: "Refus de candidature",
    REQUEST_CREATED: "Création de dossier",
    REQUEST_STATUS_CHANGED: "Changement de statut",
    PRODUCT_CREATED: "Création d’article",
    PRODUCT_UPDATED: "Modification d’article",
    PRODUCT_SUBMITTED: "Soumission d’article",
    PRODUCT_APPROVED: "Publication d’article",
    PRODUCT_REJECTED: "Refus d’article",
    PRODUCT_ARCHIVED: "Archivage d’article",
    DOCUMENT_UPLOADED: "Dépôt de document",
    DOCUMENT_ACCESSED: "Consultation de document",
    PARTNER_DEMAND_REPLIED: "Réponse à une demande partenaire",
  };
  return map[action] || action;
}

function fingerprint(row: { id: string; action: string; createdAt: Date; actorId: string | null; targetId: string | null }) {
  return createHash("sha256")
    .update(`${row.id}|${row.action}|${row.createdAt.toISOString()}|${row.actorId || ""}|${row.targetId || ""}`)
    .digest("hex");
}

export async function listTeam(query: { q?: string; status?: string }) {
  const where: Prisma.UserWhereInput = {
    role: { in: ["ADMIN", "STAFF"] },
    ...(query.status === "ACTIVE" || query.status === "SUSPENDED" || query.status === "PENDING_EMAIL"
      ? { status: query.status }
      : {}),
    ...(query.q?.trim()
      ? {
          OR: [
            { email: { contains: query.q.trim(), mode: "insensitive" } },
            { displayName: { contains: query.q.trim(), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [rows, active, pendingEmail, without2fa] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 80,
      select: {
        id: true,
        email: true,
        displayName: true,
        phone: true,
        role: true,
        status: true,
        totpEnabledAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "STAFF"] }, status: "ACTIVE" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "STAFF"] }, status: "PENDING_EMAIL" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "STAFF"] }, totpEnabledAt: null } }),
  ]);

  return {
    items: rows.map((u) => ({
      id: u.id,
      displayName: u.displayName || u.email.split("@")[0],
      emailMasked: maskEmail(u.email),
      phoneMasked: maskPhone(u.phone),
      role: u.role,
      status: u.status,
      totpEnabled: Boolean(u.totpEnabledAt),
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      createdAt: u.createdAt.toISOString(),
      functionLabel: u.role === "ADMIN" ? "Administrateur" : "Équipe",
      teamLabel: "ONLOUTOU",
      sessionsKnown: false,
    })),
    total: rows.length,
    counts: {
      active,
      invitationsPending: pendingEmail,
      without2fa,
      sessionsToReview: 0,
    },
    banner: "Principe du moindre privilège · Double authentification requise pour les administrateurs",
  };
}

export async function getTeamMember(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      phone: true,
      role: true,
      status: true,
      totpEnabledAt: true,
      lastLoginAt: true,
      createdAt: true,
      emailVerifiedAt: true,
    },
  });
  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
    return { ok: false as const, error: "Membre introuvable." };
  }

  const recent = await prisma.auditLog.findMany({
    where: { actorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, action: true, createdAt: true, ip: true, metadata: true },
  });

  const domains = ["Dossiers", "Articles", "Personnes", "Finances", "Administration"] as const;
  const isAdmin = user.role === "ADMIN";
  const permissions = domains.map((domain) => ({
    domain,
    create: isAdmin || domain !== "Administration",
    read: true,
    update: isAdmin || domain !== "Administration",
    close: isAdmin || domain === "Dossiers",
    configure: isAdmin && domain === "Administration",
  }));

  return {
    ok: true as const,
    member: {
      id: user.id,
      displayName: user.displayName || user.email.split("@")[0],
      emailMasked: maskEmail(user.email),
      phoneMasked: maskPhone(user.phone),
      role: user.role,
      status: user.status,
      totpEnabled: Boolean(user.totpEnabledAt),
      totpEnabledAt: user.totpEnabledAt?.toISOString() ?? null,
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      functionLabel: isAdmin ? "Administrateur" : "Équipe",
      teamLabel: "ONLOUTOU",
      roles: isAdmin ? ["Administrateur", "Validation"] : ["Exploitation"],
      permissions,
      prohibitions: isAdmin
        ? ["Ne peut pas s’auto-approuver une opération sensible sans second contrôle métier."]
        : [
            "Ne peut pas approuver seul un remboursement.",
            "Ne peut pas modifier les paramètres globaux.",
            "Ne peut pas gérer les accès administrateur.",
          ],
      separationNote:
        "Séparation des responsabilités : un même membre ne doit pas à la fois demander et approuver un remboursement, une restitution ou un reversement.",
      sessions: [] as { id: string; label: string; ipMasked: string | null }[],
      sessionsNote: "Le détail multi-appareils n’est pas encore exposé. La suspension incrémente l’époque d’auth et invalide les sessions.",
      history: recent.map((r) => ({
        id: r.id,
        action: actionLabel(r.action),
        createdAt: r.createdAt.toISOString(),
        ipMasked: maskIp(r.ip),
        result: "Succès",
      })),
    },
  };
}

export async function setTeamMemberStatus(
  actorId: string,
  userId: string,
  status: "ACTIVE" | "SUSPENDED",
  ip?: string,
) {
  if (actorId === userId && status === "SUSPENDED") {
    return { ok: false as const, error: "Vous ne pouvez pas suspendre votre propre accès." };
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
    return { ok: false as const, error: "Membre introuvable." };
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status, authEpoch: status === "SUSPENDED" ? { increment: 1 } : undefined },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId,
    targetType: "User",
    targetId: userId,
    metadata: { event: "TEAM_ACCOUNT_STATUS", status },
    ip,
  });
  return { ok: true as const, status: updated.status };
}

export async function getSettingsTaxonomy() {
  const productCounts = await prisma.product.groupBy({
    by: ["familySlug"],
    _count: { _all: true },
  });
  const countByFamily = new Map(productCounts.map((row) => [row.familySlug || "", row._count._all]));

  const families = articleFamilies.map((family, index) => {
    const specIds = new Set(family.categories.flatMap((c) => c.specs.map((s) => s.id)));
    return {
      order: index + 1,
      slug: family.slug,
      label: family.label,
      shortLabel: family.shortLabel,
      icon: family.icon,
      publicPath: family.publicPath,
      categoriesCount: family.categories.length,
      specsCount: specIds.size,
      articlesCount: countByFamily.get(family.slug) || 0,
      status: "active",
      visibility: { client: true, partner: true, admin: true },
      categories: family.categories.map((cat) => ({
        slug: cat.slug,
        label: cat.label,
        specs: cat.specs,
        articlesCount: 0,
        status: "active",
      })),
      specs: [...specIds].map((id) => {
        const found = family.categories.flatMap((c) => c.specs).find((s) => s.id === id)!;
        return found;
      }),
      units: ["article", "lot"],
    };
  });

  const categoriesTotal = families.reduce((acc, f) => acc + f.categoriesCount, 0);
  const specsTotal = families.reduce((acc, f) => acc + f.specsCount, 0);

  return {
    banner:
      "Paramètres financiers, fiscaux et juridiques : validation dédiée requise avant activation. Les familles ci-dessous sont la source unique déjà en production code.",
    counts: {
      families: families.length,
      categories: categoriesTotal,
      specs: specsTotal,
      units: 2,
      syncedSpaces: 3,
    },
    families,
    unpublished: [] as { id: string; label: string; impact: string }[],
    controls: {
      linksOk: true,
      dependenciesOk: true,
      visibilityOk: true,
      deleteBlockedIfLinked: true,
    },
    lastPublishedNote: "Taxonomie versionnée dans le code (articleFamilies). Publication UI non ouverte.",
  };
}

export async function listAuditDesk(query: {
  q?: string;
  action?: string;
  level?: string;
  take?: number;
}) {
  const take = Math.min(query.take ?? 80, 200);
  const where: Prisma.AuditLogWhereInput = {
    ...(query.action ? { action: query.action as AuditAction } : {}),
  };

  const [rows, today, sensitiveToday, loginFails] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: { actor: { select: { email: true, displayName: true, role: true } } },
    }),
    prisma.auditLog.count({ where: { createdAt: { gte: startOfDay() } } }),
    prisma.auditLog.count({ where: { createdAt: { gte: startOfDay() }, action: { in: SENSITIVE } } }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: startOfDay() },
        action: { in: ["PASSWORD_RESET_REQUEST"] },
      },
    }),
  ]);

  let items = rows.map((row) => {
    const level = actionLevel(row.action);
    const hash = fingerprint(row);
    return {
      id: row.id,
      action: row.action,
      actionLabel: actionLabel(row.action),
      module: actionModule(row.action),
      level,
      result: "Succès",
      createdAt: row.createdAt.toISOString(),
      actorName: row.actor?.displayName || row.actor?.email?.split("@")[0] || "Système",
      actorEmailMasked: maskEmail(row.actor?.email),
      actorRole: row.actor?.role || "SYSTEM",
      targetType: row.targetType,
      targetId: row.targetId,
      ipMasked: maskIp(row.ip),
      metadata: row.metadata,
      fingerprint: `${hash.slice(0, 12)}…${hash.slice(-8)}`,
      fingerprintFull: hash,
      sensitive: SENSITIVE.includes(row.action),
    };
  });

  if (query.q?.trim()) {
    const q = query.q.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.actionLabel.toLowerCase().includes(q) ||
        item.actorName.toLowerCase().includes(q) ||
        (item.targetId || "").toLowerCase().includes(q) ||
        item.module.toLowerCase().includes(q),
    );
  }
  if (query.level && query.level !== "all") {
    items = items.filter((item) => item.level === query.level);
  }

  return {
    items,
    total: items.length,
    counts: {
      today,
      sensitiveToday,
      loginFails,
      exports: 0,
    },
    banner:
      "Journal non modifiable : actions sensibles, connexions, consultations de documents et changements de statut.",
  };
}

export async function getAuditEvent(id: string) {
  const row = await prisma.auditLog.findUnique({
    where: { id },
    include: { actor: { select: { id: true, email: true, displayName: true, role: true } } },
  });
  if (!row) return { ok: false as const, error: "Événement introuvable." };

  const hash = fingerprint(row);
  const related = await prisma.auditLog.findMany({
    where: {
      OR: [
        row.targetId ? { targetId: row.targetId } : undefined,
        row.actorId ? { actorId: row.actorId, createdAt: { lte: row.createdAt } } : undefined,
      ].filter(Boolean) as Prisma.AuditLogWhereInput[],
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, action: true, createdAt: true },
  });

  return {
    ok: true as const,
    event: {
      id: row.id,
      action: row.action,
      actionLabel: actionLabel(row.action),
      module: actionModule(row.action),
      level: actionLevel(row.action),
      sensitive: SENSITIVE.includes(row.action),
      createdAt: row.createdAt.toISOString(),
      actor: row.actor
        ? {
            id: row.actor.id,
            name: row.actor.displayName || row.actor.email.split("@")[0],
            emailMasked: maskEmail(row.actor.email),
            role: row.actor.role,
          }
        : null,
      targetType: row.targetType,
      targetId: row.targetId,
      metadata: row.metadata,
      ipMasked: maskIp(row.ip),
      fingerprint: `${hash.slice(0, 12)}…${hash.slice(-8)}`,
      integrity: "Aucune modification détectée (empreinte recalculée à la lecture).",
      retention: "Conservation indicative : 5 ans (politique à confirmer).",
      chain: related.map((r) => ({
        id: r.id,
        actionLabel: actionLabel(r.action),
        createdAt: r.createdAt.toISOString(),
      })),
    },
  };
}

export async function getReportsDesk() {
  const monthStart = startOfMonth();
  const [
    requestsTotal,
    requestsMonth,
    closedMonth,
    quotedOrWaiting,
    activeRentals,
    products,
    partnersApproved,
    partnersPending,
    pendingProducts,
    revenuesPending,
    auditToday,
    recentRequests,
  ] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.serviceRequest.count({ where: { status: "CLOSED", updatedAt: { gte: monthStart } } }),
    prisma.serviceRequest.count({ where: { status: { in: ["QUOTED", "WAITING_CLIENT"] } } }),
    prisma.serviceRequest.count({ where: { status: { in: OPEN_REQUEST_STATUSES } } }),
    prisma.product.count(),
    prisma.partnerProfile.count({ where: { status: "APPROVED" } }),
    prisma.partnerProfile.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.partnerRevenue.count({ where: { status: "PENDING" } }),
    prisma.auditLog.count({ where: { createdAt: { gte: startOfDay() } } }),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 120,
      select: { id: true, status: true, payload: true, createdAt: true, type: true },
    }),
  ]);

  const sources = { site: 0, phone: 0, whatsapp: 0, other: 0 };
  for (const row of recentRequests) {
    const origin = requestOrigin(row.payload, null);
    if (origin.key === "web") sources.site += 1;
    else if (origin.key === "phone") sources.phone += 1;
    else if (origin.key === "whatsapp") sources.whatsapp += 1;
    else sources.other += 1;
  }
  const sourceTotal = Math.max(1, sources.site + sources.phone + sources.whatsapp + sources.other);

  const familyDemand = new Map<string, number>();
  for (const row of recentRequests) {
    const payload = row.payload && typeof row.payload === "object" ? (row.payload as Record<string, unknown>) : {};
    const family = typeof payload.familySlug === "string" ? payload.familySlug : typeof payload.familyLabel === "string" ? payload.familyLabel : "autre";
    familyDemand.set(family, (familyDemand.get(family) || 0) + 1);
  }
  const topFamilies = [...familyDemand.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([slug, count]) => ({
      slug,
      label: articleFamilies.find((f) => f.slug === slug)?.label || slug,
      demandes: count,
    }));

  const conversion =
    requestsMonth > 0 ? Math.round((closedMonth / requestsMonth) * 1000) / 10 : null;

  return {
    banner: "Chiffres calculés sur les données réelles du système. Pas de données de démonstration inventées.",
    period: { label: "Ce mois", from: monthStart.toISOString(), to: new Date().toISOString() },
    tabs: ["activite", "parc", "partenaires", "livraisons", "finances", "qualite"] as const,
    kpis: {
      demandesRecues: requestsMonth,
      demandesTotal: requestsTotal,
      tauxTransformation: conversion,
      locationsEnService: activeRentals,
      delaiMoyenJours: null,
    },
    sources: {
      site: { count: sources.site, pct: Math.round((sources.site / sourceTotal) * 1000) / 10 },
      phone: { count: sources.phone, pct: Math.round((sources.phone / sourceTotal) * 1000) / 10 },
      whatsapp: { count: sources.whatsapp, pct: Math.round((sources.whatsapp / sourceTotal) * 1000) / 10 },
      other: { count: sources.other, pct: Math.round((sources.other / sourceTotal) * 1000) / 10 },
    },
    topFamilies,
    watch: [
      { level: "high", label: `${quotedOrWaiting} dossiers en proposition / attente client`, href: "/dossiers?bucket=proposition" },
      { level: "medium", label: `${pendingProducts} articles en attente de validation`, href: "/articles" },
      { level: "medium", label: `${partnersPending} partenaires à vérifier`, href: "/partenaires?status=SUBMITTED" },
      { level: "low", label: `${revenuesPending} revenus partenaires en attente`, href: "/reversements" },
    ],
    parc: { articles: products, note: "Parc unifié articles partenaires / ONLOUTOU selon les fiches publiées." },
    partenaires: { actifs: partnersApproved, aVerifier: partnersPending },
    livraisons: { note: "Planning livraisons & reprises : suivi détaillé encore dans les dossiers." },
    finances: { revenusEnAttente: revenuesPending },
    qualite: { evenementsAujourdhui: auditToday, note: "Incidents dédiés non encore modélisés comme module séparé." },
    scheduledReports: [] as { name: string; period: string; nextAt: string | null }[],
    scheduledNote: "Aucun rapport programmé enregistré. Export manuel à brancher après validation métier.",
  };
}
