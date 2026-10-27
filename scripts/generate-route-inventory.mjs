import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");
const OUT = path.join(ROOT, "docs", "responsive", "route-inventory.md");

function discoverRoutes() {
  const routes = [];
  function walk(dir, segments) {
    for (const name of fs.readdirSync(dir)) {
      if (name.startsWith("_") || name.startsWith(".")) continue;
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (name.startsWith("(") && name.endsWith(")")) walk(full, segments);
        else walk(full, [...segments, name]);
        continue;
      }
      if (name === "page.tsx") {
        routes.push({
          route: segments.length ? `/${segments.join("/")}` : "/",
          file: path.relative(ROOT, full).replace(/\\/g, "/"),
        });
      }
    }
  }
  walk(APP_DIR, []);
  routes.sort((a, b) => a.route.localeCompare(b.route));
  return routes;
}

function classify(route) {
  if (route === "/") return { type: "Accueil", priority: "Critique" };
  if (["/contact", "/aide", "/produits", "/livraison"].includes(route))
    return { type: "Conversion / service", priority: "Critique" };
  if (route.startsWith("/espace-"))
    return { type: "Prévisualisation espace", priority: "Critique" };
  if (
    ["/mentions-legales", "/confidentialite", "/cookies", "/conditions-utilisation"].includes(route)
  )
    return { type: "Juridique", priority: "Haute" };
  if (route.startsWith("/solutions")) return { type: "Solutions (alias)", priority: "Moyenne" };
  if (route.startsWith("/equipements")) return { type: "Équipements", priority: "Moyenne" };
  if (route.startsWith("/partenaires") || route.startsWith("/devenir-"))
    return { type: "Partenaires", priority: "Moyenne" };
  return { type: "Contenu institutionnel", priority: "Moyenne" };
}

function scanPage(fileRel) {
  const text = fs.readFileSync(path.join(ROOT, fileRel), "utf8");
  const imports = [...text.matchAll(/from\s+["']@\/([^"']+)["']/g)].map((m) => m[1]);
  const components = imports
    .filter((i) => i.startsWith("components/"))
    .map((i) => i.replace("components/", ""))
    .slice(0, 6);
  const hasForm = /Form|Configurator|ContactForm|WhatsApp/i.test(text);
  const hasTable = /Table|Matrix|leg-table/i.test(text);
  const hasHero = /Hero/i.test(text);
  const interactions = [
    hasForm ? "formulaire" : null,
    hasHero ? "hero" : null,
    hasTable ? "tableau" : null,
    /accordion|Accordion|faq/i.test(text) ? "accordéon" : null,
  ].filter(Boolean);
  const images = /Image|next\/image|photo|gallery|Gallery/i.test(text) ? "oui" : "—";
  return {
    components: components.length ? components.join(", ") : "—",
    interactions: interactions.length ? interactions.join(", ") : "navigation",
    images,
  };
}

const routes = discoverRoutes();
const generated = new Date().toISOString().slice(0, 10);

let md = `# Inventaire des routes (responsive)\n\n`;
md += `Généré automatiquement depuis \`src/app/**/page.tsx\` le ${generated}.\n\n`;
md += `Total : **${routes.length}** routes applicatives (+ page 404 via \`not-found.tsx\`, testée séparément).\n\n`;
md += `| Route | Type | Composants critiques | Interactions | Images | Priorité |\n`;
md += `| --- | --- | --- | --- | --- | --- |\n`;

for (const { route, file } of routes) {
  const { type, priority } = classify(route);
  const meta = scanPage(file);
  md += `| \`${route}\` | ${type} | ${meta.components} | ${meta.interactions} | ${meta.images} | ${priority} |\n`;
}

md += `| \`404\` (not-found) | Erreur | layout/BrandLogo | lien retour | — | Haute |\n`;

md += `\n## Exclusions débordement (scroll horizontal volontaire)\n\n`;
md += `| Sélecteur | Raison |\n| --- | --- |\n`;
md += `| \`.leg-table-wrap\` | Tableaux juridiques / cookies |\n`;
md += `| \`.home-terrain-strip\`, \`.home-show-track\` | Galeries défilantes accueil |\n`;
md += `| \`.epp-preview__nav ul\`, \`.epp-products__table-wrap\`, \`.epp-matrix__wrap\` | Prévisualisation partenaire |\n`;
md += `| \`.edl-matrix__wrap\` | Matrice modules livreur |\n`;
md += `| \`.hlp-nav\`, \`.hlp-nav__list\` | Filtres catégories aide (mobile) |\n`;
md += `| \`.sales-compare__table-wrap\` | Matrice comparaison produits (desktop) |\n`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md, "utf8");
console.log(`Wrote ${OUT} (${routes.length} routes)`);
