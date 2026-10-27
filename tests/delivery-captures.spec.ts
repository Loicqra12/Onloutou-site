import { test } from "@playwright/test";

test.describe("captures livraison", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/livraison", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/delivery-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/delivery-tablet-768.png", fullPage: true });

      await page.locator("#fonctionnement-livraison").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/delivery-journey-desktop.png" });

      await page.locator("#dlv-logistics-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/delivery-logistics-desktop.png" });

      await page.locator("#devenir-livreur").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/delivery-driver-desktop.png" });

      await page.locator("#demande-livraison").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/delivery-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/delivery-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/delivery-mobile-320.png", fullPage: true });

      await page.locator("#demande-livraison").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/delivery-request-mobile.png" });
    }
  });
});
