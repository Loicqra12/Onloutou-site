import { test } from "@playwright/test";

test.describe("captures espace partenaire", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/espace-partenaire", { waitUntil: "networkidle" });
    await page.waitForSelector(".epp-preview--ready");

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/partner-space-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/partner-space-tablet-768.png", fullPage: true });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.locator("#apercu-espace-partenaire").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/partner-space-dashboard-preview.png" });

      await page.getByRole("tab", { name: "Gestion des produits" }).click();
      await page.screenshot({ path: "docs/captures/partner-space-products-preview.png" });

      await page.getByRole("tab", { name: "Ajout d’un produit" }).click();
      await page.screenshot({ path: "docs/captures/partner-space-product-form-preview.png" });

      await page.locator("#epp-matrix-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/partner-space-modules.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/partner-space-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/partner-space-mobile-320.png", fullPage: true });
    }
  });
});
