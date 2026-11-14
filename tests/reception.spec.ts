import { expect, test } from "@playwright/test";

test.describe("reception & evenementiel", () => {
  test("hub, vaisselle, assiettes 4 lots, complements, demande 100/108/10, ONL-DEMO-004", async ({ page }) => {
    await page.goto("/articles/reception", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Réception");
    await expect(page.getByRole("link", { name: "Vaisselle & couverts" })).toBeVisible();

    await page.getByRole("link", { name: "Vaisselle & couverts" }).click();
    await expect(page).toHaveURL(/\/articles\/reception\/vaisselle-couverts/);
    await expect(page.getByText("Lot de 25").first()).toBeVisible();

    await page.evaluate(() => localStorage.removeItem("onloutou-reception-request"));
    await page.reload({ waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: /Voir la fiche/ }).first().click();
    await expect(page).toHaveURL(/assiettes-plates-blanches/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Assiettes");

    const plus = page.getByRole("button", { name: "Augmenter" }).first();
    const qty = page.locator(".rec-qty__ctrl strong").first();
    await expect(qty).toHaveText("1");
    for (let i = 0; i < 3; i++) {
      await plus.click();
      await expect(qty).toHaveText(String(i + 2));
    }
    await expect(page.getByText(/4 lots = 100 assiettes/)).toBeVisible();
    await page.getByRole("button", { name: /Ajouter à ma demande/ }).first().click();

    const complements = page.locator(".rec-complements__grid .rec-btn");
    await expect(complements).toHaveCount(2);
    await complements.nth(0).click(); // verres x9 default in handler
    await complements.nth(1).click(); // nappes x10

    await expect
      .poll(async () =>
        page.evaluate(() => {
          const raw = localStorage.getItem("onloutou-reception-request");
          if (!raw) return "";
          const data = JSON.parse(raw);
          return (data.items || []).map((i: { id: string; quantity: number }) => i.id + ":" + i.quantity).join(",");
        }),
      )
      .toContain("assiettes-plates-blanches:4");

    await page.goto("/articles/reception/demande", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ma demande");
    await expect(page.locator(".rec-demande-items")).toContainText("100 assiettes");
    await expect(page.locator(".rec-demande-items")).toContainText("108 verres");
    await expect(page.locator(".rec-demande-items")).toContainText("10");
    await expect(page.locator(".rec-recap")).toContainText("100 assiettes");
    await expect(page.locator(".rec-recap")).toContainText("108 verres");

    await page.locator("#rec-event").fill("Reception familiale");
    await page.locator("#rec-guests").fill("100");
    await page.locator("select").first().selectOption("Cocody");
    await page.locator("#rec-delivery").fill("2026-11-21T09:00");
    await page.locator("#rec-pickup").fill("2026-11-22T10:00");
    await page.locator('input[required]').nth(0).fill("Client Demo");
    await page.locator('input[required]').nth(1).fill("0554137777");
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();

    await expect(page).toHaveURL(/\/articles\/reception\/demande\/confirmation/);
    await expect(page.getByText(/ONL-DEMO-00[1-5]|ONL-\d{8}-[A-Z0-9]+/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Continuer sur WhatsApp/ })).toHaveAttribute(
      "href",
      /wa\.me\/2250554137777/,
    );
    await expect(page.getByRole("link", { name: /Retour à Réception/i })).toHaveAttribute(
      "href",
      "/articles/reception",
    );
  });
});
