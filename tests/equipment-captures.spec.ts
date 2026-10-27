import { test } from "@playwright/test";

test.describe("captures hub équipements", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/equipment-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/equipment-tablet-1024.png", fullPage: true });

      await page.locator("#univers-equipements").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/equipment-universe-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/equipment-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/equipment-mobile-320.png", fullPage: true });

      await page.locator("#orientation-equipement").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/equipment-orientation-mobile.png" });
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/equipment-reduced-motion.png", fullPage: true });
  });
});
