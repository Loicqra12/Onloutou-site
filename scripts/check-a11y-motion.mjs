import { chromium } from "playwright";

const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const tabOrder = [];
await page.goto(`${base}/solutions`, { waitUntil: "networkidle" });
for (let i = 0; i < 8; i += 1) {
  await page.keyboard.press("Tab");
  const active = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName,
      role: el.getAttribute("role"),
      id: el.id,
      name: el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 40),
    };
  });
  tabOrder.push(active);
}

await page.keyboard.press("ArrowRight");
const tabAfterArrow = await page.evaluate(() => document.activeElement?.id);

const reduced = await browser.newContext({ reducedMotion: "reduce" });
const reducedPage = await reduced.newPage();
await reducedPage.goto(`${base}/`, { waitUntil: "networkidle" });
const reducedState = await reducedPage.evaluate(() => ({
  motionReduce: document.documentElement.classList.contains("motion-reduce"),
  hiddenReveals: [...document.querySelectorAll(".motion-reveal:not(.is-revealed)")].length,
  hiddenTitles: [...document.querySelectorAll(".title-reveal:not(.is-revealed)")].length,
  scrollProgressDisplay: getComputedStyle(document.querySelector(".scroll-progress") || document.body).display,
  markerVisible: getComputedStyle(
    document.querySelector(".highlight-marker__ink") || document.body,
  ).transform,
}));

const noJs = await browser.newContext({ javaScriptEnabled: false });
const noJsPage = await noJs.newPage();
await noJsPage.goto(`${base}/`, { waitUntil: "domcontentloaded" });
const noJsState = await noJsPage.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.trim(),
  navLinks: document.querySelectorAll("nav a").length,
  markerInk: document.querySelector(".highlight-marker__ink") !== null,
}));

const expertise = await browser.newPage();
await expertise.goto(`${base}/`, { waitUntil: "networkidle" });
const articles = await expertise.locator("#expertise article").count();

await browser.close();

console.log(
  JSON.stringify(
    {
      keyboard: { tabSamples: tabOrder, solutionsTabAfterArrowRight: tabAfterArrow },
      reducedMotion: reducedState,
      noJavaScript: noJsState,
      expertiseArticlesOnHome: articles,
    },
    null,
    2,
  ),
);
