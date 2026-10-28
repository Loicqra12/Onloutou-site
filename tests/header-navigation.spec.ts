import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { headerNavigation } from "@/content/header-navigation";
import type { MegaMenuConfig } from "@/types/navigation";

// Captures hors dépôt (test-results/ est ignoré par Git).
const OUT = path.join("test-results", "navigation");

const menus = headerNavigation.filter((item) => item.type === "menu");
const menuIds = menus.map((item) => item.id);

async function shot(page: Page, name: string) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name) });
}

async function openHome(page: Page, width = 1440, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(`/?nav=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("header.site-header")).toBeVisible();
}

const trigger = (page: Page, id: string) => page.locator(`button[aria-controls="mega-${id}"]`);

/** Survole le bouton jusqu'à l'ouverture (tolère l'hydratation tardive de React). */
async function hoverOpen(page: Page, id: string) {
  await expect(async () => {
    await page.mouse.move(700, 650);
    await trigger(page, id).hover();
    await expect(trigger(page, id)).toHaveAttribute("aria-expanded", "true", { timeout: 800 });
  }).toPass({ timeout: 15_000 });
}

function menuHrefs(menu: MegaMenuConfig): string[] {
  return [
    menu.overview?.href,
    ...menu.groups.flatMap((g) => [g.items.length === 0 ? g.href : undefined, ...g.items.map((e) => (e.type === "link" ? e.href : undefined))]),
    ...(menu.aside?.items ?? []).map((e) => (e.type === "link" ? e.href : undefined)),
    menu.promo?.cta.href,
    menu.visual?.cta?.href,
    ...(menu.cards ?? []).map((c) => c.href),
    menu.footer?.cta?.href,
  ].filter((href): href is string => Boolean(href));
}

test.describe("navigation — desktop", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "scénarios desktop");
  });

  test("six menus : ouverture au survol, exclusivité, centrage, position et Échap", async ({ page }) => {
    await openHome(page);
    await shot(page, "closed-1440.png");

    for (const id of menuIds) {
      await hoverOpen(page, id);
      const panel = page.locator(`#mega-${id}`);
      await expect(panel).toBeVisible();
      await expect(trigger(page, id)).toHaveAttribute("aria-expanded", "true");
      for (const other of menuIds.filter((value) => value !== id)) {
        await expect(page.locator(`#mega-${other}`)).toBeHidden();
      }

      await page.waitForTimeout(260); // fin de l'animation d'entrée
      const surface = (await panel.locator(".mega-surface").boundingBox())!;
      const header = (await page.locator("header.site-header").boundingBox())!;
      expect(Math.abs(surface.x + surface.width / 2 - 720), `${id} centré`).toBeLessThanOrEqual(1);
      expect(surface.y - (header.y + header.height), `${id} sous la navbar`).toBeGreaterThanOrEqual(0);
      expect(surface.y - (header.y + header.height), `${id} collé à la navbar`).toBeLessThanOrEqual(12);
      expect(surface.x).toBeGreaterThanOrEqual(0);
      expect(surface.x + surface.width).toBeLessThanOrEqual(1440);
      await shot(page, `menu-${id}-1440.png`);

      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
    }
  });

  test("barre utilitaire : repli réel au scroll, sans décalage ni espace résiduel", async ({ page }) => {
    await openHome(page);
    const main = page.locator("#contenu-principal");
    const utility = page.locator(".site-header-utility");
    const bar = page.locator(".site-header-bar");

    const utilityHeight = (await utility.boundingBox())!.height;
    expect(utilityHeight).toBeLessThanOrEqual(34);
    const mainTop = (await main.boundingBox())!.y;

    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await page.waitForTimeout(200);

    const utilityBox = (await utility.boundingBox())!;
    expect(utilityBox.y + utilityBox.height, "barre utilitaire hors écran").toBeLessThanOrEqual(0.5);
    expect(Math.abs((await bar.boundingBox())!.y), "navbar collée en haut").toBeLessThanOrEqual(0.5);
    // le contenu défile exactement du même montant : aucun saut de mise en page
    expect(Math.abs((await main.boundingBox())!.y - (mainTop - 600))).toBeLessThanOrEqual(1);

    for (const id of menuIds) {
      await hoverOpen(page, id);
      await expect(page.locator(`#mega-${id}`)).toBeVisible();
      await page.waitForTimeout(260);
      const header = (await page.locator("header.site-header").boundingBox())!;
      const surface = (await page.locator(`#mega-${id} .mega-surface`).boundingBox())!;
      expect(surface.y - (header.y + header.height)).toBeLessThanOrEqual(12);
      await shot(page, `menu-${id}-scrolled-1440.png`);
      await page.keyboard.press("Escape");
    }
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.move(700, 700);
    await shot(page, "closed-scrolled-1440.png");

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    expect((await utility.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  });

  test("états distincts : page active, menu ouvert, survol, focus clavier", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/equipements", { waitUntil: "domcontentloaded" });
    const active = trigger(page, "equipements");
    const other = trigger(page, "projets");

    await expect(active).toHaveClass(/is-current/);
    await expect(active).toHaveAttribute("aria-current", "page");
    await expect(other).not.toHaveClass(/is-current/);
    const underline = await active.evaluate((el) => getComputedStyle(el, "::after").transform);
    expect(underline).not.toBe("none");
    expect(underline).toMatch(/matrix\(1,/);

    const bg = (el: Element) => getComputedStyle(el).backgroundColor;
    const idle = await other.evaluate(bg);
    await hoverOpen(page, "projets"); // le menu s'ouvre : fond « ouvert »
    await expect(other).toHaveClass(/is-open/);
    const open = await other.evaluate(bg);
    expect(open).not.toBe(idle);
    await expect(other).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await page.mouse.move(700, 600);
    await page.waitForTimeout(300);

    await page.locator(".site-nav-link").first().hover();
    await page.waitForTimeout(300); // fin de la transition de fond
    const hover = await page.locator(".site-nav-link").first().evaluate(bg);
    expect(hover).not.toBe(idle);
    expect(hover).not.toBe(open);

    await page.mouse.move(700, 600);
    await page.keyboard.press("Tab");
    await page.locator(".site-nav-link").first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(trigger(page, "solutions")).toBeFocused();
    const outline = await trigger(page, "solutions").evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).toBe("solid");
  });

  test("clavier : Entrée, ↓, Tab, ← →, Échap", async ({ page }) => {
    await openHome(page);
    const solutions = trigger(page, "solutions");
    const panel = page.locator("#mega-solutions");

    await solutions.focus();
    await page.keyboard.press("Enter");
    await expect(solutions).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();

    await page.keyboard.press("Tab"); // le focus entre dans le panneau, avant le menu suivant
    await expect(panel.locator("a").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(panel.locator("a").nth(1)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(panel.locator("a").first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(solutions).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(panel).toBeVisible();
    await expect(panel.locator("a").first()).toBeFocused();
    await page.keyboard.press("Escape");

    await page.keyboard.press("ArrowRight");
    await expect(trigger(page, "equipements")).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(solutions).toBeFocused();

    // Sortie du panneau par Tab : il se referme.
    await page.keyboard.press("Enter");
    await expect(panel).toBeVisible();
    for (let i = 0; i < 16; i += 1) await page.keyboard.press("Tab");
    await expect(panel).toBeHidden();
  });

  test("clic : bascule sans survol, clic extérieur ferme, lien de panneau navigue", async ({ page }) => {
    await openHome(page);
    await trigger(page, "partenaires").click();
    await expect(page.locator("#mega-partenaires")).toBeVisible();
    await page.mouse.click(40, 700);
    await expect(page.locator("#mega-partenaires")).toBeHidden();

    await hoverOpen(page, "solutions");
    await page.locator("#mega-solutions").getByRole("link", { name: "Géolocalisation", exact: true }).click();
    await expect(page).toHaveURL(/\/solutions\/geolocalisation$/);
    await expect(page.locator("#mega-solutions")).toBeHidden();
  });

  test("Partenaires : futurs espaces cliquables, badge conservé, carte compacte", async ({ page }) => {
    await openHome(page);
    await hoverOpen(page, "partenaires");
    const card = page.locator("#mega-partenaires .mega-aside-card");
    await expect(card).toBeVisible();
    await expect(card.getByText("En préparation")).toHaveCount(2);
    await expect(card.getByRole("link", { name: /Découvrir le futur espace partenaire/ })).toHaveAttribute("href", "/espace-partenaire");
    await expect(card.getByRole("link", { name: /Découvrir le futur espace livreur/ })).toHaveAttribute("href", "/espace-livreur");
    await expect(card).toContainText("Pages de présentation");
    expect((await card.boundingBox())!.height).toBeLessThan(340);
    await shot(page, "partenaires-espaces.png");
    await card.getByRole("link", { name: /futur espace livreur/ }).click();
    await expect(page).toHaveURL(/\/espace-livreur$/);
    await expect(page.getByRole("heading", { level: 1, name: "Un outil simple pour organiser le terrain." })).toBeVisible();
    await expect(page.getByText("Espace livreur en préparation").first()).toBeVisible();
  });

  test("mouvement réduit : pas d'animation d'ouverture", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openHome(page);
    await trigger(page, "solutions").click();
    const animation = await page.locator("#mega-solutions").evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
  });
});

/** Ancres résolues par script (ouvrent un onglet de la page cible) : vérifiées dans le navigateur plus bas. */
const SCRIPTED_ANCHORS = new Set(["/projets#plateformes", "/projets#mobilite", "/projets#supervision"]);

test.describe("navigation — contenu, liens et ancres", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "vérification de données");
  });

  test("aucun lien répété dans un même menu", () => {
    for (const item of menus) {
      if (item.type !== "menu") continue;
      const hrefs = menuHrefs(item.menu);
      expect(new Set(hrefs).size, `liens dupliqués dans ${item.id}: ${hrefs.join(", ")}`).toBe(hrefs.length);
    }
  });

  test("toutes les routes répondent 200 et chaque ancre existe dans la page cible", async ({ request }) => {
    const hrefs = new Set<string>(["/", "/contact"]);
    for (const item of headerNavigation) {
      hrefs.add(item.href);
      if (item.type === "menu") menuHrefs(item.menu).forEach((href) => hrefs.add(href));
    }

    const pages = new Map<string, string>();
    const failures: string[] = [];
    for (const href of hrefs) {
      const [route, hash] = href.split("#");
      if (!pages.has(route)) {
        const response = await request.get(route);
        if (response.status() !== 200) {
          failures.push(`${href} → HTTP ${response.status()}`);
          continue;
        }
        pages.set(route, await response.text());
      }
      if (hash && !SCRIPTED_ANCHORS.has(href) && !new RegExp(`\\sid="${hash}"`).test(pages.get(route) ?? "")) {
        failures.push(`${href} → ancre #${hash} introuvable`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});

test.describe("navigation — le contenu atteint correspond au libellé", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "vérification de contenu");
  });

  /** Le titre cible doit être lisible : sous l'en-tête fixe et dans la fenêtre. */
  async function expectInViewport(page: Page, selector: string) {
    await page.waitForTimeout(2000); // laisse la mise en page se stabiliser (sections améliorées à l'hydratation)
    await expect(async () => {
      const headerBottom = (await page.locator("header.site-header").boundingBox())!.y + (await page.locator("header.site-header").boundingBox())!.height;
      const box = await page.locator(selector).first().boundingBox();
      expect(box, `${selector} introuvable`).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(headerBottom - 1);
      expect(box!.y).toBeLessThan(700);
    }).toPass({ timeout: 10_000 });
  }

  test("Équipements › Comparer les options → comparaison acheter / louer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/vente#acheter-ou-louer");
    await expect(page.getByRole("heading", { level: 2, name: /Acheter ou louer : partir de l.usage/ })).toBeVisible();
    await expectInViewport(page, "#acheter-ou-louer h2");
    const section = page.locator("#acheter-ou-louer");
    await expect(section).toContainText("Acquisition");
    await expect(section).toContainText("Location");
    await expect(section).toContainText("Investissement");
  });

  test("Expertise › Déploiement terrain → étape « 04 Déploiement »", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/expertise#deploiement");
    const card = page.locator("#deploiement");
    await expect(card.getByRole("heading", { name: "Déploiement" })).toBeVisible();
    await expect(card).toContainText("Installation sur le terrain");
    await expectInViewport(page, "#deploiement h3");
  });

  test("Expertise › Cadrage du projet → étape « 01 Cadrage »", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/expertise#cadrage");
    const card = page.locator("#cadrage");
    await expect(card.getByRole("heading", { name: "Cadrage" })).toBeVisible();
    await expect(card).toContainText("Compréhension du besoin");
    await expectInViewport(page, "#cadrage h3");
  });

  test("Expertise › Installation & paramétrage → section d'installation de la géolocalisation", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/solutions/geolocalisation#installation-terrain");
    const section = page.locator("#installation-terrain");
    await expect(section.getByRole("heading", { level: 2, name: "Installer, contrôler, mettre en service." })).toBeVisible();
    await expect(section.getByText("Paramétrage", { exact: true })).toBeVisible();
    await expectInViewport(page, "#installation-terrain h2");
  });

  test("Expertise › Formation & accompagnement → étape « 06 Transfert et suivi »", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/expertise#transfert-suivi");
    const card = page.locator("#transfert-suivi");
    await expect(card.getByRole("heading", { name: "Transfert et suivi" })).toBeVisible();
    await expect(card).toContainText("Formation");
    await expectInViewport(page, "#transfert-suivi h3");
  });

  test("Projets › Plateformes sur mesure → domaine « Plateformes et outils métier »", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projets#plateformes");
    const tab = page.getByRole("tab", { name: /Plateformes et outils métier/ });
    await expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = page.locator(".proj-domains__panel--active");
    await expect(panel).toContainText("Plateformes et outils métier");
    await expect(panel).toContainText("Application mobile");
    await expect(panel.getByRole("link", { name: "Plateformes sur mesure" })).toBeVisible();
    await expectInViewport(page, "#domaines-projets h2");
  });

  test("Projets : le lien du menu ouvre le bon domaine depuis la page elle-même", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projets");
    await page.getByRole("tab", { name: /Supervision de flotte/ }).click();
    await expect(page.getByRole("tab", { name: /Supervision de flotte/ })).toHaveAttribute("aria-selected", "true");
    await hoverOpen(page, "projets");
    await page.locator("#mega-projets").getByRole("link", { name: /Plateformes sur mesure/ }).click();
    await expect(page.getByRole("tab", { name: /Plateformes et outils métier/ })).toHaveAttribute("aria-selected", "true");
    await expectInViewport(page, "#domaines-projets h2");
  });

  test("Projets : « Supervision de flotte » et « Mobilité professionnelle » ouvrent leur domaine", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projets#supervision");
    await expect(page.getByRole("tab", { name: /Supervision de flotte/ })).toHaveAttribute("aria-selected", "true");
    await page.goto("/projets#mobilite");
    await expect(page.getByRole("tab", { name: /Mobilité professionnelle/ })).toHaveAttribute("aria-selected", "true");
  });

  test("futurs espaces : pages de présentation explicites", async ({ page }) => {
    await page.goto("/espace-partenaire");
    await expect(page.getByRole("heading", { level: 1, name: /Piloter ses offres/ })).toBeVisible();
    await expect(page.getByText("Espace partenaire en préparation").first()).toBeVisible();
    await expect(page.getByText("sans connexion ni données réelles")).toBeVisible();
    await page.goto("/espace-livreur");
    await expect(page.getByRole("heading", { level: 1, name: /outil simple pour organiser le terrain/ })).toBeVisible();
    await expect(page.getByText("Espace livreur en préparation").first()).toBeVisible();
    await expect(page.getByText("sans connexion, sans mission ni position réelle")).toBeVisible();
  });
});

test.describe("navigation — responsive", () => {
  test("aucun débordement horizontal et bascule desktop/mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "largeurs pilotées par le test");
    for (const [width, height] of [
      [1440, 900],
      [1280, 800],
      [1200, 800],
      [1199, 800],
      [1024, 768],
      [768, 1024],
      [390, 844],
      [375, 812],
    ]) {
      await openHome(page, width, height);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `débordement à ${width}px`).toBeLessThanOrEqual(0);
      if (width >= 1200) {
        await expect(page.locator(".site-nav-desktop")).toBeVisible();
        await expect(page.locator(".site-header-toggle")).toBeHidden();
        await expect(page.locator(".site-header-cta")).toBeVisible();
        // la navbar tient sur une ligne
        const list = (await page.locator(".site-nav-list").boundingBox())!;
        expect(list.height).toBeLessThanOrEqual(80);
      } else {
        await expect(page.locator(".site-nav-desktop")).toBeHidden();
        await expect(page.locator(".site-header-toggle")).toBeVisible();
      }
      if (width === 1200 || width === 1024) await shot(page, `header-${width}.png`);
    }
  });

  test("menu mobile : accordéons longs ouverts, fermeture toujours accessible", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "viewport piloté par le test");
    await openHome(page, 390, 700);
    const toggle = page.locator(".site-header-toggle");
    const drawer = page.locator(".site-nav-mobile");

    await toggle.click();
    await expect(drawer).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await shot(page, "mobile-390-open.png");

    for (const item of menus) {
      await page.locator(".site-mobile-trigger", { hasText: item.label }).click();
      await expect(page.locator(`#mobile-${item.id}`)).toBeVisible();
    }
    await shot(page, "mobile-390-accordions.png");

    // le défilement se fait dans le tiroir ; la page derrière est verrouillée
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    expect(await drawer.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    await drawer.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await page.waitForTimeout(150);
    await shot(page, "mobile-390-accordions-bottom.png");

    const close = page.locator(".site-mobile-close");
    await expect(close).toBeInViewport();
    await expect(toggle).toBeInViewport();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const drawerOverflow = await drawer.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(drawerOverflow).toBeLessThanOrEqual(0);

    await close.click();
    await expect(drawer).toBeHidden();
    await expect(toggle).toBeFocused();

    // Échap ferme aussi, et la croix de la barre reste utilisable
    await toggle.click();
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await toggle.click();
    await toggle.click();
    await expect(drawer).toBeHidden();
  });

  test("menu mobile : navigation vers un lien d'accordéon", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "viewport piloté par le test");
    await openHome(page, 375, 812);
    await page.locator(".site-header-toggle").click();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
    await page.locator(".site-nav-mobile").getByRole("link", { name: "Gestion de flotte", exact: true }).click();
    await expect(page).toHaveURL(/\/solutions\/gestion-de-flotte$/);
    await expect(page.locator(".site-nav-mobile")).toBeHidden();
  });
});

test.describe("navigation — mobile tactile", () => {
  test("appui : ouverture, accordéons, fermeture et lien", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "projet mobile tactile");
    await page.goto(`/?nav=${Date.now()}`, { waitUntil: "load" });
    const toggle = page.locator(".site-header-toggle");
    const drawer = page.locator(".site-nav-mobile");

    await expect(page.locator(".site-nav-desktop")).toBeHidden();
    await expect(async () => {
      await toggle.tap();
      await expect(drawer).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });

    for (const item of menus) {
      await page.locator(".site-mobile-trigger", { hasText: item.label }).tap();
      await expect(page.locator(`#mobile-${item.id}`)).toBeVisible();
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(toggle).toBeInViewport();
    await toggle.tap();
    await expect(drawer).toBeHidden();

    await toggle.tap();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).tap();
    await page.locator(".site-nav-mobile").getByRole("link", { name: "Gestion de flotte", exact: true }).tap();
    await expect(page).toHaveURL(/\/solutions\/gestion-de-flotte$/);
  });
});
