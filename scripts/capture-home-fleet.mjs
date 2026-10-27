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
    const section = document.querySelector("#flotte");
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - header - 12));
  });
  await target.waitForTimeout(1500);
}

const shots = [
  ["home-fleet-product-320.png", 320, 700],
  ["home-fleet-product-375.png", 375, 812],
  ["home-fleet-product-768.png", 768, 1024],
  ["home-fleet-product-1024.png", 1024, 768],
  ["home-fleet-product-1440.png", 1440, 900],
  ["home-fleet-product-1920.png", 1920, 1080],
];

const overflow = [];
for (const [file, width, height] of shots) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await place(page);
  const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  overflow.push({ width, extra });
  await page.locator("#flotte").screenshot({ path: path.join(captures, file) });
  console.log("wrote", file);
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await place(page);
const states = ["Localiser", "Suivre", "Alerter", "Analyser"];
const files = ["home-fleet-localiser-1440.png", "home-fleet-suivre-1440.png", "home-fleet-alerter-1440.png", "home-fleet-analyser-1440.png"];
for (let i = 0; i < states.length; i += 1) {
  await page.getByRole("button", { name: states[i] }).click();
  await page.waitForTimeout(400);
  await page.locator("#flotte").screenshot({ path: path.join(captures, files[i]) });
  console.log("wrote", files[i]);
}
const pressed = await page.locator("#flotte button[aria-pressed='true']").innerText();
await page.locator("#flotte button").first().focus();
await page.keyboard.press("ArrowDown");
const afterArrow = await page.evaluate(() => document.activeElement?.textContent?.replace(/\s+/g, " ").trim());
await page.keyboard.press("Enter");
const afterEnter = await page.locator("#flotte button[aria-pressed='true']").innerText();

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
const reduced = await page.locator(".home-fleet-window").first().evaluate((node) => getComputedStyle(node).animationName);
await browser.close();

const noJsBrowser = await chromium.launch();
const noJs = await noJsBrowser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.setViewportSize({ width: 1440, height: 900 });
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  title: document.querySelector("#home-fleet-title")?.textContent?.replace(/\s+/g, " ").trim(),
  caps: document.querySelectorAll("#flotte button").length,
  images: document.querySelectorAll("#flotte img").length,
  svgMain: Boolean(document.querySelector("#flotte img[src*='geolocalisation-animee'], #flotte img[src*='geolocalisation-animee.svg']")),
  disclaimer: document.querySelector(".home-fleet-disclaimer")?.textContent?.replace(/\s+/g, " ").trim(),
  cta: document.querySelector(".home-fleet-link")?.getAttribute("href"),
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
  const section = document.querySelector("#flotte");
  const top = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, Math.max(0, top - window.innerHeight + 80));
});
await videoPage.waitForTimeout(300);
await place(videoPage);
await videoPage.waitForTimeout(1600);
for (const name of ["Suivre", "Alerter", "Analyser", "Localiser"]) {
  await videoPage.getByRole("button", { name }).click();
  await videoPage.waitForTimeout(700);
}
const video = videoPage.video();
await context.close();
await videoBrowser.close();
fs.renameSync(await video.path(), path.join(captures, "home-fleet-product-motion.webm"));
console.log("wrote home-fleet-product-motion.webm");
console.log(JSON.stringify({ errors, failed, overflow, pressed, afterArrow, afterEnter, reduced, noJsState }, null, 2));
