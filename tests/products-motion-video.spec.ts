import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 1440, height: 900 } } });

test("vidéo parcours produits desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop");
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/produits", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.locator(".prd-intent__link").first().hover();
  await page.waitForTimeout(400);
  await page.locator("#familles-produits").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator("#usage-produits").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /Livrer ou transporter/i }).click();
  await page.waitForTimeout(500);
  await page.locator("#modes-acces").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator("#demande-produit").scrollIntoViewIfNeeded();
  await page.getByRole("radio", { name: /^moto$/i }).check();
  await page.waitForTimeout(400);
  await page.locator("details summary", { hasText: /fiches produit détaillées/i }).click();
  await page.waitForTimeout(500);

  mkdirSync(OUT, { recursive: true });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "products-motion-desktop.webm"));
  }
});
