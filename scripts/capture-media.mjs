import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

const shots = [
  { file: "media-home-desktop-1440.png", path: "/", w: 1440, h: 900 },
  { file: "media-home-mobile-375.png", path: "/", w: 375, h: 812 },
  { file: "media-geolocation-desktop-1440.png", path: "/solutions/geolocalisation", w: 1440, h: 900 },
  { file: "media-geolocation-mobile-375.png", path: "/solutions/geolocalisation", w: 375, h: 812 },
  { file: "media-about-desktop-1440.png", path: "/a-propos", w: 1440, h: 900 },
  { file: "media-about-mobile-375.png", path: "/a-propos", w: 375, h: 812 },
  { file: "media-logo-header-desktop.png", path: "/", w: 1440, h: 200, headerOnly: true },
  { file: "media-logo-header-mobile.png", path: "/", w: 375, h: 200, headerOnly: true },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${base}${shot.path}`, { waitUntil: "networkidle" });
  const outfile = path.join(captures, shot.file);
  if (shot.headerOnly) {
    await page.locator("header").screenshot({ path: outfile });
  } else {
    await page.screenshot({ path: outfile, fullPage: true });
  }
  console.log("wrote", outfile);
}

await browser.close();

const videoBrowser = await chromium.launch();
const videoContext = await videoBrowser.newContext({
  recordVideo: { dir: captures, size: { width: 1440, height: 900 } },
});
const videoPage = await videoContext.newPage();
await videoPage.goto(`${base}/solutions/geolocalisation`, { waitUntil: "networkidle" });
await videoPage.waitForTimeout(1500);
await videoPage.mouse.wheel(0, 2200);
await videoPage.waitForTimeout(2500);
await videoContext.close();
await videoBrowser.close();
const webm = (await import("node:fs")).readdirSync(captures).find((f) => f.endsWith(".webm") && !f.startsWith("media-"));
if (webm) {
  const fs = await import("node:fs");
  const pathMod = await import("node:path");
  fs.renameSync(pathMod.join(captures, webm), pathMod.join(captures, "media-geolocation-scroll.webm"));
  console.log("wrote media-geolocation-scroll.webm");
}
