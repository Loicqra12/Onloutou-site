import { test, expect } from "@playwright/test";

test.describe("conditions d’utilisation", () => {
  test("brouillon, noindex, sommaire, liens", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/conditions-utilisation", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#leg-hero-title")).toContainText("Conditions d’utilisation");
    await expect(page.getByText("Document en cours de validation")).toBeVisible();

    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots ?? "").toMatch(/noindex/i);

    await expect(
      page.locator('nav[aria-label="Documents associés"] a[href="/mentions-legales"]'),
    ).toBeVisible();
    await expect(
      page.locator('nav[aria-label="Documents associés"] a[href="/confidentialite"]'),
    ).toBeVisible();
    await expect(page.locator('nav[aria-label="Documents associés"] a[href="/cookies"]')).toBeVisible();
    await expect(page.locator('nav[aria-label="Documents associés"] a[href="/contact"]')).toBeVisible();
    await expect(page.locator('.site-footer-link[href="/conditions-utilisation"]')).toBeVisible();
    await expect(page.locator("#objet")).toBeVisible();
  });
});
