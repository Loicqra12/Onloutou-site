import { test, expect } from "@playwright/test";

test.describe("politique cookies", () => {
  test("brouillon, noindex, inventaire et bandeau", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/cookies", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#leg-hero-title")).toContainText("Politique relative aux cookies");
    await expect(page.getByRole("button", { name: "Imprimer" })).toBeVisible();
    await expect(page.getByText("Document en cours de validation")).toHaveCount(0);
    await expect(page.locator(".leg-cookies-hero-status")).toContainText("Technologies nécessaires uniquement");

    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots ?? "").toMatch(/noindex/i);

    await expect(page.getByTestId("cookies-inventory")).toBeVisible();
    await expect(page.getByTestId("consent-banner")).toBeVisible();
    await expect(page.locator(".leg-content a[href='/conditions-utilisation']")).toHaveCount(0);
    await expect(page.locator("#audit")).toBeVisible();
    await expect(page.locator('#contact a[href="/confidentialite"]')).toBeVisible();
  });

  test("la page cookies rouvre les réglages", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.addInitScript(() => {
      localStorage.setItem("onloutou-cookie-choice", JSON.stringify({ measure: false, marketing: false }));
    });
    await page.goto("/cookies", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("consent-banner")).toHaveCount(0);
    await page.locator("#preferences").getByRole("button", { name: "Gérer mes cookies" }).click();
    await expect(page.getByTestId("consent-banner")).toBeVisible();
    await expect(page.getByRole("switch", { name: "Mesure d’audience" })).toHaveAttribute("aria-checked", "false");
  });

  test("accueil : bandeau cookies, puis masqué après le choix nécessaire", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const banner = page.getByTestId("consent-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Aucun cookie publicitaire");
    await banner.getByRole("button", { name: "Uniquement les nécessaires" }).click();
    await expect(banner).toHaveCount(0);

    await page.getByRole("button", { name: "Gérer mes cookies" }).click();
    await expect(page.getByTestId("consent-banner")).toBeVisible();
    await expect(page.getByRole("switch", { name: "Mesure d’audience" })).toHaveAttribute("aria-checked", "false");
  });
});
