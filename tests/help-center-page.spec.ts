import { expect, test, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await expect
    .poll(() => page.locator(".hlp-chip").first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

const desktopOnly = (testInfo: { project: { name: string } }) => testInfo.project.name !== "desktop";

test.describe("centre d’aide (refonte)", () => {
  test("titre, sujets et sujet par défaut", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/aide", { waitUntil: "domcontentloaded" });
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Une question ?");
    await expect(h1).toContainText("Trouvons la bonne réponse.");
    await expect(page.getByRole("heading", { level: 2, name: "Choisissez votre sujet." })).toBeVisible();
    await expect(page.locator(".hlp-topic")).toHaveText([
      "Découvrir ONLOUTOU",
      "Location & acquisition",
      "Équipements",
      "GPS & gestion de flotte",
      "Livraison",
      "Partenaires",
      "Livreurs partenaires",
      "Projets numériques",
    ]);
    await expect(page.getByRole("heading", { level: 2, name: "Location & acquisition" })).toBeVisible();
    const first = page.getByRole("button", { name: "Comment présenter mon besoin ?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Indiquez le type d’équipement, l’usage, le lieu et la durée souhaitée.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Préparer mon message/ })).toHaveAttribute("href", "/contact");
    for (const q of [
      "Puis-je demander un équipement absent du site ?",
      "La disponibilité est-elle immédiate ?",
      "Comment sont précisés le prix et les conditions ?",
      "Puis-je comparer location et achat ?",
    ]) {
      await expect(page.getByRole("button", { name: q })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
  });

  test("sujets, accordéons et hash de l’URL synchronisés", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/aide", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await page.locator(".hlp-topic", { hasText: "Livraison" }).click();
    await expect(page).toHaveURL(/#livraison$/);
    await expect(page.getByRole("heading", { level: 2, name: "Livraison", exact: true }).last()).toBeVisible();
    await expect(page.getByRole("button", { name: "Le service de livraison est-il disponible ?" })).toHaveAttribute("aria-expanded", "true");

    const second = page.getByRole("button", { name: "Quelles zones peuvent être étudiées ?" });
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveURL(/#zones-livraison$/);
    await expect(page.getByRole("button", { name: "Le service de livraison est-il disponible ?" })).toHaveAttribute("aria-expanded", "false");
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "false");

    await page.getByRole("navigation", { name: "PARCOURIR L’AIDE" }).getByRole("button", { name: /Partenaires/ }).first().click();
    await expect(page).toHaveURL(/#partenaires$/);

    await page.goto("/aide#comment-obtenir-un-prix", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const price = page.getByRole("button", { name: "Comment sont précisés le prix et les conditions ?" });
    await expect(price).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("heading", { level: 2, name: "Location & acquisition" })).toBeVisible();

    await page.goto("/aide#geolocalisation-flotte", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const topicHeading = page.getByRole("heading", { level: 2, name: "GPS & gestion de flotte" }).last();
    await expect(topicHeading).toBeVisible();
    await expect(page.locator("#geolocalisation-flotte")).toHaveCount(1);
    await expect.poll(async () => {
      const headerBottom = (await page.locator("header.site-header").boundingBox())!;
      const box = await topicHeading.boundingBox();
      return (box?.y ?? 0) - (headerBottom.y + headerBottom.height);
    }).toBeGreaterThanOrEqual(0);
  });

  test("recherche côté client, puces et aucun résultat", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/aide", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const input = page.getByRole("searchbox", { name: "Rechercher une question ou un sujet" });

    await input.fill("géolocalisation");
    await expect(page.getByRole("status")).toContainText("résultat");
    await expect(page.locator(".hlp-result").first()).toBeVisible();

    await page.getByRole("button", { name: "Effacer" }).click();
    await expect(input).toHaveValue("");
    await expect(page.locator(".hlp-results")).toHaveCount(0);

    await page.locator(".hlp-chip", { hasText: "Devenir partenaire" }).click();
    await expect(input).toHaveValue("Devenir partenaire");
    await expect(page.locator(".hlp-result", { hasText: "Comment devenir partenaire ?" })).toBeVisible();

    await input.fill("zzzzaucunmatch");
    await expect(page.getByText("Aucune réponse exacte n’a été trouvée.").first()).toBeVisible();

    await input.fill("zones");
    await page.locator(".hlp-result", { hasText: "Quelles zones peuvent être étudiées ?" }).getByRole("button", { name: /Voir la réponse/ }).click();
    await expect(page).toHaveURL(/#zones-livraison$/);
    await expect(input).toHaveValue("");
    await expect(page.getByRole("button", { name: "Quelles zones peuvent être étudiées ?" })).toHaveAttribute("aria-expanded", "true");
  });

  test("vidéo à intégrer (emplacement) et bandeau de contact", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/aide", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 2, name: "Comprendre en images." })).toBeVisible();
    await expect(page.getByText("VIDÉO À INTÉGRER")).toBeVisible();
    await expect(page.getByText("Emplacement à activer lorsque le tutoriel est disponible.")).toBeVisible();
    await expect(page.locator("video, iframe")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2, name: "Vous ne trouvez pas votre réponse ?" })).toBeVisible();
    await expect(page.locator(".hlp-cta").getByRole("link", { name: /Contacter ONLOUTOU/ })).toHaveAttribute("href", "/contact");
    await expect(page.locator(".hlp-cta").getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", /^https:\/\/wa\.me\/2250554137777/);
  });

  test("pas de débordement horizontal", async ({ page }) => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/aide", { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width}px`).toBeLessThanOrEqual(1);
    }
  });
});