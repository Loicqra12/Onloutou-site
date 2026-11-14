import { test, expect } from "@playwright/test";

test.describe("page produits", () => {
  test("hero, recherche et univers", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/produits", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#prd-hero-title")).toContainText("Que cherchez-vous à louer");
    await expect(page.getByRole("link", { name: "Explorer les familles" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Parcourir les univers" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Articles du quotidien/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Matériel professionnel/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Demande sur mesure/ })).toBeVisible();
  });
});
