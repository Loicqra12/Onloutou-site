import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const budgets = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "docs/performance/budgets.json"), "utf8"),
) as {
  criticalRoutes: string[];
  maxPublicAssetBytes: number;
  maxSinglePublicImageBytes: number;
  documentedHeavyThresholdBytes: number;
  forbiddenResponsePatterns: string[];
};

const inventoryPath = path.join(process.cwd(), "docs/performance/assets-inventory.json");
const inventory = fs.existsSync(inventoryPath)
  ? (JSON.parse(fs.readFileSync(inventoryPath, "utf8")) as {
      files: { path: string; bytes: number; ext: string }[];
    })
  : { files: [] };

test.describe("Performance — budgets déterministes", () => {
  for (const route of budgets.criticalRoutes) {
    test(`${route} — pas d’erreur réseau ni console sur ressources critiques`, async ({
      page,
    }) => {
      const failed: string[] = [];
      page.on("response", (res) => {
        const url = res.url();
        if (res.status() >= 400 && !url.includes("favicon")) {
          failed.push(`${res.status()} ${url}`);
        }
        for (const pattern of budgets.forbiddenResponsePatterns) {
          if (url.includes(pattern)) failed.push(`forbidden ${url}`);
        }
      });

      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(failed, failed.join("\n")).toEqual([]);
      expect(consoleErrors.filter((e) => !e.includes("favicon"))).toEqual([]);
    });
  }

  test("accueil — image hero LCP sans lazy loading", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const heroImg = page.locator("section#accueil .home-hero-photo img").first();
    await expect(heroImg).toBeVisible();
    const loading = await heroImg.getAttribute("loading");
    expect(loading).not.toBe("lazy");
    const webpSource = page.locator("section#accueil .home-hero-photo picture source[type='image/webp']").first();
    await expect(webpSource).toHaveAttribute("srcset", /installation-traceur.*\.webp/);
  });

  test("inventaire public — fichiers ≥ 400 Ko listés dans assets-inventory.md", () => {
    const mdPath = path.join(process.cwd(), "docs/performance/assets-inventory.md");
    const md = fs.readFileSync(mdPath, "utf8");
    const heavy = inventory.files.filter((f) => f.bytes >= budgets.documentedHeavyThresholdBytes);
    expect(heavy.length).toBeGreaterThan(0);
    for (const file of heavy) {
      expect(md, `manquant dans assets-inventory.md: ${file.path}`).toContain(file.path);
    }
  });

  test("aucune importation de docs/captures dans le bundle source", async () => {
    const srcDir = path.join(process.cwd(), "src");
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if (/\.(tsx?|jsx?|css)$/.test(name)) {
          const text = fs.readFileSync(full, "utf8");
          if (text.includes("docs/captures") || text.includes(".webm")) {
            hits.push(full);
          }
        }
      }
    };
    walk(srcDir);
    expect(hits).toEqual([]);
  });
});
