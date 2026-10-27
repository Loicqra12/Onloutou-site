import { test } from "@playwright/test";

test.describe("captures page projets", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/projets", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/projects-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/projects-tablet-1024.png", fullPage: true });

      await page.locator("#domaines-projets").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/projects-domains-desktop.png" });

      await page.locator("#terrain-methode").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/projects-field-method.png", fullPage: false });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/projects-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/projects-mobile-320.png", fullPage: true });

      await page.locator("#brief-projet").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/projects-brief-mobile.png" });
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/projets", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/projects-reduced-motion.png", fullPage: true });
  });
});
