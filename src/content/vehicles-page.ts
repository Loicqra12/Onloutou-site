import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

const vehiclesBase = "/assets/images/equipment/vehicles";

export const vehiclesPageSeo = {
  title: "Véhicules professionnels en location ou acquisition",
  description:
    "ONLOUTOU étudie les besoins en berlines, SUV, pick-up et utilitaires professionnels selon l’usage, la quantité, la durée, la zone et la disponibilité.",
};

export const vehiclesPositioning =
  "ONLOUTOU étudie les besoins en véhicules professionnels selon l’usage, la zone, la durée, la quantité, les contraintes du terrain et les services recherchés.";

export const vehiclesRepresentativeCaption =
  "Visuel représentatif d’un usage professionnel — catégorie, modèle et disponibilité à confirmer.";

export const vehiclesHeroCaption =
  "Visuel représentatif de plusieurs catégories de véhicules professionnels.";

export const vehiclesMedia = {
  fleetHero: {
    src: `${vehiclesBase}/Flotte professionnelle inspectée à Abidjan-2.png`,
    alt: "Berline, SUV et utilitaire présentés dans une cour professionnelle à Abidjan",
    width: 1672,
    height: 941,
    objectPosition: "52% 48%",
  },
  mobility: {
    src: "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
    alt: "Berline, utilitaire et scooter dans une cour logistique pour la mobilité professionnelle",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  utility: {
    src: `${vehiclesBase}/Chargement professionnel dans une cour d’Abidjan-1.png`,
    alt: "Deux agents chargeant du matériel dans un véhicule utilitaire",
    width: 1586,
    height: 992,
    objectPosition: "55% 42%",
  },
  pickup: {
    src: `${vehiclesBase}/Pick-up professionnel sur site d’intervention-3.png`,
    alt: "Technicien préparant un véhicule destiné à une intervention terrain",
    width: 1586,
    height: 992,
    objectPosition: "58% 40%",
  },
};

export const vehiclesBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements", href: "/equipements" },
  { label: "Véhicules professionnels" },
];

export const vehiclesHero = {
  eyebrow: "ÉQUIPEMENTS · VÉHICULES PROFESSIONNELS",
  titleBefore: "Le véhicule adapté commence par ",
  titleHighlight: "la mission à accomplir.",
  intro:
    "ONLOUTOU étudie les besoins en berlines, SUV, pick-up et utilitaires selon l’usage, la quantité, la durée, la zone et les contraintes opérationnelles.",
  caveat: "Les catégories, modèles, conditions et disponibilités sont confirmés après qualification.",
  primaryCta: { label: "Définir mon besoin", href: "#demande-vehicule" },
  secondaryCta: { label: "Explorer les usages", href: "#profils-vehicules" },
};

export const vehiclesCriteriaBand = {
  lead: "Le choix doit partir de l’usage réel, pas uniquement de l’apparence du véhicule.",
  items: ["Mission", "Terrain", "Capacité", "Durée", "Services associés"] as const,
};

export type VehicleProfileId = "sedan" | "suv" | "utility";

export const vehiclesProfiles = {
  id: "profils-vehicules",
  title: "Chaque usage appelle un profil différent.",
  items: [
    {
      id: "sedan" as VehicleProfileId,
      number: "01",
      title: "Berline professionnelle",
      imageKey: "mobility" as const,
      usages: [
        "déplacements urbains",
        "rendez-vous",
        "mobilité d’équipe",
        "mission administrative ou commerciale",
        "déplacement professionnel",
      ],
      criteria: ["nombre de passagers", "fréquence", "environnement", "durée", "besoin de suivi"],
      note: vehiclesRepresentativeCaption,
    },
    {
      id: "suv" as VehicleProfileId,
      number: "02",
      title: "SUV ou pick-up",
      imageKey: "pickup" as const,
      usages: [
        "intervention terrain",
        "déplacement sur des zones plus exigeantes",
        "transport léger de matériel",
        "mission multisite",
        "besoin opérationnel",
      ],
      criteria: ["état du terrain", "charge", "nombre de personnes", "distance", "sécurité", "équipements complémentaires"],
      note: "Un profil terrain ne garantit pas l’adéquation à tous les environnements — le besoin doit être qualifié.",
    },
    {
      id: "utility" as VehicleProfileId,
      number: "03",
      title: "Utilitaire léger",
      imageKey: "utility" as const,
      usages: [
        "transport d’équipements",
        "livraison",
        "intervention",
        "logistique légère",
        "déplacement de matériel",
      ],
      criteria: ["volume", "charge", "accès", "organisation du matériel", "fréquence", "zone"],
      note: vehiclesRepresentativeCaption,
    },
  ],
};

export const vehiclesUsageMatrix = {
  title: "Un véhicule s’évalue dans son contexte d’utilisation.",
  note: "La recommandation finale dépend de l’ensemble du besoin et des solutions disponibles.",
  rows: [
    { situation: "Déplacements urbains", points: "Passagers, fréquence, stationnement, zone" },
    { situation: "Intervention terrain", points: "Accès, matériel, distance, environnement" },
    { situation: "Transport léger", points: "Volume, charge, organisation, fréquence" },
    { situation: "Mission ponctuelle", points: "Durée, lieu, calendrier, restitution" },
    { situation: "Parc professionnel", points: "Quantité, utilisateurs, suivi, coordination" },
  ],
};

export const vehiclesRentOrBuy = {
  title: "Choisir le mode adapté à la durée du besoin.",
  rent: {
    title: "Louer",
    lead: "La location peut être étudiée pour une mission, un renfort temporaire, une période définie ou un besoin à tester.",
    points: [
      "durée à préciser",
      "catégorie à confirmer",
      "disponibilité à vérifier",
      "conditions applicables",
      "restitution à organiser",
    ],
    cta: { label: "Explorer la location", href: "/solutions/location" },
  },
  buy: {
    title: "Acheter",
    lead: "L’acquisition peut être étudiée pour un usage durable, un besoin récurrent ou l’intégration d’un véhicule dans un parc.",
    points: ["caractéristiques", "référence", "quantité", "délai", "services associés"],
    cta: { label: "Explorer l’acquisition", href: "/solutions/vente" },
  },
};

export const vehiclesConnected = {
  title: "Ajouter de la visibilité aux opérations.",
  lead:
    "Lorsqu’un véhicule doit être suivi, une solution de géolocalisation ou de gestion de flotte peut être étudiée avec le dispositif, la connectivité et les fonctionnalités nécessaires.",
  flow: ["Véhicule", "Dispositif compatible", "Transmission", "Plateforme", "Équipe"],
  disclaimer:
    "Les fonctionnalités disponibles dépendent du véhicule, du dispositif, du réseau et de la configuration retenue.",
  links: [
    { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
};

export const vehiclesSelectionCriteria = {
  title: "Les informations qui orientent le choix.",
  groups: [
    { label: "Mission", items: ["usage principal", "nombre de passagers", "matériel à transporter", "environnement"] },
    { label: "Déploiement", items: ["zone", "fréquence", "durée", "quantité", "conduite prévue"] },
    { label: "Services", items: ["besoin de livraison", "besoin de géolocalisation", "besoin de supervision"] },
  ],
};

export const vehiclesProcess = {
  title: "De la mission au véhicule confirmé.",
  steps: [
    { title: "Décrire", description: "Préciser l’usage, la zone et le calendrier." },
    { title: "Qualifier", description: "Identifier la catégorie, la quantité et les contraintes." },
    { title: "Comparer", description: "Étudier la location, l’acquisition ou les deux." },
    { title: "Vérifier", description: "Contrôler la disponibilité, les conditions et les services." },
    { title: "Proposer", description: "Présenter une solution et un périmètre." },
    { title: "Confirmer", description: "Valider les caractéristiques, le prix et les modalités applicables." },
  ],
};

export const vehiclesRequestOptions = {
  modes: [
    { id: "rent", label: "louer" },
    { id: "buy", label: "acheter" },
    { id: "compare", label: "comparer" },
    { id: "tbd", label: "je ne sais pas encore" },
  ],
  profiles: [
    { id: "sedan", label: "berline" },
    { id: "suv", label: "SUV" },
    { id: "pickup", label: "pick-up" },
    { id: "utility", label: "utilitaire léger" },
    { id: "multi", label: "plusieurs catégories" },
    { id: "tbd", label: "catégorie à définir" },
  ],
  usages: [
    { id: "pro", label: "déplacement professionnel" },
    { id: "team", label: "mobilité d’équipe" },
    { id: "field", label: "intervention terrain" },
    { id: "material", label: "transport de matériel" },
    { id: "delivery", label: "livraison" },
    { id: "fleet", label: "renfort de parc" },
    { id: "other", label: "autre" },
  ],
  quantities: [
    { id: "one", label: "un véhicule" },
    { id: "few", label: "deux à cinq" },
    { id: "many", label: "plus de cinq" },
    { id: "tbd", label: "quantité à définir" },
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
    { id: "vehicle", label: "véhicule uniquement" },
    { id: "delivery", label: "livraison à étudier" },
    { id: "geo", label: "géolocalisation à étudier" },
    { id: "fleet", label: "gestion de flotte à étudier" },
    { id: "install", label: "installation d’un équipement à étudier" },
    { id: "multi", label: "plusieurs services" },
    { id: "tbd", label: "besoin à préciser" },
  ],
};

export function buildVehicleRequestSummary(s: {
  quantityLabel: string;
  profileLabel: string;
  usageLabel: string;
  zoneLabel: string;
  modeLabel: string;
  durationLabel: string;
  servicesLabel: string;
}) {
  return `Je recherche ${s.quantityLabel} de type ${s.profileLabel} pour ${s.usageLabel}, dans la zone ${s.zoneLabel}. Mode envisagé : ${s.modeLabel}. Durée : ${s.durationLabel}. Services associés : ${s.servicesLabel}.`;
}

export function buildVehicleWhatsAppUrl(s: Parameters<typeof buildVehicleRequestSummary>[0]) {
  const summary = buildVehicleRequestSummary(s);
  return whatsappUrlForMessage(`Bonjour ONLOUTOU, ${summary} Pouvez-vous m’orienter sur les prochaines étapes ?`);
}

export const vehiclesTransparency = {
  title: "Ce qui doit être confirmé",
  items: [
    "catégorie",
    "caractéristiques",
    "quantité",
    "disponibilité",
    "état applicable",
    "prix",
    "taxes",
    "durée si location",
    "délai",
    "zone",
    "livraison",
    "assurance si applicable",
    "conducteur si applicable",
    "entretien",
    "restitution",
    "garantie applicable",
    "géolocalisation éventuelle",
  ],
  note: "Seuls les éléments figurant dans la proposition ou le contrat applicable sont considérés comme confirmés.",
};

export const vehiclesFaq: ServiceFaqItem[] = [
  {
    question: "Les véhicules présentés sont-ils disponibles ?",
    answer:
      "Les images représentent des catégories d’usage. La disponibilité, le modèle et les conditions doivent être confirmés.",
  },
  {
    question: "Peut-on louer ou acheter un véhicule ?",
    answer: "Les deux modes peuvent être étudiés selon le besoin, la catégorie et les solutions disponibles.",
  },
  {
    question: "Peut-on demander plusieurs véhicules ?",
    answer: "Oui. La quantité, les catégories, la zone et le calendrier doivent être précisés.",
  },
  {
    question: "Les marques et modèles peuvent-ils être choisis ?",
    answer:
      "Une préférence peut être indiquée, mais aucune référence ne doit être considérée comme disponible avant confirmation.",
  },
  {
    question: "La livraison est-elle incluse ?",
    answer: "La mise à disposition, la livraison ou la récupération dépendent de la zone et des conditions retenues.",
  },
  {
    question: "Un conducteur est-il inclus ?",
    answer: "Le conducteur ou l’accompagnement doit être étudié séparément et confirmé explicitement si applicable.",
  },
  {
    question: "Peut-on ajouter la géolocalisation ?",
    answer: "Une solution de géolocalisation peut être étudiée selon la compatibilité du véhicule et le périmètre du projet.",
  },
  {
    question: "L’entretien ou l’assurance sont-ils compris ?",
    answer:
      "Les responsabilités, l’entretien et l’assurance dépendent du mode et des conditions contractuelles. Ils doivent être explicitement confirmés.",
  },
];

export const vehiclesEditorialNotice =
  "Les images de cette page illustrent des profils de véhicules et des situations d’usage. Elles ne constituent pas un catalogue de modèles disponibles. Les références, quantités, prix, délais, services et conditions sont confirmés après qualification.";

export const vehiclesFinalCta = {
  titleBefore: "Définissons le véhicule à partir de ",
  titleHighlight: "votre mission.",
  lead: "Précisez l’usage, la quantité, la zone, la durée et les services recherchés afin de mieux orienter la demande.",
  primary: { label: "Préparer ma demande", href: "#demande-vehicule" },
  secondary: { label: "Voir tous les équipements", href: "/equipements" },
};

export function vehiclesBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Équipements", item: `${baseUrl}/equipements` },
      { "@type": "ListItem", position: 3, name: "Véhicules professionnels", item: `${baseUrl}/equipements/vehicules` },
    ],
  };
}

export function vehiclesServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Étude de besoins en véhicules professionnels",
    provider: { "@type": "Organization", name: "ONLOUTOU", url: baseUrl },
    areaServed: "Côte d’Ivoire",
    description: vehiclesPageSeo.description,
    url: `${baseUrl}/equipements/vehicules`,
  };
}
