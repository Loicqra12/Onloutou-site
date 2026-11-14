import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const CAPTURE_DIR = process.env.PARTNER_T63_CAPTURES ?? path.resolve("partner-t63-captures");
const APPROVED_EMAIL = process.env.T63_APPROVED_EMAIL ?? "t63-approved@onloutou.test";
const DRAFT_EMAIL = process.env.T63_DRAFT_EMAIL ?? "t63-draft@onloutou.test";
const PASSWORD = process.env.T63_PASSWORD ?? "PartnerPass123!";

async function dismissCookies(page: Page) {
  const btn = page.getByRole("button", { name: "Uniquement les nécessaires" });
  try {
    await btn.click({ timeout: 2500 });
  } catch {
    /* déjà fermé */
  }
}

async function blur(page: Page) {
  await page.evaluate(() => {
    const el = document.activeElement;
    if (el instanceof HTMLElement) el.blur();
  });
}

async function shot(page: Page, name: string) {
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  await blur(page);
  await page.screenshot({ path: path.join(CAPTURE_DIR, name), fullPage: true });
}

async function login(page: Page, email: string) {
  await page.goto("/espace-partenaire/connexion");
  await dismissCookies(page);
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.locator("#fld-password").fill(PASSWORD);
  await page.getByRole("button", { name: "Me connecter" }).click();
  await expect(page.getByRole("heading", { name: /Bonjour|Bienvenue/ })).toBeVisible({ timeout: 20_000 });
}

async function noOverlap(page: Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.scrollWidth, `overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`).toBeLessThanOrEqual(
    metrics.clientWidth + 1,
  );
}

test.describe("Articles partenaire t63", () => {
  test("parcours approuvé : accueil, liste, wizard, envoi, captures", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Le parcours complet tourne sur le projet desktop.");
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, APPROVED_EMAIL);
    await expect(page.getByRole("heading", { name: /Bonjour/ })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText("Profil partenaire approuvé")).toBeVisible();
    await shot(page, "06-1440.png");

    await page.getByRole("link", { name: /Mes articles/ }).first().click();
    await expect(page.getByRole("heading", { name: "Mes articles" })).toBeVisible();
    await shot(page, "07-1440.png");
    for (const [width, height, suffix] of [[390, 844, "390"], [320, 568, "320"]] as const) {
      await page.setViewportSize({ width, height });
      await noOverlap(page);
      await shot(page, `07-${suffix}.png`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.getByRole("link", { name: /Proposer un article|Proposer mon premier article/ }).first().click();
    await expect(page.getByRole("heading", { name: /Présentez votre article/ })).toBeVisible({ timeout: 20_000 });
    await page.locator("#pa-name").fill("Réfrigérateur 250 L");
    await page.getByLabel("Famille").selectOption("electromenager");
    await page.getByLabel("Catégorie").selectOption("refrigerateurs");
    await page.locator("#pa-cond").selectOption("Bon état");
    await page.locator("#pa-spec-capacity").fill("250 L");
    await page.locator("#pa-desc").fill("Réfrigérateur 250 litres, idéal pour un appartement.");
    const photoPath = path.join(CAPTURE_DIR, "_fixture.png");
    fs.writeFileSync(
      photoPath,
      Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64"),
    );
    await page.locator("input[type=file]").setInputFiles(photoPath);
    await expect(page.getByText("Photo principale")).toBeVisible({ timeout: 15_000 });
    await shot(page, "08a-1440.png");
    for (const [width, height, suffix] of [[390, 844, "390"], [320, 568, "320"]] as const) {
      await page.setViewportSize({ width, height });
      await noOverlap(page);
      await shot(page, `08a-${suffix}.png`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.getByRole("button", { name: /Continuer vers mes conditions/ }).click();
    await expect(page.getByRole("heading", { name: /conditions de location/ })).toBeVisible({ timeout: 15_000 });
    await page.locator("#pa-qty").fill("2");
    await page.locator("#pa-mode").selectOption("UNIT");
    await page.locator("#pa-price").fill("18000");
    await page.locator("#pa-period").selectOption("WEEK");
    await page.locator("#pa-min").selectOption("1_WEEK");
    await page.locator("#pa-deposit").selectOption("TO_DISCUSS");
    await page.locator("#pa-commune").selectOption("Marcory");
    await page.getByRole("button", { name: /Ajouter une période/ }).click();
    const row = page.locator(".pa-unavail__row").first();
    await row.locator("input[type=date]").nth(0).fill("2026-11-20");
    await row.locator("input[type=date]").nth(1).fill("2026-11-25");
    await row.locator("input[type=number]").fill("1");
    await expect(page.getByText(/1 appareil reste disponible sur 2/)).toBeVisible();
    await shot(page, "08b-1440.png");
    for (const [width, height, suffix] of [[390, 844, "390"], [320, 568, "320"]] as const) {
      await page.setViewportSize({ width, height });
      await noOverlap(page);
      await shot(page, `08b-${suffix}.png`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.getByRole("button", { name: /Enregistrer et quitter/ }).click();
    await expect(page.getByRole("heading", { name: "Mes articles" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Réfrigérateur 250 L" })).toBeVisible();
    await page.getByRole("link", { name: /Continuer/ }).first().click();
    await expect(page.locator("#pa-name")).toHaveValue("Réfrigérateur 250 L");
    await expect(page.locator("#pa-spec-capacity")).toHaveValue("250 L");

    await page.getByRole("button", { name: /Continuer vers mes conditions/ }).click();
    await expect(page.locator("#pa-qty")).toHaveValue("2");
    await page.getByRole("button", { name: /Vérifier ma proposition/ }).click();
    await expect(page.getByRole("heading", { name: /Vérifiez votre proposition/ })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Réfrigérateur 250 L" })).toBeVisible();
    await expect(page.getByText(/18[\s\u00a0]?000/)).toBeVisible();
    await shot(page, "08c-1440.png");
    for (const [width, height, suffix] of [[390, 844, "390"], [320, 568, "320"]] as const) {
      await page.setViewportSize({ width, height });
      await noOverlap(page);
      await shot(page, `08c-${suffix}.png`);
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.getByRole("button", { name: /Envoyer pour validation/ }).click();
    await expect(page.getByRole("heading", { name: /proposition a été envoyée/ })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Fiche ART-\d+/).first()).toBeVisible();
    await shot(page, "09-1440.png");

    await page.getByRole("link", { name: "Voir mes articles" }).click();
    await expect(page.getByRole("heading", { name: "Mes articles" })).toBeVisible();
    await expect(page.getByText("En vérification")).toBeVisible();
  });

  test("partenaires non approuvé : brouillon possible, envoi bloqué", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Parcours desktop.");
    await page.setViewportSize({ width: 1440, height: 900 });
    await login(page, DRAFT_EMAIL);
    await page.goto("/espace-partenaire/articles/nouveau");
    await expect(page.getByRole("heading", { name: /Présentez votre article/ })).toBeVisible({ timeout: 20_000 });
    await page.locator("#pa-name").fill("Réfrigérateur 250 L");
    await page.getByRole("button", { name: /Continuer vers mes conditions/ }).click();
    await expect(page.getByRole("heading", { name: /conditions/ })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: /Vérifier ma proposition/ }).click();
    await expect(page.getByText(/après l’approbation de votre profil/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /suivi de mon profil/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Envoyer pour validation/ })).toBeDisabled();
  });

  test("mobile 390 et 320 : champs et boutons accessibles", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Redimensionné manuellement.");
    await login(page, APPROVED_EMAIL);
    for (const [width, height] of [[390, 844], [320, 568]] as const) {
      await page.setViewportSize({ width, height });
      await page.goto("/espace-partenaire/articles");
      await dismissCookies(page);
      await expect(page.getByRole("heading", { name: "Mes articles" })).toBeVisible();
      await noOverlap(page);
      await shot(page, `07-${width}.png`);

      const first = page.getByRole("link", { name: /Continuer|Proposer|Voir/ }).first();
      await first.click();
      await expect(page.locator(".pa-bar, .pa-head").first()).toBeVisible({ timeout: 20_000 });
      await noOverlap(page);
      const etape = page.url().includes("etape=") ? new URL(page.url()).searchParams.get("etape") : "article";
      const name = etape === "conditions" ? "08b" : etape === "verifier" ? "08c" : etape === "suivi" ? "09" : "08a";
      if (width === 390 || width === 320) {
        await shot(page, `${name}-${width === 320 ? "320" : "390"}.png`);
      }
    }
  });
});
