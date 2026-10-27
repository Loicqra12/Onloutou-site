import { expect, test } from "@playwright/test";
import {
  discoverAppRoutes,
  NOT_FOUND_PROBE_PATH,
} from "./lib/app-routes";
import { evaluatePageOverflow } from "./lib/responsive-overflow";

const VIEWPORTS: Array<{ name: string; width: number; height: number }> = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844 },
  { name: "414x896", width: 414, height: 896 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "820x1180", width: 820, height: 1180 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const LANDSCAPE_CRITICAL = [
  "/",
  "/produits",
  "/livraison",
  "/espace-partenaire",
  "/espace-livreur",
  "/aide",
  "/contact",
];

const routes = discoverAppRoutes();

test.describe.configure({ mode: "serial" });

test.describe("audit responsive — débordement horizontal", () => {
  for (const route of routes) {
    for (const vp of VIEWPORTS) {
      test(`${route} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status(), `HTTP ${route}`).toBeLessThan(400);

        const report = await evaluatePageOverflow(page);
        expect(
          report.globalOverflow,
          `scrollWidth ${report.docScrollWidth} > innerWidth ${report.innerWidth} — ${JSON.stringify(report.offenders.slice(0, 3))}`,
        ).toBe(false);
      });
    }
  }

  test(`404 @ 375x812`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const response = await page.goto(NOT_FOUND_PROBE_PATH, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    const report = await evaluatePageOverflow(page);
    expect(report.globalOverflow).toBe(false);
  });

  for (const route of LANDSCAPE_CRITICAL) {
    test(`${route} paysage mobile 896x414`, async ({ page }) => {
      await page.setViewportSize({ width: 896, height: 414 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const report = await evaluatePageOverflow(page);
      expect(report.globalOverflow).toBe(false);
    });
  }
});

test.describe("audit responsive — header desktop 1024–1920", () => {
  for (const width of [1024, 1280, 1440, 1920]) {
    test(`navigation desktop visible @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const desktopNav = page.locator(".site-nav-desktop");
      const mobileToggle = page.locator(".site-header-toggle");

      if (width >= 1200) {
        await expect(desktopNav).toBeVisible();
        await expect(mobileToggle).toBeHidden();
      } else {
        await expect(mobileToggle).toBeVisible();
      }

      const cta = page.locator(".site-header-cta").first();
      if (width >= 1200) {
        await expect(cta).toBeVisible();
        const box = await cta.boundingBox();
        expect(box && box.x + box.width <= width + 1).toBeTruthy();
      }
    });
  }
});

const ZOOM_SAMPLE_ROUTES = ["/", "/produits", "/contact", "/aide", "/espace-partenaire", "/mentions-legales"];

test.describe("audit responsive — zoom 200 % (reflow)", () => {
  for (const route of ZOOM_SAMPLE_ROUTES) {
    test(`${route} reflow équivalent 1280×200%`, async ({ page }) => {
      // Reflow WCAG : largeur 640 px ≈ fenêtre 1280 px à zoom 200 %.
      await page.setViewportSize({ width: 640, height: 900 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const report = await evaluatePageOverflow(page);
      expect(report.globalOverflow).toBe(false);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
});

test.describe("audit responsive — menu mobile", () => {
  test("ouverture, scroll interne, Escape @ 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const toggle = page.locator(".site-header-toggle");
    await toggle.click();
    const drawer = page.locator(".site-nav-mobile");
    await expect(drawer).toBeVisible();

    const drawerBox = await drawer.boundingBox();
    expect(drawerBox && drawerBox.height <= 812).toBeTruthy();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });
});
