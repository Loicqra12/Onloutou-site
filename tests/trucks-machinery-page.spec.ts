import { test, expect, type Page } from "@playwright/test";
import { Buffer } from "node:buffer";

const URL = "/equipements/camions-engins";

async function openPage(page: Page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#cme-hero-title")).toBeVisible();
  await page.locator("#profils-camions-engins").scrollIntoViewIfNeeded();
  await expect(page.locator(".cme-product")).toHaveCount(6);
}

test.describe("page camions et engins", () => {
  test("hero, recherche, catégories et bandeau", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const title = page.locator("#cme-hero-title");
    await expect(title).toContainText("Camions, engins,");
    await expect(title).toContainText("moyens spécialisés.");
    await expect(title).toContainText("Votre projet");
    await expect(title).toContainText("donne la direction.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Fil d’Ariane" })).toContainText("Camions et engins");
    await expect(page.locator(".cme-hero__lead")).toContainText("décrivez l’équipement à louer, la mission");

    const search = page.getByRole("search", { name: "Rechercher un camion ou un engin" }).first();
    await expect(search.getByLabel("Quel camion ou engin recherchez-vous ?")).toBeVisible();
    await expect(search.getByLabel("Lieu du projet")).toBeVisible();
    await expect(search.getByLabel("Période")).toBeVisible();
    await expect(search.getByRole("button", { name: /Explorer/ })).toBeVisible();
    await expect(search).toContainText("Un équipement spécifique ?");
    await expect(search).toContainText("Disponibilités, capacités et conditions à confirmer.");

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Articles & équipements" }).hover();
      await expect(page.locator("#mega-equipements a", { hasText: "Camions & engins" }).first()).toHaveAttribute(
        "href",
        "/equipements/camions-engins",
      );
      await page.mouse.move(10, 600);
    }

    const cats = page.locator("#categories");
    await expect(cats).toContainText("Nos catégories");
    await expect(cats.getByRole("heading", { level: 2 })).toContainText("Toutes les familles pour vos opérations.");
    await expect(cats.locator(".cme-cat")).toHaveCount(8);
    await expect(cats).toContainText("Votre besoin ne rentre pas dans une case ?");
    await expect(cats).toContainText("Demander un camion ou un engin spécifique");
  });

  test("catalogue : onglets, recherche, filtres et catégories", async ({ page }) => {
    await openPage(page);
    const catalog = page.locator("#profils-camions-engins");
    await expect(catalog.getByRole("heading", { level: 2 })).toContainText("À chaque opération, le bon équipement.");
    await expect(catalog.getByRole("button", { name: "Terrassement", exact: true })).toHaveAttribute("aria-pressed", "true");
    for (const n of ["Mini-pelle", "Pelle sur chenilles", "Pelle sur pneus", "Chargeuse", "Tractopelle", "Bulldozer"]) {
      await expect(catalog.locator(".cme-product h4", { hasText: n })).toBeVisible();
    }
    await expect(catalog.locator(".cme-product").first()).toContainText("Capacité à préciser");

    // Onglets
    await catalog.getByRole("button", { name: "Levage", exact: true }).click();
    await expect(catalog.locator(".cme-product h4", { hasText: "Grue mobile avec nacelle" })).toBeVisible();
    await expect(catalog.getByRole("button", { name: "Levage", exact: true })).toHaveAttribute("aria-pressed", "true");
    await catalog.getByRole("button", { name: "Transport", exact: true }).click();
    await expect(catalog.locator(".cme-product h4", { hasText: "Camion porte-conteneur" })).toBeVisible();
    await catalog.getByRole("button", { name: "Toutes les familles", exact: true }).click();
    await expect(catalog.locator(".cme-product")).toHaveCount(14);

    // Recherche libre
    await catalog.getByLabel("Rechercher un camion ou un engin").fill("tracteur");
    await expect(catalog.locator(".cme-product h4")).toHaveText("Tracteur agricole");
    await catalog.getByLabel("Rechercher un camion ou un engin").fill("zzzz");
    await expect(catalog.locator(".cme-empty")).toBeVisible();
    await catalog.getByRole("button", { name: "Réinitialiser les filtres" }).click();
    await expect(catalog.locator(".cme-product")).toHaveCount(14);

    // Filtres : mission, capacité, famille
    await catalog.locator("#cme-f-mission").selectOption("forage");
    await expect(catalog.locator(".cme-product h4")).toHaveText("Foreuse rotative");
    await catalog.getByRole("button", { name: "Toutes les familles", exact: true }).click();
    await catalog.locator("#cme-f-capacity").selectOption("compact");
    await expect(catalog.locator(".cme-product")).toHaveCount(2);
    await catalog.locator("#cme-f-capacity").selectOption("");
    await catalog.locator("#cme-f-family").selectOption("agriculture");
    await expect(catalog.locator(".cme-product h4")).toHaveText("Tracteur agricole");

    // Catégorie depuis la grille
    await page.locator("#categories .cme-cat", { hasText: "Levage & travail en hauteur" }).click();
    await expect(catalog.getByRole("button", { name: "Levage", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(catalog.locator(".cme-product h4", { hasText: "Grue mobile avec nacelle" })).toBeVisible();
    await page.locator("#categories .cme-cat", { hasText: "Routes & compactage" }).click();
    await expect(catalog.locator(".cme-product h4")).toHaveText("Rouleau compresseur");
  });

  test("demande : ajout, configuration, récapitulatif, WhatsApp et formulaire", async ({ page }) => {
    await openPage(page);
    const catalog = page.locator("#profils-camions-engins");
    const form = page.locator("#demande-camion-engin");
    const summary = form.getByRole("complementary", { name: "Votre projet" });
    await expect(summary).toContainText("Non précisé");

    const add = catalog.locator(".cme-product", { hasText: "Mini-pelle" }).getByRole("button", { name: /Ajouter à ma demande/ });
    await add.click();
    await expect(catalog.locator(".cme-product", { hasText: "Mini-pelle" }).getByRole("button", { name: /Ajouté à ma demande/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(catalog.getByText("1 équipement ajouté")).toBeVisible();
    await catalog.locator(".cme-product", { hasText: "Bulldozer" }).getByRole("button", { name: /Ajouter à ma demande/ }).click();
    await expect(catalog.getByText("2 équipements ajoutés")).toBeVisible();

    // Carte de configuration
    await page.locator("#cme-cfg-mission").scrollIntoViewIfNeeded();
    await page.locator("#cme-cfg-mission").selectOption("Terrassement");
    await page.locator("#cme-cfg-terrain").selectOption("Terrain rocheux");
    await page.locator("#cme-cfg-capacity").fill("20 tonnes");
    await page.getByRole("radiogroup", { name: "Opérateur" }).getByRole("radio", { name: "Avec", exact: true }).check();
    await page.getByRole("button", { name: /Configurer ma demande/ }).click();
    await expect(page.getByText("Configuration ajoutée à votre demande")).toBeVisible();

    await expect(form.getByLabel("Matériel recherché 1")).toHaveValue("Mini-pelle");
    await expect(form.getByLabel("Matériel recherché 2")).toHaveValue("Bulldozer");
    await expect(form.getByLabel("Capacité recherchée (si connue)")).toHaveValue("20 tonnes");
    await expect(form.getByRole("checkbox", { name: "Avec opérateur" })).toBeChecked();
    await expect(summary).toContainText("Mini-pelle, Bulldozer");
    await expect(summary.locator('[data-row="mission"]')).toContainText("Terrassement");

    // Lignes et champs
    await form.getByRole("button", { name: "Ajouter un autre équipement" }).click();
    await form.getByLabel("Matériel recherché 3").fill("Camion-grue");
    await expect(summary).toContainText("Camion-grue");
    await form.getByRole("button", { name: "Retirer cet équipement 3" }).click();
    await expect(summary).not.toContainText("Camion-grue");
    await form.getByRole("button", { name: "Augmenter la quantité" }).click();
    await expect(form.locator(".cme-qty input")).toHaveValue("2");
    await form.getByLabel("Description de l’opération").fill("Terrassement d’une plateforme");
    await form.getByLabel("Ville ou site").fill("Yopougon");
    await form.locator("#cme-start").focus();
    await form.locator("#cme-start").fill("2026-11-10");
    await form.getByLabel("Durée").fill("2 semaines");
    await expect(summary.locator('[data-row="place"]')).toContainText("Yopougon");
    await expect(summary.locator('[data-row="period"]')).toContainText("10/11/2026");
    await expect(summary.locator('[data-row="period"]')).toContainText("2 semaines");
    await form.getByRole("checkbox", { name: "Transport sur site" }).check();

    // Validation puis préparation
    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    await expect(form.getByRole("alert")).toContainText("Indiquez votre nom");
    await form.getByLabel("Nom ou entreprise").fill("SOTRA Chantiers");
    await form.getByLabel("Téléphone").fill("0707070707");
    await form.getByRole("button", { name: /Enregistrer ma demande/ }).click();
    const ready = form.getByRole("status").filter({ hasText: "Demande enregistrée" });
    await expect(ready).toBeVisible();
    const href = (await ready.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "";
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const text = decodeURIComponent(href.split("?text=")[1].replace(/\+/g, " "));
    expect(text).toContain("Équipement : Mini-pelle ; Bulldozer");
    expect(text).toContain("Quantité : 2");
    expect(text).toContain("Mission : Terrassement");
    expect(text).toContain("Terrain : Terrain rocheux");
    expect(text).toContain("Capacité recherchée : 20 tonnes");
    expect(text).toContain("Lieu : Yopougon");
    expect(text).toContain("Début : 10/11/2026");
    expect(text).toContain("Durée : 2 semaines");
    expect(text).toContain("Opérateur : Avec opérateur");
    expect(text).toContain("Services souhaités : Avec opérateur, Transport sur site");
    expect(text).toContain("Téléphone : 0707070707");

    const band = page.getByRole("link", { name: /Parler à l’équipe/ });
    expect(decodeURIComponent(((await band.getAttribute("href")) ?? "").split("?text=")[1].replace(/\+/g, " "))).toContain("Bulldozer");
  });

  test("fichier joint local, conditions, étapes et FAQ", async ({ page }) => {
    await openPage(page);
    const form = page.locator("#demande-camion-engin");
    await form.scrollIntoViewIfNeeded();
    const input = form.locator('input[type="file"]');
    await input.setInputFiles({ name: "site.png", mimeType: "image/png", buffer: Buffer.from("png") });
    await expect(form.locator(".cme-drop")).toContainText("site.png");
    await form.getByRole("button", { name: "Retirer le fichier" }).click();
    await expect(form.locator(".cme-drop")).toContainText("Glissez un fichier ici ou cliquez pour parcourir");
    await input.setInputFiles({ name: "run.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") });
    await expect(form.getByRole("alert")).toContainText("Format non accepté");

    const cond = page.locator("#conditions");
    await expect(cond.getByRole("heading", { level: 2 })).toContainText("Les conditions, précisées avant de confirmer.");
    await expect(cond.locator(".cme-cond__card")).toHaveCount(3);
    for (const t of ["Équipement & mission", "Exploitation & services", "Durée & budget", "Responsabilités", "Restitution", "Matériel contrôlé et opérationnel"]) {
      await expect(cond).toContainText(t);
    }
    await expect(cond).toContainText("Seule la proposition validée fixe les prestations et conditions retenues.");

    const steps = page.locator("#comment-ca-marche");
    await expect(steps).toContainText("Comment ça marche ?");
    await expect(steps.locator("li")).toHaveCount(4);
    for (const t of ["Décrire", "Étudier", "Proposer", "Confirmer"]) await expect(steps).toContainText(t);

    const q1 = page.getByRole("button", { name: /Puis-je demander un engin non présenté/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#faq")).toContainText("Nous étudierons les possibilités et les conditions.");
    const q2 = page.getByRole("button", { name: /L’opérateur et le transport sont-ils inclus/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    expect(await page.locator(".cme-faq__list button").count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator(".cme-band")).toContainText("Un projet complexe ? Échangeons sur vos besoins.");
  });

  test("ancres existantes", async ({ request }) => {
    const html = await (await request.get(URL)).text();
    expect(html).toContain('id="profils-camions-engins"');
    expect(html).toContain('id="demande-camion-engin"');
    expect(html).toContain('id="categories"');
  });

  test("hauteurs égales et aucun débordement", async ({ page }, testInfo) => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#cme-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    const form = await page.locator(".cme-form").boundingBox();
    const summary = await page.locator(".cme-summary").boundingBox();
    expect(Math.abs(form!.height - summary!.height)).toBeLessThanOrEqual(1);
    for (const sel of [".cme-product", ".cme-cat", ".cme-cond__card"]) {
      const hs = await page.locator(sel).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(new Set(hs).size, sel).toBe(1);
    }
    const mission = await page.locator(".cme-mission__photo").boundingBox();
    const config = await page.locator(".cme-config").boundingBox();
    expect(Math.abs(mission!.height - config!.height)).toBeLessThanOrEqual(1);
  });
});
