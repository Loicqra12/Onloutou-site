import { test } from "@playwright/test";

test.describe("captures équipements connectés", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements/equipements-connectes", { waitUntil: "networkidle" });
    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/connected-equipment-desktop-1440.png", fullPage: true });
      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/connected-equipment-tablet-1024.png", fullPage: true });
      await page.locator("#dispositifs").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/connected-equipment-devices-desktop.png" });
      await page.locator("#demande-connectee").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/connected-equipment-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/connected-equipment-mobile-375.png", fullPage: true });
      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/connected-equipment-mobile-320.png", fullPage: true });
      await page.locator("#demande-connectee").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/connected-equipment-request-mobile.png" });
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/equipements/equipements-connectes", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/connected-equipment-reduced-motion.png", fullPage: true });
  });
});
