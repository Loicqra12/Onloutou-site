import fs from "node:fs";
const f = process.argv[2];
const d = JSON.parse(fs.readFileSync(f, "utf8"));
const R = d.results;
console.log("rows", R.length);
console.log("non-200:", [...new Set(R.filter((r) => r.status !== 200).map((r) => `${r.route}:${r.status}${r.finalUrl ? "->" + r.finalUrl : ""}`))].join(" | "));
console.log("redirects:", [...new Set(R.filter((r) => r.finalUrl).map((r) => `${r.route}->${r.finalUrl}`))].join(" | "));
const errs = new Map();
for (const r of R) for (const e of r.errors ?? []) errs.set(`${r.route} :: ${e}`, (errs.get(`${r.route} :: ${e}`) ?? 0) + 1);
console.log("console errors:", errs.size); for (const [k, v] of [...errs].slice(0, 15)) console.log("  ", v, k);
const w = (n) => R.filter((r) => r.w === n);
for (const n of [320, 360]) {
  console.log(`\n== tiny text <12px @${n}`);
  for (const r of w(n).filter((r) => r.tiny > 0)) console.log(`  ${r.route} x${r.tiny} e.g. ${r.tinyEx[0]}`);
  console.log(`== small targets <24px @${n}`);
  for (const r of w(n).filter((r) => r.small > 0)) console.log(`  ${r.route} x${r.small} e.g. ${r.smallEx.slice(0, 2).join(" ; ")}`);
}
