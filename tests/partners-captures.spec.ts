import { test } from "@playwright/test";

test.describe("captures hub partenaires", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/partenaires", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/partners-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/partners-tablet-1024.png", fullPage: true });

      await page.locator("#profils-partenaires").scrollIntoViewIfNeeded();
      await page.waitForSelector(".partners-profiles--enhanced");
      await page.screenshot({ path: "docs/captures/partners-profiles-desktop.png" });

      await page.locator("#espaces-partenaires").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/partners-future-spaces.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/partners-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/partners-mobile-320.png", fullPage: true });

      await page.locator("#devenir-partenaire").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/partners-interest-mobile.png" });
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/partenaires", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/partners-reduced-motion.png", fullPage: true });
  });
});
