import { test, expect } from "@playwright/test";

test.describe("page projets", () => {
  test("H1, domaines, pause autoplay, brief, FAQ", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/projets", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#proj-hero-title")).toBeVisible();
    await expect(page.locator("#proj-hero-title")).toContainText("du terrain");

    await page.locator("#domaines-projets").scrollIntoViewIfNeeded();
    await page.waitForSelector(".proj-domains--enhanced");
    await page.getByRole("tab", { name: /Supervision de flotte/i }).click();
    await expect(page.locator(".proj-domains__panel--active")).toContainText("Alertes");

    const pauseBtn = page.locator(".proj-domains__playback");
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
      await expect(pauseBtn).toHaveAttribute("aria-pressed", "true");
    }

    await page.locator("#domaines-projets").getByRole("link", { name: "Gestion de flotte" }).click();
    await expect(page).toHaveURL(/\/solutions\/gestion-de-flotte/);

    await page.goto("/projets#brief-projet");
    await page.locator('input[name="proj-domain"][value="plateforme numérique"]').check();
    await expect(page.locator(".proj-brief__summary-text")).toContainText("plateforme numérique");

    const whatsapp = page.getByRole("link", { name: "Envoyer le brief sur WhatsApp" });
    expect(await whatsapp.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);

    await page.locator("details summary", { hasText: /images représentent/i }).click();
    await page.locator("#proj-final-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#terrain-methode")).toBeVisible();
    await expect(page.locator("#proj-hero-title")).toBeVisible();
  });

  test("méga-menu Projets", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");
    await page.goto("/");
    await page.locator(".site-nav-trigger", { hasText: "Projets" }).hover();
    await expect(page.locator("#mega-projets a", { hasText: "Vue d'ensemble" })).toHaveAttribute("href", "/projets");
  });
});
