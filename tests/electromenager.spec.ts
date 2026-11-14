import { expect, test } from "@playwright/test";

async function openHub(page: import("@playwright/test").Page) {
  await page.goto("/articles/electromenager", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Électroménager");
}

test.describe("électroménager", () => {
  test("hub, rayon Froid, fiche et libellé proposés", async ({ page }) => {
    await openHub(page);
    await expect(page.getByRole("link", { name: "Froid & conservation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cuisson" })).toBeVisible();

    await page.getByRole("link", { name: "Froid & conservation" }).click();
    await expect(page).toHaveURL(/froid-conservation/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("conservation");
    await expect(page.getByText("4 appareils proposés")).toBeVisible();
    await expect(page.getByText(/appareils disponibles/i)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Réfrigérateur 250 L" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Congélateur coffre 300 L" })).toBeVisible();

    await page.getByRole("button", { name: "Ajouter à ma demande" }).first().click();
    await page.getByRole("button", { name: "Ajouter à ma demande" }).first().click();
    await expect(page.getByText(/Ma demande/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Continuer" })).toHaveAttribute("href", "/articles/electromenager/demande");

    await page.getByRole("link", { name: "Voir la fiche" }).first().click();
    await expect(page).toHaveURL(/refrigerateur-250-l/);
    await expect(page.getByRole("heading", { name: "Réfrigérateur 250 L" })).toBeVisible();
    await expect(page.getByText("Capacité utile")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ajouté à ma demande|Ajouter à ma demande/ })).toBeVisible();
  });

  test("panier partagé : ajouter, continuer, envoyer, confirmation ONL-DEMO-001", async ({ page }) => {
    await page.goto("/articles/electromenager/froid-conservation", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("onloutou-electromenager-request"));
    await page.reload({ waitUntil: "domcontentloaded" });

    const addButtons = page.getByRole("button", { name: "Ajouter à ma demande" });
    await addButtons.nth(0).click();
    await addButtons.nth(0).click();
    await expect(page.getByText(/Ma demande/)).toContainText("2");

    await page.getByRole("link", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/\/articles\/electromenager\/demande$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ma demande de location");
    await expect(page.locator(".elm-demande-items")).toContainText("Réfrigérateur 250 L");
    await expect(page.locator(".elm-demande-items")).toContainText("Congélateur coffre 300 L");

    await page.getByLabel("Ville ou commune").selectOption("Cocody");
    await page.locator('input[type="date"]').nth(0).fill("2026-11-21");
    await page.locator('input[type="date"]').nth(1).fill("2026-11-22");
    await page.getByLabel("Votre nom").fill("Client Démo");
    await page.getByLabel("Téléphone").fill("0554137777");
    await page.getByRole("checkbox", { name: "Livraison souhaitée" }).check();

    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page).toHaveURL(/\/articles\/electromenager\/demande\/confirmation/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Demande enregistrée");
    await expect(page.getByText(/ONL-DEMO-00[1-5]|ONL-\d{8}-[A-Z0-9]+/)).toBeVisible();
    await expect(page.locator(".elm-confirm-card")).toContainText("Réfrigérateur 250 L");
    await expect(page.locator(".elm-confirm-card")).toContainText("Congélateur coffre 300 L");
    await expect(page.locator(".elm-confirm-card")).toContainText("Cocody");

    const wa = page.getByRole("link", { name: /Continuer sur WhatsApp/ });
    await expect(wa).toHaveAttribute("href", /wa\.me\/2250554137777/);
    await expect(wa).toHaveAttribute("href", /ONL-DEMO-00[1-5]|ONL-\d{8}-[A-Z0-9]+/);
    const waHref = await wa.getAttribute("href");
    expect(waHref).toMatch(/wa\.me\/2250554137777/);
    expect(decodeURIComponent(waHref || "")).toMatch(/Réfrigérateur|refrigerateur|250/i);
    await expect(page.getByRole("link", { name: /Retour à l.électroménager/ })).toHaveAttribute(
      "href",
      "/articles/electromenager",
    );
  });

  test("filtres client du rayon Froid", async ({ page }) => {
    await page.goto("/articles/electromenager/froid-conservation", { waitUntil: "domcontentloaded" });
    await page.getByRole("radio", { name: "Réfrigérateurs" }).check();
    await expect(page.getByRole("heading", { name: "Réfrigérateur 250 L" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Congélateur coffre 300 L" })).toHaveCount(0);
    await page.getByRole("radio", { name: "Tous" }).check();
    await expect(page.getByText("4 appareils proposés")).toBeVisible();
  });

  test("menu électroménager ouvre le hub", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Articles & équipements" }).hover();
    await expect(page.locator("#mega-equipements a", { hasText: "Électroménager" }).first()).toHaveAttribute(
      "href",
      "/articles/electromenager",
    );
  });

  test("fiche: dates, commune et quantite sont reprises dans la demande", async ({ page }) => {
    await page.goto("/articles/electromenager/froid-conservation/refrigerateur-250-l", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("onloutou-electromenager-request"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Date de début")).toBeVisible();
    await page.getByLabel("Date de début").fill("2026-11-21");
    await page.getByLabel("Date de fin").fill("2026-11-22");
    await expect(page.getByLabel("Date de début")).toHaveValue("2026-11-21");
    await expect(page.getByLabel("Date de fin")).toHaveValue("2026-11-22");
    await page.getByLabel(/Commune|Ville ou commune/i).selectOption("Cocody");
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
        }, "onloutou-electromenager-request"),
      )
      .toBe("2026-11-21|2026-11-22|Cocody");
    await page.goto("/articles/electromenager/demande", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Date de début")).toHaveValue("2026-11-21");
    await expect(page.getByLabel("Date de fin")).toHaveValue("2026-11-22");
    await expect(page.getByLabel("Commune")).toHaveValue("Cocody");
    await expect(page.locator(".elm-demande-items")).toContainText("Réfrigérateur 250 L");
    await expect(page.locator(".elm-demande-items")).toContainText("2");
  });
});