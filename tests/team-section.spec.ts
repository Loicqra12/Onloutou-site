import { expect, test } from "@playwright/test";

const EXPECTED_ORDER = [
  "Adams Ousmane Diaby",
  "Seri Djati Stéphane",
  "Sidney Jordan",
  "Kaboré Hervé",
  "El Hadj Sadou Coulibaly",
];

test.describe("Section équipe /a-propos", () => {
  test("cinq membres, ordre et fonctions de la maquette", async ({ page }) => {
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const section = page.locator("#about-team");
    await expect(section.getByRole("heading", { level: 2, name: /compétences complémentaires/i })).toBeVisible();
    const names = await section.locator(".abt-founder__name, .abt-member__name").allTextContents();
    expect(names).toEqual(EXPECTED_ORDER);

    await expect(section).toContainText("VISION & DÉVELOPPEMENT");
    await expect(section).toContainText("Fondateur · Président-directeur général");
    await expect(section).toContainText("Suivi financier, comptabilité et coordination des partenaires.");
    await expect(section).toContainText("Développement numérique, cybersécurité et pilotage des projets.");
    await expect(section).toContainText("Plateformes GPS et coordination des installations sur les flottes.");
    await expect(section).toContainText("Interventions techniques et coordination des installations automobiles.");
  });

  test("pas d’ancienne équipe dupliquée", async ({ page }) => {
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Gnon Sidney Jordan")).toHaveCount(0);
    await expect(page.getByText("Fondateur et Gérant")).toHaveCount(0);
    await expect(page.locator(".team-card-motion")).toHaveCount(0);
    await expect(page.locator("#about-team blockquote")).toHaveCount(0);
  });

  test("portraits : cinq photos locales avec texte alternatif", async ({ page }) => {
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const images = page.locator("#about-team img");
    await expect(images).toHaveCount(5);
    for (const name of EXPECTED_ORDER) {
      await expect(page.locator(`#about-team img[alt="Portrait de ${name}"]`)).toHaveCount(1);
    }
    const sources = await images.evaluateAll((nodes) => nodes.map((img) => decodeURIComponent(img.getAttribute("src") ?? "")));
    for (const src of sources) {
      expect(src).toContain("/assets/images/about/teams/");
    }
  });

  test("contenu visible sans JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#about-team")).toContainText("Adams Ousmane Diaby");
    await expect(page.locator("#about-team")).toContainText("Sidney Jordan");
    await context.close();
  });

  test("reduced motion et overflow horizontal", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow).toBe(false);
    }
  });
});