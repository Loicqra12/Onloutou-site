import fs from "fs";
import path from "path";
import { test } from "@playwright/test";

const OUT = path.join("docs", "captures", "distinctions");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

test.describe("captures distinctions", () => {
  test("desktop, tablette, mobile, reduced motion", async ({ page }) => {
    ensureDir(OUT);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator(".home-recognitions").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "home-desktop-1440.png") });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator(".home-recognitions").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "home-mobile-375.png") });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/a-propos#parcours", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-parcours-desktop-1440.png"), fullPage: false });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/a-propos#parcours", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-parcours-mobile-375.png"), fullPage: false });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/a-propos#accompagnement", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-accompagnement-desktop-1440.png"), fullPage: false });

    await page.goto("/a-propos#presse", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-presse-desktop-1440.png"), fullPage: false });

    await page.goto("/a-propos#distinctions", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-distinctions-desktop-1440.png"), fullPage: false });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/a-propos#distinctions", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-distinctions-tablet-768.png"), fullPage: false });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/a-propos#distinctions", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-distinctions-mobile-375.png"), fullPage: false });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/a-propos#distinctions", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "about-distinctions-reduced-motion-1440.png"), fullPage: false });

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.screenshot({ path: path.join(OUT, "about-distinctions-typographic-fallback-1440.png"), fullPage: false });
  });
});
