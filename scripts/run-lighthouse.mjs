import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const base = process.env.LH_BASE_URL ?? "http://localhost:3000";

const routes = process.argv.slice(2);
const targets = routes.length ? routes : ["/", "/solutions", "/contact"];

function runLighthouse(url) {
  return new Promise((resolve, reject) => {
    const out = path.join(root, "docs", "lighthouse-temp.json");
    const args = [
      url,
      "--quiet",
      "--chrome-flags=--headless=new --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--output=json",
      `--output-path=${out}`,
    ];
    const child = spawn("npx", ["lighthouse", ...args], {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", async (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `lighthouse exit ${code}`));
        return;
      }
      try {
        const raw = await fs.readFile(out, "utf8");
        const report = JSON.parse(raw);
        await fs.unlink(out).catch(() => undefined);
        const categories = report.categories ?? {};
        const scores = Object.fromEntries(
          Object.entries(categories).map(([key, value]) => [key, Math.round((value.score ?? 0) * 100)]),
        );
        const audits = report.audits ?? {};
        resolve({
          scores,
          cls: audits["cumulative-layout-shift"]?.numericValue,
          categoriesKeys: Object.keys(categories),
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

const results = {};

for (const route of targets) {
  const url = `${base}${route}`;
  if (route === "/") {
    const runs = [];
    for (let i = 0; i < 3; i += 1) {
      runs.push(await runLighthouse(url));
    }
    const median = (values) => {
      const sorted = [...values].sort((a, b) => a - b);
      return sorted[1];
    };
    const keys = ["performance", "accessibility", "best-practices", "seo"];
    const scores = Object.fromEntries(
      keys.map((key) => [key, median(runs.map((run) => run.scores[key] ?? 0))]),
    );
    results[route] = { median: scores, runs: runs.map((r) => r.scores), cls: runs.map((r) => r.cls) };
  } else {
    const run = await runLighthouse(url);
    results[route] = run;
  }
}

console.log(JSON.stringify(results, null, 2));
