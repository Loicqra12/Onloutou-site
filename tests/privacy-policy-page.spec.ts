import { test, expect } from "@playwright/test";

test.describe("politique de confidentialité", () => {
  test("brouillon, noindex, sommaire, tables", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/confidentialite", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#leg-hero-title")).toContainText("Politique de confidentialité");
    await expect(page.getByText("Document en cours de validation")).toBeVisible();

    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots ?? "").toMatch(/noindex/i);

    await expect(page.locator('#cookies a[href="/cookies"]')).toBeVisible();
    await expect(page.locator("#responsable")).toBeVisible();
    await expect(
      page.locator('nav[aria-label="Sommaire de la politique de confidentialité"] a[href="#formulaires-whatsapp"]'),
    ).toBeVisible();
    await expect(page.getByTestId("privacy-data-table")).toBeVisible();
    await expect(page.getByTestId("privacy-third-parties")).toBeVisible();
    await expect(page.locator('#responsable a[href="/mentions-legales"]')).toBeVisible();
  });
});
