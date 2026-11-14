import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const BACKUP_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function encodeBase32(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

export function decodeBase32(input: string): Buffer {
  const clean = input.toUpperCase().replace(/=+$/g, "").replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = BASE32.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateTotpSecret(bytes = 20): string {
  return encodeBase32(randomBytes(bytes));
}

function hotp(secret: Buffer, counter: number, digits = 6): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const bin =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return String(bin % 10 ** digits).padStart(digits, "0");
}

export function totpAt(secretBase32: string, unixSeconds: number, period = 30): string {
  return hotp(decodeBase32(secretBase32), Math.floor(unixSeconds / period));
}

export function totpNow(secretBase32: string, at = Date.now()): string {
  return totpAt(secretBase32, Math.floor(at / 1000));
}

export function verifyTotp(secretBase32: string, code: string, at = Date.now(), window = 1): boolean {
  const normalized = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;
  const counter = Math.floor(at / 1000 / 30);
  const expectedBuf = Buffer.from(normalized);
  for (let i = -window; i <= window; i++) {
    const candidate = Buffer.from(hotp(decodeBase32(secretBase32), counter + i));
    if (candidate.length === expectedBuf.length && timingSafeEqual(candidate, expectedBuf)) {
      return true;
    }
  }
  return false;
}

export function totpAuthUrl(secretBase32: string, email: string, issuer = "ONLOUTOU"): string {
  const label = encodeURIComponent(`${issuer}:${email}`);
  const params = new URLSearchParams({
    secret: secretBase32,
    issuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30",
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

function randomBackupChunk(len: number): string {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += BACKUP_ALPHABET[bytes[i]! % BACKUP_ALPHABET.length];
  }
  return out;
}

export function generateBackupCodes(count = 8): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(`${randomBackupChunk(4)}-${randomBackupChunk(4)}`);
  }
  return [...codes];
}

export function normalizeBackupCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
