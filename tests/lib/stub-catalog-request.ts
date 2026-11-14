import type { Page } from "@playwright/test";

/** Intercepte l’API demandes pour les tests visuels (référence déterministe, indépendante de PostgreSQL). */
export async function stubCatalogRequest(page: Page, reference: string) {
  await page.route("**/api/v1/csrf", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      json: { csrfToken: "test-csrf" },
    });
  });
  await page.route("**/api/v1/requests", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      json: {
        ok: true,
        reference,
        recordedAt: new Date().toISOString(),
      },
    });
  });
}
