import { test, expect } from "@playwright/test";

test.describe("page hub équipements", () => {
  test("H1, familles, location, vente, formulaire de demande, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    const title = page.locator("#eqp-hero-title");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Les bons");
    await expect(title).toContainText("équipements.");
    await expect(title).toContainText("Pour vos opérations.");
    await expect(page.locator("main h1")).toHaveCount(1);

    // Familles
    await page.locator("#univers-equipements").scrollIntoViewIfNeeded();
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(5);
    await expect(page.getByRole("tabpanel")).toContainText("Mobilité d’équipe");
    await page.getByRole("tab", { name: /Outils & matériel/ }).click();
    await expect(page.getByRole("tabpanel")).toContainText("Intervention technique");
    await page.getByRole("tab", { name: /Équipements connectés/ }).click();
    await expect(page.getByRole("tabpanel")).toContainText("Suivi d’actifs");

    await page.getByRole("tab", { name: /Véhicules professionnels/ }).click();
    await page.getByRole("tabpanel").getByRole("link", { name: "Découvrir la location" }).click();
    await expect(page).toHaveURL(/\/solutions\/location/);

    // Louer / Acheter
    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Deux façons de vous équiper/ })).toBeVisible();
    // Formulaire de demande
    await page.goto("/equipements#orientation-equipement");
    const form = page.locator("#orientation-equipement");
    await expect(form.getByRole("heading", { name: /Parlons de votre besoin/ })).toBeVisible();
    await form.getByRole("radio", { name: "Acheter", exact: true }).check();
    await form.getByRole("radio", { name: "Moto", exact: true }).check();
    await form.getByLabel("Quantité").selectOption("Deux à cinq unités");
    await form.getByLabel("Zone").selectOption("Abidjan");
    await form.getByLabel("Durée ou échéance").fill("3 mois");
    await form.getByRole("checkbox", { name: "Livraison", exact: true }).check();

    const recap = form.locator(".eqp-recap__list");
    await expect(recap).toContainText("Moto");
    await expect(recap).toContainText("Achat");
    await expect(recap).toContainText("Deux à cinq unités");
    await expect(recap).toContainText("3 mois");
    await expect(recap).toContainText("Livraison");

    const whatsapp = form.getByRole("link", { name: /Préparer le message WhatsApp/ });
    const href = await whatsapp.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/2250554137777\?text=/);
    const text = decodeURIComponent(href ?? "");
    expect(text).toContain("Moto");
    expect(text).toContain("Achat");
    await expect(form.getByRole("link", { name: /Continuer par le formulaire/ })).toHaveAttribute("href", "/contact");

    // FAQ
    const faq = page.getByRole("button", { name: /Puis-je comparer location et achat/ });
    await faq.click();
    await expect(faq).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: /Échanger avec ONLOUTOU/ })).toHaveAttribute("href", "/contact");

    // Acquisition
    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Explorer l’acquisition/ }).click();
    await expect(page).toHaveURL(/\/solutions\/vente/);
  });

  test("ancres des familles et appels à l’action du hero", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/equipements#famille-camions-engins", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("tab", { name: /Camions & engins/ })).toHaveAttribute("aria-selected", "true");

    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /Présenter mon besoin/ }).click();
    await expect(page).toHaveURL(/#orientation-equipement$/);
  });

  test("mise en page mobile sans débordement horizontal", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile");
    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#eqp-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("méga-menu Articles & équipements", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Articles & équipements" }).hover();
    const panel = page.locator("#mega-equipements");
    await expect(panel.getByRole("link", { name: "Vue d'ensemble" }).first()).toHaveAttribute("href", "/equipements");
    await expect(panel.getByRole("link", { name: /Véhicules professionnels/ })).toHaveAttribute(
      "href",
      "/equipements/vehicules",
    );
    await expect(panel.getByRole("link", { name: /Camions & engins/ })).toHaveAttribute(
      "href",
      "/equipements/camions-engins",
    );
    await expect(panel.getByRole("link", { name: /Équipements connectés/ })).toHaveAttribute(
      "href",
      "/equipements/equipements-connectes",
    );
    await expect(panel.getByRole("link", { name: /Motos & deux-roues/ })).toHaveAttribute("href", "/equipements/motos");
    await expect(panel.getByRole("link", { name: /Outils & matériel/ })).toHaveAttribute(
      "href",
      "/equipements/outils-materiels",
    );
    await expect(panel.getByRole("link", { name: /Réception & événementiel/ })).toHaveAttribute(
      "href",
      /famille=reception/,
    );
    await expect(panel.getByRole("link", { name: /Je cherche un autre article/ })).toHaveAttribute(
      "href",
      /article=libre/,
    );
    await expect(panel.getByRole("link", { name: /Comparer les options/ })).toBeVisible();
    await expect(panel.getByText(/Disponibilité confirmée après étude du besoin/)).toBeVisible();
  });
});
