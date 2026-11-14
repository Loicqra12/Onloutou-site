import { describe, expect, it } from "vitest";
import { totpAt, totpAuthUrl, totpNow, verifyTotp } from "./totp.js";

const SECRET = "ONLOUTOUADMIN2FADEVAAA";

describe("totp", () => {
  it("vérifie le code courant et refuse un code faux", () => {
    const now = Date.UTC(2026, 10, 14, 0, 0, 0);
    const code = totpAt(SECRET, Math.floor(now / 1000));
    expect(code).toMatch(/^\d{6}$/);
    expect(verifyTotp(SECRET, code, now)).toBe(true);
    expect(verifyTotp(SECRET, "000000", now)).toBe(false);
  });

  it("accepte le pas précédent (fenêtre)", () => {
    const now = Date.UTC(2026, 10, 14, 0, 0, 20);
    const previous = totpAt(SECRET, Math.floor(now / 1000) - 30);
    expect(verifyTotp(SECRET, previous, now)).toBe(true);
  });

  it("produit une URI otpauth", () => {
    expect(totpAuthUrl(SECRET, "t63-admin@onloutou.test")).toContain("otpauth://totp/");
    expect(totpAuthUrl(SECRET, "t63-admin@onloutou.test")).toContain("secret=ONLOUTOUADMIN2FADEVAAA");
  });

  it("totpNow est cohérent avec totpAt", () => {
    const t = Date.now();
    expect(totpNow(SECRET, t)).toBe(totpAt(SECRET, Math.floor(t / 1000)));
  });
});
