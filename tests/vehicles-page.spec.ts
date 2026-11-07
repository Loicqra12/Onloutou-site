import { test, expect, type Page } from "@playwright/test";

const URL = "/equipements/vehicules";

async function openPage(page: Page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#vhp-hero-title")).toBeVisible();
  await page.locator("#profils-vehicules").scrollIntoViewIfNeeded();
  await expect(page.locator(".vhp-card")).toHaveCount(6);
}

test.describe("page véhicules professionnels", () => {
  test("hero, recherche, profils, bandeau et critères", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const title = page.locator("#vhp-hero-title");
    await expect(title).toContainText("Le véhicule adapté");
    await expect(title).toContainText("à chacune de vos");
    await expect(title).toContainText("missions.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main").getByText("Véhicules professionnels", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".vhp-hero__lead")).toContainText("trouvez le profil à étudier pour votre activité.");

    const search = page.getByRole("search", { name: "Définir mon besoin de véhicule" });
    await expect(search.getByRole("radio", { name: "Location" })).toBeChecked();
    await expect(search.getByLabel("Type de véhicule")).toBeVisible();
    await expect(search.getByLabel("Lieu d’utilisation")).toBeVisible();
    await expect(search.getByLabel("Période")).toBeVisible();
    await expect(search.getByRole("button", { name: /Définir mon besoin/ })).toBeVisible();
    await expect(search).toContainText("Modèles, tarifs et disponibilités sur proposition.");

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
      await expect(page.locator("#mega-equipements a", { hasText: "Véhicules professionnels" }).first()).toHaveAttribute("href", "/equipements/vehicules");
      await page.mouse.move(10, 600);
    }

    const profiles = page.locator("#profils-vehicules");
    await expect(profiles).toContainText("Nos catégories de véhicules");
    await expect(profiles.getByRole("heading", { level: 2 })).toContainText("Explorez les profils de véhicules.");
    for (const [n, t] of [
      ["Berlines", "Déplacements professionnels"],
      ["SUV", "Mobilité et confort selon vos parcours"],
      ["Pick-up", "Équipes et matériel sur le terrain"],
      ["Utilitaires légers", "Livraison et interventions"],
      ["Fourgons", "Transport de matériel et marchandises"],
      ["Transport d’équipe", "Minibus et besoins collectifs à étudier"],
    ]) {
      const card = profiles.locator(".vhp-card", { hasText: n });
      await expect(card).toContainText(t);
      await expect(card).toContainText("Étudier ce besoin");
    }
    await expect(profiles).toContainText("Un modèle particulier ou un parc à constituer ?");
    await expect(profiles).toContainText("Décrire ma demande");
    for (const c of ["Passagers", "Volume et charge", "Terrain et trajets", "Durée d’utilisation"]) await expect(profiles.locator(".vhp-criteria")).toContainText(c);

    const mission = page.locator(".vhp-mission");
    await expect(mission.getByRole("heading", { level: 2 })).toContainText("Votre mission détermine le choix.");
    for (const r of ["Déplacements urbains", "Intervention terrain", "Transport léger", "Parc d’entreprise"]) await expect(mission).toContainText(r);
  });

  test("recherche du hero et profils alimentent le formulaire", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-vehicule");
    const hero = page.getByRole("search", { name: "Définir mon besoin de véhicule" });

    await hero.getByRole("radio", { name: "Achat" }).check({ force: true });
    await hero.getByLabel("Type de véhicule").selectOption("fourgon");
    await hero.getByLabel("Lieu d’utilisation").fill("Cocody");
    await hero.getByLabel("Période").selectOption("Cette semaine");
    await expect(form.getByRole("radio", { name: "Achat" })).toBeChecked();
    await expect(form.getByLabel("Type de véhicule")).toHaveValue("fourgon");
    await expect(form.getByLabel("Lieu d’utilisation")).toHaveValue("Cocody");
    await expect(form.getByLabel("Dates ou durée")).toHaveValue("Cette semaine");
    await expect(form.locator('.vhp-summary__img')).toHaveAttribute("data-image", "fourgon");

    await hero.getByRole("button", { name: /Définir mon besoin/ }).click();
    await expect(page).toHaveURL(/#demande-vehicule$/);

    // Profils : présélection du type et défilement
    await page.locator("#profils-vehicules .vhp-card", { hasText: "Pick-up" }).click();
    await expect(form.getByLabel("Type de véhicule")).toHaveValue("pickup");
    await expect(page.locator("#profils-vehicules .vhp-card", { hasText: "Pick-up" })).toHaveAttribute("aria-pressed", "true");
    await expect(form.locator(".vhp-summary__img")).toHaveAttribute("data-image", "pickup");
    await page.locator("#profils-vehicules .vhp-card", { hasText: "Transport d’équipe" }).click();
    await expect(form.locator(".vhp-summary__img")).toHaveAttribute("data-image", "minibus");
    await expect(form.locator('[data-row="usage"]')).toContainText("Transport d’équipe (minibus) × 1");
  });

  test("formulaire, récapitulatif en direct et WhatsApp", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-vehicule");
    const summary = form.getByRole("complementary", { name: "Récapitulatif à vérifier avant l’envoi." });
    await expect(form.getByRole("heading", { level: 2 })).toContainText("Préparez votre demande de véhicule.");
    await expect(summary).toContainText("Disponibilité et conditions après étude.");
    await expect(summary.locator('[data-row="profil"] .vhp-summary__val')).toHaveText("—");

    await form.getByRole("radio", { name: "À comparer" }).check({ force: true });
    await form.getByLabel("Type de véhicule").selectOption("suv");
    await form.getByLabel("Autre besoin").selectOption("Parc d’entreprise");
    await form.getByLabel("Quantité").selectOption("3");
    await form.getByLabel("Passagers ou charge").selectOption("3 à 5 passagers");
    await form.getByLabel("Lieu d’utilisation").fill("Yopougon");
    await form.getByLabel("Dates ou durée").selectOption("Moyenne durée (1 à 4 semaines)");
    await form.getByLabel("Votre mission").fill("Trajets quotidiens entre deux sites");
    await form.getByRole("button", { name: "Chauffeur" }).click();
    await form.getByRole("button", { name: "Géolocalisation" }).click();
    await expect(form.getByRole("button", { name: "Chauffeur" })).toHaveAttribute("aria-pressed", "true");
    await expect(summary.locator('[data-row="usage"] .vhp-summary__val')).toHaveText("SUV × 3");
    await expect(summary.locator('[data-row="lieu"] .vhp-summary__val')).toHaveText("Yopougon");
    await expect(summary.locator('[data-row="duree"] .vhp-summary__val')).toContainText("Moyenne durée");

    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(form.getByRole("alert")).toContainText("Indiquez votre nom");
    await form.getByPlaceholder("Nom", { exact: true }).fill("Awa Koné");
    await form.getByPlaceholder("Téléphone").fill("0707070707");
    await expect(summary.locator('[data-row="profil"] .vhp-summary__val')).toHaveText("Awa Koné");
    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();

    const ready = form.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(ready).toBeVisible();
    const href = (await ready.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const text = decodeURIComponent(href.split("?text=")[1].replace(/\+/g, " "));
    expect(text).toContain("Mode de demande : À comparer");
    expect(text).toContain("Type de véhicule : SUV");
    expect(text).toContain("Quantité : 3");
    expect(text).toContain("Autre besoin : Parc d’entreprise");
    expect(text).toContain("Passagers ou charge : 3 à 5 passagers");
    expect(text).toContain("Lieu d’utilisation : Yopougon");
    expect(text).toContain("Mission : Trajets quotidiens entre deux sites");
    expect(text).toContain("Services complémentaires : Chauffeur, Géolocalisation");
    expect(text).toContain("Téléphone : 0707070707");

    const band = page.getByRole("link", { name: /Parlons de votre besoin/ });
    expect(decodeURIComponent(((await band.getAttribute("href")) ?? "").split("?text=")[1].replace(/\+/g, " "))).toContain("Type de véhicule : SUV");
  });

  test("proposition, FAQ et ancres", async ({ page, request }) => {
    await openPage(page);
    const prop = page.locator("#proposition");
    await expect(prop.getByRole("heading", { level: 2 })).toContainText("Une proposition claire avant de vous engager.");
    await expect(prop.locator(".vhp-pcard")).toHaveCount(3);
    for (const t of ["Véhicule & usage", "Prix & durée", "Services & responsabilités", "Un devis clair avant validation", "Les responsabilités précisées"]) {
      await expect(prop).toContainText(t);
    }
    const q1 = page.getByRole("button", { name: /Puis-je demander un modèle précis/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#faq")).toContainText("Le modèle proposé et sa disponibilité seront confirmés après étude.");
    const q2 = page.getByRole("button", { name: /La location peut-elle inclure un chauffeur/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".vhp-band")).toContainText("Un déplacement ponctuel ou un parc à organiser ?");

    const html = await (await request.get(URL)).text();
    expect(html).toContain('id="profils-vehicules"');
    expect(html).toContain('id="demande-vehicule"');
  });

  test("hauteurs égales et aucun débordement", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#vhp-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    const form = await page.locator(".vhp-form").boundingBox();
    const summary = await page.locator(".vhp-summary").boundingBox();
    expect(Math.abs(form!.height - summary!.height)).toBeLessThanOrEqual(1);
    for (const sel of [".vhp-card", ".vhp-pcard"]) {
      const hs = await page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(new Set(hs).size, sel).toBe(1);
    }
  });
});
