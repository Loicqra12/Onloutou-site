import { test, expect } from "@playwright/test";

test.describe("page gestion de flotte", () => {
  test("hero, pilotage, onglets, cycle, fonctionnalités, usages, reporting, déploiement, FAQ et liens", async ({ page }, testInfo) => {
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "domcontentloaded" });

    const title = page.locator("#flx-hero-title");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Transformez");
    await expect(title).toContainText("le suivi en");
    await expect(title).toContainText("décisions.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByText("Aperçu illustratif — données fictives").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Étudier ma flotte/ })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("link", { name: /Découvrir le pilotage/ })).toHaveAttribute("href", "#pilotage");

    const strip = page.getByRole("region", { name: "Ce que permet la gestion de flotte" });
    for (const t of ["Visibilité", "Coordination", "Événements", "Reporting"]) {
      await expect(strip).toContainText(t);
    }

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
      await expect(page.locator("#mega-solutions")).toBeVisible();
      const link = page.locator("#mega-solutions").getByRole("link", { name: "Gestion de flotte", exact: true });
      await expect(link).toHaveAttribute("href", "/solutions/gestion-de-flotte");
      await page.mouse.move(10, 600);
    }

    // Pilotage (ancre existante)
    const pilotage = page.locator("#pilotage");
    await expect(pilotage.getByRole("heading", { level: 2 })).toContainText("Une flotte ne se pilote");
    await expect(pilotage.getByRole("link")).toHaveCount(3);

    // Onglets par équipe (navigation clavier)
    const teams = page.locator("#equipes");
    await teams.scrollIntoViewIfNeeded();
    const tabResp = teams.getByRole("tab", { name: "Responsable de flotte" });
    await expect(tabResp).toHaveAttribute("aria-selected", "true");
    await expect(teams.getByRole("tabpanel")).toContainText("Organiser le suivi au quotidien.");
    await expect(teams.getByText("Aperçu des véhicules")).toBeVisible();
    await expect(teams.getByRole("columnheader")).toHaveCount(3);
    await tabResp.focus();
    await page.keyboard.press("ArrowRight");
    await expect(teams.getByRole("tab", { name: "Équipes terrain" })).toHaveAttribute("aria-selected", "true");
    await expect(teams.getByRole("tabpanel")).toContainText("Simplifier le suivi sur le terrain.");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(teams.getByRole("tab", { name: "Direction" })).toHaveAttribute("aria-selected", "true");
    await expect(teams.getByRole("tabpanel")).toContainText("Garder une vue d’ensemble.");
    await page.keyboard.press("ArrowLeft");
    await expect(teams.getByRole("tab", { name: "Équipes terrain" })).toHaveAttribute("aria-selected", "true");

    // Cycle opérationnel
    const cycle = page.locator("#cycle");
    await expect(cycle.getByRole("heading", { level: 2 })).toContainText("Du départ au compte rendu.");
    await expect(cycle.locator("ol > li")).toHaveCount(5);
    for (const s of ["Préparer", "Suivre", "Réagir", "Vérifier", "Rapporter"]) {
      await expect(cycle.getByText(s, { exact: true })).toBeVisible();
    }

    // Fonctionnalités
    const features = page.locator("#fonctionnalites");
    await expect(features.getByRole("heading", { level: 2 })).toContainText("Un pilotage qui s’adapte à votre organisation.");
    await expect(features.locator(".flx-fcard")).toHaveCount(4);
    await expect(features).toContainText("Fonctions selon équipements, données disponibles et périmètre retenu.");

    // Usages
    const usages = page.locator("#usages");
    await expect(usages.getByRole("heading", { level: 2 })).toContainText("Des usages ancrés dans le terrain.");
    await expect(usages.getByRole("link")).toHaveCount(5);
    await expect(usages.getByRole("img", { name: /tablette devant un utilitaire/ })).toBeVisible();

    // Reporting (ancre existante)
    const reporting = page.locator("#tableaux-de-bord");
    await expect(reporting.getByRole("heading", { level: 2 })).toContainText("qui deviennent utiles.");
    await expect(reporting.getByRole("img", { name: /Synthèse d’exploitation/ })).toBeVisible();
    await expect(reporting.getByRole("link", { name: /Définir mes besoins de reporting/ })).toHaveAttribute("href", "/contact");

    // Déploiement
    const deploy = page.locator("#mise-en-place");
    await expect(deploy.getByRole("heading", { level: 2 })).toContainText("vos équipes.");
    await expect(deploy.locator("ol > li")).toHaveCount(6);

    // FAQ
    const q1 = page.getByRole("button", { name: /Quelle différence avec la géolocalisation/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    const q2 = page.getByRole("button", { name: /Quels véhicules peut-on intégrer/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("main").getByRole("link", { name: /Nous contacter/ })).toHaveAttribute("href", "/contact");

    // CTA final et « Pour compléter votre projet »
    await expect(page.getByRole("link", { name: /Présenter ma flotte/ })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("link", { name: /Découvrir la géolocalisation/ })).toHaveAttribute("href", "/solutions/geolocalisation");
    await expect(page.locator("main").getByRole("link", { name: "+225 05 54 13 77 77" })).toHaveAttribute("href", /^tel:\+225/);
    const explore = page.getByRole("navigation", { name: "Pour compléter votre projet" });
    for (const href of [
      "/solutions/location",
      "/solutions/vente",
      "/solutions/geolocalisation",
      "/solutions/securisation-actifs",
      "/solutions/plateformes-sur-mesure",
    ]) {
      await expect(explore.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test("ancres #pilotage et #tableaux-de-bord présentes dans le HTML serveur", async ({ request }) => {
    const res = await request.get("/solutions/gestion-de-flotte");
    const html = await res.text();
    expect(html).toContain('id="pilotage"');
    expect(html).toContain('id="tableaux-de-bord"');
  });

  test("onglets : hauteur stable et colonnes alignées", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "domcontentloaded" });
    const teams = page.locator("#equipes");
    await teams.scrollIntoViewIfNeeded();
    const h0 = (await teams.boundingBox())!.height;
    for (const name of ["Direction", "Équipes terrain", "Responsable de flotte"]) {
      await teams.getByRole("tab", { name }).click();
      const h = (await teams.boundingBox())!.height;
      expect(Math.abs(h - h0)).toBeLessThanOrEqual(1);
      const copy = await teams.locator(".flx-panel:not(.flx-panel--off) .flx-panel__copy").boundingBox();
      const mock = await teams.locator(".flx-panel:not(.flx-panel--off) .flx-mock").boundingBox();
      expect(Math.abs(copy!.height - mock!.height)).toBeLessThanOrEqual(1);
    }
    const media = await page.locator(".flx-usages__media").boundingBox();
    const list = await page.locator(".flx-usages__list").boundingBox();
    expect(Math.abs(media!.height - list!.height)).toBeLessThanOrEqual(1);
    const left = await page.locator(".flx-deploy__media").boundingBox();
    const steps = await page.locator(".flx-deploy__right").boundingBox();
    const stage = await page.locator(".flx-deploy__stage").boundingBox();
    expect(Math.abs(left!.y + left!.height - (steps!.y + steps!.height))).toBeLessThanOrEqual(1);
    expect(stage!.height).toBeGreaterThan(0);
  });

  test("aucun débordement horizontal", async ({ page }) => {
    await page.goto("/solutions/gestion-de-flotte", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#flx-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("méga-menu mobile — lien gestion de flotte", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "navigation mobile");
    await page.goto("/");
    await page.locator(".site-header-toggle").click();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
    const link = page.locator(".site-nav-mobile").getByRole("link", { name: "Gestion de flotte", exact: true });
    await expect(link).toHaveAttribute("href", "/solutions/gestion-de-flotte");
  });
});
