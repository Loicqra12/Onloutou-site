#!/usr/bin/env node
// Erreurs de formulaires connectés à 320 et 360 px : message visible, dans la fenêtre, bouton d'envoi tactile.
// Usage : node scripts/audit-form-errors.mjs [outDir]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = path.resolve(process.argv[2] ?? "docs/captures/audit-2026-11-06/round2/form-errors");
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const out = [];
for (const w of [320, 360]) {
  const ctx = await browser.newContext({ baseURL: BASE, viewport: { width: w, height: w === 320 ? 568 : 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cases = [
    { name: "partenaire-connexion-mauvais-mdp", url: "/espace-partenaire/connexion", fill: { email: "inconnu@onloutou.local", password: "mauvais-mot-de-passe" }, button: "Se connecter" },
    { name: "livreur-connexion-mauvais-mdp", url: "/espace-livreur/connexion", fill: { email: "inconnu@onloutou.local", password: "mauvais-mot-de-passe" }, button: "Se connecter" },
    { name: "admin-connexion-mauvais-mdp", url: "/admin/login", ids: { "#adm-email": "inconnu@onloutou.local", "#adm-password": "mauvais-mot-de-passe" }, button: "Se connecter" },
    { name: "partenaire-inscription-email-deja-pris", url: "/espace-partenaire/inscription", fill: { email: "e2e-admin@onloutou.local", password: "ParcoursE2E-2026!", displayName: "Test", organizationName: "Org erreur", zone: "Abidjan" }, button: /créer mon dossier/i },
  ];
  for (const c of cases) {
    await page.goto(c.url, { waitUntil: "load" });
    for (const [k, v] of Object.entries(c.fill ?? {})) await page.locator(`input[name="${k}"]`).fill(v);
    for (const [k, v] of Object.entries(c.ids ?? {})) await page.locator(k).fill(v);
    const btn = page.getByRole("button", { name: c.button }).last();
    await btn.click();
    const alert = page.locator('main [role="alert"], main .adm-error').first();
    await alert.waitFor({ timeout: 8000 }).catch(() => {});
    const r = await page.evaluate(() => {
      const a = document.querySelector('main [role="alert"], main .adm-error');
      const b = [...document.querySelectorAll('main form button[type="submit"]')].at(-1);
      const fields = [...document.querySelectorAll("main form input:not([type=hidden]),main form select,main form textarea")];
      const last = fields.at(-1);
      const rect = (e) => { if (!e) return null; e.scrollIntoView({ block: "center", behavior: "instant" }); const r = e.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height), inView: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth }; };
      return { alertText: a ? a.textContent.trim().slice(0, 90) : null, alert: rect(a), submit: rect(b), lastField: rect(last), lastFieldName: last?.getAttribute("name") ?? last?.id, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    await page.screenshot({ path: path.join(outDir, `${w}-${c.name}.png`) });
    out.push({ w, case: c.name, ...r });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(outDir, "form-errors.json"), JSON.stringify({ date: new Date().toISOString(), base: BASE, results: out }, null, 1));
for (const r of out) console.log(JSON.stringify({ w: r.w, case: r.case, alert: r.alertText, alertInView: r.alert?.inView, submitH: r.submit?.h, submitInView: r.submit?.inView, lastField: r.lastFieldName, lastInView: r.lastField?.inView, overflow: r.overflow }));
