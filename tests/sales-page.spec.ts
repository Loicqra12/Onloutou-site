import { test, expect } from "@playwright/test";

test.describe("page vente", () => {
  test("H1, familles, comparaison, demande WhatsApp, FAQ", async ({ page }) => {
    await page.goto("/solutions/vente", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#sales-hero-title")).toBeVisible();

    await expect(page.getByRole("link", { name: "Décrire mon besoin d’achat" }).first()).toHaveAttribute(
      "href",
      "#demande-equipement",
    );
    await page.locator("#conseil-achat").scrollIntoViewIfNeeded();
    await expect(page.locator("#conseil-achat h3")).toHaveCount(3);
    await expect(page.getByRole("link", { name: "Étudier plutôt la location" })).toHaveAttribute(
      "href",
      "/solutions/location",
    );

    await page.locator('input[name="sales-family"][value="moto"]').check();
    await page.locator('input[name="sales-usage"][value="chantier"]').check();
    await expect(page.locator(".sales-builder__summary")).toContainText("moto");
    await expect(page.locator(".sales-builder__summary")).toContainText("chantier");

    // WhatsApp n'est proposé qu'après l'enregistrement du dossier (étape facultative, avec la référence).
    await expect(page.getByRole("link", { name: "Envoyer sur WhatsApp" })).toHaveCount(0);
    await page.getByLabel(/nom ou structure/i).fill("Awa Koné");
    await page.getByLabel(/^téléphone/i).fill("07 12 34 56 78");
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    const saved = page.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(saved).toBeVisible();
    const href = await saved.getByRole("link", { name: /WhatsApp/ }).getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent((href ?? "").replace(/\+/g, " "))).toContain("moto");
    expect(decodeURIComponent((href ?? "").replace(/\+/g, " "))).toMatch(/ONL-/);

    await page.locator("details summary", { hasText: /en stock/i }).click();
    await page.locator("#sales-final-cta-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#sales-hero-title")).toBeVisible();
  });

  test("méga-menu Acheter", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions");
    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    await expect(page.locator("#mega-solutions a", { hasText: "Vente d'équipements" }).first()).toHaveAttribute(
      "href",
      "/solutions/vente",
    );
  });
});
