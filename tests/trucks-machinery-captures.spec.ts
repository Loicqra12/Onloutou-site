import { test } from "@playwright/test";

test.describe("captures camions et engins", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements/camions-engins", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/trucks-machinery-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/trucks-machinery-tablet-1024.png", fullPage: true });

      await page.locator("#profils-camions-engins").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/trucks-machinery-profiles-desktop.png" });

      await page.locator("#demande-camion-engin").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/trucks-machinery-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/trucks-machinery-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/trucks-machinery-mobile-320.png", fullPage: true });

      await page.locator("#demande-camion-engin").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/trucks-machinery-request-mobile.png" });
    }
  });
});
