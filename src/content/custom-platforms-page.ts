import { site } from "@/content/site";
import { siteMedia } from "@/content/media";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export const customPlatformsSeo = {
  title: "Plateformes Web, mobiles et outils métier sur mesure",
  description:
    "ONLOUTOU accompagne le cadrage et le développement de plateformes Web, applications mobiles, tableaux de bord, portails et outils métier adaptés aux opérations.",
};

export const customPlatformsPositioning =
  "ONLOUTOU accompagne la transformation d’un besoin opérationnel en plateforme Web, application mobile, tableau de bord ou outil métier adapté au projet.";

export const customPlatformsMedia = {
  workshop: {
    src: "/assets/images/projects/project-a/reunion-projet-numerique.png",
    alt: "Équipe en réunion autour d’un outil numérique et d’une tablette",
    width: 1536,
    height: 1024,
    objectPosition: "72% 40%",
  },
  ecosystem: siteMedia.illustrations.ecosysteme,
  dashboard: siteMedia.dashboards.supervision,
  fieldTraining: {
    src: "/assets/images/projects/project-b/formation-dispositif-connecte.png",
    alt: "Formation terrain à l’utilisation d’un dispositif connecté",
    width: 1536,
    height: 1024,
    objectPosition: "48% 38%",
  },
  equip: {
    src: "/assets/images/projects/project-b/inspection-groupe-electrogene.png",
    alt: "Technicien inspectant un groupe électrogène",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
  },
  connect: {
    src: "/assets/images/projects/project-a/installation-gps-embarque.png",
    alt: "Technicien installant un dispositif GPS embarqué dans un véhicule",
    width: 1536,
    height: 1024,
    objectPosition: "62% 48%",
  },
};

export const illustrationDisclaimer =
  "Illustration fonctionnelle — l’interface finale dépend du projet.";

export const customPlatformsHero = {
  eyebrow: "SOLUTION · PLATEFORMES SUR MESURE",
  titleBefore: "Construisons les outils numériques ",
  titleHighlight: "adaptés à vos opérations.",
  intro:
    "ONLOUTOU accompagne le cadrage, la conception et le développement de plateformes Web, d’applications mobiles, de tableaux de bord et d’outils métier pensés autour des utilisateurs.",
  caveat:
    "Le périmètre, les fonctionnalités, les intégrations et les modalités techniques sont définis pour chaque projet.",
  primaryCta: { label: "Présenter mon projet", href: "#brief-projet" },
  secondaryCta: { label: "Explorer les possibilités", href: "#types-plateformes" },
  conceptNodes: ["Opérations", "Partenaires", "Livreurs", "Clients", "Administration"],
};

export const customPlatformsFoundations = {
  intro: "Une plateforme pertinente commence par la compréhension de ce qui doit réellement fonctionner.",
  items: ["Utilisateurs", "Processus", "Données", "Interfaces", "Intégrations"] as const,
};

export type PlatformTypeId =
  | "web"
  | "mobile"
  | "dashboard"
  | "partenaire"
  | "livreur"
  | "portail";

export const customPlatformTypes = {
  id: "types-plateformes",
  title: "Un même projet peut réunir plusieurs interfaces.",
  lead: "Web, mobile et espaces dédiés : chaque interface répond à un usage précis.",
  cta: { label: "Préparer mon projet", href: "#brief-projet" },
  items: [
    {
      id: "web" as PlatformTypeId,
      title: "Plateforme Web",
      points: ["Opérations", "Administration", "Suivi", "Recherche", "Reporting"],
      note: null,
    },
    {
      id: "mobile" as PlatformTypeId,
      title: "Application mobile",
      points: ["Accès terrain", "Collecte", "Consultation", "Actions adaptées aux utilisateurs mobiles"],
      note: "Le fonctionnement hors ligne dépend du périmètre et des contraintes validées.",
    },
    {
      id: "dashboard" as PlatformTypeId,
      title: "Tableau de bord",
      points: ["Synthèse", "Filtres", "États disponibles", "Reporting", "Indicateurs définis avec le projet"],
      note: null,
    },
    {
      id: "partenaire" as PlatformTypeId,
      title: "Espace partenaire",
      points: ["Informations utiles", "Demandes", "Documents", "Suivi des activités", "Échanges selon le périmètre"],
      note: "Type d’espace pouvant être développé — pas nécessairement un portail ONLOUTOU déjà ouvert.",
    },
    {
      id: "livreur" as PlatformTypeId,
      title: "Espace livreur",
      points: ["Missions", "Statuts", "Localisation si applicable", "Preuves ou remontées terrain selon le projet"],
      note: "Ne présuppose pas l’existence d’un réseau de livreurs déjà connecté.",
    },
    {
      id: "portail" as PlatformTypeId,
      title: "Portail client",
      points: ["Demandes", "Suivi", "Documents", "Historique", "Communication"],
      note: null,
    },
  ],
};

export const customPlatformsEcosystem = {
  title: "Relier les services, les personnes et les opérations.",
  lead:
    "Une plateforme peut réunir plusieurs rôles et plusieurs services dans une expérience cohérente, à condition de définir clairement les responsabilités, les données et les parcours.",
  caption: "Illustration conceptuelle de l’écosystème ONLOUTOU — schéma non contractuel.",
  dimensions: [
    { title: "Louer ou acquérir un moyen", text: "Mobiliser des ressources adaptées au terrain.", image: customPlatformsMedia.equip },
    { title: "Connecter et superviser", text: "Relier les actifs et les opérations lorsque le projet le prévoit.", image: customPlatformsMedia.connect },
    { title: "Construire l’outil adapté", text: "Concevoir l’expérience numérique autour du besoin métier.", image: customPlatformsMedia.workshop },
  ],
};

export type PlatformRoleId = "admin" | "ops" | "partner" | "field";

export const customPlatformRoles = {
  title: "Une plateforme, plusieurs expériences.",
  disclaimer: illustrationDisclaimer,
  roles: [
    {
      id: "admin" as PlatformRoleId,
      label: "Administration",
      mockTitle: "Projet exemple — administration",
      rows: ["Gestion des accès", "Paramétrage", "Suivi global", "Documents", "Rapports"],
    },
    {
      id: "ops" as PlatformRoleId,
      label: "Opérations",
      mockTitle: "Projet exemple — opérations",
      rows: ["Activités en cours", "Priorités", "Événements", "Recherche", "Coordination"],
    },
    {
      id: "partner" as PlatformRoleId,
      label: "Partenaire",
      mockTitle: "Projet exemple — partenaire",
      rows: ["Demandes", "Éléments à traiter", "Documents", "Suivi", "Communication"],
    },
    {
      id: "field" as PlatformRoleId,
      label: "Terrain ou livraison",
      mockTitle: "Projet exemple — terrain",
      rows: ["Mission", "Statut disponible", "Informations utiles", "Remontée", "Confirmation"],
    },
  ],
};

export const customPlatformsArchitecture = {
  title: "Faire circuler l’information au bon endroit.",
  note:
    "Les intégrations sont étudiées selon les accès techniques, la documentation disponible et le périmètre du projet.",
  levels: [
    {
      title: "Utilisateurs",
      items: ["Équipe interne", "Partenaire", "Agent terrain", "Client"],
    },
    {
      title: "Interfaces",
      items: ["Web", "Mobile", "Dashboard", "Portail"],
    },
    {
      title: "Services métier",
      items: ["Demandes", "Opérations", "Supervision", "Documents", "Reporting"],
    },
    {
      title: "Données",
      items: ["Profils", "Activités", "Statuts", "Historiques", "Fichiers"],
    },
    {
      title: "Intégrations",
      items: ["API", "Notification", "Cartographie", "Paiement si applicable", "Système existant"],
    },
  ],
};

export const customPlatformsDashboard = {
  title: "Rendre une activité plus lisible.",
  lead:
    "Un tableau de bord doit aider les équipes à retrouver les informations utiles, comprendre une situation et agir dans le cadre de leurs responsabilités.",
  annotations: ["Information centralisée", "Filtres adaptés", "Accès selon les rôles"],
  disclaimer: "Interface de démonstration — le contenu final dépend du projet.",
};

export const customPlatformsMethod = {
  title: "Du problème opérationnel au produit utilisable.",
  steps: [
    {
      title: "Cadrer",
      description: "Comprendre le problème, les utilisateurs et les objectifs.",
      deliverable: "Périmètre initial et priorités.",
    },
    {
      title: "Cartographier",
      description: "Décrire les parcours, les rôles, les règles et les données.",
      deliverable: "Cartographie fonctionnelle partagée.",
    },
    {
      title: "Concevoir",
      description: "Préparer l’architecture fonctionnelle, les écrans et le périmètre.",
      deliverable: "Maquettes et spécifications validées.",
    },
    {
      title: "Développer",
      description: "Construire les modules validés par étapes.",
      deliverable: "Versions incrémentales testables.",
    },
    {
      title: "Tester",
      description: "Vérifier les parcours, les droits, les intégrations et les cas critiques.",
      deliverable: "Recette et corrections.",
    },
    {
      title: "Déployer et accompagner",
      description:
        "Préparer la mise en service, la documentation, la formation et les modalités de maintenance prévues.",
      deliverable: "Mise en production et transfert.",
    },
  ],
};

export const customPlatformsAdoption = {
  title: "Un outil n’est utile que s’il peut être adopté.",
  lead:
    "La conception doit tenir compte des habitudes des équipes, des équipements disponibles, de la connectivité, du niveau d’accompagnement et des contraintes réelles d’utilisation.",
  points: [
    "Compréhension des utilisateurs",
    "Simplicité des parcours",
    "Tests avec les personnes concernées",
    "Documentation",
    "Formation",
    "Évolution progressive",
  ],
  trainingNote: "La formation et l’accompagnement sont précisés dans la proposition applicable.",
};

export const customPlatformsScopes = [
  "Espace partenaire",
  "Espace livreur",
  "Portail client",
  "Gestion de produits",
  "Outil d’administration",
  "Collecte terrain",
  "Dashboard",
  "Reporting",
  "Géolocalisation",
  "Notifications",
  "Intégrations",
  "Paiement si nécessaire et techniquement validé",
] as const;

export const customPlatformsScopeGroups = [
  {
    title: "Espaces et accès",
    items: ["Espace partenaire", "Espace livreur", "Portail client", "Outil d’administration"],
  },
  {
    title: "Opérations et pilotage",
    items: ["Gestion de produits", "Collecte terrain", "Dashboard", "Reporting"],
  },
  {
    title: "Services et intégrations",
    items: ["Géolocalisation", "Notifications", "Intégrations", "Paiement si nécessaire et techniquement validé"],
  },
];

export const customPlatformsTechnical = {
  title: "Cadre technique et engagements",
  items: [
    "Propriété et accès aux données",
    "Rôles et autorisations",
    "Hébergement",
    "Sauvegardes",
    "Sécurité",
    "Intégrations",
    "Environnements",
    "Maintenance",
    "Support",
    "Réversibilité",
    "Documentation",
    "Calendrier",
    "Critères de recette",
  ],
  note:
    "Les engagements techniques, niveaux de service, responsabilités et modalités de maintenance sont définis contractuellement pour chaque projet.",
  groups: [
    {
      title: "Données et accès",
      items: ["Propriété et accès aux données", "Rôles et autorisations", "Réversibilité"],
    },
    {
      title: "Exploitation",
      items: ["Hébergement", "Sauvegardes", "Environnements"],
    },
    {
      title: "Qualité et sécurité",
      items: ["Sécurité", "Intégrations", "Critères de recette"],
    },
    {
      title: "Accompagnement",
      items: ["Maintenance", "Support", "Documentation", "Calendrier"],
    },
  ],
};

export const customPlatformsBriefOptions = {
  solutionTypes: [
    { id: "web", label: "plateforme Web" },
    { id: "mobile", label: "application mobile" },
    { id: "dashboard", label: "tableau de bord" },
    { id: "partner", label: "portail partenaire" },
    { id: "delivery", label: "espace livreur" },
    { id: "internal", label: "outil interne" },
    { id: "multi", label: "plusieurs interfaces" },
    { id: "tbd", label: "besoin à définir" },
  ],
  users: [
    { id: "internal", label: "équipe interne" },
    { id: "field", label: "agents terrain" },
    { id: "partners", label: "partenaires" },
    { id: "delivery", label: "livreurs" },
    { id: "clients", label: "clients" },
    { id: "multi", label: "plusieurs profils" },
  ],
  problems: [
    { id: "centralize", label: "centraliser les informations" },
    { id: "ops", label: "suivre les opérations" },
    { id: "requests", label: "gérer des demandes" },
    { id: "coordinate", label: "coordonner des utilisateurs" },
    { id: "reports", label: "produire des rapports" },
    { id: "connect", label: "connecter plusieurs services" },
    { id: "other", label: "autre besoin" },
  ],
  integrations: [
    { id: "none", label: "aucun identifié" },
    { id: "api", label: "API existante" },
    { id: "map", label: "cartographie" },
    { id: "pay", label: "paiement" },
    { id: "notif", label: "notifications" },
    { id: "files", label: "fichiers ou outils internes" },
    { id: "study", label: "à étudier" },
  ],
  maturity: [
    { id: "idea", label: "idée à cadrer" },
    { id: "process", label: "processus déjà défini" },
    { id: "mockups", label: "maquettes disponibles" },
    { id: "evolve", label: "outil existant à faire évoluer" },
    { id: "resume", label: "projet à reprendre" },
  ],
  timelines: [
    { id: "tbd", label: "à définir" },
    { id: "soon", label: "projet prochain" },
    { id: "progressive", label: "déploiement progressif" },
    { id: "deadline", label: "échéance à préciser" },
  ],
};

export function buildPlatformBriefSummary(s: {
  solutionLabel: string;
  usersLabel: string;
  problemLabel: string;
  integrationsLabel: string;
  maturityLabel: string;
  timelineLabel: string;
}) {
  return `Je souhaite étudier ${s.solutionLabel} pour ${s.usersLabel}, afin de ${s.problemLabel}, avec ${s.integrationsLabel}. Niveau d’avancement : ${s.maturityLabel}. Calendrier : ${s.timelineLabel}.`;
}

export function buildPlatformWhatsAppUrl(s: Parameters<typeof buildPlatformBriefSummary>[0]) {
  const summary = buildPlatformBriefSummary(s);
  return whatsappUrlForMessage(`Bonjour ONLOUTOU, ${summary} Pouvez-vous m’orienter pour un premier cadrage ?`);
}

export const customPlatformsFaq: ServiceFaqItem[] = [
  {
    question: "Quels types de plateformes ONLOUTOU peut-il étudier ?",
    answer:
      "Des plateformes Web, applications mobiles, tableaux de bord, outils internes et portails destinés à différents utilisateurs peuvent être étudiés selon le projet.",
  },
  {
    question: "Faut-il déjà disposer d’un cahier des charges ?",
    answer:
      "Non. Le cadrage peut commencer par le problème, les utilisateurs, les processus et les contraintes. Le périmètre est ensuite structuré.",
  },
  {
    question: "Peut-on connecter une plateforme à un système existant ?",
    answer:
      "Une intégration peut être étudiée lorsque les accès, les API, la documentation et les conditions techniques sont disponibles.",
  },
  {
    question: "Une application mobile est-elle toujours nécessaire ?",
    answer:
      "Non. Le choix entre Web, mobile ou plusieurs interfaces dépend des utilisateurs, des situations d’usage et des contraintes du projet.",
  },
  {
    question: "Peut-on créer un espace partenaire ou livreur ?",
    answer:
      "Ces types d’espaces peuvent être conçus lorsque les rôles, les parcours, les données et les responsabilités sont clairement définis.",
  },
  {
    question: "Quel est le délai de développement ?",
    answer:
      "Le délai dépend du périmètre, des intégrations, du niveau de préparation et des phases de validation. Il est défini après cadrage.",
  },
  {
    question: "La maintenance est-elle incluse ?",
    answer:
      "Les modalités de maintenance, de support et d’évolution sont précisées dans la proposition applicable.",
  },
];

export const customPlatformsEditorialNotice =
  "Les écrans, rôles et parcours présentés sur cette page sont des illustrations fonctionnelles. Ils ne constituent pas l’annonce d’un produit déjà disponible. Chaque plateforme fait l’objet d’un cadrage, d’un périmètre et d’une proposition spécifiques.";

export const customPlatformsFaqIntro = {
  eyebrow: "Questions fréquentes",
  title: "Questions fréquentes",
  lead: customPlatformsEditorialNotice,
};

export const customPlatformsFinalCta = {
  titleBefore: "Transformons votre besoin opérationnel en ",
  titleHighlight: "outil concret.",
  lead:
    "Présentez-nous le problème, les utilisateurs, les processus et les contraintes. Nous pourrons structurer les premières bases du projet.",
  primary: { label: "Préparer mon projet", href: "#brief-projet" },
  secondary: { label: "Parler à ONLOUTOU", href: "/contact" },
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
  image: customPlatformsMedia.workshop,
};

export const customPlatformsBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Plateformes sur mesure" },
];

export function customPlatformsBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${baseUrl}/solutions` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Plateformes sur mesure",
        item: `${baseUrl}/solutions/plateformes-sur-mesure`,
      },
    ],
  };
}

export function customPlatformsServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Plateformes Web, mobiles et outils métier sur mesure",
    provider: { "@type": "Organization", name: site.name },
    areaServed: "Côte d’Ivoire",
    url: `${baseUrl}/solutions/plateformes-sur-mesure`,
    description: customPlatformsSeo.description,
  };
}
