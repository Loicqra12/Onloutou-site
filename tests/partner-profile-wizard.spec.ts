import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const CAPTURE_DIR = process.env.PARTNER_T62_CAPTURES ?? path.resolve("partner-t62-captures");

async function noOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.scrollWidth, `overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`).toBeLessThanOrEqual(
    metrics.clientWidth + 1,
  );
}

async function dismissCookies(page: Page) {
  const btn = page.getByRole("button", { name: "Uniquement les nécessaires" });
  try {
    await btn.click({ timeout: 2500 });
  } catch {
    /* déjà fermé */
  }
}

async function register(page: Page, name: string, email: string, password: string) {
  await page.goto("/espace-partenaire/inscription");
  await dismissCookies(page);
  await page.getByLabel("Nom et prénom").fill(name);
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.locator("#fld-password").fill(password);
  await page.locator('input[name="terms"]').check();
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await expect(page).toHaveURL(/\/espace-partenaire\/accueil/, { timeout: 20_000 });
}

async function fillInformations(page: Page, opts?: { particulier?: boolean; phone?: string; commune?: string }) {
  await expect(page.getByRole("heading", { name: "Complétons votre profil." })).toBeVisible();
  const kind = opts?.particulier ? "Particulier" : "Professionnel";
  await page.getByRole("radio", { name: new RegExp(kind) }).click();
  await page.getByLabel("Téléphone de contact").fill(opts?.phone ?? "0700000001");
  await page.getByLabel("Ville ou commune").selectOption(opts?.commune ?? "Marcory");
}

test.describe("Profil partenaire 05A–05D", () => {
  test("parcours professionnel, modifier, rechargement, envoi et suivi", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Le parcours complet tourne sur le projet desktop, avec des largeurs redimensionnées.");
    const stamp = Date.now();
    const email = `t62-partner-${stamp}@onloutou.test`;
    const password = "PartnerPass123!";
    const description = "Nous proposons des appareils électroménagers, du mobilier et de la vaisselle à la location à Abidjan.";

    await page.setViewportSize({ width: 1440, height: 900 });
    await register(page, "Awa Test", email, password);
    await page.getByRole("link", { name: "Compléter mon profil" }).click();
    await expect(page).toHaveURL(/\/espace-partenaire\/compte/);
    await expect(page.getByRole("heading", { name: "Complétons votre profil." })).toBeVisible();
    await expect(page.locator(".ps-nav a.is-active")).toContainText("Mon compte");
    await expect(page.getByText("Brouillon", { exact: true })).toBeVisible();
    await expect(page.getByText("Adresse vérifiée")).toHaveCount(0);
    await expect(page.getByText(/Adresse non vérifiée/)).toBeVisible();
    await fillInformations(page);
    await page.getByRole("button", { name: "Continuer vers mon activité" }).click();

    await expect(page.getByRole("heading", { name: "Présentez votre activité." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Votre activité professionnelle" })).toBeVisible();
    await page.getByLabel(/Nom commercial/).fill("Awa Location");
    await page.getByLabel("Votre activité en quelques mots").fill(description);
    await expect(page.getByText(`${description.length} / 500`)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Awa Location" })).toBeVisible();
    await expect(page.getByText("Ajouter une image")).toBeDisabled();
    await page.waitForResponse((res) => res.url().includes("/partner/profile") && res.request().method() === "PATCH", { timeout: 10_000 });
    await page.reload();
    await expect(page.getByLabel(/Nom commercial/)).toHaveValue("Awa Location");
    await expect(page.getByLabel("Votre activité en quelques mots")).toHaveValue(description);
    await expect(page.getByLabel("Ville ou commune")).toHaveCount(0);
    await expect(page.getByText(/Commune principale/)).toContainText("Marcory");

    await page.getByRole("button", { name: "Vérifier mon profil" }).click();
    await expect(page.getByRole("heading", { name: "Votre profil est prêt à être envoyé." })).toBeVisible();
    await expect(page.getByText("+225 •• •• •• ••")).toBeVisible();
    await expect(page.getByText("Non ajoutée · facultatif")).toBeVisible();
    await expect(page.getByText("Aucun document demandé à cette étape.")).toBeVisible();

    await page.locator(".pp-card").filter({ hasText: "Mes informations" }).getByRole("link", { name: "Modifier" }).click();
    await expect(page.getByRole("heading", { name: "Complétons votre profil." })).toBeVisible();
    await expect(page.getByLabel("Téléphone de contact")).toHaveValue(/0700000001/);
    await expect(page.getByLabel("Ville ou commune")).toHaveValue("Marcory");
    await page.getByRole("button", { name: "Continuer vers mon activité" }).click();
    await page.getByRole("button", { name: "Vérifier mon profil" }).click();

    await page.getByRole("button", { name: "Envoyer mon profil pour validation" }).click();
    await expect(page.getByRole("heading", { name: "Votre profil a bien été transmis." })).toBeVisible();
    await expect(page.getByText("En cours de vérification")).toBeVisible();
    await expect(page.getByText("Deux validations distinctes")).toBeVisible();
    await expect(page.getByText("Décision à venir")).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Votre profil a bien été transmis." })).toBeVisible();

    await page.getByRole("link", { name: "Préparer un article" }).click();
    await expect(page).toHaveURL(/\/espace-partenaire\/articles/);
    await expect(page.getByText(/arrive à l’étape suivante|arrive à l'étape suivante/)).toBeVisible();

    await page.getByRole("navigation", { name: "Espace partenaire" }).getByRole("link", { name: "Accueil" }).click();
    await expect(page.getByRole("heading", { name: "Profil en vérification" })).toBeVisible();

    await page.getByRole("navigation", { name: "Espace partenaire" }).getByRole("link", { name: "Mon compte" }).click();
    await expect(page.getByRole("heading", { name: "Votre profil a bien été transmis." })).toBeVisible();

    for (const width of [1440, 1024, 390, 320] as const) {
      await page.setViewportSize({ width, height: width >= 1000 ? 900 : 844 });
      await page.goto("/espace-partenaire/compte");
      await expect(page.getByRole("heading", { name: "Votre profil a bien été transmis." })).toBeVisible();
      await noOverflow(page);
    }
  });

  test("variante particulier : pas de raison sociale, titre et badge adaptés", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Variante particulier sur le projet desktop.");
    const stamp = Date.now();
    const email = `t62-part-${stamp}@onloutou.test`;
    await page.setViewportSize({ width: 1440, height: 900 });
    await register(page, "Awa Particulier", email, "PartnerPass123!");
    await page.getByRole("link", { name: "Compléter mon profil" }).click();
    await fillInformations(page, { particulier: true, commune: "Cocody" });
    await page.getByRole("button", { name: "Continuer vers mon activité" }).click();
    await expect(page.getByRole("heading", { name: "Votre activité", exact: true })).toBeVisible();
    await expect(page.getByText("Raison sociale, si différente")).toHaveCount(0);
    await expect(page.locator(".pp-badge").filter({ hasText: "Particulier" }).first()).toBeVisible();
    await page.getByLabel("Votre activité en quelques mots").fill("Je propose mes articles personnels à la location à Cocody.");
    await expect(page.getByRole("heading", { name: "Awa Particulier" })).toBeVisible();
    await page.getByRole("button", { name: "Vérifier mon profil" }).click();
    await expect(page.getByText("Raison sociale")).toHaveCount(0);
    await expect(page.locator(".pp-recap .pp-badge")).toHaveText("Particulier");
  });
});
