import { deploymentPhases } from "@/content/capabilities";
import { siteMedia } from "@/content/media";
import { site } from "@/content/site";
import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export const fleetManagementSeo = {
  title: "Gestion de flotte et supervision des opérations",
  description:
    "ONLOUTOU accompagne la supervision des véhicules, des événements, des historiques et du reporting pour une gestion de flotte adaptée aux opérations.",
};

export const fleetManagementMedia = {
  heroPhoto: {
    src: "/assets/images/projects/project-b/operation-logistique-depot-abidjan.png",
    alt: "Opération logistique impliquant plusieurs véhicules à Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "40% 32%",
  },
  dashboardOperations: siteMedia.dashboards.supervision,
  dashboardMap: siteMedia.dashboards.geolocalisationAbidjan,
  driverPhoto: {
    src: "/assets/images/projects/project-b/conducteur-routes-abidjan.png",
    alt: "Conducteur professionnel circulant sur une route d’Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "30% 38%",
  },
  logisticsPhoto: {
    src: "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
    alt: "Mobilité professionnelle dans une cour logistique",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
};

export const fleetHero = {
  eyebrow: "SOLUTION · GESTION DE FLOTTE",
  titleBefore: "Transformez le suivi de votre flotte en ",
  titleHighlight: "décisions opérationnelles.",
  intro:
    "ONLOUTOU accompagne les organisations qui souhaitent centraliser la supervision de leurs véhicules, mieux lire les événements disponibles et structurer le suivi de leurs opérations.",
  caveat:
    "Les informations accessibles dépendent des équipements, des sources de données et de la configuration retenue.",
  primaryCta: { label: "Étudier ma flotte", href: "/contact" },
  secondaryCta: { label: "Découvrir le pilotage", href: "#pilotage" },
};

export const fleetOperationalBand = [
  "Visibilité des opérations",
  "Coordination des véhicules",
  "Traitement des événements",
  "Synthèse et reporting",
] as const;

export const fleetPilotage = {
  id: "pilotage",
  title: "Une flotte ne se pilote pas seulement sur une carte.",
  lead:
    "Voir une position est une première étape. Le pilotage consiste ensuite à replacer les déplacements, arrêts, événements et historiques disponibles dans le contexte réel des opérations.",
  disclaimer: "Interface de démonstration — les données affichées sont illustratives.",
  points: [
    "Centraliser les véhicules et actifs configurés",
    "Consulter les états disponibles",
    "Retrouver les événements utiles",
    "Faciliter le suivi par les équipes autorisées",
    "Produire des synthèses adaptées au projet",
  ],
};

export const fleetDashboardViews = {
  id: "tableaux-de-bord",
  title: "Centre de supervision",
  intro:
    "Consultez les vues utiles au pilotage quotidien — selon les droits et la configuration de votre organisation.",
  disclaimer: "Interfaces de démonstration — les données affichées sont illustratives.",
  tabs: [
    { id: "operations", label: "Vue opérations" },
    { id: "cartographie", label: "Vue cartographique" },
  ] as const,
};

export const fleetOperationalDay = {
  title: "Du départ au compte rendu.",
  steps: [
    {
      title: "Préparer",
      description: "Identifier les véhicules et informations utiles avant l’activité.",
    },
    {
      title: "Suivre",
      description: "Consulter les positions, mouvements et états accessibles pendant l’opération.",
    },
    {
      title: "Réagir",
      description: "Prendre connaissance des alertes ou événements configurés.",
    },
    {
      title: "Vérifier",
      description: "Revenir sur l’historique disponible pour comprendre une situation.",
    },
    {
      title: "Rapporter",
      description: "Partager une synthèse adaptée aux besoins de l’organisation.",
    },
  ],
};

export const fleetCapabilityGroups = [
  {
    id: "supervise",
    title: "Superviser",
    items: [
      "Parc visible depuis un espace centralisé",
      "Positions et historiques disponibles",
      "États remontés selon le dispositif",
      "Recherche et filtres",
    ],
  },
  {
    id: "organize",
    title: "Organiser",
    items: [
      "Groupes de véhicules ou d’actifs",
      "Profils et droits d’accès",
      "Repères opérationnels",
      "Affectations lorsque la configuration le permet",
    ],
  },
  {
    id: "inform",
    title: "Être informé",
    items: [
      "Alertes configurables",
      "Entrées et sorties de géozones",
      "Mouvements ou arrêts disponibles",
      "Événements issus des équipements compatibles",
    ],
  },
  {
    id: "analyze",
    title: "Analyser",
    items: [
      "Historiques",
      "Exports",
      "Rapports configurables",
      "Synthèses adaptées aux besoins du projet",
    ],
  },
  {
    id: "evolve",
    title: "Faire évoluer",
    items: [
      "Ajout progressif d’actifs",
      "Intégrations étudiées",
      "Accompagnement des équipes",
      "Évolution du paramétrage",
    ],
  },
] as const;

export const fleetCapabilityNote =
  "Chaque capacité dépend du matériel installé, des données disponibles et du périmètre validé.";

export const fleetTeamViews = {
  title: "La bonne information pour chaque rôle.",
  roles: [
    {
      title: "Direction",
      points: [
        "Vue synthétique",
        "Suivi global",
        "Rapports disponibles",
        "Lecture des tendances opérationnelles sans indicateurs inventés",
      ],
    },
    {
      title: "Responsable de flotte",
      points: [
        "Suivi quotidien",
        "Recherche d’événements",
        "Consultation des véhicules",
        "Préparation des synthèses",
      ],
    },
    {
      title: "Équipes terrain",
      points: [
        "Information utile à l’opération",
        "Remontée des situations",
        "Accompagnement et formation",
        "Accès selon les autorisations",
      ],
    },
  ],
};

export const fleetTerrain = {
  title: "Le pilotage doit rester connecté au terrain.",
  lead:
    "Une plateforme utile doit tenir compte des véhicules, des conducteurs, de la couverture réseau, des habitudes de travail et des contraintes propres à chaque activité.",
  contexts: [
    "Mobilité professionnelle",
    "Transport et livraison",
    "Interventions terrain",
    "Équipements ou actifs mobiles",
    "Projets multisites",
  ],
  contextNote: "Exemples de contextes — liste non exhaustive.",
};

export const fleetReporting = {
  title: "Des informations à transformer en suivi utile.",
  lead:
    "Le reporting s’appuie sur les historiques et événements effectivement disponibles pour votre projet.",
  axes: [
    "Historique disponible",
    "Filtres selon les besoins",
    "Export ou rapports selon la configuration",
    "Accès contrôlé",
    "Intégrations étudiées au cas par cas",
  ],
  illustrationLabel: "Illustration",
  illustrationRows: [
    { label: "Période", value: "À définir avec le projet" },
    { label: "Véhicules", value: "Selon parc configuré" },
    { label: "Événements", value: "Types disponibles" },
    { label: "Format", value: "Export / rapport" },
  ],
};

export const fleetDeploymentPhases: DeploymentPhase[] = [
  {
    step: "01",
    title: "Cadrer les opérations",
    description:
      "Comprendre les usages, les rôles et les informations nécessaires au pilotage avant toute configuration.",
  },
  {
    step: "02",
    title: "Identifier les véhicules et les besoins",
    description: deploymentPhases[0].description,
  },
  {
    step: "03",
    title: "Définir les équipements et données utiles",
    description: deploymentPhases[1].description,
  },
  {
    step: "04",
    title: "Installer et paramétrer",
    description: deploymentPhases[2].description,
  },
  {
    step: "05",
    title: "Tester avec les équipes",
    description: deploymentPhases[3].description,
  },
  {
    step: "06",
    title: "Accompagner l’exploitation",
    description: `${deploymentPhases[4].description} ${deploymentPhases[5].description}`,
  },
];

export const fleetFaq: ServiceFaqItem[] = [
  {
    question: "Quelle est la différence entre géolocalisation et gestion de flotte ?",
    answer:
      "La géolocalisation permet principalement de consulter les positions et événements disponibles. La gestion de flotte ajoute une organisation opérationnelle autour des véhicules, des utilisateurs, des historiques, des alertes et des rapports configurés.",
  },
  {
    question: "Peut-on superviser plusieurs types de véhicules ?",
    answer:
      "La configuration peut être étudiée pour différents véhicules ou actifs, sous réserve de compatibilité des équipements et des données recherchées.",
  },
  {
    question: "Les alertes sont-elles automatiques ?",
    answer:
      "Les alertes disponibles doivent être configurées selon le matériel, les événements remontés et les règles retenues pour le projet.",
  },
  {
    question: "Peut-on créer différents accès utilisateurs ?",
    answer:
      "Des profils et droits d’accès peuvent être définis selon les capacités de la plateforme et l’organisation du projet.",
  },
  {
    question: "Peut-on intégrer la solution à un autre système ?",
    answer:
      "Les possibilités d’intégration sont étudiées au cas par cas selon les systèmes concernés, les accès techniques et le périmètre validé.",
  },
  {
    question: "ONLOUTOU accompagne-t-il les équipes ?",
    answer:
      "L’accompagnement peut inclure le cadrage, le paramétrage, les tests, la prise en main et la formation selon le projet.",
  },
];

export const fleetEditorialNotice =
  "La disponibilité des positions, événements, alertes, historiques, rapports et données véhicule dépend des équipements installés, de la connectivité, de la compatibilité technique et de la configuration retenue. Les fonctionnalités avancées sont validées avant déploiement.";

export const fleetFinalCta = {
  titleBefore: "Construisons un pilotage ",
  titleHighlight: "adapté à votre flotte.",
  lead:
    "Présentez-nous votre parc, vos opérations, les rôles de vos équipes et les informations dont vous avez réellement besoin.",
  primary: { label: "Présenter ma flotte", href: "/contact" },
  secondary: { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
  phoneLabel: "Appeler ONLOUTOU",
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
};

export const fleetBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Gestion de flotte" },
];

export function fleetBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${baseUrl}/solutions` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Gestion de flotte",
        item: `${baseUrl}/solutions/gestion-de-flotte`,
      },
    ],
  };
}

export function fleetServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gestion de flotte et supervision des opérations",
    provider: { "@type": "Organization", name: site.name },
    areaServed: "Côte d’Ivoire",
    url: `${baseUrl}/solutions/gestion-de-flotte`,
    description: fleetManagementSeo.description,
  };
}
