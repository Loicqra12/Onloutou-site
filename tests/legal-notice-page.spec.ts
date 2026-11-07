import { test, expect } from "@playwright/test";

test.describe("mentions légales", () => {
  test("brouillon, noindex, sommaire, pas de lien mort", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop");

    await page.goto("/mentions-legales", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#leg-hero-title")).toContainText("Mentions légales");
    await expect(page.locator(".leg-doc__kicker")).toHaveText("Informations légales");
    await expect(page.getByRole("button", { name: "Imprimer" })).toBeVisible();
    await expect(page.getByText("CI-ABJ-2016-A-3617")).toBeVisible();
    await expect(page.getByText("Adams Ousmane Diaby").first()).toBeVisible();
    await expect(page.getByText("1541839S")).toBeVisible();
    await expect(page.getByText("À proximité de la CNPS, non loin du rond-point CGK")).toBeVisible();
    await expect(page.getByText("ne sont pas encore publiées")).toHaveCount(0);
    await expect(page.getByText("Document en cours de validation")).toHaveCount(0);
    await expect(page.locator('#editeur a[href="tel:+2250554137777"]')).toBeVisible();

    const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(metaRobots ?? "").toMatch(/noindex/i);

    await expect(page.locator('#donnees-personnelles a[href="/confidentialite"]')).toBeVisible();
    await expect(page.locator('#cookies a[href="/cookies"]')).toBeVisible();
    await expect(page.locator("#editeur")).toBeVisible();
    await expect(page.locator('nav[aria-label="Sommaire des mentions légales"] a[href="#hebergement"]')).toBeVisible();

    await page.locator('nav[aria-label="Sommaire des mentions légales"] a[href="#hebergement"]').click();
    await expect.poll(async () => {
      const top = await page.locator("#hebergement-title").evaluate((element) => element.getBoundingClientRect().top);
      return top > 60 && top < 180;
    }).toBe(true);

    await page.evaluate(() => {
      window.print = () => {
        document.body.dataset.printed = "yes";
      };
    });
    await page.getByRole("button", { name: "Imprimer" }).click();
    await expect(page.locator("body")).toHaveAttribute("data-printed", "yes");
  });
});
