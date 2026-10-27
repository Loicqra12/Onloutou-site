import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name), fullPage });
}

test.describe("captures location", () => {
  test("desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await shot(page, "rental-desktop-1440.png", true);

    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await shot(page, "rental-tablet-1024.png", true);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/location#categories-location", { waitUntil: "networkidle" });
    await page.locator("#rental-categories-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await shot(page, "rental-categories-desktop.png");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await shot(page, "rental-reduced-motion.png", true);
  });

  test("mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await shot(page, "rental-mobile-375.png", true);

    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/solutions/location#demande-location", { waitUntil: "networkidle" });
    await page.locator("#rental-builder-title").scrollIntoViewIfNeeded();
    await shot(page, "rental-brief-mobile.png", true);
    await shot(page, "rental-mobile-320.png", true);
    await expect(page.locator("#rental-hero-title")).toBeVisible();
  });
});
