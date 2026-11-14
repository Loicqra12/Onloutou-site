import { site } from "@/content/site";

const dir = "/assets/images/informatique/webp";

export const INF_ROOT = "/articles/informatique";
export const INF_REQUEST_KEY = "onloutou-informatique-request";
export const INF_FAMILY_LABEL = "Informatique & téléphonie";
export const INF_DEMANDE_PATH = `${INF_ROOT}/demande`;
export const INF_CONFIRMATION_PATH = `${INF_ROOT}/demande/confirmation`;
export const INF_DEMO_REFERENCE = "ONL-DEMO-002";

export type InfPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
  variant?: string;
};

function photo(file: string, alt: string, width = 1448, height = 1086, objectPosition = "50% 50%", variant?: string): InfPhoto {
  const webp = file.replace(/\.png$/i, ".webp");
  return { src: `${dir}/${webp}`, alt, width, height, objectPosition, variant };
}

export const infHeroPhoto = photo(
  "inf-02-bureau-connecte.webp",
  "Bureau moderne avec ordinateurs, téléphone, smartphone et routeur à Abidjan",
  1672,
  941,
  "58% 45%",
);

export const infPlaces = [
  "Abidjan",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Bingerville",
  "Grand Abidjan",
] as const;

export type InfAisleId =
  | "ordinateurs"
  | "smartphones-telephones"
  | "tablettes"
  | "ecrans-projection"
  | "impression-numerisation"
  | "reseau-internet"
  | "audio-visioconference"
  | "stockage-sauvegarde"
  | "accessoires-connectique"
  | "alimentation-protection";

export type InfProductType =
  | "portable"
  | "fixe"
  | "tout-en-un"
  | "station"
  | "smartphone"
  | "telephone"
  | "tablette"
  | "ecran"
  | "projecteur"
  | "imprimante"
  | "routeur"
  | "audio"
  | "stockage"
  | "accessoire"
  | "onduleur";

export type InfSpec = { label: string; value: string };

export type InfFilterOption = { id: string; label: string };

export type InfFilterGroup = {
  id: string;
  label: string;
  kind: "radio" | "select";
  options: InfFilterOption[];
};

export type InfProduct = {
  id: string;
  slug: string;
  aisleId: InfAisleId;
  type: InfProductType;
  title: string;
  kicker: string;
  excerpt: string;
  highlight?: string;
  typeLabel: string;
  memory?: string;
  screenSize?: string;
  storage?: string;
  system?: string;
  dualSim?: boolean;
  image: InfPhoto;
  gallery: InfPhoto[];
  specs: InfSpec[];
  connectivity?: { title: string; text: string }[];
  keywords: string[];
  illustrative?: boolean;
};

export type InfAisle = {
  id: InfAisleId;
  slug: InfAisleId;
  title: string;
  lead: string;
  image: InfPhoto;
  filters: InfFilterGroup[];
};

const imgPortableMain = photo(
  "inf-01-portable-bureau.webp",
  "Portable bureautique 14 pouces sur un bureau lumineux",
  1448,
  1086,
  "50% 45%",
);
const imgPortableThumb = photo(
  "inf-02-bureau-connecte.webp",
  "Portable sur un bureau moderne à Abidjan",
  1448,
  1086,
  "35% 45%",
);
const imgPhone = photo("inf-03-telephonie.webp", "Smartphone et téléphone de bureau", 1448, 1086);
const imgTablet = photo("inf-04-tablette.webp", "Tablette moderne sur un bureau ensoleillé", 1448, 1086);
const imgPrinter = photo(
  "inf-05-imprimante.webp",
  "Imprimante multifonction dans un bureau lumineux",
  1448,
  1086,
);
const imgScreen = photo(
  "inf-06-ecran-projecteur.webp",
  "Écran et projecteur avec vue sur Abidjan",
  1448,
  1086,
);
const imgRouterBlack = photo("inf-07-routeur-noir.webp", "Routeur 4G noir avec vue sur Abidjan", 1448, 1086, "50% 50%", "Variante noire");
const imgSsd = photo("inf-08-ssd.webp", "SSD externe noir sur un bureau lumineux", 1448, 1086);
const imgWebcam = photo("inf-09-visioconference.webp", "Webcam et haut-parleur de conférence", 1448, 1086);
const imgHub = photo("inf-10-hub-usbc.webp", "Hub USB-C argenté sur un bureau en bois", 1448, 1086);
const imgTower = photo(
  "inf-11-tour.webp",
  "Station de travail fixe en lumière tropicale",
  1448,
  1086,
);
const imgLaptop16 = photo("inf-12-portable-16.webp", "Portable grand écran 16 pouces au bureau", 1448, 1086);
const imgAio = photo(
  "inf-13-tout-en-un.webp",
  "Ordinateur tout-en-un argenté sur un bureau lumineux",
  1448,
  1086,
);
const imgUps = photo("inf-14-onduleur.webp", "Onduleur compact noir sur un bureau en bois", 1448, 1086);
const imgAccessories = photo("inf-15-accessoires.webp", "Casque, hub USB-C et souris", 1448, 1086);
const imgSecondaryA = photo(
  "inf-16-conseil-a.webp",
  "Détail du portable bureautique 14 pouces",
  1448,
  1086,
);
const imgSecondaryB = photo(
  "inf-17-conseil-b.webp",
  "Portable bureautique 14 pouces sous la lumière d’Abidjan",
  1448,
  1086,
);
export const infRouterWhite = photo("inf-18-routeur-blanc.webp", "Routeur Wi-Fi 4G blanc à Abidjan",
  1448,
  1086,
  "50% 50%",
  "Variante blanche");
export const infSceneMeeting = photo(
  "inf-19-reunion.webp",
  "Salle de réunion connectée avec portables et routeur à Abidjan",
  1448,
  1086,
  "50% 40%",
);
const imgPorts = photo("inf-20-ports.webp", "Ports USB, HDMI et USB-C du portable", 1448, 1086);
const imgKeyboard = photo("inf-21-clavier.webp", "Clavier noir mat et pavé tactile", 1448, 1086);
export const infSceneShowroom = imgSecondaryA;

export const infAisles: InfAisle[] = [
  {
    id: "ordinateurs",
    slug: "ordinateurs",
    title: "Ordinateurs",
    lead: "Des ordinateurs performants et prêts à l’emploi pour vos bureaux, projets et événements à Abidjan.",
    image: imgPortableMain,
    filters: [
      {
        id: "type",
        label: "Type",
        kind: "radio",
        options: [
          { id: "tous", label: "Tous" },
          { id: "portable", label: "Portables" },
          { id: "fixe", label: "Fixes" },
          { id: "tout-en-un", label: "Tout-en-un" },
          { id: "station", label: "Stations de travail" },
        ],
      },
      {
        id: "memoire",
        label: "Mémoire",
        kind: "select",
        options: [
          { id: "toutes", label: "Toutes les mémoires" },
          { id: "8", label: "8 Go" },
          { id: "16", label: "16 Go" },
          { id: "32", label: "32 Go" },
        ],
      },
      {
        id: "ecran",
        label: "Taille d’écran",
        kind: "select",
        options: [
          { id: "toutes", label: "Toutes les tailles" },
          { id: "14", label: "14 pouces" },
          { id: "16", label: "16 pouces" },
          { id: "24", label: "24 pouces" },
        ],
      },
    ],
  },
  {
    id: "smartphones-telephones",
    slug: "smartphones-telephones",
    title: "Smartphones & téléphones",
    lead: "Smartphones et téléphones de bureau pour rester joignable pendant vos déplacements ou un événement.",
    image: imgPhone,
    filters: [
      {
        id: "systeme",
        label: "Système",
        kind: "radio",
        options: [
          { id: "tous", label: "Tous" },
          { id: "android", label: "Android" },
          { id: "ios", label: "iOS" },
          { id: "autre", label: "Autre" },
        ],
      },
      {
        id: "stockage",
        label: "Stockage",
        kind: "select",
        options: [
          { id: "tous", label: "Tous les stockages" },
          { id: "64", label: "64 Go" },
          { id: "128", label: "128 Go" },
          { id: "256", label: "256 Go" },
        ],
      },
      {
        id: "double-sim",
        label: "Double SIM",
        kind: "select",
        options: [
          { id: "tous", label: "Peu importe" },
          { id: "oui", label: "Double SIM" },
          { id: "non", label: "Simple SIM" },
        ],
      },
    ],
  },
  {
    id: "tablettes",
    slug: "tablettes",
    title: "Tablettes",
    lead: "Tablettes pour la présentation, la prise de notes ou un usage terrain.",
    image: imgTablet,
    filters: [],
  },
  {
    id: "ecrans-projection",
    slug: "ecrans-projection",
    title: "Écrans & projection",
    lead: "Écrans et projecteurs pour vos réunions, formations et événements.",
    image: imgScreen,
    filters: [],
  },
  {
    id: "impression-numerisation",
    slug: "impression-numerisation",
    title: "Impression & numérisation",
    lead: "Imprimantes et scanners pour un besoin ponctuel ou un renfort de parc.",
    image: imgPrinter,
    filters: [],
  },
  {
    id: "reseau-internet",
    slug: "reseau-internet",
    title: "Réseau & Internet",
    lead: "Routeurs et solutions de connectivité pour garder vos équipes en ligne.",
    image: imgRouterBlack,
    filters: [],
  },
  {
    id: "audio-visioconference",
    slug: "audio-visioconference",
    title: "Audio & visioconférence",
    lead: "Webcam, haut-parleurs et accessoires pour vos réunions hybrides.",
    image: imgWebcam,
    filters: [],
  },
  {
    id: "stockage-sauvegarde",
    slug: "stockage-sauvegarde",
    title: "Stockage & sauvegarde",
    lead: "Disques et SSD externes pour sécuriser ou transporter vos fichiers.",
    image: imgSsd,
    filters: [],
  },
  {
    id: "accessoires-connectique",
    slug: "accessoires-connectique",
    title: "Accessoires & connectique",
    lead: "Hubs, docks et périphériques pour compléter votre poste de travail.",
    image: imgHub,
    filters: [],
  },
  {
    id: "alimentation-protection",
    slug: "alimentation-protection",
    title: "Alimentation & protection",
    lead: "Onduleurs et protections électriques pour sécuriser vos équipements.",
    image: imgUps,
    filters: [],
  },
];

export const infProducts: InfProduct[] = [
  {
    id: "portable-bureautique-14-pouces",
    slug: "portable-bureautique-14-pouces",
    aisleId: "ordinateurs",
    type: "portable",
    title: "Portable bureautique 14 pouces",
    kicker: "Ordinateurs",
    excerpt: "Léger, autonome, prêt pour la bureautique et les formations.",
    highlight: "16 Go RAM · SSD 512 Go",
    typeLabel: "portable",
    memory: "16",
    screenSize: "14",
    storage: "512",
    image: imgPortableMain,
    gallery: [imgPortableMain, imgSecondaryA, imgSecondaryB, imgKeyboard, imgPorts],
    specs: [
      { label: "Écran", value: "14 pouces" },
      { label: "Mémoire", value: "16 Go de RAM" },
      { label: "Stockage", value: "SSD 512 Go" },
      { label: "Usage", value: "Bureautique, formation, déplacement" },
    ],
    connectivity: [
      { title: "USB", text: "Connexion de vos périphériques (souris, clé, hub)." },
      { title: "HDMI", text: "Sortie vidéo pour écran externe ou projecteur." },
      { title: "Chargeur", text: "Alimentation secteur incluse avec l’appareil." },
    ],
    keywords: ["portable", "laptop", "ordinateur", "14", "bureautique"],
  },
  {
    id: "portable-grand-ecran-16-pouces",
    slug: "portable-grand-ecran-16-pouces",
    aisleId: "ordinateurs",
    type: "portable",
    title: "Portable grand écran 16 pouces",
    kicker: "Ordinateurs",
    excerpt: "Grand écran pour le confort de lecture et le multitâche.",
    highlight: "16 Go RAM",
    typeLabel: "portable",
    memory: "16",
    screenSize: "16",
    image: imgLaptop16,
    gallery: [imgLaptop16],
    specs: [
      { label: "Écran", value: "16 pouces" },
      { label: "Mémoire", value: "16 Go de RAM" },
      { label: "Usage", value: "Bureautique confort, présentation" },
    ],
    keywords: ["portable", "16", "ordinateur"],
  },
  {
    id: "ordinateur-tout-en-un",
    slug: "ordinateur-tout-en-un",
    aisleId: "ordinateurs",
    type: "tout-en-un",
    title: "Ordinateur tout-en-un",
    kicker: "Ordinateurs",
    excerpt: "Un poste compact pour un bureau ou un accueil.",
    highlight: "Écran 24 pouces",
    typeLabel: "tout-en-un",
    memory: "16",
    screenSize: "24",
    image: imgAio,
    gallery: [imgAio],
    specs: [
      { label: "Écran", value: "24 pouces" },
      { label: "Type", value: "Tout-en-un" },
      { label: "Usage", value: "Bureau, accueil, open space" },
    ],
    keywords: ["tout-en-un", "aio", "ordinateur", "fixe"],
  },
  {
    id: "station-travail-fixe",
    slug: "station-travail-fixe",
    aisleId: "ordinateurs",
    type: "station",
    title: "Station de travail fixe",
    kicker: "Ordinateurs",
    excerpt: "Puissance pour les usages intensifs et les postes dédiés.",
    highlight: "32 Go RAM",
    typeLabel: "station",
    memory: "32",
    image: imgTower,
    gallery: [imgTower],
    specs: [
      { label: "Mémoire", value: "32 Go de RAM" },
      { label: "Type", value: "Station de travail" },
      { label: "Usage", value: "Production, calcul, postes dédiés" },
    ],
    keywords: ["station", "fixe", "tour", "ordinateur"],
  },
  {
    id: "routeur-4g",
    slug: "routeur-4g",
    aisleId: "reseau-internet",
    type: "routeur",
    title: "Routeur 4G",
    kicker: "Réseau & Internet",
    excerpt: "Une connexion Internet mobile pour vos équipes, formations et événements.",
    highlight: "Wi-Fi 4G",
    typeLabel: "routeur",
    image: infRouterWhite,
    gallery: [infRouterWhite, imgRouterBlack],
    specs: [
      { label: "Type", value: "Routeur Wi-Fi 4G" },
      { label: "Usage", value: "Formation, chantier, secours Internet" },
    ],
    keywords: ["routeur", "4g", "wifi", "internet", "réseau"],
  },
  {
    id: "smartphone-standard",
    slug: "smartphone-standard",
    aisleId: "smartphones-telephones",
    type: "smartphone",
    title: "Smartphone standard",
    kicker: "Smartphones & téléphones",
    excerpt: "Un smartphone prêt à l’emploi pour un besoin ponctuel de quelques jours.",
    highlight: "128 Go · Double SIM",
    typeLabel: "smartphone",
    storage: "128",
    system: "android",
    dualSim: true,
    image: imgPhone,
    gallery: [imgPhone],
    specs: [
      { label: "Système", value: "Android" },
      { label: "Stockage", value: "128 Go" },
      { label: "Double SIM", value: "Oui" },
    ],
    keywords: ["smartphone", "téléphone", "android", "mobile"],
    illustrative: true,
  },
  {
    id: "tablette-moderne",
    slug: "tablette-moderne",
    aisleId: "tablettes",
    type: "tablette",
    title: "Tablette moderne",
    kicker: "Tablettes",
    excerpt: "Tablette pour la présentation et la prise de notes.",
    typeLabel: "tablette",
    image: imgTablet,
    gallery: [imgTablet],
    specs: [{ label: "Usage", value: "Présentation, notes, terrain" }],
    keywords: ["tablette", "tablet"],
    illustrative: true,
  },
  {
    id: "ecran-projecteur",
    slug: "ecran-projecteur",
    aisleId: "ecrans-projection",
    type: "projecteur",
    title: "Écran & projecteur",
    kicker: "Écrans & projection",
    excerpt: "Projection pour réunion, formation ou événement.",
    typeLabel: "projecteur",
    image: imgScreen,
    gallery: [imgScreen],
    specs: [{ label: "Usage", value: "Réunion, formation, événement" }],
    keywords: ["écran", "projecteur", "projection"],
    illustrative: true,
  },
  {
    id: "imprimante-multifonction",
    slug: "imprimante-multifonction",
    aisleId: "impression-numerisation",
    type: "imprimante",
    title: "Imprimante multifonction",
    kicker: "Impression & numérisation",
    excerpt: "Impression et numérisation pour un renfort ponctuel.",
    typeLabel: "imprimante",
    image: imgPrinter,
    gallery: [imgPrinter],
    specs: [{ label: "Usage", value: "Impression, copie, scan" }],
    keywords: ["imprimante", "scan", "multifonction"],
    illustrative: true,
  },
  {
    id: "kit-visioconference",
    slug: "kit-visioconference",
    aisleId: "audio-visioconference",
    type: "audio",
    title: "Kit visioconférence",
    kicker: "Audio & visioconférence",
    excerpt: "Webcam et haut-parleur pour vos réunions hybrides.",
    typeLabel: "audio",
    image: imgWebcam,
    gallery: [imgWebcam],
    specs: [{ label: "Usage", value: "Réunion hybride, visio" }],
    keywords: ["webcam", "visio", "audio"],
    illustrative: true,
  },
  {
    id: "ssd-externe",
    slug: "ssd-externe",
    aisleId: "stockage-sauvegarde",
    type: "stockage",
    title: "SSD externe",
    kicker: "Stockage & sauvegarde",
    excerpt: "Stockage externe pour transporter ou sécuriser vos fichiers.",
    typeLabel: "stockage",
    image: imgSsd,
    gallery: [imgSsd],
    specs: [{ label: "Usage", value: "Sauvegarde, transfert" }],
    keywords: ["ssd", "stockage", "disque"],
    illustrative: true,
  },
  {
    id: "hub-usb-c",
    slug: "hub-usb-c",
    aisleId: "accessoires-connectique",
    type: "accessoire",
    title: "Hub USB-C",
    kicker: "Accessoires & connectique",
    excerpt: "Connectique pour étendre les ports de votre portable.",
    typeLabel: "accessoire",
    image: imgHub,
    gallery: [imgHub],
    specs: [{ label: "Usage", value: "Dock, périphériques" }],
    keywords: ["hub", "usb-c", "accessoire"],
    illustrative: true,
  },
  {
    id: "onduleur-compact",
    slug: "onduleur-compact",
    aisleId: "alimentation-protection",
    type: "onduleur",
    title: "Onduleur compact",
    kicker: "Alimentation & protection",
    excerpt: "Protection électrique pour vos postes et périphériques.",
    typeLabel: "onduleur",
    image: imgUps,
    gallery: [imgUps],
    specs: [{ label: "Usage", value: "Protection secteur" }],
    keywords: ["onduleur", "ups", "alimentation"],
    illustrative: true,
  },
];

export const infHub = {
  eyebrow: "Abidjan, Côte d’Ivoire · Location informatique & téléphonie",
  title: "Informatique & téléphonie",
  titleAccent: "à louer.",
  lead: "Des équipements performants et fiables pour vos formations, projets et événements.",
  search: {
    queryLabel: "Quel matériel cherchez-vous ?",
    queryPlaceholder: "Ex. ordinateur portable, imprimante...",
    queryPlaceholderShort: "Ex. ordinateur...",
    placeLabel: "Commune",
    placePlaceholder: "Abidjan, Cocody, Yopougon...",
    placePlaceholderShort: "Abidjan, Cocody...",
    datesLabel: "Dates",
    datesPlaceholder: "À préciser",
    submit: "Explorer",
  },
  aislesEyebrow: "Découvrez nos familles d’équipements",
  aislesTitle: "Tout l’informatique & la téléphonie à la location",
  other: {
    placeholder: "Je cherche un autre article",
    cta: "Je cherche un autre article",
  },
  searchNote: "Disponibilité à confirmer pour vos dates.",
};


export const infGuide = {
  title: "Pour bien préciser votre besoin",
  uses: [
    { icon: "laptop" as const, title: "Bureau et formation" },
    { icon: "monitor" as const, title: "Réunion et événement" },
    { icon: "building" as const, title: "Chantier ou site temporaire" },
  ],
  criteria: [
    { icon: "sliders" as const, title: "Usage", text: "Bureautique, formation, réunion ou usage terrain : à indiquer dans la demande." },
    { icon: "gauge" as const, title: "Performances", text: "Niveau attendu à préciser ; les détails techniques seront confirmés avec le partenaire." },
    { icon: "puzzle" as const, title: "Connectique", text: "Ports, réseau ou accessoires nécessaires : à mentionner si vous les connaissez." },
    { icon: "stack" as const, title: "Quantité", text: "Nombre d’équipements à prévoir pour vos équipes." },
  ],
  precisTitle: "À indiquer dans la demande",
  precis: [
    { icon: "pin" as const, title: "Commune", text: "Lieu d’utilisation, de livraison ou de retrait." },
    { icon: "calendar" as const, title: "Période", text: "Dates souhaitées, à confirmer selon la disponibilité." },
    { icon: "stack" as const, title: "Quantité", text: "Nombre d’appareils par type." },
  ],
  otherLead: "Décrivez le matériel recherché s’il n’apparaît pas dans les rayons.",
};

export const infAisleCopy = {
  eyebrow: "Location d’informatique & téléphonie",
  titleSuffix: "à louer",
  titleAccent: "louer",
  searchPlaceholder: "Rechercher un équipement ou un usage",
  filterTitle: "Affiner ma recherche",
  resultsTitle: "Modèles à explorer",
  resultsLead: "Une sélection d’équipements adaptés à vos besoins professionnels.",
  emptyTitle: "Aucun modèle pour ces filtres",
  emptyLead: "Modifiez vos critères ou explorez un autre rayon. Disponibilité à confirmer pour vos dates.",
  emptyIllustrative: "Sélection illustrative : disponibilité et configuration à confirmer avec nos équipes.",
  seeSheet: "Voir la fiche",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  adviceTitle: "Besoin de conseil ?",
  adviceText: "Nos équipes vous aident à choisir le bon équipement selon vos usages.",
  exploreOtherTitle: "Explorer un autre rayon",
  exploreOtherLead: "Ajouter un routeur depuis Réseau & Internet.",
  exploreOtherCta: "Réseau & Internet",
  availabilityNote: "Disponibilité à confirmer pour vos dates.",
  barTitle: "Ma demande",
  barDevices: "appareils",
  barContinue: "Continuer",
  barOther: "Demander un autre article",
};

export const infProductCopy = {
  eyebrow: "Location d’équipements",
  title: "Louez vos équipements informatiques et téléphoniques, en toute simplicité.",
  titleAccent: "équipements",
  lead: "Des solutions fiables et prêtes à l’emploi pour vos équipes et vos projets à Abidjan.",
  placeLabel: "Commune",
  datesLabel: "Période de location",
  qtyLabel: "Quantité",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  back: "Continuer à explorer",
  connectivityTitle: "Connectique et accessoires",
  complementTitle: "Équipement complémentaire",
  complementLead: "Ajoutez un routeur 4G pour une connexion Internet fiable sur site.",
  complementCta: "Voir la fiche",
  specsTitle: "Caractéristiques",
  deliveryTitle: "Livraison et retrait",
  deliveryLead: "Conditions confirmées selon votre localisation.",
  deliveryText: "Livraison à Abidjan et retrait en agence possibles, selon la commune et la disponibilité.",
  tariffTitle: "Tarif et disponibilité sur demande.",
  tariffText: "Nos conseillers vous orientent selon vos dates et vos besoins.",
  adviceKicker: "Un besoin spécifique en informatique ou téléphonie ?",
  adviceTitle: "Un besoin spécifique en informatique ou téléphonie ?",
  adviceLead: "Nos équipes à Abidjan vous conseillent sur le matériel adapté à votre usage.",
  adviceCta: "Nous contacter",
  steps: [
    { n: "01", title: "Vous décrivez", text: "Votre besoin et la période de location." },
    { n: "02", title: "Nos équipes conseillent", text: "Nous vous orientons vers le bon équipement." },
    { n: "03", title: "Vous louez", text: "Vous retirez ou recevez pour la durée prévue." },
  ],
};

export const infDemandeCopy = {
  title: "Ma demande de location",
  titleAccent: "Ma demande",
  lead: "Sélectionnez vos équipements informatiques et télécoms, précisez vos besoins et envoyez-nous votre demande.",
  itemsTitle: "Articles souhaités",
  addDevice: "Ajouter un article",
  placeLabel: "Commune",
  startLabel: "Date de début",
  endLabel: "Date de fin",
  usageLabel: "Décrivez votre usage",
  usagePlaceholder: "Formation, événement, besoin temporaire…",
  attachLabel: "Joindre une photo ou une référence (facultatif)",
  attachHint: "JPG, PNG ou PDF. Les pièces jointes seront demandées après étude si nécessaire.",
  servicesTitle: "Services souhaités",
  services: [
    { id: "delivery", label: "Livraison souhaitée" },
    { id: "installation", label: "Installation" },
  ] as const,
  contactTitle: "Vos coordonnées",
  nameLabel: "Votre nom",
  phoneLabel: "Téléphone",
  emailLabel: "E-mail (facultatif)",
  submit: "Envoyer ma demande",
  edit: "Modifier ma sélection",
  recapTitle: "Récapitulatif",
  periodLabel: "Période",
  placeRecapLabel: "Lieu",
  tariffNote: "Tarif, disponibilité et forfait Internet à confirmer.",
  whyTitle: "Location d’équipements informatiques et télécoms",
  whyTitleAccent: "Location",
  why: [
    {
      id: "productifs" as const,
      title: "Équipements productifs",
      text: "Portables et postes prêts pour vos formations et projets.",
      image: "productifs" as const,
    },
    {
      id: "connectivite" as const,
      title: "Connectivité mobile",
      text: "Routeurs 4G pour garder vos équipes en ligne.",
      image: "connectivite" as const,
    },
    {
      id: "flexibles" as const,
      title: "Solutions flexibles",
      text: "Formules courtes ou longues selon votre usage.",
      image: "flexibles" as const,
    },
  ],
};

export const infConfirmationCopy = {
  title: "Demande enregistrée",
  titleAccent: "Demande",
  lead: "ONLOUTOU vérifie la disponibilité, le tarif et les conditions de livraison.",
  referenceLabel: "Référence de la demande",
  placeLabel: "Lieu",
  periodLabel: "Période",
  deliveryLabel: "Livraison",
  deliveryYes: "Livraison souhaitée",
  deliveryNo: "Retrait ou à préciser",
  whatsapp: "Continuer sur WhatsApp",
  back: "Retour à Informatique & téléphonie",
  values: [
    { title: "Livraison à Abidjan", text: "Selon vos besoins" },
    { title: "Assistance & conseil", text: "Un accompagnement fiable" },
    { title: "Location flexible", text: "Courte ou longue durée" },
  ],
  discoverTitle: "Découvrez notre univers Informatique & téléphonie.",
  discoverTitleAccent: "Découvrez",
  discover: [
    { label: "Portables", aisleId: "ordinateurs" as const, productId: "portable-bureautique-14-pouces", image: "portables" as const },
    { label: "Postes de bureau", aisleId: "ordinateurs" as const, productId: "ordinateur-tout-en-un", image: "postes" as const },
    { label: "Accessoires informatiques", aisleId: "accessoires-connectique" as const, productId: "hub-usb-c", image: "accessoires" as const },
    { label: "Téléphonie", aisleId: "smartphones-telephones" as const, productId: "smartphone-standard", image: "telephonie" as const },
  ],
};

export const infWhyImages = {
  productifs: imgPortableMain,
  connectivite: infRouterWhite,
  flexibles: infSceneMeeting,
};

export const infDiscoverImages = {
  portables: imgPortableThumb,
  postes: imgAio,
  accessoires: imgAccessories,
  telephonie: imgPhone,
};

export const infContactHref = "/contact?need=location&famille=informatique#ctc-form-title";
export const infOtherHref = "/contact?need=location&famille=informatique&appareil=libre#ctc-form-title";

export const infHubSeo = {
  title: "Informatique & téléphonie à louer à Abidjan",
  description:
    "Louez ordinateurs, smartphones, routeurs et équipements informatiques à Abidjan. Parcourez les rayons ou décrivez votre besoin.",
};

export function infAislePath(aisle: InfAisleId) {
  return `${INF_ROOT}/${aisle}`;
}

export function infProductPath(aisle: InfAisleId, slug: string) {
  return `${INF_ROOT}/${aisle}/${slug}`;
}

export function getInfAisle(slug: string | undefined) {
  return infAisles.find((item) => item.slug === slug);
}

export function getInfProduct(aisle: string | undefined, slug: string | undefined) {
  return infProducts.find((item) => item.aisleId === aisle && item.slug === slug);
}

export function productsForInfAisle(aisleId: InfAisleId) {
  return infProducts.filter((item) => item.aisleId === aisleId);
}

export function searchInformatique(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { aisle: undefined as InfAisle | undefined, product: undefined as InfProduct | undefined };
  const product = infProducts.find(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((word) => word.includes(q) || q.includes(word)),
  );
  if (product) return { aisle: getInfAisle(product.aisleId), product };
  const aisle = infAisles.find((item) => item.title.toLowerCase().includes(q) || item.lead.toLowerCase().includes(q));
  return { aisle, product: undefined };
}

export function matchInfFilters(
  product: InfProduct,
  filters: Record<string, string>,
) {
  for (const [key, value] of Object.entries(filters)) {
    if (!value || value === "tous" || value === "toutes") continue;
    if (key === "type" && product.type !== value) return false;
    if (key === "memoire" && product.memory !== value) return false;
    if (key === "ecran" && product.screenSize !== value) return false;
    if (key === "systeme" && product.system !== value) return false;
    if (key === "stockage" && product.storage !== value) return false;
    if (key === "double-sim") {
      if (value === "oui" && !product.dualSim) return false;
      if (value === "non" && product.dualSim) return false;
    }
  }
  return true;
}

export function infRecapSummary(items: { id: string; quantity: number; title: string }[]) {
  const refs = items.length;
  const devices = items.reduce((sum, item) => sum + item.quantity, 0);
  const parts: string[] = [];
  for (const item of items) {
    const lower = item.title.toLowerCase();
    if (lower.includes("portable")) parts.push(`${item.quantity} portable${item.quantity > 1 ? "s" : ""}`);
    else if (lower.includes("routeur")) parts.push(`${item.quantity} routeur${item.quantity > 1 ? "s" : ""} 4G`);
    else parts.push(`${item.quantity} × ${item.title}`);
  }
  return {
    headline: parts.join(" · "),
    counts: `${refs} référence${refs > 1 ? "s" : ""} · ${devices} appareil${devices > 1 ? "s" : ""}`,
    refs,
    devices,
  };
}

export function infDemandeWhatsAppMessage(input: {
  reference: string;
  items: { title: string; quantity: number }[];
  zone: string;
  startDate: string;
  endDate: string;
  delivery: boolean;
  name: string;
  phone: string;
}) {
  const lines = [
    "Bonjour ONLOUTOU, je souhaite finaliser une demande de location informatique & téléphonie.",
    `Référence : ${input.reference}`,
    "Articles :",
    ...input.items.map((item) => `- ${item.title} × ${item.quantity}`),
  ];
  if (input.zone) lines.push(`Lieu : ${input.zone}`);
  if (input.startDate || input.endDate) lines.push(`Période : ${input.startDate || "?"} – ${input.endDate || "?"}`);
  lines.push(`Livraison : ${input.delivery ? "souhaitée" : "à préciser"}`);
  if (input.name) lines.push(`Nom : ${input.name}`);
  if (input.phone) lines.push(`Téléphone : ${input.phone}`);
  return lines.join("\n");
}

export function informatiquePublicPaths() {
  const paths = [INF_ROOT, INF_DEMANDE_PATH, INF_CONFIRMATION_PATH];
  for (const aisle of infAisles) {
    paths.push(infAislePath(aisle.id));
    for (const product of productsForInfAisle(aisle.id)) {
      paths.push(infProductPath(aisle.id, product.slug));
    }
  }
  return paths;
}

export function infBreadcrumbJsonLd(baseUrl: string, crumbs: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: `${baseUrl}${crumb.path}` } : {}),
    })),
  };
}

export function infCollectionJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: infHubSeo.title,
    description: infHubSeo.description,
    url: `${baseUrl}${INF_ROOT}`,
    isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  };
}