import { chromium } from "playwright";

const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

const routes = [
  "/",
  "/solutions",
  "/solutions/location",
  "/equipements",
  "/projets",
  "/partenaires",
  "/expertise",
  "/a-propos",
  "/contact",
  "/page-inexistante-test",
];

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
const issues = [];

for (const route of routes) {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflowX = doc.scrollWidth - doc.clientWidth;
      const h1Count = document.querySelectorAll("h1").length;
      return { overflowX, h1Count, title: document.title };
    });
    if (result.overflowX > 1) {
      issues.push({ route, viewport: viewport.name, overflowX: result.overflowX });
    }
    if (result.h1Count !== 1) {
      issues.push({ route, viewport: viewport.name, h1Count: result.h1Count });
    }
  }
}

await browser.close();

if (issues.length) {
  console.error(JSON.stringify({ ok: false, issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, routes: routes.length, viewports: viewports.length }, null, 2));
