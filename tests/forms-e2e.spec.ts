import { test, expect } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@onloutou.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass12345!";

function tag() {
  return `E2E-FORM-${Date.now()}`;
}

async function adminLogin(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.locator("#adm-email").fill(adminEmail);
  await page.locator("#adm-password").fill(adminPassword);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL(/\/admin\/(?!login)/, { timeout: 30_000 });
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
    await page.goto("/admin/demandes");
    await expect(page.getByText(marker)).toBeVisible({ timeout: 30_000 });
    await page.getByRole("button", { name: "Détail" }).first().click();
    await expect(page.getByText("Coordonnées")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("admin-detail.png"), fullPage: true });
  });

  test("GPS via contact prérempli need=gps", async ({ page }, testInfo) => {
    const marker = tag();
    await page.goto("/contact?need=gps");
    await page.getByRole("radio", { name: /GPS & gestion/i }).check();
    await page.getByLabel("Votre nom").fill(`GPS ${marker}`);
    await page.getByLabel(/Téléphone/).fill("07 12 34 56 79");
    await page.getByRole("textbox", { name: "Votre message" }).fill(`Besoin GPS ${marker} — pas de position réelle.`);
    await page.getByRole("button", { name: "Enregistrer ma demande" }).click();
    await expect(page.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible({ timeout: 30_000 });
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
    await page.goto("/admin/demandes");
    await expect(page.getByText(marker)).toHaveCount(1, { timeout: 30_000 });
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
    await page.goto("/admin/demandes");
    await expect(page.getByText(marker)).toHaveCount(1, { timeout: 30_000 });
  });
});
