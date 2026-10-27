import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "assets", "images");

const renames = [
  ["solutions", "Installation d’un GPS Onloutou dans une berline-2.png", "installation-gps-berline-onloutou.png"],
  ["solutions", "Technicien Onloutou installant un traceur GPS-1.png", "installation-traceur-gps-onloutou.png"],
  ["solutions", "Techniciens ONLOUTOU inspectant le câblage-3.png", "inspection-cablage-onloutou.png"],
  ["about", "Façade ONLOUTOU au slogan corrigé-6.png", "facade-onloutou-slogan.png"],
  ["about", "Façade ONLOUTOU, voiture et arbre-4.png", "facade-onloutou-vehicule-arbre.png"],
  ["about", "Devanture ONLOUTOU, palmiers et porte ouverte-2.png", "devanture-onloutou-palmiers.png"],
  ["about", "Équipe ONLOUTOU devant une voiture argentée-5.png", "equipe-onloutou-vehicule.png"],
  ["about", "Deux hommes au stand d’exposition ONLOUTOU-1.png", "stand-exposition-onloutou.png"],
  ["solutions/dashboard", "Géolocalisation de flotte ONLOUTOU à Abidjan-3.png", "geolocalisation-flotte-abidjan.png"],
  ["solutions/dashboard", "Supervision de flotte ONLOUTOU-2.png", "supervision-flotte-onloutou.png"],
  ["logo", "Emblème ovale Onloutou restauré-1.png", "embleme-ovale-onloutou.png"],
];

for (const [subdir, from, to] of renames) {
  const dir = path.join(root, subdir);
  const fromPath = path.join(dir, from);
  const toPath = path.join(dir, to);
  if (!fs.existsSync(fromPath)) {
    const match = fs.readdirSync(dir).find((f) => f.normalize("NFC") === from.normalize("NFC") || f.includes(from.slice(0, 20)));
    if (match) {
      fs.renameSync(path.join(dir, match), toPath);
      console.log("renamed", match, "->", to);
      continue;
    }
    if (fs.existsSync(toPath)) {
      console.log("already", to);
      continue;
    }
    console.error("missing", fromPath);
    continue;
  }
  fs.renameSync(fromPath, toPath);
  console.log("renamed", from, "->", to);
}

function pngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".png")) {
      const s = pngSize(p);
      console.log(JSON.stringify({ file: path.relative(root, p), ...s }));
    }
  }
}
walk(root);
