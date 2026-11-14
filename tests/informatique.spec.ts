import { expect, test } from "@playwright/test";

test.describe("informatique & telephonie", () => {
  test("hub, ordinateurs, fiche portable, panier 6+1, confirmation ONL-DEMO-002", async ({ page }) => {
    await page.goto("/articles/informatique", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Informatique");
    await expect(page.getByRole("link", { name: "Ordinateurs" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Smartphones & téléphones" })).toBeVisible();

    await page.getByRole("link", { name: "Ordinateurs" }).click();
    await expect(page).toHaveURL(/\/articles\/informatique\/ordinateurs/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ordinateurs");
    await expect(page.getByText("Disponibilité à confirmer pour vos dates")).toBeVisible();

    await page.evaluate(() => localStorage.removeItem("onloutou-informatique-request"));
    await page.reload({ waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: /Voir la fiche/ }).first().click();
    await expect(page).toHaveURL(/portable-bureautique-14-pouces/);
    await expect(page.getByRole("heading", { name: "Portable bureautique 14 pouces" })).toBeVisible();

    const plus = page.getByRole("button", { name: "Augmenter" });
    const qtyLabel = page.locator(".inf-qty__ctrl strong");
    await expect(qtyLabel).toHaveText("1");
    for (let i = 0; i < 5; i++) {
      await plus.click();
      await expect(qtyLabel).toHaveText(String(i + 2));
    }
    await expect(qtyLabel).toHaveText("6");
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).click();
    await expect(page.getByRole("button", { name: /Ajouté à ma demande/ })).toBeVisible();

    const complement = page.locator(".inf-complement a", { hasText: /Voir la fiche/ });
    if (await complement.count()) {
      await complement.click();
    } else {
      await page.goto("/articles/informatique/reseau-internet/routeur-4g", { waitUntil: "domcontentloaded" });
    }
    await expect(page).toHaveURL(/routeur-4g/);
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).click();
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const raw = localStorage.getItem("onloutou-informatique-request");
          if (!raw) return "";
          const data = JSON.parse(raw);
          const items = data.items || [];
          const ids = [];
          for (let n = 0; n < items.length; n++) ids.push(String(items[n].id));
          return ids.join(",");
        }),
      )
      .toContain("routeur-4g");

    await page.goto("/articles/informatique/demande", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ma demande de location");
    await expect(page.locator(".inf-demande-items")).toContainText("Portable bureautique 14 pouces");
    await expect(page.locator(".inf-demande-items")).toContainText("Routeur 4G");
    await expect(page.locator(".inf-recap")).toContainText("2 références");
    await expect(page.locator(".inf-recap")).toContainText("7 appareils");

    await page.getByLabel("Commune").selectOption("Cocody");
    await page.locator('input[type="date"]').nth(0).fill("2026-11-21");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.getByLabel("Votre nom").fill("Client Demo");
    await page.getByLabel(/Téléphone|Telephone/i).fill("0554137777");
    await page.getByRole("checkbox", { name: /Livraison/i }).check();
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();

    await expect(page).toHaveURL(/\/articles\/informatique\/demande\/confirmation/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demande enregistrée");
    await expect(page.getByText(/ONL-DEMO-00[1-5]|ONL-\d{8}-[A-Z0-9]+/)).toBeVisible();
    const wa = page.getByRole("link", { name: /Continuer sur WhatsApp/ });
    await expect(wa).toHaveAttribute("href", /wa\.me\/2250554137777/);
    await expect(page.getByRole("link", { name: /Retour à Informatique/i })).toHaveAttribute(
      "href",
      "/articles/informatique",
    );
  });

  test("smartphones filters systeme / stockage / double SIM et etat vide", async ({ page }) => {
    await page.goto("/articles/informatique/smartphones-telephones", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Smartphone standard" })).toBeVisible();
    await expect(page.locator("legend").filter({ hasText: "Système" })).toBeVisible();
    await expect(page.locator("legend").filter({ hasText: "Stockage" })).toBeVisible();
    await expect(page.locator("legend").filter({ hasText: "Double SIM" })).toBeVisible();
    await page.getByRole("radio", { name: "iOS" }).check();
    await expect(page.getByRole("heading", { name: "Smartphone standard" })).toHaveCount(0);
    await expect(page.getByText("Aucun modèle pour ces filtres")).toBeVisible();
    await expect(page.getByRole("link", { name: "Décrire mon besoin" })).toBeVisible();
  });

  test("fiche: dates, commune et quantite sont reprises dans la demande", async ({ page }) => {
    await page.goto("/articles/informatique/reseau-internet/routeur-4g", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("onloutou-informatique-request"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Date de début")).toBeVisible();
    await page.getByLabel("Date de début").fill("2026-11-21");
    await page.getByLabel("Date de fin").fill("2026-11-22");
    await expect(page.getByLabel("Date de début")).toHaveValue("2026-11-21");
    await expect(page.getByLabel("Date de fin")).toHaveValue("2026-11-22");
    await page.getByLabel("Commune").selectOption("Cocody");
    await page.getByRole("button", { name: "Augmenter" }).click();
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).click();
    await expect(page.getByRole("button", { name: /Ajouté à ma demande/ })).toBeVisible();
    await expect
      .poll(async () =>
        page.evaluate((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return "";
          const data = JSON.parse(raw);
          return String(data.startDate || "") + "|" + String(data.endDate || "") + "|" + String(data.zone || "");
        }, "onloutou-informatique-request"),
      )
      .toBe("2026-11-21|2026-11-22|Cocody");
    await page.goto("/articles/informatique/demande", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Date de début")).toHaveValue("2026-11-21");
    await expect(page.getByLabel("Date de fin")).toHaveValue("2026-11-22");
    await expect(page.getByLabel("Commune")).toHaveValue("Cocody");
    await expect(page.locator(".inf-demande-items")).toContainText("Routeur 4G");
    await expect(page.locator(".inf-demande-items")).toContainText("2");
  });
});