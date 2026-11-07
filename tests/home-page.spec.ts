import { expect, test, type Page } from "@playwright/test";

async function open(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Hydratation : le premier bouton interactif doit réagir aux clics.
  await expect
    .poll(() => page.locator(".hom-acc__trigger").first().evaluate((el) => Object.keys(el).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

test.describe("accueil (refonte)", () => {
  test("hero : textes, boutons et ancre Explorer", async ({ page }) => {
    await open(page);
    const hero = page.locator("section#accueil");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText("Qui loue tout");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText("en Côte d’Ivoire ?");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText("ONLOUTOU.");
    await expect(hero).toContainText("LOUER · ACHETER · CONNECTER · CONSTRUIRE".replace(/ · /g, " · ").toLowerCase(), { ignoreCase: true });
    await expect(hero).toContainText("Géolocalisation et projets numériques : nous vous accompagnons aussi.");
    await expect(hero.getByRole("link", { name: /Faire une demande de location/ })).toHaveAttribute("href", "/solutions/location");
    await expect(hero.getByRole("link", { name: /Équiper ma flotte en GPS/ })).toHaveAttribute("href", "/solutions/geolocalisation");
    await expect(hero.getByRole("link", { name: /Explorer/ })).toHaveAttribute("href", "#01");
    await expect(page.locator('[id="01"]')).toHaveCount(1);
    await expect(hero.locator(".hom-hero__photo img")).toHaveCount(1);
  });

  test("bandeau partenaires : logos conservés, libellés et lien", async ({ page }) => {
    await open(page);
    const band = page.locator(".hom-partners");
    await expect(band.getByRole("heading", { name: /relations qui font partie de notre parcours/i })).toBeVisible();
    await expect(band.locator("img")).toHaveCount(5);
    for (const alt of ["Logo de Banque Atlantique", "Logo de BNI", "Logo de ChapeChape Résidence", "Logo d’Orange", "Logo de Comoé Capital"]) {
      await expect(band.getByRole("img", { name: alt })).toHaveCount(1);
    }
    await expect(band.locator(".hom-partners__label")).toHaveText([
      "Géolocalisation",
      "Géolocalisation",
      "Projet ONLOUTOU",
      "Parcours",
      "Accompagnement 2019–2021",
    ]);
    await expect(band.getByRole("link", { name: /Découvrir notre histoire/ })).toHaveAttribute("href", "/a-propos");
  });

  test("01 Nos univers : l’accordéon change l’image et le texte", async ({ page }) => {
    await open(page);
    const section = page.locator("#univers");
    await expect(section).toContainText("Un besoin. Plusieurs façons de vous accompagner.");
    await expect(section.getByRole("link", { name: /Découvrir la location/ })).toHaveAttribute("href", "/solutions/location");
    await expect(section.locator(".hom-universes__caption.is-active")).toContainText("Mobilité, équipement, matériel.");
    await section.getByRole("button", { name: /Acheter/ }).click();
    await expect(section.getByRole("button", { name: /Acheter/ })).toHaveAttribute("aria-expanded", "true");
    await expect(section.getByRole("button", { name: /Louer/ })).toHaveAttribute("aria-expanded", "false");
    await expect(section.getByRole("link", { name: /Découvrir la vente/ })).toHaveAttribute("href", "/solutions/vente");
    await expect(section.locator(".hom-universes__img.is-active")).toHaveAttribute("src", /equipements-professionnels|hom-03/);
    await section.getByRole("button", { name: /Construire/ }).click();
    await expect(section.getByRole("link", { name: /Découvrir les plateformes/ })).toHaveAttribute("href", "/solutions/plateformes-sur-mesure");
    await expect(section).toContainText("Disponibilité et conditions confirmées après étude du besoin.");
  });

  test("02 Équipements : tuiles, liens rapides et demande", async ({ page }) => {
    await open(page);
    const section = page.locator("#equipements");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Location et vente, selon le terrain.");
    await expect(section.getByRole("link", { name: /Explorer les équipements/ })).toHaveAttribute("href", "/equipements");
    for (const title of ["Installation et mise en service", "Équipements professionnels", "Solutions logistiques", "Mobilité professionnelle"]) {
      await expect(section.locator("figcaption", { hasText: title })).toHaveCount(1);
    }
    const hrefs = await section.locator(".hom-equip__links a").evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/equipements/vehicules", "/equipements/motos", "/equipements/camions-engins", "/equipements/outils-materiels"]);
    await expect(section.getByRole("link", { name: /Un équipement particulier/ })).toHaveAttribute("href", "/equipements#orientation-equipement");
  });

  test("03 Géolocalisation : onglets synchronisés avec la maquette de supervision", async ({ page }) => {
    await open(page);
    const section = page.locator("#flotte");
    await expect(section.getByRole("heading", { level: 2 })).toContainText("Géolocalisez vos actifs.");
    await expect(section.getByRole("link", { name: /Découvrir l’offre GPS/ })).toHaveAttribute("href", "/solutions/geolocalisation");
    await expect(section).toContainText("Supervision de flotte");
    await expect(section).toContainText("DÉMONSTRATION");
    for (const text of ["Véhicule 1", "En activité", "Véhicule 2", "À l’arrêt", "Véhicule 3", "En déplacement", "Dernière position reçue", "Véhicule de démonstration", "Interface illustrative — données et positions fictives."]) {
      await expect(section).toContainText(text);
    }
    const panel = section.locator(".hom-geo-panel.is-active");
    await expect(panel).toHaveAttribute("data-tab", "localiser");
    await section.getByRole("tab", { name: /Alerter/ }).click();
    await expect(panel).toHaveAttribute("data-tab", "alerter");
    await expect(panel).toContainText("Sortie de zone détectée");
    await section.getByRole("tab", { name: /Analyser/ }).click();
    await expect(panel).toHaveAttribute("data-view", "liste");
    await section.getByRole("tab", { name: /Suivre/ }).click();
    await expect(panel).toHaveAttribute("data-view", "carte");
    await expect(section.getByRole("tab", { name: /Suivre/ })).toHaveAttribute("aria-selected", "true");
  });

  test("Sur le terrain : six gestes", async ({ page }) => {
    await open(page);
    const section = page.locator("#terrain");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Les gestes derrière la technologie.");
    await expect(section.locator("figcaption")).toHaveText(["Pose GPS", "Contrôle", "Préparation", "Mobilité", "Installation", "Coordination"]);
    await expect(section.locator("img")).toHaveCount(6);
  });

  test("04 méthode et 05 construire", async ({ page }) => {
    await open(page);
    const method = page.locator("#installation");
    await expect(method.getByRole("heading", { level: 2 })).toHaveText("Du terrain à la supervision, chaque étape compte.");
    await expect(method.getByRole("link", { name: /Découvrir notre méthode/ })).toHaveAttribute("href", "/expertise");
    await expect(method.locator(".hom-step")).toHaveCount(4);
    await expect(method).toContainText("01 · Cadrer le besoin");
    await expect(method).toContainText("Un accompagnement adapté au périmètre de votre projet.");
    const build = page.locator("#plateforme");
    await expect(build.getByRole("heading", { level: 2 })).toContainText("Plateformes et projets sur mesure");
    await expect(build.locator(".hom-module")).toHaveCount(6);
    await expect(build).toContainText("APA et OVPR : MVP · Sidsun : en développement");
    await expect(build.getByRole("link", { name: /Explorer nos projets/ })).toHaveAttribute("href", "/projets");
  });

  test("06 projets : cinq panneaux, ouverture volontaire (colonnes ≥ 900 px, accordéons en dessous)", async ({ page }) => {
    await open(page);
    const section = page.locator("#projets");
    const narrow = (page.viewportSize()?.width ?? 1440) < 900;
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Des projets construits pour le terrain.");
    await expect(section.getByRole("link", { name: /Voir nos réalisations/ })).toHaveAttribute("href", "/projets");
    await expect(section.locator(".hom-ptab")).toHaveText(["01 Mobilité", "02 Installation GPS", "03 Supervision", "04 Équipements", "05 Plateformes"]);
    await expect(section.locator(".hom-ppanel")).toHaveCount(5);
    await expect(section.locator(".hom-ppanel.is-open")).toContainText("Mobilité et équipements");
    await expect(section.locator(".hom-ppanel.is-open").getByRole("link")).toHaveAttribute("href", "/solutions/location#vehicules");
    const labels = section.locator(".hom-ppanel__label");
    await labels.nth(1).click();
    await expect(section.locator(".hom-ppanel.is-open").getByRole("link")).toHaveAttribute("href", "/solutions/geolocalisation#installation-terrain");
    await labels.nth(4).click();
    await expect(section.locator(".hom-ppanel.is-open").getByRole("link")).toHaveAttribute("href", "/projets#plateformes");
    await labels.nth(0).click();
    await expect(labels).toHaveCount(5);
    await expect(labels.nth(0)).toHaveAttribute("aria-expanded", "true");
    await labels.nth(2).click();
    await expect(section.locator(".hom-ppanel.is-open")).toContainText("Supervision de flotte");
    await expect(section.locator(".hom-ppanel.is-open")).toHaveCount(1);
    await expect(labels.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(labels.nth(0)).toHaveAttribute("aria-expanded", "false");
    await expect(section.locator(".hom-ppanel.is-open")).toContainText("Interface et données illustratives.");
    if (!narrow) {
      await section.locator(".hom-ptab", { hasText: "Équipements" }).click();
      await expect(section.locator(".hom-ppanel.is-open")).toContainText("Équipements");
      await expect(section.locator(".hom-ppanel").first()).toHaveCSS("transition-duration", "0.35s");
    }
  });

  test("06 projets : pas d'ouverture au survol ni au simple focus, clavier Entrée/Espace + flèches", async ({ page }) => {
    await open(page);
    const section = page.locator("#projets");
    const labels = section.locator(".hom-ppanel__label");
    await labels.nth(3).scrollIntoViewIfNeeded();
    await labels.nth(3).hover();
    await page.waitForTimeout(600);
    await expect(labels.nth(0)).toHaveAttribute("aria-expanded", "true");
    await expect(labels.nth(3)).toHaveAttribute("aria-expanded", "false");
    await labels.nth(1).focus();
    await page.waitForTimeout(400);
    await expect(labels.nth(1)).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("ArrowRight");
    await expect(labels.nth(2)).toBeFocused();
    await expect(labels.nth(2)).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    await expect(labels.nth(2)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("End");
    await expect(labels.nth(4)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(labels.nth(4)).toHaveAttribute("aria-expanded", "true");
    await expect(section.locator(".hom-ppanel.is-open")).toHaveCount(1);
  });

  test("06 projets : accordéons empilés sous 900 px, cinq colonnes au-dessus", async ({ page }) => {
    for (const width of [375, 768, 880, 1000, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await open(page);
      const panels = page.locator("#projets .hom-ppanel");
      await panels.first().scrollIntoViewIfNeeded();
      const boxes = await panels.evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
        }),
      );
      if (width < 900) {
        expect(new Set(boxes.map((box) => box.x)).size, `empilés à ${width}px`).toBe(1);
        expect(boxes[1].h, `panneau fermé à ${width}px`).toBe(68);
        await expect(page.locator("#projets .hom-ptabs")).toBeHidden();
        const label = page.locator("#projets .hom-ppanel__label").nth(1);
        await label.click();
        await expect(label).toHaveAttribute("aria-expanded", "true");
        await expect(page.locator("#projets .hom-ppanel__body").nth(1)).toBeVisible();
      } else {
        expect(new Set(boxes.map((box) => box.y)).size, `colonnes à ${width}px`).toBe(1);
        await expect(page.locator("#projets .hom-ptabs")).toBeVisible();
      }
    }
  });
  test("distinctions, barre BCP, entreprise et bandeau jaune", async ({ page }) => {
    await open(page);
    const recog = page.locator(".hom-recog");
    for (const text of ["Fintech Challenge BCP", "LAURÉAT · 2019", "Impact Camp", "SÉLECTION · 2019", "inwiDAYS", "FINALISTE · 2020", "Seedstars Abidjan", "PARTICIPATION · 2020"]) {
      await expect(recog).toContainText(text);
    }
    await expect(recog.getByRole("link", { name: /Découvrir notre parcours/ })).toHaveAttribute("href", "/a-propos#parcours");
    const yt = recog.getByRole("link", { name: /Voir sur YouTube/ });
    await expect(yt).toHaveAttribute("href", "https://youtu.be/eAJDidNcANw");
    await expect(yt).toHaveAttribute("target", "_blank");
    await expect(recog).toContainText("Vidéo publiée par Banque Populaire du Maroc · 2019");

    const company = page.locator("#a-propos");
    await expect(company.getByRole("heading", { level: 2 })).toContainText("Une histoire née sur le terrain");
    await expect(company).toContainText("Depuis 2016, ONLOUTOU développe des réponses aux besoins d’équipement, de géolocalisation et de projets numériques.");
    await expect(company).toContainText("Année de création");
    await expect(company).toContainText("Notre ancrage");
    await expect(company.getByRole("link", { name: /Découvrir ONLOUTOU/ })).toHaveAttribute("href", "/a-propos");
    await expect(company.getByRole("link", { name: /Rencontrer l’équipe/ })).toHaveAttribute("href", "/a-propos#about-team");
    await expect(company.getByRole("link", { name: /Découvrir le reportage/ })).toHaveAttribute("href", "/a-propos#reportage-canal");
    await expect(company.locator(".hom-company__photo img")).toHaveCount(3);

    const cta = page.locator("#contact");
    await expect(cta).toContainText("Un équipement à trouver ?");
    await expect(cta).toContainText("Un projet à faire avancer ?");
    await expect(cta.getByRole("link", { name: /Décrire mon besoin/ })).toHaveAttribute("href", "/contact");
    await expect(cta.getByRole("link", { name: /Échanger sur WhatsApp/ })).toHaveAttribute("href", "https://wa.me/2250554137777");
  });

  test("ancre « Explorer » : atteint la section 01", async ({ page }) => {
    await open(page);
    await page.locator("section#accueil").getByRole("link", { name: /Explorer/ }).click();
    await expect(page).toHaveURL(/#01$/);
    await expect(page.locator("#univers h2")).toBeInViewport();
  });

  test("le lien /a-propos#reportage-canal existe", async ({ page }) => {
    await page.goto("/a-propos#reportage-canal", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#reportage-canal")).toHaveCount(1);
  });

  test("pas de débordement horizontal", async ({ page }) => {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `débordement à ${width}px`).toBe(false);
    }
  });

  test("accents de titre : quelques mots seulement, jamais de phrase surlignée", async ({ page }) => {
    await open(page);
    const expected: Array<[string, string, string]> = [
      ["section#accueil h1", "box", "ONLOUTOU."],
      ["#flotte h2", "word", "opérations."],
      ["#installation h2", "line", "compte."],
      ["#plateforme h2", "word", "sur mesure."],
      ["#projets h2", "line", "terrain."],
    ];
    for (const [selector, variant, text] of expected) {
      const mark = page.locator(`${selector} .hom-mark`);
      await expect(mark, selector).toHaveCount(1);
      await expect(mark, selector).toHaveClass(new RegExp(`hom-mark--${variant}`));
      await expect(mark, selector).toHaveText(text);
    }
    await expect(page.locator(".hom-page .hom-mark")).toHaveCount(expected.length);
    // Titres sans accent : bandeau final noir simple, partenaires, 01, 02, terrain, distinctions, 07.
    for (const selector of ["#contact h2", ".hom-partners h2", "#univers h2", "#equipements h2", "#terrain h2", "#distinctions-accueil h2", "#a-propos h2"]) {
      await expect(page.locator(`${selector} .hom-mark`), selector).toHaveCount(0);
    }
    await expect(page.locator("#contact h2")).toHaveCSS("color", "rgb(17, 17, 17)");
    // Le titre reste un seul titre accessible.
    await expect(page.locator("#projets").getByRole("heading", { level: 2 })).toHaveText("Des projets construits pour le terrain.");
    await expect(page.locator("#installation").getByRole("heading", { level: 2 })).toHaveText("Du terrain à la supervision, chaque étape compte.");
  });

  test("titres : même échelle, même interligne, aucun saut de hauteur dû à l'accent", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page);
    const metrics = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".hom-page h2.hom-h2")).map((h) => {
        const style = getComputedStyle(h);
        return { id: h.id, size: style.fontSize, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing };
      }),
    );
    expect(metrics.length).toBeGreaterThanOrEqual(9);
    expect(new Set(metrics.map((m) => m.size)).size, JSON.stringify(metrics)).toBe(1);
    expect(new Set(metrics.map((m) => m.lineHeight)).size, JSON.stringify(metrics)).toBe(1);
    expect(new Set(metrics.map((m) => m.letterSpacing)).size, JSON.stringify(metrics)).toBe(1);
  });

  test("titres : aucun chevauchement (titre, accent, paragraphe, bouton) avant, pendant et après animation, à toutes les largeurs", async ({ page }) => {
    test.setTimeout(240_000);
    const measure = () => {
      const problems: string[] = [];
      const overlaps = (a: DOMRect, b: DOMRect, minHeight = 1) =>
        Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > minHeight;
      for (const heading of Array.from(document.querySelectorAll<HTMLElement>(".hom-page h1, .hom-page h2"))) {
        const box = heading.getBoundingClientRect();
        const name = (heading.textContent ?? "").trim().slice(0, 32);
        if (heading.scrollWidth > heading.clientWidth + 1) problems.push(`${name} : tronqué`);
        if (box.left < -1 || box.right > window.innerWidth + 1) problems.push(`${name} : déborde horizontalement`);
        const section = heading.closest("section");
        let current: Element | null = heading;
        let next: Element | null = null;
        while (current && current !== section) {
          if (current.nextElementSibling) {
            next = current.nextElementSibling;
            break;
          }
          current = current.parentElement;
        }
        const nextBox = next ? next.getBoundingClientRect() : null;
        if (nextBox && nextBox.height > 0 && overlaps(box, nextBox)) problems.push(`${name} : chevauche le bloc suivant`);
        // Rectangles des textes hors accent, pour détecter un accent qui recouvre une autre ligne.
        const texts: DOMRect[] = [];
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (node.parentElement?.closest(".hom-mark")) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          texts.push(...Array.from(range.getClientRects()));
        }
        const fontSize = parseFloat(getComputedStyle(heading).fontSize);
        // Seuls les accents qui peignent un fond (box, line) peuvent déborder : le mot jaune est du texte.
        for (const mark of Array.from(heading.querySelectorAll(".hom-mark--box, .hom-mark--line"))) {
          for (const rect of Array.from(mark.getClientRects())) {
            if (rect.top < box.top - 1 || rect.bottom > box.bottom + 1) problems.push(`${name} : accent hors du titre`);
            if (nextBox && nextBox.height > 0 && overlaps(rect, nextBox)) problems.push(`${name} : accent sur le bloc suivant`);
            if (texts.some((text) => overlaps(rect, text, fontSize * 0.25))) problems.push(`${name} : accent sur une autre ligne`);
          }
        }
      }
      return problems;
    };
    // 640 / 720 / 360 : équivalents d'un zoom navigateur à 200 % sur des fenêtres de 1280 / 1440 / 720 px.
    const widths = [320, 360, 375, 414, 600, 640, 720, 768, 900, 1024, 1100, 1200, 1300, 1440, 1600, 1920];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await open(page);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(measure), `avant animation @${width}px`).toEqual([]);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += 500) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(90);
        // « pendant » : mesure au milieu des transitions de révélation.
        expect(await page.evaluate(measure), `pendant animation @${width}px y=${y}`).toEqual([]);
      }
      await page.waitForTimeout(1300);
      expect(await page.evaluate(measure), `après animation @${width}px`).toEqual([]);
    }
  });

  test("sections : deux sections voisines ne partagent jamais le même fond (ou une limite nette)", async ({ page }) => {
    await open(page);
    const order = [".hom-partners", "#univers", "#equipements", "#flotte", "#terrain", "#installation", "#plateforme", "#projets", "#distinctions-accueil", "#a-propos", "#contact"];
    const styles = await page.evaluate(
      (selectors) =>
        selectors.map((selector) => {
          const style = getComputedStyle(document.querySelector(selector)!);
          return { selector, bg: style.backgroundColor, top: style.borderTopWidth, bottom: style.borderBottomWidth };
        }),
      order,
    );
    for (let i = 1; i < styles.length; i++) {
      const same = styles[i].bg === styles[i - 1].bg;
      expect(same, `${styles[i - 1].selector} / ${styles[i].selector}`).toBe(false);
    }
    // Rupture voulue après les plateformes sombres : projets clair.
    expect(styles.find((s) => s.selector === "#projets")?.bg).toBe("rgb(250, 248, 242)");
    expect(styles.find((s) => s.selector === "#contact")?.bg).toMatch(/^rgb\(24\d, 19\d, 0\)$/);
  });
  test("décors : étoiles et globe décoratifs, masqués aux lecteurs d'écran", async ({ page }) => {
    await open(page);
    for (const selector of [".hom-stars", ".hom-globe", ".hom-worlddots"]) {
      const decor = page.locator(selector);
      expect(await decor.count(), selector).toBeGreaterThan(0);
      for (let i = 0; i < (await decor.count()); i++) {
        await expect(decor.nth(i)).toHaveAttribute("aria-hidden", "true");
        await expect(decor.nth(i)).toHaveCSS("pointer-events", "none");
      }
    }
    await expect(page.locator("#flotte .hom-globe")).toHaveCount(1);
    expect((await page.request.get("/assets/decor/world-dots-yellow.svg")).ok()).toBe(true);
    expect((await page.request.get("/assets/decor/world-dots-ink.svg")).ok()).toBe(true);
  });

  test("mouvement réduit : tout est visible et immobile", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    await expect(page.locator(".hom-page")).not.toHaveClass(/hom-motion/);
    await expect(page.locator("[data-reveal]")).toHaveCount(0);
    await expect(page.locator("#projets .hom-mark")).toHaveCSS("animation-name", "none");
    await expect(page.locator(".hom-globe__map")).toHaveCSS("animation-name", "none");
    await expect(page.locator(".hom-worlddots")).toHaveCSS("animation-name", "none");
    const loops = await page.evaluate(() => {
      const running = (el: Element, pseudo?: string) => {
        const style = getComputedStyle(el, pseudo);
        return style.animationName !== "none" && style.animationIterationCount === "infinite";
      };
      return Array.from(document.querySelectorAll(".hom-page *")).filter((el) => running(el) || running(el, "::before") || running(el, "::after")).length;
    });
    expect(loops, "aucune boucle d'animation sous prefers-reduced-motion").toBe(0);
    // Le point pulsant d'Abidjan (SVG en arrière-plan) déclare aussi son propre arrêt.
    for (const name of ["yellow", "ink"]) {
      const svg = await (await page.request.get(`/assets/decor/world-dots-${name}.svg`)).text();
      expect(svg).toContain("prefers-reduced-motion");
    }
    await expect(page.locator("#equipements h2")).toBeVisible();
    await expect(page.locator("#equipements .hom-head")).toHaveCSS("opacity", "1");
  });

  test("révélation au défilement : les sections lointaines apparaissent quand on les atteint", async ({ page }) => {
    await open(page);
    await expect(page.locator(".hom-page")).toHaveClass(/hom-motion/);
    const head = page.locator("#projets .hom-head");
    await head.scrollIntoViewIfNeeded();
    await expect(head).toHaveAttribute("data-reveal", "in");
    await expect(head).toHaveCSS("opacity", "1");
  });

  test("aucune rotation automatique : Univers, GPS et Projets ne changent jamais seuls", async ({ page }) => {
    await open(page);
    const univers = page.locator("#univers");
    const geo = page.locator("#flotte");
    const projets = page.locator("#projets");
    const before = async () => ({
      acc: await univers.locator(".hom-acc__trigger[aria-expanded='true']").count(),
      accTitle: await univers.locator(".hom-acc__item.is-open .hom-acc__title").innerText(),
      tab: await geo.locator("[role=tab][aria-selected='true']").innerText(),
      project: await projets.locator(".hom-ppanel.is-open h3").innerText(),
    });
    const start = await before();
    await page.waitForTimeout(7000);
    expect(await before()).toEqual(start);
    // Aucun minuteur répétitif : l'état reste identique même après un défilement.
    await geo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(await before()).toEqual(start);
  });

  test("GPS (03) : onglets ARIA au clavier, tabindex itinérant, fondu 220 ms", async ({ page }) => {
    await open(page);
    const geo = page.locator("#flotte");
    const tablist = geo.getByRole("tablist");
    await expect(tablist).toHaveAttribute("aria-orientation", "vertical");
    const tabs = geo.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute("tabindex", "0");
    await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
    // Chaque onglet contrôle son propre panneau.
    for (let i = 0; i < 4; i++) {
      const controls = await tabs.nth(i).getAttribute("aria-controls");
      await expect(page.locator(`#${controls}`)).toHaveAttribute("role", "tabpanel");
    }
    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");
    await expect(tabs.nth(1)).toHaveAttribute("tabindex", "0");
    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowDown");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowUp");
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    // Un seul panneau visible ; durée de fondu 220 ms.
    await expect(geo.locator(".hom-geo-panel.is-active")).toHaveCount(1);
    await expect(geo.locator(".hom-geo-panel").first()).toHaveCSS("transition-duration", /0\.22s/);
    await expect(geo.getByRole("tabpanel")).toHaveCount(1);
    // Tab sort de la liste d'onglets (un seul arrêt de tabulation).
    await page.keyboard.press("Tab");
    await expect(tabs.nth(1)).not.toBeFocused();
    // Entrée / Espace sur un onglet focalisé : le bouton natif active l'onglet.
    await tabs.nth(2).focus();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "false");
    await page.keyboard.press("Enter");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(1).focus();
    await page.keyboard.press("Space");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  });

  test("hauteur stable : aucun saut de mise en page entre onglets GPS et entre univers", async ({ page }) => {
    await open(page);
    const height = (selector: string) => page.locator(selector).evaluate((el) => Math.round(el.getBoundingClientRect().height));
    const geo = page.locator("#flotte");
    const geoHeights = new Set<number>();
    for (const name of [/Localiser/, /Suivre/, /Alerter/, /Analyser/, /Localiser/]) {
      await geo.getByRole("tab", { name }).click();
      await page.waitForTimeout(350);
      geoHeights.add(await height("#flotte"));
    }
    expect([...geoHeights], "hauteur de la section 03").toHaveLength(1);
    const univers = page.locator("#univers");
    const accHeights = new Set<number>();
    const gridHeights = new Set<number>();
    for (const name of [/Louer/, /Acheter/, /Connecter/, /Construire/, /Louer/]) {
      await univers.getByRole("button", { name }).click();
      await page.waitForTimeout(400);
      accHeights.add(await height("#univers"));
      gridHeights.add(await height("#univers .hom-acc"));
    }
    expect([...accHeights], "hauteur de la section 01").toHaveLength(1);
    expect([...gridHeights], "hauteur de la liste 01").toHaveLength(1);
  });

  test("Univers (01) : clavier (flèches déplacent le focus, Entrée/Espace ouvrent) et fondu 220 ms", async ({ page }) => {
    await open(page);
    const univers = page.locator("#univers");
    const triggers = univers.locator(".hom-acc__trigger");
    await triggers.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(triggers.nth(1)).toBeFocused();
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("End");
    await expect(triggers.nth(3)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(triggers.nth(3)).toHaveAttribute("aria-expanded", "true");
    await expect(triggers.nth(1)).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Home");
    await expect(triggers.nth(0)).toBeFocused();
    await expect(univers.locator(".hom-universes__img").first()).toHaveCSS("transition-duration", "0.22s");
    await expect(univers.locator(".hom-universes__caption.is-active")).toHaveCount(1);
    await expect(univers.locator(".hom-acc__panel").first()).toHaveCSS("transition-property", /grid-template-rows/);
  });

  test("02 mosaïque et « Sur le terrain » : zoom d'image 2 % au plus, textes fixes", async ({ page }) => {
    await open(page);
    for (const [tile, img, caption] of [
      ["#equipements .hom-equip__tile", ".hom-equip__img", ".hom-equip__caption"],
      ["#terrain .hom-gestures__item", ".hom-gestures__img", "figcaption"],
    ]) {
      const item = page.locator(tile).first();
      await item.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      const captionBox = async () => item.locator(caption).first().evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), transform: getComputedStyle(el).transform };
      });
      const before = await captionBox();
      await item.hover();
      await page.waitForTimeout(700);
      const scale = await item.locator(img).evaluate((el) => {
        const matrix = new DOMMatrix(getComputedStyle(el).transform);
        return matrix.a;
      });
      expect(scale, `${tile} zoom`).toBeGreaterThan(1);
      expect(scale, `${tile} zoom`).toBeLessThanOrEqual(1.0201);
      expect(await captionBox(), `${tile} légende fixe`).toEqual(before);
      const itemTransform = await item.evaluate((el) => getComputedStyle(el).transform);
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(itemTransform);
    }
  });

  test("04 méthode : quatre étapes apparaissent une fois, puis plus aucune animation", async ({ page }) => {
    await open(page);
    const cycle = page.locator("#installation .hom-cycle");
    await cycle.scrollIntoViewIfNeeded();
    await expect(cycle).toHaveAttribute("data-reveal", "in");
    await page.waitForTimeout(1800);
    const state = () =>
      cycle.evaluate((el) => ({
        running: el.getAnimations({ subtree: true }).length,
        infinite: el.getAnimations({ subtree: true }).filter((a) => a.effect?.getComputedTiming().iterations === Infinity).length,
        opacities: Array.from(el.querySelectorAll(".hom-step")).map((step) => getComputedStyle(step).opacity),
        rects: Array.from(el.querySelectorAll(".hom-step")).map((step) => {
          const r = step.getBoundingClientRect();
          return `${Math.round(r.x)},${Math.round(r.y)}`;
        }),
      }));
    const first = await state();
    expect(first.running).toBe(0);
    expect(first.infinite).toBe(0);
    expect(first.opacities).toEqual(["1", "1", "1", "1"]);
    await page.waitForTimeout(1200);
    expect(await state()).toEqual(first);
  });

  test("révélation unique : après l'apparition, ni rejeu ni nouvel observateur", async ({ page }) => {
    await open(page);
    const head = page.locator("#projets .hom-head");
    await head.scrollIntoViewIfNeeded();
    await expect(head).toHaveAttribute("data-reveal", "in");
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await head.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    expect(await head.evaluate((el) => el.getAnimations().length), "pas de rejeu").toBe(0);
    await expect(head).toHaveAttribute("data-reveal", "in");
    await expect(head).toHaveCSS("opacity", "1");
  });

  test("vidéos : aucune lecture automatique sur l'accueil", async ({ page }) => {
    await open(page);
    await expect(page.locator("video[autoplay]")).toHaveCount(0);
    await expect(page.locator("iframe[src*='autoplay=1'], iframe[src*='autoplay=true']")).toHaveCount(0);
    const playing = await page.evaluate(() => Array.from(document.querySelectorAll("video")).filter((video) => !video.paused).length);
    expect(playing).toBe(0);
    // La vidéo (reportage Canal+/BCP) n'est qu'un lien externe : lecture sur action de l'utilisateur.
    await expect(page.locator(".hom-recog").getByRole("link", { name: /Voir sur YouTube/ })).toHaveAttribute("target", "_blank");
  });
});
