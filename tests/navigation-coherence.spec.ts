import { expect, test, type Locator, type Page } from "@playwright/test";
import { headerNavigation } from "@/content/header-navigation";

/**
 * Cohérence de navigation : chaque entrée de menu doit atteindre le contenu annoncé par son libellé,
 * titre visible sous l'en-tête fixe (déplié ou replié), menu mobile refermé et défilement libre.
 * Les assertions portent sur le contenu atteint, pas seulement sur l'URL.
 */

type Mode = "desktop" | "mobile";
const modeOf = (page: Page): Mode => ((page.viewportSize()?.width ?? 0) >= 1200 ? "desktop" : "mobile");

const trigger = (page: Page, id: string) => page.locator(`button[aria-controls="mega-${id}"]`);
const burger = (page: Page) => page.locator("button.site-header-toggle");

async function openHome(page: Page, width?: number, height = 900) {
  if (width) await page.setViewportSize({ width, height });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("header.site-header")).toBeVisible();
}

/** Ouvre le méga-menu au survol (tolère l'hydratation tardive de React). */
async function hoverOpen(page: Page, id: string) {
  await expect(async () => {
    await page.mouse.move(700, 650);
    await trigger(page, id).hover();
    await expect(trigger(page, id)).toHaveAttribute("aria-expanded", "true", { timeout: 800 });
  }).toPass({ timeout: 15_000 });
}

async function openBurger(page: Page) {
  await expect(async () => {
    if ((await burger(page).getAttribute("aria-expanded")) !== "true") await burger(page).click();
    await expect(burger(page)).toHaveAttribute("aria-expanded", "true", { timeout: 800 });
  }).toPass({ timeout: 15_000 });
}

/** Clique un lien d'un menu de l'en-tête, en desktop (méga-menu) comme en mobile (accordéon). */
async function clickMenuLink(page: Page, menuId: string, name: string | RegExp) {
  if (modeOf(page) === "desktop") {
    await hoverOpen(page, menuId);
    await page.locator(`#mega-${menuId}`).getByRole("link", { name }).first().click();
    return;
  }
  await openBurger(page);
  const accordion = page.locator(`button[aria-controls="mobile-${menuId}"]`);
  if ((await accordion.getAttribute("aria-expanded")) !== "true") await accordion.click();
  await page.locator(`#mobile-${menuId}`).getByRole("link", { name }).first().click();
}

async function expectMenusClosed(page: Page) {
  if (modeOf(page) === "mobile") {
    await expect(burger(page)).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("nav.site-nav-mobile")).toBeHidden();
    // le défilement n'est plus verrouillé
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
    const before = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy({ top: 120, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  } else {
    await expect(page.locator(".mega-panel:not([hidden])")).toHaveCount(0);
  }
}

/** Le titre cible est lisible : sous l'en-tête fixe (même replié) et dans la fenêtre. */
async function expectBelowHeader(page: Page, target: Locator) {
  await expect(async () => {
    const header = (await page.locator("header.site-header").boundingBox())!;
    const box = await target.first().boundingBox();
    expect(box, "titre introuvable").not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(header.y + header.height - 1);
    expect(box!.y).toBeLessThan(page.viewportSize()!.height * 0.75);
  }).toPass({ timeout: 12_000 });
}

/** Attend la fin d'un défilement animé avant de naviguer dans l'historique. */
async function waitScrollSettled(page: Page) {
  let last = -1;
  await expect(async () => {
    const y = await page.evaluate(() => window.scrollY);
    const stable = y === last;
    last = y;
    await page.waitForTimeout(250);
    expect(stable, "défilement en cours").toBe(true);
  }).toPass({ timeout: 10_000 });
}

const expertiseServices = [
  {
    label: "Cadrage du projet",
    href: "/expertise#cadrage",
    id: "cadrage",
    heading: "Cadrage du projet",
    text: "Comprendre les usages, les contraintes et les objectifs",
  },
  {
    label: "Déploiement terrain",
    href: "/expertise#deploiement",
    id: "deploiement",
    heading: "Déploiement terrain",
    text: "Organiser la préparation, les interventions sur site",
  },
  {
    label: "Installation & paramétrage",
    href: "/expertise#installation-parametrage",
    id: "installation-parametrage",
    heading: "Installation & paramétrage",
    text: "Installer les équipements concernés",
  },
  {
    label: "Flotte & opérations",
    href: "/expertise#flotte-operations",
    id: "flotte-operations",
    heading: "Flotte & opérations",
    text: "Structurer les informations utiles au suivi",
  },
  {
    label: "Supervision & reporting",
    href: "/expertise#supervision-reporting",
    id: "supervision-reporting",
    heading: "Supervision & reporting",
    text: "Définir les indicateurs, les vues et les rapports",
  },
  {
    label: "Formation & accompagnement",
    href: "/expertise#transfert-suivi",
    id: "transfert-suivi",
    heading: "Formation & accompagnement",
    text: "Accompagner la prise en main des outils",
  },
] as const;

const associatedSolutions = [
  {
    label: "Géolocalisation : installation terrain",
    href: "/solutions/geolocalisation#installation-terrain",
    id: "installation-terrain",
    heading: /Installer\.\s*Contrôler\.\s*Accompagner\./,
  },
  {
    label: "Gestion de flotte : pilotage",
    href: "/solutions/gestion-de-flotte#pilotage",
    id: "pilotage",
    heading: /Une flotte ne se pilote\s*pas seulement sur une carte/,
  },
  {
    label: "Gestion de flotte : tableaux de bord",
    href: "/solutions/gestion-de-flotte#tableaux-de-bord",
    id: "tableaux-de-bord",
    heading: /Des informations\s*qui deviennent utiles/,
  },
] as const;

test.describe("Expertise — données du menu", () => {
  const menu = headerNavigation.find((item) => item.id === "expertise")!;
  if (menu.type !== "menu") throw new Error("menu Expertise introuvable");

  test("les prestations mènent à /expertise ; les solutions sont isolées sous « Solutions associées »", () => {
    const groups = menu.menu.groups;
    const services = groups.filter((g) => g.id !== "solutions-associees").flatMap((g) => g.items);
    expect(services.map((entry) => entry.label)).toEqual(expertiseServices.map((s) => s.label));
    for (const entry of services) expect(entry.href, entry.label).toMatch(/^\/expertise#[a-z-]+$/);

    const associated = groups.find((g) => g.id === "solutions-associees");
    expect(associated?.title).toBe("Solutions associées");
    expect(associated?.items.map((entry) => entry.href)).toEqual(associatedSolutions.map((s) => s.href));
    for (const entry of associated!.items) expect(entry.href).toMatch(/^\/solutions\//);

    const hrefs = groups.flatMap((g) => g.items.map((entry) => entry.href));
    expect(new Set(hrefs).size, "deux libellés ne partagent pas la même destination").toBe(hrefs.length);
    expect(menu.menu.footer?.cta?.href).toBe("/projets#brief-projet");
  });
});

test.describe("Expertise — contenu atteint", () => {
  for (const service of expertiseServices) {
    test(`accès direct : ${service.label}`, async ({ page }) => {
      await page.goto(service.href);
      const card = page.locator(`#${service.id}`);
      const heading = card.getByRole("heading", { name: service.heading, exact: true });
      await expect(heading).toBeVisible();
      await expect(card).toContainText(service.text);
      await expectBelowHeader(page, heading);
    });

    test(`depuis une autre page : ${service.label}`, async ({ page }) => {
      await openHome(page);
      await clickMenuLink(page, "expertise", service.label);
      await expect(page).toHaveURL(new RegExp(`${service.href}$`));
      await expectBelowHeader(page, page.locator(`#${service.id}`).getByRole("heading", { name: service.heading, exact: true }));
      await expectMenusClosed(page);
    });
  }

  test("« Installation & paramétrage » : carte dédiée, avec ce qui est à préciser et les solutions associées", async ({ page }) => {
    await page.goto("/expertise#installation-parametrage");
    const card = page.locator("#installation-parametrage");
    await expect(card).toContainText("À préciser ensemble");
    await expect(card).toContainText("Compatibilité, réglages et tests.");
    // les solutions sont proposées dans la barre « Les solutions associées », jamais comme prestation
    const bar = page.locator(".exp-associated");
    await expect(bar.getByRole("link", { name: /Géolocalisation/ })).toHaveAttribute("href", "/solutions/geolocalisation");
    await expect(bar.getByRole("link", { name: /Gestion de flotte/ })).toHaveAttribute("href", "/solutions/gestion-de-flotte");
    await expect(bar.getByRole("link", { name: /Projets sur mesure/ })).toHaveAttribute("href", "/solutions/plateformes-sur-mesure");
    // deux cartes d'une même rangée ont la même hauteur
    const heights = await page
      .locator("#installation-parametrage, #flotte-operations")
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
    if (modeOf(page) === "desktop") expect(new Set(heights).size).toBe(1);
  });

  for (const solution of associatedSolutions) {
    test(`Solutions associées : ${solution.label}`, async ({ page }) => {
      await openHome(page);
      await clickMenuLink(page, "expertise", solution.label);
      await expect(page).toHaveURL(new RegExp(`${solution.href}$`));
      const section = page.locator(`#${solution.id}`);
      const heading = section.getByRole("heading", { level: 2, name: solution.heading });
      await expect(heading).toBeVisible();
      await expectBelowHeader(page, heading);
      await expectMenusClosed(page);
    });
  }

  test("« Parlons de votre projet » : formulaire de brief atteint, y compris après actualisation", async ({ page }) => {
    await openHome(page);
    if (modeOf(page) === "desktop") {
      await hoverOpen(page, "expertise");
      await page.locator("#mega-expertise").getByRole("link", { name: /Parlons de votre projet/ }).click();
    } else {
      await clickMenuLink(page, "expertise", /Parlons de votre projet/);
    }
    await expect(page).toHaveURL(/\/projets#brief-projet$/);
    const brief = page.locator("#brief-projet");
    await expect(brief.getByRole("heading", { level: 2 }).first()).toBeVisible();
    await expectBelowHeader(page, brief.getByRole("heading", { level: 2 }).first());
    await expectMenusClosed(page);

    await page.reload();
    await expectBelowHeader(page, page.locator("#brief-projet").getByRole("heading", { level: 2 }).first());
  });
});

test.describe("Expertise — comportement des ancres", () => {
  test("même page : en-tête déplié puis replié", async ({ page }) => {
    await page.goto("/expertise");
    await expect(page.locator("header.site-header")).toBeVisible();

    // en-tête déplié (haut de page)
    await clickMenuLink(page, "expertise", "Cadrage du projet");
    await expect(page).toHaveURL(/#cadrage$/);
    await expectBelowHeader(page, page.locator("#cadrage").getByRole("heading", { name: "Cadrage du projet", exact: true }));
    await expectMenusClosed(page);

    // en-tête replié (bas de page) : lien vers un passage situé plus haut
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await clickMenuLink(page, "expertise", "Installation & paramétrage");
    await expect(page).toHaveURL(/#installation-parametrage$/);
    await expectBelowHeader(page, page.locator("#installation-parametrage").getByRole("heading", { level: 3 }));

    // retour en haut (en-tête redéplié) puis lien vers un passage situé plus bas
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await clickMenuLink(page, "expertise", "Formation & accompagnement");
    await expect(page).toHaveURL(/#transfert-suivi$/);
    await expectBelowHeader(page, page.locator("#transfert-suivi").getByRole("heading", { name: "Formation & accompagnement", exact: true }));
  });

  test("Précédent / Suivant entre deux ancres de la page", async ({ page }) => {
    await page.goto("/expertise");
    await expect(page.locator("header.site-header")).toBeVisible();
    await clickMenuLink(page, "expertise", "Cadrage du projet");
    await expect(page).toHaveURL(/#cadrage$/);
    await expectBelowHeader(page, page.locator("#cadrage").getByRole("heading", { name: "Cadrage du projet", exact: true }));
    await clickMenuLink(page, "expertise", "Formation & accompagnement");
    await expect(page).toHaveURL(/#transfert-suivi$/);
    await expectBelowHeader(page, page.locator("#transfert-suivi").getByRole("heading", { name: "Formation & accompagnement", exact: true }));

    await waitScrollSettled(page);
    await page.goBack();
    await expect(page).toHaveURL(/#cadrage$/);
    await expect(page.locator("#cadrage").getByRole("heading", { name: "Cadrage du projet", exact: true })).toBeInViewport();
    await waitScrollSettled(page);
    await page.goForward();
    await expect(page).toHaveURL(/#transfert-suivi$/);
    await expect(page.locator("#transfert-suivi").getByRole("heading", { name: "Formation & accompagnement", exact: true })).toBeInViewport();
  });

  test("actualisation avec ancre : le passage reste visible sous l'en-tête", async ({ page }) => {
    await page.goto("/expertise#flotte-operations");
    const heading = page.locator("#flotte-operations").getByRole("heading", { level: 3 });
    await expectBelowHeader(page, heading);
    await page.reload();
    await expectBelowHeader(page, heading);
  });
});

test.describe("Largeurs proches du breakpoint 1200 px", () => {
  for (const width of [1199, 1200, 1201]) {
    test(`${width}px : navigation et Expertise`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop", "largeurs pilotées par le test");
      await openHome(page, width, 800);
      const expectedMode: Mode = width >= 1200 ? "desktop" : "mobile";
      expect(modeOf(page)).toBe(expectedMode);
      if (expectedMode === "desktop") {
        await expect(trigger(page, "expertise")).toBeVisible();
        await expect(burger(page)).toBeHidden();
      } else {
        await expect(burger(page)).toBeVisible();
        await expect(trigger(page, "expertise")).toBeHidden();
      }
      await clickMenuLink(page, "expertise", "Formation & accompagnement");
      await expect(page).toHaveURL(/\/expertise#transfert-suivi$/);
      await expectBelowHeader(page, page.locator("#transfert-suivi").getByRole("heading", { name: "Formation & accompagnement", exact: true }));
      await expectMenusClosed(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});

const projectSections = [
  { menu: /Réalisations numériques/, hash: "realisations-numeriques", heading: /Des outils pensés/, legacy: ["plateformes"] },
  { menu: /Missions terrain/, hash: "missions-terrain", heading: /La technologie,/, legacy: ["mobilite", "supervision"] },
  { menu: /Innovations & MVP/, hash: "innovations", heading: /Les projets qui/, legacy: ["bazar-onloutou"] },
] as const;

/** La section demandée est atteinte : son titre de niveau 2 est visible sous l'en-tête fixe. */
async function expectSectionOpen(page: Page, section: (typeof projectSections)[number]) {
  const heading = page.locator(`#${section.hash}`).getByRole("heading", { level: 2, name: section.heading });
  await expect(heading).toBeVisible();
  await expectBelowHeader(page, heading);
}

test.describe("Projets — sections", () => {
  for (const section of projectSections) {
    test(`accès direct, actualisation et lien du menu : ${section.hash}`, async ({ page }) => {
      await page.goto(`/projets#${section.hash}`);
      await expectSectionOpen(page, section);

      await page.reload();
      await expectSectionOpen(page, section);

      await openHome(page);
      await clickMenuLink(page, "projets", section.menu);
      await expect(page).toHaveURL(new RegExp(`/projets#${section.hash}$`));
      await expectSectionOpen(page, section);
      await expectMenusClosed(page);
    });

    for (const legacy of section.legacy) {
      test(`ancienne ancre #${legacy} → section « ${section.hash} »`, async ({ page }) => {
        await page.goto(`/projets#${legacy}`);
        await expectSectionOpen(page, section);
        await page.reload();
        await expectSectionOpen(page, section);
      });
    }
  }

  test("depuis la page Projets : changement de section, Précédent / Suivant", async ({ page }) => {
    await page.goto("/projets#realisations-numeriques");
    await expectSectionOpen(page, projectSections[0]);
    await clickMenuLink(page, "projets", /Missions terrain/);
    await expect(page).toHaveURL(/#missions-terrain$/);
    await expectSectionOpen(page, projectSections[1]);
    await clickMenuLink(page, "projets", /Innovations & MVP/);
    await expect(page).toHaveURL(/#innovations$/);
    await expectSectionOpen(page, projectSections[2]);

    await waitScrollSettled(page);
    await page.goBack();
    await expect(page).toHaveURL(/#missions-terrain$/);
    await expect(page.locator("#missions-terrain").getByRole("heading", { level: 2 })).toBeInViewport();
    await waitScrollSettled(page);
    await page.goBack();
    await expect(page).toHaveURL(/#realisations-numeriques$/);
    await expect(page.locator("#realisations-numeriques").getByRole("heading", { level: 2 })).toBeInViewport();
    await waitScrollSettled(page);
    await page.goForward();
    await expect(page).toHaveURL(/#missions-terrain$/);
  });

  test("les trois entrées du menu Projets ont des destinations distinctes", () => {
    const menu = headerNavigation.find((item) => item.id === "projets")!;
    if (menu.type !== "menu") throw new Error("menu Projets introuvable");
    const hrefs = (menu.menu.cards ?? []).map((card) => card.href);
    expect(hrefs).toEqual(["/projets#realisations-numeriques", "/projets#missions-terrain", "/projets#innovations"]);
  });

  test("« Préparer mon brief » / « Parlons de votre projet » : accès direct puis actualisation", async ({ page }) => {
    await page.goto("/projets#brief-projet");
    const heading = page.locator("#brief-projet").getByRole("heading", { level: 2 }).first();
    await expectBelowHeader(page, heading);
    await expect(page.locator("#brief-projet form")).toBeInViewport();
    await page.reload();
    await expectBelowHeader(page, heading);
  });
});

test.describe("Équipements — Camions & engins, Outils & matériel", () => {
  const families = [
    {
      menu: /Camions & engins/,
      path: "/equipements/camions-engins",
      h1: /Camions, engins,\s*moyens spécialisés/,
      category: /Levage/,
      custom: "Demander un camion ou un engin spécifique",
      form: "demande-camion-engin",
      formText: "Préparons votre demande de location.",
    },
    {
      menu: /Outils & matériel/,
      path: "/equipements/outils-materiels",
      h1: /Le matériel\s*qu’il vous faut/,
      category: /Énergie & éclairage/,
      custom: "Demander un matériel spécifique",
      form: "demande-materiel",
      formText: "Votre besoin, en quelques détails.",
    },
  ] as const;

  for (const family of families) {
    test(`${family.path} : entrée du menu, catégories et demande hors catalogue`, async ({ page }) => {
      await openHome(page);
      await clickMenuLink(page, "equipements", family.menu);
      await expect(page).toHaveURL(new RegExp(`${family.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(family.h1);
      await expectMenusClosed(page);

      // une catégorie applique un filtre et ouvre son contenu
      await expect(async () => {
        await page.getByRole("button", { name: family.category }).first().click();
        await expect(page.locator("[aria-pressed='true']").first()).toContainText(family.category, { timeout: 1500 });
      }).toPass({ timeout: 15_000 });

      // un matériel hors catalogue conduit à la demande spécifique, formulaire visible
      await page.getByRole("link", { name: family.custom }).first().click();
      await expect(page).toHaveURL(new RegExp(`#${family.form}$`));
      const form = page.locator(`#${family.form}`);
      await expect(form).toContainText(family.formText);
      await expectBelowHeader(page, form.getByRole("heading", { level: 2 }));
    });
  }

  test("le fil d'Ariane de Camions & engins revient à /equipements, jamais à une autre famille", async ({ page }) => {
    await page.goto("/equipements/camions-engins");
    const crumb = page.getByRole("navigation", { name: /Fil d.Ariane/i }).getByRole("link");
    const hrefs = await crumb.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs).toEqual(["/", "/equipements"]);
  });

  test("le hub /equipements envoie « Camions & engins » vers sa propre page", async ({ page }) => {
    await page.goto("/equipements");
    const hrefs = await page.locator("#univers-equipements a[href^='/equipements/']").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs).toContain("/equipements/camions-engins");
    expect(hrefs).toContain("/equipements/outils-materiels");
    expect(hrefs.filter((href) => href === "/equipements/vehicules")).toHaveLength(1);
  });
});

test.describe("Clavier et réduction des animations", () => {
  test("clavier : ouvrir Expertise, parcourir et valider un lien", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "clavier desktop");
    await openHome(page);
    await expect(async () => {
      await trigger(page, "expertise").focus();
      await page.keyboard.press("Enter");
      await expect(trigger(page, "expertise")).toHaveAttribute("aria-expanded", "true", { timeout: 800 });
    }).toPass({ timeout: 15_000 });
    const links = page.locator("#mega-expertise").getByRole("link");
    await page.keyboard.press("ArrowDown");
    await expect(links.filter({ hasText: "Découvrir l'expertise" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(links.filter({ hasText: "Cadrage du projet" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(links.filter({ hasText: "Déploiement terrain" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(links.filter({ hasText: "Installation & paramétrage" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/expertise#installation-parametrage$/);
    await expectBelowHeader(page, page.locator("#installation-parametrage").getByRole("heading", { level: 3 }));
  });

  test("prefers-reduced-motion : ancres atteintes sans défilement animé", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/projets#supervision");
    await expectSectionOpen(page, projectSections[1]);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    await page.goto("/expertise#deploiement");
    await expectBelowHeader(page, page.locator("#deploiement").getByRole("heading", { name: "Déploiement terrain", exact: true }));
  });
});

test.describe("Partenaires — entrées du menu", () => {
  const entries = [
    { menu: /Nos modes de collaboration/, path: "/partenaires", hash: "profils-partenaires", heading: "Quelle place souhaitez-vous prendre ?" },
    { menu: /Présenter une proposition/, path: "/devenir-partenaire", hash: "preparer-proposition", heading: "Votre proposition, en quelques points." },
    { menu: /Voir les partenariats/, path: "/partenaires", hash: "", heading: "Votre savoir-faire." },
    { menu: /Devenir partenaire/, path: "/devenir-partenaire", hash: "", heading: "Présentez ce que" },
  ];
  for (const entry of entries) {
    test(`${entry.menu} : ${entry.path}${entry.hash ? `#${entry.hash}` : ""}`, async ({ page }) => {
      await openHome(page);
      await clickMenuLink(page, "partenaires", entry.menu);
      await expect(page).toHaveURL(new RegExp(`${entry.path}${entry.hash ? `#${entry.hash}` : ""}$`));
      const target = entry.hash
        ? page.locator(`#${entry.hash}`).getByRole("heading", { level: 2 }).first()
        : page.getByRole("heading", { level: 1 });
      await expect(target).toContainText(entry.heading);
      if (entry.hash) await expectBelowHeader(page, target);
      await waitScrollSettled(page);
      await expectMenusClosed(page);
    });
  }

  test("l’ancienne ancre /partenaires#preparer-proposition atteint le bandeau de proposition", async ({ page }) => {
    await page.goto("/partenaires#preparer-proposition");
    await expectBelowHeader(page, page.getByRole("heading", { level: 2, name: "Une capacité à proposer ?" }));
  });
});

test.describe("Partenaires — pages de profils du menu", () => {
  const profiles = [
    { menu: /^Fournisseurs$/, path: "/partenaires/fournisseurs", heading: "Vos équipements" },
    { menu: /Partenaires technologiques/, path: "/partenaires/technologiques", heading: "Relions vos" },
  ];
  for (const entry of profiles) {
    test(`${entry.menu} : ${entry.path}`, async ({ page }) => {
      await openHome(page);
      await clickMenuLink(page, "partenaires", entry.menu);
      await expect(page).toHaveURL(new RegExp(`${entry.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(entry.heading);
      await waitScrollSettled(page);
      await expectMenusClosed(page);
    });
  }

  test("« Livraison & coordination » : la page livraison est le formulaire de demande, la candidature mène à /devenir-livreur", async ({ page }) => {
    await page.goto("/livraison");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Un besoin à");
    await expect(page.locator("#demande-livraison")).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Devenir livreur partenaire/ })).toHaveAttribute("href", "/devenir-livreur");
  });
});
