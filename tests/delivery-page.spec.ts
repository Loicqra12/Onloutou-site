import { test, expect } from "@playwright/test";

test.describe("page livraison", () => {
  test("hero, parcours, demande, livreur, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/livraison", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#dlv-hero-title")).toContainText("la bonne destination");

    await expect(page.getByRole("link", { name: "Qualifier ma demande" })).toHaveAttribute("href", "#demande-livraison");
    await expect(page.getByRole("link", { name: "Présenter mon profil" }).first()).toHaveAttribute(
      "href",
      "/devenir-livreur",
    );

    await page.locator("#fonctionnement-livraison").scrollIntoViewIfNeeded();
    await expect(page.locator("#dlv-process-title")).toContainText("parcours clair");

    const requestSection = page.locator("#demande-livraison");
    await requestSection.scrollIntoViewIfNeeded();
    await requestSection.getByRole("radio", { name: /^équipement$/i }).check();
    await expect(requestSection.locator(".dlv-request__summary-text")).toContainText("équipement");

    const demandWa = page.getByRole("link", { name: "Envoyer ma demande par WhatsApp" });
    expect(await demandWa.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    const teaser = page.locator("#devenir-livreur");
    await teaser.scrollIntoViewIfNeeded();
    await expect(teaser.getByRole("link", { name: "Présenter mon profil" })).toHaveAttribute(
      "href",
      "/devenir-livreur#candidature-livreur",
    );

    await page.locator("details summary", { hasText: /service de livraison est-il déjà disponible/i }).click();
    await expect(page.locator("details", { hasText: /service de livraison est-il déjà disponible/i })).toBeVisible();
  });
});
