import { test, expect } from "@playwright/test";

test.describe("page produits", () => {
  test("hero, familles, demande, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/produits", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#prd-hero-title")).toContainText("des usages réels");

    await page.locator("#familles-produits").scrollIntoViewIfNeeded();
    await expect(page.locator("#prd-families-title")).toBeVisible();

    const requestSection = page.locator("#demande-produit");
    await requestSection.scrollIntoViewIfNeeded();
    await requestSection.getByRole("radio", { name: /^véhicule$/i }).check();
    await expect(requestSection.locator(".prd-request__summary-text")).toContainText("véhicule");

    const wa = page.getByRole("link", { name: "Envoyer ma demande par WhatsApp" });
    expect(await wa.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /Comment obtenir un prix/i }).click();
    await expect(page.locator("details", { hasText: /Comment obtenir un prix/i })).toBeVisible();
  });
});
