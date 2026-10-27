import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

async function place(page) {
  await page.evaluate(() => {
    const section = document.querySelector("#univers");
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - header - 12));
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await place(page);
await page.mouse.move(20, 20);
await page.locator("#univers summary", { hasText: "Acheter" }).click();
await page.mouse.move(20, 20);
await page.waitForTimeout(9000);
const atNine = await page.locator("#univers details[open] .home-universe-title").innerText();
const progress = await page.locator("#univers .home-universe[open] .home-universe-progress").evaluate((node) => {
  const style = getComputedStyle(node);
  return { name: style.animationName, state: style.animationPlayState, display: style.display };
});
await page.waitForTimeout(5500);
const afterCycle = await page.locator("#univers details[open] .home-universe-title").innerText();

await page.locator("#univers summary").nth(1).focus();
const focused = await page.locator("#univers details[open] .home-universe-title").innerText();
await page.keyboard.press("Enter");
await page.waitForTimeout(7000);
const whileFocused = await page.locator("#univers details[open] .home-universe-title").innerText();
await browser.close();

const videoBrowser = await chromium.launch();
const context = await videoBrowser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: captures, size: { width: 1440, height: 900 } },
});
const videoPage = await context.newPage();
await videoPage.goto(`${base}/`, { waitUntil: "networkidle" });
await place(videoPage);
await videoPage.mouse.move(20, 20);
await videoPage.waitForTimeout(1800);
await videoPage.locator("#univers").hover({ position: { x: 80, y: 280 } });
await videoPage.waitForTimeout(2800);
await videoPage.mouse.move(20, 20);
await videoPage.waitForTimeout(700);
await videoPage.locator("#univers summary", { hasText: "Acheter" }).click();
await videoPage.mouse.move(20, 20);
await videoPage.waitForTimeout(14500);
const video = videoPage.video();
await context.close();
await videoBrowser.close();
fs.renameSync(await video.path(), path.join(captures, "home-univers-autoplay-controls.webm"));

console.log(JSON.stringify({ atNine, progress, afterCycle, focused, whileFocused }, null, 2));
