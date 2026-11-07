import { site } from "@/content/site";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export const salesSeo = {
  title: "Vente de véhicules et équipements professionnels",
  description:
    "ONLOUTOU accompagne la qualification et l’acquisition de véhicules, matériels et équipements professionnels selon l’usage, la compatibilité et la disponibilité.",
};

export const salesPositioning =
  "ONLOUTOU accompagne la recherche et l’acquisition de véhicules, de matériels et d’équipements professionnels selon l’usage, les caractéristiques recherchées, la disponibilité et le périmètre du projet.";

export type SalesMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export const salesMedia = {
  hero: {
    src: "/assets/images/projects/project-b/inspection-groupe-electrogene.png",
    alt: "Technicien examinant un groupe électrogène pendant qu’une collègue note les points de contrôle",
    width: 1536,
    height: 1024,
    objectPosition: "50% 46%",
  },
  warehouse: {
    src: "/assets/images/projects/project-a/gestion-equipements-entrepot.png",
    alt: "Équipements professionnels organisés dans un entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  generator: {
    src: "/assets/images/projects/project-b/inspection-groupe-electrogene.png",
    alt: "Technicien inspectant un groupe électrogène",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
  },
  traceur: {
    src: "/assets/images/solutions/installation-traceur-gps-onloutou.png",
    alt: "Technicien installant un traceur GPS dans un véhicule",
    width: 1536,
    height: 1024,
    objectPosition: "55% 42%",
  },
  mobility: {
    src: "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
    alt: "Véhicules professionnels dans une cour logistique",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  fleet: {
    src: "/assets/images/equipment/vehicles/Flotte professionnelle inspectée à Abidjan-2.png",
    alt: "Berline, SUV et utilitaire présentés dans une cour professionnelle à Abidjan",
    width: 1672,
    height: 941,
    objectPosition: "52% 48%",
  },
  motorcycles: {
    src: "/assets/images/equipment/motorcycles/Motos professionnelles dans une cour d’Abidjan-2.png",
    alt: "Trois motos professionnelles présentées dans une cour à Abidjan",
    width: 1672,
    height: 941,
    objectPosition: "50% 46%",
  },
  trucks: {
    src: "/assets/images/equipment/camions/Camions et engins sur site à Abidjan-1.png",
    alt: "Camion-benne, camion porteur et engin de chantier dans une cour technique",
    width: 1672,
    height: 941,
    objectPosition: "50% 48%",
  },
  connectedInstall: {
    src: "/assets/images/projects/project-a/installation-gps-embarque.png",
    alt: "Technicien installant un dispositif GPS embarqué dans un véhicule",
    width: 1536,
    height: 1024,
    objectPosition: "62% 48%",
  },
  team: {
    src: "/assets/images/home/equipment/equipe-onloutou-inspection-equipements.png",
    alt: "Équipe ONLOUTOU inspectant des équipements professionnels",
    width: 1448,
    height: 1086,
    objectPosition: "center 42%",
  },
};

export const imageCategoryDisclaimer =
  "Modèle et disponibilité à confirmer.";

export const salesHero = {
  eyebrow: "SOLUTION · VENTE D’ÉQUIPEMENTS",
  titleBefore: "Acheter un équipement ",
  titleHighlight: "adapté à votre usage",
  intro:
    "ONLOUTOU accompagne la qualification, la recherche et la proposition de véhicules, de matériels et d’équipements professionnels adaptés au contexte du projet.",
  caveat: "Les références, caractéristiques, prix et disponibilités sont confirmés après étude.",
  primaryCta: { label: "Décrire mon besoin d’achat", href: "#demande-equipement" },
  secondaryCta: { label: "Voir les trois questions à se poser", href: "#conseil-achat" },
};

export const salesSelectionBand = [
  "Usage",
  "Environnement",
  "Compatibilité",
  "Quantité",
  "Accompagnement",
] as const;

export type SalesFamilyId = "vehicules" | "motos" | "camions" | "outils" | "connecte";

export const salesFamilies = {
  id: "familles-equipements",
  title: "Partir du besoin, pas seulement du produit.",
  titleHighlight: "du produit.",
  heavyNote: "Les catégories lourdes sont étudiées selon le projet et la disponibilité.",
  items: [
    {
      id: "vehicules" as SalesFamilyId,
      title: "Véhicules professionnels",
      examples: ["Mobilité d’équipe", "Intervention terrain", "Transport léger", "Besoins opérationnels"],
      image: salesMedia.fleet,
    },
    {
      id: "motos" as SalesFamilyId,
      title: "Motos et mobilité légère",
      examples: ["Déplacement urbain", "Activité de proximité", "Livraison", "Missions terrain"],
      image: salesMedia.motorcycles,
    },
    {
      id: "camions" as SalesFamilyId,
      title: "Camions et engins",
      examples: ["Transport", "Logistique", "Chantier", "Opérations spécialisées"],
      image: salesMedia.trucks,
    },
    {
      id: "outils" as SalesFamilyId,
      title: "Outils et matériels",
      examples: [
        "Équipements techniques",
        "Matériels de chantier",
        "Groupes électrogènes",
        "Outillage professionnel",
      ],
      image: salesMedia.generator,
    },
    {
      id: "connecte" as SalesFamilyId,
      title: "Équipements connectés",
      examples: ["Traceurs GPS", "Balises", "Accessoires compatibles", "Dispositifs pour la supervision"],
      image: salesMedia.connectedInstall,
    },
  ],
};

export const salesBuyRentComparison = {
  title: "Acheter ou louer : partir de l’usage.",
  titleHighlight: "l’usage.",
  rows: [
    {
      criterion: "Nature du besoin",
      buy: "Usage durable ou récurrent",
      rent: "Besoin temporaire ou à tester",
    },
    {
      criterion: "Investissement",
      buy: "Décision d’acquisition à étudier",
      rent: "Engagement lié à la durée",
    },
    {
      criterion: "Disponibilité",
      buy: "Référence et délai à confirmer",
      rent: "Matériel et période à confirmer",
    },
    {
      criterion: "Évolution",
      buy: "Dépend du produit choisi",
      rent: "Peut varier selon la solution proposée",
    },
    {
      criterion: "Accompagnement",
      buy: "Installation ou prise en main à préciser",
      rent: "Mise à disposition et services à préciser",
    },
  ],
};

export const salesEnvironment = {
  title: "Un équipement pertinent doit répondre à son environnement.",
  titleHighlight: "son environnement.",
  criteria: [
    "Usage principal",
    "Fréquence d’utilisation",
    "Conditions du terrain",
    "Alimentation disponible",
    "Mobilité",
    "Contraintes d’installation",
    "Besoins de suivi",
    "Maintenance et pièces",
    "Compétences des utilisateurs",
  ],
  groups: [
    {
      title: "Usage et fréquence",
      items: ["Usage principal", "Fréquence d’utilisation", "Compétences des utilisateurs"],
    },
    {
      title: "Terrain et mobilité",
      items: ["Conditions du terrain", "Mobilité"],
    },
    {
      title: "Compatibilité et installation",
      items: ["Alimentation disponible", "Contraintes d’installation"],
    },
    {
      title: "Suivi et entretien",
      items: ["Besoins de suivi", "Maintenance et pièces"],
    },
  ],
  caption: "Organisation et préparation des équipements",
};

export const salesConnected = {
  title: "Équiper, connecter et superviser.",
  titleHighlight: "superviser.",
  lead:
    "Lorsqu’un besoin implique la géolocalisation ou le suivi d’un actif, le choix du dispositif doit être étudié avec son installation, son alimentation, sa connectivité et les données attendues.",
  points: [
    "Compatibilité du véhicule ou de l’actif",
    "Source d’alimentation",
    "Réseau et transmission",
    "Plateforme et fonctionnalités",
  ],
  links: [
    { label: "Géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
};

export const salesProcess = {
  title: "De l’usage à la proposition.",
  titleHighlight: "la proposition.",
  steps: [
    { title: "Comprendre", description: "Clarifier l’activité, l’usage et le contexte." },
    { title: "Spécifier", description: "Identifier les caractéristiques essentielles." },
    {
      title: "Vérifier",
      description: "Étudier la compatibilité, les contraintes et la disponibilité.",
    },
    { title: "Comparer", description: "Examiner la solution proposée et ses conditions." },
    { title: "Valider", description: "Confirmer la référence, le prix, le délai et le périmètre." },
    {
      title: "Accompagner",
      description:
        "Préciser la livraison, l’installation, la prise en main ou le suivi lorsqu’ils sont prévus.",
    },
  ],
};

export const salesServices = {
  title: "Services pouvant accompagner l’équipement",
  titleHighlight: "l’équipement",
  items: [
    "Conseil et qualification",
    "Recherche de solution",
    "Installation selon le matériel",
    "Paramétrage",
    "Tests",
    "Prise en main",
    "Géolocalisation",
    "Supervision",
    "Intégration étudiée",
    "Accompagnement projet",
  ],
  groups: [
    {
      title: "Avant le choix",
      items: ["Conseil et qualification", "Recherche de solution"],
    },
    {
      title: "À la mise en service",
      items: ["Installation selon le matériel", "Paramétrage", "Tests", "Prise en main"],
    },
    {
      title: "Dans l’exploitation",
      items: ["Géolocalisation", "Supervision", "Intégration étudiée", "Accompagnement projet"],
    },
  ],
  note: "Les services applicables sont précisés dans chaque proposition.",
};

export const salesRequestOptions = {
  families: [
    { id: "vehicule", label: "véhicule" },
    { id: "moto", label: "moto" },
    { id: "camion", label: "camion ou engin" },
    { id: "outil", label: "outil ou matériel" },
    { id: "connecte", label: "équipement connecté" },
    { id: "autre", label: "autre" },
  ],
  usages: [
    { id: "mobilite", label: "mobilité" },
    { id: "transport", label: "transport" },
    { id: "livraison", label: "livraison" },
    { id: "chantier", label: "chantier" },
    { id: "technique", label: "intervention technique" },
    { id: "suivi", label: "sécurisation ou suivi" },
    { id: "autre", label: "autre usage" },
  ],
  quantities: [
    { id: "one", label: "une unité" },
    { id: "few", label: "deux à cinq" },
    { id: "many", label: "plus de cinq" },
    { id: "tbd", label: "quantité à définir" },
  ],
  support: [
    { id: "fourniture", label: "fourniture uniquement" },
    { id: "livraison", label: "livraison à étudier" },
    { id: "installation", label: "installation à étudier" },
    { id: "config", label: "configuration à étudier" },
    { id: "supervision", label: "supervision à étudier" },
    { id: "preciser", label: "besoin à préciser" },
  ],
  timelines: [
    { id: "soon", label: "besoin prochainement" },
    { id: "planned", label: "projet planifié" },
    { id: "tbd", label: "calendrier à définir" },
  ],
};

export function buildSalesRequestSummary(selection: {
  quantityLabel: string;
  familyLabel: string;
  usageLabel: string;
  supportLabel: string;
  timelineLabel: string;
}) {
  return `Je recherche ${selection.quantityLabel} dans la catégorie ${selection.familyLabel}, pour ${selection.usageLabel}, avec ${selection.supportLabel}. Échéance : ${selection.timelineLabel}.`;
}

export function buildSalesWhatsAppUrl(selection: {
  quantityLabel: string;
  familyLabel: string;
  usageLabel: string;
  supportLabel: string;
  timelineLabel: string;
}) {
  const summary = buildSalesRequestSummary(selection);
  const message = `Bonjour ONLOUTOU, ${summary} Pouvez-vous m’orienter pour une étude d’acquisition ?`;
  return whatsappUrlForMessage(message);
}

export const salesConfirmation = {
  title: "Ce qui doit être confirmé",
  titleHighlight: "confirmé",
  items: [
    "Référence ou catégorie",
    "Caractéristiques",
    "Compatibilité",
    "Quantité",
    "État neuf ou autre uniquement si applicable",
    "Disponibilité",
    "Délai",
    "Prix",
    "Taxes",
    "Livraison",
    "Installation",
    "Garantie applicable",
    "Support ou maintenance éventuels",
  ],
  groups: [
    {
      title: "Le matériel",
      items: [
        "Référence ou catégorie",
        "Caractéristiques",
        "Compatibilité",
        "Quantité",
        "État neuf ou autre uniquement si applicable",
        "Disponibilité",
      ],
    },
    {
      title: "Les modalités",
      items: ["Délai", "Prix", "Taxes", "Livraison"],
    },
    {
      title: "L’accompagnement",
      items: ["Installation", "Garantie applicable", "Support ou maintenance éventuels"],
    },
  ],
  note:
    "Seuls les éléments figurant dans la proposition ou le contrat applicable sont considérés comme confirmés.",
};

export const salesFaq: ServiceFaqItem[] = [
  {
    question: "Les équipements présentés sont-ils en stock ?",
    answer:
      "Les visuels représentent des catégories de besoin. La référence et la disponibilité sont confirmées après étude.",
  },
  {
    question: "Comment obtenir un prix ?",
    answer:
      "Le prix dépend du produit, de ses caractéristiques, de la quantité, de la disponibilité, du transport et des services associés. Une proposition est préparée après qualification.",
  },
  {
    question: "ONLOUTOU vend-il des véhicules et des motos ?",
    answer:
      "Les demandes liées aux véhicules et à la mobilité peuvent être étudiées selon le besoin et les solutions disponibles.",
  },
  {
    question: "Peut-on commander plusieurs unités ?",
    answer:
      "Une demande peut porter sur plusieurs unités. La quantité doit être précisée pour vérifier la disponibilité et les conditions.",
  },
  {
    question: "L’installation est-elle comprise ?",
    answer:
      "L’installation dépend du matériel et de la proposition. Elle n’est pas considérée comme incluse tant qu’elle n’est pas confirmée.",
  },
  {
    question: "Les équipements sont-ils garantis ?",
    answer:
      "La garantie applicable dépend du produit, du fournisseur ou du constructeur et des conditions indiquées dans la proposition.",
  },
  {
    question: "Peut-on connecter l’équipement à une plateforme ONLOUTOU ?",
    answer:
      "Une solution de géolocalisation ou de supervision peut être étudiée lorsque le matériel et le besoin sont compatibles.",
  },
];

export const salesAdvice = {
  id: "conseil-achat",
  eyebrow: "Avant d’acheter",
  title: "Trois questions pour choisir le bon équipement.",
  lead:
    "Répondre à ces trois questions suffit pour démarrer : ONLOUTOU affine ensuite avec vous, sans engagement.",
  questions: [
    {
      title: "À quoi servira l’équipement ?",
      items: ["Usage principal", "Compétences des utilisateurs"],
    },
    {
      title: "À quelle fréquence sera-t-il utilisé ?",
      items: ["Fréquence d’utilisation", "Besoins de suivi", "Maintenance et pièces"],
    },
    {
      title: "Dans quelles conditions ?",
      items: ["Conditions du terrain", "Mobilité", "Alimentation disponible", "Contraintes d’installation"],
    },
  ],
  cta: { label: "Décrire mon besoin d’achat", href: "#demande-equipement" },
  rentLink: {
    lead: "Besoin temporaire ou à tester ?",
    label: "Étudier plutôt la location",
    href: "/solutions/location",
  },
};

export const salesFaqTitle = "Questions fréquentes";
export const salesFaqHighlight = "fréquentes";

export const salesRequestTitle = "Préparer ma demande d’achat";
export const salesRequestHighlight = "d’achat";

export const salesFaqAside = {
  text: salesHero.caveat,
  cta: { label: "Nous contacter", href: "/contact" },
};

export const salesEditorialNotice =
  "Les images de cette page illustrent des familles de besoins. Elles ne constituent pas un catalogue de références disponibles. Les modèles, caractéristiques, prix, quantités, délais, garanties et services sont confirmés dans une proposition dédiée.";

export const salesFinalCta = {
  titleBefore: "Définissons l’équipement qui correspond ",
  titleHighlight: "vraiment à votre projet.",
  lead:
    "Décrivez l’usage, la quantité, les contraintes et l’accompagnement recherché afin de préparer une réponse plus pertinente.",
  primary: { label: "Décrire mon besoin d’achat", href: "#demande-equipement" },
  phoneLabel: "Appeler ONLOUTOU",
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
  image: salesMedia.team,
};

export const salesBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Vente d’équipements" },
];

export function salesBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${baseUrl}/solutions` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Vente d’équipements",
        item: `${baseUrl}/solutions/vente`,
      },
    ],
  };
}

export function salesServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vente de véhicules et équipements professionnels",
    provider: { "@type": "Organization", name: site.name },
    areaServed: "Côte d’Ivoire",
    url: `${baseUrl}/solutions/vente`,
    description: salesSeo.description,
  };
}
