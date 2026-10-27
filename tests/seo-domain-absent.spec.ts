import { expect, test } from "@playwright/test";

test.describe("SEO — contexte A (domaine absent au build)", () => {
  test("accueil — pas de canonical, og:image, twitter:image ni localhost", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(await page.locator('link[rel="canonical"]').count()).toBe(0);
    expect(await page.locator('meta[property="og:image"]').count()).toBe(0);
    expect(await page.locator('meta[name="twitter:image"]').count()).toBe(0);

    const card = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    expect(card).toBe("summary");

    const head = await page.locator("head").innerHTML();
    expect(head).not.toContain("localhost");
    expect(head).not.toContain("onloutou.com");

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("produits — image OG relative non exposée sans origine", async ({ page }) => {
    await page.goto("/produits", { waitUntil: "domcontentloaded" });
    expect(await page.locator('meta[property="og:image"]').count()).toBe(0);
    const head = await page.locator("head").innerHTML();
    expect(head).not.toContain("localhost");
  });
});
