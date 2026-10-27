import { test, expect } from "@playwright/test";
import { bazarForbiddenContent, bazarProject, getBazarPublicTitle } from "../src/content/bazar-project";
import { discoverAppRoutes } from "@/lib/app-routes";

test.describe("Archives catalogue bazar-onloutou", () => {
  test("section #bazar-onloutou sur /projets", async ({ page }) => {
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    const section = page.locator("#bazar-onloutou");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toContainText(getBazarPublicTitle());
    await expect(section).toContainText(bazarProject.disclaimer);
  });

  test("lien depuis /a-propos#parcours", async ({ page }) => {
    await page.goto("/a-propos#parcours", { waitUntil: "domcontentloaded" });
    const link = page.getByRole("link", { name: /Explorer cette archive/i });
    await expect(link).toHaveAttribute("href", "/projets#bazar-onloutou");
  });

  test("bandeau sur /solutions/location", async ({ page }) => {
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    const band = page.locator("[data-historical-archive]");
    await expect(band).toBeVisible();
    await expect(band.getByRole("link", { name: /Découvrir les archives du catalogue/i })).toHaveAttribute(
      "href",
      "/projets#bazar-onloutou",
    );
  });

  test("pas de route /bazar", async ({ page }) => {
    const response = await page.goto("/bazar", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });

  test("pas de nouvelle route applicative", () => {
    const routes = discoverAppRoutes();
    expect(routes).not.toContain("/bazar");
    expect(routes.length).toBe(33);
  });

  test("contenu interdit absent sur /projets", async ({ page }) => {
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    const html = await page.locator("#bazar-onloutou").innerText();
    for (const phrase of bazarForbiddenContent) {
      expect(html.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
    expect(html).not.toMatch(/Bazar d['’]ONLOUTOU est actuellement/i);
  });

  test("pas de JSON-LD Product ou Offer sur /projets", async ({ page }) => {
    await page.goto("/projets", { waitUntil: "domcontentloaded" });
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const joined = scripts.join("\n");
    expect(joined).not.toMatch(/"@type"\s*:\s*"Product"/);
    expect(joined).not.toMatch(/"@type"\s*:\s*"Offer"/);
  });

  test("galerie — pause et reduced motion", async ({ page }) => {
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    const pause = page.locator(".bazar-gallery__pause");
    await expect(pause).toBeVisible();
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".bazar-gallery.is-paused")).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "domcontentloaded" });
    const track = page.locator(".bazar-gallery__track");
    const animation = await track.evaluate((el) => getComputedStyle(el).animationName);
    expect(animation === "none" || animation === "").toBeTruthy();
  });

  test("pas de débordement horizontal", async ({ page }) => {
    const widths = [320, 375, 768, 1024, 1440];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 1;
      });
      expect(overflow).toBe(false);
    }
  });
});
