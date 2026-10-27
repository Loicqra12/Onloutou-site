import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");
fs.mkdirSync(captures, { recursive: true });

const shots = [
  { file: "home-visual-final-desktop-1440.png", w: 1440, h: 900 },
  { file: "home-visual-final-mobile-375.png", w: 375, h: 812 },
  { file: "home-visual-final-tablet-768.png", w: 768, h: 1024 },
  { file: "home-visual-final-wide-1920.png", w: 1920, h: 1080 },
];

const viewports = [
  [320, 568],
  [360, 800],
  [375, 812],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
];

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));
const failed = [];
page.on("response", (res) => {
  if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
});

for (const shot of shots) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    const step = Math.max(window.innerHeight * 0.7, 400);
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(captures, shot.file), fullPage: true });
  console.log("wrote", shot.file);
}

const overflow = [];
for (const [w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const extra = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  overflow.push({ w, h, extra });
}

await page.emulateMedia({ reducedMotion: "reduce" });
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const motion = await page.evaluate(() => {
  const photo = document.querySelector(".home-hero-photo");
  const style = photo ? getComputedStyle(photo) : null;
  return {
    photoAnimation: style?.animationName ?? null,
    hiddenReveals: document.querySelectorAll(".motion-reveal:not(.is-revealed)").length,
  };
});

await browser.close();

async function record(file, width, height) {
  const videoBrowser = await chromium.launch();
  const context = await videoBrowser.newContext({
    recordVideo: { dir: captures, size: { width, height } },
    viewport: { width, height },
  });
  const videoPage = await context.newPage();
  await videoPage.goto(`${base}/`, { waitUntil: "networkidle" });
  await videoPage.waitForTimeout(1200);
  const sections = ["#univers", "#equipements", "#flotte", "#home-install-title", "#a-propos", "#contact"];
  for (const selector of sections) {
    const target = videoPage.locator(selector).first();
    if (await target.count()) {
      await target.scrollIntoViewIfNeeded();
      await videoPage.waitForTimeout(900);
    }
  }
  await videoPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await videoPage.waitForTimeout(1200);
  const video = videoPage.video();
  await context.close();
  await videoBrowser.close();
  const saved = await video.path();
  const dest = path.join(captures, file);
  fs.renameSync(saved, dest);
  console.log("wrote", file);
}

await record("home-visual-motion-desktop.webm", 1440, 900);
await record("home-visual-motion-mobile.webm", 390, 844);

const noJs = await chromium.launch();
const noJsContext = await noJs.newContext({ javaScriptEnabled: false });
const noJsPage = await noJsContext.newPage();
await noJsPage.setViewportSize({ width: 1280, height: 800 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
  images: [...document.images].map((img) => img.currentSrc || img.src).filter(Boolean).length,
}));
await noJs.close();

console.log(JSON.stringify({ consoleErrors, failed, overflow, motion, noJsState }, null, 2));
