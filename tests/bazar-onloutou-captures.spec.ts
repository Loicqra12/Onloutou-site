import fs from "fs";
import path from "path";
import { test } from "@playwright/test";

const OUT = path.join("docs", "captures", "bazar-onloutou");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

test.describe("captures bazar-onloutou", () => {
  test("desktop, tablette, mobile, about, location", async ({ page }) => {
    ensureDir(OUT);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    await page.locator("#bazar-onloutou").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "projets-bazar-desktop-1440.png") });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    await page.locator("#bazar-onloutou").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "projets-bazar-tablet-768.png") });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    await page.locator("#bazar-onloutou").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "projets-bazar-mobile-375.png") });

    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
    await page.locator("#bazar-onloutou").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "projets-bazar-mobile-320.png") });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/a-propos#parcours", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Explorer cette archive/i }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "about-bazar-timeline-desktop.png") });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/a-propos#parcours", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Explorer cette archive/i }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "about-bazar-timeline-mobile.png") });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await page.locator("[data-historical-archive]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "location-bazar-band-desktop.png") });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/solutions/location", { waitUntil: "domcontentloaded" });
    await page.locator("[data-historical-archive]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "location-bazar-band-mobile.png") });
  });
});
