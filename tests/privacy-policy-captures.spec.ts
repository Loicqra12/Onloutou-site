import { test } from "@playwright/test";

test.describe("captures politique confidentialité", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/confidentialite", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/privacy-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/privacy-tablet-768.png", fullPage: true });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator(".leg-status").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/privacy-draft-status.png" });

      await page.getByTestId("privacy-data-table").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/privacy-data-table.png" });

      await page.getByTestId("privacy-third-parties").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/privacy-third-parties.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/privacy-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/privacy-mobile-320.png", fullPage: true });
    }
  });
});
