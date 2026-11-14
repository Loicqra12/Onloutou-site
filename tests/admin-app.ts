import { createHmac } from "node:crypto";
import type { Page } from "@playwright/test";

export const ADMIN_ORIGIN = (process.env.ADMIN_ORIGIN ?? "http://127.0.0.1:3001").replace(/\/$/, "");
export const ADMIN_TOTP_SECRET = process.env.E2E_ADMIN_TOTP_SECRET ?? "ONLOUTOUADMIN2FADEVAAA";

export function adminUrl(path: string) {
  return `${ADMIN_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function decodeBase32(input: string): Buffer {
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

export function totpNow(secretBase32: string, at = Date.now()): string {
  const counter = Math.floor(at / 1000 / 30);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", decodeBase32(secretBase32)).update(buf).digest();
  const offset = hmac[hmac.length - 1]! & 0x0f;
  const bin =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);
  return String(bin % 1_000_000).padStart(6, "0");
}

export async function adminLogin(page: Page, email: string, password: string) {
  await page.goto(adminUrl("/login"));
  await page.locator("#adm-email").fill(email);
  await page.locator("#adm-password").fill(password);
  await page.getByRole("button", { name: /Continuer/ }).click();
  await page.waitForURL(/\/verification/, { timeout: 30_000 });
  await page.locator("#adm-otp").fill(totpNow(ADMIN_TOTP_SECRET));
  await page.getByRole("button", { name: /Vérifier et accéder/ }).click();
  await page.waitForURL((url) => new URL(url).pathname === "/", { timeout: 30_000 });
}
