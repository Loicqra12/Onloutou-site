#!/usr/bin/env node
// Scénarios petit mobile 320×568 (Chromium émulé, tactile). Usage : node scripts/audit-mobile-scenarios.mjs <outDir> [menu|first|contact|all]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const out = path.resolve(process.argv[2] ?? "docs/captures/audit-2026-11-06/scenarios");
const only = process.argv[3] ?? "all";
fs.mkdirSync(out, { recursive: true });
const shot = (page, name, opts = {}) => page.screenshot({ path: path.join(out, `${name}.png`), ...opts });
const log = (...a) => console.log(...a);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, locale: "fr-FR" });
const page = await ctx.newPage();

const want = (n) => only === "all" || only === n;

if (want("first")) {
  for (const r of ["/", "/contact", "/solutions/location", "/solutions/geolocalisation", "/devenir-partenaire", "/livraison", "/solutions/vente", "/projets"]) {
    await page.goto(BASE + r, { waitUntil: "load" });
    await page.waitForTimeout(700);
    const s = r === "/" ? "home" : r.slice(1).replace(/\//g, "__");
    await shot(page, `first-${s}-1`);
    await page.evaluate(() => window.scrollTo(0, 568));
    await page.waitForTimeout(400);
    await shot(page, `first-${s}-2`);
    const info = await page.evaluate(() => {
      const fx = [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed" && e.getBoundingClientRect().height > 0).map((e) => ({ c: String(e.className).slice(0, 40), t: Math.round(e.getBoundingClientRect().top), h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width) }));
      const h1 = document.querySelector("h1")?.getBoundingClientRect();
      return { fixed: fx, h1: h1 ? { top: Math.round(h1.top + scrollY), bottom: Math.round(h1.bottom + scrollY) } : null, h1text: document.querySelector("h1")?.textContent?.trim().slice(0, 90) };
    });
    log(r, JSON.stringify(info));
  }
}

if (want("menu")) {
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(600);
  const toggle = page.locator(".site-header-toggle");
  await toggle.click();
  await page.waitForTimeout(500);
  await shot(page, "menu-1-open");
  const nav = page.locator("#" + (await toggle.getAttribute("aria-controls")));
  const accordions = nav.locator("button[aria-expanded]");
  const n = await accordions.count();
  log("accordéons:", n, await accordions.allTextContents());
  const results = [];
  for (let i = 0; i < n; i++) {
    const b = accordions.nth(i);
    await b.click();
    await page.waitForTimeout(300);
    const panel = page.locator("#" + (await b.getAttribute("aria-controls")));
    const links = panel.locator("a:visible");
    const count = await links.count();
    const last = links.nth(count - 1);
    await last.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await last.boundingBox();
    const covered = await last.evaluate((el) => { const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, Math.min(r.top + r.height / 2, innerHeight - 1)); return !(t === el || el.contains(t)); });
    const label = (await b.textContent())?.trim().slice(0, 30);
    results.push({ label, links: count, last: (await last.textContent())?.trim().slice(0, 40), href: await last.getAttribute("href"), bottom: Math.round((box?.y ?? 0) + (box?.height ?? 0)), coveredByOther: covered, viewportH: 568 });
    if (i === 0 || i === n - 1) await shot(page, `menu-2-accordion-${i}-last-link`);
    await b.click();
    await page.waitForTimeout(150);
  }
  log(JSON.stringify(results, null, 1));
  // fermer
  await toggle.click();
  await page.waitForTimeout(400);
  const expanded = await toggle.getAttribute("aria-expanded");
  const scrollLocked = await page.evaluate(() => getComputedStyle(document.body).overflow);
  log("fermé? aria-expanded =", expanded, "body overflow =", scrollLocked);
  await shot(page, "menu-3-closed");
  // Échap
  await toggle.click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  log("Échap ferme ?", (await toggle.getAttribute("aria-expanded")) === "false");
}

if (want("contact")) {
  const marker = "AUDIT-" + Date.now().toString(36);
  await page.goto(BASE + "/contact", { waitUntil: "load" });
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /Uniquement les nécessaires/ }).click();
  const form = page.locator("form.ctc-form");
  await form.scrollIntoViewIfNeeded();
  await shot(page, "contact-1-form-empty");
  // soumission vide → erreur visible ?
  await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
  await page.waitForTimeout(400);
  const err = page.locator(".ctc-form__error").first();
  const errVisible = await err.isVisible().catch(() => false);
  const inView = errVisible ? await err.evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }) : false;
  log("erreur affichée:", errVisible, "dans l’écran sans défiler:", inView, "texte:", errVisible ? (await err.textContent()).slice(0, 80) : "");
  await shot(page, "contact-2-error");
  // remplissage
  await page.getByRole("radio", { name: /GPS/ }).check({ force: true });
  await page.getByLabel(/Votre nom/).fill(`${marker} Kouassi Konan Aya Marie-Josée de la Société Ivoirienne de Transports`);
  const phone = page.getByLabel(/Téléphone/);
  if (await phone.count()) await phone.fill("07 12 34 56 78");
  await page.getByLabel(/Votre message/).fill("Bonjour,\nNous avons 12 pick-up à Abidjan et Bouaké.\nMerci de nous rappeler après 17 h.");
  await shot(page, "contact-3-filled");
  // clavier virtuel simulé : hauteur réduite
  await page.setViewportSize({ width: 320, height: 300 });
  await page.getByLabel(/Votre message/).focus();
  await page.waitForTimeout(300);
  const btn = page.getByRole("button", { name: /Enregistrer ma demande/ });
  await btn.scrollIntoViewIfNeeded();
  const reach = await btn.evaluate((el) => { const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, hit: t === el || el.contains(t) }; });
  log("hauteur 300 px — bouton:", JSON.stringify(reach));
  await shot(page, "contact-4-short-viewport");
  await page.setViewportSize({ width: 320, height: 568 });
  const [resp] = await Promise.all([page.waitForResponse((r) => r.url().includes("/api/v1/requests") && r.request().method() === "POST"), btn.click()]);
  log("POST /requests →", resp.status(), JSON.stringify(await resp.json().catch(() => ({}))));
  await page.waitForTimeout(500);
  const ok = page.locator(".ctc-form__success");
  const okVisible = await ok.isVisible().catch(() => false);
  const okInView = okVisible ? await ok.evaluate((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }) : false;
  log("succès:", okVisible, "visible sans défiler:", okInView, okVisible ? await ok.textContent() : "");
  await shot(page, "contact-5-success");
  fs.writeFileSync(path.join(out, "contact-marker.txt"), marker);
}

await browser.close();
