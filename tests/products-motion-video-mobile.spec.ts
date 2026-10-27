import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

test.use({ video: { mode: "on", size: { width: 375, height: 812 } } });

test("vidéo parcours produits mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile");
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/produits", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += 100) {
      window.scrollTo(0, y);
      await new Promise((r) => window.setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(400);

  mkdirSync(OUT, { recursive: true });
  const video = page.video();
  await page.close();
  if (video) {
    await video.saveAs(path.join(OUT, "products-motion-mobile.webm"));
  }
});
