import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".ptn-faq__button").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

test.describe("page espace livreur (refonte)", () => {
  test("hero, fonctions, interface, notice, appel à l’action, pas de connexion", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/espace-livreur", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Un futur espace");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("le terrain.");
    await expect(page.locator(".ptn-badge-inline", { hasText: "EN PRÉPARATION" })).toBeVisible();
    await expect(page.getByText("Sans connexion, sans mission ni position réelle.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Découvrir l’aperçu/ })).toHaveAttribute("href", "#apercu-espace-livreur");
    await expect(page.getByRole("link", { name: /Présenter mon profil/ })).toHaveAttribute(
      "href",
      "/devenir-livreur#candidature-livreur",
    );

    await expect(page.getByRole("heading", { level: 2, name: "L’essentiel, à portée de main." })).toBeVisible();
    for (const title of ["Profil & moyens", "Disponibilités", "Informations de mission", "Échanges & assistance"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Une interface adaptée aux usages du terrain." })).toBeVisible();
    for (const title of ["Des informations lisibles", "Des actions simples", "Un statut clair"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByText("Le contenu, les fonctionnalités et les conditions d’accès restent à préciser avant l’ouverture.")).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Vous pouvez déjà présenter votre profil." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Devenir livreur partenaire/ })).toHaveAttribute(
      "href",
      "/devenir-livreur#candidature-livreur",
    );
    await expect(page.getByRole("link", { name: /J’ai un besoin de livraison/ })).toHaveAttribute(
      "href",
      "/livraison#demande-livraison",
    );
    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
  });

  test("« Découvrir l’aperçu » et l’ancre mènent à l’aperçu", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/espace-livreur", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Découvrir l’aperçu/ }).click();
    await expect(page).toHaveURL(/#apercu-espace-livreur$/);
    await expect(page.locator("#apercu-espace-livreur h2").first()).toBeInViewport();
    await page.goto("/espace-livreur#apercu-espace-livreur", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#apercu-espace-livreur h2").first()).toBeInViewport();
  });

  test("« Devenir livreur partenaire » mène au formulaire de candidature", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/espace-livreur", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Devenir livreur partenaire/ }).click();
    await expect(page).toHaveURL(/\/devenir-livreur#candidature-livreur$/);
    await expect(page.getByRole("heading", { level: 2, name: "Préparons votre présentation." })).toBeInViewport();
  });

  test("FAQ : première réponse ouverte puis bascule", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/espace-livreur", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const first = page.getByRole("button", { name: "Puis-je me connecter aujourd’hui ?" });
    const third = page.getByRole("button", { name: "Comment manifester mon intérêt ?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Non. Cet écran présente uniquement le concept du futur espace livreur.")).toBeVisible();
    await third.click();
    await expect(third).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/espace-livreur", { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
});