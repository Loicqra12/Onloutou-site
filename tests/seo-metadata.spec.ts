import { expect, test } from "@playwright/test";
import { discoverAppRoutes } from "@/lib/app-routes";
import { getRouteIndexation } from "@/lib/seo/routes";

const routes = discoverAppRoutes();

test.describe.configure({ mode: "serial" });

test.describe("SEO — métadonnées par route", () => {
  for (const route of routes) {
    test(`${route} — title, description, H1`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(3);
      const brandCount = (title.match(/ONLOUTOU/gi) ?? []).length;
      expect(brandCount).toBeLessThanOrEqual(2);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(20);

      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });
  }

  test("404 — noindex et titre", async ({ page }) => {
    const response = await page.goto("/__playwright-not-found-probe__", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(robots?.toLowerCase()).toContain("noindex");
  });

  for (const path of ["/conditions-utilisation", "/espace-partenaire", "/mentions-legales"]) {
    test(`${path} — robots noindex`, async ({ page }) => {
      const idx = getRouteIndexation(path);
      expect(idx.index).toBe(false);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
      expect(robots?.toLowerCase()).toContain("noindex");
      expect(robots?.toLowerCase()).toContain("follow");
    });
  }

  test("aucun domaine fictif onloutou.com dans les métadonnées", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const html = await page.locator("head").innerHTML();
    expect(html).not.toContain("onloutou.com");
    const canonical = await page.locator('link[rel="canonical"]').count();
    if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
      expect(canonical).toBe(0);
    }
  });
});
