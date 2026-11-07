import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".ptn-faq__button").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
  await expect
    .poll(() => page.locator('input[name="ptn-profile"]').first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
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

const transport = (page: Page) => page.getByLabel("Moyen de transport");
const vehicle = (page: Page, label: RegExp) => page.locator(".ptn-dl-vehicle", { hasText: label });

test.describe("page devenir livreur (refonte)", () => {
  test("hero, cartes, véhicules, étapes, FAQ et bandeau", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-livreur", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("DEVENIR LIVREUR PARTENAIRE")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre expérience");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("d’être connue.");
    await expect(page.locator(".ptn-hero__note")).toBeVisible();
    await expect(page.getByRole("link", { name: /Présenter mon profil/ })).toHaveAttribute("href", "#candidature-livreur");
    await expect(page.locator("#candidature-livreur")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: "Quel moyen pouvez-vous mobiliser ?" })).toBeVisible();
    await expect(page.locator(".ptn-dl-vehicle")).toHaveCount(5);
    await expect(page.getByRole("heading", { level: 2, name: "Préparons votre présentation." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Les points à préciser" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Et ensuite ?" })).toBeVisible();
    for (const title of ["Étude du profil", "Échange selon les besoins", "Modalités à définir"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Des questions sur la démarche ?" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Découvrir l’aperçu/ })).toHaveAttribute("href", "/espace-livreur#apercu-espace-livreur");
  });

  test("cartes et tuiles présélectionnent le profil et le moyen de transport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-livreur", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.getByRole("button", { name: /Je suis indépendant/ }).click();
    await expect(page.getByRole("radio", { name: "Indépendant" })).toBeChecked();
    await page.getByRole("button", { name: /Je représente une entreprise/ }).click();
    await expect(page.getByRole("radio", { name: "Entreprise" })).toBeChecked();

    await vehicle(page, /^Moto$/).click();
    await expect(transport(page)).toHaveValue("Moto");
    await vehicle(page, /^Voiture$/).click();
    await expect(transport(page)).toHaveValue("Moto, Voiture");
    await expect(vehicle(page, /^Voiture$/)).toHaveAttribute("aria-pressed", "true");
    await vehicle(page, /^Moto$/).click();
    await expect(transport(page)).toHaveValue("Voiture");
  });

  test("formulaire : validation, points à préciser, WhatsApp", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await stubWindowOpen(page);
    await page.goto("/devenir-livreur#candidature-livreur", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.getByRole("button", { name: /Enregistrer mon intérêt/ }).click();
    await expect(page.locator("p[role=alert]")).toContainText("Merci de renseigner les champs obligatoires.");
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);
    await expect(page.locator('.ptn-points li[data-done="true"]')).toHaveCount(0);

    await page.getByRole("radio", { name: "Indépendant" }).check();
    await page.getByLabel("Nom ou organisation").fill("Awa Test");
    await page.getByLabel("Téléphone ou e-mail").fill("awa@example.com");
    await page.getByLabel("Zone d’intervention").fill("Abidjan, Cocody");
    await expect(page.locator('.ptn-points li[data-done="true"]')).toHaveCount(1);
    await vehicle(page, /^Utilitaire$/).click();
    await expect(page.locator('.ptn-points li[data-done="true"]')).toHaveCount(2);
    await page.getByRole("textbox", { name: "Expérience" }).fill("Cinq ans de livraison urbaine.");
    await expect(page.locator('.ptn-points li[data-done="true"]')).toHaveCount(3);
    await expect(page.locator("p[role=alert]")).toHaveCount(0);

    await page.getByRole("button", { name: /Enregistrer mon intérêt/ }).click();
    // Le dossier est enregistré d'abord ; WhatsApp reste facultatif (aucune ouverture automatique).
    const saved = page.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(saved).toBeVisible();
    await expect(saved).toContainText(/Référence : ONL-/);
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);
    const waHref = (await saved.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(waHref).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const message = decodeURIComponent(waHref.split("?text=")[1].replace(/\+/g, " "));
    for (const part of ["Indépendant", "Awa Test", "awa@example.com", "Abidjan, Cocody", "Utilitaire", "Cinq ans de livraison urbaine."]) {
      expect(message).toContain(part);
    }
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  });

  test("FAQ : fermées au départ, une seule ouverte à la fois", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/devenir-livreur", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const buttons = page.locator(".ptn-faq__button");
    await expect(page.locator('.ptn-faq__button[aria-expanded="true"]')).toHaveCount(0);
    await buttons.nth(0).click();
    await expect(page.getByText("sans mission ni revenu garanti. Nous revenons vers vous")).toBeVisible();
    await buttons.nth(2).click();
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "true");
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/devenir-livreur", { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
});