import { test, expect, type Page } from "@playwright/test";

const URL = "/equipements/motos";

async function openPage(page: Page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#mop-hero-title")).toBeVisible();
  await page.locator("#profils-motos").scrollIntoViewIfNeeded();
  await expect(page.locator(".mop-card")).toHaveCount(3);
  // Attendre l’hydratation React avant d’interagir avec les champs contrôlés.
  await page.waitForFunction(() => {
    const el = document.querySelector(".mop-card");
    return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
  });
}

test.describe("page motos et deux-roues", () => {
  test("hero, recherche, usages, bloc quotidien et bandeau", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const title = page.locator("#mop-hero-title");
    await expect(title).toContainText("Votre mobilité,");
    await expect(title).toContainText("au rythme");
    await expect(title).toContainText("du terrain.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator(".mop-hero .mop-kicker")).toHaveText("Motos & deux-roues");
    await expect(page.locator(".mop-hero__lead")).toContainText("choisissez le profil de deux-roues à étudier pour votre activité.");

    const search = page.getByRole("search", { name: "Définir mon besoin de deux-roues" });
    await expect(search.getByRole("radio", { name: "Location" })).toBeChecked();
    await expect(search.getByLabel("Type d’usage")).toBeVisible();
    await expect(search.getByLabel("Ville d’utilisation")).toBeVisible();
    await expect(search.getByLabel("Durée d’utilisation")).toBeVisible();
    await expect(search.getByRole("button", { name: /Définir mon besoin/ })).toBeVisible();
    await expect(search).toContainText("Modèles, équipements et disponibilités à confirmer.");

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Articles & équipements" }).hover();
      await expect(page.locator("#mega-equipements a", { hasText: "Motos & deux-roues" }).first()).toHaveAttribute("href", "/equipements/motos");
      await page.mouse.move(10, 600);
    }

    const profiles = page.locator("#profils-motos");
    await expect(profiles).toContainText("Nos catégories de deux-roues");
    await expect(profiles.getByRole("heading", { level: 2 })).toContainText("Trois usages. Des besoins différents.");
    for (const [n, t] of [
      ["Mobilité urbaine", "Déplacements professionnels et trajets de proximité."],
      ["Livraison & tournées", "Organisation des trajets et transport de petites charges."],
      ["Interventions terrain", "Déplacements d’équipes et missions de service."],
    ]) {
      const card = profiles.locator(".mop-card", { hasText: n });
      await expect(card).toContainText(t);
      await expect(card).toContainText("Étudier ce besoin");
    }

    const daily = page.locator(".mop-daily");
    await expect(daily.getByRole("heading", { level: 2 })).toContainText("Le bon choix commence par votre quotidien.");
    for (const c of ["Fréquence & distance", "Charge & rangement", "Terrain & autonomie", "Conducteur & équipements"]) {
      await expect(daily.locator(".mop-daily__cards")).toContainText(c);
    }
    await expect(daily).toContainText("Vos trajets, votre rythme et vos zones d’intervention.");
    await expect(page.locator(".mop-banner")).toContainText("Un modèle spécifique ou plusieurs deux-roues à équiper ?");
    await expect(page.locator(".mop-banner")).toContainText("Décrire mon besoin");
  });

  test("préparation de mission : texte et checklist en six étapes", async ({ page }) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const prep = page.locator(".mop-prep");
    await expect(prep.getByRole("heading", { level: 2 })).toContainText("Préparer la mission avant de prendre la route.");
    await expect(prep).toContainText("Une organisation claire pour des déplacements efficaces");
    const steps = prep.getByRole("list", { name: "Checklist de préparation de mission" }).getByRole("listitem");
    await expect(steps).toHaveCount(6);
    for (const [t, d] of [
      ["Mission définie", "Objectifs et contraintes identifiés."],
      ["Informations vérifiées", "Documents et autorisations à jour."],
      ["Véhicule préparé", "Contrôles et équipements en place."],
      ["Charge contrôlée", "Rangement et fixation sécurisés."],
      ["Conducteur équipé", "Casque, gants et équipements adaptés."],
      ["Départ confirmé", "Tout est prêt pour la mission."],
    ]) {
      await expect(steps.filter({ hasText: t })).toContainText(d);
    }
    await expect(prep).toContainText("Équipements, accompagnement et responsabilités selon la proposition retenue.");
  });

  test("recherche du hero et usages alimentent le formulaire", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-moto");
    const hero = page.getByRole("search", { name: "Définir mon besoin de deux-roues" });

    await hero.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await hero.locator("label.mop-mode", { hasText: "Achat" }).click();
    await hero.getByLabel("Type d’usage").selectOption("livraison");
    await hero.getByLabel("Ville d’utilisation").fill("Cocody");
    await hero.getByLabel("Durée d’utilisation").selectOption("Cette semaine");
    await expect(form.getByRole("radio", { name: "Achat" })).toBeChecked();
    await expect(form.getByLabel("Usage", { exact: true })).toHaveValue("livraison");
    await expect(form.getByLabel("Ville ou zone")).toHaveValue("Cocody");
    await expect(form.getByLabel("Dates ou durée")).toHaveValue("Cette semaine");
    await expect(form.locator(".mop-summary__img")).toHaveAttribute("data-image", "moto-livraison");

    await hero.getByRole("button", { name: /Définir mon besoin/ }).click();
    await expect(page).toHaveURL(/#demande-moto$/);

    await page.locator("#profils-motos .mop-card", { hasText: "Interventions terrain" }).click();
    await expect(form.getByLabel("Usage", { exact: true })).toHaveValue("terrain");
    await expect(page.locator("#profils-motos .mop-card", { hasText: "Interventions terrain" })).toHaveAttribute("aria-pressed", "true");
    await expect(form.locator(".mop-summary__img")).toHaveAttribute("data-image", "moto-tout-terrain");
    await page.locator("#profils-motos .mop-card", { hasText: "Mobilité urbaine" }).click();
    await expect(form.locator(".mop-summary__img")).toHaveAttribute("data-image", "scooter");
    await expect(form.locator('[data-row="usage"] .mop-summary__val')).toHaveText("Mobilité urbaine");
  });

  test("formulaire, récapitulatif en direct et WhatsApp", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-moto");
    const summary = form.getByRole("complementary", { name: "Votre récapitulatif" });
    await expect(form.getByRole("heading", { level: 2 })).toContainText("Préparez votre demande de deux-roues.");
    await expect(summary).toContainText("Voici les principales informations de votre demande.");
    await expect(summary).toContainText("Disponibilité et conditions sur proposition.");
    for (const r of ["usage", "quantite", "zone", "periode"]) {
      await expect(summary.locator(`[data-row="${r}"] .mop-summary__val`)).toHaveText("À préciser");
    }
    await expect(form).toContainText("Vérifiez votre récapitulatif avant l’envoi.");

    await form.getByRole("radio", { name: "À comparer" }).check({ force: true });
    await form.getByLabel("Usage", { exact: true }).selectOption("urbain");
    await form.getByLabel("Modèle ou préférence").fill("Maxi-scooter");
    await form.getByLabel("Quantité").selectOption("3");
    await form.getByLabel("Ville ou zone").fill("Yopougon");
    await form.getByLabel("Dates ou durée").selectOption("Moyenne durée (1 à 4 semaines)");
    await form.getByLabel("Distances et charge prévues").fill("Trajets quotidiens, charge légère");
    await form.getByLabel("Décrivez vos besoins").fill("Déplacements entre deux sites");
    await form.getByLabel("Coffre ou rangement").check({ force: true });
    await form.getByLabel("Géolocalisation").check({ force: true });
    await expect(form.getByLabel("Coffre ou rangement")).toBeChecked();
    await expect(summary.locator('[data-row="usage"] .mop-summary__val')).toHaveText("Mobilité urbaine");
    await expect(summary.locator('[data-row="quantite"] .mop-summary__val')).toHaveText("3");
    await expect(summary.locator('[data-row="zone"] .mop-summary__val')).toHaveText("Yopougon");
    await expect(summary.locator('[data-row="periode"] .mop-summary__val')).toContainText("Moyenne durée");

    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(form.getByRole("alert")).toContainText("Indiquez votre nom");
    await form.getByPlaceholder("Nom", { exact: true }).fill("Awa Koné");
    await form.getByPlaceholder("Téléphone").fill("0707070707");
    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();

    const ready = form.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(ready).toBeVisible();
    const href = (await ready.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const text = decodeURIComponent(href.split("?text=")[1].replace(/\+/g, " "));
    expect(text).toContain("Mode de demande : À comparer");
    expect(text).toContain("Usage : Mobilité urbaine");
    expect(text).toContain("Modèle ou préférence : Maxi-scooter");
    expect(text).toContain("Quantité : 3");
    expect(text).toContain("Ville ou zone : Yopougon");
    expect(text).toContain("Distances et charge prévues : Trajets quotidiens, charge légère");
    expect(text).toContain("Besoins : Déplacements entre deux sites");
    expect(text).toContain("Options à étudier : Coffre ou rangement, Géolocalisation");
    expect(text).toContain("Nom : Awa Koné");
    expect(text).toContain("Téléphone : 0707070707");

    const band = page.getByRole("link", { name: /Échanger avec l’équipe/ });
    expect(decodeURIComponent(((await band.getAttribute("href")) ?? "").split("?text=")[1].replace(/\+/g, " "))).toContain("Usage : Mobilité urbaine");
  });

  test("proposition, FAQ numérotée, bandeau et ancres", async ({ page, request }) => {
    await openPage(page);
    const prop = page.locator("#proposition");
    await expect(prop.locator(".mop-pcard")).toHaveCount(3);
    for (const t of [
      "Véhicule & accessoires",
      "Large choix de motos et scooters",
      "Équipements de sécurité adaptés",
      "Durée & coût",
      "Devis personnalisé sur demande",
      "Entretien & responsabilités",
      "Conseils pour une utilisation en toute sécurité",
    ]) {
      await expect(prop).toContainText(t);
    }

    const faq = page.locator("#faq");
    await expect(faq.getByRole("heading", { level: 2 })).toHaveText("Questions fréquentes");
    await expect(faq.locator(".mop-faq__num")).toHaveText(["1", "2", "3"]);
    const q1 = faq.getByRole("button", { name: /Puis-je demander une flotte de motos/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await expect(faq).toContainText("Précisez le nombre, les usages et la zone. Les possibilités seront étudiées pour votre projet.");
    const q2 = faq.getByRole("button", { name: /Les équipements sont-ils inclus/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(faq.getByRole("button", { name: /Peut-on étudier un modèle précis/ })).toBeVisible();

    const band = page.locator(".mop-band");
    await expect(band).toContainText("Une moto ou une flotte : parlons de votre activité.");
    await expect(band).toContainText("Nos spécialistes vous accompagnent pour étudier la meilleure solution.");

    const html = await (await request.get(URL)).text();
    expect(html).toContain('id="profils-motos"');
    expect(html).toContain('id="demande-moto"');
    // Le contenu de la page (hors en-tête et pied de page globaux) ne renvoie pas vers l’inscription livreur.
    await expect(page.locator(".mop-page a[href='/espace-livreur']")).toHaveCount(0);
  });

  test("hauteurs égales et aucun débordement", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#mop-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    const form = await page.locator(".mop-form").boundingBox();
    const summary = await page.locator(".mop-summary").boundingBox();
    expect(Math.abs(form!.height - summary!.height)).toBeLessThanOrEqual(1);
    for (const sel of [".mop-card", ".mop-pcard", ".mop-daily__cards li"]) {
      const hs = await page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(new Set(hs).size, sel).toBe(1);
    }
  });
});
