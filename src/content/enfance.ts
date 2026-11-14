const dir = "/assets/images/enfance/webp";

export const ENF_ROOT = "/articles/enfance";
export const ENF_REQUEST_KEY = "onloutou-enfance-request";
export const ENF_FAMILY_LABEL = "Bébé & enfance";
export const ENF_DEMANDE_PATH = `${ENF_ROOT}/demande`;
export const ENF_CONFIRMATION_PATH = `${ENF_ROOT}/demande/confirmation`;
export const ENF_DEMO_REFERENCE = "ONL-DEMO-005";

export type EnfPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

function photo(file: string, alt: string, width = 1448, height = 1086, objectPosition = "50% 50%"): EnfPhoto {
  const webp = file.replace(/\.png$/i, ".webp");
  return { src: `${dir}/${webp}`, alt, width, height, objectPosition };
}

export const enfPlaces = [
  "Abidjan",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Bingerville",
  "Grand Abidjan",
] as const;

export type EnfAisleId =
  | "sommeil-couchage"
  | "poussettes-portage"
  | "sieges-auto"
  | "repas-cuisine-bebe"
  | "bain-change"
  | "parcs-transats"
  | "eveil-premiers-jeux"
  | "jeux-societe-lecture"
  | "mobilier-enfant"
  | "velos-draisiennes"
  | "jeux-plein-air"
  | "fetes-animations";

export type EnfSpec = { label: string; value: string };
export type EnfFilterOption = { id: string; label: string };
export type EnfFilterGroup = {
  id: string;
  label: string;
  kind: "radio" | "select";
  options: EnfFilterOption[];
};

export type EnfProduct = {
  id: string;
  slug: string;
  aisleId: EnfAisleId;
  type: string;
  title: string;
  kicker: string;
  excerpt: string;
  image: EnfPhoto;
  gallery: EnfPhoto[];
  specs: EnfSpec[];
  confirmPoints: string[];
  keywords: string[];
  complementaryIds?: string[];
  illustrative?: boolean;
};

export type EnfAisle = {
  id: EnfAisleId;
  slug: string;
  title: string;
  lead: string;
  image: EnfPhoto;
  filters: EnfFilterGroup[];
};

const img01 = photo("enf-01.webp", "Salon moderne à Abidjan avec poussette et jouets", 1672, 941, "70% 42%");
const img02 = photo("enf-02.webp", "Lit parapluie ouvert", 1448, 1086, "50% 55%");
const img03 = photo("enf-03.webp", "Poussette premium grise", 1448, 1086);
const img04 = photo("enf-04.webp", "Siège auto enfant", 1448, 1086);
const img05 = photo("enf-05.webp", "Chaise haute en bois", 1448, 1086, "50% 45%");
const img06 = photo("enf-06.webp", "Bain et change bébé", 1448, 1086);
const img07 = photo("enf-07.webp", "Parc et transat", 1448, 1086);
const img08 = photo("enf-08.webp", "Éveil et premiers jeux", 1448, 1086);
const img09 = photo("enf-09.webp", "Jeux de société et lecture", 1448, 1086);
const img10 = photo("enf-10.webp", "Mobilier enfant", 1448, 1086);
const img11 = photo("enf-11.webp", "Vélo draisienne", 1448, 1086);
const img12 = photo("enf-12.webp", "Toboggan jeux de plein air", 1448, 1086);
const img13 = photo("enf-13.webp", "Fêtes et animations", 1448, 1086);
const img14 = photo("enf-14.webp", "Lit à barreaux", 1448, 1086);
const img15 = photo("enf-15.webp", "Berceau moderne", 1448, 1086);
const img16 = photo("enf-16.webp", "Veilleuse nomade", 1448, 1086);
const img17 = photo("enf-17.webp", "Lit parapluie plié", 1448, 1086);
const img18 = photo("enf-18.webp", "Sac de transport du lit parapluie", 1448, 1086);
const img19 = photo("enf-19.webp", "Lit parapluie et chaise haute dans un salon à Abidjan", 1200, 1600, "50% 45%");

export const enfHeroPhoto = img01;
export const enfConfirmPhoto = img19;

const sommeilFilters: EnfFilterGroup[] = [
  {
    id: "type",
    label: "Type d’article",
    kind: "radio",
    options: [
      { id: "tous", label: "Tous" },
      { id: "voyage", label: "Lits de voyage" },
      { id: "barreaux", label: "Lits à barreaux" },
      { id: "berceau", label: "Berceaux" },
      { id: "accessoire", label: "Accessoires" },
    ],
  },
];

function simpleFilters(label = "Type d’article"): EnfFilterGroup[] {
  return [
    {
      id: "type",
      label,
      kind: "radio",
      options: [
        { id: "tous", label: "Tous" },
        { id: "principal", label: "Articles principaux" },
        { id: "accessoire", label: "Accessoires" },
      ],
    },
  ];
}

export const enfAisles: EnfAisle[] = [
  { id: "sommeil-couchage", slug: "sommeil-couchage", title: "Sommeil & couchage", lead: "Lits de voyage, lits à barreaux, berceaux et accessoires pour le repos de bébé.", image: img02, filters: sommeilFilters },
  { id: "poussettes-portage", slug: "poussettes-portage", title: "Poussettes & portage", lead: "Poussettes et solutions de portage pour vos déplacements.", image: img03, filters: simpleFilters() },
  { id: "sieges-auto", slug: "sieges-auto", title: "Sièges auto", lead: "Sièges auto adaptés à l’âge et au trajet.", image: img04, filters: simpleFilters() },
  { id: "repas-cuisine-bebe", slug: "repas-cuisine-bebe", title: "Repas & cuisine bébé", lead: "Chaises hautes et accessoires pour les repas.", image: img05, filters: simpleFilters() },
  { id: "bain-change", slug: "bain-change", title: "Bain & change", lead: "Baignoires, tables à langer et essentiels du change.", image: img06, filters: simpleFilters() },
  { id: "parcs-transats", slug: "parcs-transats", title: "Parcs & transats", lead: "Parcs et transats pour les moments de veille.", image: img07, filters: simpleFilters() },
  { id: "eveil-premiers-jeux", slug: "eveil-premiers-jeux", title: "Éveil & premiers jeux", lead: "Jouets d’éveil et premiers jeux sensoriels.", image: img08, filters: simpleFilters() },
  { id: "jeux-societe-lecture", slug: "jeux-societe-lecture", title: "Jeux de société & lecture", lead: "Livres et jeux pour les enfants plus grands.", image: img09, filters: simpleFilters() },
  { id: "mobilier-enfant", slug: "mobilier-enfant", title: "Mobilier enfant", lead: "Petites tables, chaises et rangements enfant.", image: img10, filters: simpleFilters() },
  { id: "velos-draisiennes", slug: "velos-draisiennes", title: "Vélos & draisiennes", lead: "Draisiennes et vélos pour apprendre à rouler.", image: img11, filters: simpleFilters() },
  { id: "jeux-plein-air", slug: "jeux-plein-air", title: "Jeux de plein air", lead: "Toboggans et jeux pour le jardin ou la terrasse.", image: img12, filters: simpleFilters() },
  { id: "fetes-animations", slug: "fetes-animations", title: "Fêtes & animations", lead: "Décoration et équipements pour anniversaires et fêtes.", image: img13, filters: simpleFilters() },
];

export const enfProducts: EnfProduct[] = [
  {
    id: "lit-parapluie",
    slug: "lit-parapluie",
    aisleId: "sommeil-couchage",
    type: "voyage",
    title: "Lit parapluie",
    kicker: "Sommeil & couchage",
    excerpt: "Lit de voyage pliable, pratique pour un séjour ou une visite à Abidjan.",
    image: img02,
    gallery: [img02, img17, img18],
    specs: [
      { label: "Usage", value: "Voyage / séjour" },
      { label: "Format", value: "Pliable avec sac de transport" },
    ],
    confirmPoints: [
      "Dimensions dépliées et hauteur des barrières à confirmer avec le partenaire (à valider).",
      "État du matelas et des filets de sécurité à vérifier avant livraison (à valider).",
      "Nettoyage et désinfection entre deux locations : protocole du partenaire à confirmer (à valider).",
      "Contenu du sac (matelas, draps, moustiquaire éventuelle) selon disponibilité.",
    ],
    keywords: ["lit", "parapluie", "voyage", "couchage", "sommeil", "bébé"],
    complementaryIds: ["chaise-haute"],
  },
  {
    id: "lit-a-barreaux",
    slug: "lit-a-barreaux",
    aisleId: "sommeil-couchage",
    type: "barreaux",
    title: "Lit à barreaux",
    kicker: "Sommeil & couchage",
    excerpt: "Lit à barreaux pour un couchage stable à la maison.",
    image: img14,
    gallery: [img14],
    specs: [{ label: "Type", value: "Lit à barreaux" }],
    confirmPoints: [
      "Dimensions et espacement des barreaux à confirmer (à valider).",
      "Matelas et literie inclus selon le partenaire (à valider).",
    ],
    keywords: ["lit", "barreaux", "couchage"],
    illustrative: true,
  },
  {
    id: "berceau",
    slug: "berceau",
    aisleId: "sommeil-couchage",
    type: "berceau",
    title: "Berceau",
    kicker: "Sommeil & couchage",
    excerpt: "Berceau mobile pour les premiers mois.",
    image: img15,
    gallery: [img15],
    specs: [{ label: "Type", value: "Berceau" }],
    confirmPoints: [
      "Capacité de poids et âge recommandé à confirmer (à valider).",
      "Nettoyage du textile et du châssis selon le partenaire (à valider).",
    ],
    keywords: ["berceau", "sommeil"],
    illustrative: true,
  },
  {
    id: "veilleuse-nomade",
    slug: "veilleuse-nomade",
    aisleId: "sommeil-couchage",
    type: "accessoire",
    title: "Veilleuse nomade",
    kicker: "Sommeil & couchage",
    excerpt: "Veilleuse portable pour rassurer la nuit.",
    image: img16,
    gallery: [img16],
    specs: [{ label: "Type", value: "Accessoire" }],
    confirmPoints: ["Autonomie et mode d’alimentation à confirmer (à valider)."],
    keywords: ["veilleuse", "accessoire", "nuit"],
    illustrative: true,
  },
  {
    id: "chaise-haute",
    slug: "chaise-haute",
    aisleId: "repas-cuisine-bebe",
    type: "principal",
    title: "Chaise haute",
    kicker: "Repas & cuisine bébé",
    excerpt: "Chaise haute stable pour les repas de bébé et du jeune enfant.",
    image: img05,
    gallery: [img05],
    specs: [
      { label: "Usage", value: "Repas" },
      { label: "Style", value: "Bois / contemporain" },
    ],
    confirmPoints: [
      "Hauteur, tablette amovible et harnais à confirmer avec le partenaire (à valider).",
      "Nettoyage de l’assise et de la tablette entre deux locations (à valider).",
      "Âge et poids recommandés selon le modèle disponible.",
    ],
    keywords: ["chaise", "haute", "repas", "cuisine", "bébé"],
    complementaryIds: ["lit-parapluie"],
  },
  {
    id: "poussette-premium",
    slug: "poussette-premium",
    aisleId: "poussettes-portage",
    type: "principal",
    title: "Poussette",
    kicker: "Poussettes & portage",
    excerpt: "Poussette pour vos déplacements en ville.",
    image: img03,
    gallery: [img03],
    specs: [{ label: "Type", value: "Poussette" }],
    confirmPoints: ["Modèle et options (panier, capote) à confirmer (à valider)."],
    keywords: ["poussette", "portage"],
    illustrative: true,
  },
];

export const enfHub = {
  eyebrow: "ABIDJAN, CÔTE D’IVOIRE — BÉBÉ & ENFANCE",
  title: "Bébé &",
  titleAccent: "enfance",
  question: "Que souhaitez-vous louer pour votre enfant ?",
  aislesEyebrow: "BÉBÉ & ENFANCE",
  aislesTitle: "Les familles d’articles",
  search: {
    queryLabel: "Article",
    queryPlaceholder: "Ex. lit parapluie, poussette...",
    queryPlaceholderShort: "Ex. lit parapluie...",
    placeLabel: "Ville ou commune",
    placePlaceholder: "Abidjan, Cocody...",
    placePlaceholderShort: "Abidjan, Cocody...",
    datesLabel: "Dates",
    datesPlaceholder: "À préciser",
    submit: "Explorer",
  },
  other: {
    placeholder: "Je cherche un autre article",
    cta: "Je cherche un autre article",
  },
  otherCta: "Je cherche un autre article",
  searchNote: "Modèle et disponibilité à confirmer selon vos dates.",
};


export const enfGuide = {
  title: "Pour bien préciser votre besoin",
  uses: [
    { icon: "home" as const, title: "À la maison" },
    { icon: "users" as const, title: "Voyage et déplacement" },
    { icon: "calendar" as const, title: "Besoin ponctuel" },
  ],
  criteria: [
    { icon: "users" as const, title: "Âge", text: "Âge de l’enfant concerné, à indiquer pour orienter le choix." },
    { icon: "gauge" as const, title: "Poids ou taille", text: "À préciser lorsque c’est pertinent pour la sécurité et le réglage." },
    { icon: "zone" as const, title: "Dimensions", text: "Emprise dépliée ou en stockage, à confirmer selon le lieu." },
    { icon: "clipboard" as const, title: "Conditions d’utilisation", text: "Intérieur, voyage ou usage ponctuel : à mentionner dans la demande." },
  ],
  precisTitle: "À indiquer dans la demande",
  precis: [
    { icon: "pin" as const, title: "Commune", text: "Lieu de livraison ou de retrait." },
    { icon: "calendar" as const, title: "Période", text: "Dates souhaitées, à confirmer selon la disponibilité." },
    { icon: "stack" as const, title: "Quantité", text: "Nombre d’articles nécessaires." },
  ],
  otherLead: "Décrivez l’article recherché s’il n’apparaît pas dans les rayons.",
};

export const enfAisleCopy = {
  eyebrow: "BÉBÉ & ENFANCE",
  placeLabel: "Commune",
  emptyLead: "Aucun article pour ces filtres.",
  searchPlaceholder: "Rechercher un article...",
  availabilityNote: "Modèle et disponibilité à confirmer selon vos dates.",
  seeArticle: "Voir l’article",
  otherLink: "Je cherche un autre article",
  filterTitle: "Type d’article",
};

export const enfProductCopy = {
  eyebrow: "BÉBÉ & ENFANCE",
  placeLabel: "Commune",
  placePlaceholder: "Choisir",
  datesLabel: "Période de location",
  datesPlaceholder: "Ex. du 21 au 24 novembre",
  complementAccent: "Pour",

  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  viewRequest: "Voir ma demande",
  confirmTitle: "Points à confirmer avec le partenaire",
  confirmReviewFlag: "Textes proposés à la relecture — à valider avec ONLOUTOU.",
  complementTitle: "Pour compléter votre séjour",
  tariffNote: "Tarif et disponibilité à confirmer.",
  qtyLabel: "Quantité",
  specsTitle: "Caractéristiques",
  deliveryTitle: "Livraison et retrait",
  deliveryLead: "Conditions confirmées selon votre localisation.",
  deliveryText: "Livraison à Abidjan et retrait en agence possibles, selon la commune et la disponibilité.",
  adviceTitle: "Besoin de conseils pour votre location ?",
  adviceLead: "Nos équipes à Abidjan vous aident à choisir l’article adapté à votre besoin.",
  adviceCta: "Nous contacter",
  steps: [
    { n: "01", title: "Vous décrivez", text: "Votre besoin et la période de location." },
    { n: "02", title: "Nous confirmons", text: "ONLOUTOU vérifie les disponibilités avec ses partenaires." },
    { n: "03", title: "Vous retirez ou recevez", text: "Vous récupérez l’article ou vous êtes livré à Abidjan." },
  ],
};

export const enfDemandeCopy = {
  errorContact: "Indiquez votre nom et votre téléphone pour envoyer la demande.",
  errorItems: "Ajoutez au moins un article à votre demande.",

  title: "Votre demande de location",
  titleAccent: "Votre demande",
  itemsTitle: "Articles demandés",
  addOther: "Ajouter un autre article",
  stayTitle: "Votre séjour",
  placeLabel: "Commune",
  fromLabel: "Du",
  toLabel: "Au",
  deliveryLabel: "Livraison souhaitée",
  notesLabel: "Précisions (facultatif)",
  contactTitle: "Vos coordonnées",
  nameLabel: "Nom et prénom",
  namePlaceholder: "Ex. : Koffi Ama",
  phoneLabel: "Téléphone",
  phonePlaceholder: "Ex. : 07 07 12 34 56",
  selectionTitle: "Votre sélection",
  submit: "Envoyer ma demande",
  tariffNote: "Tarif et disponibilité à confirmer.",
  whyTitle: "Les familles d’articles",
  whyTitleAccent: "familles",
  whyAisleIds: ["sommeil-couchage", "repas-cuisine-bebe", "poussettes-portage"] as const,
};

export const enfConfirmationCopy = {
  title: "Demande enregistrée",
  referenceLabel: "Votre référence",
  lead: "ONLOUTOU vérifie les disponibilités avec ses partenaires et vous contacte pour vous proposer les modèles et les tarifs.",
  cardTitle: "Votre demande",
  placeLabel: "Commune",
  stayLabel: "Séjour",
  deliveryLabel: "Livraison",
  deliveryYes: "souhaitée",
  back: "Revenir à Bébé & enfance",
  whatsapp: "Continuer sur WhatsApp",
};

export const enfHubSeo = {
  title: "Location Bébé & enfance à Abidjan",
  description:
    "Louez lit parapluie, chaise haute, poussette et équipements bébé à Abidjan. Demande sans engagement, disponibilités confirmées avec les partenaires.",
};

export const enfContactHref = "/contact?need=location&famille=bebe#ctc-form-title";
export const enfOtherHref = "/contact?need=location&famille=bebe&autre=1#ctc-form-title";

export function enfAislePath(id: EnfAisleId | string) {
  return `${ENF_ROOT}/${id}`;
}

export function enfProductPath(aisleId: EnfAisleId | string, slug: string) {
  return `${ENF_ROOT}/${aisleId}/${slug}`;
}

export function getEnfAisle(id: string) {
  return enfAisles.find((a) => a.id === id || a.slug === id);
}

export function getEnfProduct(aisleId: string, slug: string) {
  return enfProducts.find((p) => p.slug === slug && p.aisleId === aisleId);
}

export function productsForEnfAisle(aisleId: EnfAisleId) {
  return enfProducts.filter((p) => p.aisleId === aisleId);
}

export function matchEnfFilters(product: EnfProduct, filters: Record<string, string>) {
  const type = filters.type;
  if (!type || type === "tous") return true;
  return product.type === type;
}

export function searchEnfance(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { aisle: undefined as ReturnType<typeof getEnfAisle>, product: undefined as EnfProduct | undefined };
  const product = enfProducts.find(
    (p) => p.title.toLowerCase().includes(q) || p.keywords.some((k) => k.includes(q) || q.includes(k)),
  );
  if (product) return { product, aisle: getEnfAisle(product.aisleId) };
  const aisle = enfAisles.find((a) => a.title.toLowerCase().includes(q));
  return { aisle, product: undefined };
}

export function enfPublicPaths() {
  const paths = [ENF_ROOT, ENF_DEMANDE_PATH, ENF_CONFIRMATION_PATH];
  for (const aisle of enfAisles) {
    paths.push(enfAislePath(aisle.id));
    for (const product of productsForEnfAisle(aisle.id)) {
      paths.push(enfProductPath(aisle.id, product.slug));
    }
  }
  return paths;
}

export function enfBreadcrumbJsonLd(base: string, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.path}`,
    })),
  };
}

export function enfCollectionJsonLd(base: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: ENF_FAMILY_LABEL,
    url: `${base}${ENF_ROOT}`,
  };
}

export function formatEnfStay(start: string, end: string) {
  if (!start && !end) return "";
  try {
    const ds = new Date(start + (start.length === 10 ? "T12:00:00" : ""));
    const de = new Date(end + (end.length === 10 ? "T12:00:00" : ""));
    if (!Number.isNaN(ds.getTime()) && !Number.isNaN(de.getTime())) {
      const sameMonth = ds.getMonth() === de.getMonth() && ds.getFullYear() === de.getFullYear();
      if (sameMonth) {
        const month = ds.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        return `Du ${ds.getDate()} au ${de.getDate()} ${month}`;
      }
      const a = ds.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      const b = de.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      return `Du ${a} au ${b}`;
    }
  } catch {
    /* ignore */
  }
  if (start && end) return `Du ${start} au ${end}`;
  return start || end;
}
