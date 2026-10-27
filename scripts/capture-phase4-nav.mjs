import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.locator("button[aria-haspopup='true']").click();
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(captures, "mega-menu-desktop-1440.png") });
console.log("wrote mega-menu");

await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Ouvrir le menu/i }).click();
await page.locator("button[aria-controls]").filter({ hasText: "Solutions" }).first().click();
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(captures, "mobile-solutions-accordion-375.png"),
  fullPage: true,
});
console.log("wrote mobile accordion");

await browser.close();
