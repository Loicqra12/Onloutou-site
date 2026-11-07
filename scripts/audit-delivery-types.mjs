#!/usr/bin/env node
// Preuve : une demande envoyée depuis /livraison et un intérêt livreur envoyé depuis /devenir-livreur
// sont enregistrés avec des types distincts, retrouvés dans /admin/demandes. Base d'audit uniquement.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const outDir = path.resolve(process.argv[2] ?? "docs/captures/audit-2026-11-06/round2");
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@onloutou.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass12345!";
const browser = await chromium.launch();
const ctx = await browser.newContext({ baseURL: BASE, viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const sent = [];
page.on("request", (r) => {
  if (r.method() === "POST" && r.url().includes("/api/v1/requests")) {
    const b = JSON.parse(r.postData() ?? "{}");
    sent.push({ source: b.source, type: b.type });
  }
});
const stamp = Date.now();

await page.goto("/livraison#demande-livraison");
await page.getByLabel("Point de collecte").fill("Cocody, Abidjan");
await page.getByLabel("Destination").fill("Plateau");
await page.getByRole("radio", { name: "Colis", exact: true }).check();
await page.getByLabel("Votre nom").fill(`Test livraison ${stamp}`);
await page.getByLabel("Téléphone ou e-mail").fill("07 12 34 56 78");
await page.getByRole("button", { name: /Enregistrer ma demande/ }).click();
const deliveryRef = (await page.getByRole("status").filter({ hasText: "Demande enregistrée" }).textContent())?.match(/ONL-[\w-]+/)?.[0];

await page.goto("/devenir-livreur#candidature-livreur");
await page.getByRole("radio", { name: "Indépendant" }).check();
await page.getByLabel("Nom ou organisation").fill(`Test livreur ${stamp}`);
await page.getByLabel("Téléphone ou e-mail").fill("awa@example.com");
await page.getByLabel("Zone d’intervention").fill("Abidjan, Cocody");
await page.locator(".ptn-dl-vehicle", { hasText: /^Utilitaire$/ }).click();
await page.getByRole("textbox", { name: "Expérience" }).fill("Cinq ans de livraison urbaine.");
await page.getByRole("button", { name: /Enregistrer mon intérêt/ }).click();
const driverRef = (await page.getByRole("status").filter({ hasText: "Demande enregistrée" }).textContent())?.match(/ONL-[\w-]+/)?.[0];

await page.goto("/admin/login");
await page.locator("#adm-email").fill(adminEmail);
await page.locator("#adm-password").fill(adminPassword);
await page.getByRole("button", { name: "Se connecter" }).click();
await page.waitForURL(/\/admin\/(?!login)/);
await page.goto("/admin/demandes");
const rows = {};
for (const [k, ref] of Object.entries({ livraison: deliveryRef, livreur: driverRef })) {
  const row = page.getByRole("row").filter({ hasText: ref });
  await row.waitFor({ timeout: 20000 });
  rows[k] = { reference: ref, ligne: (await row.textContent())?.replace(/\s+/g, " ").slice(0, 160) };
}
await page.screenshot({ path: path.join(outDir, "admin-types-livraison-livreur.png") });
await browser.close();
fs.writeFileSync(path.join(outDir, "delivery-types.json"), JSON.stringify({ date: new Date().toISOString(), envoye: sent, admin: rows }, null, 1));
console.log(JSON.stringify({ envoye: sent, admin: rows }, null, 1));
