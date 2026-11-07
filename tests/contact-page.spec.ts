import { expect, test, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator('input[name="ctc-need"]').first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
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

const desktopOnly = (testInfo: { project: { name: string } }) => testInfo.project.name !== "desktop";

test.describe("page Contact (refonte)", () => {
  test("titre, coordonnées, cartes et bandeau", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: "Parlons de votre besoin." })).toBeVisible();
    await expect(page.getByText("Un équipement à trouver, une flotte à suivre ou un projet à construire : décrivez-nous votre contexte.")).toBeVisible();

    const direct = page.getByRole("complementary");
    await expect(direct.getByRole("heading", { level: 2, name: "Échangeons directement." })).toBeVisible();
    await expect(direct.getByText("+225 05 54 13 77 77")).toBeVisible();
    await expect(direct.getByRole("link", { name: /Appeler ONLOUTOU/ })).toHaveAttribute("href", "tel:+2250554137777");
    await expect(direct.getByRole("link", { name: /Écrire sur WhatsApp/ })).toHaveAttribute("href", /^https:\/\/wa\.me\/2250554137777\?text=/);
    await expect(direct.getByText("Abidjan, Côte d’Ivoire")).toBeVisible();
    await expect(direct.getByRole("link", { name: /Consulter le centre d’aide/ })).toHaveAttribute("href", "/aide");

    await expect(page.getByRole("heading", { level: 2, name: "Quelques précisions pour faciliter l’échange." })).toBeVisible();
    for (const title of ["Votre objectif", "Votre contexte", "Vos contraintes"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /Présenter une proposition/ })).toHaveAttribute("href", "/devenir-partenaire#preparer-proposition");
    await expect(page.getByRole("link", { name: /Présenter mon profil/ })).toHaveAttribute("href", "/devenir-livreur#candidature-livreur");
    await expect(page.getByRole("heading", { level: 2, name: "Besoin d’une réponse avant de nous contacter ?" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Explorer le centre d’aide/ })).toHaveAttribute("href", "/aide");
  });

  test("formulaire : six besoins, validation et message WhatsApp prérempli", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await stubWindowOpen(page);
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expect(page.locator(".ctc-need")).toHaveText([
      "Location ou achat",
      "GPS & gestion de flotte",
      "Sécurisation d’actifs",
      "Projet numérique",
      "Partenariat",
      "Autre demande",
    ]);
    await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(page.locator("p[role=alert]")).toContainText("Merci de renseigner les champs obligatoires.");
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);

    await page.getByRole("radio", { name: "GPS & gestion de flotte" }).check();
    await page.getByLabel("Votre nom").fill("Awa Test");
    await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(page.locator("p[role=alert]")).toHaveCount(1);
    await expect(page.getByLabel("Votre nom")).toHaveValue("Awa Test");
    await expect(page.getByRole("radio", { name: "GPS & gestion de flotte" })).toBeChecked();
    await expect(page.getByText(/message envoyé/i)).toHaveCount(0);
    await page.getByLabel("Zone concernée").fill("Abidjan");
    await page.getByRole("textbox", { name: "Votre message" }).fill("Suivi de dix véhicules.");
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 78");
    await expect(page.locator("p[role=alert]")).toHaveCount(0);

    await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    // Le dossier est enregistré d'abord ; WhatsApp reste facultatif (aucune ouverture automatique).
    await expect(page.getByRole("status").filter({ hasText: "Demande enregistrée" })).toContainText(/Référence : ONL-/);
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);
    await page.getByRole("button", { name: "Continuer sur WhatsApp" }).click();
    const opened = await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened);
    expect(opened).toHaveLength(1);
    expect(opened[0]).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const message = decodeURIComponent(opened[0].split("?text=")[1].replace(/\+/g, " "));
    for (const part of ["GPS & gestion de flotte", "Awa Test", "Abidjan", "Suivi de dix véhicules."]) {
      expect(message).toContain(part);
    }
    expect(message).not.toContain("Organisation :");
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  });

  test("pas de débordement horizontal", async ({ page }) => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/contact", { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width}px`).toBeLessThanOrEqual(1);
    }
  });
});