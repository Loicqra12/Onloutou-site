import { test, expect } from "@playwright/test";
import { assertHomeSectionsVisible, scrollHome } from "./motion-helpers";

const CYCLES = 16;

test.describe("régression — sections masquées", () => {
  test("reste visible après scroll, navigation et rechargement", async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    const label = testInfo.project.name;

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1600);
    await assertHomeSectionsVisible(page, `${label}-load`);

    await scrollHome(page);
    await assertHomeSectionsVisible(page, `${label}-scroll`);

    const fleet = page.locator("[data-section='fleet']");
    await fleet.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const caps = page.locator(".home-fleet-cap");
    if (await caps.count()) {
      await caps.nth(1).click();
      await page.waitForTimeout(200);
      await expect(fleet).toHaveAttribute("data-motion-state", "visible");
      const headingOpacity = await page.locator(".home-fleet-heading").evaluate((el) => getComputedStyle(el).opacity);
      expect(Number(headingOpacity)).toBeGreaterThan(0.9);
    }

    for (let cycle = 1; cycle <= CYCLES; cycle += 1) {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.45));
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(200);
      await page.goto("/solutions");
      await page.waitForLoadState("domcontentloaded");
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.goto("/contact");
      await page.waitForLoadState("domcontentloaded");
      await page.goBack();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(250);
      await assertHomeSectionsVisible(page, `${label}-cycle-${cycle}`);
    }
  });

  test("reste visible aux largeurs 320, 768 et 1024", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "variantes de largeur sur un seul projet");
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1600);
      await scrollHome(page);
      await assertHomeSectionsVisible(page, `width-${width}`);
    }
  });

  test("contenu lisible sans JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Équiper le terrain/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Un actif à connecter/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Des projets construits pour le terrain/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Du terrain à la supervision/i })).toBeVisible();
    const opacity = await page.locator("[data-section='projects']").evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.9);
    await context.close();
  });
});
