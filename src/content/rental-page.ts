import { site } from "@/content/site";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export const rentalSeo = {
  title: "Location de véhicules et équipements professionnels",
  description:
    "ONLOUTOU étudie les besoins de location de véhicules, motos, matériels et équipements professionnels selon l’usage, la durée, la zone et la disponibilité.",
};

export const rentalPositioning =
  "ONLOUTOU étudie les besoins de location de véhicules, de motos, de matériels et d’équipements professionnels, directement ou avec son écosystème selon la catégorie, le lieu et la disponibilité.";

export type RentalMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export const rentalMedia = {
  hero: {
    src: "/assets/images/home/hom-01-espace-mobilite.webp",
    alt: "Véhicules garés devant le local ONLOUTOU à Abidjan",
    width: 1200,
    height: 900,
    objectPosition: "50% 50%",
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
  freight: {
    src: "/assets/images/equipment/camions/Camion de fret au dépôt d’Abidjan-2.png",
    alt: "Agents préparant le chargement d’un camion dans un dépôt à Abidjan",
    width: 1586,
    height: 992,
    objectPosition: "52% 40%",
  },
  mobilityWorld: {
    src: "/assets/images/projects/project-b/operation-logistique-depot-abidjan.png",
    alt: "Opération logistique avec véhicules dans un dépôt à Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "40% 32%",
  },
  warehouse: {
    src: "/assets/images/projects/project-a/gestion-equipements-entrepot.png",
    alt: "Équipements professionnels organisés dans un entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  menuEquipment: {
    src: "/assets/images/menu/mega-menu-equipements-onloutou.png",
    alt: "Technicien contrôlant un groupe électrogène, avec utilitaire et moto en arrière-plan",
    width: 1586,
    height: 992,
    objectPosition: "82% 68%",
  },
  generatorInspection: {
    src: "/assets/images/projects/project-b/inspection-groupe-electrogene.png",
    alt: "Technicien inspectant un groupe électrogène",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
  },
  connected: {
    src: "/assets/images/projects/project-a/installation-gps-embarque.png",
    alt: "Technicien installant un dispositif GPS embarqué dans un véhicule",
    width: 1536,
    height: 1024,
    objectPosition: "62% 48%",
  },
  teamInspection: {
    src: "/assets/images/home/equipment/equipe-onloutou-inspection-equipements.png",
    alt: "Équipe ONLOUTOU inspectant des équipements professionnels",
    width: 1448,
    height: 1086,
    objectPosition: "center 40%",
  },
  technicians: {
    src: "/assets/images/home/equipment/techniciens-onloutou-au-travail.png",
    alt: "Techniciens ONLOUTOU pendant une intervention technique",
    width: 1448,
    height: 1086,
    objectPosition: "center 35%",
  },
};

export const rentalHero = {
  eyebrow: "SOLUTION · LOCATION",
  titleBefore: "Louer un véhicule ou du matériel ",
  titleHighlight: "en Côte d’Ivoire",
  intro:
    "ONLOUTOU étudie les demandes de location pour des besoins professionnels, des opérations terrain, des projets ponctuels ou des usages récurrents.",
  caveat: "La disponibilité, les conditions et le périmètre sont confirmés après étude de la demande.",
  primaryCta: { label: "Faire une demande de location", href: "#demande-location" },
  secondaryCta: { label: "Voir comment ça se passe", href: "#etapes-location" },
};

export const rentalNeedBand = [
  "Mission ponctuelle",
  "Renfort opérationnel",
  "Projet temporaire",
  "Besoin récurrent à étudier",
] as const;

export type RentalCategoryId =
  | "vehicules"
  | "motos"
  | "camions"
  | "outils"
  | "connecte";

export const rentalCategories = {
  id: "categories-location",
  title: "Un besoin précis, une réponse à construire.",
  disclaimer: "Catégorie étudiée selon le besoin, la zone et la disponibilité.",
  items: [
    {
      id: "vehicules" as RentalCategoryId,
      title: "Véhicules professionnels",
      examples: [
        "Mobilité d’équipe",
        "Déplacement opérationnel",
        "Missions professionnelles",
        "Besoins liés à un projet",
      ],
      image: rentalMedia.fleet,
    },
    {
      id: "motos" as RentalCategoryId,
      title: "Motos et mobilité légère",
      examples: [
        "Déplacements urbains",
        "Opérations de proximité",
        "Besoins de livraison ou de terrain",
      ],
      image: rentalMedia.motorcycles,
    },
    {
      id: "camions" as RentalCategoryId,
      title: "Camions et engins",
      examples: ["Transport", "Manutention", "Chantier", "Opération spécialisée"],
      image: rentalMedia.trucks,
    },
    {
      id: "outils" as RentalCategoryId,
      title: "Outils et matériels",
      examples: [
        "Équipements de chantier",
        "Matériel d’intervention",
        "Groupe électrogène",
        "Besoins techniques ponctuels",
      ],
      image: rentalMedia.menuEquipment,
    },
    {
      id: "connecte" as RentalCategoryId,
      title: "Équipements connectés",
      examples: [
        "Traceurs",
        "Dispositifs de suivi",
        "Équipements étudiés avec une solution de supervision",
      ],
      image: rentalMedia.connected,
    },
  ],
};

export const rentalDualWorld = {
  mobility: {
    title: "Mobilité",
    text:
      "Pour déplacer une équipe, renforcer une opération ou répondre à un besoin temporaire, le véhicule recherché doit être cohérent avec l’usage, la durée et les conditions terrain.",
    caption: "Dépôt et mobilité opérationnelle",
  },
  materials: {
    title: "Matériels et équipements",
    text:
      "Les demandes de matériels sont étudiées selon la fonction recherchée, le lieu d’utilisation, la durée, les contraintes techniques et les conditions disponibles.",
    caption: "Organisation et préparation des équipements",
  },
};

export const rentalBriefGuide = {
  title: "Le bon équipement commence par le bon brief.",
  fields: [
    "Catégorie recherchée",
    "Usage prévu",
    "Quantité approximative",
    "Lieu d’utilisation",
    "Période ou durée",
    "Contraintes du terrain",
    "Besoin éventuel de livraison",
    "Besoin éventuel d’installation ou de supervision",
  ],
  closing: "Plus le brief est précis, plus l’étude peut être rapide et pertinente.",
};

export const rentalProcess = {
  title: "De votre besoin à une solution confirmée.",
  steps: [
    {
      title: "Décrire",
      description: "Le client précise l’usage, la catégorie, la période et le lieu.",
    },
    {
      title: "Qualifier",
      description: "ONLOUTOU vérifie le besoin et les contraintes principales.",
    },
    {
      title: "Rechercher",
      description: "La solution adaptée est étudiée selon la catégorie et la disponibilité.",
    },
    {
      title: "Proposer",
      description: "Le périmètre, les conditions et les modalités sont présentés.",
    },
    {
      title: "Confirmer",
      description: "La mise à disposition est organisée après validation.",
    },
    {
      title: "Accompagner",
      description:
        "Les besoins de prise en main, de suivi ou de récupération sont précisés selon le projet.",
    },
  ],
};

export const rentalUseCases = {
  title: "Des besoins différents selon les opérations.",
  cases: [
    {
      title: "Déployer une équipe",
      description: "Mobilité adaptée à une mission ou à un projet.",
      image: rentalMedia.mobilityWorld,
    },
    {
      title: "Renforcer temporairement un parc",
      description: "Besoin ponctuel étudié selon la disponibilité.",
      image: rentalMedia.trucks,
    },
    {
      title: "Équiper une intervention",
      description: "Matériel ou outillage défini selon la tâche.",
      image: rentalMedia.generatorInspection,
    },
    {
      title: "Accompagner un projet",
      description:
        "Combinaison possible entre mobilité, équipement, suivi et accompagnement.",
      image: null,
    },
  ],
};

export const rentalBriefOptions = {
  needTypes: [
    { id: "vehicule", label: "véhicule" },
    { id: "moto", label: "moto" },
    { id: "camion", label: "camion ou engin" },
    { id: "materiel", label: "matériel ou outil" },
    { id: "connecte", label: "équipement connecté" },
    { id: "autre", label: "autre besoin" },
  ],
  durations: [
    { id: "intervention", label: "une intervention" },
    { id: "jours", label: "quelques jours" },
    { id: "semaines", label: "plusieurs semaines" },
    { id: "recurrent", label: "besoin récurrent" },
    { id: "definir", label: "durée à définir" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "autre ville de Côte d’Ivoire" },
    { id: "autre", label: "autre zone à préciser" },
  ],
  support: [
    { id: "location", label: "location uniquement" },
    { id: "livraison", label: "livraison à étudier" },
    { id: "installation", label: "installation à étudier" },
    { id: "suivi", label: "suivi ou supervision à étudier" },
    { id: "preciser", label: "besoin à préciser" },
  ],
};

export function buildRentalBriefSummary(selection: {
  needLabel: string;
  durationLabel: string;
  zoneLabel: string;
  supportLabel: string;
}) {
  return `Je recherche ${selection.needLabel} pour ${selection.durationLabel}, dans la zone ${selection.zoneLabel}, avec ${selection.supportLabel}.`;
}

export function buildRentalWhatsAppUrl(selection: {
  needLabel: string;
  durationLabel: string;
  zoneLabel: string;
  supportLabel: string;
}) {
  const summary = buildRentalBriefSummary(selection);
  const message = `Bonjour ONLOUTOU, ${summary} Pouvez-vous m’indiquer la marche à suivre pour une étude de location ?`;
  return whatsappUrlForMessage(message);
}

export const rentalTransparency = {
  title: "Ce qui est confirmé avant la location",
  items: [
    "Catégorie et caractéristiques recherchées",
    "Disponibilité",
    "Durée",
    "Zone",
    "Conditions de mise à disposition",
    "Livraison ou récupération",
    "Responsabilités",
    "Besoins d’installation",
    "Modalités financières",
    "État et restitution selon le matériel",
  ],
  groups: [
    {
      id: "equipement",
      title: "L’équipement",
      items: ["Catégorie et caractéristiques recherchées", "Disponibilité"],
    },
    {
      id: "organisation",
      title: "L’organisation",
      items: [
        "Durée",
        "Zone",
        "Conditions de mise à disposition",
        "Livraison ou récupération",
        "Besoins d’installation",
      ],
    },
    {
      id: "conditions",
      title: "Les conditions",
      items: [
        "Responsabilités",
        "Modalités financières",
        "État et restitution selon le matériel",
      ],
    },
  ],
  note: "Les conditions définitives sont précisées dans la proposition ou le contrat applicable.",
};

export const rentalFaqTitle = "Questions fréquentes";

export const rentalFaq: ServiceFaqItem[] = [
  {
    question: "Quels types d’équipements peut-on demander ?",
    answer:
      "ONLOUTOU étudie notamment les besoins liés aux véhicules, motos, matériels professionnels, outils et équipements connectés. La disponibilité dépend de la catégorie et du contexte.",
  },
  {
    question: "Les équipements sont-ils disponibles immédiatement ?",
    answer:
      "Non. Toute disponibilité doit être confirmée après étude de la catégorie, de la période, du lieu et des conditions demandées.",
  },
  {
    question: "Peut-on louer pour une courte durée ?",
    answer:
      "La durée est étudiée avec le besoin. Une intervention ponctuelle, plusieurs jours, plusieurs semaines ou un besoin récurrent peuvent faire l’objet d’une qualification.",
  },
  {
    question: "La livraison est-elle incluse ?",
    answer:
      "La livraison ou la récupération dépend du matériel, de la zone et des modalités convenues. Elle doit être confirmée dans la proposition.",
  },
  {
    question: "Peut-on demander plusieurs équipements ?",
    answer:
      "Oui, une demande peut porter sur plusieurs unités ou catégories. Les quantités doivent être précisées pour vérifier la faisabilité.",
  },
  {
    question: "Peut-on associer la location à la géolocalisation ?",
    answer:
      "Une solution de suivi peut être étudiée lorsqu’elle est compatible avec l’équipement et le périmètre du projet.",
  },
  {
    question: "Comment obtenir un tarif ?",
    answer:
      "Le tarif dépend notamment de la catégorie, de la durée, de la quantité, du lieu et des services associés. Il est communiqué après qualification du besoin.",
  },
];

export const rentalEditorialNotice =
  "Les visuels présentent des catégories de besoins et ne constituent pas un catalogue de stock. La disponibilité, les modèles, les quantités, les conditions, la livraison et les services associés sont confirmés uniquement après étude.";

export const rentalFinalCta = {
  titleBefore: "Parlons de ce qu’il vous faut ",
  titleHighlight: "réellement.",
  lead:
    "Indiquez la catégorie, l’usage, la quantité, la durée et le lieu. ONLOUTOU pourra mieux qualifier votre demande.",
  primary: { label: "Faire une demande de location", href: "#demande-location" },
  phoneLabel: "Appeler ONLOUTOU",
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
  image: rentalMedia.freight,
};

export const rentalFaqAside = {
  text: rentalHero.intro,
  cta: rentalFinalCta.primary,
  portraits: [rentalMedia.teamInspection, rentalMedia.technicians, rentalMedia.connected],
};

export const rentalBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Location" },
];

export function rentalBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${baseUrl}/solutions` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Location",
        item: `${baseUrl}/solutions/location`,
      },
    ],
  };
}

export function rentalServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Location de véhicules et équipements professionnels",
    provider: { "@type": "Organization", name: site.name },
    areaServed: "Côte d’Ivoire",
    url: `${baseUrl}/solutions/location`,
    description: rentalSeo.description,
  };
}
