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
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));
const failed = [];
page.on("response", (res) => {
  if (res.status() >= 400 && /assets\/images/.test(res.url())) failed.push(`${res.status()} ${res.url()}`);
});

async function shot(file, width, height, summaryName) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const section = page.locator("#univers");
  await section.scrollIntoViewIfNeeded();
  if (summaryName) {
    await page.locator("#univers summary", { hasText: summaryName }).click();
    await page.waitForTimeout(700);
  }
  await section.screenshot({ path: path.join(captures, file) });
  console.log("wrote", file);
}

await shot("home-univers-louer-1440.png", 1440, 900);
await shot("home-univers-acheter-1440.png", 1440, 900, "Acheter");
await shot("home-univers-connecter-1440.png", 1440, 900, "Connecter");
await shot("home-univers-construire-1440.png", 1440, 900, "Construire");
await shot("home-univers-mobile-375.png", 375, 812);
await shot("home-univers-tablet-768.png", 768, 1024);
await shot("home-univers-wide-1920.png", 1920, 1080);

const viewports = [[320, 568], [360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]];
const overflow = [];
for (const [w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  overflow.push({ w, extra });
}

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.locator("#univers summary").nth(1).focus();
await page.keyboard.press("Enter");
const opened = await page.locator("#univers details").nth(1).evaluate((node) => node.open);
await page.keyboard.press("ArrowDown");
const focused = await page.evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, " ").trim());

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const motion = await page.locator(".home-universe-image").first().evaluate((node) => getComputedStyle(node).animationName);

await browser.close();

const noJsBrowser = await chromium.launch();
const noJs = await noJsBrowser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.setViewportSize({ width: 1280, height: 900 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  title: document.querySelector("#home-universes-title")?.textContent?.trim() ?? "",
  summaries: [...document.querySelectorAll("#univers summary")].map((node) => node.textContent.replace(/\s+/g, " ").trim()),
  open: document.querySelector("#univers details[open] summary")?.textContent.replace(/\s+/g, " ").trim() ?? "",
  images: document.querySelectorAll("#univers img").length,
  svg: document.querySelector("#univers img[src*='ecosysteme']") ? true : false,
}));
await noJsBrowser.close();

const videoBrowser = await chromium.launch();
const context = await videoBrowser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: captures, size: { width: 1440, height: 900 } },
});
const videoPage = await context.newPage();
await videoPage.goto(`${base}/`, { waitUntil: "networkidle" });
await videoPage.evaluate(() => {
  const section = document.querySelector("#univers");
  const top = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, top - window.innerHeight + 80));
});
await videoPage.waitForTimeout(500);
await videoPage.locator("#univers").scrollIntoViewIfNeeded();
await videoPage.waitForTimeout(900);
for (const name of ["Acheter", "Connecter", "Construire", "Louer"]) {
  await videoPage.locator("#univers summary", { hasText: name }).click();
  await videoPage.waitForTimeout(800);
}
const video = videoPage.video();
await context.close();
await videoBrowser.close();
fs.renameSync(await video.path(), path.join(captures, "home-univers-motion.webm"));

console.log(JSON.stringify({ consoleErrors, failed, overflow, opened, focused, motion, noJsState }, null, 2));
