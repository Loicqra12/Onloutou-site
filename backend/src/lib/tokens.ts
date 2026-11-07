import { customAlphabet } from "nanoid";

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
