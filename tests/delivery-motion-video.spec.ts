import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("vidéo parcours livraison desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop");
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/livraison", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  await page.locator(".dlv-audience__panel--client").hover();
  await page.waitForTimeout(400);
  await page.locator("#fonctionnement-livraison").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.getByRole("tab", { name: /utilitaire/i }).click();
  await page.waitForTimeout(500);
  await page.locator("#dlv-logistics-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator("#devenir-livreur").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator("#demande-livraison").scrollIntoViewIfNeeded();
  await page.getByRole("radio", { name: /^produit$/i }).check();
  await page.waitForTimeout(400);
  await page.locator("details summary", { hasText: /zones peuvent être couvertes/i }).click();
  await page.waitForTimeout(600);

  mkdirSync(OUT, { recursive: true });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "delivery-motion-desktop.webm"));
  }
});
