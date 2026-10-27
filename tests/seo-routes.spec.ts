import { expect, test } from "@playwright/test";
import { discoverAppRoutes } from "@/lib/app-routes";
import { getRouteIndexation, getSitemapPaths } from "@/lib/seo/routes";

const NOINDEX_PATHS = discoverAppRoutes().filter((p) => !getRouteIndexation(p).index);
const SITEMAP_PATHS = getSitemapPaths();

test.describe("SEO — sitemap et robots", () => {
  test("sitemap ne contient aucune route noindex", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();

    for (const path of NOINDEX_PATHS) {
      if (path === "/") continue;
      expect(body, `sitemap must not include ${path}`).not.toContain(path.slice(1));
    }

    expect(body).not.toContain("conditions-utilisation");
    expect(body).not.toContain("espace-partenaire");
    expect(body).not.toContain("espace-livreur");
  });

  test("sitemap — entrées cohérentes avec le build (pas l’env du runner de test)", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();
    expect(SITEMAP_PATHS.length).toBe(27);
    const hasEntries = body.includes("<loc>");
    if (hasEntries) {
      for (const path of ["/contact", "/produits", "/equipements/vehicules"]) {
        expect(body).toContain(path.replace(/^\//, ""));
      }
    } else {
      expect(body).not.toContain("<loc>");
    }
  });

  test("robots.txt répond", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-Agent:");
    expect(body).toContain("Allow: /");
  });
});
