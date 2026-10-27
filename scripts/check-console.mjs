import { chromium } from "playwright";

const base = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";
const routes = ["/", "/solutions", "/expertise", "/a-propos", "/contact", "/page-inexistante-test"];

const browser = await chromium.launch();
const page = await browser.newPage();
const report = [];

for (const route of routes) {
  const errors = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  };
  page.on("console", onConsole);
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  page.off("console", onConsole);
  report.push({ route, errors });
}

await browser.close();
const failures = report.filter((item) => item.errors.length);
console.log(JSON.stringify({ ok: failures.length === 0, report }, null, 2));
process.exit(failures.length ? 1 : 0);
