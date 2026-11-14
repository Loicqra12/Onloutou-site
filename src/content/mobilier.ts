const dir = "/assets/images/mobilier/webp";

export const MOB_ROOT = "/articles/mobilier";
export const MOB_REQUEST_KEY = "onloutou-mobilier-request";
export const MOB_FAMILY_LABEL = "Mobilier & décoration";
export const MOB_DEMANDE_PATH = `${MOB_ROOT}/demande`;
export const MOB_CONFIRMATION_PATH = `${MOB_ROOT}/demande/confirmation`;
export const MOB_DEMO_REFERENCE = "ONL-DEMO-003";

export type MobPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

function photo(file: string, alt: string, width = 1448, height = 1086, objectPosition = "50% 50%"): MobPhoto {
  const webp = file.replace(/\.png$/i, ".webp");
  return { src: `${dir}/${webp}`, alt, width, height, objectPosition };
}

export const mobHeroPhoto = photo(
  "mob-02-salon-rotin.webp",
  "Salon tropical en rotin à Abidjan — mobilier et décoration à louer",
  1672,
  941,
  "55% 45%",
);

export const mobPlaces = [
  "Abidjan",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Bingerville",
  "Grand Abidjan",
] as const;

export type MobAisleId =
  | "assises-canapes"
  | "tables-consoles"
  | "bureaux-travail"
  | "rangements-etageres"
  | "lits-chambre"
  | "mobilier-exterieur"
  | "luminaires"
  | "tapis-textiles"
  | "cadres-miroirs"
  | "vases-objets-deco"
  | "plantes-cache-pots"
  | "paravents-cloisons";

export type MobSpec = { label: string; value: string };
export type MobFilterOption = { id: string; label: string };
export type MobFilterGroup = {
  id: string;
  label: string;
  kind: "radio" | "select";
  options: MobFilterOption[];
};

export type MobProduct = {
  id: string;
  slug: string;
  aisleId: MobAisleId;
  type: string;
  title: string;
  kicker: string;
  excerpt: string;
  highlight?: string;
  typeLabel: string;
  material?: string;
  width?: string;
  usage?: string;
  image: MobPhoto;
  gallery: MobPhoto[];
  specs: MobSpec[];
  dimensions?: string;
  connectivity?: { title: string; text: string }[];
  keywords: string[];
  illustrative?: boolean;
};

export type MobAisle = {
  id: MobAisleId;
  slug: string;
  title: string;
  lead: string;
  image: MobPhoto;
  filters: MobFilterGroup[];
  bandImage?: MobPhoto;
};

const imgFauteuil = photo("mob-01-fauteuil.webp", "Fauteuil en rotin miel et ivoire", 1448, 1086, "50% 55%");
const imgSalonRotin = photo("mob-02-salon-rotin.webp", "Salon tropical en rotin à Abidjan", 1448, 1086, "50% 45%");
const imgTerrasse = photo("mob-03-terrasse.webp", "Terrasse tropicale en rotin", 1448, 1086);
const imgEtagere = photo("mob-04-etagere.webp", "Étagère en noyer", 1448, 1086);
const imgTable = photo("mob-05-table-basse.webp", "Table basse ronde en noyer", 1448, 1086, "50% 60%");
const imgChambre = photo("mob-06-chambre.webp", "Chambre élégante ivoire et ocre", 1448, 1086);
const imgBureau = photo("mob-07-bureau.webp", "Bureau en noyer et chaise en cannage", 1448, 1086);
const imgTapis = photo("mob-08-tapis.webp", "Tapis tissé ocre", 1448, 1086);
const imgLamp = photo("mob-09-lampadaire.webp", "Lampadaire en laiton", 1448, 1086, "50% 40%");
const imgParavent = photo("mob-10-paravent.webp", "Paravent en rotin", 1448, 1086);
const imgMiroir = photo("mob-11-miroir.webp", "Miroir rond et art textile", 1448, 1086);
const imgObjets = photo("mob-12-objets-deco.webp", "Objets décoratifs sur console", 1448, 1086);
const imgPlante = photo("mob-13-plante.webp", "Plante tropicale en panier tressé", 1448, 1086);
const imgSalonComplet = photo("mob-14-salon-complet.webp", "Salon tropical chic en rotin et noyer", 1448, 1086, "50% 40%");
const imgChaiseBureau = photo("mob-15-chaise-bureau.webp", "Fauteuil de bureau ergonomique", 1448, 1086);
const imgBanc = photo("mob-16-banc.webp", "Banc en noyer et plaid ocre", 1448, 1086);
const imgFauteuilBack = photo("mob-17-fauteuil-arriere.webp", "Fauteuil en rotin, vue arrière", 1448, 1086);
const imgSalonElegant = photo("mob-18-salon-elegant.webp", "Salon tropical élégant", 1448, 1086);
const imgRotinDetail = photo("mob-19-rotin-detail.webp", "Détail de rotin tressé", 1448, 1086, "50% 50%");
const imgCanape = photo("mob-20-canape.webp", "Canapé cognac dans un salon d’Abidjan", 1448, 1086);

export const mobSceneMeeting = imgSalonComplet;
export const mobSceneShowroom = imgSalonElegant;
export const mobSceneSalon = imgSalonComplet;

export const mobAisles: MobAisle[] = [
  {
    id: "assises-canapes",
    slug: "assises-canapes",
    title: "Assises & canapés",
    lead: "Des assises confortables et élégantes pour vos bureaux, projets et événements à Abidjan.",
    image: imgFauteuil,
    bandImage: { ...imgFauteuil, objectPosition: "50% 35%" },
    filters: [
      {
        id: "type",
        label: "Type",
        kind: "radio",
        options: [
          { id: "tous", label: "Tous" },
          { id: "fauteuil", label: "Fauteuils" },
          { id: "canape", label: "Canapés" },
          { id: "chaise", label: "Chaises" },
          { id: "banc", label: "Bancs" },
        ],
      },
      {
        id: "matiere",
        label: "Matière",
        kind: "select",
        options: [
          { id: "toutes", label: "Toutes les matières" },
          { id: "rotin", label: "Rotin" },
          { id: "bois", label: "Bois" },
          { id: "tissu", label: "Tissu" },
        ],
      },
      {
        id: "largeur",
        label: "Largeur",
        kind: "select",
        options: [
          { id: "toutes", label: "Toutes les largeurs" },
          { id: "70", label: "Environ 70 cm" },
          { id: "120", label: "Environ 120 cm" },
          { id: "160", label: "Environ 160 cm" },
        ],
      },
      {
        id: "usage",
        label: "Usage",
        kind: "select",
        options: [
          { id: "tous", label: "Tous les usages" },
          { id: "interieur", label: "Intérieur" },
          { id: "accueil", label: "Accueil" },
          { id: "bureau", label: "Bureau" },
        ],
      },
    ],
  },
  {
    id: "tables-consoles",
    slug: "tables-consoles",
    title: "Tables & consoles",
    lead: "Tables basses, consoles et surfaces pour structurer vos espaces.",
    image: imgTable,
    filters: [],
  },
  {
    id: "bureaux-travail",
    slug: "bureaux-travail",
    title: "Bureaux & mobilier de travail",
    lead: "Bureaux et assises pour un poste de travail temporaire ou un open space.",
    image: imgBureau,
    filters: [],
  },
  {
    id: "rangements-etageres",
    slug: "rangements-etageres",
    title: "Rangements & étagères",
    lead: "Étagères et rangements pour exposer livres, objets et documents.",
    image: imgEtagere,
    filters: [],
  },
  {
    id: "lits-chambre",
    slug: "lits-chambre",
    title: "Lits & chambre",
    lead: "Literie et ambiance chambre pour un séjour ou une mise en scène.",
    image: imgChambre,
    filters: [],
  },
  {
    id: "mobilier-exterieur",
    slug: "mobilier-exterieur",
    title: "Mobilier d’extérieur",
    lead: "Assises et tables pour terrasses, jardins et réceptions en plein air.",
    image: imgTerrasse,
    filters: [],
  },
  {
    id: "luminaires",
    slug: "luminaires",
    title: "Luminaires",
    lead: "Lampadaires et luminaires pour une lumière douce et élégante.",
    image: imgLamp,
    filters: [],
  },
  {
    id: "tapis-textiles",
    slug: "tapis-textiles",
    title: "Tapis & textiles",
    lead: "Tapis et textiles pour habiller le sol et les assises.",
    image: imgTapis,
    filters: [],
  },
  {
    id: "cadres-miroirs",
    slug: "cadres-miroirs",
    title: "Cadres & miroirs",
    lead: "Miroirs et cadres pour structurer les murs.",
    image: imgMiroir,
    filters: [],
  },
  {
    id: "vases-objets-deco",
    slug: "vases-objets-deco",
    title: "Vases & objets déco",
    lead: "Objets décoratifs pour finaliser une scénographie.",
    image: imgObjets,
    filters: [],
  },
  {
    id: "plantes-cache-pots",
    slug: "plantes-cache-pots",
    title: "Plantes & cache-pots",
    lead: "Végétal et cache-pots pour une touche tropicale.",
    image: imgPlante,
    filters: [],
  },
  {
    id: "paravents-cloisons",
    slug: "paravents-cloisons",
    title: "Paravents & cloisons",
    lead: "Paravents pour séparer ou habiller un espace.",
    image: imgParavent,
    filters: [],
  },
];

export const mobProducts: MobProduct[] = [
  {
    id: "fauteuil-en-rotin",
    slug: "fauteuil-en-rotin",
    aisleId: "assises-canapes",
    type: "fauteuil",
    title: "Fauteuil en rotin",
    kicker: "Assises & canapés",
    excerpt: "Un fauteuil lounge en rotin miel, coussin écru, pour un salon d’accueil élégant.",
    highlight: "Largeur 70 cm · Profondeur 72 cm · Hauteur 80 cm",
    typeLabel: "fauteuil",
    material: "rotin",
    width: "70",
    usage: "interieur",
    image: imgSalonRotin,
    gallery: [imgSalonRotin, imgFauteuilBack, imgRotinDetail],
    specs: [
      { label: "Dimensions", value: "Largeur 70 cm · Profondeur 72 cm · Hauteur 80 cm" },
      { label: "Usage", value: "Usage intérieur" },
      { label: "Finition", value: "Coussin écru" },
    ],
    dimensions: "Largeur 70 cm · Profondeur 72 cm · Hauteur 80 cm",
    keywords: ["fauteuil", "rotin", "assise", "salon"],
  },
  {
    id: "canape-deux-places",
    slug: "canape-deux-places",
    aisleId: "assises-canapes",
    type: "canape",
    title: "Canapé deux places",
    kicker: "Assises & canapés",
    excerpt: "Canapé cognac pour un salon d’accueil chaleureux.",
    highlight: "Deux places",
    typeLabel: "canapé",
    material: "tissu",
    width: "160",
    usage: "accueil",
    image: imgCanape,
    gallery: [imgCanape],
    specs: [
      { label: "Type", value: "Canapé deux places" },
      { label: "Usage", value: "Accueil, salon" },
    ],
    keywords: ["canapé", "assise", "salon"],
  },
  {
    id: "chaise-de-bureau",
    slug: "chaise-de-bureau",
    aisleId: "assises-canapes",
    type: "chaise",
    title: "Chaise de bureau",
    kicker: "Assises & canapés",
    excerpt: "Fauteuil de bureau ergonomique pour un poste de travail temporaire.",
    highlight: "Ergonomique",
    typeLabel: "chaise",
    material: "tissu",
    width: "70",
    usage: "bureau",
    image: imgChaiseBureau,
    gallery: [imgChaiseBureau],
    specs: [
      { label: "Type", value: "Chaise de bureau" },
      { label: "Usage", value: "Bureau" },
    ],
    keywords: ["chaise", "bureau", "assise"],
  },
  {
    id: "banc-en-bois",
    slug: "banc-en-bois",
    aisleId: "assises-canapes",
    type: "banc",
    title: "Banc en bois",
    kicker: "Assises & canapés",
    excerpt: "Banc en noyer avec plaid ocre pour un accueil ou un couloir.",
    highlight: "Bois massif",
    typeLabel: "banc",
    material: "bois",
    width: "120",
    usage: "accueil",
    image: imgBanc,
    gallery: [imgBanc],
    specs: [
      { label: "Type", value: "Banc" },
      { label: "Matière", value: "Noyer" },
    ],
    keywords: ["banc", "bois", "assise"],
  },
  {
    id: "chaise-ivoire-reception",
    slug: "chaise-ivoire-reception",
    aisleId: "assises-canapes",
    type: "chaise",
    title: "Chaise ivoire de r�ception",
    kicker: "Assises & canap�s",
    excerpt: "Chaise ivoire pour accueil et c�r�monies � aussi list�e dans R�ception ? Tables & chaises.",
    highlight: "Ivoire",
    typeLabel: "chaise",
    material: "bois",
    width: "50",
    usage: "accueil",
    image: {
      src: "/assets/images/reception/webp/rec-04.webp",
      alt: "Chaise ivoire de r�ception",
      width: 1448,
      height: 1086,
      objectPosition: "45% 50%",
    },
    gallery: [
      {
        src: "/assets/images/reception/webp/rec-04.webp",
        alt: "Chaise ivoire de reception",
        width: 1448,
        height: 1086,
        objectPosition: "45% 50%",
      },
    ],
    specs: [
      { label: "Usage", value: "Accueil, c�r�monie" },
      { label: "Finition", value: "Ivoire" },
    ],
    keywords: ["chaise", "ivoire", "reception", "c�r�monie"],
  },
  {
    id: "table-basse-ronde",
    slug: "table-basse-ronde",
    aisleId: "tables-consoles",
    type: "table",
    title: "Table basse ronde",
    kicker: "Tables & consoles",
    excerpt: "Table basse ronde en noyer pour compléter un salon.",
    highlight: "Noyer",
    typeLabel: "table",
    image: imgTable,
    gallery: [imgTable],
    specs: [
      { label: "Type", value: "Table basse ronde" },
      { label: "Matière", value: "Noyer" },
    ],
    keywords: ["table", "basse", "noyer", "salon"],
  },
  {
    id: "lampadaire-en-laiton",
    slug: "lampadaire-en-laiton",
    aisleId: "luminaires",
    type: "lampadaire",
    title: "Lampadaire en laiton",
    kicker: "Luminaires",
    excerpt: "Lampadaire en laiton à lumière douce pour un salon ou un accueil.",
    highlight: "Laiton",
    typeLabel: "lampadaire",
    image: imgLamp,
    gallery: [imgLamp],
    specs: [
      { label: "Type", value: "Lampadaire" },
      { label: "Finition", value: "Laiton" },
    ],
    keywords: ["lampadaire", "luminaire", "éclairage", "laiton"],
  },
  // Illustrative items for other rayons
  {
    id: "bureau-noyer",
    slug: "bureau-noyer",
    aisleId: "bureaux-travail",
    type: "bureau",
    title: "Bureau en noyer",
    kicker: "Bureaux & mobilier de travail",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "bureau",
    image: imgBureau,
    gallery: [imgBureau],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["bureau"],
    illustrative: true,
  },
  {
    id: "etagere-noyer",
    slug: "etagere-noyer",
    aisleId: "rangements-etageres",
    type: "etagere",
    title: "Étagère en noyer",
    kicker: "Rangements & étagères",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "étagère",
    image: imgEtagere,
    gallery: [imgEtagere],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["étagère", "rangement"],
    illustrative: true,
  },
  {
    id: "lit-ivoire",
    slug: "lit-ivoire",
    aisleId: "lits-chambre",
    type: "lit",
    title: "Lit & literie ivoire",
    kicker: "Lits & chambre",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "lit",
    image: imgChambre,
    gallery: [imgChambre],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["lit", "chambre"],
    illustrative: true,
  },
  {
    id: "salon-exterieur",
    slug: "salon-exterieur",
    aisleId: "mobilier-exterieur",
    type: "exterieur",
    title: "Salon d’extérieur en rotin",
    kicker: "Mobilier d’extérieur",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "extérieur",
    image: imgTerrasse,
    gallery: [imgTerrasse],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["extérieur", "terrasse"],
    illustrative: true,
  },
  {
    id: "tapis-ocre",
    slug: "tapis-ocre",
    aisleId: "tapis-textiles",
    type: "tapis",
    title: "Tapis tissé ocre",
    kicker: "Tapis & textiles",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "tapis",
    image: imgTapis,
    gallery: [imgTapis],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["tapis", "textile"],
    illustrative: true,
  },
  {
    id: "miroir-rond",
    slug: "miroir-rond",
    aisleId: "cadres-miroirs",
    type: "miroir",
    title: "Miroir rond",
    kicker: "Cadres & miroirs",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "miroir",
    image: imgMiroir,
    gallery: [imgMiroir],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["miroir", "cadre"],
    illustrative: true,
  },
  {
    id: "objets-deco",
    slug: "objets-deco",
    aisleId: "vases-objets-deco",
    type: "deco",
    title: "Trio d’objets décoratifs",
    kicker: "Vases & objets déco",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "décoration",
    image: imgObjets,
    gallery: [imgObjets],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["vase", "déco", "objet"],
    illustrative: true,
  },
  {
    id: "plante-cache-pot",
    slug: "plante-cache-pot",
    aisleId: "plantes-cache-pots",
    type: "plante",
    title: "Plante & cache-pot",
    kicker: "Plantes & cache-pots",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "plante",
    image: imgPlante,
    gallery: [imgPlante],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["plante", "cache-pot"],
    illustrative: true,
  },
  {
    id: "paravent-rotin",
    slug: "paravent-rotin",
    aisleId: "paravents-cloisons",
    type: "paravent",
    title: "Paravent en rotin",
    kicker: "Paravents & cloisons",
    excerpt: "Sélection illustrative — disponibilité à confirmer.",
    typeLabel: "paravent",
    image: imgParavent,
    gallery: [imgParavent],
    specs: [{ label: "Statut", value: "Illustratif" }],
    keywords: ["paravent", "cloison"],
    illustrative: true,
  },
];

export const mobHub = {
  eyebrow: "Abidjan, Côte d’Ivoire — Location de mobilier & décoration",
  title: "Mobilier & décoration",
  titleAccent: "à louer.",
  lead: "Des meubles et objets de décoration élégants pour vos formations, projets et événements.",
  search: {
    queryLabel: "Quel article cherchez-vous ?",
    queryPlaceholder: "Ex. canapé, tapis, lampe...",
    queryPlaceholderShort: "Ex. canapé, tapis...",
    placeLabel: "Commune",
    placePlaceholder: "Abidjan, Cocody, Yopougon...",
    placePlaceholderShort: "Abidjan, Cocody...",
    datesLabel: "Dates",
    datesPlaceholder: "À préciser",
    submit: "Explorer",
  },
  aislesEyebrow: "Découvrez nos familles d’articles",
  aislesTitle: "Tout le mobilier & la décoration à la location",
  other: {
    placeholder: "Je cherche un autre article",
    cta: "Je cherche un autre article",
  },
  searchNote: "Disponibilité à confirmer pour vos dates.",
};


export const mobGuide = {
  title: "Pour bien préciser votre besoin",
  uses: [
    { icon: "home" as const, title: "Intérieur" },
    { icon: "building" as const, title: "Accueil et bureaux" },
    { icon: "users" as const, title: "Extérieur" },
  ],
  criteria: [
    { icon: "zone" as const, title: "Dimensions", text: "Encombrement et passage à vérifier selon le lieu." },
    { icon: "users" as const, title: "Nombre de places", text: "Capacité d’accueil souhaitée, à confirmer article par article." },
    { icon: "layers" as const, title: "Style", text: "Ambiance ou finition recherchée, sans engagement sur un modèle précis avant confirmation." },
    { icon: "home" as const, title: "Intérieur ou extérieur", text: "Lieu d’utilisation à indiquer pour orienter le choix." },
  ],
  precisTitle: "À indiquer dans la demande",
  precis: [
    { icon: "pin" as const, title: "Commune", text: "Lieu de livraison ou de retrait." },
    { icon: "calendar" as const, title: "Période", text: "Dates souhaitées, à confirmer selon la disponibilité." },
    { icon: "stack" as const, title: "Quantité", text: "Nombre de pièces par type." },
  ],
  otherLead: "Décrivez l’article recherché s’il n’apparaît pas dans les rayons.",
};

export const mobAisleCopy = {
  eyebrow: "Location de mobilier & décoration",
  titleSuffix: "à louer",
  titleAccent: "louer",
  searchPlaceholder: "Rechercher un équipement ou un article",
  filterTitle: "Affiner ma recherche",
  resultsTitle: "Modèles à explorer",
  resultsLead: "Une sélection d’articles adaptés à vos besoins.",
  emptyTitle: "Aucun modèle pour ces filtres",
  emptyLead: "Modifiez vos critères ou explorez un autre rayon. Disponibilité à confirmer pour vos dates.",
  emptyIllustrative: "Sélection illustrative : disponibilité et configuration à confirmer avec nos équipes.",
  seeSheet: "Voir la fiche",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  adviceTitle: "Besoin de conseil ?",
  adviceText: "Nos équipes vous aident à choisir le bon mobilier selon vos usages.",
  exploreOtherTitle: "Explorer un autre rayon",
  exploreOtherLead: "Découvrez d’autres articles de mobilier et de décoration.",
  exploreOtherCta: "Tables & consoles",
  availabilityNote: "Disponibilité à confirmer pour vos dates.",
  barTitle: "Ma demande",
  barDevices: "articles",
  barContinue: "Continuer",
  barOther: "Demander un autre article",
};

export const mobProductCopy = {
  eyebrow: "Location de mobilier",
  title: "Fauteuil en rotin",
  titleAccent: "Fauteuil",
  lead: "Vérifiez les dimensions, le tressage et ajoutez la quantité souhaitée à votre demande.",
  placeLabel: "Commune",
  datesLabel: "Période de location",
  qtyLabel: "Quantité",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  back: "Voir ma demande",
  connectivityTitle: "Détails",
  complementTitle: "Pour compléter votre salon",
  complementLead: "",
  complementCta: "Ajouter à ma demande",
  specsTitle: "Caractéristiques",
  deliveryTitle: "Livraison et retrait",
  deliveryLead: "Conditions confirmées selon votre localisation.",
  deliveryText: "Livraison à Abidjan et retrait en agence possibles, selon la commune et la disponibilité.",
  tariffTitle: "Tarif et disponibilité à confirmer.",
  tariffText: "",
  adviceKicker: "Un besoin spécifique en mobilier ou décoration ?",
  adviceTitle: "Un besoin spécifique en mobilier ou décoration ?",
  adviceLead: "Nos équipes à Abidjan vous conseillent sur le mobilier adapté à votre usage.",
  adviceCta: "Nous contacter",
  steps: [
    { n: "01", title: "Vous décrivez", text: "Votre besoin et la période de location." },
    { n: "02", title: "Nos équipes conseillent", text: "Nous vous orientons vers le bon mobilier." },
    { n: "03", title: "Vous louez", text: "Vous retirez ou recevez pour la durée prévue." },
  ],
};

export const mobDemandeCopy = {
  title: "Ma demande de location",
  titleAccent: "Ma demande",
  lead: "Sélectionnez vos meubles et articles de décoration, précisez vos besoins et envoyez-nous votre demande.",
  itemsTitle: "Articles souhaités",
  addDevice: "Ajouter un article",
  placeLabel: "Commune",
  startLabel: "Date de début",
  endLabel: "Date de fin",
  usageLabel: "Décrivez votre usage",
  usagePlaceholder: "Salon d’accueil, événement, tournage…",
  accessLabel: "Accès au lieu (facultatif)",
  accessPlaceholder: "Ex. Rez-de-chaussée",
  attachLabel: "Joindre une photo ou une référence (facultatif)",
  attachHint: "JPG, PNG ou PDF. Les pièces jointes seront demandées après étude si nécessaire.",
  servicesTitle: "Services souhaités",
  services: [
    { id: "delivery", label: "Livraison souhaitée" },
    { id: "installation", label: "Installation souhaitée" },
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
  tariffNote: "Tarif et disponibilité à confirmer.",
  whyTitle: "Location de meubles & décoration d’intérieur",
  whyTitleAccent: "Location",
  why: [
    { id: "salon" as const, title: "Salon", text: "Composer un salon d’accueil élégant.", image: "salon" as const, aisleId: "assises-canapes" as const },
    { id: "assises" as const, title: "Assises & canapés", text: "Fauteuils, canapés et bancs pour vos espaces.", image: "assises" as const, aisleId: "assises-canapes" as const },
    { id: "luminaires" as const, title: "Luminaires", text: "Lampadaires et lumière douce.", image: "luminaires" as const, aisleId: "luminaires" as const },
    { id: "deco" as const, title: "Vases & objets déco", text: "Finitions décoratives pour la scénographie.", image: "deco" as const, aisleId: "vases-objets-deco" as const },
  ],
};

export const mobConfirmationCopy = {
  title: "Demande enregistrée",
  titleAccent: "Demande",
  lead: "ONLOUTOU vérifie le tarif, la disponibilité et les conditions de livraison.",
  referenceLabel: "Référence de la demande",
  placeLabel: "Lieu",
  periodLabel: "Période",
  deliveryLabel: "Livraison",
  deliveryYes: "Livraison souhaitée",
  deliveryNo: "Retrait ou à préciser",
  whatsapp: "Continuer sur WhatsApp",
  back: "Retour à Mobilier & décoration",
  values: [
    { title: "Livraison à Abidjan", text: "Selon vos besoins" },
    { title: "Assistance & conseil", text: "Un accompagnement fiable" },
    { title: "Location flexible", text: "Courte ou longue durée" },
  ],
  discoverTitle: "Découvrez notre univers Mobilier & décoration.",
  discoverTitleAccent: "Découvrez",
  discover: [
    { label: "Assises & canapés", aisleId: "assises-canapes" as const, productId: "fauteuil-en-rotin", image: "assises" as const },
    { label: "Tables & consoles", aisleId: "tables-consoles" as const, productId: "table-basse-ronde", image: "tables" as const },
    { label: "Luminaires", aisleId: "luminaires" as const, productId: "lampadaire-en-laiton", image: "luminaires" as const },
    { label: "Vases & objets déco", aisleId: "vases-objets-deco" as const, productId: "objets-deco", image: "deco" as const },
  ],
};

export const mobWhyImages = {
  salon: imgSalonElegant,
  assises: imgSalonRotin,
  luminaires: imgLamp,
  deco: imgObjets,
};

export const mobDiscoverImages = {
  assises: imgSalonRotin,
  tables: imgTable,
  luminaires: imgLamp,
  deco: imgObjets,
};

export const mobContactHref = "/contact?need=location&famille=mobilier#ctc-form-title";
export const mobOtherHref = "/contact?need=location&famille=mobilier&autre=1#ctc-form-title";

export const mobHubSeo = {
  title: "Mobilier & décoration à louer à Abidjan",
  description: "Louez fauteuils, tables, luminaires et décoration pour vos projets et événements à Abidjan.",
};

export function mobAislePath(id: string) {
  return `${MOB_ROOT}/${id}`;
}

export function mobProductPath(aisleId: string, slug: string) {
  return `${MOB_ROOT}/${aisleId}/${slug}`;
}

export function getMobAisle(slug: string) {
  return mobAisles.find((a) => a.slug === slug || a.id === slug);
}

export function getMobProduct(aisleSlug: string, productSlug: string) {
  const aisle = getMobAisle(aisleSlug);
  if (!aisle) return undefined;
  return mobProducts.find((p) => p.slug === productSlug && p.aisleId === aisle.id);
}

export function productsForMobAisle(aisleId: MobAisleId) {
  return mobProducts.filter((p) => p.aisleId === aisleId);
}

export function searchMobilier(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { aisle: undefined, product: undefined };
  const product = mobProducts.find((p) => p.keywords.some((k) => k.includes(q)) || p.title.toLowerCase().includes(q));
  if (product) return { aisle: getMobAisle(product.aisleId), product };
  const aisle = mobAisles.find((a) => a.title.toLowerCase().includes(q) || a.id.includes(q.replace(/\s+/g, "-")));
  return { aisle, product: undefined };
}

export function matchMobFilters(
  product: MobProduct,
  filters: Record<string, string>,
) {
  if (filters.type && filters.type !== "tous" && product.type !== filters.type) return false;
  if (filters.matiere && filters.matiere !== "toutes" && product.material !== filters.matiere) return false;
  if (filters.largeur && filters.largeur !== "toutes" && product.width !== filters.largeur) return false;
  if (filters.usage && filters.usage !== "tous" && product.usage !== filters.usage) return false;
  return true;
}

export function mobRecapSummary(items: { id: string; quantity: number; title: string }[]) {
  const refs = items.length;
  const devices = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    headline: `${refs} référence${refs > 1 ? "s" : ""} · ${devices} article${devices > 1 ? "s" : ""}`,
    counts: `${refs} référence${refs > 1 ? "s" : ""} · ${devices} article${devices > 1 ? "s" : ""}`,
    refs,
    devices,
  };
}

export function mobDemandeWhatsAppMessage(input: {
  reference: string;
  items: { title: string; quantity: number }[];
  zone?: string;
  startDate?: string;
  endDate?: string;
  delivery?: boolean;
  name?: string;
  phone?: string;
}) {
  const lines = [
    `Demande mobilier ONLOUTOU — ${input.reference}`,
    ...input.items.map((i) => `• ${i.title}${i.quantity > 1 ? ` × ${i.quantity}` : ""}`),
  ];
  if (input.zone) lines.push(`Lieu : ${input.zone}`);
  if (input.startDate || input.endDate) lines.push(`Période : ${[input.startDate, input.endDate].filter(Boolean).join(" – ")}`);
  if (input.delivery) lines.push("Livraison souhaitée");
  if (input.name) lines.push(`Contact : ${input.name}`);
  if (input.phone) lines.push(`Tél : ${input.phone}`);
  return lines.join("\n");
}

export function mobilierPublicPaths() {
  const paths = [MOB_ROOT, MOB_DEMANDE_PATH, MOB_CONFIRMATION_PATH];
  for (const aisle of mobAisles) {
    paths.push(mobAislePath(aisle.id));
    for (const product of productsForMobAisle(aisle.id)) {
      paths.push(mobProductPath(product.aisleId, product.slug));
    }
  }
  return paths;
}

export function mobBreadcrumbJsonLd(base: string, crumbs: { name: string; path: string }[]) {
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

export function mobCollectionJsonLd(base: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mobilier & décoration à louer",
    url: `${base}${MOB_ROOT}`,
  };
}
