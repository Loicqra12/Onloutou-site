import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("vidéo devenir livreur desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop");
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/devenir-livreur", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.locator("#drv-profiles-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("tab", { name: /Utilitaire/i }).click();
  await page.waitForTimeout(400);
  await page.locator("#parcours-livreur").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator("#drv-safety-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator("#candidature-livreur").scrollIntoViewIfNeeded();
  await page.getByLabel(/Nom ou raison sociale/i).fill("Démo");
  await page.getByRole("checkbox", { name: /manifestation d’intérêt/i }).check();
  await page.waitForTimeout(400);
  await page.locator("details summary", { hasText: /application livreur/i }).click();
  await page.waitForTimeout(500);

  mkdirSync(OUT, { recursive: true });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "driver-partner-motion-desktop.webm"));
  }
});
