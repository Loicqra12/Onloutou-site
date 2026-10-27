import { test, expect } from "@playwright/test";

test.describe("page vente", () => {
  test("H1, familles, comparaison, demande WhatsApp, FAQ", async ({ page }) => {
    await page.goto("/solutions/vente", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#sales-hero-title")).toBeVisible();

    await page.locator("#familles-equipements").scrollIntoViewIfNeeded();
    await page.waitForSelector(".sales-families--enhanced");
    await page.getByRole("tab", { name: "Outils et matériels" }).click();
    await expect(page.locator(".sales-families__panel--active")).toContainText("Groupes électrogènes");

    await expect(page.getByRole("link", { name: "Découvrir la location" })).toHaveAttribute(
      "href",
      "/solutions/location",
    );

    await page.locator('input[name="sales-family"][value="moto"]').check();
    await page.locator('input[name="sales-usage"][value="chantier"]').check();
    await expect(page.locator(".sales-builder__summary")).toContainText("moto");
    await expect(page.locator(".sales-builder__summary")).toContainText("chantier");

    const whatsapp = page.getByRole("link", { name: "Envoyer sur WhatsApp" });
    const href = await whatsapp.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(href ?? "")).toContain("moto");

    await page.locator("details summary", { hasText: /en stock/i }).click();
    await page.locator("#sales-final-cta-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#sales-hero-title")).toBeVisible();
  });

  test("méga-menu Acheter", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions");
    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    await expect(page.locator("#mega-solutions a", { hasText: "Acheter" }).first()).toHaveAttribute(
      "href",
      "/solutions/vente",
    );
  });
});
