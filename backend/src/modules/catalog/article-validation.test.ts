import { describe, expect, it } from "vitest";
import { detectDraftGap, validateUnavailabilities } from "./article-validation.js";

describe("validateUnavailabilities", () => {
  it("laisse 1 disponible sur 2 quand 1 est indisponible", () => {
    const result = validateUnavailabilities(2, [
      { startDate: "2026-11-20", endDate: "2026-11-25", quantity: 1 },
    ]);
    expect(result).toEqual({ ok: true });
  });

  it("rejette un chevauchement dont la somme dépasse le total", () => {
    const result = validateUnavailabilities(2, [
      { startDate: "2026-11-20", endDate: "2026-11-25", quantity: 2 },
      { startDate: "2026-11-24", endDate: "2026-11-26", quantity: 1 },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/2026-11-24/);
  });

  it("rejette une quantité supérieure au total", () => {
    const result = validateUnavailabilities(2, [
      { startDate: "2026-11-20", endDate: "2026-11-25", quantity: 3 },
    ]);
    expect(result.ok).toBe(false);
  });
});

describe("detectDraftGap", () => {
  it("signale les photos manquantes après l’identité", () => {
    expect(
      detectDraftGap({
        title: "Réfrigérateur 250 L",
        familySlug: "electromenager",
        categorySlug: "refrigerateurs",
        condition: "Bon état",
        description: "Un frigo.",
        imageCount: 0,
        terms: { quantity: 2, rentalMode: "UNIT", priceAmount: 18000, pricePeriod: "WEEK", minDuration: "1_WEEK", depositKind: "TO_DISCUSS", commune: "Cocody", pickup: true },
      }),
    ).toBe("photos");
  });
});
