import { expect, test } from "@playwright/test";
import { discoverAppRoutes } from "@/lib/app-routes";

const sampleRoutes = ["/", "/contact", "/produits", "/mentions-legales"];

test.describe("SEO — JSON-LD", () => {
  for (const route of sampleRoutes) {
    test(`${route} — scripts JSON valides`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const scripts = page.locator('script[type="application/ld+json"]');
      const count = await scripts.count();
      for (let i = 0; i < count; i++) {
        const raw = await scripts.nth(i).textContent();
        expect(raw).toBeTruthy();
        const parsed = JSON.parse(raw!);
        expect(parsed["@context"]).toBeTruthy();
      }
    });
  }

  test("échantillon — pas de balise script injectée dans JSON-LD", async ({ page }) => {
    await page.goto("/aide", { waitUntil: "domcontentloaded" });
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(raw).not.toContain("</script>");
  });
});

test("routes applicatives — statut HTTP", async ({ request }) => {
  for (const route of discoverAppRoutes()) {
    const response = await request.get(route);
    expect(response.status(), route).toBeLessThan(400);
  }
});
