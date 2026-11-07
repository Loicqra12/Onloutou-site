import { whatsappUrlForMessage } from "@/content/contact-page";
import type { PsmIconName } from "@/components/platforms/psm/PsmIcon";

const base = "/assets/images/solutions/platformesurmesure";

export const psmImages = {
  hero: { src: `${base}/hero-demandes-operations.webp`, width: 1171, height: 975, alt: "Exemple illustratif d’une plateforme Web et mobile : écran « Demandes et opérations » et application « Mes interventions »." },
  dashboard: { src: `${base}/suivi-des-operations.webp`, width: 1946, height: 610, alt: "Exemple illustratif d’un tableau de bord « Suivi des opérations » avec données fictives." },
  access: { src: `${base}/tableau-de-bord-des-acces.webp`, width: 1422, height: 759, alt: "Exemple illustratif d’un espace d’administration : « Organiser les accès »." },
  equip: { src: `${base}/trio-equiper.webp`, width: 676, height: 482, alt: "Groupe électrogène jaune ONLOUTOU et fourgon sur un site, avec un agent en gilet jaune." },
  connect: { src: `${base}/trio-connecter.webp`, width: 629, height: 482, alt: "Main tenant un boîtier de suivi connecté devant un engin de chantier." },
  build: { src: `${base}/trio-construire.webp`, width: 675, height: 482, alt: "Ordinateur portable et smartphone affichant une interface de demandes et d’opérations." },
  adoption: {
    src: "/assets/images/projects/project-b/formation-dispositif-connecte.png",
    width: 1536,
    height: 1024,
    alt: "Trois agents de terrain consultent ensemble une tablette sur un chantier.",
  },
  cta: {
    src: "/assets/images/projects/project-a/reunion-projet-numerique.png",
    width: 1536,
    height: 1024,
    alt: "Équipe en réunion autour d’un outil numérique et d’une tablette.",
  },
};

/* ---------- Hero ---------- */

export type PsmHeroTabId = "web" | "mobile" | "dashboard" | "partenaire" | "livreur" | "portail";

export const psmHero = {
  kicker: "PLATEFORMES SUR MESURE",
  titleLines: ["Plusieurs interfaces.", "Un même projet."],
  lead: "Web, mobile et espaces dédiés : chaque interface répond à un usage précis.",
  cta: { label: "Préparer mon projet", href: "#brief-projet" },
  note: "Exemple illustratif",
  disclaimer: "Illustrations fonctionnelles : les interfaces finales dépendent du projet.",
  tabs: [
    {
      id: "web" as PsmHeroTabId,
      label: "Plateforme web",
      title: ["Centralisez", "vos opérations."],
      items: [
        { icon: "users" as PsmIconName, title: "Administrer les accès", text: "Gérez les utilisateurs et leurs rôles." },
        { icon: "list" as PsmIconName, title: "Suivre les demandes", text: "Pilotez les opérations au quotidien." },
        { icon: "file" as PsmIconName, title: "Retrouver les documents", text: "Accédez aux ressources du projet." },
      ],
    },
    {
      id: "mobile" as PsmHeroTabId,
      label: "Application mobile",
      title: ["Agissez", "depuis le terrain."],
      items: [
        { icon: "list" as PsmIconName, title: "Consulter les missions", text: "Accédez aux informations utiles sur site." },
        { icon: "clipboard" as PsmIconName, title: "Collecter sur place", text: "Renseignez l’avancement au bon moment." },
        { icon: "check" as PsmIconName, title: "Confirmer les actions", text: "Des écrans adaptés aux usages mobiles." },
      ],
    },
    {
      id: "dashboard" as PsmHeroTabId,
      label: "Tableau de bord",
      title: ["Gardez une vue", "d’ensemble."],
      items: [
        { icon: "chart" as PsmIconName, title: "Lire la synthèse", text: "Des indicateurs définis avec le projet." },
        { icon: "filter" as PsmIconName, title: "Filtrer l’information", text: "Équipes, statuts et états disponibles." },
        { icon: "file" as PsmIconName, title: "Produire des rapports", text: "Partagez une situation claire." },
      ],
    },
    {
      id: "partenaire" as PsmHeroTabId,
      label: "Espace partenaire",
      title: ["Collaborez", "avec vos partenaires."],
      items: [
        { icon: "list" as PsmIconName, title: "Suivre les demandes", text: "Déposez et suivez chaque échange." },
        { icon: "file" as PsmIconName, title: "Échanger des documents", text: "Partagez les pièces utiles au projet." },
        { icon: "users" as PsmIconName, title: "Suivre les activités", text: "Échanges selon le périmètre défini." },
      ],
    },
    {
      id: "livreur" as PsmHeroTabId,
      label: "Espace livreur",
      title: ["Coordonnez", "les missions."],
      items: [
        { icon: "truck" as PsmIconName, title: "Consulter les missions", text: "Retrouvez chaque mission assignée." },
        { icon: "check" as PsmIconName, title: "Mettre à jour les statuts", text: "Suivez l’avancement en temps utile." },
        { icon: "pin" as PsmIconName, title: "Remonter le terrain", text: "Preuves et remontées selon le projet." },
      ],
    },
    {
      id: "portail" as PsmHeroTabId,
      label: "Portail client",
      title: ["Offrez un portail", "à vos clients."],
      items: [
        { icon: "list" as PsmIconName, title: "Déposer des demandes", text: "Un point d’entrée simple et clair." },
        { icon: "chart" as PsmIconName, title: "Suivre l’avancement", text: "Historique et statuts consultables." },
        { icon: "file" as PsmIconName, title: "Retrouver les documents", text: "Communication et ressources partagées." },
      ],
    },
  ],
};

/* ---------- Rôles ---------- */

export type PsmRoleId = "admin" | "ops" | "partner" | "field";

export const psmRoles = {
  id: "roles-interfaces",
  kicker: "RÔLES ET PARCOURS",
  titleLines: ["Une plateforme.", "Des espaces adaptés à chacun."],
  lead: "Les responsabilités et les droits d’accès structurent l’expérience.",
  caption: "Les accès sont définis selon les rôles retenus.",
  roles: [
    { id: "admin" as PsmRoleId, icon: "users" as PsmIconName, title: "Administration", text: "Accès, paramétrage et supervision." },
    { id: "ops" as PsmRoleId, icon: "wrench" as PsmIconName, title: "Opérations", text: "Suivi des demandes et interventions." },
    { id: "partner" as PsmRoleId, icon: "users" as PsmIconName, title: "Partenaire", text: "Collaboration et échange de documents." },
    { id: "field" as PsmRoleId, icon: "truck" as PsmIconName, title: "Terrain ou livraison", text: "Préparation et suivi sur le terrain." },
  ],
};

/* ---------- Du terrain au numérique ---------- */

export const psmConnect = {
  kicker: "DU TERRAIN AU NUMÉRIQUE",
  titleLines: ["Relier les moyens,", "les personnes et les opérations."],
  lead: "Les équipements et les services numériques peuvent se compléter selon le projet.",
  note: "Illustration des expertises mobilisables selon le périmètre.",
  cards: [
    { key: "equip", title: "Équiper", text: "Location et acquisition" },
    { key: "connect", title: "Connecter", text: "Suivi des actifs et des opérations" },
    { key: "build", title: "Construire", text: "Interfaces et outils métier" },
  ] as const,
};

/* ---------- Information ---------- */

export const psmInfo = {
  kicker: "UNE INFORMATION BIEN ORGANISÉE",
  titleLines: ["La bonne information.", "Au bon endroit."],
  lead: "Les parcours, les données et les échanges sont définis pendant le cadrage.",
  note: "Faisabilité à étudier selon les accès techniques et la documentation disponible.",
  cards: [
    { icon: "users" as PsmIconName, title: "Utilisateurs", text: "Équipes, partenaires, agents terrain et clients." },
    { icon: "laptop" as PsmIconName, title: "Interfaces", text: "Web, mobile, tableaux de bord et portails." },
    { icon: "file" as PsmIconName, title: "Services métier", text: "Demandes, opérations, documents et rapports." },
    { icon: "database" as PsmIconName, title: "Données", text: "Profils, activités, statuts et historiques." },
    { icon: "gear" as PsmIconName, title: "Intégrations", text: "API, notifications, cartographie et systèmes existants." },
  ],
};

/* ---------- Pilotage ---------- */

export const psmOversight = {
  kicker: "PILOTAGE MÉTIER",
  titleLines: ["Voir l’activité.", "Comprendre. Agir."],
  lead: "Un tableau de bord conçu autour des informations utiles à vos équipes.",
  points: ["Information centralisée", "Filtres adaptés", "Accès selon les rôles"],
  caption: "Démonstration de présentation : contenus et fonctions à définir pour chaque projet.",
};

/* ---------- Méthode ---------- */

export const psmMethod = {
  kicker: "DE L’IDÉE À L’USAGE",
  titleLines: ["Une méthode claire.", "Des livrables concrets."],
  lead: "La séquence et les livrables sont adaptés au contexte du projet.",
  headStep: "ÉTAPE",
  headDeliverable: "LIVRABLE INDICATIF",
  steps: [
    { n: "01", title: "Cadrer", text: "Comprendre le problème, les utilisateurs et les objectifs.", icon: "file" as PsmIconName, deliverable: "Périmètre et priorités" },
    { n: "02", title: "Cartographier", text: "Décrire les parcours, les rôles et les données.", icon: "map" as PsmIconName, deliverable: "Cartographie fonctionnelle" },
    { n: "03", title: "Concevoir", text: "Préparer les écrans et les spécifications.", icon: "image" as PsmIconName, deliverable: "Maquettes validées" },
    { n: "04", title: "Développer", text: "Construire les modules par étapes.", icon: "code" as PsmIconName, deliverable: "Versions testables" },
    { n: "05", title: "Tester", text: "Vérifier les parcours, les droits et les intégrations.", icon: "checksquare" as PsmIconName, deliverable: "Recette et corrections" },
    { n: "06", title: "Déployer et accompagner", text: "Préparer la mise en service et la prise en main.", icon: "rocket" as PsmIconName, deliverable: "Mise en production et transfert" },
  ],
};

/* ---------- Adoption ---------- */

export const psmAdoption = {
  kicker: "UNE ADOPTION RÉUSSIE",
  titleLines: ["Un outil pensé", "pour être adopté."],
  lead: "Les habitudes des équipes, les équipements et la connectivité guident la conception.",
  note: "Formation et accompagnement selon la proposition retenue.",
  items: [
    { icon: "users" as PsmIconName, title: "Parcours simples", text: "Des interfaces adaptées aux usages terrain." },
    { icon: "user" as PsmIconName, title: "Tests avec les utilisateurs", text: "Des retours concrets pour ajuster la solution." },
    { icon: "file" as PsmIconName, title: "Documentation et formation", text: "Des supports et des sessions adaptés aux rôles." },
  ],
};

/* ---------- Modules ---------- */

export const psmModules = {
  kicker: "UN PÉRIMÈTRE À CONSTRUIRE",
  title: "Les modules utiles à votre activité.",
  note: "Fonctionnalités à cadrer et à valider techniquement selon le projet.",
  groups: [
    { icon: "users" as PsmIconName, title: "Espaces et accès", items: ["Partenaire", "Livreur", "Client", "Administration"] },
    { icon: "gear" as PsmIconName, title: "Opérations et pilotage", items: ["Produits", "Collecte terrain", "Tableaux de bord", "Rapports"] },
    { icon: "plug" as PsmIconName, title: "Services et intégrations", items: ["Géolocalisation", "Notifications", "API", "Paiement à étudier"] },
  ],
};

/* ---------- Responsabilités ---------- */

export const psmResponsibilities = {
  kicker: "LE CADRE DU PROJET",
  titleLines: ["Des responsabilités définies", "dès le départ."],
  note: "Engagements, niveaux de service et responsabilités définis contractuellement.",
  items: [
    { icon: "database" as PsmIconName, title: "Données et accès", text: "Propriété, autorisations et réversibilité." },
    { icon: "cloud" as PsmIconName, title: "Exploitation", text: "Hébergement, sauvegardes et environnements." },
    { icon: "shield" as PsmIconName, title: "Qualité et sécurité", text: "Critères de recette, intégrations et mesures adaptées." },
    { icon: "users" as PsmIconName, title: "Accompagnement", text: "Calendrier, documentation, maintenance et support." },
  ],
};

/* ---------- Brief ---------- */

export const psmBrief = {
  id: "brief-projet",
  kicker: "VOTRE PROJET",
  title: "Posons les premières bases.",
  lead: "Votre besoin, vos utilisateurs et vos contraintes pour préparer un premier échange.",
  tools: [
    { id: "web", icon: "monitor" as PsmIconName, label: "Plateforme web" },
    { id: "mobile", icon: "smartphone" as PsmIconName, label: "Application mobile" },
    { id: "dashboard", icon: "chart" as PsmIconName, label: "Tableau de bord" },
    { id: "portal", icon: "users" as PsmIconName, label: "Portail dédié" },
    { id: "internal", icon: "gear" as PsmIconName, label: "Outil interne" },
    { id: "tbd", icon: "file" as PsmIconName, label: "À définir" },
  ],
  users: ["Équipe interne", "Agents terrain", "Partenaires", "Livreurs", "Clients"],
  problemPlaceholder: "Centraliser les demandes et suivre les interventions.",
  problemDefault: "Centraliser les demandes",
  systems: ["API existante", "Cartographie", "Notifications", "Paiement à étudier", "Fichiers ou outils internes", "À préciser"],
  maturity: ["Idée à cadrer", "Processus déjà défini", "Maquettes disponibles", "Outil existant à faire évoluer", "Projet à reprendre"],
  timelines: ["À définir", "Projet prochain", "Déploiement progressif", "Échéance à préciser"],
  extraPlaceholder: "Contexte, contraintes, documents disponibles...",
  panel: {
    kicker: "VOTRE BRIEF",
    titleLines: ["Un projet déjà", "plus clair."],
    whatsappLabel: "Préparer le message WhatsApp",
    hint: "Relisez le message avant de l’envoyer.",
    contactLabel: "Passer par le formulaire de contact",
    contactHref: "/contact",
  },
};

export function joinWithEt(list: string[]) {
  if (list.length <= 1) return list[0] ?? "";
  return `${list.slice(0, -1).join(", ")} et ${list[list.length - 1]}`;
}

export type PsmBriefState = {
  tools: string[];
  users: string[];
  problem: string;
  systems: string[];
  maturity: string;
  timeline: string;
  extra: string;
};

export const psmBriefDefaults: PsmBriefState = {
  tools: ["Plateforme web"],
  users: ["Équipe interne", "Agents terrain"],
  problem: "",
  systems: ["API existante"],
  maturity: "Idée à cadrer",
  timeline: "À définir",
  extra: "",
};

export function summarizeBrief(s: PsmBriefState) {
  const tools = s.tools.length ? s.tools.join(", ") : "À définir";
  const users = s.users.length ? joinWithEt(s.users) : "À définir";
  const problem = s.problem.trim() ? s.problem.trim() : psmBrief.problemDefault;
  let integration: string;
  if (!s.systems.length) integration = "Aucun système identifié";
  else if (s.systems.includes("À préciser")) integration = "À préciser";
  else {
    const names = joinWithEt(s.systems);
    integration = /à étudier$/i.test(names) ? names : `${names} à étudier`;
  }
  return { tools, users, problem, integration, maturity: s.maturity, timeline: s.timeline };
}

export function buildPsmWhatsAppMessage(s: PsmBriefState) {
  const r = summarizeBrief(s);
  const lines = [
    "Bonjour ONLOUTOU, je souhaite préparer un projet de plateforme sur mesure.",
    `Outil souhaité : ${r.tools}.`,
    `Utilisateurs : ${r.users}.`,
    `Problème à résoudre : ${r.problem}.`,
    `Systèmes à relier : ${r.integration}.`,
    `Avancement : ${r.maturity}.`,
    `Calendrier : ${r.timeline}.`,
  ];
  if (s.extra.trim()) lines.push(`Précision : ${s.extra.trim()}`);
  lines.push("Pouvez-vous m’orienter pour un premier échange ?");
  return lines.join("\n");
}

export function buildPsmWhatsAppUrl(s: PsmBriefState) {
  return whatsappUrlForMessage(buildPsmWhatsAppMessage(s));
}

/* ---------- FAQ ---------- */

export const psmFaq = {
  kicker: "QUESTIONS FRÉQUENTES",
  titleLines: ["Clarifier avant", "de construire."],
  note: "Les interfaces présentées sont illustratives. Chaque projet fait l’objet d’un cadrage et d’une proposition spécifiques.",
  items: [
    {
      question: "Faut-il déjà avoir un cahier des charges ?",
      answer: "Un premier échange peut aider à clarifier le besoin et à définir le travail de cadrage.",
    },
    {
      question: "Quels types de plateformes peuvent être étudiés ?",
      answer:
        "Des plateformes Web, applications mobiles, tableaux de bord, outils internes et portails destinés à différents utilisateurs peuvent être étudiés selon le projet.",
    },
    {
      question: "Peut-on relier un système existant ?",
      answer:
        "Une intégration peut être étudiée lorsque les accès, les API, la documentation et les conditions techniques sont disponibles.",
    },
    {
      question: "Une application mobile est-elle nécessaire ?",
      answer:
        "Pas systématiquement. Le choix entre Web, mobile ou plusieurs interfaces dépend des utilisateurs, des situations d’usage et des contraintes du projet.",
    },
    {
      question: "Peut-on créer un espace partenaire ou livreur ?",
      answer:
        "Ces types d’espaces peuvent être conçus lorsque les rôles, les parcours, les données et les responsabilités sont clairement définis.",
    },
    {
      question: "Comment est défini le délai de développement ?",
      answer:
        "Le délai dépend du périmètre, des intégrations, du niveau de préparation et des phases de validation. Il est défini après cadrage.",
    },
    {
      question: "La maintenance est-elle incluse ?",
      answer: "Les modalités de maintenance, de support et d’évolution sont précisées dans la proposition applicable.",
    },
  ],
};

/* ---------- CTA final ---------- */

export const psmFinalCta = {
  titleLine1: "Transformons votre besoin",
  titleBefore: "en ",
  titleHighlight: "outil concret.",
  lead: "Commençons par le problème à résoudre.",
  primary: { label: "Parler de mon projet", href: "/contact" },
};
