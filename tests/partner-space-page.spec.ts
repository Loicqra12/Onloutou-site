import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".ptn-faq__button").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

test.describe("page espace partenaire (refonte)", () => {
  test("hero, aperçu fictif, fonctionnalités, contact, pas de connexion", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/espace-partenaire", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Vos offres et vos");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("même espace.");
    await expect(page.locator(".ptn-badge-inline", { hasText: "EN PRÉPARATION" })).toBeVisible();
    await expect(page.getByText("Présentation conceptuelle : aucune connexion ni donnée réelle.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Présenter mon organisation/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire#preparer-proposition",
    );

    const dash = page.locator("#apercu-espace-partenaire");
    await expect(dash).toContainText("APERÇU CONCEPTUEL — DONNÉES FICTIVES");
    await expect(dash.getByRole("heading", { level: 2, name: "Vue d’ensemble" })).toBeVisible();
    for (const title of ["Profil de l’organisation", "Offres proposées", "Échanges"]) {
      await expect(dash.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(dash.getByRole("heading", { level: 3, name: "Exemples de fiches équipement" })).toBeVisible();
    for (const name of ["Utilitaire", "Groupe électrogène", "Outillage"]) {
      await expect(dash.getByRole("row", { name: new RegExp(name) })).toContainText("À renseigner");
    }
    await expect(dash.getByRole("heading", { level: 3, name: "À préparer" })).toBeVisible();
    // « Voir tous les équipements » est inerte : aucun lien, aucune connexion
    await expect(page.getByRole("link", { name: /Voir tous les équipements/ })).toHaveCount(0);
    await expect(dash.getByRole("link")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
    await expect(page.locator('img[src*="partner-portal"]')).toHaveCount(0);

    await expect(page.getByRole("heading", { level: 2, name: "Ce que cet espace pourrait réunir." })).toBeVisible();
    for (const title of ["Fiches équipements", "Suivi des demandes", "Documents utiles", "Accès et paramètres", "Assistance"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByText("Les fonctionnalités et les conditions d’accès seront précisées avant l’ouverture.").first()).toBeVisible();

    await expect(page.getByRole("heading", { level: 2, name: "En attendant, restons en contact." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Préparer ma proposition/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire#preparer-proposition",
    );
    await expect(page.getByRole("link", { name: /Contacter ONLOUTOU/ }).last()).toHaveAttribute("href", "/contact");
  });

  test("« Découvrir l’aperçu » et l’ancre mènent à l’aperçu", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/espace-partenaire", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Découvrir l’aperçu/ }).click();
    await expect(page).toHaveURL(/#apercu-espace-partenaire$/);
    await expect(page.locator("#apercu-espace-partenaire h2")).toBeInViewport();
    await page.goto("/espace-partenaire#apercu-espace-partenaire", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#apercu-espace-partenaire h2")).toBeInViewport();
  });

  test("FAQ : première réponse ouverte puis bascule", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/espace-partenaire", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const first = page.getByRole("button", { name: "Puis-je me connecter aujourd’hui ?" });
    const second = page.getByRole("button", { name: "Les données de l’aperçu sont-elles réelles ?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Non. Cette page présente un aperçu du futur espace partenaire.")).toBeVisible();
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/espace-partenaire", { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
});