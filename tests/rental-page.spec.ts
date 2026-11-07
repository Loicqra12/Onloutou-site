import { test, expect } from "@playwright/test";

test.describe("page location", () => {
  test("H1, catégories, brief WhatsApp, FAQ, visibilité", async ({ page }) => {
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#rental-hero-title")).toBeVisible();
    await expect(page.locator("#rental-hero-title")).toContainText("Louer un véhicule ou du matériel en Côte d’Ivoire");
    const cta = page.getByRole("link", { name: "Faire une demande de location" }).first();
    await expect(cta).toHaveAttribute("href", "#demande-location");
    await expect(page.locator("#etapes-location li")).toHaveCount(4);

    await page.locator('input[name="rental-need"][value="moto"]').check();
    await page.locator('input[name="rental-duration"][value="quelques jours"]').check();
    await expect(page.locator(".rental-builder__summary")).toContainText("moto");
    await expect(page.locator(".rental-builder__summary")).toContainText("quelques jours");

    // WhatsApp n'est proposé qu'après l'enregistrement du dossier (étape facultative, avec la référence).
    await expect(page.locator(".rental-builder__whatsapp")).toHaveCount(0);
    await page.getByLabel(/nom ou structure/i).fill("Awa Koné");
    await page.getByLabel(/^téléphone/i).fill("07 12 34 56 78");
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    const saved = page.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(saved).toBeVisible();
    const href = await saved.getByRole("link", { name: /WhatsApp/ }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent((href ?? "").replace(/\+/g, " "))).toContain("moto");
    expect(decodeURIComponent((href ?? "").replace(/\+/g, " "))).toMatch(/ONL-/);

    await page.locator("details summary", { hasText: /disponibles immédiatement/i }).click();

    await page.locator("#rental-final-cta-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#rental-final-cta-title")).toBeVisible();
    await page.locator("#rental-hero-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#rental-hero-title")).toBeVisible();
  });

  test("méga-menu Louer", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions");
    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    const louer = page.locator("#mega-solutions a", { hasText: "Location d'équipements" }).first();
    await expect(louer).toHaveAttribute("href", "/solutions/location");
  });
});
