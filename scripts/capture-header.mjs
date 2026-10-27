import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(file, width, height, action, clipHeight) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  if (action) await action();
  const outfile = path.join(captures, file);
  if (clipHeight) {
    await page.screenshot({ path: outfile, clip: { x: 0, y: 0, width, height: clipHeight } });
  } else {
    await page.locator("header").screenshot({ path: outfile });
  }
  console.log("wrote", file);
}

await shot("header-yellow-black-desktop-1440.png", 1440, 900);
await shot("header-yellow-black-tablet-768.png", 768, 1024);
await shot("header-yellow-black-mobile-390.png", 390, 844);
await shot("header-yellow-black-mobile-open-390.png", 390, 844, async () => {
  await page.getByRole("button", { name: /Ouvrir le menu/i }).click();
  await page.waitForTimeout(250);
}, 844);
await shot("header-yellow-black-megamenu-1440.png", 1440, 900, async () => {
  await page.locator("button[aria-haspopup='true']").click();
  await page.waitForTimeout(250);
}, 640);
await shot("header-yellow-black-scrolled-1440.png", 1440, 900, async () => {
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(300);
});

await browser.close();
