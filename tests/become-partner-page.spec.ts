import { test, expect } from "@playwright/test";

test.describe("page devenir partenaire", () => {
  test("parcours, validation, WhatsApp, pas de stockage", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/devenir-partenaire", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#become-partner-hero-title")).toContainText("ce que vous pouvez apporter");

    await page.locator("#preparer-proposition").scrollIntoViewIfNeeded();
    await page.locator(".become-partner-readiness__item").first().click();

    await page.locator(".become-partner-form__client").scrollIntoViewIfNeeded();
    await page.locator(".become-partner-form__step .become-partner-options__item").first().click();
    await page.getByRole("button", { name: "Étape suivante" }).click();
    await page.locator(".become-partner-form__step .become-partner-options__item").first().click();
    await page.getByRole("button", { name: "Étape suivante" }).click();
    await page.locator(".become-partner-form__step .become-partner-options__item").first().click();
    await page.getByRole("button", { name: "Étape suivante" }).click();
    await page.locator(".become-partner-form__step .become-partner-options__item").first().click();
    await page.getByRole("button", { name: "Étape suivante" }).click();

    await page.getByRole("button", { name: "Vérifier le résumé" }).click();
    await expect(page.locator(".become-partner-field-error").first()).toContainText("Indiquez votre nom");

    await page.locator("#become-partner-form-title").scrollIntoViewIfNeeded();
    const nameInput = page.locator('input[autocomplete="organization"]');
    await nameInput.fill("Structure Test CI");
    await page.locator("textarea").fill("Proposition de capacité logistique sur Abidjan pour des opérations ponctuelles.");
    await page.getByRole("button", { name: "Vérifier le résumé" }).click();

    await expect(page.locator(".become-partner-summary__title")).toBeVisible();
    await page.getByRole("button", { name: "Modifier mes informations" }).click();
    await page.getByRole("button", { name: "Vérifier le résumé" }).click();

    const storageEmpty = await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    }));
    expect(storageEmpty.local).toBe(0);
    expect(storageEmpty.session).toBe(0);

    await page.locator(".become-partner-summary__confirm input").check();
    const whatsapp = page.getByRole("link", { name: "Ouvrir WhatsApp avec ma proposition" });
    const href = await whatsapp.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(href ?? "")).toContain("Structure Test CI");
    expect(decodeURIComponent(href ?? "")).toContain("engagement automatique");
  });

  test("navigation depuis méga-menu", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Partenaires" }).hover();
    await expect(page.locator("#mega-partenaires a", { hasText: "Devenir partenaire" }).first()).toHaveAttribute(
      "href",
      "/devenir-partenaire",
    );
  });
});
