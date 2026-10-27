import { test } from "@playwright/test";

test.describe("captures mentions légales", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/mentions-legales", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/legal-notice-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/legal-notice-tablet-768.png", fullPage: true });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator(".leg-status").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/legal-notice-draft-status.png" });

      await page.locator(".leg-toc").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/legal-notice-table-of-contents.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/legal-notice-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/legal-notice-mobile-320.png", fullPage: true });
    }
  });
});
