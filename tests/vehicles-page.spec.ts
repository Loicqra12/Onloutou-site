import { test, expect } from "@playwright/test";

test.describe("page véhicules professionnels", () => {
  test("H1, profils, location, vente, demande, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements/vehicules", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#veh-hero-title")).toContainText("la mission à accomplir");

    await page.locator("#profils-vehicules").scrollIntoViewIfNeeded();
    await page.waitForSelector(".veh-profiles--enhanced");
    await page.getByRole("tab", { name: /Utilitaire léger/i }).click();
    await expect(page.locator(".veh-profiles__panel--active")).toContainText("logistique légère");

    await page.getByRole("link", { name: "Explorer la location" }).first().click();
    await expect(page).toHaveURL(/\/solutions\/location/);

    await page.goto("/equipements/vehicules");
    await page.getByRole("link", { name: "Explorer l’acquisition" }).click();
    await expect(page).toHaveURL(/\/solutions\/vente/);

    await page.goto("/equipements/vehicules#demande-vehicule");
    await page.locator('input[name="veh-profile"][value="pick-up"]').check();
    await expect(page.locator(".veh-request__summary-text")).toContainText("pick-up");

    const whatsapp = page.getByRole("link", { name: "Envoyer ma demande sur WhatsApp" });
    expect(await whatsapp.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /disponibles/i }).first().click();
    await page.locator("#veh-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#veh-hero-title")).toBeVisible();
  });

  test("méga-menu Équipements — véhicules", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Véhicules professionnels" }).first()).toHaveAttribute(
      "href",
      "/equipements/vehicules",
    );
  });
});
