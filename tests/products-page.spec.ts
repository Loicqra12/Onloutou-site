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

    // WhatsApp n'est proposé qu'après l'enregistrement du dossier (étape facultative, avec la référence).
    await expect(page.getByRole("link", { name: "Envoyer ma demande par WhatsApp" })).toHaveCount(0);
    await requestSection.getByLabel(/nom ou structure/i).fill("Awa Koné");
    await requestSection.getByLabel(/^téléphone/i).fill("07 12 34 56 78");
    await requestSection.getByRole("button", { name: /Enregistrer/ }).click();
    const saved = requestSection.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(saved).toBeVisible();
    const waHref = (await saved.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(waHref).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(waHref.replace(/\+/g, " "))).toMatch(/ONL-/);

    await page.locator("details summary", { hasText: /Comment obtenir un prix/i }).click();
    await expect(page.locator("details", { hasText: /Comment obtenir un prix/i })).toBeVisible();
  });
});
