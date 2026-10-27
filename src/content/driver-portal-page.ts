import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export type DriverPortalStatus = "planned" | "in-development" | "pilot" | "available";

export type DriverModuleStatus =
  | "planned"
  | "in-development"
  | "pilot"
  | "available"
  | "to-confirm";

/** Audit : pas d’auth livreur, API missions, géoloc ni portail privé dans le dépôt. */
export const driverPortalStatus: DriverPortalStatus = "planned";

export const driverPortalRealUrl: string | null = null;

export function driverModuleStatusLabel(status: DriverModuleStatus): string {
  const map: Record<DriverModuleStatus, string> = {
    planned: "Prévu",
    "in-development": "En développement",
    pilot: "Pilote",
    available: "Disponible",
    "to-confirm": "À confirmer",
  };
  return map[status];
}

export const driverPortalSeo = {
  title: "Espace livreur en préparation",
  description:
    "Découvrez l’aperçu du futur espace livreur ONLOUTOU pour organiser les profils, disponibilités, missions et informations opérationnelles.",
};

export const driverPortalBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Livraison", href: "/livraison" },
  { label: "Espace livreur" },
];

export const driverPortalHero = {
  eyebrow: "ESPACE LIVREUR",
  badge: "En préparation",
  titleBefore: "Un outil simple pour ",
  titleHighlight: "organiser le terrain.",
  intro:
    "ONLOUTOU prépare un espace destiné à centraliser les profils, disponibilités, missions et informations utiles aux livreurs partenaires.",
  primaryCta: { label: "Devenir livreur partenaire", href: "/devenir-livreur" },
  secondaryCta: { label: "Découvrir l’aperçu", href: "#apercu-espace-livreur" },
  deliveryLink: { label: "J’ai un besoin de livraison", href: "/livraison#demande-livraison" },
};

export const driverPortalPreviewSection = {
  id: "apercu-espace-livreur",
  disclaimer: "Prévisualisation conceptuelle — aucune mission ni donnée réelle",
  topBar: { brand: "ONLOUTOU", context: "ESPACE LIVREUR", tag: "Aperçu" },
};

export type DriverPreviewTabId = "home" | "availability" | "missions" | "profile";

export const driverPreviewTabs: { id: DriverPreviewTabId; label: string }[] = [
  { id: "home", label: "Accueil" },
  { id: "availability", label: "Disponibilités" },
  { id: "missions", label: "Missions" },
  { id: "profile", label: "Profil" },
];

export const driverDisconnectedNotice =
  "Fonction disponible lorsque l’espace sera connecté.";

export const driverHomePreview = {
  title: "Vue d’ensemble",
  cards: [
    { label: "Statut du profil", value: "Profil non connecté" },
    { label: "Moyen de transport", value: "À renseigner après activation" },
    { label: "Disponibilité", value: "Non configurée" },
    { label: "Missions", value: "Aucune mission réelle dans cet aperçu" },
  ],
  stepsTitle: "Prochaines étapes",
  steps: [
    "présenter son profil",
    "échanger avec ONLOUTOU",
    "préparer les informations nécessaires",
    "attendre la confirmation du dispositif",
    "recevoir un accès uniquement après validation",
  ],
};

export const driverAvailabilityPreview = {
  title: "Organisation des disponibilités",
  lead:
    "Cette fonction pourra permettre d’indiquer les périodes et zones dans lesquelles un livreur peut être mobilisé.",
  fields: [
    "disponible aujourd’hui",
    "jours habituels",
    "plages horaires",
    "zones",
    "moyen de transport mobilisable",
    "indisponibilité temporaire",
  ],
  notice: "Les disponibilités communiquées ne garantissent aucune mission.",
};

export const driverMissionPreview = {
  title: "Propositions et suivi des missions",
  empty: "Aucune mission réelle n’est chargée dans cette prévisualisation.",
  structureLabels: [
    "Type de mission",
    "Zone de collecte",
    "Zone de remise",
    "Bien à transporter",
    "Moyen requis",
    "Période",
    "Conditions",
    "Montant confirmé",
    "Statut",
  ],
  exampleTag: "EXEMPLE DE STRUCTURE",
  exampleValues: [
    "Zone à confirmer",
    "Zone à confirmer",
    "—",
    "—",
    "Moyen à confirmer",
    "Période à confirmer",
    "Conditions à consulter",
    "—",
    "—",
  ],
  demoActions: ["Consulter", "Accepter", "Refuser"],
};

export const driverProfilePreview = {
  title: "Profil et capacité opérationnelle",
  blocks: [
    {
      title: "Identité",
      items: ["nom", "téléphone", "ville", "type de profil"],
    },
    {
      title: "Moyen de transport",
      items: ["catégorie", "propriété", "état de vérification", "zones d’utilisation"],
    },
    {
      title: "Documents",
      items: [
        "identité",
        "permis applicable",
        "documents du véhicule",
        "assurance applicable",
        "documents professionnels",
      ],
    },
    {
      title: "Préférences",
      items: ["zones", "types de missions", "disponibilité", "moyen mobilisable"],
    },
  ],
  notice:
    "Les documents sensibles devront être transmis ultérieurement par un canal sécurisé, si le processus les exige.",
};

export const driverModuleMatrix = [
  { module: "Profil", function: "Informations du livreur", status: "En développement" },
  { module: "Véhicule", function: "Moyen de transport", status: "Prévu" },
  { module: "Documents", function: "Vérification applicable", status: "Prévu" },
  { module: "Disponibilités", function: "Jours, heures et zones", status: "En développement" },
  { module: "Missions", function: "Propositions et statuts", status: "Prévu" },
  { module: "Itinéraire", function: "Informations utiles au trajet", status: "À confirmer" },
  { module: "Remise", function: "Confirmation de fin de mission", status: "À confirmer" },
  { module: "Historique", function: "Missions réalisées", status: "Prévu" },
  { module: "Paiements", function: "Montants et versements", status: "À confirmer" },
  { module: "Assistance", function: "Aide et incidents", status: "Prévu" },
];

export const driverMissionFramingSection = {
  title: "Les informations doivent être claires avant le départ.",
  items: [
    "nature de la mission",
    "bien transporté",
    "point de collecte",
    "destination",
    "moyen nécessaire",
    "conditionnement",
    "calendrier",
    "montant",
    "responsabilités",
    "contact utile",
    "preuve attendue",
    "procédure en cas d’incident",
  ],
  notice:
    "Aucune mission, disponibilité, rémunération ou condition n’est considérée comme confirmée avant validation explicite.",
};

export const driverActivationJourney = {
  title: "Avant l’accès, le profil doit être qualifié.",
  notice: "Une manifestation d’intérêt ne garantit ni compte, ni mission, ni revenu.",
};

export const driverActivationPhases: DeploymentPhase[] = [
  {
    step: "01",
    title: "Présenter",
    description: "Le candidat transmet les premières informations via /devenir-livreur.",
  },
  {
    step: "02",
    title: "Examiner",
    description: "ONLOUTOU étudie la cohérence du profil avec les besoins envisagés.",
  },
  {
    step: "03",
    title: "Échanger",
    description: "Les zones, moyens, expériences et disponibilités peuvent être précisés.",
  },
  {
    step: "04",
    title: "Vérifier",
    description: "Les informations et documents applicables peuvent être vérifiés par un canal sécurisé.",
  },
  {
    step: "05",
    title: "Valider",
    description: "Les conditions éventuelles de collaboration sont communiquées.",
  },
  {
    step: "06",
    title: "Activer",
    description:
      "Un accès pourra être créé lorsque le portail et la collaboration seront réellement opérationnels.",
  },
];

export const driverPaymentsSection = {
  title: "Des conditions financières visibles avant chaque engagement.",
  moduleStatus: "À confirmer",
  items: [
    "montant convenu",
    "frais éventuels",
    "statut de validation",
    "modalités de paiement",
    "historique",
    "référence de l’opération",
    "éventuel incident",
  ],
  notice:
    "Les modalités financières, délais de paiement et éventuels frais devront être définis avant l’activation de ce module.",
};

export const driverFieldSafetySection = {
  title: "La sécurité ne doit pas être sacrifiée à la vitesse.",
  principles: [
    "respect des règles de circulation",
    "moyen de transport adapté",
    "chargement sécurisé",
    "consignes comprises avant le départ",
    "communication en cas de difficulté",
    "protection des informations",
    "signalement des incidents",
    "refus des biens interdits ou non déclarés",
  ],
};

export const driverDataProtectionSection = {
  title: "Des données personnelles et opérationnelles à protéger.",
  items: [
    "authentification sécurisée",
    "accès nominatif",
    "permissions",
    "protection des documents",
    "limitation des données visibles",
    "révocation des accès",
    "journalisation des actions sensibles",
    "protection des positions",
    "durée de conservation définie",
  ],
  notice:
    "La prévisualisation publique ne collecte aucune position, aucun document, aucune information bancaire et aucune donnée de mission réelle.",
};

export const driverOrientationSection = {
  become: {
    title: "Je souhaite devenir livreur",
    lead: "Présentez votre profil, vos zones et le moyen de transport que vous pouvez réellement mobiliser.",
    cta: { label: "Présenter mon profil", href: "/devenir-livreur" },
  },
  delivery: {
    title: "J’ai besoin d’une livraison",
    lead: "Décrivez le bien, le départ, la destination et les contraintes de l’opération.",
    cta: { label: "Présenter mon besoin", href: "/livraison#demande-livraison" },
  },
};

export const driverPortalFaq: ServiceFaqItem[] = [
  {
    question: "L’espace livreur est-il disponible ?",
    answer: "Non. Seule une prévisualisation publique est proposée. Aucun compte connecté n’est ouvert.",
  },
  {
    question: "Qui pourra obtenir un accès ?",
    answer: "Les profils dont la collaboration avec ONLOUTOU aura été qualifiée et validée.",
  },
  {
    question: "Comment devenir livreur partenaire ?",
    answer: "Présentez votre profil via la page Devenir livreur avant toute activation d’accès.",
  },
  {
    question: "Quelles fonctions sont prévues ?",
    answer: "Profil, disponibilités, missions, historique et assistance sont en cours de définition ; paiements et itinéraire restent à confirmer.",
  },
  {
    question: "Peut-on choisir ses disponibilités ?",
    answer: "Un module est en préparation. Les créneaux indiqués ne garantiront aucune mission.",
  },
  {
    question: "Comment les missions seront-elles proposées ?",
    answer: "Le mode de proposition n’est pas encore publié. Chaque mission devra être validée explicitement.",
  },
  {
    question: "Une candidature garantit-elle des missions ?",
    answer: "Non. Aucun volume de mission ni revenu ne peut être garanti.",
  },
  {
    question: "Comment seront déterminés les montants ?",
    answer: "Les montants et modalités financières seront définis et communiqués avant tout engagement.",
  },
  {
    question: "Quels documents seront nécessaires ?",
    answer: "La liste dépendra du profil et sera transmise par un canal sécurisé si le processus l’exige.",
  },
  {
    question: "Une application mobile est-elle disponible ?",
    answer: "Aucune application opérationnelle n’est proposée depuis cette page.",
  },
  {
    question: "La géolocalisation sera-t-elle obligatoire ?",
    answer: "L’usage de la position n’est pas annoncé tant que le cadre technique et légal n’est pas validé.",
  },
  {
    question: "Comment les données seront-elles protégées ?",
    answer: "Des mécanismes d’authentification, de permissions et de limitation des données sont prévus avant ouverture.",
  },
];

export const driverPortalFinalCta = {
  eyebrow: "REJOINDRE LE RÉSEAU",
  title: "L’accès commence par un profil clair et vérifiable.",
  lead: "Présentez votre expérience, vos zones et votre moyen de transport afin de préparer les prochaines étapes avec ONLOUTOU.",
  primary: { label: "Devenir livreur partenaire", href: "/devenir-livreur" },
  secondary: { label: "Découvrir la livraison", href: "/livraison" },
  contact: { label: "Contacter ONLOUTOU", href: "/contact" },
  help: { label: "Centre d’aide", href: "/aide" },
};

export function driverPortalBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Livraison", item: `${baseUrl}/livraison` },
      { "@type": "ListItem", position: 3, name: "Espace livreur", item: `${baseUrl}/espace-livreur` },
    ],
  };
}
