import { test } from "@playwright/test";

test.describe("captures politique cookies", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    if (testInfo.project.name === "desktop") {
      await page.goto("/cookies", { waitUntil: "domcontentloaded" });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/cookies-policy-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/cookies-policy-tablet-768.png", fullPage: true });

      await page.getByTestId("cookies-inventory").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/cookies-inventory.png" });

      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/cookies-no-banner-home.png", fullPage: false });
    } else {
      await page.goto("/cookies", { waitUntil: "domcontentloaded" });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/cookies-policy-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/cookies-policy-mobile-320.png", fullPage: true });
    }
  });
});
