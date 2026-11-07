import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

/** Images déposées sous equipment/camions (dossier trucks-machinery non présent). */
const imageBase = "/assets/images/equipment/camions";

export const trucksMachineryPageSeo = {
  title: "Camions et engins professionnels en location ou acquisition",
  description:
    "ONLOUTOU étudie les besoins en camions, engins de chantier et équipements lourds selon la mission, le terrain, la durée, la zone et la disponibilité.",
};

export const trucksMachineryPositioning =
  "ONLOUTOU étudie les besoins en camions et engins professionnels selon la mission, le terrain, la quantité, la durée, la zone, les caractéristiques recherchées et la disponibilité.";

export const trucksMachineryQualificationNotice =
  "Les catégories, capacités, modèles, conditions, opérateurs éventuels et disponibilités sont confirmés après qualification.";

export const trucksMachineryRepresentativeCaption =
  "Modèle, capacité et disponibilité à confirmer.";

export const trucksMachineryHeroCaption =
  "Plusieurs catégories de camions et d’engins. Modèle et disponibilité à confirmer.";

export const trucksMachineryMedia = {
  fleetHero: {
    src: `${imageBase}/Camions et engins sur site à Abidjan-1.png`,
    alt: "Camion-benne, camion porteur et engin de chantier dans une cour technique",
    width: 1672,
    height: 941,
    objectPosition: "50% 48%",
  },
  logisticsDepot: {
    src: `${imageBase}/Camion de fret au dépôt d’Abidjan-2.png`,
    alt: "Agents préparant le chargement d’un camion dans un dépôt à Abidjan",
    width: 1586,
    height: 992,
    objectPosition: "52% 40%",
  },
  siteOperations: {
    src: `${imageBase}/Chantier ivoirien sécurisé avec excavatrice-3.png`,
    alt: "Engin utilisé sur un chantier organisé avec personnel équipé",
    width: 1586,
    height: 992,
    objectPosition: "54% 42%",
  },
  safetyInspection: {
    src: `${imageBase}/Inspection de sécurité d’un camion immobilisé-4.png`,
    alt: "Technicien inspectant un camion immobilisé avant son utilisation",
    width: 1586,
    height: 992,
    objectPosition: "56% 38%",
  },
};

export const trucksMachineryBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements", href: "/equipements" },
  { label: "Camions et engins" },
];

export const trucksMachineryHero = {
  eyebrow: "ÉQUIPEMENTS · CAMIONS ET ENGINS",
  titleBefore: "Des moyens lourds à choisir selon ",
  titleHighlight: "la mission et le terrain.",
  intro:
    "ONLOUTOU étudie les besoins en camions et engins professionnels pour des opérations logistiques, des chantiers et des projets nécessitant des moyens spécialisés.",
  caveat: "Chaque catégorie, capacité, condition d’exploitation et disponibilité doit être confirmée après étude.",
  primaryCta: { label: "Définir mon besoin", href: "#demande-camion-engin" },
  secondaryCta: { label: "Explorer les catégories", href: "#profils-camions-engins" },
};

export const trucksMachineryQualificationBand = {
  lead: "Un équipement lourd ne peut pas être choisi correctement sans comprendre l’opération complète.",
  items: ["mission", "charge", "terrain", "durée", "zone", "conditions d’exploitation"] as const,
};

export type HeavyEquipmentProfileId = "porteur" | "benne" | "pelle" | "chargeuse";

export const trucksMachineryProfiles = {
  id: "profils-camions-engins",
  title: "Transporter, déplacer ou intervenir : des besoins différents.",
  items: [
    {
      id: "porteur" as HeavyEquipmentProfileId,
      number: "01",
      title: "Camion porteur ou logistique",
      visual: "schema" as const,
      schemaLabel: "Repère logistique — charge et accès",
      usages: [
        "transport de matériel",
        "approvisionnement",
        "livraison professionnelle",
        "déplacement entre plusieurs sites",
        "opération logistique",
      ],
      criteria: [
        "nature de la charge",
        "volume",
        "accès",
        "distances",
        "fréquence",
        "conditions de chargement et de déchargement",
      ],
    },
    {
      id: "benne" as HeavyEquipmentProfileId,
      number: "02",
      title: "Camion-benne",
      visual: "schema" as const,
      schemaLabel: "Repère matériaux — site et évacuation",
      usages: [
        "transport de matériaux",
        "évacuation",
        "approvisionnement de chantier",
        "opération nécessitant une benne",
      ],
      criteria: [
        "nature des matériaux",
        "conditions d’accès",
        "zone",
        "chargement",
        "déchargement",
        "contraintes du site",
      ],
    },
    {
      id: "pelle" as HeavyEquipmentProfileId,
      number: "03",
      title: "Pelle mécanique",
      visual: "schema" as const,
      schemaLabel: "Repère terrain — sol et espace",
      usages: [
        "terrassement",
        "préparation de terrain",
        "fouille",
        "déplacement de matériaux",
        "intervention spécialisée",
      ],
      criteria: [
        "nature du sol",
        "espace disponible",
        "profondeur ou portée à définir",
        "accès",
        "environnement",
        "autorisations et sécurité applicables",
      ],
    },
    {
      id: "chargeuse" as HeavyEquipmentProfileId,
      number: "04",
      title: "Chargeuse ou engin de manutention",
      visual: "schema" as const,
      schemaLabel: "Repère manutention — circulation et matière",
      usages: [
        "déplacement de matériaux",
        "chargement",
        "organisation d’un site",
        "opération industrielle ou logistique",
      ],
      criteria: ["matière", "volume", "espace", "sol", "circulation", "interaction avec les autres équipements"],
    },
  ],
};

export const trucksMachineryLogisticsStory = {
  title: "Une opération de transport commence avant le départ.",
  lead:
    "Le véhicule doit être étudié avec la charge, les accès, les étapes de manutention, la zone et les responsabilités prévues.",
  steps: [
    "définir la charge",
    "vérifier les accès",
    "préparer le chargement",
    "organiser la circulation",
    "confirmer le déchargement",
    "préciser les responsabilités",
  ],
  disclaimer:
    "Illustration d’une opération logistique — les conditions réelles sont définies pour chaque mission.",
};

export const trucksMachinerySiteTerrain = {
  title: "Le terrain détermine l’équipement et les conditions d’intervention.",
  factors: [
    "accès au site",
    "état du sol",
    "espace de manœuvre",
    "proximité des personnes",
    "environnement",
    "nature de l’opération",
    "coordination",
    "autorisations applicables",
    "opérateur",
    "calendrier",
  ],
  disclaimer:
    "La sélection d’un engin et les conditions d’intervention doivent être validées par les parties compétentes pour le projet.",
};

export const trucksMachinerySafety = {
  title: "Préparer l’équipement avant son utilisation.",
  disclaimer:
    "Cette liste est indicative. Elle ne remplace pas les contrôles du constructeur, du propriétaire, du technicien qualifié ou les obligations applicables.",
  checkpoints: [
    "état visuel",
    "pneus ou éléments de roulement",
    "éclairage et signalisation",
    "niveaux ou éléments accessibles selon le matériel",
    "flexibles visibles",
    "dispositifs de sécurité",
    "accès à la cabine",
    "documentation applicable",
    "signalement d’une anomalie",
    "immobilisation avant contrôle",
  ],
};

export const trucksMachineryRentOrBuy = {
  title: "Choisir le mode en fonction du projet.",
  rent: {
    title: "Louer",
    lead:
      "La location peut être étudiée pour un chantier, une opération ponctuelle, un renfort temporaire ou une période définie.",
    points: ["durée", "catégorie", "zone", "mobilisation", "disponibilité", "restitution", "responsabilités"],
    cta: { label: "Explorer la location", href: "/solutions/location" },
  },
  buy: {
    title: "Acheter",
    lead:
      "L’acquisition peut être étudiée pour un besoin durable, un usage récurrent ou l’intégration d’un équipement dans un parc.",
    points: ["caractéristiques", "capacité recherchée", "référence", "délai", "état applicable", "accompagnement"],
    cta: { label: "Explorer l’acquisition", href: "/solutions/vente" },
  },
};

export const trucksMachineryConnected = {
  title: "Rendre les actifs plus visibles dans les opérations.",
  lead:
    "Une solution de géolocalisation ou de supervision peut être étudiée pour certains camions et engins lorsque le dispositif, l’alimentation, la connectivité et l’environnement sont compatibles.",
  flow: ["Camion ou engin", "Dispositif", "Transmission", "Plateforme", "Équipe"],
  considerations: [
    "compatibilité",
    "alimentation",
    "emplacement",
    "environnement",
    "réseau",
    "informations disponibles",
    "alertes configurables",
    "droits d’accès",
  ],
  links: [
    { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
};

export const trucksMachineryQualificationMatrix = {
  title: "Les informations nécessaires avant toute proposition.",
  groups: [
    {
      title: "Opération",
      items: ["transport", "chantier", "manutention", "approvisionnement", "évacuation", "autre mission"],
    },
    {
      title: "Charge ou matériau",
      items: [
        "nature",
        "volume à préciser",
        "poids à vérifier",
        "contraintes particulières",
        "chargement",
        "déchargement",
      ],
    },
    {
      title: "Terrain",
      items: ["accès", "sol", "pente éventuelle", "espace", "circulation", "environnement"],
    },
    {
      title: "Organisation",
      items: ["zone", "calendrier", "durée", "fréquence", "quantité", "coordination"],
    },
    {
      title: "Services",
      items: [
        "livraison",
        "opérateur éventuel",
        "géolocalisation",
        "supervision",
        "installation",
        "accompagnement",
      ],
    },
  ],
};

export const trucksMachineryProcess = {
  title: "De l’opération à l’équipement confirmé.",
  steps: [
    { title: "Décrire", description: "Clarifier la mission, le site et le calendrier." },
    { title: "Qualifier", description: "Définir la charge, le terrain et les contraintes." },
    { title: "Sélectionner", description: "Identifier une catégorie compatible à étudier." },
    { title: "Vérifier", description: "Examiner la disponibilité, les conditions et les responsabilités." },
    { title: "Proposer", description: "Présenter le périmètre, les services et les modalités." },
    { title: "Confirmer", description: "Valider la référence, la capacité, le prix et les conditions applicables." },
  ],
};

export const trucksMachineryRequestOptions = {
  universes: [
    { id: "logistics", label: "transport et logistique" },
    { id: "site", label: "chantier et terrain" },
    { id: "handling", label: "manutention" },
    { id: "multi", label: "plusieurs besoins" },
    { id: "tbd", label: "besoin à définir" },
  ],
  categories: [
    { id: "porteur", label: "camion porteur" },
    { id: "benne", label: "camion-benne" },
    { id: "pelle", label: "pelle mécanique" },
    { id: "chargeuse", label: "chargeuse" },
    { id: "other-truck", label: "autre camion" },
    { id: "other-machine", label: "autre engin" },
    { id: "tbd", label: "catégorie à définir" },
  ],
  usages: [
    { id: "transport", label: "transport de matériel" },
    { id: "supply", label: "approvisionnement" },
    { id: "evac", label: "évacuation" },
    { id: "earth", label: "terrassement" },
    { id: "load", label: "chargement" },
    { id: "move", label: "déplacement de matériaux" },
    { id: "special", label: "intervention spécialisée" },
    { id: "other", label: "autre" },
  ],
  quantities: [
    { id: "one", label: "une unité" },
    { id: "few", label: "deux à cinq" },
    { id: "many", label: "plus de cinq" },
    { id: "tbd", label: "quantité à définir" },
  ],
  modes: [
    { id: "rent", label: "louer" },
    { id: "buy", label: "acheter" },
    { id: "compare", label: "comparer" },
    { id: "tbd", label: "je ne sais pas encore" },
  ],
  durations: [
    { id: "once", label: "une intervention" },
    { id: "days", label: "quelques jours" },
    { id: "weeks", label: "plusieurs semaines" },
    { id: "recurring", label: "besoin récurrent" },
    { id: "buy", label: "acquisition durable" },
    { id: "tbd", label: "durée à définir" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "autre ville de Côte d’Ivoire" },
    { id: "multi", label: "plusieurs zones" },
    { id: "other", label: "autre zone à préciser" },
  ],
  services: [
    { id: "equipment", label: "équipement uniquement" },
    { id: "mobilization", label: "transport ou mobilisation à étudier" },
    { id: "operator", label: "opérateur à étudier" },
    { id: "geo", label: "géolocalisation à étudier" },
    { id: "fleet", label: "gestion de flotte à étudier" },
    { id: "multi", label: "plusieurs services" },
    { id: "tbd", label: "besoin à préciser" },
  ],
};

export function buildTrucksMachineryRequestSummary(s: {
  quantityLabel: string;
  categoryLabel: string;
  usageLabel: string;
  zoneLabel: string;
  universeLabel: string;
  modeLabel: string;
  durationLabel: string;
  servicesLabel: string;
  description: string;
}) {
  const base = `Je recherche ${s.quantityLabel} dans la catégorie ${s.categoryLabel} pour ${s.usageLabel}, dans la zone ${s.zoneLabel}. Univers : ${s.universeLabel}. Mode : ${s.modeLabel}. Durée : ${s.durationLabel}. Services à étudier : ${s.servicesLabel}.`;
  const trimmed = s.description.trim();
  if (!trimmed) return base;
  return `${base}\n\nPrécisions :\n${trimmed}`;
}

export function buildTrucksMachineryWhatsAppUrl(s: Parameters<typeof buildTrucksMachineryRequestSummary>[0]) {
  return whatsappUrlForMessage(
    `Bonjour ONLOUTOU, ${buildTrucksMachineryRequestSummary(s)} Pouvez-vous m’orienter sur les prochaines étapes ?`,
  );
}

export const trucksMachineryTransparency = {
  title: "Ce qui doit être confirmé",
  items: [
    "catégorie",
    "modèle ou référence",
    "capacité applicable",
    "quantité",
    "disponibilité",
    "état applicable",
    "prix",
    "taxes",
    "durée",
    "mobilisation",
    "transport",
    "carburant",
    "opérateur",
    "assurance",
    "maintenance",
    "sécurité",
    "restitution",
    "garantie",
    "géolocalisation",
    "responsabilités",
  ],
  note: "Seuls les éléments figurant dans la proposition ou le contrat applicable sont considérés comme confirmés.",
};

export const trucksMachineryFaq: ServiceFaqItem[] = [
  {
    question: "Les camions et engins présentés sont-ils disponibles ?",
    answer:
      "Les images représentent des catégories. Le modèle, la capacité et la disponibilité doivent être confirmés après étude.",
  },
  {
    question: "Peut-on louer ou acheter un équipement lourd ?",
    answer: "Les deux modes peuvent être étudiés selon la catégorie, le projet et les solutions disponibles.",
  },
  {
    question: "Comment déterminer le bon camion ou engin ?",
    answer:
      "Le choix dépend notamment de la mission, de la charge, du terrain, des accès, de la durée et des conditions d’exploitation.",
  },
  {
    question: "Un chauffeur ou un opérateur est-il inclus ?",
    answer:
      "Ce service n’est pas inclus par défaut. Il doit être étudié et confirmé explicitement dans la proposition lorsque applicable.",
  },
  {
    question: "Le transport de l’engin est-il compris ?",
    answer: "La mobilisation, le transport et le retrait doivent être explicitement définis dans la proposition.",
  },
  {
    question: "Le carburant est-il inclus ?",
    answer: "Le carburant et les responsabilités associées dépendent des conditions convenues et doivent être confirmés.",
  },
  {
    question: "Peut-on suivre un camion ou un engin ?",
    answer:
      "Une solution de géolocalisation peut être étudiée lorsque le matériel, l’alimentation et l’environnement sont compatibles.",
  },
  {
    question: "La maintenance est-elle incluse ?",
    answer: "Les responsabilités de maintenance dépendent du mode, du propriétaire, du matériel et du contrat.",
  },
  {
    question: "Peut-on demander plusieurs équipements ?",
    answer:
      "Oui, mais les catégories, quantités, sites et calendriers doivent être précisés afin d’étudier la faisabilité.",
  },
];

export const trucksMachineryEditorialNotice =
  "Les images de cette page illustrent des catégories de camions, d’engins et des situations d’usage. Elles ne constituent pas un catalogue de matériels disponibles. Les références, capacités, prix, délais, opérateurs, services et conditions sont confirmés après qualification.";

export const trucksMachineryFinalCta = {
  titleBefore: "Commençons par comprendre ",
  titleHighlight: "l’opération à réaliser.",
  lead:
    "Précisez la mission, la charge, le terrain, la zone, la durée et les services recherchés afin de mieux orienter la demande.",
  primary: { label: "Préparer ma demande", href: "#demande-camion-engin" },
  secondary: { label: "Voir tous les équipements", href: "/equipements" },
};

export function trucksMachineryBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Équipements", item: `${baseUrl}/equipements` },
      { "@type": "ListItem", position: 3, name: "Camions et engins", item: `${baseUrl}/equipements/camions-engins` },
    ],
  };
}

export function trucksMachineryServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Étude de besoins en camions et engins professionnels",
    provider: { "@type": "Organization", name: "ONLOUTOU", url: baseUrl },
    areaServed: "Côte d’Ivoire",
    description: trucksMachineryPageSeo.description,
    url: `${baseUrl}/equipements/camions-engins`,
  };
}
