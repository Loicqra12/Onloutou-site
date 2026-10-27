import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

const browser = await chromium.launch();
const page = await browser.newPage();

async function full(file, url, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(`${base}${url}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(captures, file), fullPage: true });
  console.log("wrote", file);
}

await full("typography-home-desktop-1440.png", "/", 1440, 900);
await full("typography-home-mobile-375.png", "/", 375, 812);
await full("typography-solutions-desktop-1440.png", "/solutions", 1440, 900);
await full("typography-about-desktop-1440.png", "/a-propos", 1440, 900);

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.locator("#flotte").scrollIntoViewIfNeeded();
await page.locator("#flotte").screenshot({ path: path.join(captures, "typography-geolocation-dark-section.png") });
console.log("wrote typography-geolocation-dark-section.png");

await page.locator("h2", { hasText: "Du problème au résultat" }).scrollIntoViewIfNeeded();
const method = page.locator("section", { hasText: "Du problème au résultat" }).first();
await method.screenshot({ path: path.join(captures, "typography-method-section.png") });
console.log("wrote typography-method-section.png");

await page.locator("footer").screenshot({ path: path.join(captures, "typography-footer-dark-desktop.png") });
console.log("wrote typography-footer-dark-desktop.png");

await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.locator("footer").scrollIntoViewIfNeeded();
await page.locator("footer").screenshot({ path: path.join(captures, "typography-footer-dark-mobile.png") });
console.log("wrote typography-footer-dark-mobile.png");

await browser.close();
