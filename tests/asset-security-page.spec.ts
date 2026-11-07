import { test, expect } from "@playwright/test";

test.describe("page sécurisation des actifs", () => {
  test("hero, dispositif, cadre, références, FAQ, CTA et liens", async ({ page }, testInfo) => {
    await page.goto("/solutions/securisation-actifs", { waitUntil: "domcontentloaded" });

    const title = page.locator("#sec-hero-title");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Mieux suivre");
    await expect(title).toContainText("vos actifs.");
    await expect(title).toContainText("Mieux encadrer");
    await expect(title).toContainText("les risques.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByText("Événement à examiner")).toBeVisible();
    await expect(page.getByText("Aperçu illustratif — données fictives")).toBeVisible();
    await expect(page.getByRole("link", { name: /Étudier mon besoin/ })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("link", { name: /Explorer les possibilités/ })).toHaveAttribute("href", "#dispositif");

    const strip = page.getByRole("region", { name: "Repères de la solution" });
    for (const t of ["Matériel adapté", "Supervision organisée", "Cadre contractuel"]) {
      await expect(strip).toContainText(t);
    }

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
      await expect(page.locator("#mega-solutions")).toBeVisible();
      const link = page.locator("#mega-solutions").getByRole("link", { name: "Sécurisation des actifs", exact: true });
      await expect(link).toHaveAttribute("href", "/solutions/securisation-actifs");
      await page.mouse.move(10, 600);
    }

    // Dispositif
    const device = page.locator("#dispositif");
    await expect(device.getByRole("heading", { level: 2 })).toContainText("Un dispositif adapté à vos actifs.");
    await expect(device.getByRole("link")).toHaveCount(6);
    for (const t of ["Équipements financés", "Actifs mobiles", "Alertes et géozones", "Événements", "Déploiement et supervision", "Rapports et exports"]) {
      await expect(device.getByText(t, { exact: true })).toBeVisible();
    }
    await expect(device).toContainText("Les fonctions dépendent du matériel, de la couverture réseau et du contrat.");

    // Cadre
    const frame = page.locator("#cadre");
    await expect(frame.getByRole("heading", { level: 2 })).toContainText("Un cadre clair,");
    await expect(frame.getByRole("link", { name: /Identifier les actifs/ })).toBeVisible();
    await expect(frame.getByRole("link", { name: /Définir les événements/ })).toBeVisible();
    await expect(frame.getByRole("link", { name: /Valider le périmètre/ })).toBeVisible();
    await expect(frame.getByRole("heading", { level: 3 })).toContainText("À préciser pour votre projet");
    await expect(frame.locator("ol > li")).toHaveCount(4);
    await expect(frame).toContainText("L’immobilisation d’un équipement n’est pas une capacité universelle ou automatique.");

    // Références
    const refs = page.locator("#references");
    await expect(refs).toContainText("BNI");
    await expect(refs).toContainText("Banque Atlantique Côte d’Ivoire");
    await expect(refs).toContainText("Ces mentions ne constituent pas une liste de partenariats actifs ni une garantie de résultat.");

    // FAQ
    const q1 = page.getByRole("button", { name: /Est-ce réservé aux banques/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    const q2 = page.getByRole("button", { name: /Quels équipements peut-on suivre/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    expect(await page.locator(".sec-faq__list button").count()).toBeGreaterThanOrEqual(8);

    // CTA
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Présenter mon besoin/ })).toHaveAttribute("href", "/contact");
    await expect(main.getByRole("link", { name: /Échanger sur WhatsApp/ })).toHaveAttribute("href", /wa\.me\/2250554137777/);
    await expect(main.getByRole("link", { name: "+225 05 54 13 77 77" })).toHaveAttribute("href", "tel:+2250554137777");

    const explore = page.getByRole("navigation", { name: "Pour compléter votre projet" });
    for (const href of [
      "/solutions/location",
      "/solutions/vente",
      "/solutions/geolocalisation",
      "/solutions/gestion-de-flotte",
      "/solutions/plateformes-sur-mesure",
    ]) {
      await expect(explore.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test("colonnes alignées (cadre, FAQ, CTA)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "mesure desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/securisation-actifs", { waitUntil: "domcontentloaded" });
    const frame = await page.locator("#cadre").boundingBox();
    const media = await page.locator(".sec-frame__media").boundingBox();
    const brief = await page.locator(".sec-brief").boundingBox();
    expect(Math.abs(media!.height - frame!.height)).toBeLessThanOrEqual(1);
    expect(brief!.height).toBeGreaterThan(200);
    const cta = await page.locator("#contact").boundingBox();
    const cm = await page.locator(".sec-cta__media").boundingBox();
    expect(Math.abs(cm!.height - cta!.height)).toBeLessThanOrEqual(1);
    const cards = await page.locator(".sec-device__grid > li").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(new Set(cards.slice(0, 3)).size).toBe(1);
  });

  test("aucun débordement horizontal", async ({ page }) => {
    await page.goto("/solutions/securisation-actifs", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#sec-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
