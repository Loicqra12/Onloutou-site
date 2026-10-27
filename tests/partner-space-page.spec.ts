import { test, expect } from "@playwright/test";

test.describe("page espace partenaire", () => {
  test("hero, aperçu, onglets, pas de connexion", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/espace-partenaire", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#epp-hero-title")).toContainText("un même espace");
    await expect(page.getByText("Espace partenaire en préparation")).toBeVisible();

    await page.locator("#apercu-espace-partenaire").scrollIntoViewIfNeeded();
    await page.waitForSelector(".epp-preview--ready");
    await expect(page.getByText("Prévisualisation conceptuelle")).toBeVisible();

    await page.getByRole("tab", { name: "Gestion des produits" }).click();
    await expect(page.getByText("Aucun produit réel n’est chargé")).toBeVisible();

    await page.getByRole("button", { name: "Ajouter un produit" }).first().click();
    await expect(page.getByRole("tab", { name: "Ajout d’un produit" })).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Enregistrer comme brouillon" }).click();
    await expect(page.getByText("Fonction disponible lorsque le portail sera connecté.")).toBeVisible();

    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
    await expect(page.locator('img[src*="partner-portal"]')).toHaveCount(0);
  });
});
