import { test } from "@playwright/test";
import fs from "fs";
import path from "path";
import { discoverAppRoutes, routeToCaptureSlug } from "./lib/app-routes";

const WIDTHS = [320, 375, 768, 1024, 1440] as const;
const OUT_DIR = path.join("docs", "captures", "responsive");

const fullPageRoutes = new Set([
  "/",
  "/produits",
  "/livraison",
  "/contact",
  "/aide",
  "/espace-partenaire",
  "/espace-livreur",
  "/mentions-legales",
  "/conditions-utilisation",
]);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

const routes = discoverAppRoutes();

test.describe.configure({ mode: "serial" });

test.describe("captures responsive", () => {
  test("génération PNG par route", async ({ page }) => {
    ensureDir(OUT_DIR);
    const heights: Record<number, number> = {
      320: 568,
      375: 812,
      768: 1024,
      1024: 768,
      1440: 900,
    };

    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      if (!response || response.status() >= 400) {
        test.info().annotations.push({ type: "skip", description: `${route} → ${response?.status()}` });
        continue;
      }

      const slug = routeToCaptureSlug(route);
      const fullPage = fullPageRoutes.has(route);

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: heights[width] });
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.evaluate(async () => {
          const step = Math.max(200, Math.floor(window.innerHeight * 0.85));
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          }
          window.scrollTo(0, 0);
        });
        const file = path.join(OUT_DIR, `${slug}-${width}.png`);
        await page.screenshot({ path: file, fullPage });
      }
    }
  });
});
