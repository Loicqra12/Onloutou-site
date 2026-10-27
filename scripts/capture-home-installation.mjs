import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");
fs.mkdirSync(captures, { recursive: true });

async function place(page, selector = "#installation") {
  await page.evaluate((sel) => {
    const section = document.querySelector(sel);
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - header - 12));
  }, selector);
  await page.waitForTimeout(1200);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(captures, "home-installation-home-1440.png"), fullPage: false });
console.log("wrote home-installation-home-1440.png");

await place(page);
await page.locator("#installation").screenshot({ path: path.join(captures, "home-installation-section-1440.png") });
console.log("wrote home-installation-section-1440.png");

await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(captures, "home-installation-home-375.png"), fullPage: false });
console.log("wrote home-installation-home-375.png");
await place(page);
await page.locator("#installation").screenshot({ path: path.join(captures, "home-installation-section-375.png") });
console.log("wrote home-installation-section-375.png");

const overflow = [];
for (const [w, h] of [[320, 700], [768, 1024], [1024, 768]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  overflow.push({ w, extra });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await place(page);
const activeStart = await page.locator(".home-install-step.is-active .home-install-number").innerText();
await page.evaluate(() => window.scrollBy(0, 420));
await page.waitForTimeout(300);
const activeMid = await page.locator(".home-install-step.is-active .home-install-number").innerText();
await page.evaluate(() => window.scrollBy(0, 520));
await page.waitForTimeout(300);
const activeEnd = await page.locator(".home-install-step.is-active .home-install-number").innerText();

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const reduced = await page.locator(".home-install-image").first().evaluate((n) => getComputedStyle(n).animationName);
await browser.close();

const noJsBrowser = await chromium.launch();
const noJs = await noJsBrowser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.setViewportSize({ width: 1440, height: 900 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  title: document.querySelector("#home-install-title")?.textContent?.trim(),
  steps: document.querySelectorAll("#installation h3").length,
  images: document.querySelectorAll("#installation img").length,
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
  const section = document.querySelector("#installation");
  const top = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, top - window.innerHeight + 120));
});
await videoPage.waitForTimeout(400);
await place(videoPage);
await videoPage.waitForTimeout(1400);
await videoPage.evaluate(() => window.scrollBy(0, 380));
await videoPage.waitForTimeout(700);
await videoPage.evaluate(() => window.scrollBy(0, 520));
await videoPage.waitForTimeout(700);
const video = videoPage.video();
await context.close();
await videoBrowser.close();
fs.renameSync(await video.path(), path.join(captures, "home-installation-motion.webm"));
console.log("wrote home-installation-motion.webm");
console.log(JSON.stringify({ errors, overflow, activeStart, activeMid, activeEnd, reduced, noJsState }, null, 2));
