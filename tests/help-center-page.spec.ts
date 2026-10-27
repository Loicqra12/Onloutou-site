import { test, expect } from "@playwright/test";

test.describe("centre d’aide", () => {
  test("recherche, filtre, hash", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/aide", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#hlp-hero-title")).toContainText("vous aider");

    await page.locator("#hlp-search-input").fill("géolocalisation");
    await expect(page.locator(".hlp-search__live")).toContainText("résultat");

    await page.getByRole("button", { name: "Effacer" }).click();
    await expect(page.locator("#hlp-search-input")).toHaveValue("");

    await page.locator("#hlp-search-input").fill("zzzzaucunmatch");
    await expect(page.getByText("Aucune réponse exacte n’a été trouvée.")).toBeVisible();

    await page.getByRole("button", { name: "Entreprise" }).click();
    await page.locator("#hlp-search-input").fill("");
    await expect(page.locator("#geolocalisation-flotte")).toBeVisible();

    await page.goto("/aide#comment-obtenir-un-prix", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#comment-obtenir-un-prix")).toHaveAttribute("open", "");

    await expect(page.getByRole("link", { name: /Se connecter/i })).toHaveCount(0);
  });
});
