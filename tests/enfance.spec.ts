import { expect, test } from "@playwright/test";

test.describe("bebe & enfance", () => {
  test("hub, sommeil, lit parapluie, chaise haute, demande, ONL-DEMO-005", async ({ page }) => {
    await page.goto("/articles/enfance", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/enfance/i);
    await expect(page.getByRole("link", { name: /Sommeil/i })).toBeVisible();

    await page.getByRole("link", { name: /Sommeil & couchage/i }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Sommeil/i);
    await page.getByRole("link", { name: /Voir l.article/i }).first().click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Lit parapluie/i);
    await page.locator(".enf-buy .enf-btn--yellow").click();
    await expect(page.getByRole("link", { name: /Voir ma demande/i })).toContainText(/1 article/);

    await page.locator(".enf-complement-card .enf-btn--yellow").click();
    await expect(page.getByRole("link", { name: /Voir ma demande/i })).toContainText(/2 articles/);

    await page.getByRole("link", { name: /Voir ma demande/i }).click();
    await expect(page).toHaveURL(/\/articles\/enfance\/demande/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Votre demande/i);
    await expect(page.locator(".enf-demande-items")).toContainText(/Lit parapluie/i);
    await expect(page.locator(".enf-demande-items")).toContainText(/Chaise haute/i);

    await page.locator("#enf-zone").selectOption("Cocody");
    await page.locator("#enf-start").fill("2026-11-21");
    await page.locator("#enf-end").fill("2026-11-24");
    await page.locator("#enf-name").fill("Koffi Ama");
    await page.locator("#enf-phone").fill("0707123456");
    await page.getByRole("button", { name: /Envoyer ma demande/i }).click();

    await expect(page).toHaveURL(/\/articles\/enfance\/demande\/confirmation/);
    await expect(page.getByText(/ONL-DEMO-00[1-5]|ONL-\d{8}-[A-Z0-9]+/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Continuer sur WhatsApp/i })).toHaveAttribute(
      "href",
      /wa\.me\/2250554137777/,
    );
    await expect(page.getByRole("link", { name: /Revenir/i })).toHaveAttribute("href", "/articles/enfance");
  });
});
