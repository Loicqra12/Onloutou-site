import { test, expect, type Page } from "@playwright/test";

const URL = "/projets";
const WHATSAPP = "https://wa.me/2250554137777";

async function openPage(page: Page, hash = "") {
  await page.goto(URL + hash, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#prj-hero-title")).toBeVisible();
  // Attendre l'hydratation React avant d'interagir avec le formulaire et l'accordéon.
  await page.waitForFunction(() => {
    const el = document.querySelector(".prj-faq__button");
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

test.describe("page Projets", () => {
  test("écran 1 : héros, barre 01/02/03 et ChapeChape Résidence", async ({ page }) => {
    await openPage(page);
    await expect(page.locator("main h1")).toHaveCount(1);
    const title = page.locator("#prj-hero-title");
    for (const line of ["Des projets", "concrets.", "Des idées qui", "prennent forme."]) await expect(title).toContainText(line);
    await expect(page.locator(".prj-hero .prj-eyebrow")).toHaveText("PROJETS & RÉALISATIONS");
    await expect(page.locator(".prj-hero__lead")).toHaveText(
      "Plateformes numériques, équipements connectés et initiatives ONLOUTOU : découvrez ce que nous construisons et déployons.",
    );
    await expect(page.locator(".prj-hero").getByRole("link", { name: /Explorer les réalisations/ })).toHaveAttribute("href", "#realisations-numeriques");
    await expect(page.locator(".prj-hero").getByRole("link", { name: /Présenter mon projet/ })).toHaveAttribute("href", "#brief-projet");
    await expect(page.getByText("Illustration d’une situation de travail.")).toBeVisible();

    const bar = page.getByRole("navigation", { name: "Accès rapide aux sections" });
    await expect(bar.getByRole("link")).toHaveCount(3);
    for (const [n, label, href] of [
      ["01", "Réalisations numériques", "#realisations-numeriques"],
      ["02", "Missions terrain", "#missions-terrain"],
      ["03", "Innovations & MVP", "#innovations"],
    ]) {
      const link = bar.getByRole("link", { name: new RegExp(label.replace("&", "\\&")) });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toContainText(n);
    }

    const featured = page.locator("#chapechape-residence");
    await expect(featured.locator(".prj-eyebrow").first()).toHaveText("PROJET ONLOUTOU");
    await expect(featured.getByRole("heading", { level: 2 })).toHaveText("ChapeChape Résidence");
    await expect(featured).toContainText("Projet existant");
    await expect(featured).toContainText("Un écosystème numérique pour la location et la gestion de résidences.");
    for (const [t, d] of [
      ["Le besoin", "Faciliter la recherche d’un logement et la gestion des résidences."],
      ["Le projet", "Un site, des applications et un espace de gestion réunis autour d’un même parcours."],
      ["L’équipe", "Projet porté par ONLOUTOU avec l’équipe ChapeChape Résidence."],
    ]) {
      const point = featured.locator(".prj-point", { has: page.getByRole("heading", { level: 3, name: t, exact: true }) });
      await expect(point).toContainText(d);
    }
    for (const label of ["Web", "Applications", "Gestion"]) await expect(featured.locator(".prj-tile", { hasText: label })).toHaveCount(1);
    await expect(featured.getByRole("link", { name: /Découvrir ChapeChape Résidence/ })).toHaveAttribute("href", "#chapechape-residence");
    await expect(featured).toContainText("Chaque projet est présenté selon son périmètre et son avancement.");
    await expect(featured).toContainText("Visuel de présentation — interface illustrative.");
  });

  test("écran 2 : KPS Services, CNDPEP-CI et bandeau expertise", async ({ page }) => {
    await openPage(page);
    const section = page.locator("#realisations-numeriques");
    await expect(section.locator(".prj-eyebrow").first()).toHaveText("RÉALISATIONS NUMÉRIQUES");
    await expect(section.getByRole("heading", { level: 2 })).toContainText("Des outils pensés");
    await expect(section.getByRole("heading", { level: 2 })).toContainText("pour ceux qui les utilisent.");
    await expect(section).toContainText("Sites, interfaces et espaces de gestion : des réalisations menées avec l’équipe ChapeChape Résidence.");

    const kps = page.locator("#kps-services");
    await expect(kps).toContainText("SERVICES AUX ENTREPRISES");
    await expect(kps.getByRole("heading", { level: 3 })).toHaveText("KPS Services");
    await expect(kps).toContainText("Un écosystème numérique au service du nettoyage professionnel.");
    await expect(kps).toContainText("Site web et tableau de bord.");
    await expect(kps).toContainText("Avec l’équipe ChapeChape Résidence.");
    for (const chip of ["Site web", "Tableau de bord"]) await expect(kps.locator(".prj-chip", { hasText: chip })).toHaveCount(1);
    const visit = kps.getByRole("link", { name: /Visiter le site/ });
    await expect(visit).toHaveAttribute("href", "https://kpsservices.fr");
    await expect(visit).toHaveAttribute("target", "_blank");
    await expect(visit).toHaveAttribute("rel", /noopener/);
    await expect(kps).toContainText("kpsservices.fr");

    const cndpep = page.locator("#cndpep-ci");
    await expect(cndpep).toContainText("INSTITUTIONNEL");
    await expect(cndpep.getByRole("heading", { level: 3 })).toHaveText("CNDPEP-CI");
    await expect(cndpep).toContainText("Chambre nationale des détectives privés et enquêteurs professionnels de Côte d’Ivoire.");
    await expect(cndpep).toContainText("Site web et espace de gestion.");
    for (const chip of ["Site institutionnel", "Gestion"]) await expect(cndpep.locator(".prj-chip", { hasText: chip })).toHaveCount(1);

    const band = section.locator(".prj-band--dark");
    await expect(band).toContainText("Derrière chaque interface, une méthode.");
    await expect(band.getByRole("link", { name: /Découvrir notre expertise/ })).toHaveAttribute("href", "/expertise");
  });

  test("écran 3 : missions terrain, quatre cartes et bandeau", async ({ page }) => {
    await openPage(page);
    const section = page.locator("#missions-terrain");
    await expect(section.locator(".prj-eyebrow").first()).toHaveText("MISSIONS TERRAIN");
    const h2 = section.getByRole("heading", { level: 2 });
    for (const line of ["La technologie,", "au plus près", "du terrain."]) await expect(h2).toContainText(line);
    await expect(section).toContainText("Géolocalisation, installation et supervision : des interventions adaptées aux usages de chaque flotte.");
    for (const chip of ["GPS", "Installation", "Supervision"]) await expect(section.locator(".prj-missions__chips li", { hasText: chip })).toHaveCount(1);
    await expect(section).toContainText("Photo d’illustration.");

    const cases = [
      ["bni", "SECTEUR BANCAIRE", "Banque BNI", "Accompagner le suivi des véhicules en leasing.", "Fourniture, installation et paramétrage de dispositifs GPS. Supervision et alertes.", "Véhicules en leasing et flotte corporate."],
      ["baci", "SECTEUR BANCAIRE", "Banque BACI", "Contribuer à la sécurisation des actifs roulants.", "Géolocalisation et suivi des véhicules mis à disposition des clients.", "Flotte en leasing."],
      ["cogitech", "BTP & INDUSTRIE", "Cogitech", "Adapter le suivi aux contraintes du chantier.", "Gestion de flotte et suivi GPS sur plusieurs sites d’intervention.", "Véhicules légers et utilitaires."],
      ["talentys", "SERVICES & LOGISTIQUE", "Talenty’s", "Accompagner le pilotage de l’activité terrain.", "Visibilité en temps réel, accompagnement à l’optimisation des tournées et preuve d’activité.", "Livraison et logistique."],
    ];
    await expect(section.locator(".prj-case")).toHaveCount(4);
    for (const [id, kicker, title, text, intervention, perimeter] of cases) {
      const card = page.locator(`#${id}`);
      await expect(card).toContainText(kicker);
      await expect(card.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
      await expect(card).toContainText(text);
      await expect(card).toContainText("Intervention");
      await expect(card).toContainText(intervention);
      await expect(card).toContainText("Périmètre");
      await expect(card).toContainText(perimeter);
    }

    const band = section.locator(".prj-band--yellow");
    await expect(band).toContainText("Un besoin similaire pour votre flotte ?");
    await expect(band).toContainText("Présentez-nous votre contexte, vos usages et vos contraintes.");
    await expect(band.getByRole("link", { name: /Parler de mon projet/ })).toHaveAttribute("href", "#brief-projet");
    await expect(band.getByRole("link", { name: /Notre expertise terrain/ })).toHaveAttribute("href", "/expertise");
  });

  test("écran 4 : innovations et MVP", async ({ page }) => {
    await openPage(page);
    const section = page.locator("#innovations");
    await expect(section.locator(".prj-eyebrow").first()).toHaveText("INNOVATIONS & MVP");
    await expect(section.getByRole("heading", { level: 2 })).toContainText("Les projets qui");
    await expect(section.getByRole("heading", { level: 2 })).toContainText("prennent forme.");
    await expect(section).toContainText("Des initiatives ONLOUTOU à différents stades de développement.");
    await expect(section).toContainText("MVP : une première version du produit, avant son évolution.");

    for (const [id, title, subtitle, text] of [
      ["apa", "APA", "Allo Pièce Auto", "Un projet de plateforme pour rechercher des pièces automobiles et faciliter sa mise en relation avec les besoins des clients."],
      ["ovpr", "OVPR", "Objets volés, perdus ou retrouvés", "Un projet pour faciliter la déclaration, la recherche et la restitution d’objets."],
    ]) {
      const card = page.locator(`#${id}`);
      await expect(card).toContainText("MVP");
      await expect(card.getByRole("heading", { level: 3, name: title, exact: true })).toBeVisible();
      await expect(card).toContainText(subtitle);
      await expect(card).toContainText(text);
      for (const chip of ["Site web", "Mobile", "Tableau de bord"]) await expect(card.locator(".prj-chip", { hasText: chip })).toHaveCount(1);
      await expect(card.getByRole("link", { name: /Voir les aperçus/ })).toHaveAttribute("href", `#${id}`);
      await expect(card).toContainText("Aperçus du MVP");
    }

    const sidsun = page.locator("#sidsun");
    await expect(sidsun).toContainText("EN DÉVELOPPEMENT");
    await expect(sidsun.getByRole("heading", { level: 3, name: "Sidsun", exact: true })).toBeVisible();
    await expect(sidsun).toContainText("Gestion de restaurant");
    await expect(sidsun).toContainText("Un projet nourri par les besoins du Kiosque ONLOUTOU pour accompagner la gestion de la restauration.");
    const carburant = page.locator("#carburant");
    await expect(carburant).toContainText("À VENIR");
    await expect(carburant.getByRole("heading", { level: 3, name: "Carburant à la demande", exact: true })).toBeVisible();
    await expect(carburant).toContainText("Demander du carburant et être rejoint par un véhicule de ravitaillement : un projet de service mobile.");
  });

  test("photos chargées, ordre des écrans et absence de débordement", async ({ page }) => {
    await openPage(page);
    await page.evaluate(() => document.querySelectorAll<HTMLImageElement>(".prj-page img").forEach((img) => (img.loading = "eager")));
    const broken = await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(".prj-page img"));
      await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = r; img.onerror = r; }))));
      return imgs.filter((img) => img.naturalWidth === 0).map((img) => img.src);
    });
    expect(broken).toEqual([]);

    const tops = await page.evaluate(() =>
      [".prj-hero", ".prj-bar__list", "#chapechape-residence", "#realisations-numeriques", "#missions-terrain", "#innovations", "#brief-projet", ".prj-faq"].map(
        (s) => Math.round(document.querySelector(s)!.getBoundingClientRect().top + window.scrollY),
      ),
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    expect(new Set(tops).size).toBe(tops.length);

    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    const inner = await page.evaluate(() => {
      const root = document.querySelector(".prj-page")!.getBoundingClientRect();
      return Array.from(document.querySelectorAll(".prj-page *"))
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > root.right + 1 || r.left < root.left - 1); })
        .map((el) => el.className.toString().slice(0, 40));
    });
    expect(inner).toEqual([]);
  });

  for (const [label, href, id] of [
    ["Réalisations numériques", "#realisations-numeriques", "realisations-numeriques"],
    ["Missions terrain", "#missions-terrain", "missions-terrain"],
    ["Innovations & MVP", "#innovations", "innovations"],
  ]) {
    test(`barre 01/02/03 : « ${label} » défile vers sa section`, async ({ page }) => {
      await openPage(page);
      await page.getByRole("navigation", { name: "Accès rapide aux sections" }).locator(`a[href="${href}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/projets#${id}$`));
      await expectBelowHeader(page, `#${id} h2`);
    });
  }

  test("« Explorer les réalisations » et « Présenter mon projet » (héros)", async ({ page }) => {
    await openPage(page);
    await page.locator(".prj-hero").getByRole("link", { name: /Explorer les réalisations/ }).click();
    await expect(page).toHaveURL(/#realisations-numeriques$/);
    await expectBelowHeader(page, "#realisations-numeriques h2");
    await page.locator("a[href='#brief-projet']").first().click();
    await expect(page).toHaveURL(/#brief-projet$/);
    await expectBelowHeader(page, "#brief-projet h2");
    await expect(page.locator("#brief-projet form")).toBeInViewport();
  });

  test("« Notre expertise terrain » et « Découvrir notre expertise » mènent à /expertise", async ({ page }) => {
    await openPage(page);
    await page.locator(".prj-band--yellow").getByRole("link", { name: /Notre expertise terrain/ }).click();
    await expect(page).toHaveURL(/\/expertise$/);
    await openPage(page);
    await page.locator(".prj-band--dark").getByRole("link", { name: /Découvrir notre expertise/ }).click();
    await expect(page).toHaveURL(/\/expertise$/);
  });

  test("« Voir les aperçus » et « Découvrir ChapeChape Résidence » restent sur la page, sur leur carte", async ({ page }) => {
    await openPage(page);
    await page.locator("#ovpr").getByRole("link", { name: /Voir les aperçus/ }).click();
    await expect(page).toHaveURL(/\/projets#ovpr$/);
    await expectBelowHeader(page, "#ovpr h3");
    await page.locator("#chapechape-residence").getByRole("link", { name: /Découvrir ChapeChape Résidence/ }).click();
    await expect(page).toHaveURL(/\/projets#chapechape-residence$/);
  });

  test("écran 5 : formulaire, panneau « Votre message » et validation", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __opened: string[] }).__opened = [];
      window.open = ((url?: string | URL) => {
        (window as unknown as { __opened: string[] }).__opened.push(String(url));
        return null;
      }) as typeof window.open;
    });
    await openPage(page);
    const brief = page.locator("#brief-projet");
    await expect(brief.locator(".prj-eyebrow").first()).toHaveText("VOTRE PROJET");
    await expect(brief.getByRole("heading", { level: 2 })).toContainText("Parlons de ce que vous");
    await expect(brief.getByRole("heading", { level: 2 })).toContainText("voulez construire.");
    await expect(brief).toContainText("Un besoin précis ou une idée à clarifier ? Décrivez votre contexte pour préparer notre échange.");
    await expect(brief.getByRole("heading", { level: 3, name: "Présentez votre besoin" })).toBeVisible();

    // état initial du panneau noir
    const panel = brief.locator(".prj-panel");
    await expect(panel.getByRole("heading", { level: 3, name: "Votre message" })).toBeVisible();
    await expect(panel).toContainText("Votre récapitulatif apparaîtra ici après avoir renseigné le formulaire.");
    await expect(panel).toContainText("Une autre façon de nous contacter");
    await expect(panel.getByRole("link", { name: /Ouvrir la page Contact/ })).toHaveAttribute("href", "/contact");

    const radios = brief.getByRole("radio");
    await expect(radios).toHaveCount(3);
    for (const [i, name] of ["Projet numérique", "Mission terrain", "Autre besoin"].entries()) {
      await expect(brief.getByRole("radio", { name })).toBeVisible();
      await expect(radios.nth(i)).not.toBeChecked();
    }

    // champs obligatoires : message d'erreur, aucune ouverture
    await brief.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(brief.getByRole("alert")).toContainText("Merci de renseigner votre projet, votre nom");
    expect(await page.evaluate(() => (window as unknown as { __opened: string[] }).__opened)).toEqual([]);
    await expect(brief.getByLabel(/Décrivez votre projet/)).toHaveAttribute("aria-invalid", "true");
    await expect(brief.getByLabel(/^Nom/)).toHaveAttribute("aria-invalid", "true");

    // résumé en direct
    await brief.getByRole("radio", { name: "Mission terrain" }).check();
    await brief.getByLabel(/Décrivez votre projet/).fill("Suivre une flotte de 12 utilitaires.");
    await brief.getByLabel(/^Nom/).fill("Awa Koné");
    await brief.getByLabel("Organisation").fill("Transports Koné");
    await brief.getByLabel("Lieu du projet").fill("Abidjan");
    await brief.getByLabel("Échéance envisagée").fill("Fin d’année");
    await brief.getByLabel(/^Téléphone/).fill("07 12 34 56 78");
    const summary = panel.getByTestId("prj-summary");
    await expect(summary).toContainText("Besoin : Mission terrain");
    await expect(summary).toContainText("Projet : Suivre une flotte de 12 utilitaires.");
    await expect(summary).toContainText("Nom : Awa Koné");
    await expect(summary).toContainText("Organisation : Transports Koné");
    await expect(summary).toContainText("Lieu du projet : Abidjan");
    await expect(summary).toContainText("Échéance envisagée : Fin d’année");
    await expect(panel).not.toContainText("Votre récapitulatif apparaîtra ici");
    await expect(brief.getByRole("alert")).toHaveCount(0);

    // Enregistrement serveur, puis WhatsApp optionnel avec la référence
    await brief.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(brief.getByText(/Demande enregistrée\. Référence : ONL-/)).toBeVisible();
    const wa = brief.getByRole("link", { name: /WhatsApp/ });
    const href = (await wa.getAttribute("href")) ?? "";
    expect(href.startsWith(`${WHATSAPP}?text=`)).toBe(true);
    const text = decodeURIComponent(href.split("?text=")[1].replace(/\+/g, " "));
    expect(text).toContain("Bonjour ONLOUTOU, je souhaite présenter un projet.");
    expect(text).toContain("Besoin : Mission terrain");
    expect(text).toContain("Projet : Suivre une flotte de 12 utilitaires.");
    expect(text).toContain("Nom : Awa Koné");
    expect(text).toContain("Lieu du projet : Abidjan");
    expect(text).toContain("ONL-");
  });

  test("« Ouvrir la page Contact » mène à /contact", async ({ page }) => {
    await openPage(page);
    await page.locator(".prj-panel").getByRole("link", { name: /Ouvrir la page Contact/ }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("FAQ : quatre questions, première ouverte, une seule réponse à la fois", async ({ page }) => {
    await openPage(page);
    const faq = page.locator(".prj-faq");
    await expect(faq.locator(".prj-eyebrow")).toHaveText("FAQ");
    await expect(faq.getByRole("heading", { level: 2 })).toHaveText("Quelques réponses avant de commencer.");
    const buttons = faq.getByRole("button");
    await expect(buttons).toHaveCount(4);
    await expect(buttons.nth(0)).toHaveText("Mon projet n’est pas encore complètement défini.");
    await expect(buttons.nth(1)).toHaveText("Quelle différence entre une réalisation et un MVP ?");
    await expect(buttons.nth(2)).toHaveText("Comment découvrir les aperçus d’APA et d’OVPR ?");
    await expect(buttons.nth(3)).toHaveText("Où retrouver votre méthode de travail ?");
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
    await expect(faq).toContainText("Vous pouvez nous présenter le besoin, les usages envisagés et les contraintes déjà connues.");
    await expect(faq).toContainText("Ces éléments serviront de base à l’échange.");

    await buttons.nth(3).click();
    await expect(buttons.nth(3)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(faq.getByText("Vous pouvez nous présenter le besoin")).toBeHidden();
    await expect(faq.getByRole("link", { name: /Découvrir notre expertise/ })).toHaveAttribute("href", "/expertise");
    await buttons.nth(3).click();
    await expect(buttons.nth(3)).toHaveAttribute("aria-expanded", "false");
  });

  test("anciennes ancres : #plateformes, #mobilite, #supervision et #bazar-onloutou existent", async ({ page }) => {
    await openPage(page);
    for (const id of ["plateformes", "mobilite", "supervision", "bazar-onloutou"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });

  test("méga-menu Projets : trois entrées vers les trois sections", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Projets" }).hover();
    const menu = page.locator("#mega-projets");
    await expect(menu.getByRole("link", { name: "Vue d'ensemble" })).toHaveAttribute("href", "/projets");
    await expect(menu.getByRole("link", { name: /Réalisations numériques/ })).toHaveAttribute("href", "/projets#realisations-numeriques");
    await expect(menu.getByRole("link", { name: /Missions terrain/ })).toHaveAttribute("href", "/projets#missions-terrain");
    await expect(menu.getByRole("link", { name: /Innovations & MVP/ })).toHaveAttribute("href", "/projets#innovations");
  });
});