import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name), fullPage });
}

test.describe("captures vente", () => {
  test("desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/vente", { waitUntil: "domcontentloaded" });
    await shot(page, "sales-desktop-1440.png", true);

    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/solutions/vente", { waitUntil: "domcontentloaded" });
    await shot(page, "sales-tablet-1024.png", true);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/vente#familles-equipements", { waitUntil: "domcontentloaded" });
    await page.locator("#sales-families-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await shot(page, "sales-families-desktop.png");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/solutions/vente", { waitUntil: "domcontentloaded" });
    await shot(page, "sales-reduced-motion.png", true);
  });

  test("mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/solutions/vente", { waitUntil: "domcontentloaded" });
    await shot(page, "sales-mobile-375.png", true);

    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/solutions/vente#demande-equipement", { waitUntil: "domcontentloaded" });
    await page.locator("#sales-builder-title").scrollIntoViewIfNeeded();
    await shot(page, "sales-request-mobile.png", true);
    await shot(page, "sales-mobile-320.png", true);
    await expect(page.locator("#sales-hero-title")).toBeVisible();
  });
});
