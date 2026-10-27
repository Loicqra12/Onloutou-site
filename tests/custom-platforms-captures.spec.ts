import { test } from "@playwright/test";

const route = "/solutions/plateformes-sur-mesure";

test.describe("captures plateformes sur mesure", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto(route, { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/custom-platforms-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/custom-platforms-tablet-1024.png", fullPage: true });

      await page.locator("#roles-interfaces").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/custom-platforms-roles-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/custom-platforms-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/custom-platforms-mobile-320.png", fullPage: true });

      await page.locator("#brief-projet").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/custom-platforms-brief-mobile.png" });
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/custom-platforms-reduced-motion.png", fullPage: true });
  });
});
