import { test, expect } from "@playwright/test";

const route = "/solutions/plateformes-sur-mesure";

test.describe("page plateformes sur mesure", () => {
  test("H1, onglets du hero, rôles, brief WhatsApp, FAQ, CTA", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const h1 = page.locator("#psm-hero-title");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Plusieurs interfaces.");
    await expect(h1).toContainText("Un même projet.");

    // Onglets du hero : le contenu et le visuel changent.
    await page.getByRole("tab", { name: "Application mobile" }).click();
    await expect(page.getByRole("tabpanel").first()).toContainText("Agissez");
    await expect(page.getByRole("img", { name: /application mobile « Mes interventions »/ })).toBeVisible();
    await page.getByRole("tab", { name: "Espace partenaire" }).click();
    await expect(page.getByRole("img", { name: /espace partenaire/i })).toBeVisible();
    await page.getByRole("tab", { name: "Plateforme web" }).click();
    await expect(page.getByRole("tabpanel").first()).toContainText("Centralisez");

    // Rôles : la liste sélectionne le panneau.
    const roles = page.locator("#roles-interfaces");
    await roles.scrollIntoViewIfNeeded();
    await roles.getByRole("tab", { name: /Partenaire/ }).click();
    await expect(roles.getByRole("tabpanel")).toContainText("Collaborer avec ONLOUTOU");
    await roles.getByRole("tab", { name: /Administration/ }).click();
    await expect(roles.getByRole("tabpanel").getByRole("img")).toBeVisible();

    // Brief : les choix mettent à jour le résumé et le lien WhatsApp.
    const brief = page.locator("#brief-projet");
    await brief.scrollIntoViewIfNeeded();
    await brief.getByLabel("Tableau de bord").check();
    await brief.getByLabel("Partenaires").check();
    await brief.getByLabel("Cartographie").check();
    await brief.getByLabel("Où en est votre projet ?").selectOption("Maquettes disponibles");
    const recap = brief.locator(".psm-recap");
    await expect(recap).toContainText("Plateforme web, Tableau de bord");
    await expect(recap).toContainText("Équipe interne, Agents terrain et Partenaires");
    await expect(recap).toContainText("Maquettes disponibles");

    const whatsapp = brief.getByRole("link", { name: /Préparer le message WhatsApp/ });
    const href = (await whatsapp.getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const message = decodeURIComponent(href);
    expect(message).toContain("Tableau de bord");
    expect(message).toContain("Partenaires");
    expect(message).toContain("Cartographie");
    await expect(brief.getByRole("link", { name: "Passer par le formulaire de contact" })).toHaveAttribute("href", "/contact");

    // FAQ : accordéon.
    const first = page.getByRole("button", { name: "Faut-il déjà avoir un cahier des charges ?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const second = page.getByRole("button", { name: "Quels types de plateformes peuvent être étudiés ?" });
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");

    // CTA final.
    await expect(page.locator("#psm-cta-title")).toContainText("outil concret.");
  });

  test("méga-menu Construire", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/solutions");
    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    await expect(page.locator("#mega-solutions a", { hasText: "Plateformes sur mesure" }).first()).toHaveAttribute(
      "href",
      "/solutions/plateformes-sur-mesure",
    );
  });
});
