import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

const shots = [
  { file: "home-header-hero-320.png", w: 320, h: 568 },
  { file: "home-header-hero-375.png", w: 375, h: 812 },
  { file: "home-header-hero-768.png", w: 768, h: 1024 },
  { file: "home-header-hero-1440.png", w: 1440, h: 900 },
  { file: "home-header-hero-1920.png", w: 1920, h: 1080 },
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
  await page.setViewportSize({ width: shot.w, height: Math.max(shot.h, 1400) });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const bottom = await page.locator(".logo-band").evaluate((node) => {
    const section = node.closest("section");
    const rect = section.getBoundingClientRect();
    return Math.ceil(rect.bottom + window.scrollY);
  });
  await page.screenshot({
    path: path.join(captures, shot.file),
    clip: { x: 0, y: 0, width: shot.w, height: bottom },
  });
  console.log("wrote", shot.file, bottom);
}

const overflow = [];
for (const [w, h] of viewports) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  overflow.push({ w, h, extra });
}

await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Ouvrir le menu" }).click();
const menuOpen = await page.getByRole("link", { name: "Équipements" }).first().isVisible();
await page.keyboard.press("Escape");
const menuClosed = await page.getByRole("button", { name: "Ouvrir le menu" }).isVisible();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const before = await page.locator(".header-utility").evaluate((node) => getComputedStyle(node).maxHeight);
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(400);
const after = await page.evaluate(() => ({
  utility: getComputedStyle(document.querySelector(".header-utility")).maxHeight,
  sticky: getComputedStyle(document.querySelector("header")).position,
  shadow: getComputedStyle(document.querySelector(".header-shell")).boxShadow,
}));

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const motion = await page.evaluate(() => ({
  hero: getComputedStyle(document.querySelector(".hero-seq")).animationName,
  logos: document.querySelectorAll(".refs-logo").length,
}));

await browser.close();

const noJsBrowser = await chromium.launch();
const noJsContext = await noJsBrowser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJsContext.newPage();
await noJsPage.setViewportSize({ width: 1280, height: 800 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJs = await noJsPage.evaluate(() => ({
  h1: document.querySelector("h1")?.innerText.replace(/\s+/g, " ").trim(),
  logos: document.querySelectorAll(".refs-logo img").length,
  phone: document.querySelector('a[href^="tel:"]')?.getAttribute("href"),
}));
await noJsBrowser.close();

console.log(JSON.stringify({ consoleErrors, failed, overflow, menuOpen, menuClosed, before, after, motion, noJs }, null, 2));
