import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = path.join("docs", "captures");

async function shot(page: import("@playwright/test").Page, name: string) {
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, name) });
}

async function openHome(page: import("@playwright/test").Page) {
  await page.goto(`/?nav=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("header.site-header")).toBeVisible();
}

test.describe("header — captures et comportements", () => {
  test("desktop 1440 — fermé et méga-menus", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "captures desktop");
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHome(page);
    await expect(page.locator(".site-nav-trigger", { hasText: "Solutions" })).toBeVisible();
    await shot(page, "header-desktop-closed-1440.png");

    await page.locator(".site-nav-trigger", { hasText: "Solutions" }).hover();
    await page.waitForTimeout(280);
    await expect(page.locator("#mega-solutions")).toBeVisible();
    await shot(page, "header-solutions-open-1440.png");

    await page.locator(".site-nav-trigger", { hasText: "Équipements" }).hover();
    await page.waitForTimeout(280);
    await expect(page.locator("#mega-equipements")).toBeVisible();
    await expect(page.locator("#mega-solutions")).toBeHidden();
    await shot(page, "header-equipment-open-1440.png");

    await page.locator(".site-nav-trigger", { hasText: "Partenaires" }).hover();
    await page.waitForTimeout(280);
    await expect(page.locator("#mega-partenaires")).toBeVisible();
    await shot(page, "header-partners-open-1440.png");

    await page.keyboard.press("Escape");
    await page.waitForTimeout(80);
    await expect(page.locator("#mega-partenaires")).toBeHidden();
  });

  test("tablette 1024 et mobile 375", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "variantes de largeur");

    await page.setViewportSize({ width: 1024, height: 800 });
    await openHome(page);
    await expect(page.locator(".site-header-toggle")).toBeVisible();
    await shot(page, "header-tablet-1024.png");

    await page.setViewportSize({ width: 375, height: 812 });
    await openHome(page);
    await expect(page.locator(".site-header-utility-phone")).toBeVisible();
    await expect(page.locator(".site-header-utility-whatsapp")).toBeVisible();
    await shot(page, "header-mobile-375.png");

    await page.locator(".site-header-toggle").click();
    await expect(page.locator(".site-nav-mobile")).toBeVisible();
    await page.locator(".site-mobile-trigger", { hasText: "Solutions" }).click();
    await expect(page.getByRole("link", { name: "Véhicules professionnels" })).toBeVisible();
    await shot(page, "header-mobile-menu-open-375.png");
  });
});
