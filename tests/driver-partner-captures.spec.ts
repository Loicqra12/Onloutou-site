import { test } from "@playwright/test";

test.describe("captures devenir livreur", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/devenir-livreur", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/driver-partner-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/driver-partner-tablet-768.png", fullPage: true });

      await page.locator("#drv-profiles-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-partner-profiles-desktop.png" });

      await page.locator("#drv-vehicles-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-partner-vehicles-desktop.png" });

      await page.locator("#parcours-livreur").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-partner-journey-desktop.png" });

      await page.locator("#candidature-livreur").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-partner-form-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/driver-partner-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/driver-partner-mobile-320.png", fullPage: true });

      await page.locator("#candidature-livreur").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-partner-form-mobile.png" });
    }
  });
});
