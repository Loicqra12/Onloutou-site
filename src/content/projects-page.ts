import { site } from "@/content/site";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export const projectsSeo = {
  title: "Projets terrain, équipements et plateformes numériques",
  description:
    "Découvrez les domaines de projets qu’ONLOUTOU peut accompagner : mobilité, équipements, géolocalisation, supervision, plateformes numériques et déploiement terrain.",
};

export const projectsPositioning =
  "ONLOUTOU accompagne des projets qui relient les réalités du terrain, les équipements, les données et les outils numériques.";

export const projectsImageDisclaimer =
  "Illustrations de domaines d’intervention et de situations de projet.";

const projectA = "/assets/images/projects/project-a";
const projectB = "/assets/images/projects/project-b";

export type ProjectMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
  caption?: string;
};

export const projectsMedia = {
  reunion: {
    src: `${projectA}/reunion-projet-numerique.png`,
    alt: "Équipe en réunion autour d’un outil numérique et d’une tablette",
    width: 1536,
    height: 1024,
    objectPosition: "72% 40%",
    caption: "Illustration d’un atelier de conception autour d’un outil numérique.",
  },
  warehouse: {
    src: `${projectA}/gestion-equipements-entrepot.png`,
    alt: "Opératrice scannant des équipements dans un entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  supervision: {
    src: `${projectA}/supervision-flotte-abidjan.png`,
    alt: "Écran de démonstration de supervision de flotte consulté depuis un bureau — données illustratives",
    width: 1536,
    height: 1024,
    objectPosition: "72% 42%",
  },
  gpsInstall: {
    src: `${projectA}/installation-gps-embarque.png`,
    alt: "Technicien installant un dispositif GPS embarqué dans un pick-up",
    width: 1536,
    height: 1024,
    objectPosition: "62% 48%",
  },
  mobility: {
    src: `${projectA}/mobilite-professionnelle-cour-logistique.png`,
    alt: "Utilitaire, berline et scooter présentés dans une cour logistique",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  gpsWiring: {
    src: `${projectB}/raccordement-boitier-gps.png`,
    alt: "Raccordement précis d’un boîtier GPS dans un véhicule",
    width: 1536,
    height: 1024,
    objectPosition: "55% 45%",
  },
  cabling: {
    src: `${projectB}/controle-cablage-automobile.png`,
    alt: "Contrôle précis d’un câblage automobile",
    width: 1536,
    height: 1024,
    objectPosition: "50% 42%",
  },
  depot: {
    src: `${projectB}/operation-logistique-depot-abidjan.png`,
    alt: "Opération logistique avec véhicules dans un dépôt à Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "40% 32%",
  },
  driver: {
    src: `${projectB}/conducteur-routes-abidjan.png`,
    alt: "Conducteur sur les routes d’Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "48% 38%",
  },
  generator: {
    src: `${projectB}/inspection-groupe-electrogene.png`,
    alt: "Technicien inspectant un groupe électrogène",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
  },
  training: {
    src: `${projectB}/formation-dispositif-connecte.png`,
    alt: "Formation terrain à l’utilisation d’un dispositif connecté",
    width: 1536,
    height: 1024,
    objectPosition: "48% 38%",
  },
} as const satisfies Record<string, ProjectMedia>;

export const projectsHero = {
  eyebrow: "PROJETS · TERRAIN · TECHNOLOGIE",
  titleBefore: "Construire des solutions qui tiennent compte ",
  titleHighlight: "du terrain.",
  intro:
    "ONLOUTOU accompagne des projets qui peuvent associer équipements, mobilité, connectivité, plateformes numériques et déploiement opérationnel.",
  caveat:
    "Chaque périmètre est défini selon le besoin, les utilisateurs, les contraintes et les responsabilités du projet.",
  primaryCta: { label: "Explorer les domaines", href: "#domaines-projets" },
  secondaryCta: { label: "Présenter mon projet", href: "#brief-projet" },
  editorialRef: "01",
};

export const projectsDimensions = {
  lead: "Un projet peut mobiliser une seule de ces dimensions ou en associer plusieurs.",
  items: ["Comprendre", "Équiper", "Connecter", "Construire", "Accompagner"] as const,
};

export type ProjectDomainId = "platforms" | "logistics" | "fleet" | "connected" | "mobility";

export const projectsDomains = {
  id: "domaines-projets",
  title: "Des projets à la croisée de plusieurs métiers.",
  items: [
    {
      id: "platforms" as ProjectDomainId,
      number: "01",
      title: "Plateformes et outils métier",
      mediaKey: "reunion" as const,
      topics: [
        "Cadrage",
        "Parcours utilisateurs",
        "Plateforme Web",
        "Application mobile",
        "Tableau de bord",
        "Intégrations à étudier",
      ],
      link: { label: "Plateformes sur mesure", href: "/solutions/plateformes-sur-mesure" },
    },
    {
      id: "logistics" as ProjectDomainId,
      number: "02",
      title: "Équipements et logistique",
      mediaKey: "warehouse" as const,
      topics: ["Qualification", "Mobilité", "Matériel", "Suivi", "Organisation", "Mise à disposition ou acquisition à étudier"],
      link: { label: "Hub équipements", href: "/equipements" },
    },
    {
      id: "fleet" as ProjectDomainId,
      number: "03",
      title: "Supervision de flotte",
      mediaKey: "supervision" as const,
      topics: ["Véhicules", "Événements", "Historique", "Alertes", "Accès", "Reporting"],
      link: { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
    },
    {
      id: "connected" as ProjectDomainId,
      number: "04",
      title: "Déploiement d’équipements connectés",
      mediaKey: "gpsInstall" as const,
      topics: ["Étude", "Installation", "Paramétrage", "Transmission", "Tests", "Prise en main"],
      link: { label: "Géolocalisation", href: "/solutions/geolocalisation" },
    },
    {
      id: "mobility" as ProjectDomainId,
      number: "05",
      title: "Mobilité professionnelle",
      mediaKey: "mobility" as const,
      topics: [
        "Location",
        "Acquisition",
        "Besoins terrain",
        "Usage ponctuel",
        "Opérations récurrentes",
        "Services associés à préciser",
      ],
      links: [
        { label: "Location", href: "/solutions/location" },
        { label: "Acquisition", href: "/solutions/vente" },
      ],
    },
  ],
};

export const projectsFraming = {
  title: "Avant la solution, il faut clarifier le problème.",
  questions: [
    "Qui rencontre le problème ?",
    "Dans quelle situation ?",
    "Quelles informations sont disponibles ?",
    "Quels équipements sont concernés ?",
    "Quelles actions doivent être facilitées ?",
    "Quelles contraintes sont imposées par le terrain ?",
    "Quels systèmes doivent communiquer ?",
    "Comment le résultat sera validé ?",
  ],
  synthesisLabel: "Zone de synthèse",
  synthesisHint: "À compléter lors du cadrage — aucune réponse imposée sur cette page.",
};

export const projectsFieldMethod = {
  id: "terrain-methode",
  title: "La méthode se vérifie sur le terrain.",
  steps: [
    {
      title: "Préparer",
      message: "Préparer le matériel, les accès et les conditions d’intervention.",
      mediaKey: "gpsWiring" as const,
    },
    {
      title: "Contrôler",
      message: "Vérifier la compatibilité, le raccordement et la qualité de l’installation.",
      mediaKey: "cabling" as const,
    },
    {
      title: "Déployer",
      message: "Coordonner le matériel, les véhicules et les personnes concernées.",
      mediaKey: "depot" as const,
    },
    {
      title: "Observer",
      message: "Tenir compte de l’usage réel et des contraintes des utilisateurs.",
      mediaKey: "driver" as const,
    },
    {
      title: "Vérifier l’équipement",
      message: "Contrôler les caractéristiques et les conditions d’exploitation.",
      mediaKey: "generator" as const,
    },
    {
      title: "Accompagner",
      message: "Préparer la prise en main, les règles d’usage et la continuité opérationnelle.",
      mediaKey: "training" as const,
    },
  ],
};

export const projectsScopeLayers = {
  title: "Un projet peut mobiliser plusieurs savoir-faire.",
  note: "Le périmètre retenu est défini dans la proposition applicable.",
  layers: [
    {
      title: "Cadrer",
      items: ["Cadrage fonctionnel", "Étude terrain", "Qualification des équipements"],
    },
    {
      title: "Équiper",
      items: ["Sourcing ou mise à disposition", "Installation"],
    },
    {
      title: "Connecter",
      items: ["Connectivité", "Intégration"],
    },
    {
      title: "Construire",
      items: ["Développement Web", "Développement mobile", "Dashboard"],
    },
    {
      title: "Déployer",
      items: ["Tests", "Documentation"],
    },
    {
      title: "Accompagner",
      items: ["Formation", "Maintenance contractuelle", "Accompagnement"],
    },
  ],
};

export const projectsDeliverables = {
  title: "Livrables possibles",
  note: "Les livrables dépendent du périmètre et des validations du projet.",
  items: [
    "Note de cadrage",
    "Cartographie des utilisateurs",
    "Architecture fonctionnelle",
    "Recommandation d’équipements",
    "Plan de déploiement",
    "Maquettes",
    "Plateforme",
    "Application",
    "Tableau de bord",
    "Documentation",
    "Support de formation",
    "Rapport de tests",
    "Conditions de maintenance",
  ],
};

export const projectsConfidentiality = {
  title: "Montrer les capacités sans exposer les projets.",
  lead:
    "Certaines interventions peuvent comporter des informations opérationnelles, techniques ou commerciales qui ne doivent pas être publiées. Les exemples visuels de cette page servent à présenter des domaines d’intervention sans révéler de données confidentielles.",
  exclusions: [
    "Pas de données de flotte réelles",
    "Pas de coordonnées de véhicules",
    "Pas de prix",
    "Pas de contrat",
    "Pas de SLA",
    "Pas de captures client confidentielles",
    "Pas de nom de projet sans autorisation",
  ],
};

export const projectsMethodPhases = {
  title: "Méthode projet",
  phases: [
    {
      title: "Cadrer",
      description: "Comprendre le problème, les utilisateurs, les contraintes et les objectifs du projet.",
    },
    {
      title: "Observer",
      description: "Analyser le terrain, les usages réels et les conditions d’exploitation.",
    },
    {
      title: "Concevoir",
      description: "Structurer le périmètre fonctionnel, les parcours et les choix techniques à valider.",
    },
    {
      title: "Préparer",
      description: "Organiser le matériel, les accès, les environnements et les jalons de validation.",
    },
    {
      title: "Déployer",
      description: "Installer, paramétrer, tester et mettre en service les éléments validés.",
    },
    {
      title: "Accompagner",
      description: "Transférer les compétences, documenter et définir les modalités de suivi prévues.",
    },
  ],
};

export const projectsBriefOptions = {
  domains: [
    { id: "mobility", label: "mobilité" },
    { id: "equipment", label: "équipements" },
    { id: "geo", label: "géolocalisation" },
    { id: "fleet", label: "gestion de flotte" },
    { id: "platform", label: "plateforme numérique" },
    { id: "field", label: "déploiement terrain" },
    { id: "multi", label: "plusieurs domaines" },
    { id: "tbd", label: "besoin à définir" },
  ],
  situations: [
    { id: "idea", label: "idée à cadrer" },
    { id: "known", label: "besoin déjà identifié" },
    { id: "spec", label: "cahier des charges disponible" },
    { id: "equip", label: "équipements déjà disponibles" },
    { id: "improve", label: "outil existant à améliorer" },
    { id: "resume", label: "projet déjà commencé" },
  ],
  users: [
    { id: "internal", label: "équipe interne" },
    { id: "drivers", label: "conducteurs" },
    { id: "field", label: "agents terrain" },
    { id: "partners", label: "partenaires" },
    { id: "delivery", label: "livreurs" },
    { id: "clients", label: "clients" },
    { id: "multi", label: "plusieurs profils" },
  ],
  needs: [
    { id: "study", label: "étude" },
    { id: "equipment", label: "équipement" },
    { id: "install", label: "installation" },
    { id: "platform", label: "plateforme" },
    { id: "integration", label: "intégration" },
    { id: "training", label: "formation" },
    { id: "full", label: "accompagnement complet" },
    { id: "tbd", label: "besoin à préciser" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "autre ville de Côte d’Ivoire" },
    { id: "multi", label: "plusieurs zones" },
    { id: "other", label: "autre pays ou zone à préciser" },
  ],
  timelines: [
    { id: "tbd", label: "à définir" },
    { id: "soon", label: "projet prochain" },
    { id: "progressive", label: "déploiement progressif" },
    { id: "deadline", label: "échéance à préciser" },
  ],
};

export function buildProjectBriefSummary(s: {
  domainLabel: string;
  situationLabel: string;
  usersLabel: string;
  needLabel: string;
  zoneLabel: string;
  timelineLabel: string;
}) {
  return `Je souhaite étudier un projet lié à ${s.domainLabel}. Situation actuelle : ${s.situationLabel}. Utilisateurs : ${s.usersLabel}. Besoin attendu : ${s.needLabel}. Zone : ${s.zoneLabel}. Calendrier : ${s.timelineLabel}.`;
}

export function buildProjectWhatsAppUrl(s: Parameters<typeof buildProjectBriefSummary>[0]) {
  const summary = buildProjectBriefSummary(s);
  return whatsappUrlForMessage(`Bonjour ONLOUTOU, ${summary} Pouvez-vous m’orienter pour un premier cadrage ?`);
}

export const projectsFaq: ServiceFaqItem[] = [
  {
    question: "ONLOUTOU intervient-il uniquement sur des projets de géolocalisation ?",
    answer:
      "Non. Un projet peut concerner la mobilité, les équipements, la supervision, une plateforme numérique ou plusieurs dimensions combinées.",
  },
  {
    question: "Faut-il déjà disposer d’un cahier des charges ?",
    answer:
      "Non. Le cadrage peut commencer par le problème, les utilisateurs, les contraintes et les résultats attendus.",
  },
  {
    question: "Les images représentent-elles des projets clients ?",
    answer:
      "Les images illustrent des situations et des domaines d’intervention. Elles ne doivent pas être interprétées comme des preuves de réalisation pour un client identifié.",
  },
  {
    question: "Peut-on reprendre un projet déjà commencé ?",
    answer:
      "Une reprise peut être étudiée après analyse du périmètre existant, de la documentation, des accès et de l’état technique.",
  },
  {
    question: "ONLOUTOU peut-il fournir le matériel et la plateforme ?",
    answer:
      "Une combinaison entre équipements, installation et plateforme peut être étudiée lorsque le projet le nécessite.",
  },
  {
    question: "Comment sont définis les délais ?",
    answer:
      "Le calendrier dépend du périmètre, des dépendances, des validations, du matériel et des intégrations. Il est défini après cadrage.",
  },
  {
    question: "La maintenance est-elle comprise ?",
    answer:
      "La maintenance et le support sont précisés contractuellement lorsqu’ils font partie du périmètre.",
  },
];

export const projectsEditorialNotice =
  "Les scènes et interfaces présentées illustrent des domaines de projet et une méthode de travail. Elles ne constituent pas des cas clients nominatifs, des engagements contractuels ou des résultats mesurés.";

export const projectsFinalCta = {
  titleBefore: "Votre projet mérite ",
  titleHighlight: "un cadrage",
  titleAfter: " avant une promesse.",
  lead:
    "Présentez le problème, les utilisateurs, le terrain, les équipements concernés et le résultat attendu. ONLOUTOU pourra structurer les premières bases du projet.",
  primary: { label: "Préparer mon brief", href: "#brief-projet" },
  secondary: { label: "Parler à ONLOUTOU", href: "/contact" },
};

export const projectsBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Projets" },
];

export function projectsBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Projets", item: `${baseUrl}/projets` },
    ],
  };
}

export function projectsCollectionJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: projectsSeo.title,
    description: projectsSeo.description,
    url: `${baseUrl}/projets`,
    isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  };
}
