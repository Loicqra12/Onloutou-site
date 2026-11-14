import type { User } from "@prisma/client";
import type { Env } from "../../config/env.js";
import { mailConfigured } from "../../config/env.js";
import { prisma } from "../../db.js";
import { writeAuditLog } from "../../lib/audit.js";
import { mailFailedMessage, mailUnavailableMessage, passwordResetEmailText, sendMail, verificationEmailText } from "../../lib/mailer.js";
import { bumpUserAuthEpoch } from "../../lib/sessions.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { generateToken, hashResetToken } from "../../lib/tokens.js";
import {
  generateBackupCodes,
  generateTotpSecret,
  normalizeBackupCode,
  totpAuthUrl,
  verifyTotp,
} from "../../lib/totp.js";
import type { SessionUser } from "../../middleware/auth.js";
import type {
  emailConfirmSchema,
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  registerDriverSchema,
  registerPartnerSchema,
  twoFactorVerifySchema,
} from "./schemas.js";
import type { z } from "zod";

const TOKEN_TTL_MS = 60 * 60 * 1000;
const TWO_FACTOR_TTL_MS = 5 * 60 * 1000;
const TWO_FACTOR_MAX_ATTEMPTS = 5;

function isStaffRole(role: User["role"]) {
  return role === "ADMIN" || role === "STAFF";
}

function staffHasTwoFactor(user: User) {
  return Boolean(user.totpSecret && user.totpEnabledAt);
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    authEpoch: user.authEpoch,
    emailVerified: Boolean(user.emailVerifiedAt),
  };
}

async function issueTwoFactorChallenge(userId: string) {
  const plain = generateToken(48);
  await prisma.twoFactorChallenge.updateMany({
    where: { userId, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  await prisma.twoFactorChallenge.create({
    data: {
      userId,
      tokenHash: hashResetToken(plain),
      expiresAt: new Date(Date.now() + TWO_FACTOR_TTL_MS),
    },
  });
  return plain;
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
  if (isStaffRole(user.role) && staffHasTwoFactor(user)) {
    const challengeToken = await issueTwoFactorChallenge(user.id);
    return { ok: true as const, twoFactorRequired: true as const, challengeToken };
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await writeAuditLog({ action: "USER_LOGIN", actorId: user.id, ip });
  return { ok: true as const, twoFactorRequired: false as const, user: toSessionUser(user) };
}

export async function verifyTwoFactorLogin(input: z.infer<typeof twoFactorVerifySchema>, ip?: string) {
  const challenge = await prisma.twoFactorChallenge.findFirst({
    where: {
      tokenHash: hashResetToken(input.challengeToken),
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
  if (!challenge) {
    return { ok: false as const, error: "Session de vérification expirée. Reconnectez-vous." };
  }
  const user = challenge.user;
  if (!user.totpSecret || user.status !== "ACTIVE" || !isStaffRole(user.role)) {
    await prisma.twoFactorChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });
    return { ok: false as const, error: "Ce compte n’a pas accès à l’administration." };
  }

  const code = input.code.trim();
  const totpOk = verifyTotp(user.totpSecret, code);
  const backupNormalized = normalizeBackupCode(code);
  const backupHash = backupNormalized.length >= 8 ? hashResetToken(backupNormalized) : null;
  const backupIndex = backupHash ? user.totpBackupHashes.indexOf(backupHash) : -1;
  const backupOk = backupIndex >= 0;

  if (!totpOk && !backupOk) {
    const attempts = challenge.attempts + 1;
    await prisma.twoFactorChallenge.update({
      where: { id: challenge.id },
      data: {
        attempts,
        consumedAt: attempts >= TWO_FACTOR_MAX_ATTEMPTS ? new Date() : undefined,
      },
    });
    if (attempts >= TWO_FACTOR_MAX_ATTEMPTS) {
      return { ok: false as const, error: "Trop de tentatives. Reconnectez-vous." };
    }
    return { ok: false as const, error: "Code incorrect." };
  }

  const nextHashes = backupOk
    ? user.totpBackupHashes.filter((_, i) => i !== backupIndex)
    : user.totpBackupHashes;

  await prisma.$transaction([
    prisma.twoFactorChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), totpBackupHashes: nextHashes },
    }),
  ]);
  await writeAuditLog({
    action: "USER_LOGIN",
    actorId: user.id,
    ip,
    metadata: { twoFactor: true, method: totpOk ? "totp" : "backup" },
  });
  return { ok: true as const, user: toSessionUser(user) };
}

export async function enableTwoFactorForUser(userId: string, secret?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Compte introuvable.");
  const totpSecret = secret ?? generateTotpSecret();
  const backups = generateBackupCodes(8);
  const totpBackupHashes = backups.map((code) => hashResetToken(normalizeBackupCode(code)));
  await prisma.user.update({
    where: { id: userId },
    data: {
      totpSecret,
      totpEnabledAt: new Date(),
      totpBackupHashes,
    },
  });
  return {
    totpSecret,
    backups,
    otpauthUrl: totpAuthUrl(totpSecret, user.email),
  };
}

async function issueEmailVerification(env: Env, user: User): Promise<{ sent: boolean; message?: string }> {
  const plain = generateToken(48);
  const tokenHash = hashResetToken(plain);
  await prisma.emailVerificationToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  if (!mailConfigured(env)) {
    return { sent: false, message: mailUnavailableMessage() };
  }
  const content = verificationEmailText(env.APP_ORIGIN, plain);
  const sent = await sendMail(env, { to: user.email, subject: content.subject, text: content.text });
  if (!sent.ok) {
    return { sent: false, message: mailFailedMessage() };
  }
  return { sent: true, message: "Un e-mail a été envoyé à cette adresse." };
}

export async function registerPartner(env: Env, input: z.infer<typeof registerPartnerSchema>) {
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
      termsAcceptedAt: new Date(),
      partnerProfile: {
        create: {
          organizationName: input.organizationName ?? input.displayName,
          partnerType: input.partnerType ?? "SUPPLIER",
          zone: input.zone,
          description: input.description,
          status: "DRAFT",
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
  const verification = await issueEmailVerification(env, user);
  return { ok: true as const, user: toSessionUser(user), verification };
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

export async function requestPasswordReset(
  env: Env,
  input: z.infer<typeof passwordResetRequestSchema>,
  ip?: string,
) {
  const email = input.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!mailConfigured(env)) {
    return { ok: true as const, sent: false as const, message: mailUnavailableMessage() };
  }
  if (!user) {
    return {
      ok: true as const,
      sent: false as const,
      message: "Aucun e-mail n’a été envoyé.",
    };
  }
  const plain = generateToken(48);
  const tokenHash = hashResetToken(plain);
  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
      },
    }),
  ]);
  await writeAuditLog({ action: "PASSWORD_RESET_REQUEST", actorId: user.id, ip });
  const staff = isStaffRole(user.role);
  const origin = staff ? (env.ADMIN_ORIGIN ?? env.APP_ORIGIN) : env.APP_ORIGIN;
  const path = staff ? "/mot-de-passe/nouveau" : "/espace-partenaire/mot-de-passe/nouveau";
  const content = passwordResetEmailText(origin, plain, path);
  const sent = await sendMail(env, { to: user.email, subject: content.subject, text: content.text });
  if (!sent.ok) {
    return { ok: true as const, sent: false as const, message: mailFailedMessage() };
  }
  return {
    ok: true as const,
    sent: true as const,
    message: "Un e-mail a été envoyé à cette adresse.",
    devToken: process.env.NODE_ENV === "development" ? plain : undefined,
  };
}

export async function confirmPasswordReset(input: z.infer<typeof passwordResetConfirmSchema>, ip?: string) {
  const match = await prisma.passwordResetToken.findFirst({
    where: { tokenHash: hashResetToken(input.token), usedAt: null, expiresAt: { gt: new Date() } },
  });
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

export async function requestEmailVerification(env: Env, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { ok: false as const, error: "Compte introuvable." };
  }
  if (user.emailVerifiedAt) {
    return { ok: true as const, sent: false as const, alreadyVerified: true as const, message: "Cette adresse est déjà vérifiée." };
  }
  const result = await issueEmailVerification(env, user);
  return { ok: true as const, alreadyVerified: false as const, ...result };
}

export async function confirmEmailVerification(input: z.infer<typeof emailConfirmSchema>) {
  const match = await prisma.emailVerificationToken.findFirst({
    where: { tokenHash: hashResetToken(input.token), usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!match) {
    return { ok: false as const, error: "Lien invalide ou expiré.", expired: true as const };
  }
  await prisma.$transaction([
    prisma.user.update({
      where: { id: match.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({ where: { id: match.id }, data: { usedAt: new Date() } }),
  ]);
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
  const twoFactor = await enableTwoFactorForUser(user.id);
  await writeAuditLog({ action: "USER_CREATED", actorId: user.id, targetType: "User", targetId: user.id });
  return { user, twoFactor };
}
