#!/usr/bin/env node
// Audit SEO du HTML rendu (build de production local) : titres, descriptions, canonical, robots, OG, JSON-LD, liens.
import fs from "node:fs";
import path from "node:path";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "docs/captures/audit-2026-11-06/seo-html.json";

function discover() {
  const r = [];
  const walk = (d, seg) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f, [...seg, e.name]); else if (e.name === "page.tsx") r.push(seg.length ? "/" + seg.join("/") : "/"); } };
  walk("src/app", []);
  return r.sort();
}
const dec = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "’").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, re) => { const m = html.match(re); return m ? dec(m[1]) : null; };
const rows = [];
const linkSet = new Set();
for (const route of [...discover(), "/__probe-404__", "/solutions/location/"]) {
  const res = await fetch(BASE + route, { redirect: "manual" });
  const html = await res.text();
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => dec(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));
  const title = meta(html, /<title>([\s\S]*?)<\/title>/);
  const desc = meta(html, /<meta name="description" content="([^"]*)"/);
  const canonical = meta(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = meta(html, /<meta name="robots" content="([^"]*)"/);
  const ogImage = meta(html, /<meta property="og:image" content="([^"]*)"/);
  const ogTitle = meta(html, /<meta property="og:title" content="([^"]*)"/);
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { const j = JSON.parse(dec(m[1])); return (Array.isArray(j) ? j : [j]).map((x) => x["@type"]).join("+"); } catch { return "invalid"; } });
  const hrefs = [...html.matchAll(/<a [^>]*href="([^"#]*)(?:#[^"]*)?"/g)].map((m) => m[1]).filter((h) => h.startsWith("/") && !h.startsWith("//"));
  for (const h of hrefs) linkSet.add(h);
  const lt = (html.match(/localhost|127\.0\.0\.1/g) ?? []).length;
  rows.push({ route, status: res.status, location: res.headers.get("location"), title, titleLen: title?.length, desc, descLen: desc?.length, h1: h1s, h2: (html.match(/<h2[ >]/g) ?? []).length, canonical, robots, ogTitle, ogImage, jsonld: ld, imgNoAlt: (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length, localhostRefs: lt, bytes: html.length });
}
// liens internes cassés
const broken = [];
for (const h of linkSet) {
  if (h.startsWith("/_next") || h.startsWith("/assets") || h.match(/\.(png|jpg|webp|svg|ico|pdf|xml|txt)$/)) continue;
  const r = await fetch(BASE + h, { redirect: "manual" });
  if (r.status >= 400) broken.push({ href: h, status: r.status });
}
const get = async (p) => { const r = await fetch(BASE + p, { redirect: "manual" }); return { status: r.status, text: (await r.text()).slice(0, 4000) }; };
const robotsTxt = await get("/robots.txt");
const sitemap = await fetch(BASE + "/sitemap.xml").then((r) => r.text());
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
fs.writeFileSync(out, JSON.stringify({ date: new Date().toISOString(), base: BASE, rows, broken, robotsTxt, sitemapUrls }, null, 1));
console.log("pages", rows.length, "liens internes testés", linkSet.size, "cassés", JSON.stringify(broken));
console.log("robots.txt:", robotsTxt.status, robotsTxt.text.replace(/\n/g, " | "));
console.log("sitemap:", sitemapUrls.length, "urls ; 1ère:", sitemapUrls[0]);
