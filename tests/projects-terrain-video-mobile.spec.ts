import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 375, height: 812 } } });

test("vidéo mobile terrain et projets", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "une seule vidéo mobile");
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("[data-section='terrain']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.locator(".home-terrain-strip").evaluate((node) => {
    node.scrollBy({ left: 260, behavior: "smooth" });
  });
  await page.waitForTimeout(700);
  await page.locator("[data-section='projects']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Projet suivant" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Projet suivant" }).click();
  await page.waitForTimeout(700);
  mkdirSync(OUT, { recursive: true });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "home-projects-terrain-mobile.webm"));
  }
});
