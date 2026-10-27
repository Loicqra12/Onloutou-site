import { test, expect } from "@playwright/test";

test.describe("page espace livreur", () => {
  test("hero, aperçu, onglets, pas de connexion", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/espace-livreur", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#edl-hero-title")).toContainText("organiser le terrain");
    await expect(page.getByText("Espace livreur en préparation")).toBeVisible();

    await page.locator("#apercu-espace-livreur").scrollIntoViewIfNeeded();
    await page.waitForSelector(".edl-preview--ready");
    await expect(page.getByText("Prévisualisation conceptuelle")).toBeVisible();

    await page.getByRole("tab", { name: "Disponibilités" }).click();
    await expect(page.getByText("Les disponibilités communiquées ne garantissent aucune mission.")).toBeVisible();

    await page.getByRole("tab", { name: "Missions" }).click();
    await page.getByRole("button", { name: "Accepter" }).click();
    await expect(page.locator('[role="status"].edl-missions__notice')).toBeVisible();

    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
  });
});
