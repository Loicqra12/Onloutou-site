import { test, expect } from "@playwright/test";

test.describe("page outils et matériels", () => {
  test("H1, familles, location, demande, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements/outils-materiels", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#tem-hero-title")).toContainText("le travail à accomplir");

    await page.locator("#familles-materiels").scrollIntoViewIfNeeded();
    await page.waitForSelector(".tem-families--enhanced");
    await page.getByRole("tab", { name: /Énergie et autonomie/i }).click();
    await expect(page.locator(".tem-families__panel--active")).toContainText("groupes électrogènes");

    await page.getByRole("link", { name: "Explorer la location" }).first().click();
    await expect(page).toHaveURL(/\/solutions\/location/);

    await page.goto("/equipements/outils-materiels#demande-materiel");
    await page.getByRole("radio", { name: /énergie et autonomie/i }).check();
    await expect(page.locator(".tem-request__summary-text")).toContainText("énergie et autonomie");

    const whatsapp = page.getByRole("link", { name: "Envoyer ma demande par WhatsApp" });
    expect(await whatsapp.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /accessoires sont-ils inclus/i }).click();
    await expect(page.locator("details", { hasText: /accessoires sont-ils inclus/i })).toBeVisible();

    await page.locator("#tem-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#tem-hero-title")).toBeVisible();
  });

  test("méga-menu Outils", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Outils & matériels" }).first()).toHaveAttribute(
      "href",
      "/equipements/outils-materiels",
    );
  });
});
