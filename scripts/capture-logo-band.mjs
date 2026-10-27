import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");
fs.mkdirSync(captures, { recursive: true });

const shots = [
  { file: "logo-band-dark-desktop-1440.png", w: 1440, h: 900 },
  { file: "logo-band-dark-tablet-768.png", w: 768, h: 1024 },
  { file: "logo-band-dark-mobile-375.png", w: 375, h: 812 },
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
  const url = res.url();
  if (res.status() >= 400 && url.includes("logo-partner")) failed.push(`${res.status()} ${url}`);
});

for (const shot of shots) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const band = page.locator(".logo-band");
  await band.evaluate((node) => node.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(2200);
  await band.screenshot({ path: path.join(captures, shot.file) });
  console.log("wrote", shot.file);
}

const text = await page.locator(".logo-band").innerText();
const count = await page.locator(".logo-mark").count();
await browser.close();

const videoBrowser = await chromium.launch();
const context = await videoBrowser.newContext({
  viewport: { width: 1440, height: 800 },
  recordVideo: { dir: captures, size: { width: 1440, height: 800 } },
});
const videoPage = await context.newPage();
await videoPage.goto(`${base}/`, { waitUntil: "networkidle" });
await videoPage.evaluate(() => {
  const band = document.querySelector(".logo-band");
  const top = band.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, top - window.innerHeight - 40));
});
await videoPage.waitForTimeout(700);
await videoPage.evaluate(() => {
  const band = document.querySelector(".logo-band");
  const top = band.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top - 180, behavior: "smooth" });
});
await videoPage.waitForTimeout(3200);
const video = videoPage.video();
await context.close();
await videoBrowser.close();
const saved = await video.path();
fs.renameSync(saved, path.join(captures, "logo-band-dark-motion.webm"));
console.log("wrote logo-band-dark-motion.webm");
console.log(JSON.stringify({ consoleErrors, failed, count, text: text.replace(/\s+/g, " ").trim() }, null, 2));
