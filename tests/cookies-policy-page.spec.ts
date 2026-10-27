import { test, expect } from "@playwright/test";

test.describe("politique cookies", () => {
  test("brouillon, noindex, inventaire, pas de bannière", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/cookies", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#leg-hero-title")).toContainText("Politique relative aux cookies");
    await expect(page.getByText("Document en cours de validation")).toBeVisible();
    await expect(page.locator(".leg-cookies-hero-status")).toContainText("Technologies nécessaires uniquement");

    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots ?? "").toMatch(/noindex/i);

    await expect(page.getByTestId("cookies-inventory")).toBeVisible();
    await expect(page.locator('[data-testid="consent-banner"]')).toHaveCount(0);
    await expect(page.locator('a[href="/conditions-utilisation"]')).toHaveCount(0);
    await expect(page.locator("#audit")).toBeVisible();
    await expect(page.locator('#contact a[href="/confidentialite"]')).toBeVisible();
  });

  test("accueil sans bannière cookies", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-testid="consent-banner"]')).toHaveCount(0);
  });
});
