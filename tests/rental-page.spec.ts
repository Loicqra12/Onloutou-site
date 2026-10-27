import { test, expect } from "@playwright/test";

test.describe("page location", () => {
  test("H1, catégories, brief WhatsApp, FAQ, visibilité", async ({ page }) => {
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#rental-hero-title")).toBeVisible();
    await page.waitForSelector(".rental-categories--enhanced");

    await page.locator("#categories-location").scrollIntoViewIfNeeded();
    await page.getByRole("tab", { name: "Outils et matériels" }).click();
    await expect(page.locator(".rental-categories__panel--active")).toContainText("Groupe électrogène");

    await page.locator('input[name="rental-need"][value="moto"]').check();
    await page.locator('input[name="rental-duration"][value="quelques jours"]').check();
    await expect(page.locator(".rental-builder__summary")).toContainText("moto");
    await expect(page.locator(".rental-builder__summary")).toContainText("quelques jours");

    const whatsapp = page.locator(".rental-builder__whatsapp");
    const href = await whatsapp.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(href ?? "")).toContain("moto");

    await page.locator("details summary", { hasText: /disponibles immédiatement/i }).click();

    await page.locator("#rental-final-cta-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#rental-final-cta-title")).toBeVisible();
    await page.locator("#rental-hero-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#rental-hero-title")).toBeVisible();
  });

  test("méga-menu Louer", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions");
    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    const louer = page.locator("#mega-solutions a", { hasText: "Louer" }).first();
    await expect(louer).toHaveAttribute("href", "/solutions/location");
  });
});
