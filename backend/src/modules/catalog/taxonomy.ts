/**
 * Source unique des familles / catégories d'articles.
 * Copie synchronisée : t60-api/src/modules/catalog/taxonomy.ts
 * et le front (espace partenaire + admin). L'API l'expose aussi en GET /partner/taxonomy.
 *
 * Décision 4 (bébé / enfance) : aucune page publique `/bebe` n'existe dans l'app.
 * L'URL publique conservée est `/articles/enfance`. Le slug historique « bebe »
 * est un alias interne qui pointe vers cette famille, sans créer de catégorie publique.
 */

export type SpecFieldId = "capacity" | "memory" | "dimensions" | "composition" | "brand";

export type ArticleSpecField = {
  id: SpecFieldId;
  label: string;
  optional?: boolean;
  placeholder?: string;
};

export type ArticleCategory = {
  slug: string;
  label: string;
  specs: ArticleSpecField[];
};

export type ArticleFamily = {
  slug: string;
  label: string;
  shortLabel: string;
  /** Valeur de l'enum Prisma ProductCategory. */
  productCategory:
    | "VEHICLES"
    | "MOTORCYCLES"
    | "TRUCKS_MACHINERY"
    | "TOOLS"
    | "CONNECTED"
    | "APPLIANCES"
    | "IT"
    | "FURNITURE"
    | "EVENTS"
    | "CHILDCARE"
    | "OTHER";
  /** URL publique existante, conservée telle quelle. */
  publicPath: string;
  icon: "fridge" | "laptop" | "chair" | "plates" | "stroller" | "van" | "moto" | "excavator" | "tools" | "connected";
  categories: ArticleCategory[];
};

const CAP: ArticleSpecField = { id: "capacity", label: "Capacité", placeholder: "ex. 250 L" };
const MEM: ArticleSpecField = { id: "memory", label: "Mémoire", placeholder: "ex. 16 Go" };
const DIM: ArticleSpecField = { id: "dimensions", label: "Dimensions", optional: true, placeholder: "À préciser" };
const BRAND: ArticleSpecField = { id: "brand", label: "Marque", optional: true, placeholder: "À préciser" };
const COMP: ArticleSpecField = { id: "composition", label: "Composition", placeholder: "ex. 25 assiettes par lot" };

export const articleFamilies: ArticleFamily[] = [
  {
    slug: "electromenager",
    label: "Électroménager",
    shortLabel: "Électroménager",
    productCategory: "APPLIANCES",
    publicPath: "/articles/electromenager",
    icon: "fridge",
    categories: [
      { slug: "refrigerateurs", label: "Réfrigérateurs", specs: [CAP, DIM, BRAND] },
      { slug: "congelateurs", label: "Congélateurs", specs: [CAP, DIM, BRAND] },
      { slug: "lave-linge", label: "Lave-linge", specs: [CAP, DIM, BRAND] },
      { slug: "autres-electromenager", label: "Autre électroménager", specs: [DIM, BRAND] },
    ],
  },
  {
    slug: "informatique",
    label: "Informatique & téléphonie",
    shortLabel: "Informatique",
    productCategory: "IT",
    publicPath: "/articles/informatique",
    icon: "laptop",
    categories: [
      { slug: "ordinateurs-portables", label: "Ordinateurs portables", specs: [MEM, BRAND] },
      { slug: "ordinateurs-bureau", label: "Ordinateurs de bureau", specs: [MEM, BRAND] },
      { slug: "telephones-tablettes", label: "Téléphones et tablettes", specs: [MEM, BRAND] },
      { slug: "autres-informatique", label: "Autre informatique", specs: [BRAND] },
    ],
  },
  {
    slug: "mobilier",
    label: "Mobilier",
    shortLabel: "Mobilier",
    productCategory: "FURNITURE",
    publicPath: "/articles/mobilier",
    icon: "chair",
    categories: [
      { slug: "tables", label: "Tables", specs: [DIM, BRAND] },
      { slug: "chaises", label: "Chaises", specs: [DIM, BRAND] },
      { slug: "rangements", label: "Rangements", specs: [DIM, BRAND] },
      { slug: "autres-mobilier", label: "Autre mobilier", specs: [DIM, BRAND] },
    ],
  },
  {
    slug: "reception",
    label: "Réception & événementiel",
    shortLabel: "Vaisselle",
    productCategory: "EVENTS",
    publicPath: "/articles/reception",
    icon: "plates",
    categories: [
      { slug: "vaisselle", label: "Vaisselle", specs: [COMP, BRAND] },
      { slug: "verrerie", label: "Verrerie", specs: [COMP, BRAND] },
      { slug: "arts-de-la-table", label: "Arts de la table", specs: [COMP, BRAND] },
      { slug: "autres-reception", label: "Autre réception", specs: [COMP] },
    ],
  },
  {
    slug: "enfance",
    label: "Bébé & enfance",
    shortLabel: "Enfance",
    productCategory: "CHILDCARE",
    publicPath: "/articles/enfance",
    icon: "stroller",
    categories: [
      { slug: "poussettes", label: "Poussettes", specs: [DIM, BRAND] },
      { slug: "lits-chaises", label: "Lits et chaises hautes", specs: [DIM, BRAND] },
      { slug: "autres-enfance", label: "Autre puériculture", specs: [BRAND] },
    ],
  },
  {
    slug: "vehicules",
    label: "Véhicules",
    shortLabel: "Véhicules",
    productCategory: "VEHICLES",
    publicPath: "/equipements/vehicules",
    icon: "van",
    categories: [
      { slug: "utilitaires", label: "Utilitaires", specs: [BRAND] },
      { slug: "voitures", label: "Voitures", specs: [BRAND] },
      { slug: "autres-vehicules", label: "Autre véhicule", specs: [BRAND] },
    ],
  },
  {
    slug: "motos",
    label: "Motos",
    shortLabel: "Motos",
    productCategory: "MOTORCYCLES",
    publicPath: "/equipements/motos",
    icon: "moto",
    categories: [
      { slug: "motos-scooters", label: "Motos et scooters", specs: [BRAND] },
      { slug: "autres-motos", label: "Autre deux-roues", specs: [BRAND] },
    ],
  },
  {
    slug: "camions-engins",
    label: "Camions & engins",
    shortLabel: "Camions",
    productCategory: "TRUCKS_MACHINERY",
    publicPath: "/equipements/camions-engins",
    icon: "excavator",
    categories: [
      { slug: "camions", label: "Camions", specs: [BRAND] },
      { slug: "engins", label: "Engins", specs: [BRAND] },
    ],
  },
  {
    slug: "outils-materiels",
    label: "Outils & matériel",
    shortLabel: "Outils",
    productCategory: "TOOLS",
    publicPath: "/equipements/outils-materiels",
    icon: "tools",
    categories: [
      { slug: "outillage", label: "Outillage", specs: [BRAND] },
      { slug: "materiel-chantier", label: "Matériel de chantier", specs: [BRAND] },
    ],
  },
  {
    slug: "equipements-connectes",
    label: "Équipements connectés",
    shortLabel: "Connectés",
    productCategory: "CONNECTED",
    publicPath: "/equipements/equipements-connectes",
    icon: "connected",
    categories: [
      { slug: "trackers", label: "Trackers et capteurs", specs: [BRAND] },
      { slug: "autres-connectes", label: "Autre équipement connecté", specs: [BRAND] },
    ],
  },
];

/** Alias historique : ne crée pas d'URL publique distincte. */
export const familyAliases: Record<string, string> = { bebe: "enfance" };

export function resolveFamilySlug(slug?: string | null): string | null {
  if (!slug) return null;
  return familyAliases[slug] ?? slug;
}

export function getFamily(slug?: string | null): ArticleFamily | undefined {
  const resolved = resolveFamilySlug(slug);
  return articleFamilies.find((f) => f.slug === resolved);
}

export function getCategory(familySlug?: string | null, categorySlug?: string | null): ArticleCategory | undefined {
  const family = getFamily(familySlug);
  if (!family || !categorySlug) return undefined;
  return family.categories.find((c) => c.slug === categorySlug);
}

export function familyLabel(slug?: string | null): string {
  return getFamily(slug)?.label ?? "";
}

export function categoryPathLabel(familySlug?: string | null, categorySlug?: string | null): string {
  const family = getFamily(familySlug);
  const category = getCategory(familySlug, categorySlug);
  if (!family && !category) return "";
  if (family && category) return `${family.label} > ${category.label}`;
  return family?.label ?? "";
}

export const articleConditions = ["Neuf", "Excellent état", "Bon état", "État correct"] as const;

export const pricePeriods = [
  { id: "DAY", label: "Par jour" },
  { id: "WEEK", label: "Par semaine" },
  { id: "MONTH", label: "Par mois" },
] as const;

export const minDurations = [
  { id: "1_DAY", label: "1 jour" },
  { id: "1_WEEK", label: "1 semaine" },
  { id: "2_WEEKS", label: "2 semaines" },
  { id: "1_MONTH", label: "1 mois" },
] as const;

export const rentalModes = [
  { id: "UNIT", label: "Par appareil" },
  { id: "LOT", label: "Par lot" },
] as const;
