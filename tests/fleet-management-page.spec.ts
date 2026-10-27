import { test, expect } from "@playwright/test";

test.describe("page gestion de flotte", () => {
  test("route, méga-menu, onglets, FAQ et visibilité", async ({ page }, testInfo) => {
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#fleet-hero-title")).toBeVisible();

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
      const link = page.locator("#mega-solutions").getByRole("link", { name: "Gestion de flotte", exact: true });
      await expect(link).toHaveAttribute("href", "/solutions/gestion-de-flotte");
    }

    await expect(page.getByRole("tab", { name: "Vue opérations" })).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "Vue cartographique" }).click();
    await expect(page.getByRole("tab", { name: "Vue cartographique" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: "Vue opérations" })).toHaveAttribute("aria-selected", "true");

    await page.locator("details summary", { hasText: /différence entre géolocalisation/i }).click();

    const ids = ["fleet-pilotage-title", "fleet-dashboard-title", "fleet-final-cta-title"];
    for (const id of ids) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, 0));
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
    }
  });

  test("méga-menu mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile");
    await page.goto("/");
    await page.locator(".site-header-toggle").click();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
    await expect(
      page.locator(".site-nav-mobile").getByRole("link", { name: "Gestion de flotte", exact: true }),
    ).toHaveAttribute("href", "/solutions/gestion-de-flotte");
  });
});
