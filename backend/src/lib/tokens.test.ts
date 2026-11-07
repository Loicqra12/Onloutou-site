import { describe, expect, it } from "vitest";
import { generateRequestReference } from "./tokens.js";

describe("generateRequestReference", () => {
  it("produces unique ONL prefixes", () => {
    const a = generateRequestReference(new Date("2026-11-05T12:00:00Z"));
    const b = generateRequestReference(new Date("2026-11-05T12:00:00Z"));
    expect(a).toMatch(/^ONL-20261105-[0-9A-Z]{6}$/);
    expect(b).toMatch(/^ONL-20261105-/);
    expect(a).not.toBe(b);
  });
});
