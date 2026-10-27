import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("vidéo de parcours accueil", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "une seule vidéo desktop");
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += 180) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    const cta = document.querySelector("[data-section='contact-cta']");
    cta?.scrollIntoView({ behavior: "instant", block: "center" });
  });
  const primary = page.locator(".home-cta-primary");
  await primary.hover();
  await page.waitForTimeout(500);
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, "home-cta-hover-1440.png") });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "home-cta-footer-motion.webm"));
  }
});
