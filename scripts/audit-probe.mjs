import { chromium } from "@playwright/test";
const [url, outFile, scroll = "0", wait = "2500", w = "320", h = "568"] = process.argv.slice(2);
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: +w <= 430, hasTouch: +w <= 430, deviceScaleFactor: 2 });
await c.addInitScript(() => localStorage.setItem("onloutou-cookie-choice", JSON.stringify({ measure: false, marketing: false })));
const p = await c.newPage();
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(+wait);
if (+scroll) { await p.evaluate((y) => window.scrollTo(0, y), +scroll); await p.waitForTimeout(1200); }
const info = await p.evaluate(() => { const hd = document.querySelector("header.site-header"); const r = hd?.getBoundingClientRect(); const cs = hd && getComputedStyle(hd); return { y: scrollY, header: r && { top: Math.round(r.top), h: Math.round(r.height), pos: cs.position }, bar: (() => { const e = document.querySelector(".site-header-bar")?.getBoundingClientRect(); return e && { top: Math.round(e.top), h: Math.round(e.height) }; })(), ann: (() => { const e = document.querySelector(".announcement-bar, [class*=announcement]")?.getBoundingClientRect(); return e && { top: Math.round(e.top), h: Math.round(e.height) }; })() }; });
console.log(JSON.stringify(info));
await p.screenshot({ path: outFile });
await b.close();
