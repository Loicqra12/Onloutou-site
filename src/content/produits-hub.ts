/** Textes et médias du parcours Produits — libellés calqués sur les maquettes. */
export const PRD_ROOT = "/produits";
export const PRD_FAMILLES_PATH = `${PRD_ROOT}/familles`;
export const PRD_VAISSELLE_PATH = `${PRD_ROOT}/reception/vaisselle`;
export const PRD_SUR_MESURE_PATH = `${PRD_ROOT}/sur-mesure`;
export const PRD_DEMANDE_PATH = `${PRD_ROOT}/demande`;
export const PRD_REMISE_PATH = `${PRD_ROOT}/demande/remise`;
export const PRD_CONFIRMATION_PATH = `${PRD_ROOT}/confirmation`;
export const PRD_ORDINATEUR_PATH = `${PRD_ROOT}/informatique/ordinateur-portable`;
export const PRD_REQUEST_KEY = "onloutou-produits-request";
export const PRD_CONFIRMATION_KEY = "onloutou-produits-confirmation";
export const PRD_DEMO_REFERENCE = "ONL-DEMO-006";
export const PRD_IMG_DIR = "/assets/images/produits";

export const prdPlaces = [
  "Abidjan",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Plateau",
  "Bingerville",
  "Grand Abidjan",
] as const;

export type PrdPhoto = {
  file: string;
  alt: string;
  width: number;
  height: number;
  /** Copie WebP au nom ASCII, sans virgule ni accent, si le PNG d'origine est risqué. */
  webpFile?: string;
};

export function prdSrc(file: string, ext: "png" | "webp"): string {
  let name = file;
  if (ext === "webp" && !file.toLowerCase().endsWith(".webp")) {
    name = file.replace(/\.png$/i, ".webp");
  }
  return `${PRD_IMG_DIR}/${encodeURI(name)}`;
}

function photo(file: string, alt: string, width: number, height: number, webpFile?: string): PrdPhoto {
  return { file, alt, width, height, webpFile };
}

export const prdPhotos = {
  heroHub: photo(
    "Préparation de matériel événementiel à Abidjan-3.png",
    "Préparation de matériel événementiel à Abidjan",
    1536,
    1024,
  ),
  quotidien: photo(
    "Pile d’assiettes blanches en porcelaine-2.png",
    "Pile d’assiettes blanches en porcelaine",
    1536,
    1024,
  ),
  professionnel: photo(
    "Location d’engins de chantier à Abidjan-12.png",
    "Location d’engins de chantier à Abidjan",
    1672,
    941,
  ),
  surMesure: photo(
    "Employée d’entrepôt scannant un carton-5.png",
    "Employée d’entrepôt scannant un carton",
    1672,
    941,
  ),
  electromenager: photo(
    "Électroménager premium dans une cuisine tropicale-7.png",
    "Électroménager dans une cuisine à Abidjan",
    1672,
    941,
  ),
  informatique: photo(
    "Portable professionnel avec vue sur Abidjan-9.png",
    "Portable professionnel avec vue sur Abidjan",
    1536,
    1024,
  ),
  mobilier: photo(
    "Fauteuil en rotin miel à Abidjan-8.png",
    "Fauteuil en rotin miel à Abidjan",
    1536,
    1024,
  ),
  enfance: photo(
    "Poussette grise dans un intérieur tropical-10.png",
    "Poussette grise dans un intérieur tropical",
    1536,
    1024,
  ),
  vehicules: photo(
    "Flotte blanche au dépôt d’Abidjan-15.png",
    "Flotte blanche au dépôt d’Abidjan",
    1672,
    941,
  ),
  motos: photo(
    "Motos prêtes à louer à Abidjan-14.png",
    "Motos prêtes à louer à Abidjan",
    1672,
    941,
  ),
  outils: photo(
    "Déchargement d’équipements professionnels à Abidjan-13.png",
    "Déchargement d’équipements professionnels à Abidjan",
    1672,
    941,
  ),
  connectes: photo(
    "Installation d’un traceur GPS embarqué-11.png",
    "Installation d’un traceur GPS embarqué",
    1672,
    941,
  ),
  assiettes: photo(
    "Pile d’assiettes blanches en porcelaine-2.png",
    "Pile d’assiettes blanches en porcelaine",
    1536,
    1024,
  ),
  verres: photo(
    "Douze verres à eau en réception tropicale-4.png",
    "Douze verres à eau en réception tropicale",
    1672,
    941,
  ),
  bols: photo(
    "Bols blancs en porcelaine, réception tropicale-1.png",
    "Bols blancs en porcelaine, réception tropicale",
    1535,
    1024,
    "bols-blancs-en-porcelaine-reception-tropicale-1.webp",
  ),
  plat: photo(
    "Grand plat blanc pour réception tropicale-6.png",
    "Grand plat blanc pour réception tropicale",
    1535,
    1024,
  ),
  confirmation: photo(
    "Employée d’entrepôt scannant un carton-5.png",
    "Employée d’entrepôt scannant un carton",
    1672,
    941,
  ),
};

export const prdHubCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Articles & équipements" },
    { label: "Tous les produits" },
  ],
  title: "Que cherchez-vous à louer\u00a0?",
  lead: "Un article pour la maison, une réception à préparer ou du matériel pour votre activité en Côte d’Ivoire.",
  explore: "Explorer les familles",
  searchArticle: "Quel article cherchez-vous\u00a0?",
  searchArticlePh: "Ex. assiettes, ordinateur, camion",
  searchWhere: "Où\u00a0?",
  searchWherePh: "Ville ou commune",
  searchWhen: "Quand\u00a0?",
  searchWhenPh: "Dates à préciser",
  searchSubmit: "Rechercher",
  universTitle: "Parcourir les univers",
  univers: [
    {
      id: "quotidien",
      title: "Articles du quotidien",
      text: "Maison, réception, enfance…",
      href: `${PRD_FAMILLES_PATH}#quotidien`,
      photo: "quotidien" as const,
    },
    {
      id: "professionnel",
      title: "Matériel professionnel",
      text: "Véhicules, chantier, GPS…",
      href: `${PRD_FAMILLES_PATH}#professionnel`,
      photo: "professionnel" as const,
    },
    {
      id: "sur-mesure",
      title: "Demande sur mesure",
      text: "Plusieurs articles ou un projet",
      href: PRD_SUR_MESURE_PATH,
      photo: "surMesure" as const,
    },
  ],
};

export const prdFamilyGroups = [
  {
    id: "quotidien",
    title: "Articles du quotidien",
    items: [
      {
        title: "Électroménager",
        text: "Froid, cuisson, lavage",
        href: "/articles/electromenager",
        photo: "electromenager" as const,
      },
      {
        title: "Informatique & téléphonie",
        text: "Portables, écrans, téléphones",
        href: "/articles/informatique",
        photo: "informatique" as const,
      },
      {
        title: "Mobilier & décoration",
        text: "Fauteuils, bureaux, luminaires",
        href: "/articles/mobilier",
        photo: "mobilier" as const,
      },
      {
        title: "Réception & événementiel",
        text: "Vaisselle, chapiteaux, sono",
        href: "/articles/reception",
        photo: "quotidien" as const,
      },
      {
        title: "Bébé & enfance",
        text: "Poussettes, couchage, jeux",
        href: "/articles/enfance",
        photo: "enfance" as const,
      },
    ],
  },
  {
    id: "professionnel",
    title: "Véhicules & matériel professionnel",
    items: [
      {
        title: "Véhicules professionnels",
        text: "Utilitaires, berlines, 4\u00a0×\u00a04",
        href: "/equipements/vehicules",
        photo: "vehicules" as const,
      },
      {
        title: "Motos & deux-roues",
        text: "Déplacements et livraison",
        href: "/equipements/motos",
        photo: "motos" as const,
      },
      {
        title: "Camions & engins",
        text: "Transport, chantier, levage",
        href: "/equipements/camions-engins",
        photo: "professionnel" as const,
      },
      {
        title: "Outils & matériel",
        text: "Atelier, énergie, entretien",
        href: "/equipements/outils-materiels",
        photo: "outils" as const,
      },
      {
        title: "Équipements connectés",
        text: "Traceurs, balises, capteurs",
        href: "/equipements/equipements-connectes",
        photo: "connectes" as const,
      },
    ],
  },
] as const;

export const prdFamillesCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: PRD_ROOT },
    { label: "Toutes les familles" },
  ],
  title: "Toutes les familles",
  otherTitle: "Vous cherchez autre chose\u00a0?",
  otherLead: "Décrivez l’article, même si vous ignorez sa référence.",
  otherCta: "Je cherche un autre article",
};

export type PrdUnitKind = "lot" | "piece" | "unit" | "custom";

export type PrdCatalogItem = {
  id: string;
  slug: string;
  path: string;
  family: "reception" | "informatique";
  familyLabel: string;
  aisleLabel: string;
  aislePath?: string;
  title: string;
  lead: string;
  kicker: string;
  unitBadge: string;
  unitKind: PrdUnitKind;
  packSize: number;
  unitLabel: string;
  unitQtyLabel: string;
  packagingLabel: string;
  packagingValue: string;
  photo: keyof typeof prdPhotos;
  keywords: string[];
  /** Identifiant dans le panier famille, pour le pont. */
  familyItemId: string;
};

export const prdCatalog: PrdCatalogItem[] = [
  {
    id: "assiettes-plates-blanches",
    slug: "assiettes-plates-blanches",
    path: `${PRD_ROOT}/reception/assiettes-plates-blanches`,
    family: "reception",
    familyLabel: "Réception & événementiel",
    aisleLabel: "Vaisselle",
    aislePath: PRD_VAISSELLE_PATH,
    title: "Assiettes plates blanches",
    lead: "Pour les repas servis à table ou au buffet.",
    kicker: "Vaisselle de réception",
    unitBadge: "Lot de 25",
    unitKind: "lot",
    packSize: 25,
    unitLabel: "assiettes",
    unitQtyLabel: "Nombre de lots",
    packagingLabel: "Conditionnement",
    packagingValue: "25 assiettes par lot",
    photo: "assiettes",
    keywords: ["assiette", "assiettes", "vaisselle", "porcelaine", "lot"],
    familyItemId: "assiettes-plates-blanches",
  },
  {
    id: "verres-a-eau",
    slug: "verres-a-eau",
    path: `${PRD_ROOT}/reception/verres-a-eau`,
    family: "reception",
    familyLabel: "Réception & événementiel",
    aisleLabel: "Vaisselle",
    aislePath: PRD_VAISSELLE_PATH,
    title: "Verres à eau",
    lead: "Pour le service à table ou au buffet.",
    kicker: "Vaisselle de réception",
    unitBadge: "Lot de 12",
    unitKind: "lot",
    packSize: 12,
    unitLabel: "verres",
    unitQtyLabel: "Nombre de lots",
    packagingLabel: "Conditionnement",
    packagingValue: "12 verres par lot",
    photo: "verres",
    keywords: ["verre", "verres", "eau", "vaisselle"],
    familyItemId: "verres-a-eau",
  },
  {
    id: "bols-porcelaine",
    slug: "bols-porcelaine",
    path: `${PRD_ROOT}/reception/bols-porcelaine`,
    family: "reception",
    familyLabel: "Réception & événementiel",
    aisleLabel: "Vaisselle",
    aislePath: PRD_VAISSELLE_PATH,
    title: "Bols en porcelaine",
    lead: "Pour les entrées, les accompagnements ou le buffet.",
    kicker: "Vaisselle de réception",
    unitBadge: "Lot de 10",
    unitKind: "lot",
    packSize: 10,
    unitLabel: "bols",
    unitQtyLabel: "Nombre de lots",
    packagingLabel: "Conditionnement",
    packagingValue: "10 bols par lot",
    photo: "bols",
    keywords: ["bol", "bols", "porcelaine", "vaisselle"],
    familyItemId: "bols-porcelaine",
  },
  {
    id: "plat-service-ovale",
    slug: "plat-service-ovale",
    path: `${PRD_ROOT}/reception/plat-service-ovale`,
    family: "reception",
    familyLabel: "Réception & événementiel",
    aisleLabel: "Vaisselle",
    aislePath: PRD_VAISSELLE_PATH,
    title: "Plat de service ovale",
    lead: "Pour présenter les plats à table ou au buffet.",
    kicker: "Vaisselle de réception",
    unitBadge: "À la pièce",
    unitKind: "piece",
    packSize: 1,
    unitLabel: "pièces",
    unitQtyLabel: "Quantité",
    packagingLabel: "Conditionnement",
    packagingValue: "À la pièce",
    photo: "plat",
    keywords: ["plat", "service", "ovale", "vaisselle"],
    familyItemId: "plat-service-ovale",
  },
  {
    id: "ordinateur-portable",
    slug: "ordinateur-portable",
    path: PRD_ORDINATEUR_PATH,
    family: "informatique",
    familyLabel: "Informatique & téléphonie",
    aisleLabel: "Ordinateurs",
    title: "Ordinateur portable",
    lead: "Pour une salle de formation, un bureau ou un déplacement.",
    kicker: "Informatique & téléphonie",
    unitBadge: "À l’unité",
    unitKind: "unit",
    packSize: 1,
    unitLabel: "unités",
    unitQtyLabel: "Nombre d’unités",
    packagingLabel: "Conditionnement",
    packagingValue: "À l’unité",
    photo: "informatique",
    keywords: ["ordinateur", "portable", "ordinateur portable", "informatique"],
    familyItemId: "portable-bureautique-14-pouces",
  },
];

export const prdVaisselleCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: PRD_ROOT },
    { label: "Réception & événementiel", href: "/articles/reception" },
    { label: "Vaisselle" },
  ],
  title: "Vaisselle de réception",
  lead: "Des exemples pour composer votre demande. Les partenaires confirment les quantités pour vos dates.",
  search: "Rechercher dans ce rayon",
  searchPh: "Assiette, bol, plat de service…",
  commune: "Commune",
  dates: "Dates",
  seeSheet: "Voir la fiche",
  bandTitle: "Un format ou une quantité particulière\u00a0?",
  bandLead: "Précisez le diamètre, la couleur ou le nombre de personnes prévu.",
  bandCta: "Décrire mon besoin",
  productIds: ["assiettes-plates-blanches", "verres-a-eau", "bols-porcelaine", "plat-service-ovale"] as const,
};

export const prdFicheCopy = {
  disclaimer: "Tarif, état et disponibilité à confirmer.",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  seeRequest: "Voir ma demande",
  crossTitle: "Vous équipez une salle de formation\u00a0?",
  crossLead: "Réunissez la vaisselle et le matériel informatique dans la même demande.",
  crossCta: "Ajouter un ordinateur",
};

export const prdDemandeCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: PRD_ROOT },
    { label: "Ma demande" },
  ],
  title: "Votre demande",
  addMore: "Ajouter un article ou décrire un article libre",
  commune: "Commune",
  period: "Période",
  contact: "Nom du contact",
  contactPh: "Nom et prénom",
  phone: "Téléphone",
  phonePh: "Numéro de rappel",
  projectTitle: "Votre projet",
  intentLocation: "Location",
  intentPurchase: "Achat",
  intentStudy: "Projet à étudier",
  partnersNote: "ONLOUTOU confirme les articles, les tarifs et les modalités avec ses partenaires.",
  submit: "Envoyer ma demande",
  remiseLink: "Comment récupérer les articles\u00a0?",
};

export const prdSurMesureCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: PRD_ROOT },
    { label: "Demande sur mesure" },
  ],
  title: "Quel article recherchez-vous\u00a0?",
  lead: "Indiquez son nom ou décrivez son usage. Une photo peut aider le partenaire à l’identifier.",
  article: "Article recherché",
  quantity: "Quantité",
  details: "Précisions utiles (facultatif)",
  photo: "Photo ou référence (facultatif)",
  photoCta: "Joindre une photo",
  add: "Ajouter à ma demande",
  continue: "Continuer ma recherche",
  sideTitle: "Votre demande en cours",
  customKindLabel: "article décrit par le client",
};

export const prdRemiseCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: PRD_ROOT },
    { label: "Ma demande", href: PRD_DEMANDE_PATH },
    { label: "Remise du matériel" },
  ],
  title: "Comment récupérer les articles\u00a0?",
  lead: "Ces préférences permettent aux partenaires de chiffrer le transport avec le matériel.",
  modeDelivery: "Livraison",
  modePickup: "Retrait chez le partenaire",
  modeLater: "À convenir",
  place: "Lieu de livraison et de reprise",
  deliveryAt: "Livraison souhaitée",
  pickupAt: "Reprise souhaitée",
  access: "Précisions d’accès (facultatif)",
  back: "Retour à ma demande",
  save: "Enregistrer mes préférences",
  feesTitle: "Qui confirme les frais et les horaires\u00a0?",
  feesLead: "ONLOUTOU les précise dans la proposition que vous recevez avant de vous engager.",
};

export const prdConfirmationCopy = {
  crumb: [
    { label: "Accueil", href: "/" },
    { label: "Produits", href: PRD_ROOT },
    { label: "Confirmation" },
  ],
  title: "Demande enregistrée",
  demoLabel: "Référence de démonstration",
  apiLabel: "Votre référence",
  lead: "Un conseiller vérifie les disponibilités auprès des partenaires puis vous transmet une proposition.",
  back: "Revenir aux produits",
  recapTitle: "Le récapitulatif de votre demande",
  recapPlace: "Lieu et dates",
  recapVaisselle: "Vaisselle",
  recapInfo: "Informatique",
  recapCustom: "Article décrit",
  partnerAsk: "Vous proposez du matériel à louer\u00a0?",
  partnerCta: "Devenir partenaire",
  partnerHref: "/devenir-partenaire",
};

export function catalogById(id: string) {
  return prdCatalog.find((item) => item.id === id);
}
