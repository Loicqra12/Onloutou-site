import { site } from "@/content/site";
import { siteMedia } from "@/content/media";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export const equipmentHubSeo = {
  title: "Véhicules, matériels et équipements professionnels",
  description:
    "Découvrez les familles de véhicules, matériels et équipements professionnels qu’ONLOUTOU peut étudier en location ou en acquisition selon votre besoin.",
};

export const equipmentHubPositioning =
  "ONLOUTOU accompagne les besoins en véhicules, matériels et équipements professionnels, en location ou en acquisition, selon l’usage, la zone, les caractéristiques recherchées et la disponibilité.";

export const equipmentRepresentativeDisclaimer =
  "Modèles et disponibilités à confirmer.";

export type EquipmentFamilyId =
  | "vehicules"
  | "motos"
  | "camions"
  | "outils"
  | "connectes";

export const equipmentHubMedia = {
  heroMenu: {
    src: "/assets/images/menu/mega-menu-equipements-onloutou.png",
    alt: "Technicien contrôlant un groupe électrogène, avec un utilitaire et une moto en arrière-plan",
    width: 1586,
    height: 992,
    objectPosition: "82% 68%",
  },
  warehouse: {
    src: "/assets/images/projects/project-a/gestion-equipements-entrepot.png",
    alt: "Opératrice scannant des équipements dans un entrepôt",
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
  mobility: {
    src: "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
    alt: "Utilitaire, berline et scooter présentés dans une cour logistique",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  traceur: siteMedia.solutions.installationTraceur,
};

export const equipmentHubHero = {
  eyebrow: "VÉHICULES · MATÉRIELS · ÉQUIPEMENTS",
  titleBefore: "Des équipements pensés pour ",
  titleHighlight: "la réalité de vos opérations.",
  intro:
    "Explorez les familles de véhicules, de matériels et d’équipements pouvant être étudiées en location ou en acquisition selon votre besoin.",
  caveat: "Les catégories, références, quantités et disponibilités sont confirmées après qualification.",
  primaryCta: { label: "Explorer les familles", href: "#univers-equipements" },
  secondaryCta: { label: "Présenter mon besoin", href: "#orientation-equipement" },
};

export const equipmentOrientationBand = [
  "Choisir une famille",
  "Préciser l’usage",
  "Comparer louer et acheter",
  "Confirmer la disponibilité",
  "Définir les services associés",
] as const;

export const equipmentHubUniverse = {
  id: "univers-equipements",
  title: "Plusieurs familles, un point de départ : l’usage.",
  families: [
    {
      id: "vehicules" as EquipmentFamilyId,
      anchor: "famille-vehicules",
      number: "01",
      title: "Véhicules professionnels",
      usages: [
        "Mobilité d’équipe",
        "Intervention terrain",
        "Transport léger",
        "Mission professionnelle",
        "Besoin ponctuel ou durable",
      ],
      visual: "image" as const,
      imageKey: "mobility" as const,
      disclaimer: equipmentRepresentativeDisclaimer,
      links: [
        { label: "Définir mon besoin véhicule", href: "/equipements/vehicules" },
        { label: "Découvrir la location", href: "/solutions/location" },
        { label: "Étudier une acquisition", href: "/solutions/vente" },
      ],
    },
    {
      id: "motos" as EquipmentFamilyId,
      anchor: "famille-motos",
      number: "02",
      title: "Motos et mobilité légère",
      usages: ["Déplacement urbain", "Activité de proximité", "Livraison", "Opération terrain"],
      visual: "typographic" as const,
      note: "Catégorie étudiée selon la demande — références et disponibilités à confirmer.",
      links: [
        { label: "Définir mon besoin moto", href: "/equipements/motos" },
        { label: "Découvrir la location", href: "/solutions/location" },
        { label: "Étudier une acquisition", href: "/solutions/vente" },
      ],
    },
    {
      id: "camions" as EquipmentFamilyId,
      anchor: "famille-camions-engins",
      number: "03",
      title: "Camions et engins",
      usages: ["Transport", "Logistique", "Manutention", "Chantier", "Opération spécialisée"],
      visual: "typographic" as const,
      note:
        "Catégorie étudiée selon le projet, la zone, les caractéristiques et la disponibilité.",
      links: [
        { label: "Définir mon besoin camion ou engin", href: "/equipements/camions-engins" },
        { label: "Découvrir la location", href: "/solutions/location" },
        { label: "Étudier une acquisition", href: "/solutions/vente" },
      ],
    },
    {
      id: "outils" as EquipmentFamilyId,
      anchor: "famille-outils-materiels",
      number: "04",
      title: "Outils et matériels",
      usages: ["Intervention technique", "Chantier", "Énergie", "Maintenance", "Opération temporaire"],
      visual: "image" as const,
      imageKey: "generator" as const,
      disclaimer: equipmentRepresentativeDisclaimer,
      links: [
        { label: "Définir mon besoin matériel", href: "/equipements/outils-materiels" },
        { label: "Découvrir la location", href: "/solutions/location" },
        { label: "Étudier une acquisition", href: "/solutions/vente" },
      ],
    },
    {
      id: "connectes" as EquipmentFamilyId,
      anchor: "famille-equipements-connectes",
      number: "05",
      title: "Équipements connectés",
      usages: ["Localisation", "Supervision", "Sécurisation", "Alertes", "Suivi d’actifs"],
      visual: "image" as const,
      imageKey: "traceur" as const,
      disclaimer: equipmentRepresentativeDisclaimer,
      links: [
        { label: "Qualifier un équipement connecté", href: "/equipements/equipements-connectes" },
        { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
        { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
      ],
    },
  ],
};

export const equipmentRentOrBuy = {
  title: "Deux manières de répondre au besoin.",
  rent: {
    title: "Louer",
    lead: "Pour un besoin ponctuel, une mission, un renfort temporaire ou une période à définir.",
    points: [
      "Durée à préciser",
      "Disponibilité à confirmer",
      "Conditions selon le matériel",
      "Services associés à étudier",
    ],
    cta: { label: "Explorer la location", href: "/solutions/location" },
  },
  buy: {
    title: "Acheter",
    lead: "Pour un usage durable, un besoin récurrent ou un équipement destiné à intégrer vos opérations.",
    points: [
      "Caractéristiques à définir",
      "Compatibilité à vérifier",
      "Référence à confirmer",
      "Accompagnement à préciser",
    ],
    cta: { label: "Explorer l’acquisition", href: "/solutions/vente" },
  },
};

export const equipmentTerrain = {
  title: "Le terrain détermine les bons critères.",
  note: "Les caractéristiques définitives doivent être validées avant toute proposition.",
  groups: [
    {
      title: "Usage et contexte",
      items: ["Usage", "Environnement", "Zone", "Utilisateurs"],
    },
    {
      title: "Contraintes matérielles",
      items: ["Charge ou capacité recherchée", "Mobilité", "Alimentation", "Fréquence d’utilisation"],
    },
    {
      title: "Services",
      items: ["Installation", "Maintenance", "Suivi éventuel"],
    },
  ],
};

export const equipmentConnected = {
  title: "Quand l’équipement devient visible dans vos opérations.",
  lead:
    "Certains véhicules, matériels ou actifs peuvent être associés à un dispositif de géolocalisation ou de supervision lorsque la compatibilité et les conditions techniques le permettent.",
  flow: ["Équipement", "Dispositif", "Connectivité", "Plateforme", "Équipe"],
  considerations: [
    "Compatibilité à vérifier",
    "Source d’alimentation",
    "Réseau",
    "Données disponibles",
    "Droits d’accès",
    "Fonctionnalités configurées",
  ],
  links: [
    { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
};

export const equipmentProcess = {
  title: "Qualifier avant de proposer.",
  steps: [
    { title: "Identifier", description: "Définir la famille et l’usage." },
    { title: "Préciser", description: "Indiquer la quantité, le lieu, la durée ou l’objectif d’acquisition." },
    { title: "Vérifier", description: "Étudier les contraintes, la compatibilité et la disponibilité." },
    { title: "Orienter", description: "Comparer location, acquisition ou combinaison de services." },
    { title: "Proposer", description: "Présenter le périmètre et les conditions applicables." },
    { title: "Confirmer", description: "Valider la référence, les modalités et les services prévus." },
  ],
};

export const equipmentOrientationOptions = {
  families: [
    { id: "vehicle", label: "véhicule" },
    { id: "moto", label: "moto" },
    { id: "truck", label: "camion ou engin" },
    { id: "tool", label: "outil ou matériel" },
    { id: "connected", label: "équipement connecté" },
    { id: "other", label: "autre" },
  ],
  modes: [
    { id: "rent", label: "louer" },
    { id: "buy", label: "acheter" },
    { id: "compare", label: "comparer les deux" },
    { id: "unknown", label: "je ne sais pas encore" },
  ],
  usages: [
    { id: "mobility", label: "mobilité" },
    { id: "transport", label: "transport" },
    { id: "delivery", label: "livraison" },
    { id: "site", label: "chantier" },
    { id: "intervention", label: "intervention" },
    { id: "energy", label: "énergie" },
    { id: "geo", label: "géolocalisation" },
    { id: "supervision", label: "supervision" },
    { id: "other", label: "autre" },
  ],
  quantities: [
    { id: "one", label: "une unité" },
    { id: "few", label: "deux à cinq" },
    { id: "many", label: "plus de cinq" },
    { id: "tbd", label: "quantité à définir" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "autre ville de Côte d’Ivoire" },
    { id: "other", label: "autre zone à préciser" },
  ],
  support: [
    { id: "supply", label: "fourniture uniquement" },
    { id: "delivery", label: "livraison à étudier" },
    { id: "install", label: "installation à étudier" },
    { id: "config", label: "configuration à étudier" },
    { id: "supervision", label: "supervision à étudier" },
    { id: "tbd", label: "besoin à préciser" },
  ],
};

export function buildEquipmentOrientationSummary(s: {
  quantityLabel: string;
  familyLabel: string;
  usageLabel: string;
  zoneLabel: string;
  modeLabel: string;
  supportLabel: string;
}) {
  return `Je recherche ${s.quantityLabel} de type ${s.familyLabel} pour ${s.usageLabel}, dans la zone ${s.zoneLabel}. Je souhaite ${s.modeLabel}, avec ${s.supportLabel}.`;
}

export function buildEquipmentWhatsAppUrl(s: Parameters<typeof buildEquipmentOrientationSummary>[0]) {
  const summary = buildEquipmentOrientationSummary(s);
  return whatsappUrlForMessage(`Bonjour ONLOUTOU, ${summary} Pouvez-vous m’orienter ?`);
}

export const equipmentTransparency = {
  title: "Ce qui doit être confirmé avant toute opération.",
  items: [
    "Famille",
    "Référence",
    "Caractéristiques",
    "Quantité",
    "Disponibilité",
    "Prix",
    "Durée si location",
    "Délai",
    "Zone",
    "Livraison",
    "Installation",
    "Garantie applicable",
    "Entretien ou maintenance",
    "Restitution si location",
    "Supervision éventuelle",
  ],
  note: "Les éléments confirmés figurent dans la proposition ou le contrat applicable.",
};

export const equipmentHubFaq: ServiceFaqItem[] = [
  {
    question: "Les images correspondent-elles à des produits disponibles ?",
    answer:
      "Non. Elles représentent des familles de besoins. Les références et disponibilités sont confirmées après étude.",
  },
  {
    question: "Peut-on louer et acheter les mêmes catégories ?",
    answer:
      "Certaines catégories peuvent être étudiées en location ou en acquisition. Les possibilités dépendent du matériel, du contexte et de la disponibilité.",
  },
  {
    question: "Comment choisir entre location et achat ?",
    answer:
      "Le choix dépend notamment de la durée, de la fréquence d’utilisation, du budget, des contraintes opérationnelles et des services recherchés.",
  },
  {
    question: "Peut-on demander plusieurs types d’équipements ?",
    answer:
      "Oui. Une demande peut réunir plusieurs catégories, à condition de préciser les usages et les quantités.",
  },
  {
    question: "La livraison est-elle comprise ?",
    answer:
      "La livraison ou la récupération dépend de la zone, du matériel et des conditions précisées dans la proposition.",
  },
  {
    question: "ONLOUTOU peut-il installer un équipement connecté ?",
    answer:
      "L’installation et le paramétrage peuvent être étudiés lorsque le dispositif, le véhicule ou l’actif sont compatibles.",
  },
  {
    question: "Peut-on demander un équipement qui n’est pas présenté ?",
    answer:
      "Oui. Le visiteur peut décrire un autre besoin afin qu’il soit qualifié, sans garantie automatique de disponibilité.",
  },
];

export const equipmentEditorialNotice =
  "Cette page présente des familles de besoins et ne constitue pas un catalogue de stock. Les références, modèles, caractéristiques, quantités, prix, délais, garanties et disponibilités sont confirmés uniquement après qualification.";

export const equipmentFinalCta = {
  titleBefore: "Partons de ",
  titleHighlight: "votre besoin",
  titleAfter: ", pas d’un catalogue générique.",
  lead:
    "Indiquez l’usage, la famille, la quantité, la zone et le mode envisagé. ONLOUTOU pourra mieux orienter la demande.",
  primary: { label: "Orienter ma demande", href: "#orientation-equipement" },
  secondary: { label: "Parler à ONLOUTOU", href: "/contact" },
};

export const equipmentBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements" },
];

export function equipmentBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Équipements", item: `${baseUrl}/equipements` },
    ],
  };
}

export function equipmentCollectionJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: equipmentHubSeo.title,
    description: equipmentHubSeo.description,
    url: `${baseUrl}/equipements`,
    isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  };
}
