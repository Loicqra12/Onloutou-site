/**
 * Agrège les rapports Lighthouse bruts (médiane) en summary.md / summary.json
 * Usage: node scripts/performance-summarize.mjs baseline|after
 */
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
const outRoot = path.join(root, "docs", "performance", phase);

function median(values) {
  const sorted = [...values].filter((v) => v != null && !Number.isNaN(v)).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function walkJson(dir) {
  const out = [];
  async function walk(d) {
    for (const name of await fs.readdir(d)) {
      const full = path.join(d, name);
      const st = await fs.stat(full);
      if (st.isDirectory()) await walk(full);
      else if (name.endsWith(".report.json")) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

function parseReport(filePath, raw) {
  const report = JSON.parse(raw);
  const audits = report.audits ?? {};
  const pick = (id) => audits[id]?.numericValue ?? null;
  const rel = filePath.replace(/\\/g, "/");
  const match = rel.match(/\/(mobile|desktop)\/(.+)-run\d+\.report\.json$/);
  const formFactor = match?.[1] ?? "?";
  const slug = match?.[2] ?? "?";
  const route = slug === "home" ? "/" : `/${slug.replace(/__/g, "/")}`;
  return {
    route,
    formFactor,
    perf: Math.round((report.categories?.performance?.score ?? 0) * 100),
    lcp: pick("largest-contentful-paint"),
    cls: pick("cumulative-layout-shift"),
    fcp: pick("first-contentful-paint"),
    tbt: pick("total-blocking-time"),
    si: pick("speed-index"),
    transferBytes: pick("total-byte-weight"),
    requests: audits["network-requests"]?.numericValue ?? null,
    lighthouseVersion: report.lighthouseVersion,
  };
}

async function main() {
  const rawDir = path.join(outRoot, "raw");
  const files = await walkJson(rawDir);
  const groups = new Map();

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const row = parseReport(file, raw);
    const key = `${row.route}|${row.formFactor}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const summaryRows = [];
  for (const [key, rows] of groups) {
    const [route, formFactor] = key.split("|");
    summaryRows.push({
      route,
      profile: formFactor,
      performance: median(rows.map((r) => r.perf)),
      lcp_ms: Math.round(median(rows.map((r) => r.lcp)) ?? 0),
      cls: Number((median(rows.map((r) => r.cls)) ?? 0).toFixed(3)),
      fcp_ms: Math.round(median(rows.map((r) => r.fcp)) ?? 0),
      tbt_ms: Math.round(median(rows.map((r) => r.tbt)) ?? 0),
      speed_index_ms: Math.round(median(rows.map((r) => r.si)) ?? 0),
      transfer_kb: Math.round((median(rows.map((r) => r.transferBytes)) ?? 0) / 1024),
      requests: Math.round(median(rows.map((r) => r.requests)) ?? 0),
      runs: rows.length,
      lighthouseVersion: rows[0]?.lighthouseVersion,
    });
  }

  summaryRows.sort((a, b) => a.route.localeCompare(b.route) || a.profile.localeCompare(b.profile));

  await fs.writeFile(path.join(outRoot, "summary.json"), `${JSON.stringify(summaryRows, null, 2)}\n`);

  const md = [
    `# Lighthouse ${phase} (agrégé)`,
    "",
    `Généré : ${new Date().toISOString()}`,
    "",
    "| Route | Profil | Perf | LCP (ms) | CLS | FCP (ms) | TBT (ms) | SI (ms) | Ko | Req | Runs |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...summaryRows.map(
      (r) =>
        `| ${r.route} | ${r.profile} | ${r.performance} | ${r.lcp_ms} | ${r.cls} | ${r.fcp_ms} | ${r.tbt_ms} | ${r.speed_index_ms} | ${r.transfer_kb} | ${r.requests} | ${r.runs} |`,
    ),
    "",
  ].join("\n");
  await fs.writeFile(path.join(outRoot, "summary.md"), md);
  console.log(`Wrote ${summaryRows.length} rows to docs/performance/${phase}/summary.md`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
