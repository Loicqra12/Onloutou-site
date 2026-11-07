import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".ptn-faq__button").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
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

test.describe("page livraison (refonte)", () => {
  test("hero, choix, étapes, FAQ et liens", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/livraison", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("SERVICE EN PRÉPARATION")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Un besoin à");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("par le trajet.");
    await expect(page.getByRole("link", { name: /Présenter mon besoin/ })).toHaveAttribute("href", "#demande-livraison");
    await expect(page.getByRole("link", { name: /Je souhaite livrer/ })).toHaveAttribute("href", "/devenir-livreur");
    await expect(page.getByRole("link", { name: /Préparer ma demande/ })).toHaveAttribute("href", "#demande-livraison");
    await expect(page.getByRole("link", { name: /Devenir livreur partenaire/ })).toHaveAttribute("href", "/devenir-livreur");
    await expect(page.getByRole("heading", { level: 2, name: "Avant toute prise en charge." })).toBeVisible();
    for (const title of ["Vérifier la faisabilité", "Préciser les conditions", "Confirmer l’organisation"]) {
      await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
    }
    await expect(page.getByRole("heading", { level: 2, name: "Des questions sur la livraison ?" })).toBeVisible();
  });

  test("« Présenter mon besoin » défile jusqu’au formulaire", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/livraison", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Présenter mon besoin/ }).click();
    await expect(page).toHaveURL(/#demande-livraison$/);
    await expect(page.getByRole("heading", { level: 2, name: "Votre trajet, votre besoin." })).toBeInViewport();
  });

  test("formulaire : validation, résumé départ/destination, WhatsApp", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await stubWindowOpen(page);
    await page.goto("/livraison#demande-livraison", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expect(page.getByTestId("ptn-route-from")).toHaveText("Départ à renseigner");
    await expect(page.getByTestId("ptn-route-to")).toHaveText("Destination à renseigner");
    await expect(page.getByText("Les conditions, la faisabilité et le tarif restent à confirmer.")).toBeVisible();

    await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(page.locator("p[role=alert]")).toContainText("Merci de renseigner les champs obligatoires.");
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);

    await page.getByLabel("Point de collecte").fill("Cocody, Abidjan");
    await expect(page.getByTestId("ptn-route-from")).toHaveText("Cocody, Abidjan");
    await page.getByLabel("Destination").fill("Plateau");
    await expect(page.getByTestId("ptn-route-to")).toHaveText("Plateau");
    await page.getByRole("radio", { name: "Colis", exact: true }).check();
    await expect(page.getByTestId("ptn-route-extras")).toContainText("Colis");
    await page.getByLabel("Votre nom").fill("Awa Test");
    await expect(page.locator("p[role=alert]")).toHaveCount(1);
    await page.getByLabel("Téléphone ou e-mail").fill("awa@example.com");
    await expect(page.locator("p[role=alert]")).toHaveCount(0);

    await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    // Le dossier est enregistré d'abord ; WhatsApp reste facultatif (aucune ouverture automatique).
    const saved = page.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(saved).toBeVisible();
    await expect(saved).toContainText(/Référence : ONL-/);
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened.length)).toBe(0);
    const waHref = (await saved.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(waHref).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const message = decodeURIComponent(waHref.split("?text=")[1].replace(/\+/g, " "));
    expect(message).toContain("Cocody, Abidjan");
    expect(message).toContain("Plateau");
    expect(message).toContain("Colis");
    expect(message).toContain("awa@example.com");
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  });

  test("FAQ : première réponse ouverte puis bascule", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/livraison", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const first = page.getByRole("button", { name: "Le service est-il déjà ouvert ?" });
    const second = page.getByRole("button", { name: "Comment connaître les modalités et le prix ?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Le service est en préparation. Vous pouvez présenter")).toBeVisible();
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("ne sont pas fixés à l’avance")).toBeVisible();
  });
});

test.describe("page livraison : ancres conservées", () => {
  test("ancres historiques et liens vers le livreur", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/livraison", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#demande-livraison")).toHaveCount(1);
    await expect(page.locator("#fonctionnement-livraison")).toHaveCount(1);
    await expect(page.locator("#devenir-livreur")).toHaveCount(1);
    await expect(page).toHaveTitle(/ONLOUTOU/);
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/livraison", { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
});
