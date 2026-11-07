import { expect, test } from "@playwright/test";

const COLUMNS: Record<string, string[]> = {
  Solutions: [
    "/solutions/location",
    "/solutions/vente",
    "/solutions/geolocalisation",
    "/solutions/gestion-de-flotte",
    "/solutions/securisation-actifs",
    "/solutions/plateformes-sur-mesure",
    "/projets",
  ],
  Explorer: ["/expertise", "/equipements", "/produits", "/projets", "/a-propos", "/aide", "/contact"],
  Partenaires: ["/partenaires", "/espace-partenaire", "/livraison", "/devenir-livreur", "/espace-livreur"],
  "Informations légales": [
    "/mentions-legales",
    "/confidentialite",
    "/cookies",
    "/conditions-utilisation",
    "/mentions-legales#propriete-intellectuelle",
    "/sitemap.xml",
    "/contact",
  ],
};

test.describe("pied de page", () => {
  test("marque, quatre colonnes et barre inférieure", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const footer = page.locator("footer.site-footer");
    await expect(footer.locator(".site-footer-brand")).toContainText("+225 05 54 13 77 77");
    await expect(footer.locator(".site-footer-brand")).toContainText("Abidjan, Côte d’Ivoire");
    await expect(footer.locator(".site-footer-brand a[href^='tel:']")).toHaveAttribute("href", "tel:+2250554137777");
    for (const [title, hrefs] of Object.entries(COLUMNS)) {
      const col = footer.locator(".site-footer-col", { has: page.getByRole("heading", { name: title, exact: true }) });
      await expect(col).toHaveCount(1);
      const found = await col.locator("a").evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href")));
      expect(found, title).toEqual(hrefs);
    }
    await expect(footer.locator(".site-footer-base")).toContainText("© 2026 ONLOUTOU. Tous droits réservés.");
    await expect(footer.getByRole("button", { name: "Retour en haut de page" })).toBeVisible();
  });

  test("disposition bureau : marque à gauche, quatre colonnes alignées", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const boxes = await page
      .locator("footer.site-footer")
      .locator(".site-footer-brand, .site-footer-solutions, .site-footer-explore, .site-footer-partners, .site-footer-legal")
      .evaluateAll((nodes) => nodes.map((n) => n.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y })));
    expect(boxes).toHaveLength(5);
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x);
      expect(Math.abs(boxes[i].y - boxes[0].y)).toBeLessThan(4);
    }
  });

  test("responsive : aucune barre horizontale", async ({ page }) => {
    for (const width of [320, 390, 480, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `débordement à ${width}px`).toBe(false);
      const footerOverflow = await page.locator("footer.site-footer").evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      expect(footerOverflow, `pied de page à ${width}px`).toBe(false);
    }
  });
});