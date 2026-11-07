import { test } from "@playwright/test";

test.describe("captures motos", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements/motos", { waitUntil: "networkidle" });
    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/motorcycles-desktop-1440.png", fullPage: true });
      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/motorcycles-tablet-1024.png", fullPage: true });
      await page.locator("#profils-motos").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/motorcycles-profiles-desktop.png" });
      await page.locator("#demande-moto").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/motorcycles-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/motorcycles-mobile-375.png", fullPage: true });
      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/motorcycles-mobile-320.png", fullPage: true });
      await page.locator("#demande-moto").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/motorcycles-request-mobile.png" });
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/equipements/motos", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/motorcycles-reduced-motion.png", fullPage: true });
  });
});
