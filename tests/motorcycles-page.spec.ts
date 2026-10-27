import { test, expect } from "@playwright/test";

test.describe("page motos professionnelles", () => {
  test("H1, profils, location, vente, demande, FAQ, pas inscription livreur", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements/motos", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#mot-hero-title")).toContainText("le rythme du terrain");

    await page.locator("#profils-motos").scrollIntoViewIfNeeded();
    await page.waitForSelector(".mot-profiles--enhanced");
    await page.getByRole("tab", { name: /Moto utilitaire/i }).click();
    await expect(page.locator(".mot-profiles__panel--active")).toContainText("livraison");

    await page.getByRole("link", { name: "Explorer la location" }).first().click();
    await expect(page).toHaveURL(/\/solutions\/location/);

    await page.goto("/equipements/motos");
    await page.getByRole("link", { name: "Explorer l’acquisition" }).click();
    await expect(page).toHaveURL(/\/solutions\/vente/);

    await page.goto("/equipements/motos#demande-moto");
    await page.locator('input[name="moto-profile"][value="moto utilitaire"]').check();
    await expect(page.locator(".mot-request__summary-text")).toContainText("moto utilitaire");

    const whatsapp = page.getByRole("link", { name: "Envoyer ma demande sur WhatsApp" });
    expect(await whatsapp.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /devenir livreur/i }).click();
    await expect(page.locator("details", { hasText: /devenir livreur/i })).toContainText("ne constitue pas");

    await page.locator("#mot-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#mot-hero-title")).toBeVisible();
    await expect(page.locator('a[href="/espace-livreur"]')).toHaveCount(0);
  });

  test("méga-menu Motos", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Motos & deux-roues" }).first()).toHaveAttribute(
      "href",
      "/equipements/motos",
    );
  });
});
