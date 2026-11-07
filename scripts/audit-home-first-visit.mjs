#!/usr/bin/env node
// Capture de l'accueil à 320 × 568 dans un contexte neuf, AVANT toute interaction avec le bandeau cookies.
// Usage : node scripts/audit-home-first-visit.mjs <fichier.png>
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.argv[2] ?? "home-320.png";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await c.newPage();
await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
await p.waitForTimeout(2500); // fin des animations d'entrée
await p.screenshot({ path: out });
const r = await p.evaluate(() => {
  const box = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const x = e.getBoundingClientRect();
    return { top: Math.round(x.top), bottom: Math.round(x.bottom) };
  };
  const primary = [...document.querySelectorAll(".hom-hero__actions a")].map((a) => {
    const x = a.getBoundingClientRect();
    return { text: a.textContent.trim(), href: a.getAttribute("href"), top: Math.round(x.top), bottom: Math.round(x.bottom), w: Math.round(x.width), h: Math.round(x.height) };
  });
  return { viewport: innerHeight, banner: box(".cookie-notice"), actions: primary, scrollX: document.documentElement.scrollWidth > innerWidth };
});
console.log(JSON.stringify(r));
await b.close();
