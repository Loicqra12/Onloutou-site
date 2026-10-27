import { expect, test } from "@playwright/test";
import { aboutTeamMembers } from "@/content/team";

const EXPECTED_ORDER = [
  "Adams Ousmane Diaby",
  "Seri Djati Stéphane",
  "Sidney Jordan",
  "Kaboré Hervé",
  "El Hadj Sadou Coulibaly",
];

test.describe("Section équipe /a-propos", () => {
  test("cinq membres, ordre et fonctions", async ({ page }) => {
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const section = page.locator("#about-team");
    await expect(section.getByRole("heading", { level: 2, name: /vision, technologie et terrain/i })).toBeVisible();

    const names = await section.locator(".about-team-founder__name, .about-team-card__name").allTextContents();
    expect(names).toEqual(EXPECTED_ORDER);

    await expect(section).toContainText("Fondateur & Directeur général");
    await expect(section).toContainText("Directeur administratif et financier");
    await expect(section).toContainText("Directeur technique & Chef de projets numériques");
    await expect(section).toContainText("Directeur des opérations de géolocalisation");
    await expect(section).toContainText("Responsable des installations & de l’électronique embarquée");
  });

  test("pas d’ancienne équipe dupliquée", async ({ page }) => {
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Gnon Sidney Jordan")).toHaveCount(0);
    await expect(page.getByText("Fondateur et Gérant")).toHaveCount(0);
    await expect(page.locator(".team-card-motion")).toHaveCount(0);
  });

  test("citations en attente non affichées", async ({ page }) => {
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const pending = aboutTeamMembers.filter((m) => m.quoteStatus === "pending-validation");
    for (const member of pending) {
      await expect(page.locator("#about-team")).not.toContainText(member.quote);
    }
    await expect(page.locator("#about-team blockquote")).toHaveCount(0);
  });

  test("liens sociaux uniquement si URL définie", async ({ page }) => {
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const socialLinks = page.locator("#about-team .about-team-social__link");
    const count = await socialLinks.count();
    expect(count).toBe(1);
    await expect(socialLinks.first()).toHaveAttribute(
      "href",
      "https://ci.linkedin.com/in/sir-sidney-jordan-39587a283",
    );
    await expect(socialLinks.first()).toHaveAttribute("rel", /noopener/);
    const hrefs = await socialLinks.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    for (const href of hrefs) {
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
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
    const widths = [320, 375, 768, 1024, 1440];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow).toBe(false);
    }
  });

  test("textes alternatifs portraits", async ({ page }) => {
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const placeholders = page.locator(".about-team-portrait--placeholder");
    expect(await placeholders.count()).toBe(5);
    for (const member of aboutTeamMembers) {
      await expect(page.locator(`[aria-label="${member.image.alt}"]`).first()).toBeVisible();
    }
  });
});
