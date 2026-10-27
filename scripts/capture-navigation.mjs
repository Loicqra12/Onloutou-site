/**
 * Captures de la navigation (méga-menus desktop, état défilé, tablette, mobile).
 * Usage : node scripts/capture-navigation.mjs [dossier-de-sortie]
 * Prérequis : serveur sur BASE_URL (défaut http://localhost:3000).
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = path.resolve(process.argv[2] ?? "navigation-captures");
fs.mkdirSync(out, { recursive: true });

const menus = ["solutions", "equipements", "expertise", "projets", "partenaires", "a-propos"];
const report = [];

async function trigger(page, id) {
  return page.locator(`button[aria-controls="mega-${id}"]`);
}

async function openMenu(page, id) {
  await (await trigger(page, id)).hover();
  await page.locator(`#mega-${id}`).waitFor({ state: "visible" });
  await page.waitForTimeout(450);
}

const browser = await chromium.launch();

// ── Desktop 1440 ────────────────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, "desktop-1440-closed-top.png") });

  for (const id of menus) {
    await openMenu(page, id);
    await page.screenshot({ path: path.join(out, `desktop-1440-${id}.png`) });
    const box = await page.locator(`#mega-${id} .mega-surface`).boundingBox();
    const header = await page.locator("header.site-header").boundingBox();
    report.push({ id, state: "top", x: Math.round(box.x), width: Math.round(box.width), height: Math.round(box.height), centerOffset: Math.round(box.x + box.width / 2 - 720), gapToHeader: Math.round(box.y - (header.y + header.height)) });
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  }

  await page.mouse.move(700, 600);
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, "desktop-1440-closed-scrolled.png") });
  for (const id of menus) {
    await openMenu(page, id);
    await page.screenshot({ path: path.join(out, `desktop-1440-${id}-scrolled.png`) });
    const box = await page.locator(`#mega-${id} .mega-surface`).boundingBox();
    const header = await page.locator("header.site-header").boundingBox();
    const bar = await page.locator(".site-header-bar").boundingBox();
    report.push({ id, state: "scrolled", panelTop: Math.round(box.y), headerBottom: Math.round(header.y + header.height), headerTop: Math.round(header.y), barTop: Math.round(bar.y) });
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  }
  await page.close();
}

// ── Tablette / mobile ───────────────────────────────────────────
for (const [name, w, h] of [["tablet-768", 768, 1024], ["tablet-1024", 1024, 768], ["mobile-390", 390, 844], ["mobile-375", 375, 812]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, `${name}-closed.png`) });
  await page.locator(".site-header-toggle").click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(out, `${name}-menu-open.png`) });
  await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
  await page.locator(".site-mobile-trigger", { hasText: "Équipements" }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, `${name}-accordions.png`) });
  for (const label of ["Expertise", "Projets", "Partenaires", "À propos"]) {
    await page.locator(".site-mobile-trigger", { hasText: label }).click();
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, `${name}-all-accordions.png`) });
  await page.locator(".site-nav-mobile").evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(out, `${name}-all-accordions-bottom.png`) });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  report.push({ viewport: name, horizontalOverflow: overflow });
  await page.close();
}

await browser.close();
fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
