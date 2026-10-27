import { test, expect } from "@playwright/test";

test.describe("page camions et engins", () => {
  test("H1, profils, location, vente, demande, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements/camions-engins", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#heq-hero-title")).toContainText("la mission et le terrain");

    await page.locator("#profils-camions-engins").scrollIntoViewIfNeeded();
    await page.waitForSelector(".heq-profiles--enhanced");
    await page.getByRole("tab", { name: /Camion-benne/i }).click();
    await expect(page.locator(".heq-profiles__panel--active")).toContainText("matériaux");

    await page.getByRole("link", { name: "Explorer la location" }).first().click();
    await expect(page).toHaveURL(/\/solutions\/location/);

    await page.goto("/equipements/camions-engins");
    await page.getByRole("link", { name: "Explorer l’acquisition" }).click();
    await expect(page).toHaveURL(/\/solutions\/vente/);

    await page.goto("/equipements/camions-engins#demande-camion-engin");
    await page.locator('input[name="heq-category"][value="camion-benne"]').check();
    await expect(page.locator(".heq-request__summary-text")).toContainText("camion-benne");

    const whatsapp = page.getByRole("link", { name: "Envoyer ma demande sur WhatsApp" });
    expect(await whatsapp.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /chauffeur ou un opérateur/i }).click();
    await expect(page.locator("details", { hasText: /chauffeur ou un opérateur/i })).toContainText("pas inclus");

    await page.locator("#heq-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#heq-hero-title")).toBeVisible();
    await expect(page.locator("#heq-safety-title")).toBeVisible();
  });

  test("méga-menu Camions et engins", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Camions et engins" }).first()).toHaveAttribute(
      "href",
      "/equipements/camions-engins",
    );
  });
});
