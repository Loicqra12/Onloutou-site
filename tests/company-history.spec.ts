import fs from "fs";
import path from "path";
import { expect, test } from "@playwright/test";
import { discoverAppRoutes } from "@/lib/app-routes";
import { getRouteIndexation } from "@/lib/seo/routes";
import { forbiddenHistoryPhrases } from "@/content/company-history";
import { forbiddenRecognitionPhrases } from "@/content/recognitions";
import { historyImageAssets } from "@/content/history-images";
import { pendingInnovationArchives } from "@/content/company-history";

const ANCHORS = ["parcours", "distinctions", "accompagnement", "presse"] as const;

const FORBIDDEN_IMAGE_HOSTS = [
  "media-files.abidjan.net",
  "static.lematin.ma",
  "medias24.com/content",
  "ssw-portal.s3.amazonaws.com",
];

test.describe("Parcours institutionnel ONLOUTOU", () => {
  test("ancres #parcours, #distinctions, #accompagnement, #presse", async ({ page }) => {
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    for (const id of ANCHORS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("création 2016 et fin du cycle Comoé 2021 (repères de la maquette)", async ({ page }) => {
    await page.goto("/a-propos#parcours");
    const section = page.locator("#parcours");
    await expect(section).toContainText("2016");
    await expect(section).toContainText("La location de biens et d’équipements, associée à une composante technologique.");
    await expect(section).toContainText("2021");
    await expect(section).toContainText("Comoé Capital");
  });

  test("statuts de reconnaissance exacts", async ({ page }) => {
    await page.goto("/a-propos#distinctions");
    const block = page.locator("#distinctions");
    await expect(block).toContainText("LAURÉAT");
    await expect(block).toContainText("SÉLECTIONNÉ");
    await expect(block).toContainText("FINALISTE");
    await expect(block).toContainText("PARTICIPANT");
  });

  test("formulations interdites absentes", async ({ page }) => {
    await page.goto("/a-propos");
    const body = await page.locator("body").innerText();
    const allForbidden = [...forbiddenHistoryPhrases, ...forbiddenRecognitionPhrases];
    for (const phrase of allForbidden) {
      expect(body.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  test("FINDME / I'M HERE non rendus publiquement", async ({ page }) => {
    await page.goto("/a-propos");
    const body = await page.locator("body").innerText();
    for (const archive of pendingInnovationArchives) {
      expect(body).not.toContain(archive.codename);
    }
    await page.goto("/projets");
    const projects = await page.locator("body").innerText();
    for (const archive of pendingInnovationArchives) {
      expect(projects).not.toContain(archive.codename);
    }
  });

  test("pas de hotlink d’images presse", async ({ page }) => {
    await page.goto("/a-propos");
    const urls = await page.locator("img").evaluateAll((nodes) =>
      nodes.flatMap((img) => [img.getAttribute("src") ?? "", img.getAttribute("srcset") ?? ""]),
    );
    for (const url of urls) {
      for (const host of FORBIDDEN_IMAGE_HOSTS) {
        expect(url).not.toContain(host);
      }
    }
  });

  test("images locales approuvées existent", () => {
    for (const asset of historyImageAssets) {
      if (asset.rights === "approved" && asset.publicPath) {
        const filePath = path.join(process.cwd(), "public", asset.publicPath.replace(/^\//, ""));
        expect(fs.existsSync(filePath), asset.publicPath).toBe(true);
      }
    }
  });

  test("SEO — pas de nouvelle route", () => {
    expect(discoverAppRoutes().length).toBe(46);
    const indexable = discoverAppRoutes().filter((p) => getRouteIndexation(p).includeInSitemap);
    expect(indexable.length).toBe(27);
  });

  test("accueil — aperçu et lien vers le parcours", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Découvrir notre parcours/i })).toHaveAttribute(
      "href",
      "/a-propos#parcours",
    );
    await expect(page.locator(".hom-recog")).toContainText("Fintech Challenge BCP");
  });

  test("contenu visible sans JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/a-propos#accompagnement", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#accompagnement")).toContainText("Du Fintech Challenge à Banque Atlantique.");
    await expect(page.locator("#parcours")).toContainText("Un accompagnement structurant");
    await context.close();
  });

  test("prefers-reduced-motion et overflow horizontal", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/a-propos#distinctions");
    await expect(page.locator("#distinctions")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
});