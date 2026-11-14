import { expect, test } from "@playwright/test";

test.describe("parcours produits unifié", () => {
  test("hub → familles → vaisselle → fiche 1 lot → ordinateur ×6 → sur-mesure → remise → demande → confirmation", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/produits", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Que cherchez-vous à louer");
    await page.getByRole("link", { name: "Explorer les familles" }).click();
    await expect(page).toHaveURL(/\/produits\/familles/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Toutes les familles");

    const familyHrefs = await page.locator(".prd-family-card").evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).getAttribute("href") ?? ""),
    );
    expect(familyHrefs).toEqual([
      "/articles/electromenager",
      "/articles/informatique",
      "/articles/mobilier",
      "/articles/reception",
      "/articles/enfance",
      "/equipements/vehicules",
      "/equipements/motos",
      "/equipements/camions-engins",
      "/equipements/outils-materiels",
      "/equipements/equipements-connectes",
    ]);
    for (const href of familyHrefs) {
      const res = await page.request.get(href);
      expect(res.status(), href).toBeLessThan(400);
    }

    await page.goto("/produits");
    await page.getByLabel("Quel article cherchez-vous").fill("assiettes");
    await page.getByLabel("Où").fill("Marcory");
    await page.getByLabel("Date de début").fill("2026-11-23");
    await page.getByLabel("Date de fin").fill("2026-11-24");
    await page.getByRole("button", { name: "Rechercher" }).click();
    await expect(page).toHaveURL(/\/produits\/reception\/vaisselle/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vaisselle de réception");
    await expect(page.getByRole("link", { name: /Assiettes plates blanches/ })).toBeVisible();

    await page.getByRole("link", { name: /Assiettes plates blanches/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Assiettes plates blanches");
    await expect(page.getByText("25 assiettes", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Ajouter à ma demande" }).click();
    await expect(page.getByRole("button", { name: "Ajouté à ma demande" })).toBeVisible();

    await page.getByRole("link", { name: "Ajouter un ordinateur" }).click();
    await expect(page).toHaveURL(/\/produits\/informatique\/ordinateur-portable/);
    for (let step = 0; step < 5; step += 1) {
      await page.getByRole("button", { name: /Augmenter/ }).click();
    }
    await expect(page.locator(".prd-live")).toHaveText("6 unités");
    await page.getByRole("button", { name: "Ajouter à ma demande" }).click();

    await page.goto("/produits/sur-mesure");
    await page.getByLabel("Article recherché").fill("Chevalet de conférence");
    await page.getByLabel("Quantité").fill("1");
    await page.getByLabel("Précisions utiles").fill("Pour présenter les exercices pendant la formation. Prévoir un support pour bloc de papier.");
    await page.getByRole("button", { name: "Ajouter à ma demande" }).click();
    await expect(page.getByText("Chevalet de conférence")).toBeVisible();

    await page.goto("/produits/demande/remise");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Comment récupérer les articles");
    await page.getByLabel("Lieu de livraison et de reprise").fill("Marcory, Zone 4 · salle de formation");
    await page.getByLabel("Livraison souhaitée").fill("2026-11-23T08:00");
    await page.getByLabel("Reprise souhaitée").fill("2026-11-24T17:30");
    await page.getByLabel("Précisions d’accès").fill("Rez-de-chaussée, entrée côté cour.");
    await expect(page.getByRole("heading", { name: "Chevalet de conférence" })).toBeVisible();
    await page.getByRole("button", { name: "Enregistrer mes préférences" }).click();

    await expect(page).toHaveURL(/\/produits\/demande$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Votre demande");
    await expect(page.getByText("Formation à Marcory")).toBeVisible();
    await expect(page.getByText("1 lot de 25 assiettes")).toBeVisible();
    await expect(page.getByText("6 unités")).toBeVisible();
    await expect(page.getByLabel("Commune")).toHaveValue("Marcory");
    await expect(page.getByLabel("Date de début")).toHaveValue("2026-11-23");
    await expect(page.getByLabel("Date de fin")).toHaveValue("2026-11-24");
    await page.getByLabel("Nom du contact").fill("Awa Koné");
    await page.getByLabel("Téléphone").fill("07 12 34 56 78");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();

    await expect(page).toHaveURL(/\/produits\/confirmation/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demande enregistrée");
    const ref = page.locator(".prd-ref");
    await expect(ref).toBeVisible();
    const refText = (await ref.textContent()) ?? "";
    expect(refText).toMatch(/ONL-DEMO-006|ONL-\d{8}-[A-Z0-9]+/);
    const label = ((await page.locator(".prd-ref-label").textContent()) ?? "").trim();
    if (refText.includes("ONL-DEMO-006")) {
      expect(label).toBe("Référence de démonstration");
    } else {
      expect(label).toBe("Votre référence");
    }
    await expect(page.getByText("1 lot de 25 assiettes")).toBeVisible();
    await expect(page.getByText("6 ordinateurs portables")).toBeVisible();
    await expect(page.getByText("Chevalet de conférence")).toBeVisible();
  });
});
