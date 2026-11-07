import { test } from "@playwright/test";

test.describe("captures véhicules", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements/vehicules", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/vehicles-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/vehicles-tablet-1024.png", fullPage: true });

      await page.locator("#profils-vehicules").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/vehicles-profiles-desktop.png" });

      await page.locator("#demande-vehicule").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/vehicles-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/vehicles-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/vehicles-mobile-320.png", fullPage: true });

      await page.locator("#demande-vehicule").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/vehicles-request-mobile.png" });
    }
  });
});
