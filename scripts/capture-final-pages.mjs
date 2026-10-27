import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3001";

const pages = [
  { slug: "home", path: "/" },
  { slug: "solutions", path: "/solutions" },
  { slug: "expertise", path: "/expertise" },
  { slug: "about", path: "/a-propos" },
  { slug: "contact", path: "/contact" },
  { slug: "404", path: "/page-inexistante-test" },
];

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-375", width: 375, height: 812 },
];

const narrowViewports = [{ name: "mobile-320", width: 320, height: 568 }];
const narrowSlugSet = new Set(["home", "solutions", "about", "expertise"]);

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

for (const route of pages) {
  const extra =
    narrowSlugSet.has(route.slug)
      ? narrowViewports
      : [];
  for (const viewport of [...viewports, ...extra]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${base}${route.path}`, { waitUntil: "networkidle" });
    const file = path.join(
      root,
      "docs",
      "captures",
      `final-${route.slug}-${viewport.name}.png`,
    );
    await page.screenshot({ path: file, fullPage: true });
    console.log("wrote", file);
  }
}

await browser.close();
