import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name), fullPage });
}

test.describe("captures géolocalisation", () => {
  test("desktop et plateforme", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "captures desktop");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/geolocalisation", { waitUntil: "networkidle" });
    await shot(page, "geolocation-desktop-1440.png", true);

    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/solutions/geolocalisation", { waitUntil: "networkidle" });
    await shot(page, "geolocation-tablet-1024.png", true);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/geolocalisation#plateforme", { waitUntil: "networkidle" });
    await page.locator("#glx-platform-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await shot(page, "geolocation-platform-desktop.png");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/solutions/geolocalisation", { waitUntil: "networkidle" });
    await shot(page, "geolocation-reduced-motion.png", true);
  });

  test("mobile 375 et 320", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "captures mobile");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/solutions/geolocalisation", { waitUntil: "networkidle" });
    await shot(page, "geolocation-mobile-375.png", true);

    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/solutions/geolocalisation", { waitUntil: "networkidle" });
    await shot(page, "geolocation-mobile-320.png", true);
    await expect(page.locator("#glx-hero-title")).toBeVisible();
  });
});
