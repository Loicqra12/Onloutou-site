import { deploymentPhases } from "@/content/capabilities";
import { siteMedia } from "@/content/media";
import { site } from "@/content/site";
import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export const geolocationSeo = {
  title: "Géolocalisation et suivi de flotte",
  description:
    "ONLOUTOU accompagne l’installation et le déploiement de solutions de géolocalisation, de suivi de flotte, d’alertes et de supervision adaptées aux opérations.",
};

export const geolocationMedia = {
  illustration: siteMedia.illustrations.geolocalisation,
  dashboardMap: siteMedia.dashboards.geolocalisationAbidjan,
  dashboardSupervision: siteMedia.dashboards.supervision,
  installBerline: siteMedia.solutions.installationBerline,
  installTraceur: siteMedia.solutions.installationTraceur,
  inspectCabling: siteMedia.solutions.inspectionCablage,
  contextMobility: {
    src: "/assets/images/projects/project-b/conducteur-routes-abidjan.png",
    alt: "Conducteur professionnel sur route à Abidjan — contexte opérationnel.",
    width: 1536,
    height: 1024,
    objectPosition: "55% 42%",
  },
};

export const geolocationHero = {
  eyebrow: "SOLUTION · GÉOLOCALISATION",
  titleBefore: "Gardez vos véhicules et vos actifs dans votre ",
  titleHighlight: "champ de vision.",
  intro:
    "ONLOUTOU accompagne les organisations dans l’installation, le paramétrage et l’exploitation de solutions de géolocalisation adaptées à leurs véhicules, équipements et opérations.",
  caveat:
    "Les fonctionnalités disponibles dépendent des équipements installés, de la connectivité et de la configuration retenue.",
  primaryCta: { label: "Étudier mon besoin", href: "/contact" },
  secondaryCta: { label: "Voir comment cela fonctionne", href: "#fonctionnement" },
  svgCaption: "Illustration du fonctionnement — données et positions fictives.",
};

export const geolocationCapabilityBand = [
  "Installation terrain",
  "Position et historique",
  "Alertes et géozones",
  "Supervision des actifs",
] as const;

export const geolocationFieldIntro = {
  title: "Une solution commence sur le terrain.",
  lead:
    "La qualité du suivi dépend autant du choix du dispositif que de son installation, de son paramétrage et de la compréhension des usages opérationnels.",
  points: [
    "Étude du véhicule ou de l’actif",
    "Choix de l’emplacement",
    "Raccordement et paramétrage",
    "Tests de transmission et prise en main",
  ],
};

export const geolocationProcess = {
  id: "fonctionnement",
  title: "Du mouvement à l’information exploitable.",
  steps: [
    {
      title: "Équiper",
      description:
        "Un dispositif compatible est installé sur le véhicule ou l’actif, selon le contexte validé.",
    },
    {
      title: "Transmettre",
      description:
        "Les informations disponibles sont envoyées par le réseau compatible avec l’équipement.",
    },
    {
      title: "Visualiser",
      description:
        "La plateforme centralise les positions, événements et historiques configurés.",
    },
    {
      title: "Agir",
      description:
        "Les équipes utilisent les alertes, rapports et informations disponibles pour mieux superviser leurs opérations.",
    },
  ],
};

export const geolocationPlatform = {
  id: "plateforme",
  title: "Une vision centralisée de vos opérations.",
  intro:
    "La plateforme peut rassembler la localisation, les événements, les états disponibles et les outils de suivi utiles à votre organisation.",
  disclaimer: "Interfaces de démonstration — les données affichées sont illustratives.",
  tabs: [
    { id: "localisation", label: "Localisation" },
    { id: "supervision", label: "Supervision" },
  ] as const,
};

export const geolocationBento = {
  title: "Capacités de supervision",
  note:
    "Les fonctions disponibles varient selon le matériel, la source de données, la connectivité et le périmètre du projet.",
  items: [
    { id: "loc", title: "Localisation disponible", size: "large" as const },
    { id: "hist", title: "Historique de trajets", size: "medium" as const },
    { id: "alert", title: "Alertes configurables", size: "medium" as const },
    { id: "geo", title: "Géozones", size: "small" as const },
    { id: "stop", title: "Suivi des arrêts et mouvements", size: "small" as const },
    { id: "multi", title: "Plusieurs véhicules ou actifs", size: "large" as const },
    { id: "access", title: "Accès et profils utilisateurs", size: "small" as const },
    { id: "report", title: "Rapports selon la configuration", size: "medium" as const },
    { id: "integ", title: "Intégrations étudiées selon le projet", size: "medium" as const },
  ],
};

export const geolocationInstallationStory = {
  title: "Installer, contrôler, mettre en service.",
  steps: [
    "Préparation",
    "Installation",
    "Paramétrage",
    "Contrôle",
    "Test de transmission",
    "Accompagnement des utilisateurs",
  ],
};

export const geolocationUseCases = {
  title: "Usages adaptés aux réalités opérationnelles",
  cases: [
    {
      title: "Flottes professionnelles",
      description: "Suivre les véhicules mobilisés dans les opérations quotidiennes.",
    },
    {
      title: "Logistique et livraison",
      description: "Mieux visualiser les déplacements et les événements disponibles.",
    },
    {
      title: "Équipements et actifs mobiles",
      description:
        "Étudier un dispositif adapté à la nature de l’actif et à son alimentation.",
    },
    {
      title: "Projets spécifiques",
      description:
        "Combiner matériel, connectivité, plateforme, reporting et intégrations selon le besoin.",
    },
  ],
};

/** Phases dérivées de `deploymentPhases`, libellés adaptés à la géolocalisation. */
export const geolocationDeploymentPhases: DeploymentPhase[] = [
  {
    step: "01",
    title: "Cadrer",
    description: deploymentPhases[0].description,
  },
  {
    step: "02",
    title: "Analyser",
    description:
      "Choix des équipements et validation de la compatibilité véhicule / actif avant installation.",
  },
  {
    step: "03",
    title: "Préparer",
    description: deploymentPhases[1].description,
  },
  {
    step: "04",
    title: "Installer",
    description: deploymentPhases[2].description,
  },
  {
    step: "05",
    title: "Tester",
    description: deploymentPhases[3].description,
  },
  {
    step: "06",
    title: "Accompagner",
    description: `${deploymentPhases[4].description} ${deploymentPhases[5].description}`,
  },
];

export const geolocationFaq: ServiceFaqItem[] = [
  {
    question: "La géolocalisation est-elle compatible avec tous les véhicules ?",
    answer:
      "La compatibilité dépend du véhicule, de l’actif, du dispositif et des données recherchées. Une vérification préalable est nécessaire avant toute installation.",
  },
  {
    question: "Peut-on suivre plusieurs véhicules depuis la même interface ?",
    answer:
      "Une organisation peut centraliser plusieurs actifs selon la configuration retenue et les droits d’accès définis.",
  },
  {
    question: "La plateforme fonctionne-t-elle sans réseau mobile ?",
    answer:
      "La transmission dépend de la couverture et du dispositif. Certains équipements peuvent conserver temporairement des informations, selon leurs caractéristiques, avant transmission.",
  },
  {
    question: "Peut-on créer des alertes et des géozones ?",
    answer:
      "Ces fonctions peuvent être configurées lorsque le matériel et la plateforme retenus les prennent en charge.",
  },
  {
    question: "ONLOUTOU réalise-t-il l’installation ?",
    answer:
      "ONLOUTOU peut accompagner l’étude, l’installation, le paramétrage, les tests et la prise en main selon le périmètre convenu.",
  },
];

export const geolocationEditorialNotice =
  "La disponibilité des positions, alertes, historiques et données véhicule dépend notamment du dispositif installé, de la couverture réseau, de la source d’alimentation, de la compatibilité du véhicule et de la configuration du projet. Toute fonction avancée fait l’objet d’une validation préalable.";

export const geolocationFinalCta = {
  title: "Étudions la solution adaptée à vos ",
  titleHighlight: "opérations.",
  lead:
    "Présentez-nous vos véhicules, vos actifs, vos contraintes terrain et les informations dont vos équipes ont besoin.",
  primary: { label: "Parler de mon projet", href: "/contact" },
  phoneLabel: "Appeler ONLOUTOU",
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
};

export const geolocationBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Géolocalisation" },
];

export function geolocationBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${baseUrl}/solutions` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Géolocalisation",
        item: `${baseUrl}/solutions/geolocalisation`,
      },
    ],
  };
}

export function geolocationServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Géolocalisation et suivi de flotte",
    provider: { "@type": "Organization", name: site.name },
    areaServed: "Côte d’Ivoire",
    url: `${baseUrl}/solutions/geolocalisation`,
    description: geolocationSeo.description,
  };
}
