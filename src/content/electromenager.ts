import { site } from "@/content/site";

const dir = "/assets/images/electromenager/webp";
const apos = "\u2019";

export const ELM_ROOT = "/articles/electromenager";
export const ELM_REQUEST_KEY = "onloutou-electromenager-request";
export const ELM_FAMILY_LABEL = "Électroménager";

export type ElmPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

function photo(file: string, alt: string, width: number, height: number, objectPosition = "50% 50%"): ElmPhoto {
  const webp = file.replace(/\.png$/i, ".webp");
  return { src: `${dir}/${webp}`, alt, width, height, objectPosition };
}

export const elmHeroPhoto = photo(
  "01-hero-electromenager.png",
  "Lave-linge, ventilateur, robot pâtissier, cuiseur à riz et réfrigérateur présentés dans un intérieur lumineux",
  1672,
  941,
  "58% 50%",
);

export const elmPlaces = [
  "Abidjan",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Bingerville",
  "Grand Abidjan",
] as const;

export type ElmAisleId =
  | "froid-conservation"
  | "cuisson"
  | "preparation-aliments"
  | "cafe-eau-boissons"
  | "linge-repassage"
  | "lavage-vaisselle"
  | "nettoyage-sols"
  | "climatisation-ventilation";

export type ElmProductType =
  | "refrigerateur"
  | "congelateur"
  | "vitrine"
  | "machine-glacons"
  | "cuisiniere"
  | "mixeur"
  | "cafetiere"
  | "lave-linge"
  | "lave-vaisselle"
  | "aspirateur"
  | "climatiseur"
  | "micro-ondes";

export type ElmSpec = { label: string; value: string };

export type ElmProduct = {
  id: string;
  slug: string;
  aisleId: ElmAisleId;
  type: ElmProductType;
  title: string;
  kicker: string;
  excerpt: string;
  capacityLiters?: number;
  capacityLabel?: string;
  typeLabel: string;
  image: ElmPhoto;
  gallery: ElmPhoto[];
  specs: ElmSpec[];
  keywords: string[];
};

export type ElmAisle = {
  id: ElmAisleId;
  slug: ElmAisleId;
  title: string;
  lead: string;
  image: ElmPhoto;
  typeFilters: { id: "tous" | ElmProductType; label: string }[];
};

export const elmAisles: ElmAisle[] = [
  {
    id: "froid-conservation",
    slug: "froid-conservation",
    title: "Froid & conservation",
    lead: "Réfrigérateurs, congélateurs, vitrines et machines à glaçons en location pour vos événements et activités à Abidjan.",
    image: photo(
      "Réfrigérateur inox dans un intérieur lumineux-15.png",
      "Réfrigérateur inox dans un intérieur lumineux",
      1448,
      1086,
    ),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "refrigerateur", label: "Réfrigérateurs" },
      { id: "congelateur", label: "Congélateurs" },
      { id: "vitrine", label: "Vitrines réfrigérées" },
      { id: "machine-glacons", label: "Machines à glaçons" },
    ],
  },
  {
    id: "cuisson",
    slug: "cuisson",
    title: "Cuisson",
    lead: "Cuisinières et plaques pour équiper une cuisine le temps d’un besoin.",
    image: photo("Cuisinière inox cinq feux en cuisine moderne-3.png", "Cuisinière inox cinq feux en cuisine moderne", 1536, 1024),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "cuisiniere", label: "Cuisinières" },
      { id: "micro-ondes", label: "Micro-ondes" },
    ],
  },
  {
    id: "preparation-aliments",
    slug: "preparation-aliments",
    title: "Préparation des aliments",
    lead: "Mixeurs et robots pour préparer, mixer et dresser.",
    image: photo("Mixeur inox et fruits tropicaux-2.png", "Mixeur inox et fruits tropicaux", 1536, 1024),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "mixeur", label: "Mixeurs" },
    ],
  },
  {
    id: "cafe-eau-boissons",
    slug: "cafe-eau-boissons",
    title: "Café, eau & boissons",
    lead: "Cafetières et appareils pour le service des boissons.",
    image: photo("Cafetière noire et tasse blanche-7.png", "Cafetière noire et tasse blanche", 1536, 1024),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "cafetiere", label: "Cafetières" },
    ],
  },
  {
    id: "linge-repassage",
    slug: "linge-repassage",
    title: "Linge & repassage",
    lead: "Lave-linge pour un usage domestique, un séjour ou un événement.",
    image: photo("Lave-linge blanc en buanderie lumineuse-1.png", "Lave-linge blanc en buanderie lumineuse", 1536, 1024),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "lave-linge", label: "Lave-linge" },
    ],
  },
  {
    id: "lavage-vaisselle",
    slug: "lavage-vaisselle",
    title: "Lavage de la vaisselle",
    lead: "Lave-vaisselle pour la maison, un bureau ou une réception.",
    image: photo(
      "Lave-vaisselle ouvert dans une cuisine ensoleillée-6.png",
      "Lave-vaisselle ouvert dans une cuisine ensoleillée",
      1536,
      1024,
    ),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "lave-vaisselle", label: "Lave-vaisselle" },
    ],
  },
  {
    id: "nettoyage-sols",
    slug: "nettoyage-sols",
    title: "Nettoyage des sols",
    lead: "Aspirateurs pour un nettoyage ponctuel ou une mise à disposition.",
    image: photo("Aspirateur noir et jaune salon moderne-16.png", "Aspirateur noir et jaune dans un salon moderne", 1448, 1086),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "aspirateur", label: "Aspirateurs" },
    ],
  },
  {
    id: "climatisation-ventilation",
    slug: "climatisation-ventilation",
    title: "Climatisation & ventilation",
    lead: "Climatiseurs et ventilateurs pour rafraîchir un espace le temps d’un besoin.",
    image: photo("Climatiseur mural et ventilateur-14.png", "Climatiseur mural et ventilateur", 1448, 1086),
    typeFilters: [
      { id: "tous", label: "Tous" },
      { id: "climatiseur", label: "Climatisation" },
    ],
  },
];

const fridgeThumb = photo(
  `Réfrigérateur inox dans une cuisine contemporaine d${apos}Abidjan-1.png`,
  "Réfrigérateur 250 L inox dans une cuisine contemporaine à Abidjan",
  1448,
  1086,
  "50% 45%",
);
const fridgeKitchen = photo(
  "Réfrigérateur inox ouvert en cuisine lumineuse-6.png",
  "Réfrigérateur 250 L ouvert dans une cuisine lumineuse",
  1448,
  1086,
  "50% 40%",
);
const fridgeInterior = photo(
  "Réfrigérateur vide aux étagères en verre-4.png",
  "Intérieur du réfrigérateur 250 L, étagères en verre",
  1448,
  1086,
);
const fridgeModern = photo(
  "Réfrigérateur inox dans une cuisine moderne-11.png",
  "Réfrigérateur inox dans une cuisine moderne",
  1448,
  1086,
);
const freezerThumb = photo(
  "Congélateur coffre blanc 300 litres-2.png",
  "Congélateur coffre blanc 300 L",
  1448,
  1086,
);
const freezerProvisions = photo(
  "Congélateur ouvert aux provisions colorées-8.png",
  "Congélateur coffre ouvert avec provisions",
  1448,
  1086,
);
export const elmSceneTerracePair = photo(
  "Réfrigérateur et congélateur sur terrasse à Abidjan-3.png",
  "Réfrigérateur 250 L et congélateur coffre 300 L sur une terrasse à Abidjan",
  1448,
  1086,
  "50% 45%",
);
export const elmSceneTruck = photo(
  "Camion de livraison blanc à Abidjan-10.png",
  "Camion de livraison blanc ONLOUTOU à Abidjan",
  1448,
  1086,
  "50% 50%",
);
export const elmSceneWasher = photo(
  "Lave-linge blanc dans un intérieur chaleureux-9.png",
  "Lave-linge blanc dans un intérieur chaleureux",
  1448,
  1086,
);
export const elmSceneMicrowave = photo(
  "Micro-ondes noir dans une cuisine chaleureuse-7.png",
  "Micro-ondes noir dans une cuisine chaleureuse",
  1448,
  1086,
);
export const elmSceneShowroom = photo(
  `Conseil en showroom d${apos}électroménager à Abidjan-5.png`,
  "Conseil en showroom d’électroménager à Abidjan",
  1448,
  1086,
);

export const elmProducts: ElmProduct[] = [
  {
    id: "refrigerateur-250-l",
    slug: "refrigerateur-250-l",
    aisleId: "froid-conservation",
    type: "refrigerateur",
    title: "Réfrigérateur 250 L",
    kicker: "Froid & conservation",
    excerpt: "Deux portes, froid statique.",
    capacityLiters: 250,
    capacityLabel: "250 L",
    typeLabel: "double porte",
    image: fridgeThumb,
    gallery: [fridgeThumb, fridgeKitchen, fridgeInterior, fridgeModern],
    specs: [
      { label: "Capacité utile", value: "250 L" },
      { label: "Type", value: "Double porte (congélateur en haut)" },
      { label: "Type de froid", value: "Froid statique" },
      { label: "Compartiments", value: "Réfrigérateur + congélateur" },
      { label: "Clayettes", value: "Étagères en verre réglables" },
      { label: "Usage", value: "Usage domestique et bureau" },
    ],
    keywords: ["frigo", "réfrigérateur", "refrigerateur", "froid", "250"],
  },
  {
    id: "congelateur-coffre-300-l",
    slug: "congelateur-coffre-300-l",
    aisleId: "froid-conservation",
    type: "congelateur",
    title: "Congélateur coffre 300 L",
    kicker: "Froid & conservation",
    excerpt: "Grande capacité, usage intensif.",
    capacityLiters: 300,
    capacityLabel: "300 L",
    typeLabel: "coffre",
    image: freezerThumb,
    gallery: [freezerThumb, freezerProvisions],
    specs: [
      { label: "Capacité utile", value: "300 L" },
      { label: "Type", value: "Coffre" },
      { label: "Usage", value: "Conservation intensive, événement, activité" },
    ],
    keywords: ["congélateur", "congelateur", "coffre", "froid", "300"],
  },
  {
    id: "vitrine-refrigeree",
    slug: "vitrine-refrigeree",
    aisleId: "froid-conservation",
    type: "vitrine",
    title: "Vitrine réfrigérée",
    kicker: "Froid & conservation",
    excerpt: "Mise en valeur et conservation de vos boissons et produits frais.",
    typeLabel: "vitrine",
    image: photo("Vitrine noire de boissons sur terrasse abidjanaise-13.png", "Vitrine réfrigérée de boissons", 1448, 1086),
    gallery: [photo("Vitrine noire de boissons sur terrasse abidjanaise-13.png", "Vitrine réfrigérée de boissons", 1448, 1086)],
    specs: [
      { label: "Type", value: "Vitrine verticale" },
      { label: "Usage", value: "Boissons et produits frais" },
    ],
    keywords: ["vitrine", "boissons", "froid"],
  },
  {
    id: "machine-a-glacons",
    slug: "machine-a-glacons",
    aisleId: "froid-conservation",
    type: "machine-glacons",
    title: "Machine à glaçons",
    kicker: "Froid & conservation",
    excerpt: "Production rapide de glaçons, idéale pour vos événements.",
    typeLabel: "machine à glaçons",
    image: photo(`Machine à glaçons sur terrasse d${apos}Abidjan-9.png`, "Machine à glaçons sur une terrasse à Abidjan", 1448, 1086),
    gallery: [photo(`Machine à glaçons sur terrasse d${apos}Abidjan-9.png`, "Machine à glaçons sur une terrasse à Abidjan", 1448, 1086)],
    specs: [
      { label: "Type", value: "Machine à glaçons" },
      { label: "Usage", value: "Événements et restauration" },
    ],
    keywords: ["glaçons", "glacons", "machine", "froid"],
  },
  {
    id: "cuisiniere-cinq-feux",
    slug: "cuisiniere-cinq-feux",
    aisleId: "cuisson",
    type: "cuisiniere",
    title: "Cuisinière cinq feux",
    kicker: "Cuisson",
    excerpt: "Cuisinière inox pour une cuisine complète le temps d’un besoin.",
    typeLabel: "cinq feux",
    image: photo("Cuisinière inox cinq feux en cuisine moderne-3.png", "Cuisinière inox cinq feux", 1536, 1024),
    gallery: [photo("Cuisinière inox cinq feux en cuisine moderne-3.png", "Cuisinière inox cinq feux", 1536, 1024)],
    specs: [
      { label: "Type", value: "Cuisinière cinq feux" },
      { label: "Usage", value: "Cuisine domestique et événementielle" },
    ],
    keywords: ["cuisinière", "cuisiniere", "feux", "cuisson"],
  },
  {
    id: "mixeur-inox",
    slug: "mixeur-inox",
    aisleId: "preparation-aliments",
    type: "mixeur",
    title: "Mixeur inox",
    kicker: "Préparation des aliments",
    excerpt: "Préparation de boissons, sauces et recettes du quotidien.",
    typeLabel: "mixeur",
    image: photo("Mixeur inox et fruits tropicaux-2.png", "Mixeur inox et fruits tropicaux", 1536, 1024),
    gallery: [photo("Mixeur inox et fruits tropicaux-2.png", "Mixeur inox et fruits tropicaux", 1536, 1024)],
    specs: [
      { label: "Type", value: "Mixeur" },
      { label: "Usage", value: "Préparation des aliments et boissons" },
    ],
    keywords: ["mixeur", "blender", "préparation", "preparation"],
  },
  {
    id: "cafetiere",
    slug: "cafetiere",
    aisleId: "cafe-eau-boissons",
    type: "cafetiere",
    title: "Cafetière",
    kicker: "Café, eau & boissons",
    excerpt: "Cafetière pour un service café à la maison, au bureau ou sur un événement.",
    typeLabel: "cafetière",
    image: photo("Cafetière noire et tasse blanche-7.png", "Cafetière noire et tasse blanche", 1536, 1024),
    gallery: [photo("Cafetière noire et tasse blanche-7.png", "Cafetière noire et tasse blanche", 1536, 1024)],
    specs: [
      { label: "Type", value: "Cafetière filtre" },
      { label: "Usage", value: "Service café" },
    ],
    keywords: ["café", "cafe", "cafetière", "cafetiere"],
  },
  {
    id: "lave-linge",
    slug: "lave-linge",
    aisleId: "linge-repassage",
    type: "lave-linge",
    title: "Lave-linge",
    kicker: "Linge & repassage",
    excerpt: "Lave-linge pour un usage ponctuel ou une mise à disposition.",
    typeLabel: "lave-linge",
    image: elmSceneWasher,
    gallery: [elmSceneWasher, photo("Lave-linge blanc en buanderie lumineuse-1.png", "Lave-linge blanc en buanderie", 1536, 1024)],
    specs: [
      { label: "Type", value: "Lave-linge hublot" },
      { label: "Usage", value: "Linge du quotidien" },
    ],
    keywords: ["lave-linge", "linge", "machine à laver"],
  },
  {
    id: "lave-vaisselle",
    slug: "lave-vaisselle",
    aisleId: "lavage-vaisselle",
    type: "lave-vaisselle",
    title: "Lave-vaisselle",
    kicker: "Lavage de la vaisselle",
    excerpt: "Lave-vaisselle pour une cuisine, un bureau ou une réception.",
    typeLabel: "lave-vaisselle",
    image: photo("Lave-vaisselle ouvert dans une cuisine ensoleillée-6.png", "Lave-vaisselle ouvert", 1536, 1024),
    gallery: [photo("Lave-vaisselle ouvert dans une cuisine ensoleillée-6.png", "Lave-vaisselle ouvert", 1536, 1024)],
    specs: [
      { label: "Type", value: "Lave-vaisselle" },
      { label: "Usage", value: "Vaisselle du quotidien et événement" },
    ],
    keywords: ["lave-vaisselle", "vaisselle"],
  },
  {
    id: "aspirateur",
    slug: "aspirateur",
    aisleId: "nettoyage-sols",
    type: "aspirateur",
    title: "Aspirateur",
    kicker: "Nettoyage des sols",
    excerpt: "Aspirateur pour un nettoyage ponctuel d’un logement ou d’un espace.",
    typeLabel: "aspirateur",
    image: photo("Aspirateur noir et jaune salon moderne-16.png", "Aspirateur noir et jaune dans un salon", 1448, 1086),
    gallery: [
      photo("Aspirateur noir et jaune salon moderne-16.png", "Aspirateur noir et jaune dans un salon", 1448, 1086),
      photo("Aspirateur noir et jaune au salon-8.png", "Aspirateur noir et jaune au salon", 1024, 1536, "50% 40%"),
    ],
    specs: [
      { label: "Type", value: "Aspirateur traineau" },
      { label: "Usage", value: "Nettoyage des sols" },
    ],
    keywords: ["aspirateur", "nettoyage", "sols"],
  },
  {
    id: "micro-ondes",
    slug: "micro-ondes",
    aisleId: "cuisson",
    type: "micro-ondes",
    title: "Micro-ondes",
    kicker: "Cuisson",
    excerpt: "Réchaud rapide pour la maison, le bureau ou un événement.",
    typeLabel: "micro-ondes",
    image: elmSceneMicrowave,
    gallery: [elmSceneMicrowave],
    specs: [
      { label: "Type", value: "Micro-ondes" },
      { label: "Usage", value: "Réchaud et décongélation du quotidien" },
    ],
    keywords: ["micro-ondes", "microondes", "four", "cuisson"],
  },
  {
    id: "climatiseur-mural",
    slug: "climatiseur-mural",
    aisleId: "climatisation-ventilation",
    type: "climatiseur",
    title: "Climatiseur mural",
    kicker: "Climatisation & ventilation",
    excerpt: "Climatisation et ventilation pour rafraîchir un espace.",
    typeLabel: "mural",
    image: photo("Climatiseur mural et ventilateur-14.png", "Climatiseur mural et ventilateur", 1448, 1086),
    gallery: [
      photo("Climatiseur mural et ventilateur-14.png", "Climatiseur mural et ventilateur", 1448, 1086),
      photo(
        "climatiseur-mural-ventilateur-et-plante-tropicale-10.png",
        "Climatiseur mural, ventilateur et plante tropicale",
        1024,
        1536,
        "50% 35%",
      ),
    ],
    specs: [
      { label: "Type", value: "Climatiseur mural" },
      { label: "Usage", value: "Pièce à vivre, bureau, événement" },
    ],
    keywords: ["climatiseur", "clim", "ventilateur", "climatisation"],
  },
];

export const elmCapacityFilters = [
  { id: "toutes", label: "Toutes les capacités" },
  { id: "0-250", label: "Jusqu’à 250 L" },
  { id: "251-400", label: "251 à 400 L" },
  { id: "401+", label: "Plus de 400 L" },
] as const;

export const elmHub = {
  eyebrow: "Abidjan, Côte d’Ivoire · Location d’électroménager",
  title: "Électroménager",
  titleAccent: "à louer.",
  lead: "Une sélection d’appareils fiables pour la maison, la famille et vos événements.",
  search: {
    queryLabel: "Quel appareil cherchez-vous ?",
    queryPlaceholder: "Ex. réfrigérateur, machine à laver...",
    queryPlaceholderShort: "Ex. réfrigérateur...",
    placeLabel: "Ville ou commune",
    placePlaceholder: "Abidjan, Cocody, Yopougon...",
    placePlaceholderShort: "Abidjan, Cocody...",
    datesLabel: "Dates",
    datesPlaceholder: "À préciser",
    submit: "Explorer",
  },
  aislesEyebrow: "Explorez nos appareils",
  aislesTitle: "Quel appareil vous faut-il ?",
  other: {
    placeholder: "Je cherche un autre appareil",
    cta: "Je cherche un autre appareil",
  },
  searchNote: "Disponibilité à confirmer selon vos dates.",
};


export const elmGuide = {
  title: "Pour bien préciser votre besoin",
  uses: [
    { icon: "home" as const, title: "Maison et famille" },
    { icon: "users" as const, title: "Événement" },
    { icon: "building" as const, title: "Bureau temporaire" },
  ],
  criteria: [
    { icon: "box" as const, title: "Capacité", text: "Volume ou charge utile à indiquer, puis à confirmer selon l’appareil." },
    { icon: "zone" as const, title: "Dimensions", text: "Emprise et gabarit à vérifier pour l’accès et le placement." },
    { icon: "sliders" as const, title: "Usage", text: "Quotidien, événement ou besoin ponctuel : à préciser dans la demande." },
    { icon: "wrench" as const, title: "Installation", text: "Branchements ou mise en place souhaités : à indiquer, sans prestation présupposée." },
  ],
  precisTitle: "À indiquer dans la demande",
  precis: [
    { icon: "pin" as const, title: "Commune", text: "Lieu de livraison ou de retrait." },
    { icon: "calendar" as const, title: "Période", text: "Dates souhaitées, à confirmer selon la disponibilité." },
    { icon: "stack" as const, title: "Quantité", text: "Nombre d’appareils nécessaires." },
  ],
  otherLead: "Décrivez l’appareil recherché s’il n’apparaît pas dans les rayons.",
};

export const elmAisleCopy = {
  eyebrow: "Location d’électroménager",
  searchPlaceholder: "Rechercher un équipement ou un usage",
  filterTitle: "Affiner ma recherche",
  typeLegend: "Type d’appareil",
  capacityLegend: "Capacité",
  count: (n: number) => (n === 1 ? "1 appareil proposé" : `${n} appareils proposés`),
  countLead: "Sélectionnez les équipements et ajoutez-les à votre demande.",
  seeSheet: "Voir la fiche",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  adviceTitle: "Besoin de conseil ?",
  adviceText: "Nos équipes vous aident à choisir le bon appareil selon votre besoin.",
  barTitle: (n: number) => (n <= 1 ? "Ma demande · 1 appareil" : `Ma demande · ${n} appareils`),
  barNote: "Disponibilité à confirmer selon vos dates.",
  other: "Demander un autre appareil",
  continue: "Continuer",
};

export const elmProductCopy = {
  eyebrow: "Location d’appareils",
  title: "Louez vos appareils du quotidien, en toute simplicité.",
  titleAccent: "vos appareils",
  lead: "Électroménager, confort et plus encore, disponibles à Abidjan.",
  placeLabel: "Commune",
  datesLabel: "Période de location",
  qtyLabel: "Quantité",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  back: "Retour aux appareils",
  specsTitle: "Caractéristiques",
  deliveryTitle: "Livraison et retrait",
  deliveryLead: "Conditions confirmées selon votre localisation.",
  deliveryText: "Livraison à Abidjan et retrait en agence possibles, selon la commune et la disponibilité.",
  tariffTitle: "Tarif et disponibilité sur demande.",
  tariffText: "Nos conseillers vous orientent selon vos dates et votre lieu.",
  adviceKicker: "Besoin de conseils pour votre location ?",
  adviceLead: "Nos équipes à Abidjan vous aident à choisir l’appareil adapté à votre besoin.",
  adviceCta: "Demander un conseil",
  steps: [
    { n: "01", title: "Vous décrivez", text: "Votre besoin et la période de location." },
    { n: "02", title: "Nous confirmons", text: "Nos équipes vérifient la disponibilité et les conditions selon votre lieu." },
    { n: "03", title: "Vous retirez ou recevez", text: "Vous récupérez l’appareil en agence ou vous êtes livré à Abidjan." },
  ],
};

export const elmContactHref = "/contact?need=location&famille=electromenager#ctc-form-title";
export const elmOtherHref = "/contact?need=location&famille=electromenager&appareil=libre#ctc-form-title";

export const elmHubSeo = {
  title: "Électroménager à louer à Abidjan",
  description:
    "Louez un réfrigérateur, un lave-linge, un climatiseur ou un autre appareil du quotidien à Abidjan. Parcourez les rayons ou décrivez votre besoin.",
};

export function elmAislePath(aisle: ElmAisleId) {
  return `${ELM_ROOT}/${aisle}`;
}

export function elmProductPath(aisle: ElmAisleId, slug: string) {
  return `${ELM_ROOT}/${aisle}/${slug}`;
}

export function getElmAisle(slug: string | undefined) {
  return elmAisles.find((item) => item.slug === slug);
}

export function getElmProduct(aisle: string | undefined, slug: string | undefined) {
  return elmProducts.find((item) => item.aisleId === aisle && item.slug === slug);
}

export function productsForAisle(aisleId: ElmAisleId) {
  return elmProducts.filter((item) => item.aisleId === aisleId);
}

export function matchesCapacity(product: ElmProduct, filter: string) {
  if (filter === "toutes") return true;
  if (product.capacityLiters == null) return false;
  if (filter === "0-250") return product.capacityLiters <= 250;
  if (filter === "251-400") return product.capacityLiters >= 251 && product.capacityLiters <= 400;
  if (filter === "401+") return product.capacityLiters >= 401;
  return true;
}

export function searchElectromenager(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { aisle: undefined as ElmAisle | undefined, product: undefined as ElmProduct | undefined };
  const product = elmProducts.find(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((word) => word.includes(q) || q.includes(word)),
  );
  if (product) return { aisle: getElmAisle(product.aisleId), product };
  const aisle = elmAisles.find((item) => item.title.toLowerCase().includes(q) || item.lead.toLowerCase().includes(q));
  return { aisle, product: undefined };
}


export const ELM_DEMANDE_PATH = `${ELM_ROOT}/demande`;
export const ELM_CONFIRMATION_PATH = `${ELM_ROOT}/demande/confirmation`;
export const ELM_DEMO_REFERENCE = "ONL-DEMO-001";

export const elmDemandeCopy = {
  title: "Ma demande de location",
  titleAccent: "location",
  lead: "Sélectionnez vos appareils, précisez vos besoins et envoyez-nous votre demande.",
  itemsTitle: "Appareils souhaités",
  addDevice: "Ajouter un appareil",
  placeLabel: "Ville ou commune",
  startLabel: "Date de début",
  endLabel: "Date de fin",
  usageLabel: "Décrivez votre usage (facultatif)",
  usagePlaceholder: "Événement, déménagement, besoin temporaire…",
  attachLabel: "Joindre une photo ou une référence (facultatif)",
  attachHint: "JPG, PNG ou PDF. Les pièces jointes seront demandées après étude si nécessaire.",
  servicesTitle: "Services souhaités",
  services: [
    { id: "delivery", label: "Livraison souhaitée" },
    { id: "installation", label: "Installation" },
    { id: "formation", label: "Formation" },
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
  tariffTitle: "Tarif et disponibilité sur proposition.",
  tariffText: "ONLOUTOU confirme les conditions après étude de votre demande.",
  whyTitle: "Pourquoi louer vos appareils chez ONLOUTOU ?",
  whyTitleAccent: "ONLOUTOU",
  why: [
    {
      id: "souplesse" as const,
      title: "Souplesse",
      points: ["Courte ou longue durée", "Événements", "Besoins ponctuels"],
      image: "souplesse" as const,
    },
    {
      id: "fiables" as const,
      title: "Appareils fiables",
      points: ["Équipements récents", "Bien entretenus", "Adaptés à votre usage"],
      image: "fiables" as const,
    },
    {
      id: "livraison" as const,
      title: "Livraison à Abidjan",
      points: ["Toutes les communes", "Service rapide et sécurisé", "Avec accompagnement"],
      image: "livraison" as const,
    },
  ],
};

export const elmConfirmationCopy = {
  title: "Demande enregistrée",
  titleAccent: "Demande",
  lead: "ONLOUTOU étudie votre demande et vous confirme le tarif et la disponibilité.",
  referenceLabel: "Référence de la demande",
  placeLabel: "Lieu",
  periodLabel: "Période",
  deliveryLabel: "Livraison",
  deliveryYes: "Livraison souhaitée",
  deliveryNo: "Retrait ou à préciser",
  whatsapp: "Continuer sur WhatsApp",
  back: "Retour à l’électroménager",
  values: [
    { title: "Livraison à Abidjan", text: "Selon vos besoins" },
    { title: "Large choix d’électroménager", text: "Fiable et en bon état" },
    { title: "Location flexible", text: "Courte ou longue durée" },
  ],
  discoverTitle: "Découvrez notre électroménager en location.",
  discoverTitleAccent: "Découvrez",
  discover: [
    { label: "Réfrigérateurs", aisleId: "froid-conservation" as const, productId: "refrigerateur-250-l", image: "fridge" as const },
    { label: "Congélateurs", aisleId: "froid-conservation" as const, productId: "congelateur-coffre-300-l", image: "freezer" as const },
    { label: "Lave-linges", aisleId: "linge-repassage" as const, productId: "lave-linge", image: "washer" as const },
    { label: "Micro-ondes", aisleId: "cuisson" as const, productId: "micro-ondes", image: "microwave" as const },
  ],
};

export const elmWhyImages = {
  souplesse: fridgeKitchen,
  fiables: freezerProvisions,
  livraison: elmSceneTruck,
};

export const elmDiscoverImages = {
  fridge: fridgeModern,
  freezer: freezerThumb,
  washer: elmSceneWasher,
  microwave: elmSceneMicrowave,
};

export function elmDemandeWhatsAppMessage(input: {
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
    "Bonjour ONLOUTOU, je souhaite finaliser une demande de location d’électroménager.",
    `Référence : ${input.reference}`,
    "Appareils :",
    ...input.items.map((item) => `- ${item.title} × ${item.quantity}`),
  ];
  if (input.zone) lines.push(`Lieu : ${input.zone}`);
  if (input.startDate || input.endDate) lines.push(`Période : ${input.startDate || "?"} – ${input.endDate || "?"}`);
  lines.push(`Livraison : ${input.delivery ? "souhaitée" : "à préciser"}`);
  if (input.name) lines.push(`Nom : ${input.name}`);
  if (input.phone) lines.push(`Téléphone : ${input.phone}`);
  return lines.join("\n");
}

export function electromenagerPublicPaths() {
  const paths = [ELM_ROOT, ELM_DEMANDE_PATH, ELM_CONFIRMATION_PATH];
  for (const aisle of elmAisles) {
    paths.push(elmAislePath(aisle.id));
    for (const product of productsForAisle(aisle.id)) {
      paths.push(elmProductPath(aisle.id, product.slug));
    }
  }
  return paths;
}

export function elmBreadcrumbJsonLd(
  baseUrl: string,
  crumbs: { name: string; path?: string }[],
) {
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

export function elmCollectionJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: elmHubSeo.title,
    description: elmHubSeo.description,
    url: `${baseUrl}${ELM_ROOT}`,
    isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  };
}
