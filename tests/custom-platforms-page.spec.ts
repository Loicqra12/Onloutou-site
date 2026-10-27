import { test, expect } from "@playwright/test";

test.describe("page plateformes sur mesure", () => {
  test("H1, types, rôles, brief WhatsApp, FAQ, CTA", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions/plateformes-sur-mesure", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#platform-hero-title")).toBeVisible();
    await expect(page.locator("#platform-hero-title")).toContainText("adaptés à vos opérations");

    await page.locator("#types-plateformes").scrollIntoViewIfNeeded();
    await page.waitForSelector(".platform-types--tabs-ready");
    await page.getByRole("tab", { name: "Application mobile" }).click();
    await expect(page.locator(".platform-types__panel--active")).toContainText("Accès terrain");

    await page.locator("#roles-interfaces").scrollIntoViewIfNeeded();
    await page.waitForSelector(".platform-roles--tabs-ready");
    await page.locator("#roles-interfaces").getByRole("tab", { name: "Partenaire" }).click();
    await expect(page.locator(".platform-roles__panel--active")).toContainText("Éléments à traiter");

    await page.locator("#brief-projet").scrollIntoViewIfNeeded();
    await page.locator('input[name="platform-solution"][value="tableau de bord"]').check();
    await page.locator('input[name="platform-users"][value="partenaires"]').check();
    await expect(page.locator(".platform-brief__summary-text")).toContainText("tableau de bord");
    await expect(page.locator(".platform-brief__summary-text")).toContainText("partenaires");

    const whatsapp = page.getByRole("link", { name: "Envoyer mon brief sur WhatsApp" });
    const href = await whatsapp.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(href ?? "")).toContain("tableau");

    await page.locator("details summary", { hasText: /cahier des charges/i }).click();
    await page.locator("#platform-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#platform-hero-title")).toBeVisible();
  });

  test("méga-menu Construire", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions");
    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    await expect(page.locator("#mega-solutions a", { hasText: "Construire" }).first()).toHaveAttribute(
      "href",
      "/solutions/plateformes-sur-mesure",
    );
  });
});
