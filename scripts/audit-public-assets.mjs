/**
 * Inventaire déterministe des fichiers sous public/ (poids, type, dimensions PNG/JPEG/WebP).
 * Usage: node scripts/audit-public-assets.mjs
 * Ne modifie aucun fichier.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"]);

function readPngDimensions(buffer) {
  if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function readJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const len = buffer.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + len;
  }
  return null;
}

async function walk(dir, base = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name).replace(/\\/g, "/");
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, rel)));
    } else {
      files.push({ rel: `/${rel}`, full });
    }
  }
  return files;
}

async function main() {
  const files = await walk(publicDir);
  const rows = [];

  for (const { rel, full } of files) {
    const stat = await fs.stat(full);
    const ext = path.extname(full).toLowerCase();
    let width = null;
    let height = null;
    if (IMAGE_EXT.has(ext) && ext !== ".svg") {
      const buf = await fs.readFile(full);
      const dims = ext === ".png" ? readPngDimensions(buf) : readJpegDimensions(buf);
      if (dims) {
        width = dims.width;
        height = dims.height;
      }
    }
    rows.push({
      path: rel.startsWith("/") ? rel : `/${rel}`,
      bytes: stat.size,
      ext: ext || "(none)",
      width,
      height,
    });
  }

  rows.sort((a, b) => b.bytes - a.bytes);

  const outDir = path.join(root, "docs", "performance");
  await fs.mkdir(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "assets-inventory.json");
  await fs.writeFile(jsonPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), files: rows }, null, 2)}\n`);

  const heavy = rows.filter((r) => r.bytes >= 400_000);
  const md = [
    "# Inventaire des assets publics",
    "",
    `Généré le ${new Date().toISOString().slice(0, 10)} via \`npm run audit:assets\`.`,
    "",
    `Total fichiers : **${rows.length}** — poids cumulé : **${(rows.reduce((s, r) => s + r.bytes, 0) / 1_048_576).toFixed(2)} Mo**.`,
    "",
    "## Fichiers ≥ 400 Ko (priorité optimisation)",
    "",
    "| Chemin | Ko | Dimensions |",
    "| --- | ---: | --- |",
    ...heavy.map(
      (r) =>
        `| \`${r.path}\` | ${(r.bytes / 1024).toFixed(0)} | ${r.width && r.height ? `${r.width}×${r.height}` : "—"} |`,
    ),
    "",
    "JSON détaillé : `docs/performance/assets-inventory.json`.",
    "",
    "Compléter manuellement dans le rapport d’audit : page utilisatrice, above/below fold, eager/lazy.",
    "",
  ].join("\n");

  await fs.writeFile(path.join(outDir, "assets-inventory.md"), md);
  console.log(`Wrote ${jsonPath} and assets-inventory.md (${rows.length} files, ${heavy.length} heavy).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
