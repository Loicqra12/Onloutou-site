import { test, expect } from "@playwright/test";

test.describe("page géolocalisation", () => {
  test("route, contenu, onglets, FAQ et visibilité après scroll", async ({ page }, testInfo) => {
    await page.goto("/solutions/geolocalisation", { waitUntil: "domcontentloaded" });

    await expect(page.locator("#geo-hero-title")).toBeVisible();

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
      await expect(page.locator("#mega-solutions")).toBeVisible();
      const geoLink = page.locator("#mega-solutions").getByRole("link", { name: "Géolocalisation", exact: true });
      await expect(geoLink).toHaveAttribute("href", "/solutions/geolocalisation");
    }

    await page.getByRole("tab", { name: "Supervision" }).click();
    await expect(page.getByRole("tab", { name: "Supervision" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("tab", { name: "Localisation" })).toHaveAttribute("aria-selected", "true");

    await page.locator("details summary", { hasText: /compatible avec tous les véhicules/i }).click();

    const sectionIds = ["geo-hero-title", "geo-process-title", "geo-platform-title", "geo-final-cta-title"];
    for (const id of sectionIds) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, 0));
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
    }
  });

  test("méga-menu mobile — lien géolocalisation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "navigation mobile");
    await page.goto("/");
    await page.locator(".site-header-toggle").click();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
    const link = page.getByRole("link", { name: "Géolocalisation", exact: true });
    await expect(link).toHaveAttribute("href", "/solutions/geolocalisation");
  });
});
