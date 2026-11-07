import { test, expect } from "@playwright/test";

test.describe("page géolocalisation", () => {
  test("hero, repères, onglets, fonctionnalités, usages, installation, FAQ et liens", async ({ page }, testInfo) => {
    await page.goto("/solutions/geolocalisation", { waitUntil: "domcontentloaded" });

    const title = page.locator("#glx-hero-title");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Gardez");
    await expect(title).toContainText("le lien avec");
    await expect(title).toContainText("vos véhicules.");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByText("Aperçu illustratif", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Étudier mon besoin/ })).toHaveAttribute("href", "/contact?need=gps");

    const strip = page.getByRole("region", { name: "Repères de la solution" });
    await expect(strip).toContainText("Installation terrain");
    await expect(strip).toContainText("Positions & historique");
    await expect(strip).toContainText("Alertes et géozones");
    await expect(strip).toContainText("Supervision des actifs");

    if (testInfo.project.name === "desktop") {
      await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
      await expect(page.locator("#mega-solutions")).toBeVisible();
      const geoLink = page.locator("#mega-solutions").getByRole("link", { name: "Géolocalisation", exact: true });
      await expect(geoLink).toHaveAttribute("href", "/solutions/geolocalisation");
      await page.mouse.move(10, 600);
    }

    // Onglets Localisation / Supervision
    const platform = page.locator("#plateforme");
    await platform.scrollIntoViewIfNeeded();
    await expect(platform.getByRole("img", { name: /géolocalisation de flotte à Abidjan/ })).toBeVisible();
    await platform.getByRole("tab", { name: "Supervision" }).click();
    await expect(platform.getByRole("tab", { name: "Supervision" })).toHaveAttribute("aria-selected", "true");
    await expect(platform.getByRole("img", { name: /supervision de flotte/ })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(platform.getByRole("tab", { name: "Localisation" })).toHaveAttribute("aria-selected", "true");

    // Fonctionnalités
    const features = page.locator("#alertes");
    await expect(features.getByRole("heading", { level: 2 })).toContainText("Les informations qui comptent.");
    await expect(features.getByRole("heading", { level: 3 })).toHaveCount(8);

    // Usages
    await expect(page.getByRole("link", { name: /Flottes professionnelles/ })).toHaveAttribute("href", "/solutions/gestion-de-flotte");
    await expect(page.getByRole("link", { name: /Logistique & livraison/ })).toHaveAttribute("href", "/livraison");
    await expect(page.getByRole("link", { name: /Équipements mobiles/ })).toHaveAttribute("href", "/solutions/securisation-actifs");
    await expect(page.getByRole("link", { name: /Projets spécifiques/ })).toHaveAttribute("href", "/solutions/plateformes-sur-mesure");

    // Installation
    const install = page.locator("#installation-terrain");
    await expect(install.getByRole("heading", { level: 2 })).toContainText("Installer.");
    await expect(install.getByRole("heading", { level: 3 })).toHaveCount(6);
    await expect(page.getByRole("link", { name: /Découvrir la gestion de flotte/ })).toHaveAttribute("href", "/solutions/gestion-de-flotte");

    // FAQ
    const q1 = page.getByRole("button", { name: /Est-ce compatible avec tous les véhicules/ });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    const q2 = page.getByRole("button", { name: /Peut-on suivre plusieurs véhicules/ });
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");

    // CTA et « À explorer aussi »
    await expect(page.getByRole("link", { name: /Appeler ONLOUTOU/ })).toHaveAttribute("href", /^tel:\+225/);
    const explore = page.getByRole("navigation", { name: "À explorer aussi" });
    for (const href of [
      "/solutions/location",
      "/solutions/vente",
      "/solutions/gestion-de-flotte",
      "/solutions/securisation-actifs",
      "/solutions/plateformes-sur-mesure",
    ]) {
      await expect(explore.locator(`a[href="${href}"]`)).toHaveCount(1);
    }

    // Sections visibles après scroll
    for (const id of ["glx-hero-title", "glx-process-title", "glx-platform-title", "glx-install-title", "glx-cta-title"]) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
    }
  });

  test("aucun débordement horizontal", async ({ page }) => {
    await page.goto("/solutions/geolocalisation", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#glx-hero-title")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("méga-menu mobile — lien géolocalisation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "navigation mobile");
    await page.goto("/");
    await page.locator(".site-header-toggle").click();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
    const link = page.locator(".site-nav-mobile").getByRole("link", { name: "Géolocalisation", exact: true });
    await expect(link).toHaveAttribute("href", "/solutions/geolocalisation");
  });
});
