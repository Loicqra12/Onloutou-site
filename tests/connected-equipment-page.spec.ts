import { test, expect, type Page } from "@playwright/test";

const URL = "/equipements/equipements-connectes";

async function openPage(page: Page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#cnx-hero-title")).toBeVisible();
  await page.locator("#dispositifs").scrollIntoViewIfNeeded();
  await expect(page.locator(".cnx-card")).toHaveCount(4);
  // Attendre l’hydratation React avant d’interagir avec les champs contrôlés.
  await page.waitForFunction(() => {
    const el = document.querySelector(".cnx-card");
    return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
  });
}

test.describe("page équipements connectés", () => {
  test("hero, dispositifs, chaîne et éléments pratiques", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const title = page.locator("#cnx-hero-title");
    await expect(title).toContainText("Connectez vos");
    await expect(title).toContainText("équipements à une");
    await expect(title).toContainText("information utile.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator(".cnx-hero .cnx-kicker")).toHaveText("Équipements connectés");
    await expect(page.locator(".cnx-hero__lead")).toContainText("Traceurs, balises et capteurs : construisons la configuration adaptée à vos actifs et à vos usages.");
    await expect(page.getByRole("link", { name: /Étudier mon équipement/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Explorer les dispositifs/ })).toBeVisible();

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
      await expect(page.locator("#mega-equipements a", { hasText: "Équipements connectés" }).first()).toHaveAttribute("href", "/equipements/equipements-connectes");
      await page.mouse.move(10, 600);
    }

    const devices = page.locator("#dispositifs");
    await expect(devices.getByRole("heading", { level: 2 })).toHaveText("Quel dispositif pour quel actif ?");
    for (const [n, t] of [
      ["Traceurs filaires", "Véhicules et équipements alimentés."],
      ["Balises autonomes", "Actifs mobiles selon autonomie requise."],
      ["Boîtiers embarqués", "Données selon véhicule et compatibilité."],
      ["Capteurs & identification", "Mesures ou événements selon le projet."],
    ]) {
      const card = devices.locator(".cnx-card", { hasText: n });
      await expect(card).toContainText(t);
      await expect(card).toContainText("Étudier cette configuration");
    }
    await expect(devices).toContainText("Références, compatibilités et fonctions à confirmer.");

    const chain = page.locator("#architecture-connectee");
    await expect(chain.getByRole("heading", { level: 2 })).toHaveText("Un équipement connecté fait partie d’un ensemble.");
    const steps = chain.getByRole("listitem").filter({ has: page.locator(".cnx-chain__card") });
    await expect(steps).toHaveCount(5);
    for (const [t, d] of [
      ["L’actif", "Véhicule, engin ou matériel."],
      ["Le dispositif", "Boîtier, balise ou capteur."],
      ["La connexion", "Réseau et transmission."],
      ["La plateforme", "Consultation et configuration."],
      ["L’exploitation", "Suivi, alertes et rapports."],
    ]) {
      await expect(steps.filter({ hasText: t })).toContainText(d);
    }
    const practical = page.locator(".cnx-practical");
    await expect(practical).toContainText("Quelques éléments pratiques à prévoir");
    for (const t of ["Alimentation", "Couverture réseau", "Informations attendues", "Vous avez déjà du matériel ?", "Étudions sa compatibilité"]) {
      await expect(practical).toContainText(t);
    }
  });

  test("informations exploitables, maquette et étapes de mise en place", async ({ page }) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const info = page.locator(".cnx-info");
    await expect(info.getByRole("heading", { level: 2 })).toContainText("Du matériel installé aux informations exploitables.");
    await expect(info).toContainText("Nos solutions d’équipements connectés transforment vos actifs en sources d’informations fiables");
    for (const t of ["Consulter les actifs", "Comprendre les événements", "Préparer les rapports"]) await expect(info.locator(".cnx-info__rows")).toContainText(t);
    const dash = info.getByRole("figure", { name: "Aperçu illustratif d’un tableau de suivi d’actifs" });
    await expect(dash).toContainText("Suivi de mes actifs");
    await expect(dash).toContainText("Événements récents");
    await expect(dash.locator(".cnx-dash__events li")).toHaveCount(4);
    for (const t of ["Mouvement détecté", "Sortie de zone", "Moteur démarré", "Arrêt prolongé", "Abidjan"]) await expect(dash).toContainText(t);
    await expect(dash).toContainText("Aperçu illustratif — données fictives");
    await expect(info).toContainText("Les fonctions dépendent du dispositif, de l’installation, de la connectivité et du paramétrage.");

    const steps = page.locator("#mise-en-place");
    await expect(steps.getByRole("heading", { level: 2 })).toHaveText("Une mise en place, étape par étape.");
    await expect(steps.getByRole("listitem").filter({ has: page.locator(".cnx-steps__card") })).toHaveCount(6);
    for (const [t, d] of [
      ["Recenser", "Identifiez vos actifs et vos besoins de suivi."],
      ["Qualifier", "Évaluez les usages et les contraintes de votre activité."],
      ["Sélectionner", "Choisissez la solution la plus adaptée à vos équipements."],
      ["Installer", "Nous planifions et réalisons l’installation sur site."],
      ["Configurer", "Paramétrez les alertes, les zones et les accès aux données."],
      ["Accompagner", "Nos équipes vous forment et restent à vos côtés."],
    ]) {
      await expect(steps.locator(".cnx-steps__card", { hasText: t })).toContainText(d);
    }
  });

  test("dispositifs et « déjà du matériel » alimentent le formulaire", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-connectee");

    await page.locator("#dispositifs .cnx-card", { hasText: "Balises autonomes" }).click();
    await expect(page).toHaveURL(/#demande-connectee$/);
    await expect(form.getByRole("radio", { name: "Matériel mobile" })).toBeChecked();
    await expect(page.locator("#dispositifs .cnx-card", { hasText: "Balises autonomes" })).toHaveAttribute("aria-pressed", "true");
    await expect(form.locator(".cnx-summary__img")).toHaveAttribute("data-image", "balise-autonome");
    await expect(form.locator('[data-row="compatibilite"]')).toContainText("Balises autonomes · Matériel mobile");

    await page.locator("#dispositifs .cnx-card", { hasText: "Capteurs & identification" }).click();
    await expect(form.getByRole("radio", { name: "Installation fixe" })).toBeChecked();
    await expect(form.locator(".cnx-summary__img")).toHaveAttribute("data-image", "capteurs-identification");

    await page.locator(".cnx-practical__cta").click();
    await expect(page).toHaveURL(/#demande-connectee$/);
    await expect(form.getByRole("radio", { name: "Oui" })).toBeChecked();
    await expect(form.locator('[data-row="installation"]')).toContainText("Dispositif déjà installé : Oui");
  });

  test("formulaire, récapitulatif en direct et WhatsApp", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-connectee");
    const summary = form.getByRole("complementary", { name: "Récapitulatif à vérifier avant l’envoi." });
    await expect(form.getByRole("heading", { level: 2 })).toHaveText("Parlez-nous de vos actifs.");
    await expect(form).toContainText("Décrivez votre besoin et recevez une réponse adaptée de nos équipes.");
    await expect(summary).toContainText("Les points à valider pour un traitement rapide et adapté.");
    for (const t of ["Compatibilité", "Installation", "Connectivité", "Périmètre de service", "Valider la couverture réseau et les moyens de transmission des données."]) {
      await expect(summary).toContainText(t);
    }
    for (const a of ["Véhicule", "Moto", "Camion ou engin", "Matériel mobile", "Installation fixe", "Autre"]) {
      await expect(form.getByRole("radio", { name: a, exact: true })).toBeVisible();
    }

    await form.getByRole("radio", { name: "Camion ou engin" }).check({ force: true });
    await form.getByLabel("Quantité").fill("12");
    await form.getByLabel("Zone d’utilisation").fill("Yopougon");
    await form.getByLabel("Alimentation disponible").selectOption("Batterie ou autonomie requise");
    await form.getByRole("radio", { name: "Non" }).check({ force: true });
    await form.getByLabel("Position").check({ force: true });
    await form.getByLabel("Alertes").check({ force: true });
    await form.getByLabel("Informations attendues et contraintes").fill("Suivi des engins sur deux chantiers");
    await expect(summary.locator('[data-row="compatibilite"]')).toContainText("Camion ou engin");
    await expect(summary.locator('[data-row="perimetre"]')).toContainText("Yopougon · Quantité : 12");
    await expect(summary.locator('[data-row="connectivite"]')).toContainText("Suivi : Position, Alertes");
    await expect(form.locator(".cnx-summary__img")).toHaveAttribute("data-image", "boitier-embarque");

    await form.getByRole("button", { name: /Enregistrer mon projet/ }).click();
    await expect(form.getByRole("alert")).toContainText("Indiquez votre nom");
    await form.getByLabel("Nom", { exact: true }).fill("Awa Koné");
    await form.getByLabel("Téléphone").fill("0707070707");
    await form.getByRole("button", { name: /Enregistrer mon projet/ }).click();

    const ready = form.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(ready).toBeVisible();
    const href = (await ready.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const text = decodeURIComponent(href.split("?text=")[1].replace(/\+/g, " "));
    expect(text).toContain("Type d’actif : Camion ou engin");
    expect(text).toContain("Quantité : 12");
    expect(text).toContain("Zone d’utilisation : Yopougon");
    expect(text).toContain("Alimentation disponible : Batterie ou autonomie requise");
    expect(text).toContain("Dispositif déjà installé : Non");
    expect(text).toContain("Informations à suivre : Position, Alertes");
    expect(text).toContain("Informations attendues et contraintes : Suivi des engins sur deux chantiers");
    expect(text).toContain("Nom : Awa Koné");
    expect(text).toContain("Téléphone : 0707070707");

    const band = page.getByRole("link", { name: /Échanger sur mon projet/ });
    expect(decodeURIComponent(((await band.getAttribute("href")) ?? "").split("?text=")[1].replace(/\+/g, " "))).toContain("Type d’actif : Camion ou engin");
  });

  test("FAQ, solutions associées, bandeau et ancres", async ({ page, request }) => {
    await openPage(page);
    const faq = page.locator("#faq");
    await expect(faq.getByRole("heading", { level: 2, name: "Questions fréquentes." })).toBeVisible();
    const q1 = faq.getByRole("button", { name: /Peut-on utiliser un équipement déjà installé/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await expect(faq).toContainText("La compatibilité se vérifie selon le matériel, ses protocoles et la solution envisagée.");
    const q2 = faq.getByRole("button", { name: /Tous les actifs remontent-ils les mêmes données/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(faq.getByRole("button", { name: /L’installation et la formation sont-elles incluses/ })).toBeVisible();

    await expect(faq.getByRole("heading", { level: 2, name: "Nos solutions associées." })).toBeVisible();
    for (const [n, href] of [
      ["Géolocalisation", "/solutions/geolocalisation"],
      ["Gestion de flotte", "/solutions/gestion-de-flotte"],
      ["Sécurisation des actifs", "/solutions/securisation-actifs"],
    ]) {
      await expect(faq.getByRole("link", { name: new RegExp(n) })).toHaveAttribute("href", href);
    }
    await expect(faq).toContainText("Suivez vos actifs en temps réel et optimisez vos déplacements.");

    const band = page.locator(".cnx-band");
    await expect(band).toContainText("Relions vos équipements à vos besoins.");
    await expect(band).toContainText("Nos experts vous accompagnent pour trouver la solution la plus adaptée à vos enjeux.");

    const html = await (await request.get(URL)).text();
    for (const id of ["dispositifs", "architecture-connectee", "mise-en-place", "demande-connectee"]) expect(html).toContain(`id="${id}"`);
  });

  test("hauteurs égales et aucun débordement", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#cnx-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    const form = await page.locator(".cnx-form").boundingBox();
    const summary = await page.locator(".cnx-summary").boundingBox();
    expect(Math.abs(form!.height - summary!.height)).toBeLessThanOrEqual(1);
    for (const sel of [".cnx-card", ".cnx-steps__card", ".cnx-scard"]) {
      const hs = await page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(new Set(hs).size, sel).toBe(1);
    }
  });
});
