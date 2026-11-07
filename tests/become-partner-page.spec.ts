import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".ptn-faq__button").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
  await expect
    .poll(() => page.locator('input[name="ptn-type"]').first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

async function stubWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __opened: string[] }).__opened = [];
    window.open = ((url?: string | URL) => {
      (window as unknown as { __opened: string[] }).__opened.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

test.describe("page « Proposer une collaboration » (refonte)", () => {
  test("fil d’Ariane, titres, étapes, après-contact et FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-partenaire", { waitUntil: "domcontentloaded" });
    const crumbs = page.getByRole("navigation", { name: "Fil d’Ariane" });
    await expect(crumbs.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
    await expect(crumbs.getByRole("link", { name: "Partenaires" })).toHaveAttribute("href", "/partenaires");
    await expect(crumbs.getByText("Proposer une collaboration")).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Présentez ce que");
    await expect(page.getByRole("heading", { level: 2, name: "Votre proposition, en quelques points." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Et après votre prise de contact ?" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Questions fréquentes" })).toBeVisible();
    await expect(page.locator("#preparer-proposition")).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Préparer ma proposition/ })).toHaveAttribute("href", "#preparer-proposition");
  });

  test("formulaire : type, validation, résumé, coches, WhatsApp, pas de stockage", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await stubWindowOpen(page);
    await page.goto("/devenir-partenaire?type=livraison#preparer-proposition", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expect(page.getByRole("radio", { name: /Livraison & logistique/ })).toBeChecked();
    await page.getByRole("radio", { name: /Terrain & maintenance/ }).check();
    await expect(page.getByRole("radio", { name: /Livraison & logistique/ })).not.toBeChecked();
    await expect(page.getByTestId("ptn-summary")).toContainText("Terrain & maintenance");

    await page.getByRole("button", { name: /Enregistrer ma proposition/ }).click();
    await expect(page.locator("p[role=alert]")).toContainText("Merci de renseigner les champs obligatoires.");
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);

    const ticks = page.locator(".ptn-checklist li");
    await expect(ticks).toHaveCount(3);
    await expect(page.locator('.ptn-checklist li[data-ok="true"]')).toHaveCount(0);

    await page.getByLabel("Nom ou organisation").fill("Structure Test CI");
    await page.getByLabel("Zone d’intervention").fill("Abidjan, Cocody");
    await expect(page.locator('.ptn-checklist li[data-ok="true"]')).toHaveCount(1);
    await page.getByLabel("Que souhaitez-vous proposer ?").fill("Capacité logistique pour des opérations ponctuelles.");
    await expect(page.locator('.ptn-checklist li[data-ok="true"]')).toHaveCount(2);
    await page.getByLabel("Personne à contacter").fill("Awa Test");
    await page.getByLabel("Téléphone ou e-mail").fill("awa@example.com");
    await expect(page.locator('.ptn-checklist li[data-ok="true"]')).toHaveCount(3);
    await expect(page.locator("p[role=alert]")).toHaveCount(0);

    const summary = page.getByTestId("ptn-summary");
    await expect(summary).toContainText("Bonjour ONLOUTOU");
    await expect(summary).toContainText("Structure Test CI");
    await expect(summary).toContainText("Terrain & maintenance");

    await page.getByRole("button", { name: /Enregistrer ma proposition/ }).click();
    // Le dossier est enregistré d'abord ; WhatsApp reste facultatif (aucune ouverture automatique).
    const saved = page.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(saved).toBeVisible();
    await expect(saved).toContainText(/Référence : ONL-/);
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);
    const waHref = (await saved.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(waHref).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const message = decodeURIComponent(waHref.split("?text=")[1].replace(/\+/g, " "));
    expect(message).toContain("Structure Test CI");
    expect(message).toContain("Abidjan, Cocody");
    expect(message).toContain("awa@example.com");

    const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }));
    expect(storage).toEqual({ local: 0, session: 0 });
  });

  test("sans saisie, le résumé est vide et aucune case cochée", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-partenaire", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByText("Votre résumé apparaîtra ici.")).toBeVisible();
    await expect(page.locator('.ptn-checklist li[data-ok="true"]')).toHaveCount(0);
  });

  test("un type inconnu dans l’adresse est ignoré", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-partenaire?type=nimporte#preparer-proposition", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  });

  test("FAQ : la première question est ouverte, une seule réponse à la fois", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-partenaire", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const first = page.getByRole("button", { name: "Quels documents préparer ?" });
    const second = page.getByRole("button", { name: "Ma proposition vaut-elle validation ?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Présentez d’abord votre activité.")).toBeVisible();
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Présentez d’abord votre activité.")).toBeHidden();
    await expect(page.getByText("L’envoi ne garantit pas une collaboration.").first()).toBeVisible();
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "false");
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/devenir-partenaire", { waitUntil: "load" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("méga-menu : Devenir partenaire et Présenter une proposition", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await expect(async () => {
      await page.mouse.move(700, 650);
      await page.locator('button[aria-controls="mega-partenaires"]').hover();
      await expect(page.locator('button[aria-controls="mega-partenaires"]')).toHaveAttribute("aria-expanded", "true", { timeout: 800 });
    }).toPass({ timeout: 15_000 });
    const mega = page.locator("#mega-partenaires");
    await expect(mega.getByRole("link", { name: "Devenir partenaire" }).first()).toHaveAttribute("href", "/devenir-partenaire");
    await expect(mega.getByRole("link", { name: "Présenter une proposition" })).toHaveAttribute("href", "/devenir-partenaire#preparer-proposition");
  });
});
