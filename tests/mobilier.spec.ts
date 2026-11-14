import { expect, test } from "@playwright/test";

test.describe("mobilier & decoration", () => {
  test("hub, assises, fauteuil, panier 2+1+1, confirmation ONL-DEMO-003", async ({ page }) => {
    await page.goto("/articles/mobilier", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Mobilier");
    await expect(page.getByRole("link", { name: "Assises & canapés" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Luminaires" })).toBeVisible();

    await page.getByRole("link", { name: "Assises & canapés" }).click();
    await expect(page).toHaveURL(/\/articles\/mobilier\/assises-canapes/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Assises");
    await expect(page.locator("legend").filter({ hasText: "Type" })).toBeVisible();
    await expect(page.locator("legend").filter({ hasText: "Matière" })).toBeVisible();

    await page.evaluate(() => localStorage.removeItem("onloutou-mobilier-request"));
    await page.reload({ waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: /Voir la fiche/ }).first().click();
    await expect(page).toHaveURL(/fauteuil-en-rotin/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fauteuil");

    const plus = page.getByRole("button", { name: "Augmenter" }).first();
    const qtyLabel = page.locator(".mob-qty__ctrl strong").first();
    await expect(qtyLabel).toHaveText("1");
    await plus.click();
    await expect(qtyLabel).toHaveText("2");
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).first().click();
    await expect(page.getByRole("button", { name: /Ajouté à ma demande/ }).first()).toBeVisible();

    const complementBtns = page.locator(".mob-complements__grid .mob-btn");
    await expect(complementBtns).toHaveCount(2);
    await complementBtns.nth(0).click();
    await complementBtns.nth(1).click();

    await expect
      .poll(async () =>
        page.evaluate(() => {
          const raw = localStorage.getItem("onloutou-mobilier-request");
          if (!raw) return "";
          const data = JSON.parse(raw);
          return (data.items || []).map((i: { id: string; quantity: number }) => `${i.id}:${i.quantity}`).join(",");
        }),
      )
      .toContain("fauteuil-en-rotin:2");

    await page.goto("/articles/mobilier/demande", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ma demande de location");
    await expect(page.locator(".mob-demande-items")).toContainText("Fauteuil en rotin");
    await expect(page.locator(".mob-demande-items")).toContainText("Table basse ronde");
    await expect(page.locator(".mob-demande-items")).toContainText("Lampadaire en laiton");
    await expect(page.locator(".mob-recap")).toContainText("3 références");
    await expect(page.locator(".mob-recap")).toContainText("4 articles");

    await page.getByLabel("Commune").selectOption("Marcory");
    await page.locator('input[type="date"]').nth(0).fill("2026-11-21");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.getByLabel(/Accès au lieu/i).fill("Rez-de-chaussée");
    await page.getByLabel("Votre nom").fill("Client Demo");
    await page.getByLabel(/Téléphone|Telephone/i).fill("0554137777");
    await page.getByRole("checkbox", { name: /Livraison/i }).check();
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();

    await expect(page).toHaveURL(/\/articles\/mobilier\/demande\/confirmation/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Demande enregistrée/);
    await expect(page.getByText(/ONL-DEMO-00[1-5]|ONL-\d{8}-[A-Z0-9]+/)).toBeVisible();
    const wa = page.getByRole("link", { name: /Continuer sur WhatsApp/ });
    await expect(wa).toHaveAttribute("href", /wa\.me\/2250554137777/);
    await expect(page.getByRole("link", { name: /Retour à Mobilier/i })).toHaveAttribute(
      "href",
      "/articles/mobilier",
    );
    await expect(page.getByRole("link", { name: "Luminaires" }).first()).toBeVisible();
  });
});
