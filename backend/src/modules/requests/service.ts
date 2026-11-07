import type { Prisma, ServiceRequestStatus, ServiceRequestType } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { RequestIdempotencyConflictError } from "../../lib/httpError.js";
import {
  isUniqueViolation,
  requestMatchesExisting,
} from "../../lib/requestIdempotency.js";
import { generateRequestReference } from "../../lib/tokens.js";
import type { CreateContactRequestInput, CreateGenericRequestInput } from "./schemas.js";
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
  actorId?: string;
  ip?: string;
  clientRequestId?: string;
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
  try {
    const request = await prisma.serviceRequest.create({
      data: {
        reference,
        type: input.type,
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
        events: {
          create: {
            status: "RECEIVED",
            note: "Demande enregistrée.",
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
    payload: input.payload,
    sourcePath: input.sourcePath,
  };
}

export async function listRequestsForAdmin(query: {
  status?: ServiceRequestStatus;
  type?: string;
  q?: string;
  take: number;
  skip: number;
}) {
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.type ? { type: query.type as ServiceRequestType } : {}),
    ...(query.q
      ? {
          OR: [
            { reference: { contains: query.q, mode: "insensitive" as const } },
            { contactName: { contains: query.q, mode: "insensitive" as const } },
            { message: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.take,
      skip: query.skip,
      select: {
        id: true,
        reference: true,
        type: true,
        status: true,
        contactName: true,
        zone: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.serviceRequest.count({ where }),
  ]);
  return { items, total };
}

export async function getRequestDetail(id: string) {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "asc" } },
      assignee: { select: { id: true, email: true, displayName: true } },
    },
  });
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
    metadata: { status: input.status },
    ip: input.ip,
  });
  return updated;
}
