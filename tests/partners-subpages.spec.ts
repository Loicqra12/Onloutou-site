import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".ptn-faq__button").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

const desktopOnly = (testInfo: { project: { name: string } }) => testInfo.project.name !== "desktop";

test.describe("/partenaires/livreurs (page partenaires livreurs)", () => {
  test("page partenaires livreurs : missions, candidature, pas le formulaire de livraison", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/livreurs", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Partenaires");
    await expect(page.getByRole("heading", { level: 2, name: "Missions possibles" })).toBeVisible();
    await expect(page.locator("#demande-livraison")).toHaveCount(0);
  });
});

test.describe("/partenaires/technologiques (refonte)", () => {
  test("hero, domaines, démarche, trame technique, bandeau et liens", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/technologiques", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Relions vos");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("besoins du terrain.");
    await expect(page.getByRole("link", { name: /Proposer une solution/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire?type=technologie#preparer-proposition",
    );
    await expect(page.getByRole("heading", { level: 2, name: "Des expertises qui se complètent." })).toBeVisible();
    for (const title of ["GPS & objets connectés", "Logiciels & plateformes", "Intégration & interopérabilité", "Déploiement & maintenance"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Du besoin à la solution qui s’intègre." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Ce qui nous aide à étudier votre proposition." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Votre proposition technique" })).toBeVisible();
    await expect(page.getByText("TRAME À PRÉPARER")).toBeVisible();
    await expect(page.getByRole("link", { name: /Préparer ma proposition/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire?type=technologie#preparer-proposition",
    );
    await expect(page.getByRole("link", { name: /Échanger avec ONLOUTOU/ })).toHaveAttribute("href", "/contact");
  });

  test("« Proposer une solution » présélectionne Technologie & autres", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/technologiques", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Proposer une solution/ }).click();
    await expect(page).toHaveURL(/\/devenir-partenaire\?type=technologie#preparer-proposition$/);
    await expect(page.getByRole("radio", { name: /Technologie & autres/ })).toBeChecked();
  });

  test("FAQ : toutes fermées au départ, ouverture et fermeture", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/technologiques", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const buttons = page.locator(".ptn-faq__button");
    await expect(buttons).toHaveCount(3);
    await expect(page.locator('.ptn-faq__button[aria-expanded="true"]')).toHaveCount(0);
    await buttons.nth(2).click();
    await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Le besoin auquel vous répondez, votre solution et ses prérequis")).toBeVisible();
    await buttons.nth(2).click();
    await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("/partenaires/fournisseurs (refonte)", () => {
  test("hero, bandeau noir, 6 familles, offre, exemple, bandeau en préparation", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/fournisseurs", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Vos équipements");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("à de nouveaux besoins.");
    await expect(page.getByText("Un véhicule, un outil, une machine ou une flotte : partons de ce que vous pouvez mobiliser.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Proposer mes équipements/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire?type=equipements#preparer-proposition",
    );
    await expect(page.getByRole("link", { name: /Voir les familles/ })).toHaveAttribute("href", "#familles");
    for (const label of ["Véhicules & utilitaires", "Motos & deux-roues", "Camions & engins", "Outils & matériel", "Équipements techniques", "Autres équipements"]) {
      await expect(page.getByRole("heading", { level: 3, name: label })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Une offre facile à comprendre." })).toBeVisible();
    for (const title of ["Le matériel", "La disponibilité", "Les modalités", "Le contact"]) {
      await expect(page.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
    }
    await expect(page.getByText("EXEMPLE DE PRÉSENTATION")).toBeVisible();
    const example = page.locator(".ptn-sup-example");
    await expect(example).toContainText("Puissance : à préciser");
    await expect(example).toContainText("État : à renseigner");
    await expect(example).toContainText("Disponibilité : à confirmer");
    await expect(example).toContainText("Zone : à préciser");
    await expect(page.getByRole("heading", { level: 2, name: "Présentez ce que vous pouvez proposer." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Préparer ma proposition/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire?type=equipements#preparer-proposition",
    );
    await expect(page.getByRole("link", { name: /Aperçu du futur espace partenaire/ })).toHaveAttribute(
      "href",
      "/espace-partenaire#apercu-espace-partenaire",
    );
    // aucun prix ni tarif inventé
    await expect(page.locator(".ptn-page")).not.toContainText(/FCFA|€|\bXOF\b/);
  });

  test("« Voir les familles » défile jusqu’aux familles", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/fournisseurs", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Voir les familles/ }).click();
    await expect(page).toHaveURL(/#familles$/);
    await expect(page.getByRole("heading", { level: 2, name: /Des familles variées/ })).toBeInViewport();
  });

  test("« Proposer mes équipements » présélectionne la fourniture d’équipements", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/fournisseurs", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Proposer mes équipements/ }).click();
    await expect(page).toHaveURL(/\/devenir-partenaire\?type=equipements#preparer-proposition$/);
    await expect(page.getByRole("radio", { name: /Fourniture d’équipements/ })).toBeChecked();
  });

  test("FAQ : fermées au départ, une seule ouverte à la fois", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/partenaires/fournisseurs", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const buttons = page.locator(".ptn-faq__button");
    await expect(page.locator('.ptn-faq__button[aria-expanded="true"]')).toHaveCount(0);
    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("ne limitent pas les propositions possibles. Décrivez")).toBeVisible();
  });
});

test.describe("sous-pages Partenaires : mise en page", () => {
  for (const path of ["/partenaires/livreurs", "/partenaires/technologiques", "/partenaires/fournisseurs"]) {
    test(`${path} : pas de débordement horizontal`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
