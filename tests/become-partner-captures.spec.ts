import { test } from "@playwright/test";

test.describe("captures devenir partenaire", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    await page.goto("/devenir-partenaire", { waitUntil: "networkidle" });

    if (testInfo.project.name === "desktop") {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.screenshot({ path: "docs/captures/become-partner-desktop-1440.png", fullPage: true });

      await page.setViewportSize({ width: 1024, height: 900 });
      await page.screenshot({ path: "docs/captures/become-partner-tablet-1024.png", fullPage: true });

      await page.locator(".become-partner-form__client").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "docs/captures/become-partner-form-desktop.png" });

      for (let i = 0; i < 4; i += 1) {
        await page.locator(".become-partner-form__step .become-partner-options__item").first().click();
        await page.getByRole("button", { name: "Étape suivante" }).click();
      }
      await page.getByRole("button", { name: "Vérifier le résumé" }).click();
      await page.screenshot({ path: "docs/captures/become-partner-validation-error.png" });
    } else {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({ path: "docs/captures/become-partner-mobile-375.png", fullPage: true });

      await page.setViewportSize({ width: 320, height: 568 });
      await page.screenshot({ path: "docs/captures/become-partner-mobile-320.png", fullPage: true });

      await page.locator(".become-partner-form__client").scrollIntoViewIfNeeded();
      for (let i = 0; i < 4; i += 1) {
        await page.locator(".become-partner-form__step .become-partner-options__item").first().click();
        await page.getByRole("button", { name: "Étape suivante" }).click();
      }
      await page.locator('input[autocomplete="organization"]').fill("Mobile Test");
      await page.locator("textarea").fill("Description test mobile.");
      await page.getByRole("button", { name: "Vérifier le résumé" }).click();
      await page.locator(".become-partner-summary__confirm input").check();
      await page.screenshot({ path: "docs/captures/become-partner-summary-mobile.png" });
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/devenir-partenaire", { waitUntil: "domcontentloaded" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: "docs/captures/become-partner-reduced-motion.png", fullPage: true });
  });
});
