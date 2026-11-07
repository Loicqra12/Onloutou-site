import { test } from "@playwright/test";

test.describe("captures outils et matériels", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/equipements/outils-materiels", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/tools-materials-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/tools-materials-tablet-768.png", fullPage: true });

      await page.locator("#familles-materiels").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/tools-materials-families-desktop.png" });

      await page.locator("#demande-materiel").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/tools-materials-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/tools-materials-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/tools-materials-mobile-320.png", fullPage: true });

      await page.locator("#demande-materiel").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/tools-materials-request-mobile.png" });
    }
  });
});