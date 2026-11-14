import { describe, expect, it } from "vitest";
import { sniffMime } from "../modules/documents/storage.js";
import { generateRequestReference, hashResetToken } from "./tokens.js";

describe("generateRequestReference", () => {
  it("produces unique ONL prefixes", () => {
    const a = generateRequestReference(new Date("2026-11-05T12:00:00Z"));
    const b = generateRequestReference(new Date("2026-11-05T12:00:00Z"));
    expect(a).toMatch(/^ONL-20261105-[0-9A-Z]{6}$/);
    expect(b).toMatch(/^ONL-20261105-/);
    expect(a).not.toBe(b);
  });
});

describe("hashResetToken", () => {
  it("est déterministe et dépend du secret", () => {
    const secret = "a".repeat(32);
    expect(hashResetToken("jeton", secret)).toBe(hashResetToken("jeton", secret));
    expect(hashResetToken("jeton", secret)).not.toBe(hashResetToken("jeton", "b".repeat(32)));
    expect(hashResetToken("jeton", secret)).not.toBe("jeton");
  });
});

describe("sniffMime", () => {
  it("reconnaît les formats autorisés par leurs premiers octets", () => {
    expect(sniffMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]))).toBe("image/jpeg");
    expect(sniffMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))).toBe("image/png");
    expect(sniffMime(Buffer.from("RIFF0000WEBPVP8 "))).toBe("image/webp");
    expect(sniffMime(Buffer.from("%PDF-1.7\n"))).toBe("application/pdf");
  });

  it("refuse un faux fichier déclaré comme image", () => {
    expect(sniffMime(Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'></svg>"))).toBeNull();
    expect(sniffMime(Buffer.from("<html><script>alert(1)</script></html>"))).toBeNull();
  });
});
