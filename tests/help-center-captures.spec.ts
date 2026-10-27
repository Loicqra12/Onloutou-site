import { test } from "@playwright/test";

test.describe("captures centre d’aide", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/aide", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/help-center-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/help-center-tablet-768.png", fullPage: true });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator("#hlp-search-input").fill("livraison");
      await page.screenshot({ path: "docs/captures/help-center-search-results.png" });

      await page.locator("#hlp-search-input").fill("zzzzsansresultat");
      await page.screenshot({ path: "docs/captures/help-center-no-results.png" });

      await page.locator("#hlp-search-input").fill("");
      await page.locator(".hlp-audience").getByRole("button", { name: "Entreprise" }).click();
      await page.screenshot({ path: "docs/captures/help-center-business-filter.png" });

      await page.locator(".hlp-audience").getByRole("button", { name: "Partenaire" }).click();
      await page.screenshot({ path: "docs/captures/help-center-partner-filter.png" });

      await page.locator(".hlp-audience").getByRole("button", { name: "Livreur" }).click();
      await page.screenshot({ path: "docs/captures/help-center-driver-filter.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/help-center-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/help-center-mobile-320.png", fullPage: true });
    }
  });
});
