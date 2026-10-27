import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");
fs.mkdirSync(captures, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
const failed = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));
page.on("response", (res) => {
  if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
});

async function place(target) {
  await target.evaluate(() => {
    const section = document.querySelector("#equipements");
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - header - 12));
  });
  await target.waitForTimeout(900);
}

const shots = [
  ["home-equipment-editorial-320.png", 320, 700],
  ["home-equipment-editorial-375.png", 375, 812],
  ["home-equipment-editorial-768.png", 768, 1024],
  ["home-equipment-editorial-1024.png", 1024, 768],
  ["home-equipment-editorial-1440.png", 1440, 900],
  ["home-equipment-editorial-1920.png", 1920, 1080],
];

const overflow = [];
for (const [file, width, height] of shots) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await place(page);
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  overflow.push({ width, extra });
  await page.locator("#equipements").screenshot({ path: path.join(captures, file) });
  console.log("wrote", file);
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await place(page);
const reduced = await page.locator(".home-eq-photo").first().evaluate((node) => getComputedStyle(node).animationName);
await browser.close();

const noJsBrowser = await chromium.launch();
const noJs = await noJsBrowser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.setViewportSize({ width: 1440, height: 900 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  title: document.querySelector("#home-equipment-title")?.textContent?.replace(/\s+/g, " ").trim(),
  images: document.querySelectorAll("#equipements img").length,
  captions: [...document.querySelectorAll("#equipements h3")].map((node) => node.textContent.trim()),
  cta: document.querySelector("#equipements a")?.getAttribute("href"),
}));
await noJsBrowser.close();

const videoBrowser = await chromium.launch();
const context = await videoBrowser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: captures, size: { width: 1440, height: 900 } },
});
const videoPage = await context.newPage();
await videoPage.goto(`${base}/`, { waitUntil: "networkidle" });
await videoPage.evaluate(() => window.scrollTo(0, 0));
await videoPage.waitForTimeout(400);
await place(videoPage);
await videoPage.waitForTimeout(1600);
await videoPage.locator(".home-eq-mobilite").hover({ position: { x: 180, y: 280 } });
await videoPage.waitForTimeout(900);
await videoPage.locator(".home-eq-installation").hover({ position: { x: 40, y: 80 } });
await videoPage.waitForTimeout(900);
await videoPage.locator("#flotte").scrollIntoViewIfNeeded();
await videoPage.waitForTimeout(900);
const video = videoPage.video();
await context.close();
await videoBrowser.close();
fs.renameSync(await video.path(), path.join(captures, "home-equipment-editorial-motion.webm"));
console.log("wrote home-equipment-editorial-motion.webm");
console.log(JSON.stringify({ errors, failed, overflow, reduced, noJsState }, null, 2));
