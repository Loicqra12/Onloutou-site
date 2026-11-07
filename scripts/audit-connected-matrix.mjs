#!/usr/bin/env node
// Écrans connectés (admin, partenaire approuvé, livreur) × 8 largeurs, avec une session du bon rôle.
// Écrit uniquement dans la base d'audit (voir tests/e2e-db-guard.ts) ; Chromium émulé, pas de téléphone réel.
// Usage : node scripts/audit-connected-matrix.mjs [outDir]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = path.resolve(process.argv[2] ?? "docs/captures/audit-2026-11-06/round2/connected-matrix");
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@onloutou.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass12345!";
const PASSWORD = "ParcoursE2E-2026!";
const stamp = Date.now();
const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const HEIGHT = { 320: 568, 360: 800, 375: 812, 390: 844, 430: 932, 768: 1024, 1024: 768, 1440: 900 };

const browser = await chromium.launch();
const opts = { baseURL: BASE, locale: "fr-FR" };

// ---- Mise en place (interface) -------------------------------------------------------------
const ctxAdmin = await browser.newContext({ ...opts, viewport: { width: 1280, height: 800 } });
const ctxPartner = await browser.newContext({ ...opts, viewport: { width: 1280, height: 800 } });
const ctxDriver = await browser.newContext({ ...opts, viewport: { width: 1280, height: 800 } });
const org = `Org matrice ${stamp}`;
const org2 = `Org matrice en attente ${stamp}`;
const driverName = `Livreur matrice ${stamp}`;

const admin = await ctxAdmin.newPage();
await admin.goto("/admin/login");
await admin.locator("#adm-email").fill(adminEmail);
await admin.locator("#adm-password").fill(adminPassword);
await admin.getByRole("button", { name: "Se connecter" }).click();
await admin.waitForURL(/\/admin\/(?!login)/, { timeout: 30000 });

async function registerPartner(page, email, orgName) {
  await page.goto("/espace-partenaire/inscription");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="displayName"]').fill("Partenaire matrice");
  await page.locator('input[name="organizationName"]').fill(orgName);
  await page.locator('input[name="zone"]').fill("Abidjan");
  await page.getByRole("button", { name: /créer mon dossier/i }).click();
  await page.waitForURL(/catalogue\?candidature=recue/, { timeout: 30000 });
}
const partner = await ctxPartner.newPage();
await registerPartner(partner, `matrice.p.${stamp}@onloutou.local`, org);
const ctxP2 = await browser.newContext({ ...opts });
await registerPartner(await ctxP2.newPage(), `matrice.p2.${stamp}@onloutou.local`, org2);
await ctxP2.close();

const driver = await ctxDriver.newPage();
await driver.goto("/espace-livreur/inscription");
await driver.locator('input[name="email"]').fill(`matrice.d.${stamp}@onloutou.local`);
await driver.locator('input[name="password"]').fill(PASSWORD);
await driver.locator('input[name="fullName"]').fill(driverName);
await driver.locator('input[name="phone"]').fill("0707070707");
await driver.locator('input[name="zone"]').fill("Abidjan");
await driver.getByRole("button", { name: /créer mon dossier/i }).click();
await driver.waitForURL(/espace-livreur\/dossier/, { timeout: 30000 });

await admin.goto("/admin/candidatures");
const row = admin.getByRole("row").filter({ hasText: org });
await row.getByRole("button", { name: "Valider" }).click();
await row.getByText("APPROVED").waitFor({ timeout: 15000 });

await partner.goto("/espace-partenaire/catalogue");
await partner.getByText("Statut du dossier : Approuvé").waitFor({ timeout: 30000 });
await partner.getByLabel("Titre").fill(`Fiche matrice ${stamp}`);
await partner.getByLabel("Description").fill("Fiche de test, sans disponibilité ni tarif annoncés.");
await partner.getByRole("button", { name: "Enregistrer le brouillon" }).click();
const item = partner.locator("li", { hasText: `Fiche matrice ${stamp}` });
await item.getByRole("button", { name: "Soumettre pour validation" }).click();
await item.getByText("Transmis, en attente de validation").waitFor();

const states = {
  admin: await ctxAdmin.storageState(),
  partner: await ctxPartner.storageState(),
  driver: await ctxDriver.storageState(),
};
await Promise.all([ctxAdmin.close(), ctxPartner.close(), ctxDriver.close()]);

// ---- Mesures --------------------------------------------------------------------------------
const SCREENS = [
  { role: "admin", route: "/admin/demandes", slug: "admin-demandes" },
  { role: "admin", route: "/admin/candidatures", slug: "admin-candidatures" },
  { role: "admin", route: "/admin/produits", slug: "admin-produits" },
  { role: "partner", route: "/espace-partenaire/catalogue", slug: "partenaire-catalogue" },
  { role: "driver", route: "/espace-livreur/dossier", slug: "livreur-dossier" },
];

const measure = () => {
  const iw = window.innerWidth;
  const vis = (n) => { const r = n.getBoundingClientRect(); const cs = getComputedStyle(n); return r.width > 1 && r.height > 1 && cs.display !== "none" && cs.visibility !== "hidden"; };
  const actions = [...document.querySelectorAll("main button, main a.adm-btn, main .adm-btn")].filter(vis).map((b) => { const r = b.getBoundingClientRect(); return { text: (b.textContent || "").trim().slice(0, 28), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), left: Math.round(r.left) }; });
  const tooSmall = actions.filter((a) => Math.min(a.w, a.h) < 36);
  const clipped = actions.filter((a) => a.right > iw + 1 || a.left < -1);
  const fields = [...document.querySelectorAll("main input:not([type=hidden]),main select,main textarea")].filter(vis);
  const last = fields.at(-1);
  const lastRect = last ? last.getBoundingClientRect() : null;
  const submit = [...document.querySelectorAll('main form button[type="submit"]')].filter(vis).at(-1);
  const sRect = submit ? submit.getBoundingClientRect() : null;
  const rowsInTable = document.querySelectorAll(".adm-table tbody tr").length;
  return {
    iw, sw: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > iw + 1,
    actions: actions.length, tooSmall, clipped, rowsInTable,
    lastField: last ? { name: last.getAttribute("name") || last.id, w: Math.round(lastRect.width), h: Math.round(lastRect.height), inViewportWidth: lastRect.left >= 0 && lastRect.right <= iw } : null,
    submit: submit ? { text: submit.textContent.trim().slice(0, 30), w: Math.round(sRect.width), h: Math.round(sRect.height), inViewportWidth: sRect.left >= 0 && sRect.right <= iw } : null,
  };
};

const results = [];
for (const w of WIDTHS) {
  const mobile = w <= 430;
  const ctxs = {};
  for (const role of Object.keys(states)) {
    ctxs[role] = await browser.newContext({ ...opts, storageState: states[role], viewport: { width: w, height: HEIGHT[w] }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  }
  for (const s of SCREENS) {
    const page = await ctxs[s.role].newPage();
    const res = { w, route: s.route, role: s.role };
    try {
      const resp = await page.goto(s.route, { waitUntil: "load", timeout: 30000 });
      res.status = resp?.status();
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.locator("main").first().waitFor();
      await page.waitForTimeout(500);
      res.finalPath = new URL(page.url()).pathname;
      Object.assign(res, await page.evaluate(measure));
      if (w === 320 || w === 360) {
        const dir = path.join(outDir, String(w));
        fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${s.slug}.png`), fullPage: true });
      }
      // Message d'erreur et dernier champ (320/360) : on déclenche une erreur réelle quand le formulaire existe.
      if ((w === 320 || w === 360) && s.slug === "partenaire-catalogue") {
        await page.getByLabel("Description").evaluate((e) => e.scrollIntoView({ block: "center" }));
        await page.getByLabel("Titre").fill("   ");
        await page.getByRole("button", { name: "Enregistrer le brouillon" }).click();
        await page.waitForTimeout(400);
        res.errorShown = await page.evaluate(() => { const e = document.querySelector('main [role="alert"], main .adm-error, main :invalid'); return e ? (e.textContent || "champ invalide").trim().slice(0, 80) : null; });
        res.lastFieldVisibleAfterScroll = await page.evaluate(() => { const f = [...document.querySelectorAll("main textarea,main input,main select")].at(-1); f.scrollIntoView({ block: "center" }); const r = f.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
      }
      // Clavier : 12 tabulations, chaque focus doit avoir un contour visible et rester dans la fenêtre.
      if (w === 320 || w === 1024) {
        let seen = 0, noOutline = [], offscreen = 0;
        await page.evaluate(() => (document.activeElement)?.blur?.());
        for (let i = 0; i < 14; i++) {
          await page.keyboard.press("Tab");
          const f = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { tag: e.tagName, label: (e.textContent || e.getAttribute("aria-label") || e.getAttribute("name") || "").trim().slice(0, 24), outline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0, shadow: cs.boxShadow !== "none", inView: r.right > 0 && r.left < innerWidth }; });
          if (!f) continue;
          seen++;
          if (!f.outline && !f.shadow) noOutline.push(f.tag + " " + f.label);
          if (!f.inView) offscreen++;
        }
        res.keyboard = { focusStops: seen, withoutVisibleFocus: noOutline.slice(0, 5), offscreen };
      }
    } catch (e) {
      res.error = String(e).slice(0, 160);
    }
    results.push(res);
    await page.close();
  }
  // Zoom 200 % simulé : 320 px de large avec police racine doublée (équivalent d'un écran 640 px à 200 %).
  if (w === 320) {
    for (const s of SCREENS) {
      const page = await ctxs[s.role].newPage();
      const res = { w: "320@200%", route: s.route, role: s.role };
      try {
        await page.goto(s.route, { waitUntil: "load" });
        await page.locator("main").first().waitFor();
        await page.addStyleTag({ content: "html{font-size:200% !important}" });
        await page.waitForTimeout(500);
        Object.assign(res, await page.evaluate(measure));
        const dir = path.join(outDir, "zoom200");
        fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${s.slug}.png`), fullPage: false });
      } catch (e) {
        res.error = String(e).slice(0, 160);
      }
      results.push(res);
      await page.close();
    }
  }
  for (const c of Object.values(ctxs)) await c.close();
  process.stdout.write(`width ${w} done\n`);
}
await browser.close();
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "connected-matrix.json"), JSON.stringify({ date: new Date().toISOString(), base: BASE, results }, null, 1));
const bad = results.filter((r) => r.overflow || r.error || r.clipped?.length || r.tooSmall?.length);
console.log(`total ${results.length}, problèmes ${bad.length}`);
for (const b of bad) console.log(JSON.stringify({ w: b.w, route: b.route, overflow: b.overflow, error: b.error, tooSmall: b.tooSmall?.slice(0, 3), clipped: b.clipped?.slice(0, 3) }));
