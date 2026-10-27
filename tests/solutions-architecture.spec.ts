import fs from "fs";
import path from "path";
import { expect, test } from "@playwright/test";
import { detailedSolutionPages } from "@/content/solutions-hub";
import { headerNavigation } from "@/content/header-navigation";
import { solutionsMegaMenu } from "@/content/navigation";
import { discoverAppRoutes } from "@/lib/app-routes";
import { getRouteIndexation, getSitemapPaths } from "@/lib/seo/routes";

const LEGACY_SOLUTION_PATHS = [
  "/solutions/location-equipements",
  "/solutions/vente-equipements",
  "/solutions/geolocalisation-gestion-flotte",
] as const;

const CANONICAL_SOLUTION_PATHS = [
  "/solutions/location",
  "/solutions/vente",
  "/solutions/geolocalisation",
  "/solutions/gestion-de-flotte",
  "/solutions/securisation-actifs",
  "/solutions/plateformes-sur-mesure",
] as const;

function walkSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walkSourceFiles(full, acc);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

test.describe("Architecture Solutions", () => {
  test("aucune référence interne aux anciennes routes (src + tests)", () => {
    const roots = [path.join(process.cwd(), "src"), path.join(process.cwd(), "tests")];
    const offenders: string[] = [];
    for (const root of roots) {
      for (const file of walkSourceFiles(root)) {
        if (file.endsWith("solutions-architecture.spec.ts")) continue;
        const text = fs.readFileSync(file, "utf8");
        for (const legacy of LEGACY_SOLUTION_PATHS) {
          if (text.includes(legacy)) {
            offenders.push(`${file}: ${legacy}`);
          }
        }
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  test("comptes routes applicatives et indexables", () => {
    const routes = discoverAppRoutes();
    expect(routes.length).toBe(33);
    const indexable = routes.filter((p) => getRouteIndexation(p).includeInSitemap);
    const noindex = routes.filter((p) => !getRouteIndexation(p).index);
    expect(indexable.length).toBe(27);
    expect(noindex.length).toBe(6);
    expect(getSitemapPaths().length).toBe(27);
  });

  test("anciennes routes absentes de la classification et du sitemap", () => {
    const routes = discoverAppRoutes();
    for (const legacy of LEGACY_SOLUTION_PATHS) {
      expect(routes).not.toContain(legacy);
    }
    const sitemap = getSitemapPaths();
    for (const legacy of LEGACY_SOLUTION_PATHS) {
      expect(sitemap).not.toContain(legacy);
    }
  });

  test("hub — six destinations canoniques", () => {
    expect(detailedSolutionPages.map((p) => p.href).sort()).toEqual([...CANONICAL_SOLUTION_PATHS].sort());
  });

  test("mégamenu — liens sans anciennes routes", () => {
    const hrefs = solutionsMegaMenu.flatMap((col) => [
      col.primaryHref,
      ...col.links.map((l) => l.href),
    ]);
    for (const legacy of LEGACY_SOLUTION_PATHS) {
      expect(hrefs.some((h) => h.startsWith(legacy))).toBe(false);
    }
    for (const canonical of CANONICAL_SOLUTION_PATHS) {
      if (canonical === "/solutions/securisation-actifs") {
        expect(hrefs.some((h) => h.startsWith(canonical))).toBe(true);
      }
    }
  });

  test("plan de redirection LWS documenté", () => {
    const docPath = path.join(process.cwd(), "docs", "deployment", "lws-legacy-redirects.md");
    const text = fs.readFileSync(docPath, "utf8");
    for (const legacy of LEGACY_SOLUTION_PATHS) {
      expect(text).toContain(legacy);
    }
    expect(text).toContain("Redirect 301 /solutions/location-equipements /solutions/location");
    expect(text).toContain("Redirect 301 /solutions/vente-equipements /solutions/vente");
    expect(text).toContain(
      "Redirect 301 /solutions/geolocalisation-gestion-flotte /solutions/gestion-de-flotte",
    );
  });

  test("pages canoniques répondent en 200", async ({ request }) => {
    for (const route of CANONICAL_SOLUTION_PATHS) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
    }
  });

  test("mégamenu — ancres internes pointent vers des id existants", async ({ page }) => {
    const hrefsWithHash = headerNavigation
      .flatMap((item) =>
        item.type === "menu"
          ? [
              ...(item.menu.groups.flatMap((g) => [g.href, ...g.items.map((i) => (i.type === "link" ? i.href : ""))])),
              item.menu.visual?.cta?.href,
            ]
          : [],
      )
      .filter((h): h is string => typeof h === "string" && h.includes("#") && h.startsWith("/"));

    for (const href of hrefsWithHash) {
      const [pathPart, hash] = href.split("#");
      await page.goto(pathPart || "/", { waitUntil: "domcontentloaded" });
      await expect(page.locator(`#${hash}`)).toHaveCount(1);
    }
  });

  test("hub expose l’ancre connecter-piloter", async ({ page }) => {
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    const section = page.locator("#connecter-piloter");
    await expect(section).toHaveCount(1);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  });
});
