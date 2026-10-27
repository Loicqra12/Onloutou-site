/**
 * Extrait LCP + phases depuis les rapports Lighthouse pass-2 (médiane run1).
 * Usage: node scripts/extract-lcp-breakdown.mjs pass-2/baseline
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const phase = process.argv[2] ?? "pass-2/baseline";
const rawDir = path.join(root, "docs", "performance", phase, "raw", "mobile");

const routes = [
  ["home", "/"],
  ["solutions", "/solutions"],
  ["solutions__plateformes-sur-mesure", "/solutions/plateformes-sur-mesure"],
  ["equipements__vehicules", "/equipements/vehicules"],
  ["produits", "/produits"],
  ["aide", "/aide"],
];

async function main() {
  const rows = [];
  for (const [slug, route] of routes) {
    const file = path.join(rawDir, `${slug}-run1.report.json`);
    const report = JSON.parse(await fs.readFile(file, "utf8"));
    const audits = report.audits ?? {};
    const lcp = audits["largest-contentful-paint"]?.numericValue;
    const phases = audits["lcp-breakdown-insight"]?.details?.items?.[0]?.items ?? {};
    const el = audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
    rows.push({
      route,
      selector: el?.selector ?? "—",
      lcp_ms: lcp ? Math.round(lcp) : null,
      ttfb: phases.timeToFirstByte?.value ?? null,
      loadDelay: phases.resourceLoadDelay?.value ?? null,
      loadDuration: phases.resourceLoadDuration?.value ?? null,
      renderDelay: phases.elementRenderDelay?.value ?? null,
    });
  }
  console.log(JSON.stringify(rows, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
