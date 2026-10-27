import { chromium, devices } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const captures = path.join(root, "docs", "captures");
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

async function record(url, outfile, deviceKey, size) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices[deviceKey],
    recordVideo: { dir: captures, size },
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 1600);
  await page.waitForTimeout(1200);
  const card = page.locator(".highlight-marker").first();
  if (await card.count()) await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await context.close();
  await browser.close();
  const webm = fs.readdirSync(captures).find((f) => f.endsWith(".webm") && !f.startsWith("motion-"));
  if (webm) {
    fs.renameSync(path.join(captures, webm), outfile);
    console.log("wrote", outfile);
  }
}

await record(
  `${base}/`,
  path.join(captures, "motion-desktop.webm"),
  "Desktop Chrome",
  { width: 1440, height: 900 },
);
await record(
  `${base}/`,
  path.join(captures, "motion-mobile.webm"),
  "iPhone 13",
  { width: 375, height: 812 },
);
