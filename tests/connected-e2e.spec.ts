import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";

/**
 * Sept parcours connectés pilotés depuis l'interface (base de test explicite, voir tests/e2e-db-guard.ts).
 * 1 inscription partenaire · 2 connexion · 3 catalogue (un même produit : création → soumission →
 * modération → visibilité publique) · 4 dossier livreur · 5 candidatures admin · 6 produits admin ·
 * 7 droits entre deux comptes partenaires et entre deux livreurs.
 * Données de test uniquement ; aucun mot de passe n'apparaît dans les captures (champs masqués).
 */

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@onloutou.local";
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass12345!";
const PASSWORD = "ParcoursE2E-2026!";

async function newRoleContext(browser: Browser): Promise<BrowserContext> {
  const use = test.info().project.use;
  return browser.newContext({
    baseURL: use.baseURL,
    viewport: use.viewport ?? undefined,
    isMobile: use.isMobile,
    hasTouch: use.hasTouch,
    userAgent: use.userAgent,
    deviceScaleFactor: use.deviceScaleFactor,
  });
}

async function adminLogin(page: Page) {
  await page.goto("/admin/login");
  await page.locator("#adm-email").fill(adminEmail);
  await page.locator("#adm-password").fill(adminPassword);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL(/\/admin\/(?!login)/, { timeout: 30_000 });
}

/** Appel d'API avec la session du navigateur (cookie + jeton CSRF), pour les contrôles de droits. */
async function api(page: Page, method: string, path: string, body?: unknown) {
  if (page.url() === "about:blank") await page.goto("/robots.txt"); // une origine est nécessaire pour fetch relatif
  return page.evaluate(
    async ({ method, path, body }) => {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (method !== "GET") {
        const c = await fetch("/api/v1/csrf", { credentials: "include" });
        headers["x-csrf-token"] = ((await c.json()) as { csrfToken: string }).csrfToken;
      }
      const res = await fetch(`/api/v1${path}`, {
        method,
        credentials: "include",
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const text = await res.text();
      let json: unknown = null;
      try {
        json = JSON.parse(text);
      } catch {
        /* corps non JSON */
      }
      return { status: res.status, json };
    },
    { method, path, body },
  );
}

async function registerPartner(page: Page, who: { email: string; org: string; name: string }) {
  await page.goto("/espace-partenaire/inscription");
  await page.locator('input[name="email"]').fill(who.email);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="displayName"]').fill(who.name);
  await page.locator('input[name="organizationName"]').fill(who.org);
  await page.locator('input[name="zone"]').fill("Abidjan");
  await page.getByRole("button", { name: /créer mon dossier/i }).click();
  await page.waitForURL(/\/espace-partenaire\/catalogue\?candidature=recue/, { timeout: 30_000 });
}

test.describe.configure({ mode: "serial" });

test.describe("parcours connectés depuis l'interface", () => {
  const stamp = `${Date.now()}`;
  let suffix = "";
  let A = { email: "", org: "", name: "Partenaire A" };
  let B = { email: "", org: "", name: "Partenaire B" };
  let D1 = { email: "", name: "" };
  let D2 = { email: "", name: "" };
  const productTitle = () => `Fiche E2E ${suffix}`;
  let productId = "";
  let ctxA: BrowserContext;
  let ctxB: BrowserContext;
  let ctxD1: BrowserContext;
  let ctxD2: BrowserContext;
  let ctxAdmin: BrowserContext;

  test.beforeAll(async ({ browser }, testInfo) => {
    suffix = `${testInfo.project.name}-${stamp}`;
    A = { email: `part.a.${suffix}@onloutou.local`, org: `Org A ${suffix}`, name: "Partenaire A" };
    B = { email: `part.b.${suffix}@onloutou.local`, org: `Org B ${suffix}`, name: "Partenaire B" };
    D1 = { email: `liv.1.${suffix}@onloutou.local`, name: `Livreur Un ${suffix}` };
    D2 = { email: `liv.2.${suffix}@onloutou.local`, name: `Livreur Deux ${suffix}` };
    ctxA = await newRoleContext(browser);
    ctxB = await newRoleContext(browser);
    ctxD1 = await newRoleContext(browser);
    ctxD2 = await newRoleContext(browser);
    ctxAdmin = await newRoleContext(browser);
  });

  test.afterAll(async () => {
    await Promise.all([ctxA, ctxB, ctxD1, ctxD2, ctxAdmin].map((c) => c?.close()));
  });

  test("1 · inscription partenaire (deux comptes) : dossier reçu, catalogue verrouillé", async ({}, testInfo) => {
    const a = await ctxA.newPage();
    await registerPartner(a, A);
    await expect(a.getByRole("status")).toContainText("Candidature enregistrée");
    await expect(a.getByText("Statut du dossier : Candidature reçue, en attente d’examen")).toBeVisible();
    await expect(a.getByText(/disponible après validation/)).toBeVisible();
    await expect(a.getByLabel("Titre")).toHaveCount(0);
    await a.screenshot({ path: testInfo.outputPath("1-partenaire-candidature-recue.png") });

    const b = await ctxB.newPage();
    await registerPartner(b, B);
    await expect(b.getByText("Statut du dossier : Candidature reçue, en attente d’examen")).toBeVisible();
  });

  test("5 · candidatures admin : les deux dossiers partenaires sont visibles et validés", async ({}, testInfo) => {
    const admin = await ctxAdmin.newPage();
    await adminLogin(admin);
    await admin.goto("/admin/candidatures");
    for (const org of [A.org, B.org]) {
      const row = admin.getByRole("row").filter({ hasText: org });
      await expect(row).toHaveCount(1, { timeout: 30_000 });
      await expect(row).toContainText("SUBMITTED");
      await row.getByRole("button", { name: "Valider" }).click();
      await expect(row).toContainText("APPROVED");
    }
    await admin.screenshot({ path: testInfo.outputPath("5-admin-candidatures-partenaires.png") });
  });

  test("2 · connexion partenaire : mauvais mot de passe refusé, bon mot de passe → catalogue ouvert", async ({}, testInfo) => {
    const fresh = await ctxA.browser()!.newContext({ baseURL: test.info().project.use.baseURL });
    const p = await fresh.newPage();
    await p.goto("/espace-partenaire/connexion");
    await p.locator('input[name="email"]').fill(A.email);
    await p.locator('input[name="password"]').fill("mauvais-mot-de-passe");
    await p.getByRole("button", { name: "Se connecter" }).click();
    await expect(p.locator(".adm-error")).toBeVisible();
    await expect(p).toHaveURL(/\/espace-partenaire\/connexion/);
    await p.locator('input[name="password"]').fill(PASSWORD);
    await p.getByRole("button", { name: "Se connecter" }).click();
    await p.waitForURL(/\/espace-partenaire\/catalogue/, { timeout: 30_000 });
    await expect(p.getByText("Statut du dossier : Approuvé")).toBeVisible();
    await p.screenshot({ path: testInfo.outputPath("2-connexion-partenaire-approuve.png") });
    await fresh.close();
  });

  test("3 · catalogue : un même produit, de la création à la visibilité publique", async ({}, testInfo) => {
    const a = await ctxA.newPage();
    await a.goto("/espace-partenaire/catalogue");
    await expect(a.getByText("Statut du dossier : Approuvé")).toBeVisible({ timeout: 30_000 });
    await a.getByLabel("Titre").fill(productTitle());
    await a.getByLabel("Description").fill("Fiche de test automatisé, sans disponibilité ni tarif annoncés.");
    await a.getByRole("button", { name: "Enregistrer le brouillon" }).click();
    const item = a.locator("li", { hasText: productTitle() });
    await expect(item).toContainText("Brouillon (non transmis)");
    await a.screenshot({ path: testInfo.outputPath("3a-produit-brouillon.png") });

    // Invisible tant que non validé : ni dans la file admin, ni sur la page publique.
    const pub = await ctxAdmin.newPage();
    await pub.goto("/produits");
    await expect(pub.getByText(productTitle())).toHaveCount(0);

    await item.getByRole("button", { name: "Soumettre pour validation" }).click();
    await expect(item).toContainText("Transmis, en attente de validation");
    await expect(item.getByRole("button", { name: "Soumettre pour validation" })).toHaveCount(0);
    await a.screenshot({ path: testInfo.outputPath("3b-produit-transmis.png") });

    const list = await api(a, "GET", "/partner/products");
    const mine = (list.json as { products: { id: string; title: string }[] }).products.find((p) => p.title === productTitle());
    expect(mine).toBeTruthy();
    productId = mine!.id;
  });

  test("6 · produits admin : la fiche transmise est modérée puis publiée", async ({}, testInfo) => {
    const admin = await ctxAdmin.newPage();
    await admin.goto("/admin/produits");
    const row = admin.getByRole("row").filter({ hasText: productTitle() });
    await expect(row).toHaveCount(1, { timeout: 30_000 });
    await expect(row).toContainText(A.org);
    await admin.screenshot({ path: testInfo.outputPath("6a-admin-produit-en-attente.png") });
    await row.getByRole("button", { name: "Publier" }).click();
    await expect(row).toHaveCount(0);

    // Même produit : statut « Validé et publié » côté partenaire, visible sur la page publique.
    const a = await ctxA.newPage();
    await a.goto("/espace-partenaire/catalogue");
    await expect(a.locator("li", { hasText: productTitle() })).toContainText("Validé et publié");

    const visitor = await (await ctxA.browser()!.newContext({ baseURL: test.info().project.use.baseURL })).newPage();
    await visitor.goto("/produits");
    const published = visitor.getByTestId("published-partner-products");
    await expect(published).toContainText(productTitle(), { timeout: 30_000 });
    await expect(published).not.toContainText(A.org); // l'organisation n'est pas exposée publiquement
    await published.scrollIntoViewIfNeeded();
    await visitor.screenshot({ path: testInfo.outputPath("6b-produit-visible-publiquement.png") });

    const res = await api(visitor, "GET", "/catalog/products");
    const body = JSON.stringify(res.json);
    expect(body).not.toContain("ownerUserId");
    expect(body).not.toContain("rejectionReason");
    expect(body).not.toContain(A.org);
    await visitor.context().close();
  });

  test("4 · dossier livreur : inscription de deux livreurs, validation admin, statut visible", async ({}, testInfo) => {
    for (const [ctx, d] of [[ctxD1, D1], [ctxD2, D2]] as const) {
      const p = await ctx.newPage();
      await p.goto("/espace-livreur/inscription");
      await p.locator('input[name="email"]').fill(d.email);
      await p.locator('input[name="password"]').fill(PASSWORD);
      await p.locator('input[name="fullName"]').fill(d.name);
      await p.getByRole("button", { name: /créer mon dossier/i }).click();
      await p.waitForURL(/\/espace-livreur\/dossier/, { timeout: 30_000 });
      await expect(p.getByText("Statut du dossier : Candidature reçue, en attente d’examen")).toBeVisible();
      await expect(p.getByText(`Bonjour ${d.name}`)).toBeVisible();
    }
    const admin = await ctxAdmin.newPage();
    await admin.goto("/admin/candidatures");
    const row = admin.getByRole("row").filter({ hasText: D1.email });
    await expect(row).toHaveCount(1, { timeout: 30_000 });
    await expect(row).toContainText("SUBMITTED");
    await row.getByRole("button", { name: "Valider" }).click();
    await expect(row).toContainText("APPROVED");
    await admin.screenshot({ path: testInfo.outputPath("5b-admin-candidatures-livreurs.png") });

    const p1 = await ctxD1.newPage();
    await p1.goto("/espace-livreur/dossier");
    await expect(p1.getByText("Statut du dossier : Approuvé")).toBeVisible({ timeout: 30_000 });
    await p1.screenshot({ path: testInfo.outputPath("4-dossier-livreur-approuve.png") });
  });

  test("7 · droits : un compte ne lit ni ne modifie le dossier de l'autre", async ({}, testInfo) => {
    // Partenaire B (approuvé) face au produit de A.
    const b = await ctxB.newPage();
    await b.goto("/espace-partenaire/catalogue");
    await expect(b.getByText("Statut du dossier : Approuvé")).toBeVisible({ timeout: 30_000 });
    await expect(b.getByText(productTitle())).toHaveCount(0);
    const listB = await api(b, "GET", "/partner/products");
    expect(listB.status).toBe(200);
    expect(JSON.stringify(listB.json)).not.toContain(productId);
    const patch = await api(b, "PATCH", `/partner/products/${productId}`, { title: "Détourné par B" });
    expect(patch.status).toBeGreaterThanOrEqual(400);
    const submit = await api(b, "POST", `/partner/products/${productId}/submit`);
    expect(submit.status).toBeGreaterThanOrEqual(400);
    const meB = await api(b, "GET", "/partner/me");
    expect(JSON.stringify(meB.json)).toContain(B.org);
    expect(JSON.stringify(meB.json)).not.toContain(A.org);

    // Le titre de A est intact.
    const a = await ctxA.newPage();
    const listA = await api(a, "GET", "/partner/products");
    expect(JSON.stringify(listA.json)).toContain(productTitle());
    expect(JSON.stringify(listA.json)).not.toContain("Détourné par B");

    // Un partenaire n'accède ni au dossier livreur, ni à l'administration (écran ni API).
    expect((await api(b, "GET", "/driver/me")).status).toBeGreaterThanOrEqual(403);
    expect((await api(b, "GET", "/admin/applications/partners")).status).toBeGreaterThanOrEqual(403);
    await b.goto("/admin/produits");
    await expect(b.locator(".adm-error")).toBeVisible({ timeout: 30_000 });
    await expect(b.getByRole("row")).toHaveCount(0);
    await b.screenshot({ path: testInfo.outputPath("7a-partenaire-refuse-admin.png") });

    // Livreur 2 : voit uniquement son propre dossier ; pas d'accès partenaire ni admin.
    const d2 = await ctxD2.newPage();
    const own = await api(d2, "GET", "/driver/me");
    expect(own.status).toBe(200);
    expect(JSON.stringify(own.json)).toContain(D2.name);
    expect(JSON.stringify(own.json)).not.toContain(D1.name);
    expect((await api(d2, "GET", "/partner/products")).status).toBeGreaterThanOrEqual(403);
    expect((await api(d2, "GET", "/admin/applications/drivers")).status).toBeGreaterThanOrEqual(403);
    // Statut propre : le livreur 2 n'hérite pas de l'approbation du livreur 1.
    await d2.goto("/espace-livreur/dossier");
    await expect(d2.getByText("Statut du dossier : Candidature reçue, en attente d’examen")).toBeVisible({ timeout: 30_000 });
    await d2.screenshot({ path: testInfo.outputPath("7b-livreur-2-dossier-propre.png") });

    // Un livreur ne peut pas lire les dossiers partenaire du livreur/partenaire d'un autre rôle.
    expect((await api(d2, "GET", "/partner/me")).status).toBeGreaterThanOrEqual(403);
  });
});
