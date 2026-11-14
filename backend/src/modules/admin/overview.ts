import type { AuditAction } from "@prisma/client";
import { prisma } from "../../db.js";
import {
  OPEN_REQUEST_STATUSES,
  requestNeedLine,
  requestNextAction,
  requestOrigin,
  requestStageLabel,
  requestTitle,
  requestTypeLabel,
} from "./labels.js";

function actorName(actor: { displayName: string | null; email: string } | null): string {
  if (!actor) return "Équipe";
  return actor.displayName?.trim() || actor.email.split("@")[0] || "Équipe";
}

function auditText(action: AuditAction, metadata: unknown): string {
  const meta = metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : {};
  const ref = typeof meta.reference === "string" ? meta.reference : null;
  switch (action) {
    case "REQUEST_CREATED":
      return ref ? `a créé le dossier ${ref}` : "a créé un dossier";
    case "REQUEST_STATUS_CHANGED":
      return ref ? `a mis à jour le dossier ${ref}` : "a mis à jour un dossier";
    case "PRODUCT_CREATED":
      return "a créé une fiche article";
    case "PRODUCT_SUBMITTED":
      return "a transmis une fiche pour validation";
    case "PRODUCT_APPROVED":
      return "a publié une fiche article";
    case "PRODUCT_REJECTED":
      return "a renvoyé une fiche à corriger";
    case "APPLICATION_APPROVED":
      return "a validé une candidature";
    case "APPLICATION_REJECTED":
      return "a refusé une candidature";
    case "USER_LOGIN":
      return "s’est connecté";
    default:
      return "a enregistré une action";
  }
}

export async function getAdminOverview(actorId: string) {
  const [
    dossiersToHandle,
    deliveriesToAssign,
    articlesToReview,
    paymentsToReview,
    recentDossiers,
    pendingProducts,
    locationsToPrepare,
    pendingRevenues,
    myOpenDossiers,
    audit,
  ] = await Promise.all([
    prisma.serviceRequest.count({ where: { status: { in: OPEN_REQUEST_STATUSES } } }),
    prisma.partnerLocation.count({ where: { status: "TO_PREPARE" } }),
    prisma.product.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.partnerRevenue.count({ where: { status: "PENDING" } }),
    prisma.serviceRequest.findMany({
      where: { status: { in: OPEN_REQUEST_STATUSES } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { assignee: { select: { id: true, displayName: true, email: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { partnerProfile: { select: { organizationName: true } } },
    }),
    prisma.partnerLocation.findMany({
      where: { status: "TO_PREPARE" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        product: { select: { title: true } },
        partnerProfile: { select: { organizationName: true } },
      },
    }),
    prisma.partnerRevenue.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { product: { select: { title: true } } },
    }),
    prisma.serviceRequest.findMany({
      where: { assigneeId: actorId, status: { in: OPEN_REQUEST_STATUSES } },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { actor: { select: { displayName: true, email: true } } },
    }),
  ]);

  const priorities = [
    ...recentDossiers.slice(0, 4).map((row) => ({
      id: row.id,
      kind: "dossier" as const,
      severity: row.status === "RECEIVED" ? ("alert" as const) : ("warn" as const),
      title: requestTitle(row),
      subtitle: requestNeedLine(row),
      badge: requestStageLabel(row.status),
      href: `/dossiers/${row.id}`,
      assignee: row.assignee ? actorName(row.assignee) : null,
      assigneeId: row.assignee?.id ?? null,
      actionLabel: requestNextAction(row.status) === "Qualifier" ? "Ouvrir" : requestNextAction(row.status),
    })),
    ...pendingProducts.slice(0, 2).map((row) => ({
      id: row.id,
      kind: "article" as const,
      severity: "warn" as const,
      title: `${row.partnerProfile.organizationName} · ${row.title}`,
      subtitle: "Fiche article · informations à contrôler",
      badge: "Fiche à vérifier",
      href: "/articles",
      assignee: null,
      assigneeId: null,
      actionLabel: "Examiner",
    })),
    ...locationsToPrepare.slice(0, 2).map((row) => ({
      id: row.id,
      kind: "livraison" as const,
      severity: "warn" as const,
      title: `${row.reference} · ${row.product.title}`,
      subtitle: `${row.commune} · à préparer`,
      badge: "Sans livreur",
      href: "/livraisons",
      assignee: row.partnerProfile.organizationName,
      assigneeId: null,
      actionLabel: "Affecter",
    })),
    ...pendingRevenues.slice(0, 2).map((row) => ({
      id: row.id,
      kind: "paiement" as const,
      severity: "info" as const,
      title: `${row.reference} · ${row.product.title}`,
      subtitle: "Revenu partenaire en attente",
      badge: "Contrôle nécessaire",
      href: "/paiements",
      assignee: null,
      assigneeId: null,
      actionLabel: "Vérifier",
    })),
  ].slice(0, 8);

  return {
    counts: {
      dossiersToHandle,
      deliveriesToAssign,
      articlesToReview,
      paymentsToReview,
    },
    priorities,
    recentDossiers: recentDossiers.map((row) => {
      const origin = requestOrigin(row.payload, row.sourcePath);
      return {
        id: row.id,
        reference: row.reference,
        title: requestTitle(row),
        need: requestNeedLine(row),
        zone: row.zone,
        source: origin.label,
        sourceKey: origin.key,
        stage: requestStageLabel(row.status),
        status: row.status,
        type: row.type,
        typeLabel: requestTypeLabel(row.type),
        assignee: row.assignee ? actorName(row.assignee) : null,
        createdAt: row.createdAt.toISOString(),
        href: `/dossiers/${row.id}`,
      };
    }),
    tasks: myOpenDossiers.map((row) => ({
      id: row.id,
      title: `Qualifier le dossier ${row.reference}`,
      subtitle: requestTitle(row),
      href: `/dossiers/${row.id}`,
    })),
    teamActivity: audit.map((row) => ({
      id: row.id,
      at: row.createdAt.toISOString(),
      actor: actorName(row.actor),
      text: auditText(row.action, row.metadata),
    })),
  };
}
