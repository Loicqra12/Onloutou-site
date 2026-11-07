import fs from "fs";
import path from "path";
import { expect, test } from "@playwright/test";
import { forbiddenRecognitionPhrases, recognitions } from "@/content/recognitions";

const FORBIDDEN_IMAGE_HOST_PATTERNS = [
  "media-files.abidjan.net",
  "static.lematin.ma",
  "medias24.com/content",
  "ssw-portal.s3.amazonaws.com",
];

const REQUIRED_STATUSES = ["LAURÉAT", "SÉLECTIONNÉ", "FINALISTE", "PARTICIPANT"];

test.describe("Distinctions et parcours entrepreneurial", () => {
  test("section #distinctions sur /a-propos", async ({ page }) => {
    await page.goto("/a-propos#distinctions", { waitUntil: "domcontentloaded" });
    const section = page.locator("#distinctions");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { name: "Des étapes de reconnaissance." })).toBeVisible();
    await expect(section.locator(".abt-recognition__card")).toHaveCount(4);
  });

  test("lien accueil vers /a-propos#parcours", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const cta = page.getByRole("link", { name: /Découvrir notre parcours/i });
    await expect(cta).toHaveAttribute("href", "/a-propos#parcours");
  });

  test("quatre statuts sur la page À propos", async ({ page }) => {
    await page.goto("/a-propos#distinctions");
    for (const status of REQUIRED_STATUSES) {
      await expect(page.locator("#distinctions")).toContainText(status);
    }
  });

  test("aperçu accueil — quatre événements attendus", async ({ page }) => {
    await page.goto("/");
    const home = page.locator(".hom-recog");
    await expect(home).toBeVisible();
    await expect(home).toContainText("Fintech Challenge BCP");
    await expect(home).toContainText("Parcours et distinctions");
  });

  test("absence des formulations interdites", async ({ page }) => {
    await page.goto("/a-propos#distinctions");
    const body = await page.locator("body").innerText();
    for (const phrase of forbiddenRecognitionPhrases) {
      expect(body.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
    await page.goto("/");
    const homeBody = await page.locator("body").innerText();
    for (const phrase of forbiddenRecognitionPhrases) {
      expect(homeBody.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  test("pas de hotlink d’images presse dans le rendu", async ({ page }) => {
    for (const route of ["/", "/a-propos#distinctions"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const imageUrls = await page.locator("img").evaluateAll((nodes) =>
        nodes.flatMap((img) => {
          const src = img.getAttribute("src") ?? "";
          const srcset = img.getAttribute("srcset") ?? "";
          return [src, srcset];
        }),
      );
      for (const url of imageUrls) {
        for (const pattern of FORBIDDEN_IMAGE_HOST_PATTERNS) {
          expect(url).not.toContain(pattern);
        }
        expect(url).not.toContain("utm_source=chatgpt");
      }
    }
  });

  test("assets locaux pour images approuvées uniquement", () => {
    for (const entry of recognitions) {
      if (entry.imageRightsStatus === "approved" && entry.image) {
        const filePath = path.join(process.cwd(), "public", entry.image.src.replace(/^\//, ""));
        expect(fs.existsSync(filePath), entry.image.src).toBe(true);
      }
    }
  });

  test("événements de la maquette présents", async ({ page }) => {
    await page.goto("/a-propos#distinctions");
    for (const title of ["Fintech Challenge — Groupe BCP", "Impact Camp by inwi", "inwiDAYS", "Seedstars Abidjan"]) {
      await expect(page.locator("#distinctions")).toContainText(title);
    }
  });

  test("contenu visible sans JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/a-propos#distinctions", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#distinctions")).toContainText("Fintech Challenge — Groupe BCP");
    await context.close();
  });

  test("prefers-reduced-motion — section présente", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/a-propos#distinctions");
    await expect(page.locator("#distinctions")).toBeVisible();
    await expect(page.locator(".abt-recognition__card").first()).toBeVisible();
  });

  test("pas de débordement horizontal sur la section", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/a-propos#distinctions");
      const overflow = await page.evaluate(() => {
        const el = document.documentElement;
        return el.scrollWidth > el.clientWidth + 1;
      });
      expect(overflow, `overflow at ${width}px`).toBe(false);
    }
  });

  test("sources externes « Pour aller plus loin » — rel noopener", async ({ page }) => {
    await page.goto("/a-propos#presse");
    const sources = page.locator("#presse a[href^='http']");
    const count = await sources.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
      const link = sources.nth(i);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });
});