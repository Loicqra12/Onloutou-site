import { expect, test } from "@playwright/test";
import { discoverAppRoutes } from "@/lib/app-routes";
import { getAllRouteIndexations, getRouteIndexation, getSitemapPaths } from "@/lib/seo/routes";

test.describe("SEO — classification des routes", () => {
  test("chaque page.tsx est classifiée (source unique)", () => {
    const routes = discoverAppRoutes();
    expect(routes.length).toBe(33);

    const indexations = getAllRouteIndexations();
    expect(indexations.length).toBe(routes.length);

    for (const route of routes) {
      const idx = getRouteIndexation(route);
      expect(idx.path).toBe(route);
      expect(["public-indexable", "public-noindex"]).toContain(idx.category);
    }
  });

  test("27 routes indexables dans le sitemap, 6 noindex", () => {
    const routes = discoverAppRoutes();
    const indexable = routes.filter((p) => getRouteIndexation(p).includeInSitemap);
    const noindex = routes.filter((p) => !getRouteIndexation(p).index);

    expect(indexable.length).toBe(27);
    expect(noindex.length).toBe(6);
    expect(getSitemapPaths().length).toBe(27);
  });
});
