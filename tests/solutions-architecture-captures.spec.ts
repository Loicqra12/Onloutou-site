import fs from "fs";
import path from "path";
import { test } from "@playwright/test";

const OUT = path.join("docs", "captures", "solutions-architecture");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

test.describe("captures architecture Solutions", () => {
  test("desktop et mobile", async ({ page, browser }) => {
    ensureDir(OUT);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "hub-desktop-1440.png"), fullPage: true });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "hub-mobile-375.png"), fullPage: true });

    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto("/", { waitUntil: "domcontentloaded" });
    await desktopPage.getByRole("button", { name: /Solutions/i }).hover();
    await desktopPage.waitForTimeout(400);
    await desktopPage.screenshot({ path: path.join(OUT, "megamenu-desktop-open.png") });
    await desktopContext.close();

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Solutions/i }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, "mobile-menu-solutions-open.png"), fullPage: false });

    const solutionShots: { route: string; slug: string }[] = [
      { route: "/solutions/location", slug: "location" },
      { route: "/solutions/vente", slug: "vente" },
      { route: "/solutions/geolocalisation", slug: "geolocalisation" },
      { route: "/solutions/gestion-de-flotte", slug: "gestion-de-flotte" },
    ];

    for (const { route, slug } of solutionShots) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.screenshot({ path: path.join(OUT, `${slug}-desktop-1440.png`), fullPage: true });

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.screenshot({ path: path.join(OUT, `${slug}-mobile-375.png`), fullPage: true });
    }
  });
});
