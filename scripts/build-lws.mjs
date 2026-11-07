// Construit le site en export statique pour LWS (cPanel) et prépare le dossier à téléverser.
// Usage : $env:NEXT_PUBLIC_SITE_URL="https://onloutou.com"; $env:NEXT_PUBLIC_API_BASE="https://api.onloutou.com/api/v1"; npm run build:lws
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const api = process.env.NEXT_PUBLIC_API_BASE?.trim();
if (!site) console.warn("! NEXT_PUBLIC_SITE_URL absent : pas de canonical, sitemap ni images de partage.");
if (!api || !/^https?:\/\//.test(api)) {
  console.error("x NEXT_PUBLIC_API_BASE doit être une URL absolue (ex. https://api.onloutou.com/api/v1).");
  process.exit(1);
}

const env = { ...process.env, STATIC_EXPORT: "1" };
execSync("npx next build", { stdio: "inherit", env });

const out = path.resolve("lws-deploy");
if (!fs.existsSync(out)) {
  console.error("x Dossier lws-deploy/ introuvable : l'export a échoué.");
  process.exit(1);
}
fs.copyFileSync(path.resolve("deploy/lws.htaccess"), path.join(out, ".htaccess"));

// --- Images : variantes WebP, puis suppression des originaux lourds non référencés dans le HTML ---
const { default: sharp } = await import("sharp");
const list = (dir, acc = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) list(p, acc);
    else acc.push(p);
  }
  return acc;
};
const all = list(out);
const rasters = all.filter((f) => /\.(png|jpe?g)$/i.test(f) && f.includes(`${path.sep}assets${path.sep}`));
const htmlText = all
  .filter((f) => f.endsWith(".html") || f.endsWith(".txt") || f.endsWith(".xml"))
  .map((f) => fs.readFileSync(f, "utf8"))
  .join("\n");
let removed = 0;
for (const f of rasters) {
  const base = f.replace(/\.(png|jpe?g)$/i, "");
  const img = sharp(f);
  const { width = 1920 } = await img.metadata();
  for (const w of [828, 1920]) {
    await sharp(f)
      .resize({ width: Math.min(width, w), withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(`${base}-${w}.webp`);
  }
  const web = "/" + path.relative(out, f).split(path.sep).join("/");
  if (!htmlText.includes(web)) {
    fs.unlinkSync(f); // .htaccess sert alors la variante WebP à la même URL
    removed++;
  }
}
console.log(`Images : ${rasters.length} converties en WebP, ${removed} originaux retirés.`);

let files = 0;
let bytes = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else {
      files++;
      bytes += fs.statSync(p).size;
    }
  }
})(out);
console.log(`\nOK : lws-deploy/ prêt (${files} fichiers, ${(bytes / 1048576).toFixed(1)} Mo). Téléversez son contenu dans public_html.`);
