import { expect, test, type Page } from "@playwright/test";

async function waitForHydration(page: Page, selector: string) {
  await expect
    .poll(() => page.locator(selector).first().evaluate((node) => Object.keys(node).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

const desktopOnly = (testInfo: { project: { name: string } }) => testInfo.project.name !== "desktop";

test.describe("page À propos (refonte)", () => {
  test("hero, sous-navigation et ancres", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Le terrain comme point de départ.");
    await expect(h1).toContainText("La technologie pour aller plus loin.");
    await expect(page.getByText("À PROPOS D’ONLOUTOU")).toBeVisible();
    await expect(page.getByRole("link", { name: /Découvrir notre parcours/ })).toHaveAttribute("href", "#parcours");
    await expect(page.getByRole("link", { name: /Rencontrer l’équipe/ })).toHaveAttribute("href", "#about-team");

    const subnav = page.getByRole("navigation", { name: "Sur cette page" });
    await expect(subnav.getByRole("link")).toHaveText(["Notre approche", "Notre histoire", "L’équipe", "Nos projets"]);
    for (const id of [
      "about-principles", "parcours", "distinctions", "accompagnement", "presse",
      "about-team", "archives", "ecosysteme", "about-implantation", "about-references",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("sous-navigation : défilement vers l’histoire et l’équipe", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    await page.getByRole("navigation", { name: "Sur cette page" }).getByRole("link", { name: "Notre histoire" }).click();
    await expect(page).toHaveURL(/#parcours$/);
    await expect(page.locator("#parcours h2")).toBeInViewport();
    await page.getByRole("navigation", { name: "Sur cette page" }).getByRole("link", { name: "L’équipe" }).click();
    await expect(page).toHaveURL(/#about-team$/);
    await expect(page.locator("#about-team h2")).toBeInViewport();
  });

  test("reportage Canal : vidéo native à la demande", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    await waitForHydration(page, ".abt-canal__cover");
    await expect(page.getByRole("heading", { level: 2, name: "Découvrez ONLOUTOU dans un reportage Canal." })).toBeVisible();
    const video = page.locator("video.abt-canal__video");
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).toHaveAttribute("poster", /reportage-canal-poster\.jpg$/);
    expect(await video.evaluate((node: HTMLVideoElement) => node.controls)).toBe(true);
    await expect(video.locator("source")).toHaveAttribute("src", /VID-20261101-WA0017\.mp4$/);
    await expect(page.getByText("REPORTAGE CANAL", { exact: true })).toBeVisible();
    await expect(page.getByText("3 min")).toBeVisible();
    await expect(page.getByText("Lecture à la demande")).toBeVisible();
    await page.getByRole("button", { name: /Regarder le reportage/ }).click();
    await expect(page.locator(".abt-canal__cover")).toHaveCount(0);
  });

  test("parcours, reconnaissance et vidéo BCP (intégration au clic)", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos#parcours", { waitUntil: "domcontentloaded" });
    await waitForHydration(page, ".abt-bcp__load");
    const history = page.locator("#parcours");
    await expect(history.getByRole("heading", { level: 2, name: "Un parcours construit étape par étape." })).toBeVisible();
    await expect(history.locator(".abt-timeline__year")).toHaveText(["2016", "2019", "2019", "2021"]);
    await expect(history).toContainText("Entrée au portefeuille de Comoé Capital.");
    await expect(history).toContainText("Sortie du portefeuille de Comoé Capital.");
    await expect(history).toContainText("Repères documentés : Comoé Capital · Groupe BCP");

    const recognition = page.locator("#distinctions");
    await expect(recognition.getByRole("heading", { level: 2, name: "Des étapes de reconnaissance." })).toBeVisible();
    await expect(recognition.locator(".abt-tag")).toHaveText(["LAURÉAT", "SÉLECTIONNÉ", "FINALISTE", "PARTICIPANT"]);
    await expect(recognition).toContainText("Fintech Challenge — Groupe BCP");
    await expect(recognition).toContainText("Seedstars Abidjan");

    await expect(page.locator("iframe")).toHaveCount(0);
    await page.locator("#accompagnement").getByRole("button", { name: /Lire la vidéo/ }).click();
    const frame = page.locator("#accompagnement iframe");
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveAttribute("src", /^https:\/\/www\.youtube-nocookie\.com\/embed\/eAJDidNcANw/);
    await expect(page.locator("iframe")).toHaveCount(1);
    const official = page.getByRole("link", { name: /Voir la vidéo officielle/ });
    await expect(official).toHaveAttribute("href", "https://youtu.be/eAJDidNcANw");
    await expect(official).toHaveAttribute("rel", /noopener/);
    await expect(page.getByText("Vidéo publiée par Banque Populaire du Maroc · 31 décembre 2019")).toBeVisible();
  });

  test("« Pour aller plus loin » : URL existantes uniquement", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos", { waitUntil: "domcontentloaded" });
    const bar = page.getByRole("navigation", { name: "Pour aller plus loin" });
    const links = bar.getByRole("link");
    await expect(links).toHaveText([/Comoé Capital/, /We Are Tech Africa · 2022/, /Seedstars · 2020/]);
    await expect(links.nth(0)).toHaveAttribute("href", "https://comoecapital.com/portefeuille/onloutou/");
    await expect(links.nth(1)).toHaveAttribute("href", /^https:\/\/www\.wearetech\.africa\//);
    await expect(links.nth(2)).toHaveAttribute("href", "https://www.seedstarsworld.com/event/seedstars-abidjan-2020/");
    for (let i = 0; i < 3; i++) {
      await expect(links.nth(i)).toHaveAttribute("target", "_blank");
      await expect(links.nth(i)).toHaveAttribute("rel", /noopener/);
    }
  });

  test("équipe : cinq membres, noms et fonctions de la maquette", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos#about-team", { waitUntil: "domcontentloaded" });
    const team = page.locator("#about-team");
    await expect(team.getByRole("heading", { level: 2, name: "Des compétences complémentaires, un engagement commun." })).toBeVisible();
    await expect(team.getByRole("heading", { level: 3 })).toHaveText([
      "Adams Ousmane Diaby",
      "Seri Djati Stéphane",
      "Sidney Jordan",
      "Kaboré Hervé",
      "El Hadj Sadou Coulibaly",
    ]);
    await expect(team).toContainText("Fondateur · Président-directeur général");
    await expect(team).toContainText("Sous-directeur");
    await expect(team).toContainText("Finance & relations partenaires");
    await expect(team.getByRole("link", { name: /LinkedIn de Adams Ousmane Diaby/ })).toHaveAttribute("href", /linkedin\.com\/in\/ousmane-adams-diaby/);
    await expect(team.getByRole("link", { name: /GitHub de Sidney Jordan/ })).toHaveAttribute("href", "https://github.com/Loicqra12");
    await expect(team).toContainText("Direction technique & projets");
    await expect(team).toContainText("Géolocalisation & coordination terrain");
    await expect(team).toContainText("Électronique & installations automobiles");
    await expect(team.locator(".abt-tag")).toHaveText(["CFO", "CTO", "TERRAIN", "TECHNIQUE"]);
    await expect(team.getByRole("link", { name: /Parlons de votre besoin/ })).toHaveAttribute("href", "/contact");
    const loaded = await team.locator("img").evaluateAll((nodes) => nodes.map((img) => (img as HTMLImageElement).complete));
    expect(loaded).toHaveLength(5);
  });

  test("archives et écosystème : textes, liens et lien historique vers le catalogue 2017", async ({ page }, testInfo) => {
    test.skip(desktopOnly(testInfo), "desktop");
    await page.goto("/a-propos#archives", { waitUntil: "domcontentloaded" });
    const archives = page.locator("#archives");
    await expect(archives.getByRole("heading", { level: 2, name: "Des images qui racontent notre parcours." })).toBeVisible();
    await expect(archives.getByRole("link", { name: /Voir la vidéo sur YouTube/ })).toHaveAttribute("href", "https://youtu.be/eAJDidNcANw");
    await expect(archives.locator(".abt-moment__badge")).toHaveCount(3);
    await expect(archives).toContainText("Autour de l’identité ONLOUTOU.");
    await expect(archives).toContainText("Présentation des solutions lors d’un salon.");
    await expect(archives).toContainText("Un espace dédié à la location d’équipements.");
    await expect(archives.getByRole("link", { name: /Explorer nos projets/ })).toHaveAttribute("href", "/projets#bazar-onloutou");

    const eco = page.locator("#ecosysteme");
    await expect(eco.getByRole("heading", { level: 2, name: "Des projets qui prolongent notre savoir-faire." })).toBeVisible();
    await expect(eco.getByRole("link", { name: /Découvrir le projet/ })).toHaveAttribute("href", "/projets#chapechape-residence");
    await expect(eco).toContainText("KPS Services");
    await expect(eco).toContainText("CNDPEP-CI");
    await expect(page.getByRole("heading", { level: 2, name: "Les initiatives en préparation." })).toBeVisible();
    for (const name of ["APA — Allo Pièce Auto", "OVPR", "Sidsun", "Carburant à la demande"]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: /Voir les projets et leurs aperçus/ })).toHaveAttribute("href", "/projets");
    await expect(page.getByRole("link", { name: /Décrire mon besoin/ })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("heading", { level: 2, name: "Parlons de votre prochain projet." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Contacter ONLOUTOU/ }).last()).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("link", { name: /Explorer nos réalisations/ })).toHaveAttribute("href", "/projets");
  });

  test("pas de débordement horizontal", async ({ page }) => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/a-propos", { waitUntil: "load" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width}px`).toBeLessThanOrEqual(1);
    }
  });
});