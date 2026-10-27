import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name), fullPage });
}

test.describe("captures visuelles", () => {
  test("accueil, CTA, footer, reduced-motion et noscript", async ({ page, browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "captures desktop dans ce test");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1800);
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y <= max; y += 500) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await shot(page, "home-full-1440.png", true);
    await page.locator("[data-section='contact-cta']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await shot(page, "home-cta-footer-1440.png");

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1600);
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y <= max; y += 500) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    await shot(page, "home-full-375.png", true);
    await page.locator("[data-section='contact-cta']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await shot(page, "home-cta-footer-375.png");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    await shot(page, "home-reduced-motion-1440.png", true);

    const noscript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const noscriptPage = await noscript.newPage();
    await noscriptPage.goto("/");
    await shot(noscriptPage, "home-noscript-1440.png", true);
    await noscript.close();

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    for (let i = 0; i < 6; i += 1) {
      await page.goto("/solutions");
      await page.goto("/");
    }
    await page.waitForTimeout(1600);
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y <= max; y += 500) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await shot(page, "home-after-navigations-1440.png", true);
    await expect(page.locator("[data-section='contact-cta']")).toBeVisible();
  });
});
