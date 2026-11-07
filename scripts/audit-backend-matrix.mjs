#!/usr/bin/env node
// Audit backend action par action, via le proxy Next (/api/v1) -> Express -> PostgreSQL (base de test).
// Écrit des données : n'utiliser que contre une base de test autorisée (ex. onloutou_audit).
import fs from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const API = `${BASE}/api/v1`;
const RUN = Date.now().toString(36);
const ADMIN = { email: "e2e-admin@onloutou.local", password: "E2eAdminPass12345!" };

class Client {
  jar = new Map();
  csrf = null;
  async req(method, path, body) {
    const headers = { Cookie: [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ") };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (method !== "GET") {
      if (!this.csrf) {
        const c = await this.raw("GET", "/csrf", undefined, headers);
        this.csrf = c.body.csrfToken;
        headers.Cookie = [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ");
      }
      headers["x-csrf-token"] = this.csrf;
    }
    return this.raw(method, path, body, headers);
  }
  async raw(method, path, body, headers) {
    const res = await fetch(API + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, redirect: "manual" });
    for (const sc of res.headers.getSetCookie?.() ?? []) {
      const [kv] = sc.split(";");
      const i = kv.indexOf("=");
      this.jar.set(kv.slice(0, i), kv.slice(i + 1));
    }
    let json = {};
    try { json = await res.json(); } catch { /* 204 */ }
    return { status: res.status, body: json };
  }
}

const rows = [];
const rec = (action, endpoint, observed, server, visible, verdict) => {
  rows.push({ action, endpoint, observed, server, visible, verdict });
  console.log(`${verdict === "OK" ? "✔" : "✘"} ${action} | ${observed} | ${server} | ${visible}`);
};

const admin = new Client();
const login = await admin.req("POST", "/auth/login", ADMIN);
if (login.status !== 200) { console.error("login admin KO", login); process.exit(1); }

async function adminFind(ref) {
  const r = await admin.req("GET", `/admin/requests?q=${encodeURIComponent(ref)}&take=5`);
  const item = r.body.items?.find((i) => i.reference === ref);
  if (!item) return { item: null, detail: null };
  const d = await admin.req("GET", `/admin/requests/${item.id}`);
  return { item, detail: d.body.request ?? d.body };
}

// 1) Demandes publiques : un identifiant distinct par parcours
const publicCases = [
  ["Contact — location/achat (CONTACT)", { source: "contact", need: "location", name: `Audit ${RUN} Kouassi Yao Jean-Baptiste Nom Très Long`, phone: "+225 07 12 34 56 78", organisation: "PME Audit", zone: "Abidjan", deadline: "Semaine prochaine", message: "Ligne 1\nLigne 2 avec accents éèà\nLigne 3" }, "CONTACT"],
  ["Contact — GPS (/contact?need=gps)", { source: "contact", need: "gps", name: `Audit ${RUN} GPS`, phone: "0701020304", message: "Équiper 12 véhicules en GPS." }, "GPS"],
  ["Contact — actifs", { source: "contact", need: "actifs", name: `Audit ${RUN} Actifs`, phone: "0701020305", message: "Sécuriser des engins de chantier." }, "ASSET_SECURITY"],
  ["Contact — numérique", { source: "contact", need: "numerique", name: `Audit ${RUN} Num`, phone: "0701020306", message: "Plateforme de suivi sur mesure." }, "CUSTOM_PLATFORM"],
  ["Contact — partenariat", { source: "contact", need: "partenariat", name: `Audit ${RUN} Part`, phone: "0701020307", message: "Je propose mes équipements." }, "PARTNER_SUPPLIER"],
  ["Contact — autre", { source: "contact", need: "autre", name: `Audit ${RUN} Autre`, phone: "0701020308", message: "Question générale audit." }, "OTHER"],
  ...[
    ["Hub véhicules (location)", "vehicules-hub", "RENTAL"],
    ["Hub véhicules (achat)", "vehicules-hub", "PURCHASE"],
    ["Hub motos", "motos-hub", "RENTAL"],
    ["Hub camions & engins", "camions-hub", "RENTAL"],
    ["Hub outils & matériel", "outils-hub", "EQUIPMENT_CATALOG"],
    ["Hub équipements connectés", "connectes-hub", "PRODUCT"],
    ["Brief location /solutions/location", "rental-brief", "RENTAL"],
    ["Brief vente /solutions/vente", "equipment-brief", "PURCHASE"],
    ["Produits /produits", "products-brief", "PURCHASE"],
    ["Brief projet /projets", "projects-brief", "CUSTOM_PLATFORM"],
    ["Livraison partenaire /livraison", "partner-delivery", "PARTNER_DELIVERY"],
    ["Proposition partenaire /devenir-partenaire", "partner-proposal", "PARTNER_SUPPLIER"],
    ["Intérêt livreur /devenir-livreur", "driver-interest", "OTHER"],
  ].map(([label, source, type]) => [label, { source, type, contactName: `Audit ${RUN} ${source}-${type}`, contactPhone: "0505050505", contactEmail: `audit-${source}@example.ci`, zone: "Bouaké", message: `Message audit ${label}`, payload: { auditRun: RUN, label } }, type]),
];

for (const [label, body, expectedType] of publicCases) {
  const c = new Client();
  body.clientRequestId = crypto.randomUUID();
  const r = await c.req("POST", "/requests", body);
  const ref = r.body.reference;
  const { item, detail } = ref ? await adminFind(ref) : {};
  const name = body.name ?? body.contactName;
  const typeOk = item?.type === expectedType;
  const nameOk = (detail?.contactName ?? item?.contactName) === name;
  const phoneWanted = body.phone ?? body.contactPhone;
  const phoneOk = (detail?.contactPhone) === phoneWanted;
  const ok = r.status === 201 && !!item && typeOk && nameOk && phoneOk;
  rec(label, "POST /requests", `HTTP ${r.status} réf ${ref ?? "—"}`, item ? `type ${item.type}${typeOk ? "" : " (≠" + expectedType + ")"}, nom ${nameOk ? "ok" : "KO"}, tél ${phoneOk ? "ok" : "KO (" + detail?.contactPhone + ")"}` : "introuvable", item ? "admin: retrouvé" : "admin: absent", ok ? "OK" : "KO");
}

// 2) Idempotence
{
  const c = new Client();
  const id = crypto.randomUUID();
  const body = { source: "contact", need: "gps", name: `Audit ${RUN} Idem`, phone: "0701020399", message: "Test idempotence perte de réponse.", clientRequestId: id };
  const a = await c.req("POST", "/requests", body);
  const b = await c.req("POST", "/requests", body);
  const [p1, p2] = await Promise.all([c.req("POST", "/requests", body), c.req("POST", "/requests", body)]);
  const diff = await c.req("POST", "/requests", { ...body, message: "Contenu modifié après coup." });
  const list = await admin.req("GET", `/admin/requests?q=${encodeURIComponent(`Audit ${RUN} Idem`)}&take=20`);
  const n = list.body.items?.length ?? -1;
  const same = a.body.reference && a.body.reference === b.body.reference && b.body.reference === p1.body.reference && p1.body.reference === p2.body.reference;
  rec("Idempotence clientRequestId (retry + concurrence)", "POST /requests ×4", `${a.status}/${b.status}/${p1.status}/${p2.status} réf ${a.body.reference}`, `${n} dossier(s) en base ; contenu modifié → HTTP ${diff.status}`, same ? "même référence" : "références différentes", same && n === 1 && diff.status === 409 ? "OK" : "KO");
}

// 3) Validation serveur
{
  const c = new Client();
  const bad = await c.req("POST", "/requests", { source: "contact", need: "gps", name: "A", message: "x" });
  const noCsrf = await fetch(`${API}/requests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: "contact", need: "gps", name: "Audit", message: "sans csrf" }) });
  rec("Validation + CSRF", "POST /requests invalide", `invalide→${bad.status}, sans CSRF→${noCsrf.status}`, "rien créé", "message d’erreur", bad.status === 400 && noCsrf.status === 403 ? "OK" : "KO");
}

// 4) Comptes partenaire / livreur
const pass = "AuditPass12345!";
const partnerA = new Client(), partnerB = new Client(), driver = new Client();
const pa = await partnerA.req("POST", "/auth/register/partner", { email: `partner-a-${RUN}@example.ci`, password: pass, displayName: "Partenaire A", organizationName: `Org A ${RUN}`, partnerType: "SUPPLIER", zone: "Abidjan", phone: "0707070701" });
const pb = await partnerB.req("POST", "/auth/register/partner", { email: `partner-b-${RUN}@example.ci`, password: pass, displayName: "Partenaire B", organizationName: `Org B ${RUN}`, partnerType: "SUPPLIER" });
const dr = await driver.req("POST", "/auth/register/driver", { email: `driver-${RUN}@example.ci`, password: pass, fullName: `Livreur ${RUN}`, zone: "Yamoussoukro", vehicleInfo: "Moto 125", phone: "0707070702" });
rec("Inscription partenaire", "POST /auth/register/partner", `HTTP ${pa.status}`, `user ${pa.body.user?.role}`, "session ouverte", pa.status === 201 ? "OK" : "KO");
rec("Inscription livreur", "POST /auth/register/driver", `HTTP ${dr.status}`, `user ${dr.body.user?.role}`, "session ouverte", dr.status === 201 ? "OK" : "KO");

// reconnexion
{
  const again = new Client();
  const l = await again.req("POST", "/auth/login", { email: `partner-a-${RUN}@example.ci`, password: pass });
  const me = await again.req("GET", "/partner/me");
  const dl = new Client();
  await dl.req("POST", "/auth/login", { email: `driver-${RUN}@example.ci`, password: pass });
  const dme = await dl.req("GET", "/driver/me");
  const badpw = await new Client().req("POST", "/auth/login", { email: `driver-${RUN}@example.ci`, password: "MauvaisMotDePasse1" });
  rec("Reconnexion partenaire → bon dossier", "POST /auth/login + GET /partner/me", `login ${l.status}, me ${me.status}`, `org ${me.body.profile?.organizationName}, statut ${me.body.profile?.status}`, "dossier partenaire", me.body.profile?.organizationName === `Org A ${RUN}` ? "OK" : "KO");
  rec("Reconnexion livreur → bon dossier", "POST /auth/login + GET /driver/me", `me ${dme.status}`, `nom ${dme.body.profile?.fullName}, statut ${dme.body.profile?.status}`, "dossier livreur", dme.body.profile?.fullName === `Livreur ${RUN}` ? "OK" : "KO");
  rec("Mauvais mot de passe refusé", "POST /auth/login", `HTTP ${badpw.status}`, "pas de session", "message d’erreur", badpw.status === 401 ? "OK" : "KO");
}

// 5) Droits d'accès
{
  const anon = new Client();
  const checks = [
    ["anonyme → /partner/products", await anon.req("GET", "/partner/products"), [401, 403]],
    ["anonyme → /admin/requests", await anon.req("GET", "/admin/requests"), [401, 403]],
    ["anonyme → /driver/me", await anon.req("GET", "/driver/me"), [401, 403]],
    ["partenaire → /admin/requests", await partnerA.req("GET", "/admin/requests"), [403]],
    ["partenaire → /admin/applications/partners", await partnerA.req("GET", "/admin/applications/partners"), [403]],
    ["livreur → /partner/products", await driver.req("GET", "/partner/products"), [403]],
    ["partenaire → /driver/me", await partnerA.req("GET", "/driver/me"), [403]],
  ];
  for (const [l, r, okSet] of checks) rec(`Droits : ${l}`, "GET", `HTTP ${r.status}`, "refusé", "—", okSet.includes(r.status) ? "OK" : "KO");
}

// 6) Catalogue partenaire (non approuvé puis approuvé) + isolation
{
  const create1 = await partnerA.req("POST", "/partner/products", { category: "VEHICLES", title: `Pick-up Audit ${RUN}`, description: "Test", pricingMode: "ON_QUOTE" });
  const apps = await admin.req("GET", "/admin/applications/partners");
  const mine = apps.body.items?.find((i) => i.organizationName === `Org A ${RUN}`);
  const submit = await partnerA.req("POST", "/partner/profile/submit", { organizationName: `Org A ${RUN}`, zone: "Abidjan", description: "Dossier audit" });
  const apps2 = await admin.req("GET", "/admin/applications/partners");
  const mine2 = apps2.body.items?.find((i) => i.organizationName === `Org A ${RUN}`);
  rec("Catalogue : création produit avant approbation", "POST /partner/products", `HTTP ${create1.status}`, `profil ${mine?.status ?? "non listé (brouillon)"}`, "—", create1.status === 400 || create1.status === 403 ? "OK" : "KO");
  rec("Dossier partenaire soumis → admin le voit", "POST /partner/profile/submit", `HTTP ${submit.status}`, `statut ${mine2?.status}`, "admin: liste candidatures", mine2 ? "OK" : "KO");
  if (mine2) {
    const dec = await admin.req("PATCH", `/admin/applications/partners/${mine2.id}`, { decision: "APPROVED" });
    const create2 = await partnerA.req("POST", "/partner/products", { category: "VEHICLES", title: `Pick-up Audit ${RUN}`, description: "Test", pricingMode: "ON_QUOTE" });
    const prodId = create2.body.product?.id;
    const bList = await partnerB.req("GET", "/partner/products");
    const bPatch = prodId ? await partnerB.req("PATCH", `/partner/products/${prodId}`, { title: "Piraté par B" }) : { status: 0 };
    const bSubmit = prodId ? await partnerB.req("POST", `/partner/products/${prodId}/submit`) : { status: 0 };
    const aSubmit = prodId ? await partnerA.req("POST", `/partner/products/${prodId}/submit`) : { status: 0 };
    const pending = await admin.req("GET", "/admin/products/pending");
    const inPending = pending.body.items?.some((p) => p.id === prodId);
    const pub0 = await new Client().req("GET", "/catalog/products");
    await admin.req("PATCH", `/admin/products/${prodId}/review`, { decision: "APPROVED" });
    const pub1 = await new Client().req("GET", "/catalog/products");
    const visibleAfter = pub1.body.products?.some((p) => p.id === prodId);
    rec("Approbation admin → catalogue partenaire ouvert", "PATCH /admin/applications/partners/:id", `HTTP ${dec.status}; création ${create2.status}`, `produit ${prodId ? "créé" : "—"}`, "partenaire: catalogue", create2.status === 201 ? "OK" : "KO");
    rec("Isolation : partenaire B ne voit/modifie pas le produit de A", "GET/PATCH/POST /partner/products", `liste B ${bList.body.products?.length ?? "?"}, PATCH B ${bPatch.status}, submit B ${bSubmit.status}`, "A intact", "—", (bList.body.products?.length ?? 1) === 0 && bPatch.status >= 400 && bSubmit.status >= 400 ? "OK" : "KO");
    rec("Produit soumis → file admin → publié au catalogue public", "POST /partner/products/:id/submit → review", `submit ${aSubmit.status}`, `en attente: ${inPending}; public avant ${pub0.body.products?.some((p) => p.id === prodId)} / après ${visibleAfter}`, "catalogue public", aSubmit.status === 200 && inPending && visibleAfter ? "OK" : "KO");
  }
  const dapps = await admin.req("GET", "/admin/applications/drivers");
  const dmine = dapps.body.items?.find((i) => i.fullName === `Livreur ${RUN}`);
  rec("Dossier livreur visible par l’admin", "GET /admin/applications/drivers", `HTTP ${dapps.status}`, dmine ? `statut ${dmine.status}` : "non listé (statut brouillon ?)", "admin: candidatures", dmine ? "OK" : "KO");
}

// 7) Pièces jointes
{
  const r = await new Client().req("POST", "/documents", {});
  rec("Pièces jointes (upload)", "POST /documents", `HTTP ${r.status}`, "stockage S3 non configuré en local", "notice « non transmises »", "INFO");
}

fs.writeFileSync("docs/captures/audit-2026-11-06/backend-matrix.json", JSON.stringify({ run: RUN, date: new Date().toISOString(), rows }, null, 1));
const ko = rows.filter((r) => r.verdict === "KO").length;
console.log(`\nRun ${RUN}: ${rows.length} contrôles, ${ko} KO`);
