import { test, expect } from "@playwright/test";
import { adminLogin as signInAdmin, adminUrl } from "./admin-app";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@onloutou.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass12345!";

function tag() {
  return `E2E-FORM-${Date.now()}`;
}

async function adminLogin(page: import("@playwright/test").Page) {
  await signInAdmin(page, adminEmail, adminPassword);
}

test.describe("formulaires connectés", () => {
  test("contact — enregistrement, référence, admin", async ({ page }, testInfo) => {
    const marker = tag();
    await page.goto("/contact");
    await page.getByRole("radio", { name: /Location ou achat/i }).check();
    await page.getByLabel("Votre nom").fill(`Contact ${marker}`);
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 78");
    await page.getByRole("textbox", { name: "Votre message" }).fill(`Demande contact Playwright ${marker}.`);
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible({ timeout: 30_000 });
    await page.screenshot({ path: testInfo.outputPath("contact-success.png"), fullPage: true });

    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
    await page.getByRole("link", { name: "Ouvrir" }).first().click();
    await expect(page.getByText("Coordonnées")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("admin-detail.png"), fullPage: true });
  });

  test("GPS via contact prérempli need=gps", async ({ page }, testInfo) => {
    const marker = tag();
    await page.goto("/contact?need=gps");
    await expect(page.getByRole("radio", { name: /GPS & gestion/i })).toBeChecked();
    await page.getByLabel("Votre nom").fill(`GPS ${marker}`);
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 79");
    await page.getByRole("textbox", { name: "Votre message" }).fill(`Besoin GPS ${marker} — pas de position réelle.`);
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible({ timeout: 30_000 });
  });

  test("Réception & événementiel — famille visible, admin", async ({ page }, testInfo) => {
    const marker = tag();
    await page.goto("/contact?need=location&famille=reception");
    await expect(page.getByRole("radio", { name: /Location ou achat/i })).toBeChecked();
    await expect(page.getByText("Réception & événementiel")).toBeVisible();
    await page.getByLabel("Votre nom").fill(`Réception ${marker}`);
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 81");
    await page.getByRole("textbox", { name: "Votre message" }).fill(`Demande de 100 assiettes ${marker}.`);
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible({ timeout: 30_000 });

    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
    await page.getByRole("link", { name: "Ouvrir" }).first().click();
    await expect(page.getByText("Réception & événementiel")).toBeVisible();
    await expect(page.getByText(`Demande de 100 assiettes ${marker}.`)).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("admin-reception.png"), fullPage: true });
  });

  test("Je cherche un autre article n’a pas l’ancienne famille", async ({ page }) => {
    await page.goto("/contact?need=location&famille=electromenager");
    await expect(page.locator(".ctc-family")).toContainText("Électroménager");
    await page.goto("/contact?need=autre&article=libre");
    await expect(page.getByRole("radio", { name: /Autre demande/i })).toBeChecked();
    await expect(page.locator(".ctc-family")).not.toContainText("Électroménager");
    await expect(page.getByText(/Aucune famille n’est reprise/)).toBeVisible();
  });

  test("location brief — BriefContactSave", async ({ page }, testInfo) => {
    const marker = tag();
    await page.goto("/solutions/location#demande-location");
    await page.getByLabel(/nom ou structure/i).fill(`Loc ${marker}`);
    await page.getByLabel(/téléphone/i).fill("+2250700000000");
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByRole("heading", { name: "Demande enregistrée" })).toBeVisible({ timeout: 30_000 });
    await page.screenshot({ path: testInfo.outputPath("rental-success.png") });
  });

  test("échec API — champs conservés", async ({ page }, testInfo) => {
    await page.route("**/api/v1/requests", (route) => route.abort("failed"));
    await page.goto("/contact");
    await page.getByRole("radio", { name: /Location ou achat/i }).check();
    await page.getByLabel("Votre nom").fill("Erreur API");
    await page.getByLabel(/Téléphone/).fill("0712345680");
    await page.getByRole("textbox", { name: "Votre message" }).fill("Message conservé après échec réseau.");
    // Synchronisé sur la requête réellement émise puis annulée, puis sur le message précis affiché.
    const failedRequest = page.waitForEvent("requestfailed", (req) => req.url().includes("/api/v1/requests") && req.method() === "POST");
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await failedRequest;
    await expect(page.getByRole("alert").filter({ hasText: "Connexion impossible" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Votre message" })).toHaveValue("Message conservé après échec réseau.");
    await page.screenshot({ path: testInfo.outputPath("contact-api-failure.png") });
  });

  test("inscription livreur — dossier limité", async ({ page }, testInfo) => {
    const email = `livreur.e2e.${Date.now()}@onloutou.local`;
    await page.goto("/espace-livreur/inscription");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill("LivreurE2E2026!");
    await page.locator('input[name="fullName"]').fill("Livreur E2E");
    await page.getByRole("button", { name: /créer mon dossier/i }).click();
    await page.waitForURL(/\/espace-livreur\/dossier/, { timeout: 30_000 });
    await expect(page.getByText(/Statut du dossier/i)).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("driver-dossier.png") });
  });

  test("contact — réponse perdue après enregistrement : même référence, un seul dossier", async ({ page }) => {
    const marker = tag();
    let lost = true;
    const refs: string[] = [];
    await page.route("**/api/v1/requests", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      const res = await route.fetch();
      const body = (await res.json().catch(() => ({}))) as { reference?: string };
      if (body.reference) refs.push(body.reference);
      if (lost) {
        lost = false;
        return route.abort("connectionreset");
      }
      return route.fulfill({ response: res });
    });
    await page.goto("/contact");
    await page.getByRole("radio", { name: /GPS & gestion/i }).check();
    await page.getByLabel("Votre nom").fill(`Perdu ${marker}`);
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 81");
    await page.getByRole("textbox", { name: "Votre message" }).fill(`Réponse perdue ${marker}.`);
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible({ timeout: 30_000 });
    expect(refs).toHaveLength(2);
    expect(refs[0]).toBe(refs[1]);
    await expect(page.getByText(refs[0]!)).toBeVisible();

    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toHaveCount(1, { timeout: 30_000 });
  });

  test("électroménager — enregistrement API et admin", async ({ page }) => {
    const marker = tag();
    await page.goto("/articles/electromenager/froid-conservation");
    await page.evaluate(() => localStorage.removeItem("onloutou-electromenager-request"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Ajouter à ma demande" }).first().click();
    await page.getByRole("link", { name: "Continuer" }).click();
    await page.getByLabel("Ville ou commune").selectOption("Cocody");
    await page.locator('input[type="date"]').nth(0).fill("2026-11-21");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.getByLabel("Votre nom").fill(`Elm ${marker}`);
    await page.getByLabel("Téléphone").fill("0554137777");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page).toHaveURL(/\/articles\/electromenager\/demande\/confirmation/, { timeout: 30_000 });
    await expect(page.getByText(/ONL-20\d{6}-/)).toBeVisible();
    await expect(page.getByText("ONL-DEMO-001")).toHaveCount(0);

    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
    await page.getByRole("link", { name: "Ouvrir" }).first().click();
    await expect(page.getByText("Électroménager")).toBeVisible();
  });

  test("informatique — enregistrement API", async ({ page }) => {
    const marker = tag();
    await page.goto("/articles/informatique/ordinateurs");
    await page.evaluate(() => localStorage.removeItem("onloutou-informatique-request"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).first().click();
    await page.goto("/articles/informatique/demande", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Commune").selectOption("Cocody");
    await page.locator('input[type="date"]').nth(0).fill("2026-11-21");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.getByLabel("Votre nom").fill(`Inf ${marker}`);
    await page.getByLabel(/Téléphone|Telephone/i).fill("0554137777");
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();
    await expect(page).toHaveURL(/\/articles\/informatique\/demande\/confirmation/, { timeout: 30_000 });
    await expect(page.getByText(/ONL-20\d{6}-/)).toBeVisible();
    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
  });

  test("mobilier — enregistrement API", async ({ page }) => {
    const marker = tag();
    await page.goto("/articles/mobilier/assises-canapes");
    await page.evaluate(() => localStorage.removeItem("onloutou-mobilier-request"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).first().click();
    await page.goto("/articles/mobilier/demande", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Commune").selectOption("Marcory");
    await page.locator('input[type="date"]').nth(0).fill("2026-11-21");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.getByLabel("Votre nom").fill(`Mob ${marker}`);
    await page.getByLabel(/Téléphone|Telephone/i).fill("0554137777");
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();
    await expect(page).toHaveURL(/\/articles\/mobilier\/demande\/confirmation/, { timeout: 30_000 });
    await expect(page.getByText(/ONL-20\d{6}-/)).toBeVisible();
    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
  });

  test("réception — enregistrement API", async ({ page }) => {
    const marker = tag();
    await page.goto("/articles/reception/vaisselle-couverts");
    await page.evaluate(() => localStorage.removeItem("onloutou-reception-request"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).first().click();
    await page.goto("/articles/reception/demande", { waitUntil: "domcontentloaded" });
    await page.locator("#rec-event").fill(`Event ${marker}`);
    await page.locator("select").first().selectOption("Cocody");
    await page.locator('input[required]').nth(0).fill(`Rec ${marker}`);
    await page.locator('input[required]').nth(1).fill("0554137777");
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();
    await expect(page).toHaveURL(/\/articles\/reception\/demande\/confirmation/, { timeout: 30_000 });
    await expect(page.getByText(/ONL-20\d{6}-/)).toBeVisible();
    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
  });

  test("enfance — enregistrement API", async ({ page }) => {
    const marker = tag();
    await page.goto("/articles/enfance");
    await page.getByRole("link", { name: /Sommeil & couchage/i }).click();
    await page.getByRole("link", { name: /Voir l.article/i }).first().click();
    await page.locator(".enf-buy .enf-btn--yellow").click();
    await page.getByRole("link", { name: /Voir ma demande/i }).click();
    await page.locator("#enf-zone").selectOption("Cocody");
    await page.locator("#enf-name").fill(`Enf ${marker}`);
    await page.locator("#enf-phone").fill("0707123456");
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();
    await expect(page).toHaveURL(/\/articles\/enfance\/demande\/confirmation/, { timeout: 30_000 });
    await expect(page.getByText(/ONL-20\d{6}-/)).toBeVisible();
    await expect(page.getByText("ONL-DEMO-005")).toHaveCount(0);
    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
  });

  test("contact — double clic : un seul dossier", async ({ page }) => {
    const marker = tag();
    await page.goto("/contact");
    await page.getByRole("radio", { name: /Location ou achat/i }).check();
    await page.getByLabel("Votre nom").fill(`Double ${marker}`);
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 82");
    await page.getByRole("textbox", { name: "Votre message" }).fill(`Double clic ${marker}.`);
    await page.getByRole("button", { name: "Enregistrer ma demande" }).dblclick();
    await expect(page.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible({ timeout: 30_000 });
    await adminLogin(page);
    await page.goto(adminUrl("/dossiers"));
    await expect(page.getByText(marker)).toHaveCount(1, { timeout: 30_000 });
  });
});
