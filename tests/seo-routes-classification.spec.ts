import { expect, test } from "@playwright/test";
import { discoverAppRoutes } from "@/lib/app-routes";
import { getAllRouteIndexations, getRouteIndexation, getSitemapPaths } from "@/lib/seo/routes";

test.describe("SEO — classification des routes", () => {
  test("chaque page.tsx est classifiée (source unique)", () => {
    const routes = discoverAppRoutes();
    expect(routes.length).toBe(43);

    const indexations = getAllRouteIndexations();
    expect(indexations.length).toBe(routes.length);

    for (const route of routes) {
      const idx = getRouteIndexation(route);
      expect(idx.path).toBe(route);
      expect(["public-indexable", "public-noindex"]).toContain(idx.category);
    }
  });

  test("routes indexables, noindex et sitemap électroménager", () => {
    const routes = discoverAppRoutes();
    const indexable = routes.filter((p) => getRouteIndexation(p).includeInSitemap && !p.includes("["));
    const noindex = routes.filter((p) => !getRouteIndexation(p).index);
    const sitemap = getSitemapPaths();

    expect(indexable.length).toBe(28);
    expect(noindex.length).toBe(13);
    expect(sitemap).toContain("/articles/electromenager");
    expect(sitemap).toContain("/articles/electromenager/froid-conservation");
    expect(sitemap).toContain("/articles/electromenager/froid-conservation/refrigerateur-250-l");
    expect(sitemap.every((path) => !path.includes("["))).toBe(true);
    expect(sitemap.length).toBe(47);
  });
});
