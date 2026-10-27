import { chromium, devices } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

async function record(url, outfile, viewport) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices[viewport],
    recordVideo: { dir: path.dirname(outfile), size: viewport === "Desktop Chrome" ? { width: 1440, height: 900 } : { width: 375, height: 812 } },
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(1200);
  if (viewport === "Desktop Chrome") {
    const card = page.locator(".interactive-card").first();
    if (await card.count()) await card.hover();
    await page.waitForTimeout(600);
  }
  await context.close();
  await browser.close();
  const generated = await import("fs").then((fs) =>
    fs.readdirSync(path.dirname(outfile)).find((f) => f.endsWith(".webm")),
  );
  if (generated) {
    await import("fs").then((fs) => fs.renameSync(path.join(path.dirname(outfile), generated), outfile));
    console.log("wrote", outfile);
  }
}

const captures = [
  { url: `${base}/`, out: "motion-home-desktop.webm", device: "Desktop Chrome" },
  { url: `${base}/`, out: "motion-home-mobile.webm", device: "iPhone 13" },
  { url: `${base}/solutions`, out: "motion-solutions-desktop.webm", device: "Desktop Chrome" },
  { url: `${base}/a-propos`, out: "motion-about-desktop.webm", device: "Desktop Chrome" },
];

for (const item of captures) {
  await record(item.url, path.join(root, "docs", "captures", item.out), item.device);
}
