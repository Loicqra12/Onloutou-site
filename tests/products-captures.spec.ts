import { test } from "@playwright/test";

test.describe("captures produits", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/produits", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/products-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 768, height: 900 });
      await page.screenshot({ path: "docs/captures/products-tablet-768.png", fullPage: true });

      await page.locator("#familles-produits").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/products-families-desktop.png" });

      await page.locator("#usage-produits").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/products-use-explorer-desktop.png" });

      await page.locator("#modes-acces").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/products-access-modes-desktop.png" });

      await page.locator("#demande-produit").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/products-request-desktop.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/products-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/products-mobile-320.png", fullPage: true });

      await page.locator("#demande-produit").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/products-request-mobile.png" });
    }
  });
});
