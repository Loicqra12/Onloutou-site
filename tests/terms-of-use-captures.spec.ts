import { test } from "@playwright/test";

test.describe("captures conditions d’utilisation", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/conditions-utilisation", { waitUntil: "domcontentloaded" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({
        path: "docs/captures/final-audit/after/conditions-utilisation-desktop-1440.png",
        fullPage: true,
      });
      await page.screenshot({
        path: "docs/captures/final-audit/after/conditions-utilisation-desktop.png",
        fullPage: true,
      });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/terms-of-use-tablet-768.png", fullPage: true });

      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator(".leg-doc__header").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/terms-of-use-draft-status.png" });

      await page.locator(".leg-toc").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/terms-of-use-table-of-contents.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({
        path: "docs/captures/final-audit/after/conditions-utilisation-mobile-375.png",
        fullPage: true,
      });
      await page.screenshot({
        path: "docs/captures/final-audit/after/conditions-utilisation-mobile.png",
        fullPage: true,
      });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/terms-of-use-mobile-320.png", fullPage: true });
    }
  });
});
