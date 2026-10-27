import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function revealHome(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += 420) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 70));
    }
  });
}

async function shot(page: import("@playwright/test").Page, name: string, fullPage = false) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name), fullPage });
}

test.describe("captures projets et terrain", () => {
  test("desktop 1440", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "captures desktop");
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await revealHome(page);
    await page.locator("[data-section='terrain']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await shot(page, "terrain-method-desktop-1440.png");
    await page.locator("[data-section='projects']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await shot(page, "projects-showcase-desktop-1440.png");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("[data-section='terrain']").scrollIntoViewIfNeeded();
    await shot(page, "home-projects-terrain-desktop-1440.png", true);
    await expect(page.locator("[data-section='projects']")).toBeVisible();
    await expect(page.locator("[data-section='terrain']")).toBeVisible();
  });

  test("mobile 375", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "captures mobile");
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 375, height: 812 });
    await revealHome(page);
    await page.locator("[data-section='terrain']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await shot(page, "terrain-method-mobile-375.png");
    await page.locator("[data-section='projects']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await shot(page, "projects-showcase-mobile-375.png");
    await shot(page, "home-projects-terrain-mobile-375.png", true);
    await expect(page.locator(".home-show-count")).toHaveText("1 / 5");
    await expect(page.locator(".home-show-playback")).toHaveCount(0);
  });
});
