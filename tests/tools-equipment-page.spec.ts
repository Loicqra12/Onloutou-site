import { test, expect, type Page } from "@playwright/test";
import { Buffer } from "node:buffer";

const URL = "/equipements/outils-materiels";

async function openPage(page: Page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#tem-hero-title")).toBeVisible();
  // attend l'hydratation (les boutons du catalogue réagissent aux clics)
  await page.locator("#familles-materiels").scrollIntoViewIfNeeded();
  await expect(page.locator(".tem-product")).toHaveCount(6);
}

test.describe("page outils et matériels", () => {
  test("hero, recherche, catégories et bandeau", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const title = page.locator("#tem-hero-title");
    await expect(title).toContainText("Le matériel");
    await expect(title).toContainText("qu’il vous faut.");
    await expect(title).toContainText("Pour tous vos projets.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByText("Abidjan, Côte d’Ivoire · Outils et matériel")).toBeVisible();

    const search = page.getByRole("search", { name: "Rechercher du matériel" });
    await expect(search.getByLabel("Que souhaitez-vous louer ?")).toBeVisible();
    await expect(search.getByLabel("Lieu d’utilisation")).toBeVisible();
    await expect(search.getByLabel("Dates")).toBeVisible();
    await expect(search.getByRole("button", { name: /Explorer/ })).toBeVisible();
    await expect(search).toContainText("Vous ne trouvez pas votre matériel ?");
    await expect(search).toContainText("Disponibilités et conditions confirmées après étude.");

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
      await expect(page.locator("#mega-equipements a", { hasText: "Outils & matériel" }).first()).toHaveAttribute(
        "href",
        "/equipements/outils-materiels",
      );
      await page.mouse.move(10, 600);
    }

    const cats = page.locator("#categories");
    await expect(cats.getByRole("heading", { level: 2 })).toContainText("Explorez tous les univers.");
    await expect(cats.locator(".tem-cat")).toHaveCount(12);
    await expect(cats).toContainText("Une demande qui sort des catégories ?");
    await expect(cats).toContainText("Nous l’étudions aussi.");
  });

  test("catalogue : recherche, filtres, catégories et comparaison", async ({ page }) => {
    await openPage(page);
    const catalog = page.locator("#familles-materiels");
    await expect(catalog.getByRole("heading", { level: 3, name: "Énergie & éclairage" })).toBeVisible();
    await expect(catalog.getByRole("radio", { name: "Chantier" })).toBeChecked();
    for (const n of [
      "Groupe électrogène compact",
      "Groupe électrogène industriel",
      "Tour d’éclairage",
      "Projecteur de chantier",
      "Distribution électrique",
      "Station d’énergie portable",
    ]) {
      await expect(catalog.locator(".tem-product h4", { hasText: n })).toBeVisible();
    }

    // Filtre source d'énergie
    await catalog.getByLabel("Source d’énergie").selectOption("batterie");
    await expect(catalog.locator(".tem-product")).toHaveCount(1);
    await expect(catalog.locator(".tem-product h4")).toHaveText("Station d’énergie portable");
    await catalog.getByLabel("Source d’énergie").selectOption("");
    await expect(catalog.locator(".tem-product")).toHaveCount(6);

    // Famille : Événementiel retire l'usage « Chantier » s'il ne laisse rien
    await catalog.getByRole("button", { name: "Événementiel", exact: true }).click();
    await expect(catalog.locator(".tem-product h4", { hasText: "Tente de réception" })).toBeVisible();
    await expect(catalog.getByRole("radio", { name: "Chantier" })).not.toBeChecked();

    // Recherche libre
    await catalog.getByLabel("Rechercher un équipement ou un usage").fill("perceuse");
    await expect(catalog.getByRole("heading", { level: 3, name: /Résultats pour « perceuse »/ })).toBeVisible();
    await expect(catalog.locator(".tem-product")).toHaveCount(2);
    await catalog.getByLabel("Rechercher un équipement ou un usage").fill("zzzz");
    await expect(catalog.locator(".tem-empty")).toBeVisible();
    await catalog.getByRole("button", { name: "Réinitialiser les filtres" }).click();
    await expect(catalog.locator(".tem-product").first()).toBeVisible();

    // Catégorie depuis la grille
    await page.locator("#categories .tem-cat", { hasText: "Pompage & traitement d’eau" }).click();
    await expect(catalog.getByRole("heading", { level: 3, name: "Pompage & traitement d’eau" })).toBeVisible();
    await expect(catalog.locator(".tem-product h4")).toHaveText("Pompe submersible");

    // Comparaison
    await catalog.getByRole("button", { name: "Énergie & éclairage", exact: true }).click();
    await catalog.getByRole("checkbox", { name: "Comparer : Groupe électrogène compact" }).check();
    await catalog.getByRole("checkbox", { name: "Comparer : Tour d’éclairage" }).check();
    const compare = catalog.getByRole("region", { name: "Comparaison des équipements" });
    await expect(compare).toBeVisible();
    await expect(compare.getByRole("row")).toHaveCount(3);
    await compare.getByRole("button", { name: "Effacer la comparaison" }).click();
    await expect(compare).toHaveCount(0);
  });

  test("demande : ajout, barre, récapitulatif, WhatsApp et formulaire", async ({ page }) => {
    await openPage(page);
    const bar = page.getByRole("complementary", { name: "Ma demande" });
    await expect(bar).toContainText("Aucun équipement pour le moment");

    const add = page.locator(".tem-product", { hasText: "Groupe électrogène compact" }).getByRole("button", { name: /Ajouter à ma demande/ });
    await add.click();
    await expect(bar).toContainText("Ma demande");
    await expect(bar).toContainText("1 équipement");
    await expect(bar).toContainText("Groupe électrogène compact");
    await expect(page.locator(".tem-product", { hasText: "Groupe électrogène compact" }).getByRole("button", { name: /Ajouté à ma demande/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.locator(".tem-product", { hasText: "Tour d’éclairage" }).getByRole("button", { name: /Ajouter à ma demande/ }).click();
    await expect(bar).toContainText("2 équipements");

    await bar.getByRole("link", { name: /Continuer/ }).click();
    const form = page.locator("#demande-materiel");
    await expect(form.getByRole("heading", { level: 2 })).toContainText("Votre besoin, en quelques détails.");
    await expect(form.getByLabel("Matériel recherché 1")).toHaveValue("Groupe électrogène compact");
    await expect(form.getByLabel("Matériel recherché 2")).toHaveValue("Tour d’éclairage");

    const summary = form.getByRole("complementary", { name: "Votre demande de location" });
    await expect(summary).toContainText("Groupe électrogène compact, Tour d’éclairage");
    await expect(summary).toContainText("Tarif et disponibilité sur proposition.");

    // Ajouter un équipement libre, quantité, lieu, dates, services
    await form.getByRole("button", { name: "Ajouter un autre équipement" }).click();
    await form.getByLabel("Matériel recherché 3").fill("Caméra de surveillance");
    await expect(summary).toContainText("Caméra de surveillance");
    await form.getByRole("button", { name: "Augmenter la quantité" }).click();
    await expect(form.getByRole("group", { name: "Quantité" }).locator("input")).toHaveValue("2");
    await form.getByLabel("Ville ou commune").fill("Cocody");
    await form.locator("#tem-start").focus();
    await form.locator("#tem-start").fill("2026-11-10");
    await form.locator("#tem-end").focus();
    await form.locator("#tem-end").fill("2026-11-12");
    await expect(summary).toContainText("Cocody");
    await expect(summary).toContainText("10/11/2026");
    await expect(summary).toContainText("12/11/2026");
    const livraison = form.getByRole("button", { name: "Livraison" });
    await livraison.click();
    await expect(livraison).toHaveAttribute("aria-pressed", "true");

    // Retrait d'une ligne
    await form.getByRole("button", { name: "Retirer cet équipement 3" }).click();
    await expect(summary).not.toContainText("Caméra de surveillance");

    // Validation : coordonnées requises
    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(form.getByRole("alert")).toContainText("Indiquez votre nom");
    await form.getByLabel("Nom", { exact: true }).fill("Awa Koné");
    await form.getByLabel("Téléphone").fill("0707070707");
    await form.getByRole("radio", { name: "Professionnel" }).check();
    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    const ready = form.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(ready).toBeVisible();
    const wa = ready.getByRole("link", { name: /WhatsApp/ });
    const href = (await wa.getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const text = decodeURIComponent(href.split("?text=")[1].replace(/\+/g, " "));
    expect(text).toContain("Groupe électrogène compact ; Tour d’éclairage");
    expect(text).toContain("Quantité : 2");
    expect(text).toContain("Lieu : Cocody");
    expect(text).toContain("du 10/11/2026 au 12/11/2026");
    expect(text).toContain("Services souhaités : Livraison");
    expect(text).toContain("Profil : Professionnel");
    expect(text).toContain("Téléphone : 0707070707");

    // Bandeau WhatsApp : même message
    const band = page.getByRole("link", { name: "Échanger sur WhatsApp", exact: true });
    expect(decodeURIComponent(((await band.getAttribute("href")) ?? "").split("?text=")[1].replace(/\+/g, " "))).toContain("Tour d’éclairage");
  });

  test("fichier joint local et FAQ", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-materiel");
    await form.scrollIntoViewIfNeeded();
    const input = form.locator('input[type="file"]');
    await input.setInputFiles({ name: "reference.png", mimeType: "image/png", buffer: Buffer.from("png") });
    await expect(form.locator(".tem-drop")).toContainText("reference.png");
    await form.getByRole("button", { name: "Retirer le fichier" }).click();
    await expect(form.locator(".tem-drop")).toContainText("Glissez une image ici");
    await input.setInputFiles({ name: "script.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") });
    await expect(form.getByRole("alert")).toContainText("Format non accepté");

    const q1 = page.getByRole("button", { name: /Et si mon matériel n’apparaît pas/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    const q2 = page.getByRole("button", { name: /Puis-je demander plusieurs équipements/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    expect(await page.locator(".tem-faq__list button").count()).toBeGreaterThanOrEqual(6);
  });

  test("ancres existantes et textes de section", async ({ request }) => {
    const html = await (await request.get(URL)).text();
    expect(html).toContain('id="familles-materiels"');
    expect(html).toContain('id="demande-materiel"');
    for (const t of ["Pas dans la sélection ?", "Vous décrivez", "Nous recherchons", "Vous validez la proposition", "Ce qui sera", "Questions"]) {
      expect(html).toContain(t);
    }
  });

  test("hauteurs égales (formulaire/récapitulatif) et aucun débordement", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#tem-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    const form = await page.locator(".tem-form").boundingBox();
    const summary = await page.locator(".tem-summary").boundingBox();
    expect(Math.abs(form!.height - summary!.height)).toBeLessThanOrEqual(1);
    const cards = await page.locator(".tem-product").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(new Set(cards).size).toBe(1);
    const pc = await page.locator(".tem-pcard").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(new Set(pc).size).toBe(1);
    const cats = await page.locator(".tem-cat").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(new Set(cats).size).toBe(1);
  });
});
