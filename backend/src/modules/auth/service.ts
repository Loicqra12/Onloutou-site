import type { User } from "@prisma/client";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { bumpUserAuthEpoch } from "../../lib/sessions.js";
import { hashOpaqueToken, hashPassword, verifyPassword } from "../../lib/password.js";
import { generateToken } from "../../lib/tokens.js";
import type { SessionUser } from "../../middleware/auth.js";
import type {
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerDriverSchema,
  registerPartnerSchema,
} from "./schemas.js";
import type { z } from "zod";

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    authEpoch: user.authEpoch,
  };
}

export async function loginUser(input: z.infer<typeof loginSchema>, ip?: string) {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || user.status !== "ACTIVE") {
    return { ok: false as const, error: "Identifiants incorrects." };
  }
  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    return { ok: false as const, error: "Identifiants incorrects." };
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAuditLog({ action: "USER_LOGIN", actorId: user.id, ip });
  return { ok: true as const, user: toSessionUser(user) };
}

export async function registerPartner(input: z.infer<typeof registerPartnerSchema>) {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: "Un compte existe déjà avec cet e-mail." };
  }
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "PARTNER",
      status: "ACTIVE",
      displayName: input.displayName,
      phone: input.phone,
      partnerProfile: {
        create: {
          organizationName: input.organizationName,
          partnerType: input.partnerType,
          zone: input.zone,
          description: input.description,
          // L’inscription vaut dépôt de candidature : sans cela le dossier restait invisible pour l’admin.
          status: "SUBMITTED",
        },
      },
    },
    include: { partnerProfile: true },
  });
  await writeAuditLog({
    action: "USER_CREATED",
    actorId: user.id,
    targetType: "PartnerProfile",
    targetId: user.partnerProfile?.id,
  });
  await writeAuditLog({
    action: "APPLICATION_SUBMITTED",
    actorId: user.id,
    targetType: "PartnerProfile",
    targetId: user.partnerProfile?.id,
  });
  return { ok: true as const, user: toSessionUser(user) };
}

export async function registerDriver(input: z.infer<typeof registerDriverSchema>) {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: "Un compte existe déjà avec cet e-mail." };
  }
  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "DRIVER",
      status: "ACTIVE",
      displayName: input.fullName,
      phone: input.phone,
      driverProfile: {
        create: {
          fullName: input.fullName,
          zone: input.zone,
          vehicleInfo: input.vehicleInfo,
          status: "SUBMITTED",
        },
      },
    },
    include: { driverProfile: true },
  });
  await writeAuditLog({
    action: "USER_CREATED",
    actorId: user.id,
    targetType: "DriverProfile",
    targetId: user.driverProfile?.id,
  });
  await writeAuditLog({
    action: "APPLICATION_SUBMITTED",
    actorId: user.id,
    targetType: "DriverProfile",
    targetId: user.driverProfile?.id,
  });
  return { ok: true as const, user: toSessionUser(user) };
}

export async function requestPasswordReset(input: z.infer<typeof passwordResetRequestSchema>, ip?: string) {
  const email = input.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: true as const };
  }
  const plain = generateToken(48);
  const tokenHash = await hashOpaqueToken(plain);
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  await writeAuditLog({ action: "PASSWORD_RESET_REQUEST", actorId: user.id, ip });
  return { ok: true as const, devToken: process.env.NODE_ENV === "development" ? plain : undefined };
}

export async function confirmPasswordReset(input: z.infer<typeof passwordResetConfirmSchema>, ip?: string) {
  const tokens = await prisma.passwordResetToken.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true },
    take: 50,
    orderBy: { createdAt: "desc" },
  });
  let match: (typeof tokens)[number] | undefined;
  for (const row of tokens) {
    if (await verifyPassword(row.tokenHash, input.token)) {
      match = row;
      break;
    }
  }
  if (!match) {
    return { ok: false as const, error: "Lien invalide ou expiré." };
  }
  const passwordHash = await hashPassword(input.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: match.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: match.id }, data: { usedAt: new Date() } }),
  ]);
  await bumpUserAuthEpoch(match.userId);
  await writeAuditLog({ action: "PASSWORD_RESET", actorId: match.userId, ip });
  return { ok: true as const };
}

export async function bootstrapAdmin(email: string, password: string, displayName: string) {
  const normalized = email.toLowerCase();
  const count = await prisma.user.count({ where: { role: "ADMIN" } });
  if (count > 0) {
    throw new Error("Un administrateur existe déjà. Utilisez la connexion ou un autre compte staff.");
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: normalized,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      displayName,
    },
  });
  await writeAuditLog({ action: "USER_CREATED", actorId: user.id, targetType: "User", targetId: user.id });
  return user;
}
