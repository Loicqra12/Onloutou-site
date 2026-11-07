import { test, expect, type Page } from "@playwright/test";

const cards = [
  { title: "Fournisseurs d’équipements", cta: "Proposer du matériel", type: "equipements" },
  { title: "Livraison & logistique", cta: "Présenter mes capacités", type: "livraison" },
  { title: "Technologie & intégration", cta: "Proposer mon expertise", type: "technologie" },
  { title: "Prestations terrain", cta: "Présenter mon activité", type: "terrain" },
];

async function waitForFormHydration(page: Page) {
  await expect
    .poll(() => page.locator('input[name="ptn-type"]').first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

test.describe("page hub partenaires (refonte)", () => {
  test("hero, 4 cartes, démarche, espaces en préparation, bandeau, pas de connexion fictive", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/partenaires", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre savoir-faire.");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Nos projets");
    await expect(page.getByRole("link", { name: /Proposer une collaboration/ }).first()).toHaveAttribute(
      "href",
      "/devenir-partenaire#preparer-proposition",
    );
    await expect(page.getByRole("link", { name: /Trouver mon profil/ })).toHaveAttribute("href", "#profils-partenaires");

    await expect(page.getByRole("heading", { level: 2, name: "Quelle place souhaitez-vous prendre ?" })).toBeVisible();
    for (const card of cards) {
      await expect(page.getByRole("heading", { level: 3, name: card.title })).toBeVisible();
      await expect(page.getByRole("link", { name: card.cta })).toHaveAttribute(
        "href",
        `/devenir-partenaire?type=${card.type}#preparer-proposition`,
      );
    }
    for (const step of ["Présenter", "Échanger", "Formaliser"]) {
      await expect(page.getByRole("heading", { level: 3, name: step, exact: true })).toBeVisible();
    }

    await expect(page.getByRole("heading", { level: 2, name: "Des espaces pour mieux collaborer." })).toBeVisible();
    await expect(page.locator(".ptn-badge", { hasText: "EN PRÉPARATION" })).toHaveCount(2);
    const previews = page.getByRole("link", { name: /Voir l’aperçu/ });
    await expect(previews.nth(0)).toHaveAttribute("href", "/espace-partenaire#apercu-espace-partenaire");
    await expect(previews.nth(1)).toHaveAttribute("href", "/espace-livreur#apercu-espace-livreur");

    await expect(page.getByRole("heading", { level: 2, name: "Une capacité à proposer ?" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Préparer ma proposition/ })).toHaveAttribute(
      "href",
      "/devenir-partenaire#preparer-proposition",
    );
    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
  });

  test("« Trouver mon profil » défile jusqu’aux cartes, anciennes ancres présentes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/partenaires", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Trouver mon profil/ }).click();
    await expect(page).toHaveURL(/#profils-partenaires$/);
    await expect(page.getByRole("heading", { level: 2, name: "Quelle place souhaitez-vous prendre ?" })).toBeInViewport();
    for (const id of ["profils-partenaires", "espaces-partenaires", "preparer-proposition", "demarche"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("une carte ouvre le formulaire avec le type présélectionné", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/partenaires", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "Proposer du matériel" }).click();
    await expect(page).toHaveURL(/\/devenir-partenaire\?type=equipements#preparer-proposition$/);
    await waitForFormHydration(page);
    await expect(page.getByRole("radio", { name: /Fourniture d’équipements/ })).toBeChecked();
    await expect(page.getByRole("heading", { level: 2, name: "Votre proposition, en quelques points." })).toBeInViewport();
  });

  test("les aperçus mènent à du contenu existant", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/partenaires", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Voir l’aperçu/ }).first().click();
    await expect(page).toHaveURL(/\/espace-partenaire#apercu-espace-partenaire$/);
    await expect(page.locator("#apercu-espace-partenaire")).toHaveCount(1);
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/partenaires", { waitUntil: "load" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("méga-menu Partenaires", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await expect(async () => {
      await page.mouse.move(700, 650);
      await page.locator('button[aria-controls="mega-partenaires"]').hover();
      await expect(page.locator('button[aria-controls="mega-partenaires"]')).toHaveAttribute("aria-expanded", "true", { timeout: 800 });
    }).toPass({ timeout: 15_000 });
    await expect(page.locator("#mega-partenaires a", { hasText: "Voir les partenariats" }).first()).toHaveAttribute("href", "/partenaires");
  });
});