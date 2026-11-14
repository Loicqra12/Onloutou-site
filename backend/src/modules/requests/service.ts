import type { Prisma, ServiceRequestStatus, ServiceRequestType } from "@prisma/client";
import {
  OPEN_REQUEST_STATUSES,
  envisagedArticles,
  requestNeedLine,
  requestNextAction,
  requestOrigin,
  requestPeriodLine,
  requestStageLabel,
  requestTitle,
  requestTypeLabel,
} from "../admin/labels.js";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { RequestIdempotencyConflictError } from "../../lib/httpError.js";
import {
  isUniqueViolation,
  requestMatchesExisting,
} from "../../lib/requestIdempotency.js";
import { generateRequestReference } from "../../lib/tokens.js";
import type {
  CreateAdminDossierInput,
  CreateContactRequestInput,
  CreateGenericRequestInput,
} from "./schemas.js";
import { contactNeedToType } from "./schemas.js";

export async function createServiceRequest(input: {
  type: ServiceRequestType;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  organization?: string;
  zone?: string;
  message: string;
  payload?: Record<string, unknown>;
  sourcePath?: string;
  submitterUserId?: string;
  assigneeId?: string;
  status?: ServiceRequestStatus;
  actorId?: string;
  ip?: string;
  clientRequestId?: string;
  eventNote?: string;
  /** Appelé uniquement quand la demande vient d'être créée (jamais lors d'un rejeu idempotent). */
  onCreated?: (request: Awaited<ReturnType<typeof prisma.serviceRequest.create>>) => void;
}) {
  const bodyForMatch = {
    type: input.type,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    organization: input.organization,
    zone: input.zone,
    message: input.message,
    payload: input.payload,
  };

  if (input.clientRequestId) {
    const existing = await prisma.serviceRequest.findUnique({
      where: { clientRequestId: input.clientRequestId },
    });
    if (existing) {
      if (!requestMatchesExisting(existing, bodyForMatch)) {
        throw new RequestIdempotencyConflictError();
      }
      return existing;
    }
  }
  const reference = generateRequestReference();
  const status = input.status ?? "RECEIVED";
  try {
    const request = await prisma.serviceRequest.create({
      data: {
        reference,
        type: input.type,
        status,
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        organization: input.organization,
        zone: input.zone,
        message: input.message,
        payload: (input.payload ?? {}) as Prisma.InputJsonValue,
        sourcePath: input.sourcePath,
        clientRequestId: input.clientRequestId,
        submitterUserId: input.submitterUserId,
        assigneeId: input.assigneeId,
        events: {
          create: {
            status,
            note: input.eventNote ?? "Demande enregistrée.",
            actorId: input.actorId,
          },
        },
      },
    });
    await writeAuditLog({
      action: "REQUEST_CREATED",
      actorId: input.actorId,
      targetType: "ServiceRequest",
      targetId: request.id,
      metadata: { reference: request.reference, type: request.type },
      ip: input.ip,
    });
    try {
      input.onCreated?.(request);
    } catch (hookError) {
      console.error("[requests] onCreated a échoué :", hookError);
    }
    return request;
  } catch (err) {
    if (input.clientRequestId && isUniqueViolation(err, "clientRequestId")) {
      const existing = await prisma.serviceRequest.findUnique({
        where: { clientRequestId: input.clientRequestId },
      });
      if (!existing) throw err;
      if (!requestMatchesExisting(existing, bodyForMatch)) {
        throw new RequestIdempotencyConflictError();
      }
      return existing;
    }
    throw err;
  }
}

export function fromContactForm(input: CreateContactRequestInput) {
  const type = contactNeedToType(input.need);
  const payload = {
    need: input.need,
    deadline: input.deadline,
    openWhatsAppAfter: input.openWhatsAppAfter ?? false,
    ...(input.familyLabel ? { familyLabel: input.familyLabel } : {}),
  };
  const messageParts = [input.message];
  if (input.deadline?.trim()) messageParts.push(`Échéance : ${input.deadline.trim()}`);
  return {
    type,
    contactName: input.name.trim(),
    contactPhone: input.phone?.trim() || undefined,
    contactEmail: input.email?.trim() || undefined,
    organization: input.organisation?.trim() || undefined,
    zone: input.zone?.trim() || undefined,
    message: messageParts.join("\n"),
    payload,
    sourcePath: input.sourcePath,
  };
}

export function fromGenericForm(input: CreateGenericRequestInput) {
  return {
    type: input.type as ServiceRequestType,
    contactName: input.contactName.trim(),
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    organization: input.organization,
    zone: input.zone,
    message: input.message.trim(),
    payload: {
      ...(input.payload ?? {}),
      source: input.source,
    },
    sourcePath: input.sourcePath,
  };
}

function mapRequestRow(row: {
  id: string;
  reference: string;
  type: ServiceRequestType;
  status: ServiceRequestStatus;
  contactName: string;
  organization: string | null;
  zone: string | null;
  message: string;
  payload: unknown;
  sourcePath: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignee: { id: string; displayName: string | null; email: string } | null;
}) {
  const origin = requestOrigin(row.payload, row.sourcePath);
  const when = requestPeriodLine(row.payload, row.zone);
  return {
    id: row.id,
    reference: row.reference,
    type: row.type,
    typeLabel: requestTypeLabel(row.type),
    status: row.status,
    stage: requestStageLabel(row.status, row.payload),
    nextAction: requestNextAction(row.status, row.payload),
    title: requestTitle(row),
    need: requestNeedLine(row),
    contactName: row.contactName,
    organization: row.organization,
    zone: row.zone,
    period: when.period,
    place: when.place,
    source: origin.label,
    sourceKey: origin.key,
    assigneeId: row.assignee?.id ?? null,
    assignee: row.assignee ? row.assignee.displayName?.trim() || row.assignee.email : null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function bucketStatuses(bucket?: string): ServiceRequestStatus[] | "none" | "confirmed-payload" | null {
  if (bucket === "qualify") return ["RECEIVED"];
  if (bucket === "proposition") return ["IN_REVIEW", "QUOTED"];
  if (bucket === "closed") return ["CLOSED", "CANCELLED"];
  if (bucket === "confirmed") return "confirmed-payload";
  if (bucket === "running") return "none";
  return null;
}

function isRentalConfirmed(payload: unknown): boolean {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const rental = data.rental && typeof data.rental === "object" ? (data.rental as Record<string, unknown>) : null;
  return rental?.status === "confirmed" || rental?.reserved === true || data.reserved === true;
}

export async function listRequestsForAdmin(query: {
  status?: ServiceRequestStatus;
  type?: string;
  q?: string;
  open?: string;
  bucket?: string;
  origin?: string;
  assignee?: string;
  take: number;
  skip: number;
}) {
  const open = query.open === "1" || query.open === "true";
  const bucket = bucketStatuses(query.bucket);
  const confirmedBucket = bucket === "confirmed-payload";
  const baseWhere = {
    ...(query.status
      ? { status: query.status }
      : bucket === "none"
        ? { id: "__none__" }
        : confirmedBucket
          ? { status: { in: OPEN_REQUEST_STATUSES } }
          : bucket
            ? { status: { in: bucket } }
            : open
              ? { status: { in: OPEN_REQUEST_STATUSES } }
              : {}),
    ...(query.type ? { type: query.type as ServiceRequestType } : {}),
    ...(query.assignee === "none"
      ? { assigneeId: null }
      : query.assignee
        ? { assigneeId: query.assignee }
        : {}),
    ...(query.q
      ? {
          OR: [
            { reference: { contains: query.q, mode: "insensitive" as const } },
            { contactName: { contains: query.q, mode: "insensitive" as const } },
            { organization: { contains: query.q, mode: "insensitive" as const } },
            { message: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const countWhere = {
    ...(query.type ? { type: query.type as ServiceRequestType } : {}),
    ...(query.q
      ? {
          OR: [
            { reference: { contains: query.q, mode: "insensitive" as const } },
            { contactName: { contains: query.q, mode: "insensitive" as const } },
            { organization: { contains: query.q, mode: "insensitive" as const } },
            { message: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const needsMemory = Boolean(query.origin) || confirmedBucket;
  const [rows, grouped, assigneeRows, confirmedRows] = await Promise.all([
    prisma.serviceRequest.findMany({
      where: baseWhere,
      orderBy: { createdAt: "desc" },
      ...(needsMemory ? {} : { take: query.take, skip: query.skip }),
      include: { assignee: { select: { id: true, displayName: true, email: true } } },
    }),
    prisma.serviceRequest.groupBy({
      by: ["status"],
      where: countWhere,
      _count: { _all: true },
    }),
    prisma.serviceRequest.findMany({
      where: { assigneeId: { not: null } },
      distinct: ["assigneeId"],
      select: { assignee: { select: { id: true, displayName: true, email: true } } },
      take: 40,
    }),
    prisma.serviceRequest.findMany({
      where: { status: { in: OPEN_REQUEST_STATUSES } },
      select: { id: true, payload: true },
      take: 500,
    }),
  ]);

  const filteredRows = confirmedBucket ? rows.filter((row) => isRentalConfirmed(row.payload)) : rows;
  let mapped = filteredRows.map(mapRequestRow);
  if (query.origin) mapped = mapped.filter((row) => row.sourceKey === query.origin);
  const total = needsMemory ? mapped.length : await prisma.serviceRequest.count({ where: baseWhere });
  const items = needsMemory ? mapped.slice(query.skip, query.skip + query.take) : mapped;

  const byStatus = Object.fromEntries(grouped.map((row) => [row.status, row._count._all]));
  const confirmedCount = confirmedRows.filter((row) => isRentalConfirmed(row.payload)).length;
  const counts = {
    all: grouped.reduce((sum, row) => sum + row._count._all, 0),
    qualify: byStatus.RECEIVED ?? 0,
    proposition: (byStatus.IN_REVIEW ?? 0) + (byStatus.QUOTED ?? 0),
    confirmed: confirmedCount,
    running: 0,
    closed: (byStatus.CLOSED ?? 0) + (byStatus.CANCELLED ?? 0),
  };

  const assignees = assigneeRows
    .map((row) => row.assignee)
    .filter((actor): actor is { id: string; displayName: string | null; email: string } => Boolean(actor))
    .map((actor) => ({
      id: actor.id,
      name: actor.displayName?.trim() || actor.email,
    }));

  return { items, total, counts, assignees };
}

export async function getRequestDetail(id: string) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "asc" } },
      assignee: { select: { id: true, email: true, displayName: true } },
    },
  });
  if (!request) return null;
  const origin = requestOrigin(request.payload, request.sourcePath);
  return {
    ...request,
    typeLabel: requestTypeLabel(request.type),
    stage: requestStageLabel(request.status, request.payload),
    nextAction: requestNextAction(request.status, request.payload),
    title: requestTitle(request),
    needLine: requestNeedLine(request),
    origin,
    period: requestPeriodLine(request.payload, request.zone),
    articles: envisagedArticles(request.payload, requestTypeLabel(request.type)),
  };
}

export async function updateRequestStatus(input: {
  id: string;
  status: ServiceRequestStatus;
  note?: string;
  actorId: string;
  ip?: string;
}) {
  const updated = await prisma.serviceRequest.update({
    where: { id: input.id },
    data: {
      status: input.status,
      events: {
        create: {
          status: input.status,
          note: input.note,
          actorId: input.actorId,
        },
      },
    },
  });
  await writeAuditLog({
    action: "REQUEST_STATUS_CHANGED",
    actorId: input.actorId,
    targetType: "ServiceRequest",
    targetId: updated.id,
    metadata: { status: input.status, reference: updated.reference },
    ip: input.ip,
  });
  return updated;
}

const ORIGIN_LABELS = {
  phone: "Téléphone",
  whatsapp: "WhatsApp",
  web: "Site",
  other: "Autre",
} as const;

export async function listStaffActors() {
  const items = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "STAFF"] }, status: "ACTIVE" },
    select: { id: true, displayName: true, email: true },
    orderBy: [{ displayName: "asc" }, { email: "asc" }],
    take: 80,
  });
  return items.map((row) => ({
    id: row.id,
    name: row.displayName?.trim() || row.email,
    email: row.email,
  }));
}

export async function searchRequestContacts(q: string) {
  const query = q.trim();
  const rows = await prisma.serviceRequest.findMany({
    where: query
      ? {
          OR: [
            { contactName: { contains: query, mode: "insensitive" } },
            { organization: { contains: query, mode: "insensitive" } },
            { contactPhone: { contains: query, mode: "insensitive" } },
            { contactEmail: { contains: query, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { updatedAt: "desc" },
    take: 40,
    select: {
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      organization: true,
      zone: true,
    },
  });
  const seen = new Set<string>();
  const items: {
    contactName: string;
    contactPhone: string | null;
    contactEmail: string | null;
    organization: string | null;
    zone: string | null;
    kind: "professional" | "individual";
  }[] = [];
  for (const row of rows) {
    const key = `${row.contactPhone ?? ""}|${row.contactEmail ?? ""}|${row.organization ?? ""}|${row.contactName}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      contactName: row.contactName,
      contactPhone: row.contactPhone,
      contactEmail: row.contactEmail,
      organization: row.organization,
      zone: row.zone,
      kind: row.organization ? "professional" : "individual",
    });
    if (items.length >= 8) break;
  }
  return items;
}

export async function createAdminDossier(input: CreateAdminDossierInput, actorId: string, ip?: string) {
  const assignee = await prisma.user.findFirst({
    where: { id: input.assigneeId, role: { in: ["ADMIN", "STAFF"] }, status: "ACTIVE" },
    select: { id: true, displayName: true, email: true },
  });
  if (!assignee) {
    return { ok: false as const, error: "Le responsable doit être un membre actif de l’équipe." };
  }
  if ((input.origin === "phone" || input.origin === "whatsapp") && !input.contactPhone?.trim()) {
    return { ok: false as const, error: "Indiquez un numéro pour un contact téléphone ou WhatsApp." };
  }
  if (!input.datesToConfirm && (!input.startDate || !input.endDate)) {
    return { ok: false as const, error: "Indiquez les dates, ou cochez « Dates à préciser »." };
  }

  const serviceBits = [
    input.services.delivery ? "Livraison" : null,
    input.services.pickup ? "Reprise" : null,
    input.services.install ? "Installation" : null,
  ].filter(Boolean);
  const articleLines = input.articles.map(
    (row) => `${row.quantity} ${row.unit || "unité"}${row.quantity > 1 ? "s" : ""} · ${row.title}`,
  );
  const message = [
    input.usage.trim(),
    articleLines.join("\n"),
    serviceBits.length ? `Services : ${serviceBits.join(", ")}` : null,
    input.accessNotes?.trim() ? `Accès : ${input.accessNotes.trim()}` : null,
    input.internalNote?.trim() ? `Note interne : ${input.internalNote.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const familyLabel = input.articles[0]?.familyLabel || input.articles[0]?.title;
  const payload = {
    source: input.origin,
    origin: input.origin,
    clientKind: input.clientKind ?? (input.organization ? "professional" : "individual"),
    contactDate: input.contactDate,
    internalNote: input.internalNote?.trim() || undefined,
    familyLabel,
    articles: input.articles.map((row) => ({
      title: row.title,
      quantity: row.quantity,
      unit: row.unit || "Appareil",
      productId: row.productId,
      familyLabel: row.familyLabel,
      owner: "À déterminer",
    })),
    startDate: input.startDate,
    endDate: input.endDate,
    datesToConfirm: Boolean(input.datesToConfirm),
    city: input.city,
    commune: input.commune,
    address: input.address?.trim() || undefined,
    usageLabel: input.usage.trim(),
    supportLabel: serviceBits.join(" et ") || undefined,
    delivery: input.services.delivery,
    pickup: input.services.pickup,
    install: input.services.install,
    accessNotes: input.accessNotes?.trim() || undefined,
    reserved: false,
    paymentRecorded: false,
    createdManually: true,
  };

  const originLabel = ORIGIN_LABELS[input.origin];
  const created = await createServiceRequest({
    type: "RENTAL",
    contactName: input.contactName.trim(),
    contactPhone: input.contactPhone?.trim() || undefined,
    contactEmail: input.contactEmail,
    organization: input.organization?.trim() || undefined,
    zone: [input.commune, input.city].filter(Boolean).join(", "),
    message,
    payload,
    sourcePath: "/dossiers/nouveau",
    submitterUserId: actorId,
    assigneeId: assignee.id,
    status: "IN_REVIEW",
    actorId,
    ip,
    clientRequestId: input.clientRequestId,
    eventNote: `Création manuelle. Source ${originLabel}. Aucun article réservé. Aucun message envoyé au client.`,
  });

  const detail = await getRequestDetail(created.id);
  return { ok: true as const, request: detail };
}
