import { test } from "@playwright/test";

test.describe("captures équipements connectés", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements/equipements-connectes", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/connected-equipment-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/connected-equipment-tablet-768.png", fullPage: true });

      await page.locator("#architecture-connectee").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/connected-equipment-architecture-desktop.png" });

      await page.locator("#cec-install-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/connected-equipment-installation-desktop.png" });

      await page.locator("#cec-dash-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/connected-equipment-dashboard-desktop.png" });

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
  });
});
