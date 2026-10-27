import { test } from "@playwright/test";

test.use({
  video: { mode: "on", size: { width: 1440, height: 900 } },
  viewport: { width: 1440, height: 900 },
});

test("vidéo — survol, bascule et menu mobile", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(400);

  await page.getByRole("button", { name: /Solutions, ouvrir le menu/i }).hover();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: /Équipements, ouvrir le menu/i }).hover();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: /Partenaires, ouvrir le menu/i }).hover();
  await page.waitForTimeout(500);
  await page.mouse.move(200, 400);
  await page.waitForTimeout(400);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /Ouvrir le menu/i }).click();
  await page.waitForTimeout(250);
  await page.getByRole("button", { name: "Solutions" }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Équipements" }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Fermer le menu/i }).click();
  await page.waitForTimeout(250);
});
