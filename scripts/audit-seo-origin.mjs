#!/usr/bin/env node
// Vérifie le build local construit avec NEXT_PUBLIC_SITE_URL=<origine de test> :
// canonical, sitemap.xml, ligne Sitemap: de robots.txt, og:image réellement chargée.
// Usage : ORIGIN=https://onloutou.com BASE_URL=http://localhost:3100 node scripts/audit-seo-origin.mjs <sortie.json>
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const ORIGIN = process.env.ORIGIN ?? "https://onloutou.com";
const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const out = process.argv[2] ?? "docs/captures/audit-2026-11-06/round2/seo-origin.json";

function discover() {
  const res = [];
  const walk = (dir, seg) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, e.name.startsWith("(") ? seg : [...seg, e.name]);
      else if (e.name === "page.tsx") res.push(seg.length ? `/${seg.join("/")}` : "/");
    }
  };
  walk(path.join(process.cwd(), "src", "app"), []);
  return res.sort();
}

const attr = (html, re) => html.match(re)?.[1] ?? null;
const report = { origin: ORIGIN, base: BASE, date: new Date().toISOString(), pages: [], problems: [] };
const problem = (m) => report.problems.push(m);

// sitemap.xml
const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
report.sitemap = { count: locs.length, unique: new Set(locs).size, allOnOrigin: locs.every((l) => l.startsWith(`${ORIGIN}/`)), localhost: locs.some((l) => /localhost|127\.0\.0\.1/.test(l)) };
if (!report.sitemap.allOnOrigin) problem("sitemap : URL hors origine");
if (report.sitemap.localhost) problem("sitemap : localhost");
if (locs.some((l) => /\/\/(?!.*:)/.test(l.replace("https://", "")) && l.replace("https://", "").includes("//"))) problem("sitemap : double slash");
// chaque URL du sitemap répond en local (même chemin)
report.sitemap.unreachable = [];
for (const l of locs) {
  const r = await fetch(BASE + new URL(l).pathname, { redirect: "manual" });
  if (r.status !== 200) report.sitemap.unreachable.push(`${l} -> ${r.status}`);
}
if (report.sitemap.unreachable.length) problem("sitemap : URL non joignable en local");

// robots.txt
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
report.robots = robots;
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) problem("robots.txt : ligne Sitemap absente ou différente");

const sitemapPaths = new Set(locs.map((l) => new URL(l).pathname));
const ogImages = new Set();
for (const route of discover()) {
  const res = await fetch(BASE + route, { redirect: "manual" });
  const html = await res.text();
  const robotsMeta = attr(html, /<meta name="robots" content="([^"]+)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  const og = attr(html, /<meta property="og:image" content="([^"]+)"/);
  const indexable = !/noindex/.test(robotsMeta ?? "");
  const expected = `${ORIGIN}${route === "/" ? "/" : route}`;
  const row = { route, status: res.status, indexable, inSitemap: sitemapPaths.has(route), robots: robotsMeta, canonical, ogImage: og };
  report.pages.push(row);
  if (indexable) {
    if (canonical?.replace(/\/$/, "") !== expected.replace(/\/$/, "")) problem(`canonical ≠ attendu sur ${route} : ${canonical}`);
    if (!og) (report.noOgImage ??= []).push(route);
    if (!row.inSitemap) problem(`page indexable absente du sitemap : ${route}`);
  } else {
    if (row.inSitemap) problem(`page noindex présente dans le sitemap : ${route}`);
  }
  if (canonical && /localhost/.test(canonical)) problem(`localhost dans canonical : ${route}`);
  if (og) ogImages.add(og);
}

// Image de partage : URL absolue sur l'origine ; chargée ici via le même chemin sur le serveur local.
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${BASE}/robots.txt`);
report.ogImages = [];
for (const url of ogImages) {
  const u = new URL(url);
  const local = BASE + u.pathname + u.search;
  const info = await page.evaluate(async (src) => {
    const head = await fetch(src);
    const type = head.headers.get("content-type");
    const bytes = (await head.arrayBuffer()).byteLength;
    const dims = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = src;
    });
    return { status: head.status, type, bytes, dims };
  }, local);
  const ok = u.origin === ORIGIN && info.status === 200 && /^image\//.test(info.type ?? "") && info.dims && info.dims.w > 0;
  report.ogImages.push({ url, local, ...info, ok });
  if (!ok) problem(`og:image non chargée : ${url}`);
}
await browser.close();

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 1));
const idx = report.pages.filter((p) => p.indexable).length;
console.log(JSON.stringify({ pages: report.pages.length, indexable: idx, sitemap: report.sitemap.count, ogDistinct: report.ogImages.length, ogOk: report.ogImages.filter((o) => o.ok).length, robotsOk: robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), problems: report.problems.slice(0, 15), nProblems: report.problems.length, noOgImage: report.noOgImage ?? [] }, null, 1));
