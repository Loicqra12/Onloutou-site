import { expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const HOME_SECTIONS = [
  "hero",
  "solutions",
  "equipment",
  "fleet",
  "terrain",
  "build",
  "projects",
  "company",
  "contact-cta",
] as const;

export const FAILURE_DIR = path.join("docs", "captures", "failures");

type SectionReport = {
  section: string | null;
  opacity: string;
  visibility: string;
  clipPath: string;
  height: number;
  motionState: string | null;
  childHidden: boolean;
};

export async function collectSectionReports(page: Page): Promise<SectionReport[]> {
  return page.evaluate((keys) => {
    return keys.map((key) => {
      const el = document.querySelector(`[data-section="${key}"]`);
      if (!el) {
        return {
          section: key,
          opacity: "missing",
          visibility: "missing",
          clipPath: "none",
          height: 0,
          motionState: null,
          childHidden: true,
        };
      }
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const textNodes = [...el.querySelectorAll("h1, h2, h3, p, a")].slice(0, 10);
      const childHidden =
        textNodes.length > 0 &&
        textNodes.every((node) => {
          const style = getComputedStyle(node);
          return style.opacity === "0" || style.visibility === "hidden";
        });
      return {
        section: key,
        opacity: cs.opacity,
        visibility: cs.visibility,
        clipPath: cs.clipPath || "none",
        height: rect.height,
        motionState: el.getAttribute("data-motion-state"),
        childHidden,
      };
    });
  }, [...HOME_SECTIONS]);
}

export async function assertHomeSectionsVisible(page: Page, label: string) {
  const reports = await collectSectionReports(page);
  const failed = reports.filter((item) => {
    const opacity = Number(item.opacity);
    const clipHides = /inset\(\s*0px\s+0px\s+0px\s+100%|inset\(\s*0\s+0\s+0\s+100%/.test(item.clipPath);
    return (
      item.opacity === "missing" ||
      Number.isNaN(opacity) ||
      opacity < 0.05 ||
      item.visibility === "hidden" ||
      item.height < 40 ||
      clipHides ||
      item.childHidden
    );
  });

  if (failed.length > 0) {
    mkdirSync(FAILURE_DIR, { recursive: true });
    const file = path.join(FAILURE_DIR, `${label.replace(/\s+/g, "-")}.png`);
    await page.screenshot({ path: file, fullPage: true });
  }

  expect(failed, `${label}: ${JSON.stringify(failed)}`).toEqual([]);
}

export async function scrollHome(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.7));
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 80));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    window.scrollTo(0, 0);
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  });
}
