import { test, expect, type Page } from "@playwright/test";

const URL = "/expertise";

const cards = [
  { id: "cadrage", n: "01", title: "Cadrage du projet", text: "Comprendre les usages, les contraintes et les objectifs avant de définir une solution.", preview: "Périmètre, priorités et critères de validation.", shortcut: "Cadrage" },
  { id: "deploiement", n: "02", title: "Déploiement terrain", text: "Organiser la préparation, les interventions sur site et les vérifications de mise en service.", preview: "Planning, accès, moyens et responsabilités.", shortcut: "Déploiement" },
  { id: "installation-parametrage", n: "03", title: "Installation & paramétrage", text: "Installer les équipements concernés et configurer les fonctions prévues pour leur usage.", preview: "Compatibilité, réglages et tests.", shortcut: "Installation" },
  { id: "flotte-operations", n: "04", title: "Flotte & opérations", text: "Structurer les informations utiles au suivi des véhicules, des équipements et des activités.", preview: "Parc, usages, rôles et besoins de suivi.", shortcut: "Opérations" },
  { id: "supervision-reporting", n: "05", title: "Supervision & reporting", text: "Définir les indicateurs, les vues et les rapports utiles au pilotage de l’activité.", preview: "Données, alertes et indicateurs pertinents.", shortcut: "Reporting" },
  { id: "transfert-suivi", n: "06", title: "Formation & accompagnement", text: "Accompagner la prise en main des outils et transmettre les repères nécessaires aux équipes.", preview: "Utilisateurs, supports et modalités de suivi.", shortcut: "Formation" },
] as const;

async function openPage(page: Page, hash = "") {
  await page.goto(URL + hash, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#exp-hero-title")).toBeVisible();
  // Attendre l'hydratation React avant d'interagir avec l'accordéon.
  await page.waitForFunction(() => {
    const el = document.querySelector(".exp-faq__button");
    return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
  });
}

async function expectBelowHeader(page: Page, selector: string) {
  await expect(async () => {
    const box = await page.locator(selector).first().boundingBox();
    const header = await page.locator("header.site-header").boundingBox();
    expect(box, selector).not.toBeNull();
    expect(box!.y, `${selector} sous l'en-tête`).toBeGreaterThanOrEqual(header!.y + header!.height - 2);
    expect(box!.y, `${selector} dans la fenêtre`).toBeLessThan(page.viewportSize()!.height);
  }).toPass({ timeout: 8_000 });
}

test.describe("page Expertise", () => {
  test("écran 1 : héros, raccourcis, secteurs et bandeau", async ({ page }) => {
    await openPage(page);
    await expect(page.locator("main h1")).toHaveCount(1);
    const title = page.locator("#exp-hero-title");
    await expect(title).toContainText("Du besoin");
    await expect(title).toContainText("au terrain,");
    await expect(title).toContainText("une expertise");
    await expect(title).toContainText("à chaque étape.");
    await expect(page.locator(".exp-hero .exp-eyebrow")).toHaveText("CONSEIL · TERRAIN · TECHNOLOGIE");
    await expect(page.locator(".exp-hero__lead")).toHaveText("Cadrer votre projet, préparer les équipements et accompagner vos équipes dans leur utilisation.");
    await expect(page.locator(".exp-hero").getByRole("link", { name: /Parler de mon projet/ })).toHaveAttribute("href", "/projets#brief-projet");
    await expect(page.locator(".exp-hero").getByRole("link", { name: /Explorer nos expertises/ })).toHaveAttribute("href", "#savoir-faire");
    await expect(page.getByText("Illustration d’une situation de travail.")).toBeVisible();

    const shortcuts = page.getByRole("navigation", { name: "Accès rapide aux expertises" });
    await expect(shortcuts.getByRole("link")).toHaveCount(6);
    for (const card of cards) {
      await expect(shortcuts.getByRole("link", { name: card.shortcut, exact: true })).toHaveAttribute("href", `#${card.id}`);
    }

    const sectors = page.locator(".exp-sectors");
    await expect(sectors.getByRole("heading", { level: 2 })).toHaveText("À chaque activité, ses contraintes.");
    await expect(sectors).toContainText("Nous adaptons l’approche au contexte, aux équipements et aux usages.");
    for (const [t, d] of [
      ["Banque & crédit-bail", "Suivi des actifs financés et informations utiles aux équipes."],
      ["Transport & logistique", "Organisation des véhicules, trajets et opérations."],
      ["BTP & industrie", "Équipements mobiles, conditions de chantier et suivi terrain."],
      ["Entreprises & institutions", "Outils métier, coordination et besoins spécifiques."],
    ]) {
      const item = sectors.locator(".exp-sector", { has: page.getByRole("heading", { level: 3, name: t, exact: true }) });
      await expect(item).toContainText(d);
    }
    await expect(sectors.locator(".exp-sector")).toHaveCount(4);
    await expect(sectors.locator(".exp-banner")).toContainText("Votre projet mobilise plusieurs métiers ?");
    await expect(sectors.locator(".exp-banner")).toContainText("Construisons une approche adaptée à votre besoin.");
    await expect(sectors.getByRole("link", { name: /Présenter mon contexte/ })).toHaveAttribute("href", "/projets#brief-projet");
  });

  test("écran 2 : six cartes, solutions associées et barre de combinaison", async ({ page }, testInfo) => {
    await openPage(page);
    const section = page.locator("#savoir-faire");
    await expect(section.locator(".exp-eyebrow")).toHaveText("NOS EXPERTISES");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Six savoir-faire, un accompagnement cohérent.");
    await expect(section).toContainText("Identifiez l’intervention utile à votre projet. Le périmètre se définit selon vos besoins.");
    await expect(section.locator(".exp-card")).toHaveCount(6);
    for (const card of cards) {
      const el = page.locator(`#${card.id}`);
      await expect(el.getByRole("heading", { level: 3, name: card.title, exact: true })).toBeVisible();
      await expect(el).toContainText(card.n);
      await expect(el).toContainText(card.text);
      await expect(el).toContainText("À préciser ensemble");
      await expect(el).toContainText(card.preview);
    }

    // chaque photo est chargée
    await page.locator("#savoir-faire").scrollIntoViewIfNeeded();
    const broken = await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".exp-page img"));
      imgs.forEach((img) => (img.loading = "eager"));
      await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = r; img.onerror = r; }))));
      return imgs.filter((img) => img.naturalWidth === 0).map((img) => img.src);
    });
    expect(broken).toEqual([]);

    // cartes d'une même rangée : même hauteur (grille à deux colonnes)
    if (testInfo.project.name === "desktop") {
      const rows = [["cadrage", "deploiement"], ["installation-parametrage", "flotte-operations"], ["supervision-reporting", "transfert-suivi"]];
      for (const row of rows) {
        const heights = await page.locator(row.map((id) => `#${id}`).join(", ")).evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
        expect(new Set(heights).size, row.join(" / ")).toBe(1);
      }
    }

    const bar = section.locator(".exp-associated");
    await expect(bar.getByRole("heading", { level: 3 })).toHaveText("Les solutions associées");
    await expect(bar).toContainText("Explorez les offres qui peuvent mobiliser ces expertises.");
    await expect(bar.getByRole("link")).toHaveCount(3);
    await expect(bar.getByRole("link", { name: /Géolocalisation/ })).toHaveAttribute("href", "/solutions/geolocalisation");
    await expect(bar.getByRole("link", { name: /Gestion de flotte/ })).toHaveAttribute("href", "/solutions/gestion-de-flotte");
    await expect(bar.getByRole("link", { name: /Projets sur mesure/ })).toHaveAttribute("href", "/solutions/plateformes-sur-mesure");

    const combine = section.locator(".exp-combine");
    await expect(combine).toContainText("Une intervention peut combiner plusieurs expertises.");
    await expect(combine.getByRole("link", { name: /Parler de mon projet/ })).toHaveAttribute("href", "/projets#brief-projet");
  });

  test("écran 3 : méthode, cahier des charges, FAQ et appel final", async ({ page }) => {
    await openPage(page);
    const method = page.locator(".exp-method");
    await expect(method.locator(".exp-eyebrow")).toHaveText("NOTRE MÉTHODE");
    await expect(method.getByRole("heading", { level: 2 })).toContainText("Un cadre clair,");
    await expect(method.getByRole("heading", { level: 2 })).toContainText("du premier échange");
    await expect(method.getByRole("heading", { level: 2 })).toContainText("au suivi.");
    const steps = [
      ["01", "Cadrage", "Comprendre le besoin et les contraintes."],
      ["02", "Architecture", "Définir les choix techniques et le périmètre."],
      ["03", "Préparation", "Organiser les moyens et les interventions."],
      ["04", "Déploiement", "Installer, paramétrer et mettre en service."],
      ["05", "Recette", "Vérifier les points convenus ensemble."],
      ["06", "Transfert & suivi", "Former, documenter et accompagner."],
    ];
    await expect(method.locator(".exp-step")).toHaveCount(6);
    for (const [i, [n, t, d]] of steps.entries()) {
      const step = method.locator(".exp-step").nth(i);
      await expect(step).toContainText(n);
      await expect(step.getByRole("heading", { level: 3, name: t, exact: true })).toBeVisible();
      await expect(step).toContainText(d);
    }
    await expect(method).toContainText("Les étapes et les livrables sont adaptés au projet.");
    await expect(method).toContainText("Illustration d’un accompagnement d’équipe.");

    const tender = page.locator(".exp-tender");
    await expect(tender.getByRole("heading", { level: 2 })).toHaveText("Un cahier des charges à étudier ?");
    await expect(tender).toContainText("Présentez votre contexte, les équipements concernés et les contraintes de votre consultation.");
    await expect(tender.getByRole("link", { name: /Présenter ma demande/ })).toHaveAttribute("href", "/contact");

    const faq = page.locator(".exp-faq");
    await expect(faq.getByRole("heading", { level: 2 })).toHaveText("Avant de démarrer.");
    await expect(faq).toContainText("Quelques repères pour préparer notre échange.");
    const buttons = faq.getByRole("button");
    await expect(buttons).toHaveCount(4);
    await expect(buttons.nth(0)).toHaveText("Faut-il déjà avoir une solution définie ?");
    await expect(buttons.nth(1)).toHaveText("Peut-on combiner plusieurs expertises ?");
    await expect(buttons.nth(2)).toHaveText("L’accompagnement inclut-il la formation ?");
    await expect(buttons.nth(3)).toHaveText("Comment sont définis les délais et le périmètre ?");

    const final = page.locator(".exp-final");
    await expect(final.getByRole("heading", { level: 2 })).toContainText("Votre besoin mérite");
    await expect(final.getByRole("heading", { level: 2 })).toContainText("une approche adaptée.");
    await expect(final).toContainText("Parlons de votre contexte et des prochaines étapes.");
    await expect(final.getByRole("link", { name: /Parler de mon projet/ })).toHaveAttribute("href", "/projets#brief-projet");
    await expect(final.getByRole("link", { name: /Nous contacter/ })).toHaveAttribute("href", "/contact");
  });

  test("FAQ : première réponse ouverte, une seule réponse à la fois, clavier", async ({ page }) => {
    await openPage(page);
    const faq = page.locator(".exp-faq");
    const buttons = faq.getByRole("button");
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
    await expect(faq.getByText("Non. Le premier échange peut servir à préciser le besoin et les contraintes.")).toBeVisible();
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "false");

    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(faq.getByRole("region", { name: "Peut-on combiner plusieurs expertises ?" })).toBeVisible();
    await expect(faq.getByText("Non. Le premier échange peut servir")).toBeHidden();

    await buttons.nth(2).focus();
    await page.keyboard.press("Enter");
    await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "false");
    await buttons.nth(2).click();
    await expect(buttons.nth(2)).toHaveAttribute("aria-expanded", "false");
  });

  test("ordre des écrans : introduction, prestations, méthode et contact", async ({ page }) => {
    await openPage(page);
    const tops = await page.evaluate(() =>
      [".exp-hero", ".exp-shortcuts", ".exp-sectors", "#savoir-faire", ".exp-method", ".exp-tender", ".exp-faq", ".exp-final"].map(
        (s) => Math.round(document.querySelector(s)!.getBoundingClientRect().top + window.scrollY),
      ),
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    expect(new Set(tops).size).toBe(tops.length);
  });

  test("« Explorer nos expertises » descend au début des prestations", async ({ page }) => {
    await openPage(page);
    await page.locator(".exp-hero").getByRole("link", { name: /Explorer nos expertises/ }).click();
    await expect(page).toHaveURL(/\/expertise#savoir-faire$/);
    await expectBelowHeader(page, "#savoir-faire h2");
  });

  for (const card of cards) {
    test(`raccourci « ${card.shortcut} » → carte ${card.n}`, async ({ page }) => {
      await openPage(page);
      await page.getByRole("navigation", { name: "Accès rapide aux expertises" }).getByRole("link", { name: card.shortcut, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/expertise#${card.id}$`));
      await expectBelowHeader(page, `#${card.id} h3`);
    });
  }

  test("« Parler de mon projet » mène au brief de /projets", async ({ page }) => {
    await openPage(page);
    const links = page.locator("a", { hasText: /Parler de mon projet|Présenter mon contexte/ });
    expect(await links.count()).toBe(4);
    for (let i = 0; i < 4; i++) await expect(links.nth(i)).toHaveAttribute("href", "/projets#brief-projet");
    await links.first().click();
    await expect(page).toHaveURL(/\/projets#brief-projet$/);
    await expect(page.locator("#brief-projet")).toBeVisible();
  });

  test("« Nous contacter » mène à /contact", async ({ page }) => {
    await openPage(page);
    await page.locator(".exp-final").getByRole("link", { name: /Nous contacter/ }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("aucun débordement horizontal", async ({ page }) => {
    await openPage(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const inner = await page.evaluate(() => {
      const page = document.querySelector(".exp-page")!.getBoundingClientRect();
      return Array.from(document.querySelectorAll(".exp-page *"))
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > page.right + 1 || r.left < page.left - 1); })
        .map((el) => el.className.toString().slice(0, 40));
    });
    expect(inner).toEqual([]);
  });
});