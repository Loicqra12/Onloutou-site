import { test } from "@playwright/test";

test.describe("captures espace livreur", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/espace-livreur", { waitUntil: "networkidle" });
    await page.waitForSelector(".edl-preview--ready");

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/driver-space-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/driver-space-tablet-768.png", fullPage: true });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator("#apercu-espace-livreur").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-space-home-preview.png" });

      await page.getByRole("tab", { name: "Disponibilités" }).click();
      await page.screenshot({ path: "docs/captures/driver-space-availability-preview.png" });

      await page.getByRole("tab", { name: "Missions" }).click();
      await page.screenshot({ path: "docs/captures/driver-space-mission-preview.png" });

      await page.getByRole("tab", { name: "Profil" }).click();
      await page.screenshot({ path: "docs/captures/driver-space-profile-preview.png" });

      await page.locator("#edl-matrix-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/driver-space-modules.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/driver-space-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/driver-space-mobile-320.png", fullPage: true });
    }
  });
});
