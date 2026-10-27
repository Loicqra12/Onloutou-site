import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

const routes = [
  "/",
  "/solutions",
  "/solutions/geolocalisation",
  "/solutions/gestion-de-flotte",
  "/solutions/location",
  "/solutions/vente",
  "/solutions/plateformes-sur-mesure",
  "/solutions/securisation-actifs",
  "/expertise",
  "/equipements",
  "/equipements/vehicules",
  "/equipements/motos",
  "/equipements/camions-engins",
  "/equipements/outils-materiels",
  "/equipements/equipements-connectes",
  "/projets",
  "/partenaires",
  "/partenaires/fournisseurs",
  "/partenaires/livreurs",
  "/partenaires/technologiques",
  "/devenir-partenaire",
  "/livraison",
  "/devenir-livreur",
  "/produits",
  "/espace-partenaire",
  "/espace-livreur",
  "/a-propos",
  "/contact",
  "/aide",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
  "/conditions-utilisation",
];

function slug(route: string) {
  if (route === "/") return "home";
  return route.slice(1).replace(/\//g, "__");
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

test.describe("captures passe graphique finale", () => {
  test("desktop et mobile", async ({ page }, testInfo) => {
    const phase = process.env.AUDIT_CAPTURE_PHASE === "before" ? "before" : "after";
    const baseDir = path.join("docs", "captures", "final-audit", phase);
    ensureDir(baseDir);

    const fullPageRoutes = new Set([
      "/",
      "/solutions",
      "/equipements",
      "/produits",
      "/livraison",
      "/espace-partenaire",
      "/espace-livreur",
      "/a-propos",
      "/contact",
    ]);

    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      if (!response || response.status() >= 400) {
        test.info().annotations.push({ type: "skip-route", description: `${route} → ${response?.status()}` });
        continue;
      }

      const name = slug(route);
      const fullPage = fullPageRoutes.has(route);

      if (testInfo.project.name === "desktop") {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({
          path: path.join(baseDir, `${name}-desktop.png`),
          fullPage,
        });
      } else {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.screenshot({
          path: path.join(baseDir, `${name}-mobile.png`),
          fullPage,
        });
      }
    }
  });
});
