import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const CAPTURE_DIR = process.env.PARTNER_T60_CAPTURES ?? path.resolve("partner-t60-captures");

async function noOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.scrollWidth, `overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`).toBeLessThanOrEqual(
    metrics.clientWidth + 1,
  );
}

async function shot(page: Page, name: string) {
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  await page.screenshot({ path: path.join(CAPTURE_DIR, name), fullPage: true });
}

async function dismissCookies(page: Page) {
  const btn = page.getByRole("button", { name: "Uniquement les nécessaires" });
  try {
    await btn.click({ timeout: 2500 });
  } catch {
    /* déjà fermé */
  }
}

test.describe("Espace partenaire t60", () => {
  test("parcours inscription, profil, reconnexion et mot de passe", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Le parcours complet tourne sur le projet desktop, avec des largeurs redimensionnées.");
    const stamp = Date.now();
    const email = `t60-partner-${stamp}@onloutou.test`;
    const password = "PartnerPass123!";
    const name = "Awa Test";

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/devenir-partenaire");
    await dismissCookies(page);
    await expect(page.getByRole("heading", { name: "Vos articles ont une place sur ONLOUTOU." })).toBeVisible();
    await shot(page, "01a-1440.png");
    await noOverflow(page);

    await page.locator(".dp-close, .dp-faq, #preparer-proposition").first().scrollIntoViewIfNeeded();
    await shot(page, "01b-1440.png");

    for (const width of [1024, 390, 320] as const) {
      await page.setViewportSize({ width, height: width >= 1000 ? 900 : 844 });
      await page.goto("/devenir-partenaire");
      await expect(page.getByRole("heading", { name: "Vos articles ont une place sur ONLOUTOU." })).toBeVisible();
      await noOverflow(page);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Navigation principale (mobile)" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Mettre mes articles en location" })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Se connecter" })).toBeVisible();
    fs.mkdirSync(CAPTURE_DIR, { recursive: true });
    await page.screenshot({ path: path.join(CAPTURE_DIR, "menu-390.png") });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/devenir-partenaire");
    await page.getByRole("link", { name: "Créer mon compte partenaire" }).first().click();
    await expect(page).toHaveURL(/\/espace-partenaire\/inscription/);
    await expect(page.getByRole("heading", { name: "Créer mon compte" })).toBeVisible();
    await shot(page, "03-1440.png");
    await noOverflow(page);

    await page.getByLabel("Nom et prénom").fill(name);
    await page.getByLabel("Adresse e-mail").fill(email);
    await page.locator("#fld-password").fill(password);
    await page.locator('input[name="terms"]').check();
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await expect(page).toHaveURL(/\/espace-partenaire\/accueil/, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: /Bienvenue, Awa/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Profil à compléter" })).toBeVisible();
    await shot(page, "04-1440.png");
    await noOverflow(page);

    await page.getByRole("link", { name: "Compléter mon profil" }).click();
    await expect(page).toHaveURL(/\/espace-partenaire\/compte/);
    await expect(page.getByRole("heading", { name: "Complétons votre profil." })).toBeVisible();
    await page.getByRole("radio", { name: /Professionnel/ }).click();
    await page.getByLabel("Téléphone de contact").fill("0554137777");
    await page.getByLabel("Ville ou commune").selectOption("Marcory");
    await page.getByRole("button", { name: "Continuer vers mon activité" }).click();
    await expect(page.getByRole("heading", { name: "Présentez votre activité." })).toBeVisible();
    await page.getByLabel(/Nom commercial/).fill("Awa Location");
    await page.getByLabel("Votre activité en quelques mots").fill("Location d’appareils électroménagers à Abidjan.");
    await page.getByRole("button", { name: "Vérifier mon profil" }).click();
    await expect(page.getByRole("heading", { name: "Votre profil est prêt à être envoyé." })).toBeVisible();
    const submitWait = page.waitForResponse((res) => res.url().includes("/partner/profile/submit"), { timeout: 20_000 });
    await page.getByRole("button", { name: "Envoyer mon profil pour validation" }).click();
    const submitRes = await submitWait;
    if (!submitRes.ok()) {
      throw new Error(`submit ${submitRes.status()} ${await submitRes.text()}`);
    }
    await expect(page.getByRole("heading", { name: "Votre profil a bien été transmis." })).toBeVisible();

    await page.getByRole("link", { name: "Accueil", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Profil en vérification" })).toBeVisible();

    await page.getByRole("button", { name: /Menu du compte/ }).click();
    await page.getByRole("menuitem", { name: "Déconnexion" }).click();
    await expect(page).toHaveURL(/\/espace-partenaire\/connexion/);
    await shot(page, "02-1440.png");
    await noOverflow(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/espace-partenaire/connexion");
    await expect(page.getByRole("heading", { name: "Heureux de vous retrouver." })).toBeVisible();
    await shot(page, "02-390.png");
    await noOverflow(page);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/espace-partenaire/connexion");
    await page.getByLabel("Adresse e-mail").fill(email);
    await page.locator("#fld-password").fill(password);
    await page.getByRole("button", { name: "Me connecter" }).click();
    await expect(page).toHaveURL(/\/espace-partenaire\/accueil/);
    await expect(page.getByRole("heading", { name: "Profil en vérification" })).toBeVisible();

    await page.getByRole("button", { name: /Menu du compte/ }).click();
    await page.getByRole("menuitem", { name: "Déconnexion" }).click();
    await page.getByRole("link", { name: "Mot de passe oublié ?" }).click();
    await expect(page).toHaveURL(/\/espace-partenaire\/mot-de-passe/);
    await page.getByLabel("Adresse e-mail").fill(email);
    await page.getByRole("button", { name: "Envoyer le lien" }).click();
    await expect(page.getByText(/n’est pas disponible|n'est pas disponible|Aucun e-mail n’a été envoyé|Aucun e-mail n'a été envoyé/)).toBeVisible();
    await expect(page.getByText(/un e-mail a été envoyé/i)).toHaveCount(0);
  });
});
