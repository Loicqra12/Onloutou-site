#!/usr/bin/env node
// Audit responsive : routes × largeurs. Chromium émulé uniquement.
// Usage : node scripts/audit-responsive-matrix.mjs [outDir] [--routes=/,/contact] [--widths=320,360]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const args = process.argv.slice(2);
const outDir = path.resolve(args.find((a) => !a.startsWith("--")) ?? "docs/captures/audit-2026-11-06");
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const WIDTHS = (opt("widths") ?? "320,360,375,390,430,768,1024,1440").split(",").map(Number);
const SHOT_WIDTHS = (opt("shots") ?? "320,360").split(",").map(Number);
const HEIGHT = { 320: 568, 360: 800, 375: 812, 390: 844, 430: 932, 768: 1024, 1024: 768, 1440: 900 };

function discover() {
  const out = [];
  const walk = (dir, seg) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, e.name.startsWith("(") ? seg : [...seg, e.name]);
      else if (e.name === "page.tsx") out.push(seg.length ? `/${seg.join("/")}` : "/");
    }
  };
  walk(path.join(process.cwd(), "src", "app"), []);
  return out.sort();
}
const routes = (opt("routes")?.split(",")) ?? [...discover(), "/__probe-404__"];
const slug = (r) => (r === "/" ? "home" : r.slice(1).replace(/\//g, "__"));

const EXEMPT = [".leg-table-wrap", ".home-terrain-strip", ".home-show-track", ".epp-preview__nav ul", ".epp-products__table-wrap", ".epp-matrix__wrap", ".edl-matrix__wrap", ".hlp-nav", ".hlp-nav__list", ".sales-compare__table-wrap"];

const measure = (exempt) => {
  const iw = window.innerWidth;
  const sw = document.documentElement.scrollWidth;
  const inEx = (el) => { for (; el; el = el.parentElement) for (const s of exempt) if (el.matches(s)) return true; return false; };
  const offenders = [];
  let tiny = 0, tinyEx = [];
  let small = 0, smallEx = [];
  const taps = [];
  for (const n of document.querySelectorAll("body *")) {
    if (!(n instanceof HTMLElement)) continue;
    const cs = getComputedStyle(n);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = n.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (!inEx(n) && (r.left < -1 || r.right > iw + 1)) {
      offenders.push({ tag: n.tagName.toLowerCase(), cls: String(n.className).slice(0, 80), l: Math.round(r.left), r: Math.round(r.right) });
    }
    const hasText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().length > 1);
    if (hasText && parseFloat(cs.fontSize) < 12) { tiny++; if (tinyEx.length < 3) tinyEx.push(`${n.tagName}.${String(n.className).slice(0, 40)} ${cs.fontSize} "${n.textContent.trim().slice(0, 30)}"`); }
    if (n.matches("a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button]")) {
      const h = Math.round(r.height), w = Math.round(r.width);
      if (Math.min(h, w) < 24 && !(n.tagName === "A" && cs.display === "inline")) { small++; if (smallEx.length < 4) smallEx.push(`${n.tagName}.${String(n.className).slice(0, 30)} ${w}x${h} "${(n.textContent || n.getAttribute("aria-label") || "").trim().slice(0, 25)}"`); }
    }
  }
  return { iw, sw, global: sw > iw + 1, offenders: offenders.slice(0, 8), nOff: offenders.length, tiny, tinyEx, small, smallEx };
};

const browser = await chromium.launch();
const results = [];
for (const w of WIDTHS) {
  const h = HEIGHT[w] ?? 800;
  const mobile = w <= 430;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, locale: "fr-FR" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 120)));
  for (const route of routes) {
    errs.length = 0;
    let status = 0;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: "load", timeout: 30000 });
      status = resp?.status() ?? 0;
      await page.waitForTimeout(500);
      // force le chargement des images lazy
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(300);
      const m = await page.evaluate(measure, EXEMPT);
      const finalUrl = new URL(page.url()).pathname;
      const row = { route, w, status, finalUrl: finalUrl !== route ? finalUrl : undefined, ...m, errors: [...errs].slice(0, 3) };
      results.push(row);
      if (SHOT_WIDTHS.includes(w) || m.global) {
        const d = path.join(outDir, String(w));
        fs.mkdirSync(d, { recursive: true });
        await page.screenshot({ path: path.join(d, `${slug(route)}${m.global ? "__OVERFLOW" : ""}.png`), fullPage: true });
      }
    } catch (e) {
      results.push({ route, w, status, error: String(e).slice(0, 150) });
    }
  }
  await ctx.close();
  process.stdout.write(`width ${w} done\n`);
}
await browser.close();
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "responsive-matrix.json"), JSON.stringify({ date: new Date().toISOString(), base: BASE, widths: WIDTHS, results }, null, 1));
const bad = results.filter((r) => r.global || r.error || r.status >= 500);
console.log(`total ${results.length}, overflow/erreur ${bad.length}`);
for (const r of bad.slice(0, 40)) console.log(r.route, r.w, r.error ?? `sw ${r.sw}>${r.iw}`, JSON.stringify(r.offenders?.slice(0, 2)));
