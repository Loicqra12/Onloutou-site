import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name), fullPage });
}

test.describe("captures gestion de flotte", () => {
  test("desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "networkidle" });
    await shot(page, "fleet-management-desktop-1440.png", true);

    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "networkidle" });
    await shot(page, "fleet-management-tablet-1024.png", true);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/gestion-de-flotte#tableaux-de-bord", { waitUntil: "networkidle" });
    await page.locator("#flx-reporting-title").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await shot(page, "fleet-management-dashboard.png");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "networkidle" });
    await shot(page, "fleet-management-reduced-motion.png", true);
  });

  test("mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "networkidle" });
    await shot(page, "fleet-management-mobile-375.png", true);

    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "networkidle" });
    await shot(page, "fleet-management-mobile-320.png", true);
    await expect(page.locator("#flx-hero-title")).toBeVisible();
  });
});
