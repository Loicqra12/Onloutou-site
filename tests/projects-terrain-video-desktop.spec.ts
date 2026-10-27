import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("vidéo desktop terrain et projets", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "une seule vidéo desktop");
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("[data-section='terrain']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.locator("[data-section='projects']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(6500);
  await page.locator('[data-project-id="supervision"]').click();
  await page.waitForTimeout(900);
  await page.locator(".home-show-playback").click();
  await page.waitForTimeout(800);
  mkdirSync(OUT, { recursive: true });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "home-projects-terrain-desktop.webm"));
  }
});
