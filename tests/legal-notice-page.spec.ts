import { test, expect } from "@playwright/test";

test.describe("mentions légales", () => {
  test("brouillon, noindex, sommaire, pas de lien mort", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/mentions-legales", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#leg-hero-title")).toContainText("Mentions légales");
    await expect(page.getByText("Document en cours de validation")).toBeVisible();

    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots ?? "").toMatch(/noindex/i);

    await expect(page.locator('#donnees-personnelles a[href="/confidentialite"]')).toBeVisible();
    await expect(page.locator('#cookies a[href="/cookies"]')).toBeVisible();
    await expect(page.locator("#editeur")).toBeVisible();
    await expect(page.locator('nav[aria-label="Sommaire des mentions légales"] a[href="#hebergement"]')).toBeVisible();
  });
});
