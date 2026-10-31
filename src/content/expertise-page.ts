import type { DeploymentPhase } from "@/types/content";

export const expertiseSeo = {
  title: "Expertise — flotte, crédit-bail et projets technologiques",
  description:
    "Crédit-bail et sécurisation d’actifs, transport et logistique, BTP, institutions, appels d’offres et projets technologiques sur mesure en Afrique de l’Ouest.",
};

export const expertiseHero = {
  title: "Une expertise adaptée aux opérations critiques",
  description:
    "ONLOUTOU accompagne les entreprises, banques, institutions, transporteurs et porteurs de projets qui ont besoin de visibilité sur leurs actifs, de plateformes fiables et d’un déploiement maîtrisé sur le terrain.",
};

export const interventionSectors = [
  {
    id: "banque",
    tag: "Banque & crédit-bail",
    title: "Banque et crédit-bail",
    points: [
      "Suivi des actifs financés",
      "Géolocalisation",
      "Sécurisation",
      "Alertes",
      "Reporting",
      "Accompagnement des opérations de crédit-bail",
    ],
    highlight:
      "ONLOUTOU dispose de références historiques dans la mise en œuvre de solutions GPS et de suivi d’actifs liées à des opérations de crédit-bail, notamment auprès de la BNI et de Banque Atlantique Côte d’Ivoire.",
  },
  {
    id: "transport",
    tag: "Transport & logistique",
    title: "Transport et logistique",
    points: [
      "Visibilité sur la flotte",
      "Suivi des trajets",
      "Missions",
      "Tournées",
      "Alertes",
      "Rapports opérationnels",
    ],
  },
  {
    id: "btp",
    tag: "BTP & industrie",
    title: "BTP et industrie",
    points: [
      "Suivi des véhicules et équipements mobiles",
      "Adaptation aux conditions terrain",
      "Géozones",
      "Maintenance",
      "Supervision multi-sites",
    ],
  },
  {
    id: "institutions",
    tag: "Entreprises & institutions",
    title: "Entreprises et institutions",
    points: [
      "Flottes administratives",
      "Véhicules de service",
      "Besoins spécifiques",
      "Tableaux de bord",
      "Plateformes personnalisées",
      "Accompagnement aux appels d’offres",
    ],
  },
];

export const prestationTypes = [
  "Audit et conseil",
  "Ingénierie matérielle",
  "Installation",
  "Configuration GPS",
  "Intégration logicielle",
  "Conception de plateformes",
  "Mise en service",
  "Formation",
  "Support et maintenance contractuels",
];

export const prestationDetails = {
  title: "Du paramétrage au reporting",
  description:
    "Trois interventions détaillées ici : ce qu’elles couvrent et ce qui se précise avec vous avant le démarrage.",
  coversLabel: "Ce que couvre l’intervention",
  defineLabel: "À définir avec vous",
  items: [
    {
      id: "installation-parametrage",
      title: "Installation et paramétrage",
      covers:
        "Installation des dispositifs sur les véhicules ou les équipements, configuration GPS, paramétrage du suivi, mise en service et tests de bout en bout.",
      define:
        "Les véhicules et actifs concernés, leur compatibilité et leur alimentation, les sites d’intervention et le calendrier.",
      solution: { label: "Géolocalisation", href: "/solutions/geolocalisation#installation-terrain" },
    },
    {
      id: "flotte-operations",
      title: "Flotte et opérations",
      covers:
        "Organisation du suivi de la flotte : visibilité sur les véhicules, trajets, missions et tournées, alertes et accès des utilisateurs.",
      define:
        "Les rôles et droits d’accès, les règles d’alerte, les indicateurs utiles et le niveau d’assistance prévu au contrat.",
      solution: { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte#pilotage" },
    },
    {
      id: "supervision-reporting",
      title: "Supervision et reporting",
      covers:
        "Mise en place de tableaux de bord et de rapports opérationnels, avec vérification des alertes, des rapports et des droits avant la mise en exploitation.",
      define:
        "Les indicateurs à suivre, la fréquence et les destinataires des rapports, les intégrations à étudier.",
      solution: { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte#tableaux-de-bord" },
    },
  ],
};

export const projectApproachPhases: DeploymentPhase[] = [
  {
    id: "cadrage",
    step: "01",
    title: "Cadrage",
    description:
      "Compréhension du besoin, des parties prenantes, du parc existant et des indicateurs de réussite.",
  },
  {
    step: "02",
    title: "Architecture",
    description:
      "Choix des équipements, des flux de données, des accès utilisateurs et de l’architecture logicielle cible.",
  },
  {
    step: "03",
    title: "Préparation",
    description:
      "Planification des installations, des intégrations et des jalons de validation avec le client.",
  },
  {
    id: "deploiement",
    step: "04",
    title: "Déploiement",
    description:
      "Installation sur le terrain, paramétrage, tests de bout en bout et montée en charge progressive.",
  },
  {
    step: "05",
    title: "Recette",
    description:
      "Validation fonctionnelle, vérification des alertes, des rapports et des droits avant mise en exploitation.",
  },
  {
    id: "transfert-suivi",
    step: "06",
    title: "Transfert et suivi",
    description:
      "Formation, documentation, transfert de compétences et assistance selon le contrat de maintenance.",
  },
];

export const historicalReferences = {
  title: "Références et accompagnements historiques",
  disclaimer:
    "Ces mentions se rapportent à l’historique d’ONLOUTOU et ne constituent pas nécessairement une liste de relations contractuelles actuellement actives.",
  names: ["BNI", "BANQUE ATLANTIQUE", "COMOÉ CAPITAL"],
  comoeNote:
    "Comoé Capital : investisseur historique d’ONLOUTOU en 2019, avec une sortie annoncée en 2021.",
};

export const tenderSection = {
  title: "Appels d’offres et projets sur mesure",
  description:
    "ONLOUTOU peut intervenir sur des projets structurés, de l’expression du besoin à l’exploitation courante.",
  points: [
    "Analyse d’un cahier des charges",
    "Conception de l’architecture",
    "Sélection des équipements",
    "Élaboration d’une proposition technique",
    "Développement de plateformes",
    "Déploiement",
    "Formation",
    "Support contractuel",
  ],
};

export const expertiseContact = {
  id: "contact-expertise",
  title: "Confiez-nous votre projet",
  description:
    "Partagez votre contexte opérationnel ou institutionnel. Nous vous répondons avec une approche claire et un périmètre adapté.",
};
