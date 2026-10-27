import { test, expect } from "@playwright/test";

test.describe("page équipements connectés", () => {
  test("H1, architecture, explorateur, WhatsApp, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements/equipements-connectes", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#cec-hero-title")).toContainText("une supervision utile");

    await page.locator("#architecture-connectee").scrollIntoViewIfNeeded();
    await expect(page.locator(".cec-arch__svg")).toHaveAttribute("src", /onloutou-geolocalisation-animee\.svg/);

    await page.waitForSelector(".cec-explorer--enhanced");
    await page.getByRole("tab", { name: /sans alimentation permanente/i }).click();
    await expect(page.locator(".cec-explorer__panel--active")).toContainText("autonomie");

    await page.goto("/equipements/equipements-connectes#demande-connectee");
    await page.getByRole("radio", { name: /localisation/i }).check();
    await expect(page.locator(".cec-request__summary-text")).toContainText("localisation");

    const whatsapp = page.getByRole("link", { name: "Envoyer ma demande par WhatsApp" });
    expect(await whatsapp.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.getByRole("link", { name: "Découvrir la géolocalisation" }).first().click();
    await expect(page).toHaveURL(/\/solutions\/geolocalisation/);

    await page.goto("/equipements/equipements-connectes");
    await page.locator("details summary", { hasText: /traceur filaire/i }).click();
    await expect(page.locator("details", { hasText: /traceur filaire/i })).toBeVisible();
  });

  test("méga-menu Équipements connectés", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Équipements connectés" }).first()).toHaveAttribute(
      "href",
      "/equipements/equipements-connectes",
    );
  });
});
