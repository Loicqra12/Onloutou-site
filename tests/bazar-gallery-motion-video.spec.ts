import { mkdirSync } from "node:fs";
import path from "node:path";
import { test } from "@playwright/test";

const OUT = path.join("docs", "captures", "bazar-onloutou");

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("vidéo galerie archives bazar", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop");
  test.setTimeout(60_000);
  mkdirSync(OUT, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projets#bazar-onloutou", { waitUntil: "domcontentloaded" });
  await page.locator("#bazar-onloutou").scrollIntoViewIfNeeded();
  await page.waitForTimeout(8000);
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "bazar-gallery-motion.webm"));
  }
});
