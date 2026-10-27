import { test, expect } from "@playwright/test";

test.describe("page hub équipements", () => {
  test("H1, familles, location, vente, orientation, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#equip-hero-title")).toBeVisible();
    await expect(page.locator("#equip-hero-title")).toContainText("la réalité de vos opérations");

    await page.locator("#univers-equipements").scrollIntoViewIfNeeded();
    await page.waitForSelector(".equip-universe--enhanced");
    await page.getByRole("tab", { name: /Outils et matériels/i }).click();
    await expect(page.locator(".equip-universe__panel--active")).toContainText("Intervention technique");

    await page.getByRole("link", { name: "Découvrir la location" }).first().click();
    await expect(page).toHaveURL(/\/solutions\/location/);

    await page.goto("/equipements#orientation-equipement");
    await page.locator('input[name="equip-mode"][value="acheter"]').check();
    await page.locator('input[name="equip-family"][value="véhicule"]').check();
    await expect(page.locator(".equip-orient__summary-text")).toContainText("acheter");
    await expect(page.locator(".equip-orient__summary-text")).toContainText("véhicule");

    const whatsapp = page.getByRole("link", { name: "Envoyer mon besoin sur WhatsApp" });
    const href = await whatsapp.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);

    await page.getByRole("link", { name: "Explorer l’acquisition" }).click();
    await expect(page).toHaveURL(/\/solutions\/vente/);

    await page.goto("/equipements");
    await page.locator("details summary", { hasText: /images correspondent/i }).click();
    await page.locator("#equip-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#equip-hero-title")).toBeVisible();
  });

  test("méga-menu Équipements", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Vue d'ensemble" }).first()).toHaveAttribute(
      "href",
      "/equipements",
    );
  });
});
