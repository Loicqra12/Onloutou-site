import { test, expect } from "@playwright/test";

test.describe("page hub partenaires", () => {
  test("H1, profils, espaces, proposition, FAQ, pas de connexion fictive", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/partenaires", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#partners-hero-title")).toBeVisible();
    await expect(page.locator("#partners-hero-title")).toContainText("utiles aux opérations");

    await page.locator("#profils-partenaires").scrollIntoViewIfNeeded();
    await page.waitForSelector(".partners-profiles--enhanced");
    await page.getByRole("tab", { name: /Techniciens et installateurs/i }).click();
    await expect(page.locator(".partners-profiles__panel--active")).toContainText("Paramétrage");

    await page.locator("#espaces-partenaires").scrollIntoViewIfNeeded();
    await page.waitForSelector(".partners-future--tabs-ready");
    await expect(page.getByRole("link", { name: "Voir l’aperçu complet" })).toHaveAttribute(
      "href",
      "/espace-partenaire",
    );
    await page.getByRole("tab", { name: "Futur espace livreur" }).click();
    await expect(page.locator(".partners-future__panel:not([hidden])")).toContainText("Concept");

    await page.locator("#preparer-proposition").scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Présenter ma proposition" }).first()).toHaveAttribute(
      "href",
      "/devenir-partenaire",
    );

    await page.locator("details summary", { hasText: /garantit-il une collaboration/i }).click();
    await expect(page.locator("details", { hasText: /garantit-il une collaboration/i })).toContainText("aucun engagement");

    await page.locator("#partners-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#partners-hero-title")).toBeVisible();

    await expect(page.locator('a[href="/espace-partenaire"]')).not.toHaveCount(0);
    await page.getByRole("tab", { name: "Futur espace livreur" }).click();
    await expect(page.getByRole("link", { name: "Voir l’aperçu complet" }).last()).toHaveAttribute(
      "href",
      "/espace-livreur",
    );
    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
  });

  test("méga-menu Partenaires", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Partenaires" }).hover();
    await expect(page.locator("#mega-partenaires a", { hasText: "Voir les partenariats" }).first()).toHaveAttribute(
      "href",
      "/partenaires",
    );
  });
});
