#!/usr/bin/env node
// Zone réellement cliquable des liens/boutons dont la boîte visible est inférieure à 24 px.
// Méthode : on balaie une grille de points (pas 2 px) autour de l'élément et on garde ceux où
// document.elementFromPoint renvoie l'élément ou un de ses descendants (pseudo-éléments inclus).
// Usage : node scripts/audit-hit-areas.mjs [outFile]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const out = path.resolve(process.argv[2] ?? "docs/captures/audit-2026-11-06/round2/hit-areas.json");
const ROUTES = ["/", "/contact", "/livraison", "/produits", "/aide", "/solutions/location", "/mentions-legales"];
const browser = await chromium.launch();
const results = [];

const probe = () => {
  const found = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("a[href],button,summary,[role=button]")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (Math.min(r.width, r.height) >= 24 && cs.display !== "inline") continue;
    const key = (el.textContent || "").trim().slice(0, 30) + "|" + el.className;
    if (seen.has(key)) continue;
    seen.add(key);
    el.scrollIntoView({ block: "center", behavior: "instant" });
    const rr = el.getBoundingClientRect();
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (let x = rr.left - 24; x <= rr.right + 24; x += 2) {
      for (let y = rr.top - 24; y <= rr.bottom + 24; y += 2) {
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
        const hit = document.elementFromPoint(x, y);
        if (hit && (hit === el || el.contains(hit))) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    const hitW = maxX >= minX ? Math.round(maxX - minX + 2) : 0;
    const hitH = maxY >= minY ? Math.round(maxY - minY + 2) : 0;
    found.push({
      text: ((el.textContent || el.getAttribute("aria-label") || "").trim()).slice(0, 34),
      cls: String(el.className).slice(0, 40),
      boxW: Math.round(rr.width), boxH: Math.round(rr.height), display: cs.display,
      hitW, hitH, ok24: Math.min(hitW, hitH) >= 24, ok44: Math.min(hitW, hitH) >= 44,
    });
  }
  return found;
};

for (const w of [320, 390]) {
  const ctx = await browser.newContext({ baseURL: BASE, viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(400);
    // bandeau cookies fermé via un choix, pour ne pas masquer les éléments mesurés
    const choose = page.getByRole("button", { name: /uniquement les nécessaires/i }).first();
    if (await choose.isVisible().catch(() => false)) await choose.click().catch(() => {});
    await page.waitForTimeout(200);
    for (const f of await page.evaluate(probe)) results.push({ w, route, ...f });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(out, JSON.stringify({ date: new Date().toISOString(), base: BASE, results }, null, 1));
const bad = results.filter((r) => !r.ok24);
console.log(`éléments mesurés ${results.length}, zone cliquable < 24 px : ${bad.length}, < 44 px : ${results.filter((r) => !r.ok44).length}`);
for (const b of bad.slice(0, 20)) console.log(JSON.stringify(b));
