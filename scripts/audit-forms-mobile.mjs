#!/usr/bin/env node
// Remplit chaque formulaire public à 320×568, observe la requête POST /requests et le texte affiché ensuite.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const out = path.resolve(process.argv[2] ?? "docs/captures/audit-2026-11-06/forms");
fs.mkdirSync(out, { recursive: true });
const RUN = Date.now().toString(36);
const targets = [
  ["/solutions/location", "demande-location", "rental"],
  ["/solutions/vente", "demande-equipement", "vente"],
  ["/produits", "demande-produit", "produits"],
  ["/projets", "brief-projet", "projets"],
  ["/livraison", "demande-livraison", "livraison"],
  ["/devenir-partenaire", "preparer-proposition", "partenaire"],
  ["/devenir-livreur", "candidature-livreur", "livreur"],
  ["/equipements/vehicules", "vhp-form", "vehicules"],
  ["/equipements/motos", null, "motos"],
  ["/equipements/camions-engins", null, "camions"],
  ["/equipements/outils-materiels", null, "outils"],
  ["/equipements/equipements-connectes", null, "connectes"],
  ["/equipements", null, "equipements-hub"],
  ["/solutions/geolocalisation", null, "geoloc"],
];
const browser = await chromium.launch();
const results = [];
for (const [route, anchor, slug] of targets) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => localStorage.setItem("onloutou-cookie-choice", JSON.stringify({ measure: false, marketing: false })));
  const page = await ctx.newPage();
  const posts = [];
  page.on("request", (r) => { if (r.method() === "POST" && r.url().includes("/api/v1/requests")) posts.push(JSON.parse(r.postData() || "{}")); });
  const resps = [];
  page.on("response", async (r) => { if (r.request().method() === "POST" && r.url().includes("/api/v1/requests")) resps.push({ status: r.status(), body: await r.json().catch(() => ({})) }); });
  await page.goto("http://localhost:3000" + route + (anchor ? "#" + anchor : ""), { waitUntil: "load" });
  await page.waitForTimeout(1200);
  // champs : chaque formulaire dont un bouton d'envoi existe
  const forms = page.locator("form");
  const nForms = await forms.count();
  const entry = { route, forms: nForms, formsDetail: [], posts: 0 };
  // pas de <form> pour certains builders : on remplit toute la page
  const scope = nForms ? forms.last() : page.locator("main");
  const fill = async (root) => {
    const radios = root.locator("input[type=radio]");
    const rn = await radios.count();
    const seen = new Set();
    for (let i = 0; i < rn; i++) { const r = radios.nth(i); const nm = await r.getAttribute("name"); if (nm && !seen.has(nm)) { seen.add(nm); await r.check({ force: true }).catch(() => {}); } }
    const texts = root.locator("input[type=text], input:not([type]), input[type=tel], input[type=email], textarea");
    const tn = await texts.count();
    for (let i = 0; i < tn; i++) {
      const t = texts.nth(i);
      if (!(await t.isVisible().catch(() => false))) continue;
      const type = (await t.getAttribute("type")) || "text";
      const ph = ((await t.getAttribute("placeholder")) || "") + " " + ((await t.getAttribute("name")) || "") + " " + ((await t.getAttribute("id")) || "");
      const tag = await t.evaluate((e) => e.tagName);
      let v = `Audit ${RUN} champ ${i}`;
      if (type === "tel" || /tel|phone|whatsapp/i.test(ph)) v = "07 12 34 56 78";
      else if (type === "email") v = `audit-${slug}@example.ci`;
      else if (tag === "TEXTAREA") v = `Audit ${RUN} ${slug}\nSecond ligne du message.`;
      else if (/nom|name/i.test(ph) && !/organ/i.test(ph)) v = `Audit ${RUN} Konan Yao`;
      await t.fill(v).catch(() => {});
    }
    const sel = root.locator("select");
    const sn = await sel.count();
    for (let i = 0; i < sn; i++) { const s = sel.nth(i); if (await s.isVisible().catch(() => false)) await s.selectOption({ index: 1 }).catch(() => {}); }
    const cb = root.locator("input[type=checkbox]");
    if (await cb.count()) await cb.first().check({ force: true }).catch(() => {});
  };
  await fill(scope);
  const submitters = scope.locator("button[type=submit], button:has-text('Enregistrer'), button:has-text('Préparer'), button:has-text('Envoyer')");
  const names = [];
  for (let i = 0; i < (await submitters.count()); i++) names.push((await submitters.nth(i).textContent())?.replace(/\s+/g, " ").trim());
  entry.submitButtons = names;
  let clicked = null;
  for (let i = 0; i < (await submitters.count()); i++) {
    const b = submitters.nth(i);
    if (await b.isVisible().catch(() => false)) { clicked = names[i]; await b.scrollIntoViewIfNeeded(); await b.click({ force: true }).catch(() => {}); break; }
  }
  entry.clicked = clicked;
  await page.waitForTimeout(2500);
  // second pass : certains parcours demandent une étape suivante (ex. "Enregistrer ma demande" apparaît après Préparer)
  if (!posts.length) {
    const second = page.locator("button:has-text('Enregistrer ma demande'), button:has-text('Enregistrer')");
    for (let i = 0; i < (await second.count()); i++) { const b = second.nth(i); if (await b.isVisible().catch(() => false)) { entry.secondClick = (await b.textContent())?.trim(); await fill(page.locator("main")); await b.click({ force: true }).catch(() => {}); await page.waitForTimeout(2500); break; }}
  }
  entry.posts = posts.length;
  entry.payload = posts[0] ? { source: posts[0].source, type: posts[0].type, need: posts[0].need, contactName: posts[0].contactName ?? posts[0].name, phone: posts[0].contactPhone ?? posts[0].phone, zone: posts[0].zone, payloadKeys: posts[0].payload ? Object.keys(posts[0].payload).slice(0, 8) : undefined } : null;
  entry.response = resps[0] ? { status: resps[0].status, ref: resps[0].body.reference } : null;
  const shown = await page.evaluate(() => { const m = document.body.innerText.match(/Référence\s*:?\s*(ONL-[A-Z0-9-]+)/); const t = [...document.querySelectorAll("[role=status],[role=alert],.rental-builder__error,.ctc-form__error")].map((e) => e.textContent.trim().slice(0, 160)); return { ref: m?.[1], messages: t.slice(0, 3) }; });
  entry.visible = shown;
  await page.screenshot({ path: path.join(out, `${slug}.png`), fullPage: false });
  results.push(entry);
  console.log(JSON.stringify(entry));
  await ctx.close();
}
fs.writeFileSync(path.join(out, "forms-mobile.json"), JSON.stringify({ run: RUN, date: new Date().toISOString(), results }, null, 1));
await browser.close();
