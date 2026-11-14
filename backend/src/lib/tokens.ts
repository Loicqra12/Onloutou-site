import { createHmac } from "node:crypto";
import { customAlphabet } from "nanoid";

/**
 * Empreinte déterministe d'un jeton de réinitialisation (HMAC-SHA256 avec le secret serveur).
 * Le jeton fait 48 caractères aléatoires : une empreinte rapide suffit, et elle permet une
 * recherche indexée (`tokenHash` unique) au lieu d'un parcours coûteux en Argon2.
 */
export function hashResetToken(plain: string, secret = process.env.SESSION_SECRET ?? ""): string {
  if (!secret) throw new Error("SESSION_SECRET manquant.");
  return createHmac("sha256", secret).update(plain).digest("hex");
}

const refSuffix = customAlphabet("0123456789ABCDEFGHJKMNPQRSTUVWXYZ", 6);

export function generateRequestReference(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `ONL-${y}${m}${d}-${refSuffix()}`;
}

export function generateToken(bytes = 32): string {
  return customAlphabet("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", bytes)();
}
