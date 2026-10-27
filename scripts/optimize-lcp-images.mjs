/**
 * Variantes WebP des images LCP (sources conservées).
 * Utilise sharp déjà présent via Next (optional dependency).
 *
 * Usage: node scripts/optimize-lcp-images.mjs
 * Sortie: public/assets/images/lcp/<basename>.w<width>.webp
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "assets", "images", "lcp");

/** Chemins publics (sans leading slash) et largeurs cibles */
const TARGETS = [
  {
    rel: "assets/images/solutions/installation-traceur-gps-onloutou.png",
    widths: [640, 828, 1080],
    quality: 82,
  },
  {
    rel: "assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
    widths: [640, 828, 1080],
    quality: 82,
  },
  {
    rel: "assets/images/equipment/vehicles/Flotte professionnelle inspectée à Abidjan-2.png",
    widths: [640, 828, 1080],
    quality: 82,
  },
  {
    rel: "assets/images/solutions/installation-gps-berline-onloutou.png",
    widths: [640, 828],
    quality: 82,
  },
  {
    rel: "assets/images/menu/mega-menu-equipements-onloutou.png",
    widths: [480, 640],
    quality: 80,
  },
  {
    rel: "assets/images/projects/project-b/inspection-groupe-electrogene.png",
    widths: [480, 640],
    quality: 82,
  },
];

function slugBase(rel) {
  return path.basename(rel, path.extname(rel)).replace(/[^\w.-]+/g, "-").slice(0, 80);
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const manifest = [];

  for (const target of TARGETS) {
    const input = path.join(publicDir, target.rel);
    const base = slugBase(target.rel);
    const meta = await sharp(input).metadata();
    const outputs = [];

    for (const width of target.widths) {
      if (meta.width && width > meta.width) continue;
      const outName = `${base}.w${width}.webp`;
      const outPath = path.join(outDir, outName);
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: target.quality, effort: 4 })
        .toFile(outPath);
      const stat = await fs.stat(outPath);
      outputs.push({ width, file: `/assets/images/lcp/${outName}`, bytes: stat.size });
    }

    const srcStat = await fs.stat(input);
    manifest.push({
      source: `/${target.rel.replace(/\\/g, "/")}`,
      sourceBytes: srcStat.size,
      intrinsic: { width: meta.width, height: meta.height },
      variants: outputs,
    });
  }

  const manifestPath = path.join(root, "docs", "performance", "pass-2", "lcp-variants.manifest.json");
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), items: manifest }, null, 2)}\n`);
  console.log(`Wrote ${manifest.length} sources → ${manifestPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
