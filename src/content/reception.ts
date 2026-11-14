const dir = "/assets/images/reception/webp";

export const REC_ROOT = "/articles/reception";
export const REC_REQUEST_KEY = "onloutou-reception-request";
export const REC_FAMILY_LABEL = "Réception & événementiel";
export const REC_DEMANDE_PATH = `${REC_ROOT}/demande`;
export const REC_CONFIRMATION_PATH = `${REC_ROOT}/demande/confirmation`;
export const REC_DEMO_REFERENCE = "ONL-DEMO-004";

/** Chaise partagée Mobilier ↔ Réception (fiche canonique mobilier). */
export const SHARED_CHAIR = {
  id: "chaise-ivoire-reception",
  slug: "chaise-ivoire-reception",
  title: "Chaise ivoire de réception",
  mobilierPath: "/articles/mobilier/assises-canapes/chaise-ivoire-reception",
  receptionAisleId: "tables-chaises" as const,
};

export type RecPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

function photo(file: string, alt: string, width = 1448, height = 1086, objectPosition = "50% 50%"): RecPhoto {
  const webp = file.replace(/\.png$/i, ".webp");
  return { src: `${dir}/${webp}`, alt, width, height, objectPosition };
}

export const recHeroPhoto = photo(
  "rec-05.webp",
  "Réception élégante dans un jardin d’Abidjan",
  1672,
  941,
  "55% 40%",
);

export const recPlaces = [
  "Abidjan",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Bingerville",
  "Grand Abidjan",
] as const;

export type RecUnitKind = "lot" | "piece" | "set";

export type RecAisleId =
  | "vaisselle-couverts"
  | "verrerie-bar"
  | "tables-chaises"
  | "nappes-housses"
  | "baches-chapiteaux"
  | "buffet-traiteur"
  | "decoration-ceremonie"
  | "sonorisation-micros"
  | "eclairage-scene"
  | "scenes-podiums"
  | "projection-ecrans"
  | "accueil-signaletique";

export type RecSpec = { label: string; value: string };
export type RecFilterOption = { id: string; label: string };
export type RecFilterGroup = {
  id: string;
  label: string;
  kind: "radio" | "select";
  options: RecFilterOption[];
};

export type RecProduct = {
  id: string;
  slug: string;
  aisleId: RecAisleId;
  type: string;
  title: string;
  kicker: string;
  excerpt: string;
  highlight?: string;
  typeLabel: string;
  /** Affiché sur la carte catalogue */
  unitBadge: string;
  unitKind: RecUnitKind;
  /** Taille du lot (ex. 25 assiettes). 1 pour pièce/set. */
  packSize: number;
  unitLabel: string; // "assiettes" | "verres" | "pièces" | "sets"
  unitQtyLabel: string; // "Nombre de lots" | "Quantité"
  image: RecPhoto;
  gallery: RecPhoto[];
  specs: RecSpec[];
  keywords: string[];
  illustrative?: boolean;
  /** Lien vers fiche partagée (autre univers) */
  sharedHref?: string;
};

export type RecAisle = {
  id: RecAisleId;
  slug: string;
  title: string;
  lead: string;
  image: RecPhoto;
  filters: RecFilterGroup[];
  bandImage?: RecPhoto;
};

const img01 = photo("rec-01.webp", "Dressage de table élégant", 1448, 1086);
const img02 = photo("rec-02.webp", "Verres et seau à champagne", 1448, 1086);
const img03 = photo("rec-03.webp", "Tables rondes et chaises Chiavari", 1448, 1086, "50% 45%");
const img04 = photo("rec-04.webp", "Chaise ivoire et table blanche", 1448, 1086, "45% 50%");
const img05 = photo("rec-05.webp", "Réception élégante — linge de table", 1448, 1086, "50% 40%");
const img06 = photo("rec-06.webp", "Chapiteaux blancs", 1448, 1086);
const img07 = photo("rec-07.webp", "Arche florale", 1448, 1086);
const img08 = photo("rec-08.webp", "Podium transparent", 1448, 1086);
const img09 = photo("rec-09.webp", "Éclairage scénique", 1448, 1086);
const img10 = photo("rec-10.webp", "Buffet élégant", 1448, 1086);
const img11 = photo("rec-11.webp", "Sonorisation", 1448, 1086);
const img12 = photo("rec-12.webp", "Projection et écrans", 1448, 1086);
const img13 = photo("rec-13.webp", "Piles d’assiettes blanches", 1448, 1086, "50% 55%");
const img16 = photo("rec-16.webp", "Réception tropicale fleurie à Abidjan", 1448, 1086, "50% 40%");
const img17 = photo("rec-17.webp", "Panneau d’accueil", 1448, 1086);
const img18 = photo("rec-18.webp", "Couverts raffinés", 1448, 1086);
const img19 = photo("rec-19.webp", "Verres à eau", 1448, 1086, "50% 45%");
const img20 = photo("rec-20.webp", "Plat ovale blanc", 1448, 1086);
const img21 = photo("rec-21.webp", "Caisses d’assiettes en porcelaine", 1448, 1086, "50% 50%");
const img22 = photo("rec-22.webp", "Bols en porcelaine", 1448, 1086);
const img23 = photo("rec-23.webp", "Pile d’assiettes en porcelaine", 1448, 1086);

export const recSceneMeeting = img16;
export const recSceneShowroom = img05;
export const recSceneSalon = img16;

export const recAisles: RecAisle[] = [
  {
    id: "vaisselle-couverts",
    slug: "vaisselle-couverts",
    title: "Vaisselle & couverts",
    lead: "Assiettes, couverts, bols et plats de service pour vos réceptions à Abidjan.",
    image: img13,
    bandImage: { ...img16, objectPosition: "50% 35%" },
    filters: [
      {
        id: "type",
        label: "Type",
        kind: "radio",
        options: [
          { id: "tous", label: "Tous" },
          { id: "assiette", label: "Assiettes" },
          { id: "couvert", label: "Couverts" },
          { id: "bol", label: "Bols" },
          { id: "plat", label: "Plats de service" },
        ],
      },
      {
        id: "conditionnement",
        label: "Conditionnement",
        kind: "radio",
        options: [
          { id: "tous", label: "Tous" },
          { id: "piece", label: "À la pièce" },
          { id: "lot", label: "Par lot" },
        ],
      },
    ],
  },
  {
    id: "verrerie-bar",
    slug: "verrerie-bar",
    title: "Verrerie & bar",
    lead: "Verres et accessoires de bar pour vos cocktails et dîners.",
    image: img02,
    filters: [],
  },
  {
    id: "tables-chaises",
    slug: "tables-chaises",
    title: "Tables & chaises",
    lead: "Tables rondes et chaises pour cérémonies et réceptions.",
    image: img03,
    filters: [],
  },
  {
    id: "nappes-housses",
    slug: "nappes-housses",
    title: "Nappes & housses",
    lead: "Linge de table et housses pour une table soignée.",
    image: img05,
    filters: [],
  },
  {
    id: "baches-chapiteaux",
    slug: "baches-chapiteaux",
    title: "Bâches & chapiteaux",
    lead: "Chapiteaux et structures pour vos réceptions en extérieur.",
    image: img06,
    filters: [],
  },
  {
    id: "buffet-traiteur",
    slug: "buffet-traiteur",
    title: "Buffet & service traiteur",
    lead: "Chafing dishes et matériel de service pour le buffet.",
    image: img10,
    filters: [],
  },
  {
    id: "decoration-ceremonie",
    slug: "decoration-ceremonie",
    title: "Décoration de cérémonie",
    lead: "Arches florales et éléments décoratifs pour la cérémonie.",
    image: img07,
    filters: [],
  },
  {
    id: "sonorisation-micros",
    slug: "sonorisation-micros",
    title: "Sonorisation & micros",
    lead: "Enceintes et micros pour animer votre événement.",
    image: img11,
    filters: [],
  },
  {
    id: "eclairage-scene",
    slug: "eclairage-scene",
    title: "Éclairage de scène",
    lead: "Projecteurs et éclairages pour la scène et l’ambiance.",
    image: img09,
    filters: [],
  },
  {
    id: "scenes-podiums",
    slug: "scenes-podiums",
    title: "Scènes & podiums",
    lead: "Scènes, podiums et pupitres pour vos prises de parole.",
    image: img08,
    filters: [],
  },
  {
    id: "projection-ecrans",
    slug: "projection-ecrans",
    title: "Projection & écrans",
    lead: "Écrans et projecteurs pour vos présentations.",
    image: img12,
    filters: [],
  },
  {
    id: "accueil-signaletique",
    slug: "accueil-signaletique",
    title: "Accueil & signalétique",
    lead: "Panneaux d’accueil et signalétique pour guider vos invités.",
    image: img17,
    filters: [],
  },
];

export const recProducts: RecProduct[] = [
  {
    id: "assiettes-plates-blanches",
    slug: "assiettes-plates-blanches",
    aisleId: "vaisselle-couverts",
    type: "assiette",
    title: "Assiettes plates blanches",
    kicker: "Vaisselle & couverts",
    excerpt: "Porcelaine blanche, diamètre 26 cm, louée par lot de 25.",
    highlight: "25 assiettes par lot",
    typeLabel: "assiette",
    unitBadge: "Lot de 25",
    unitKind: "lot",
    packSize: 25,
    unitLabel: "assiettes",
    unitQtyLabel: "Nombre de lots",
    image: img21,
    gallery: [img21, img23, img13],
    specs: [
      { label: "Matière", value: "Porcelaine blanche" },
      { label: "Diamètre", value: "Diamètre 26 cm" },
      { label: "Conditionnement", value: "25 assiettes par lot" },
    ],
    keywords: ["assiette", "vaisselle", "porcelaine", "lot"],
  },
  {
    id: "couverts-inox",
    slug: "couverts-inox",
    aisleId: "vaisselle-couverts",
    type: "couvert",
    title: "Couverts en inox",
    kicker: "Vaisselle & couverts",
    excerpt: "Set individuel fourchette, couteau et cuillère.",
    typeLabel: "couvert",
    unitBadge: "Set individuel",
    unitKind: "set",
    packSize: 1,
    unitLabel: "sets",
    unitQtyLabel: "Quantité",
    image: img18,
    gallery: [img18],
    specs: [
      { label: "Type", value: "Set individuel" },
      { label: "Matière", value: "Inox" },
    ],
    keywords: ["couvert", "inox", "set"],
  },
  {
    id: "bols-porcelaine",
    slug: "bols-porcelaine",
    aisleId: "vaisselle-couverts",
    type: "bol",
    title: "Bols en porcelaine",
    kicker: "Vaisselle & couverts",
    excerpt: "Bols blancs loués par lot de 10.",
    typeLabel: "bol",
    unitBadge: "Lot de 10",
    unitKind: "lot",
    packSize: 10,
    unitLabel: "bols",
    unitQtyLabel: "Nombre de lots",
    image: img22,
    gallery: [img22],
    specs: [
      { label: "Conditionnement", value: "10 bols par lot" },
      { label: "Matière", value: "Porcelaine" },
    ],
    keywords: ["bol", "porcelaine", "lot"],
  },
  {
    id: "plat-service-ovale",
    slug: "plat-service-ovale",
    aisleId: "vaisselle-couverts",
    type: "plat",
    title: "Plat de service ovale",
    kicker: "Vaisselle & couverts",
    excerpt: "Grand plat ovale blanc à la pièce.",
    typeLabel: "plat",
    unitBadge: "À la pièce",
    unitKind: "piece",
    packSize: 1,
    unitLabel: "pièces",
    unitQtyLabel: "Quantité",
    image: img20,
    gallery: [img20],
    specs: [
      { label: "Conditionnement", value: "À la pièce" },
      { label: "Forme", value: "Ovale" },
    ],
    keywords: ["plat", "service", "pièce"],
  },
  {
    id: "verres-a-eau",
    slug: "verres-a-eau",
    aisleId: "verrerie-bar",
    type: "verre",
    title: "Verres à eau",
    kicker: "Verrerie & bar",
    excerpt: "Verres transparents loués par lot de 12.",
    highlight: "12 verres par lot",
    typeLabel: "verre",
    unitBadge: "Lot de 12",
    unitKind: "lot",
    packSize: 12,
    unitLabel: "verres",
    unitQtyLabel: "Nombre de lots",
    image: img19,
    gallery: [img19, img02],
    specs: [
      { label: "Conditionnement", value: "12 verres par lot" },
    ],
    keywords: ["verre", "eau", "verrerie", "lot"],
  },
  {
    id: "nappe-blanche",
    slug: "nappe-blanche",
    aisleId: "nappes-housses",
    type: "nappe",
    title: "Nappe blanche",
    kicker: "Nappes & housses",
    excerpt: "Nappe blanche pour table ronde, à la pièce.",
    typeLabel: "nappe",
    unitBadge: "À la pièce",
    unitKind: "piece",
    packSize: 1,
    unitLabel: "nappes",
    unitQtyLabel: "Quantité",
    image: img05,
    gallery: [img05, img01],
    specs: [
      { label: "Conditionnement", value: "À la pièce" },
      { label: "Couleur", value: "Blanc / ivoire" },
    ],
    keywords: ["nappe", "linge", "table", "pièce"],
  },
  {
    id: SHARED_CHAIR.id,
    slug: SHARED_CHAIR.slug,
    aisleId: "tables-chaises",
    type: "chaise",
    title: SHARED_CHAIR.title,
    kicker: "Tables & chaises",
    excerpt: "Chaise ivoire pour cérémonies — aussi disponible dans Mobilier & décoration.",
    typeLabel: "chaise",
    unitBadge: "À la pièce",
    unitKind: "piece",
    packSize: 1,
    unitLabel: "pièces",
    unitQtyLabel: "Quantité",
    image: img04,
    gallery: [img04, img03],
    specs: [
      { label: "Usage", value: "Réception, cérémonie" },
      { label: "Finition", value: "Ivoire" },
    ],
    keywords: ["chaise", "table", "assise", "cérémonie"],
    sharedHref: `${SHARED_CHAIR.mobilierPath}?from=reception`,
  },
  // Illustrative
  ...([
    ["table-ronde", "tables-chaises", "table", "Table ronde de réception", img03, "table"],
    ["chapiteau-blanc", "baches-chapiteaux", "chapiteau", "Chapiteau blanc", img06, "chapiteau"],
    ["buffet-chafing", "buffet-traiteur", "buffet", "Buffet chafing dish", img10, "buffet"],
    ["arche-florale", "decoration-ceremonie", "deco", "Arche florale", img07, "arche"],
    ["enceinte-micro", "sonorisation-micros", "sono", "Enceinte & micro", img11, "sono"],
    ["projecteurs-scene", "eclairage-scene", "light", "Éclairage de scène", img09, "éclairage"],
    ["podium-transparent", "scenes-podiums", "scene", "Podium transparent", img08, "podium"],
    ["ecran-projection", "projection-ecrans", "ecran", "Écran de projection", img12, "écran"],
    ["panneau-accueil", "accueil-signaletique", "accueil", "Panneau d’accueil", img17, "accueil"],
  ] as const).map(([id, aisleId, type, title, image, kw]) => ({
    id,
    slug: id,
    aisleId: aisleId as RecAisleId,
    type,
    title,
    kicker: recAisles.find((a) => a.id === aisleId)?.title || "",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: type,
    unitBadge: "À la pièce",
    unitKind: "piece" as RecUnitKind,
    packSize: 1,
    unitLabel: "pièces",
    unitQtyLabel: "Quantité",
    image,
    gallery: [image],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: [kw],
    illustrative: true,
  })),
];

export const recHub = {
  eyebrow: "Abidjan, Côte d’Ivoire — Réception & événementiel",
  title: "Réception & événementiel",
  titleAccent: "à louer.",
  lead: "La location d’équipements pour vos réceptions, cérémonies et événements à Abidjan.",
  search: {
    queryLabel: "Quel article cherchez-vous ?",
    queryPlaceholder: "Ex. assiette, table, chapiteau...",
    queryPlaceholderShort: "Ex. assiette, table...",
    placeLabel: "Commune",
    placePlaceholder: "Abidjan, Cocody, Yopougon...",
    placePlaceholderShort: "Abidjan, Cocody...",
    datesLabel: "Dates",
    datesPlaceholder: "À préciser",
    submit: "Explorer",
  },
  aislesEyebrow: "De quoi avez-vous besoin ?",
  aislesTitle: "De quoi avez-vous besoin ?",
  other: {
    placeholder: "Je cherche un autre article",
    cta: "Je cherche un autre article",
  },
  searchNote: "Disponibilité à confirmer pour vos dates.",
};


export const recGuide = {
  title: "Pour bien préciser votre besoin",
  uses: [
    { icon: "users" as const, title: "Cérémonie" },
    { icon: "handshake" as const, title: "Réception d’entreprise" },
    { icon: "building" as const, title: "Événement ponctuel" },
  ],
  criteria: [
    { icon: "users" as const, title: "Nombre d’invités", text: "Effectif prévu, pour estimer les quantités à confirmer." },
    { icon: "box" as const, title: "Unités ou lots", text: "Indiquez si vous raisonnez à la pièce, au set ou au lot." },
    { icon: "clipboard" as const, title: "Type d’événement", text: "Cérémonie, réception ou autre usage : à préciser dans la demande." },
    { icon: "wrench" as const, title: "Installation", text: "Montage, livraison ou reprise souhaités : à indiquer, sans prestation présupposée." },
  ],
  precisTitle: "À indiquer dans la demande",
  precis: [
    { icon: "pin" as const, title: "Commune", text: "Lieu de l’événement, de livraison ou de retrait." },
    { icon: "calendar" as const, title: "Période", text: "Dates et créneaux souhaités, à confirmer." },
    { icon: "stack" as const, title: "Quantités", text: "Nombre de lots ou de pièces par article." },
  ],
  otherLead: "Décrivez l’article recherché s’il n’apparaît pas dans les rayons.",
};

export const recAisleCopy = {
  eyebrow: "Réception & événementiel",
  titleSuffix: "",
  titleAccent: "",
  searchPlaceholder: "Rechercher un article de vaisselle ou un équipement",
  filterTitle: "Affiner ma recherche",
  resultsTitle: "Modèles à découvrir",
  resultsLead: "Chaque carte précise l’unité de location.",
  emptyTitle: "Aucun modèle pour ces filtres",
  emptyLead: "Modifiez vos critères ou explorez une autre famille.",
  emptyIllustrative: "Sélection illustrative : disponibilité à confirmer avec nos équipes.",
  seeSheet: "Voir la fiche",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  adviceTitle: "Besoin de conseil ?",
  adviceText: "Nos équipes vous aident à constituer votre réception.",
  exploreOtherTitle: "Vous cherchez une autre pièce de vaisselle ?",
  exploreOtherLead: "",
  exploreOtherCta: "Demander un autre article",
  availabilityNote: "Disponibilité à confirmer pour vos dates.",
  barTitle: "Ma demande",
  barDevices: "articles",
  barContinue: "Continuer",
  barOther: "Demander un autre article",
};

export const recProductCopy = {
  eyebrow: "Réception & événementiel",
  title: "Assiettes plates blanches",
  titleAccent: "Assiettes",
  lead: "",
  placeLabel: "Commune",
  datesLabel: "Période de location",
  qtyLabel: "Nombre de lots",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  back: "Voir ma demande",
  specsTitle: "Caractéristiques",
  deliveryTitle: "Livraison et retrait",
  deliveryLead: "Conditions confirmées selon votre localisation.",
  deliveryText: "Livraison à Abidjan et retrait en agence possibles, selon la commune et la disponibilité.",
  complementTitle: "Pour compléter votre réception",
  tariffTitle: "Tarif et disponibilité à confirmer.",
  tariffText: "",
  adviceTitle: "Un besoin spécifique pour votre événement ?",
  adviceLead: "Nos équipes à Abidjan vous conseillent sur les quantités et le déroulé.",
  adviceCta: "Nous contacter",
  steps: [
    { n: "01", title: "Vous décrivez", text: "Votre événement, le lieu et les créneaux." },
    { n: "02", title: "Nous confirmons", text: "Disponibilités auprès des partenaires." },
    { n: "03", title: "Vous recevez", text: "Livraison et reprise selon vos horaires." },
  ],
};

export const recDemandeCopy = {
  title: "Ma demande de location",
  titleAccent: "Ma demande",
  lead: "Sélectionnez les articles de réception et d’événementiel, précisez les besoins de votre événement et envoyez-nous votre demande.",
  itemsTitle: "Articles souhaités",
  addDevice: "Ajouter un article",
  eventLabel: "Événement",
  eventPlaceholder: "Ex. Réception familiale",
  guestsLabel: "Nombre d’invités",
  guestsPlaceholder: "Ex. 100",
  placeLabel: "Commune",
  startLabel: "Date de début",
  endLabel: "Date de fin",
  deliveryLabel: "Livraison",
  pickupLabel: "Reprise",
  contactTitle: "Vos coordonnées",
  nameLabel: "Votre nom",
  phoneLabel: "Téléphone",
  emailLabel: "E-mail (facultatif)",
  submit: "Envoyer ma demande",
  edit: "Modifier ma sélection",
  recapTitle: "Récapitulatif",
  tariffNote: "Tarif et disponibilité à confirmer.",
  whyTitle: "Réception & événementiel",
  whyTitleAccent: "Réception",
  why: [
    { id: "vaisselle" as const, title: "Vaisselle & couverts", text: "Assiettes, couverts et plats.", image: "vaisselle" as const, aisleId: "vaisselle-couverts" as const },
    { id: "verrerie" as const, title: "Verrerie & bar", text: "Verres et service de bar.", image: "verrerie" as const, aisleId: "verrerie-bar" as const },
    { id: "linge" as const, title: "Nappes & housses", text: "Linge de table pour la réception.", image: "linge" as const, aisleId: "nappes-housses" as const },
  ],
};

export const recConfirmationCopy = {
  title: "Demande enregistrée",
  titleAccent: "Demande",
  lead: "ONLOUTOU vérifie les quantités, les tarifs et les créneaux auprès des partenaires.",
  referenceLabel: "Référence de la demande",
  eventLabel: "Événement",
  placeLabel: "Lieu",
  deliveryLabel: "Livraison souhaitée",
  pickupLabel: "Reprise souhaitée",
  whatsapp: "Continuer sur WhatsApp",
  back: "Retour à Réception & événementiel",
  values: [
    { title: "Livraison à Abidjan", text: "Selon vos besoins" },
    { title: "Assistance & conseil", text: "Un accompagnement fiable" },
    { title: "Location flexible", text: "Courte ou longue durée" },
  ],
  discoverTitle: "Découvrez notre famille d’articles",
  discoverTitleAccent: "Découvrez",
  /** Cartes confirmation → noms hub (pas Tables & plateaux / Assises / etc.) */
  discover: [
    { label: "Tables & chaises", aisleId: "tables-chaises" as const, image: "tables" as const },
    { label: "Vaisselle & couverts", aisleId: "vaisselle-couverts" as const, image: "vaisselle" as const },
    { label: "Verrerie & bar", aisleId: "verrerie-bar" as const, image: "verrerie" as const },
    { label: "Nappes & housses", aisleId: "nappes-housses" as const, image: "linge" as const },
    { label: "Bâches & chapiteaux", aisleId: "baches-chapiteaux" as const, image: "tentes" as const },
    { label: "Éclairage de scène", aisleId: "eclairage-scene" as const, image: "eclairage" as const },
    { label: "Accueil & signalétique", aisleId: "accueil-signaletique" as const, image: "accueil" as const },
    { label: "Buffet & service traiteur", aisleId: "buffet-traiteur" as const, image: "buffet" as const },
  ],
};

export const recWhyImages = {
  vaisselle: img13,
  verrerie: img19,
  linge: img05,
};

export const recDiscoverImages = {
  tables: img04,
  vaisselle: img13,
  verrerie: img19,
  linge: img05,
  tentes: img06,
  eclairage: img09,
  accueil: img17,
  buffet: img10,
};

export const recContactHref = "/contact?need=location&famille=reception#ctc-form-title";
export const recOtherHref = "/contact?need=location&famille=reception&autre=1#ctc-form-title";

export const recHubSeo = {
  title: "Réception & événementiel à louer à Abidjan",
  description: "Louez vaisselle, tables, chapiteaux et équipements de réception pour vos événements à Abidjan.",
};

export function recAislePath(id: string) {
  return `${REC_ROOT}/${id}`;
}
export function recProductPath(aisleId: string, slug: string) {
  return `${REC_ROOT}/${aisleId}/${slug}`;
}
export function getRecAisle(slug: string) {
  return recAisles.find((a) => a.slug === slug || a.id === slug);
}
export function getRecProduct(aisleSlug: string, productSlug: string) {
  const aisle = getRecAisle(aisleSlug);
  if (!aisle) return undefined;
  return recProducts.find((p) => p.slug === productSlug && p.aisleId === aisle.id);
}
export function productsForRecAisle(aisleId: RecAisleId) {
  return recProducts.filter((p) => p.aisleId === aisleId);
}
export function searchReception(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { aisle: undefined, product: undefined };
  const product = recProducts.find(
    (p) => p.keywords.some((k) => k.includes(q)) || p.title.toLowerCase().includes(q),
  );
  if (product) return { aisle: getRecAisle(product.aisleId), product };
  const aisle = recAisles.find((a) => a.title.toLowerCase().includes(q));
  return { aisle, product: undefined };
}
export function matchRecFilters(product: RecProduct, filters: Record<string, string>) {
  if (filters.type && filters.type !== "tous" && product.type !== filters.type) return false;
  if (filters.conditionnement && filters.conditionnement !== "tous") {
    if (filters.conditionnement === "lot" && product.unitKind === "piece") return false;
    if (filters.conditionnement === "piece" && product.unitKind === "lot") return false;
  }
  return true;
}

export function recUnitsFor(product: RecProduct, quantity: number) {
  return quantity * product.packSize;
}

export function recItemSummary(
  product: { unitKind: RecUnitKind; packSize: number; unitLabel: string },
  quantity: number,
) {
  const units = quantity * product.packSize;
  if (product.unitKind === "lot") {
    return `${quantity} lot${quantity > 1 ? "s" : ""} de ${product.packSize} · ${units} ${product.unitLabel}`;
  }
  if (product.unitKind === "set") {
    return `${quantity} set${quantity > 1 ? "s" : ""} individuel${quantity > 1 ? "s" : ""}`;
  }
  return `${units} ${product.unitLabel}`;
}

export function recRecapSummary(
  items: { id: string; quantity: number; title: string; unitLabel?: string; packSize?: number; unitKind?: RecUnitKind }[],
) {
  const refs = items.length;
  const lines = items.map((item) => {
    const pack = item.packSize ?? 1;
    const units = item.quantity * pack;
    const label = item.unitLabel || "articles";
    if ((item.unitKind || "piece") === "lot") return `${units} ${label}`;
    return `${item.quantity} ${label}`;
  });
  return {
    headline: lines.join(" · "),
    counts: `${refs} référence${refs > 1 ? "s" : ""}`,
    refs,
    lines,
  };
}

export function recDemandeWhatsAppMessage(input: {
  reference: string;
  items: { title: string; quantity: number; detail?: string }[];
  zone?: string;
  eventName?: string;
  guests?: string;
  deliveryAt?: string;
  pickupAt?: string;
  name?: string;
  phone?: string;
}) {
  const lines = [`Demande réception ONLOUTOU — ${input.reference}`];
  for (const i of input.items) lines.push(`• ${i.title}${i.detail ? ` (${i.detail})` : ` × ${i.quantity}`}`);
  if (input.eventName) lines.push(`Événement : ${input.eventName}${input.guests ? ` — ${input.guests} personnes` : ""}`);
  if (input.zone) lines.push(`Lieu : ${input.zone}`);
  if (input.deliveryAt) lines.push(`Livraison : ${input.deliveryAt}`);
  if (input.pickupAt) lines.push(`Reprise : ${input.pickupAt}`);
  if (input.name) lines.push(`Contact : ${input.name}`);
  if (input.phone) lines.push(`Tél : ${input.phone}`);
  return lines.join("\n");
}

export function receptionPublicPaths() {
  const paths = [REC_ROOT, REC_DEMANDE_PATH, REC_CONFIRMATION_PATH];
  for (const aisle of recAisles) {
    paths.push(recAislePath(aisle.id));
    for (const product of productsForRecAisle(aisle.id)) {
      paths.push(recProductPath(product.aisleId, product.slug));
    }
  }
  return paths;
}

export function recBreadcrumbJsonLd(base: string, crumbs: { name: string; path: string }[]) {
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

export function recCollectionJsonLd(base: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Réception & événementiel à louer",
    url: `${base}${REC_ROOT}`,
  };
}
