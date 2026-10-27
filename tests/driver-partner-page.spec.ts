import { test, expect } from "@playwright/test";

test.describe("page devenir livreur", () => {
  test("hero, formulaire, consentement, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/devenir-livreur", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#drv-hero-title")).toContainText("faire avancer tout un réseau");

    const form = page.locator("#candidature-livreur");
    await form.scrollIntoViewIfNeeded();
    await form.getByLabel(/Nom ou raison sociale/i).fill("Test Profil");
    await form.getByRole("checkbox", { name: /manifestation d’intérêt/i }).check();

    const wa = form.getByRole("link", { name: "Envoyer mon profil par WhatsApp" });
    expect(await wa.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /Combien peut gagner/i }).click();
    await expect(page.locator("details", { hasText: /Combien peut gagner/i })).toContainText("Aucun revenu");
  });
});
