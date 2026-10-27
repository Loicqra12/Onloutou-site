import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");
fs.mkdirSync(captures, { recursive: true });

const browser = await chromium.launch();

async function place(page) {
  await page.evaluate(() => {
    const section = document.querySelector("#univers");
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 88;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - header - 12));
  });
}

async function openTitle(page) {
  return page.locator("#univers details[open] .home-universe-title").innerText();
}

const report = {};

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await place(page);
  await page.waitForTimeout(400);
  const samples = [];
  for (let i = 0; i < 24; i += 1) {
    samples.push({ t: i, title: await openTitle(page) });
    await page.waitForTimeout(1000);
  }
  const duration = await page.locator("#univers .home-universe[open] .home-universe-progress").evaluate((node) => {
    const style = getComputedStyle(node);
    return { animationName: style.animationName, animationDuration: style.animationDuration, animationTimingFunction: style.animationTimingFunction, height: style.height, backgroundColor: style.backgroundColor, transformOrigin: style.transformOrigin };
  });
  report.sequence = samples;
  report.progress = duration;
  report.hydrationErrors = errors;

  await page.mouse.move(20, 20);
  const beforeHover = await openTitle(page);
  await page.locator("#univers").hover({ position: { x: 40, y: 220 } });
  await page.waitForTimeout(7000);
  const duringHover = await openTitle(page);
  await page.mouse.move(20, 20);
  await page.waitForTimeout(2000);
  const afterLeave = await openTitle(page);
  report.hover = { beforeHover, duringHover, afterLeave, stayed: beforeHover === duringHover && duringHover === afterLeave };

  await page.locator("#univers summary").first().focus();
  const focused = await openTitle(page);
  await page.waitForTimeout(7000);
  const duringFocus = await openTitle(page);
  await page.evaluate(() => document.body.focus());
  report.focus = { focused, duringFocus, stayed: focused === duringFocus };

  await page.mouse.move(20, 20);
  await page.locator("#univers summary", { hasText: "Construire" }).click();
  await page.mouse.move(20, 20);
  const selected = await openTitle(page);
  await page.waitForTimeout(3000);
  const duringCooldown = await openTitle(page);
  await page.waitForTimeout(6500);
  const afterCooldown = await openTitle(page);
  report.manual = { selected, duringCooldown, afterCooldown };

  const pause = page.getByRole("button", { name: "Mettre en pause le défilement des univers" });
  await pause.click();
  await page.mouse.move(20, 20);
  const pausedTitle = await openTitle(page);
  await page.waitForTimeout(7000);
  const stillPaused = await openTitle(page);
  const play = page.getByRole("button", { name: "Reprendre le défilement des univers" });
  const playLabel = await play.getAttribute("aria-label");
  await play.click();
  await page.mouse.move(20, 20);
  await page.waitForTimeout(6000);
  const afterPlay = await openTitle(page);
  report.playback = { pausedTitle, stillPaused, playLabel, afterPlay, stayedPaused: pausedTitle === stillPaused, resumed: afterPlay !== stillPaused };

  const beforeHide = await openTitle(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(7000);
  await place(page);
  await page.waitForTimeout(300);
  const afterReturn = await openTitle(page);
  report.viewport = { beforeHide, afterReturn, kept: beforeHide === afterReturn };

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenTitle = await openTitle(page);
  await page.waitForTimeout(7000);
  const whileHidden = await openTitle(page);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(400);
  const afterShow = await openTitle(page);
  report.visibility = { hiddenTitle, whileHidden, afterShow, kept: hiddenTitle === whileHidden && whileHidden === afterShow };
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await place(page);
  const start = await openTitle(page);
  await page.waitForTimeout(8000);
  const later = await openTitle(page);
  report.mobile = {
    start,
    later,
    stayed: start === later,
    button: await page.locator(".home-universe-playback").count(),
    progressDisplayed: await page.locator(".home-universe-progress").first().evaluate((node) => getComputedStyle(node).display),
  };
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await place(page);
  await page.waitForTimeout(8000);
  report.reduced = {
    title: await openTitle(page),
    button: await page.locator(".home-universe-playback").count(),
    animation: await page.locator(".home-universe-image").first().evaluate((node) => getComputedStyle(node).animationName),
  };
  await page.locator("#univers summary", { hasText: "Acheter" }).click();
  report.reduced.afterClick = await openTitle(page);
  await page.close();
}

await browser.close();

async function record(name, run) {
  const videoBrowser = await chromium.launch();
  const context = await videoBrowser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: captures, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await place(page);
  await page.mouse.move(20, 20);
  await run(page);
  const video = page.video();
  await context.close();
  await videoBrowser.close();
  fs.renameSync(await video.path(), path.join(captures, name));
  console.log("wrote", name);
}

await record("home-univers-autoplay-desktop.webm", async (page) => {
  await page.waitForTimeout(23000);
});

await record("home-univers-autoplay-controls.webm", async (page) => {
  await page.waitForTimeout(1800);
  await page.locator("#univers").hover({ position: { x: 80, y: 280 } });
  await page.waitForTimeout(2800);
  await page.mouse.move(20, 20);
  await page.waitForTimeout(700);
  await page.locator("#univers summary", { hasText: "Acheter" }).click();
  await page.mouse.move(20, 20);
  await page.waitForTimeout(9000);
});

console.log(JSON.stringify(report, null, 2));
