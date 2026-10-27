/**
 * Audit Lighthouse laboratoire (production). Nécessite un serveur déjà démarré.
 *
 * Usage:
 *   LH_BASE_URL=http://127.0.0.1:3000 node scripts/performance-audit.mjs baseline
 *   LH_BASE_URL=http://127.0.0.1:3000 node scripts/performance-audit.mjs after
 *
 * Variables:
 *   LH_RUNS=3 (défaut)
 *   LH_ROUTES=/,/solutions,... (séparées par des virgules)
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const phaseArg = process.argv[2] ?? "baseline";
const phase =
  phaseArg === "pass-2-baseline" || phaseArg === "pass-2-after"
    ? phaseArg.replace("pass-2-", "pass-2/")
    : phaseArg === "after"
      ? "after"
      : "baseline";
const base = process.env.LH_BASE_URL ?? "http://127.0.0.1:3000";
const runs = Number(process.env.LH_RUNS ?? "3", 10);
const defaultRoutes = [
  "/",
  "/solutions",
  "/solutions/plateformes-sur-mesure",
  "/equipements/vehicules",
  "/produits",
  "/aide",
];
const routes = (process.env.LH_ROUTES ?? defaultRoutes.join(","))
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

const outRoot = path.join(root, "docs", "performance", phase);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function runLighthouse(url, formFactor, destBase) {
  return new Promise((resolve, reject) => {
    const jsonPath = `${destBase}.report.json`;
    const htmlPath = `${destBase}.report.html`;
    const mobile = formFactor === "mobile";
    const args = [
      url,
      "--quiet",
      "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
      "--only-categories=performance",
      "--output=json",
      "--output=html",
      `--output-path=${destBase}`,
      ...(mobile
        ? ["--form-factor=mobile", "--screenEmulation.mobile=true"]
        : ["--preset=desktop"]),
    ];
    const child = spawn("npx", ["lighthouse", ...args], {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (c) => {
      stderr += c.toString();
    });
    child.on("close", async (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `lighthouse exit ${code}`));
        return;
      }
      try {
        const raw = await fs.readFile(jsonPath, "utf8");
        const report = JSON.parse(raw);
        const perf = Math.round((report.categories?.performance?.score ?? 0) * 100);
        const audits = report.audits ?? {};
        const pick = (id) => audits[id]?.numericValue ?? null;
        const transfer =
          audits["total-byte-weight"]?.numericValue ??
          audits["network-requests"]?.details?.items?.reduce((s, i) => s + (i.transferSize ?? 0), 0) ??
          null;
        resolve({
          perf,
          lcp: pick("largest-contentful-paint"),
          cls: pick("cumulative-layout-shift"),
          fcp: pick("first-contentful-paint"),
          tbt: pick("total-blocking-time"),
          si: pick("speed-index"),
          requests: audits["network-requests"]?.numericValue ?? null,
          transferBytes: transfer,
          lighthouseVersion: report.lighthouseVersion,
          userAgent: report.userAgent,
          jsonPath,
          htmlPath,
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

async function measureRoute(route, formFactor) {
  const url = `${base}${route === "/" ? "/" : route}`;
  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "__");
  const results = [];
  for (let i = 0; i < runs; i += 1) {
    const destBase = path.join(outRoot, "raw", formFactor, `${slug}-run${i + 1}`);
    await fs.mkdir(path.dirname(destBase), { recursive: true });
    results.push(await runLighthouse(url, formFactor, destBase));
  }
  const med = {
    perf: median(results.map((r) => r.perf)),
    lcp: median(results.map((r) => r.lcp ?? 0)),
    cls: median(results.map((r) => r.cls ?? 0)),
    fcp: median(results.map((r) => r.fcp ?? 0)),
    tbt: median(results.map((r) => r.tbt ?? 0)),
    si: median(results.map((r) => r.si ?? 0)),
    transferBytes: median(results.map((r) => r.transferBytes ?? 0)),
    requests: median(results.map((r) => r.requests ?? 0)),
    lighthouseVersion: results[0].lighthouseVersion,
    userAgent: results[0].userAgent,
  };
  return { route, formFactor, runs: results, median: med };
}

async function main() {
  await fs.mkdir(path.join(outRoot, "raw"), { recursive: true });
  const meta = {
    phase,
    measuredAt: new Date().toISOString(),
    baseUrl: base,
    runsPerRoute: runs,
    routes,
    environment: "local Windows, next start production",
    note: "Scores laboratoire — pas de CrUX ni INP terrain.",
  };
  const all = [];
  for (const route of routes) {
    for (const formFactor of ["mobile", "desktop"]) {
      console.log(`LH ${phase} ${formFactor} ${route} (${runs} runs)...`);
      all.push(await measureRoute(route, formFactor));
    }
  }

  const summaryRows = all.map(({ route, formFactor, median: m }) => ({
    route,
    profile: formFactor,
    performance: m.perf,
    lcp_ms: Math.round(m.lcp),
    cls: Number(m.cls.toFixed(3)),
    fcp_ms: Math.round(m.fcp),
    tbt_ms: Math.round(m.tbt),
    speed_index_ms: Math.round(m.si),
    transfer_kb: Math.round(m.transferBytes / 1024),
    requests: Math.round(m.requests),
  }));

  await fs.writeFile(path.join(outRoot, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  await fs.writeFile(path.join(outRoot, "summary.json"), `${JSON.stringify(summaryRows, null, 2)}\n`);

  const md = [
    `# Lighthouse ${phase}`,
    "",
    `- Date : ${meta.measuredAt}`,
    `- URL : ${base}`,
    `- Exécutions par route/profil : ${runs} (médiane ci-dessous)`,
    `- Lighthouse : ${all[0]?.runs[0]?.lighthouseVersion ?? "?"}`,
    "",
    "| Route | Profil | Perf | LCP (ms) | CLS | FCP (ms) | TBT (ms) | SI (ms) | Transfert (Ko) | Req |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...summaryRows.map(
      (r) =>
        `| ${r.route} | ${r.profile} | ${r.performance} | ${r.lcp_ms} | ${r.cls} | ${r.fcp_ms} | ${r.tbt_ms} | ${r.speed_index_ms} | ${r.transfer_kb} | ${r.requests} |`,
    ),
    "",
    "Rapports bruts : `docs/performance/" + phase + "/raw/`.",
    "",
  ].join("\n");
  await fs.writeFile(path.join(outRoot, "summary.md"), md);
  console.log(`Done. Summary: docs/performance/${phase}/summary.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
