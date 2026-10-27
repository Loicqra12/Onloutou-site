import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const captures = path.join(root, "docs", "captures");

const shots = [
  { file: "solutions-hub-final-1440.png", path: "/solutions", width: 1440, height: 900 },
  { file: "solutions-hub-final-375.png", path: "/solutions", width: 375, height: 812 },
  { file: "location-final-1440.png", path: "/solutions/location", width: 1440, height: 900 },
  { file: "location-final-375.png", path: "/solutions/location", width: 375, height: 812 },
  { file: "sale-final-1440.png", path: "/solutions/vente", width: 1440, height: 900 },
  { file: "sale-final-375.png", path: "/solutions/vente", width: 375, height: 812 },
  { file: "fleet-final-1440.png", path: "/solutions/gestion-de-flotte", width: 1440, height: 900 },
  { file: "fleet-final-375.png", path: "/solutions/gestion-de-flotte", width: 375, height: 812 },
  { file: "equipment-final-1440.png", path: "/equipements", width: 1440, height: 900 },
  { file: "equipment-final-375.png", path: "/equipements", width: 375, height: 812 },
  { file: "projects-final-1440.png", path: "/projets", width: 1440, height: 900 },
  { file: "projects-final-375.png", path: "/projets", width: 375, height: 812 },
  { file: "partners-final-1440.png", path: "/partenaires", width: 1440, height: 900 },
  { file: "partners-final-375.png", path: "/partenaires", width: 375, height: 812 },
  { file: "mega-menu-desktop-1440.png", path: "/", width: 1440, height: 900, mega: true },
  {
    file: "mobile-solutions-accordion-375.png",
    path: "/",
    width: 375,
    height: 812,
    mobileMenu: true,
  },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewportSize({ width: shot.width, height: shot.height });
  await page.goto(`${base}${shot.path}`, { waitUntil: "networkidle" });
  if (shot.mega) {
    await page.locator("button[aria-haspopup='true']").click();
    await page.waitForTimeout(400);
  }
  if (shot.mobileMenu) {
    await page.getByRole("button", { name: /Ouvrir le menu/i }).click();
    await page.locator("button[aria-controls]").filter({ hasText: "Solutions" }).first().click();
    await page.waitForTimeout(400);
  }
  const outfile = path.join(captures, shot.file);
  await page.screenshot({ path: outfile, fullPage: !shot.mega && !shot.mobileMenu });
  console.log("wrote", outfile);
}

await browser.close();
