import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "../db.js";

type AuditInput = {
  action: AuditAction;
  actorId?: string | null;
  targetType?: string;
  targetId?: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string | null;
};

export async function writeAuditLog(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      action: input.action,
      actorId: input.actorId ?? null,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata ?? {},
      ip: input.ip ?? null,
    },
  });
}
