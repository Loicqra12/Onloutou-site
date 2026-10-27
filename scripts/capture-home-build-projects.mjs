import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");
fs.mkdirSync(captures, { recursive: true });

async function place(page, selector) {
  await page.evaluate((sel) => {
    const section = document.querySelector(sel);
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - header - 12));
  }, selector);
  await page.waitForTimeout(1400);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));
page.on("response", (res) => {
  if (res.status() >= 400 && /assets\/images/.test(res.url())) errors.push(`${res.status()} ${res.url()}`);
});

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await place(page, "#plateforme");
await page.locator("#plateforme").screenshot({ path: path.join(captures, "home-build-1440.png") });
await place(page, "#projets");
await page.locator("#projets").screenshot({ path: path.join(captures, "home-projects-1440.png") });
const pair = await page.evaluate(() => {
  const a = document.querySelector("#plateforme");
  const b = document.querySelector("#projets");
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
  const top = a.getBoundingClientRect().top + window.scrollY - header - 12;
  const bottom = b.getBoundingClientRect().bottom + window.scrollY;
  return { top, height: Math.ceil(bottom - top) };
});
await page.setViewportSize({ width: 1440, height: Math.min(1600, pair.height + 40) });
await page.evaluate((y) => window.scrollTo(0, y), pair.top);
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(captures, "home-build-projects-1440.png"),
  clip: { x: 0, y: 0, width: 1440, height: Math.min(1600, pair.height + 24) },
});

await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await place(page, "#plateforme");
await page.locator("#plateforme").screenshot({ path: path.join(captures, "home-build-375.png") });
await place(page, "#projets");
await page.locator("#projets").screenshot({ path: path.join(captures, "home-projects-375.png") });
const pairM = await page.evaluate(() => {
  const a = document.querySelector("#plateforme");
  const b = document.querySelector("#projets");
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
  const top = a.getBoundingClientRect().top + window.scrollY - header - 12;
  const bottom = b.getBoundingClientRect().bottom + window.scrollY;
  return { top, height: Math.ceil(bottom - top) };
});
await page.setViewportSize({ width: 375, height: Math.min(2200, pairM.height + 40) });
await page.evaluate((y) => window.scrollTo(0, y), pairM.top);
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(captures, "home-build-projects-375.png"),
  clip: { x: 0, y: 0, width: 375, height: Math.min(2200, pairM.height + 24) },
});

const overflow = [];
for (const [w, h] of [
  [320, 700],
  [375, 812],
  [768, 1024],
  [1024, 768],
  [1440, 900],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  overflow.push({ w, extra });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const reduced = await page.evaluate(() => ({
  build: getComputedStyle(document.querySelector(".home-build-photo")).animationName,
  projects: getComputedStyle(document.querySelector(".home-projects-photo")).animationName,
}));
await browser.close();

const noJsBrowser = await chromium.launch();
const noJs = await noJsBrowser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.setViewportSize({ width: 1440, height: 900 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  buildTitle: document.querySelector("#home-build-title")?.textContent?.trim(),
  modules: document.querySelectorAll(".home-build-module").length,
  projectsTitle: document.querySelector("#home-projects-title")?.textContent?.trim(),
  images: {
    build: document.querySelectorAll("#plateforme img").length,
    projects: document.querySelectorAll("#projets img").length,
  },
  href: document.querySelector(".home-projects-link")?.getAttribute("href"),
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
  const section = document.querySelector("#plateforme");
  const top = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, top - window.innerHeight + 90));
});
await videoPage.waitForTimeout(400);
await place(videoPage, "#plateforme");
await videoPage.waitForTimeout(1600);
await videoPage.locator(".home-build-module").nth(1).hover();
await videoPage.waitForTimeout(600);
await place(videoPage, "#projets");
await videoPage.waitForTimeout(1400);
await videoPage.locator(".home-projects-link").hover();
await videoPage.waitForTimeout(700);
const video = videoPage.video();
await context.close();
await videoBrowser.close();
fs.renameSync(await video.path(), path.join(captures, "home-build-projects-motion.webm"));
console.log("wrote captures");
console.log(JSON.stringify({ errors, overflow, reduced, noJsState }, null, 2));
