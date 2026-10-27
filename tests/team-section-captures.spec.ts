import fs from "fs";
import path from "path";
import { test } from "@playwright/test";

const OUT = path.join("docs", "captures", "team");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

test.describe("captures section équipe", () => {
  test("desktop, tablette, mobile, fondateur, social", async ({ page }) => {
    ensureDir(OUT);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    await page.locator("#about-team").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "team-desktop-1440.png") });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "team-tablet-768.png") });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "team-mobile-375.png") });

    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: path.join(OUT, "team-mobile-320.png") });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    await page.locator(".about-team-founder").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(OUT, "team-founder-card.png") });

    await page.locator(".about-team-social__link").first().focus();
    await page.screenshot({ path: path.join(OUT, "team-social-links-focus.png") });

    await page.screenshot({ path: path.join(OUT, "team-without-missing-photos.png"), fullPage: false });
  });
});
