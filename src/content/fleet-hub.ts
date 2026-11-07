import { site } from "@/content/site";
import type { FlxIconName } from "@/components/fleet/redesign/FlxIcon";

const img = "/assets/images/solutions/gestiondeflotte/hub";

export const flxBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Gestion de flotte" },
];

export const flxHero = {
  kicker: "Gestion de flotte",
  titleLines: ["Transformez", "le suivi en"],
  titleUnderline: "décisions.",
  lead: [
    "Centralisez les informations disponibles,",
    "coordonnez vos équipes et structurez",
    "le suivi de vos opérations.",
  ],
  primary: { label: "Étudier ma flotte", href: "/contact" },
  secondary: { label: "Découvrir le pilotage", href: "#pilotage" },
  image: {
    src: `${img}/hero-collaboration-flotte.webp`,
    width: 1600,
    height: 900,
    alt: "Deux collaboratrices ONLOUTOU consultent un ordinateur et une tablette dans un bureau pour suivre les véhicules d’une flotte.",
  },
  card: {
    items: [
      { label: "Véhicule A", status: "Trajet à consulter", tone: "green" },
      { label: "Véhicule B", status: "Arrêt à vérifier", tone: "yellow" },
      { label: "Véhicule C", status: "Rapport disponible", tone: "blue" },
    ] as { label: string; status: string; tone: "green" | "yellow" | "blue" }[],
    note: "Aperçu illustratif — données fictives",
  },
};

export const flxStrip: { icon: FlxIconName; title: string; text: string }[] = [
  { icon: "eye", title: "Visibilité", text: "Sur l’ensemble de la flotte" },
  { icon: "users", title: "Coordination", text: "Des équipes et interventions" },
  { icon: "bell", title: "Événements", text: "À analyser en contexte" },
  { icon: "chart", title: "Reporting", text: "Des informations structurées" },
];

export const flxPilotage = {
  id: "pilotage",
  kicker: "Du suivi à l’action",
  titleLines: ["Une flotte ne se pilote", "pas seulement sur une carte."],
  lead: "Commencez par visualiser les positions disponibles. Interprétez ensuite les événements dans leur contexte pour prendre les bonnes décisions.",
  steps: [
    {
      icon: "pin" as FlxIconName,
      title: "Positions disponibles",
      text: "Visualisez les véhicules et leurs derniers points connus.",
      href: "#equipes",
    },
    {
      icon: "bell" as FlxIconName,
      title: "Événements à comprendre",
      text: "Prenez en compte les arrêts, trajets et activités signalés.",
      href: "#cycle",
    },
    {
      icon: "file" as FlxIconName,
      title: "Décisions à préparer",
      text: "Organisez les actions et partagez les informations utiles.",
      href: "#tableaux-de-bord",
    },
  ],
};

type TeamRow = { cells: [string, string]; dot?: "green" | "yellow" | "blue" | "red"; sub: [string, string]; action: [string, string]; thumb?: FlxIconName };

export const flxTeams = {
  id: "equipes",
  kicker: "Des usages concrets",
  title: "La bonne lecture, pour chaque équipe.",
  defaultTab: 1,
  note: "Aperçu illustratif — données fictives",
  tabs: [
    {
      id: "direction",
      label: "Direction",
      icon: "user" as FlxIconName,
      heading: "Garder une vue d’ensemble.",
      items: [
        { icon: "eye" as FlxIconName, title: "Suivre l’activité de la flotte", text: "Accédez à une vision consolidée des opérations." },
        { icon: "chart" as FlxIconName, title: "Repérer les points d’attention", text: "Identifiez les écarts à analyser avec vos équipes." },
        { icon: "file" as FlxIconName, title: "Appuyer les décisions", text: "Partagez des synthèses claires et exploitables." },
      ],
      card: {
        title: "Aperçu de la flotte",
        link: "Voir la synthèse",
        columns: ["Indicateur", "Dernier point", "Prochaine action"],
        rows: [
          { thumb: "van", cells: ["Activité de la flotte", "Synthèse disponible"], dot: "green", sub: ["Selon configuration", "Mise à jour régulière"], action: ["Analyser les écarts", "Revue d’activité"] },
          { thumb: "bell", cells: ["Événements signalés", "Arrêts et alertes"], dot: "yellow", sub: ["À qualifier", "Selon les règles retenues"], action: ["Prioriser les actions", "Point avec les équipes"] },
          { thumb: "file", cells: ["Rapports", "Synthèse disponible"], dot: "blue", sub: ["Selon configuration", "Accès maîtrisés"], action: ["Partager le rapport", "Comité de pilotage"] },
        ] as TeamRow[],
      },
    },
    {
      id: "responsable",
      label: "Responsable de flotte",
      icon: "users" as FlxIconName,
      heading: "Organiser le suivi au quotidien.",
      items: [
        { icon: "search" as FlxIconName, title: "Retrouver les véhicules et événements", text: "Accédez aux informations disponibles rapidement." },
        { icon: "file" as FlxIconName, title: "Consulter les historiques disponibles", text: "Analysez les trajets et les arrêts enregistrés." },
        { icon: "chart" as FlxIconName, title: "Préparer les synthèses utiles", text: "Partagez une vision claire avec les équipes." },
      ],
      card: {
        title: "Aperçu des véhicules",
        link: "Voir tous les véhicules",
        columns: ["Véhicule", "Dernier événement", "Prochaine action"],
        rows: [
          { thumb: "van", cells: ["Véhicule A", "En déplacement"], dot: "green", sub: ["Fourgon — AB 123 CD", "08:42 · Abidjan Plateau"], action: ["Vérifier l’arrivée", "Site client"] },
          { thumb: "van", cells: ["Véhicule B", "Arrêt prolongé"], dot: "yellow", sub: ["Fourgon — CD 456 EF", "10:15 · Zone industrielle"], action: ["Contacter le conducteur", "Vérification"] },
          { thumb: "truck", cells: ["Véhicule C", "Rapport disponible"], dot: "blue", sub: ["Pick-up — EF 789 GH", "08:20 · Treichville"], action: ["Consulter le rapport", "Suivi d’intervention"] },
        ] as TeamRow[],
      },
    },
    {
      id: "terrain",
      label: "Équipes terrain",
      icon: "helmet" as FlxIconName,
      heading: "Simplifier le suivi sur le terrain.",
      items: [
        { icon: "pin" as FlxIconName, title: "Consulter les missions et les lieux", text: "Retrouvez les informations utiles pour intervenir." },
        { icon: "bell" as FlxIconName, title: "Être informé des événements", text: "Prenez en compte les alertes signalées." },
        { icon: "check" as FlxIconName, title: "Remonter l’avancement", text: "Partagez l’état des interventions avec le bureau." },
      ],
      card: {
        title: "Aperçu des interventions",
        link: "Voir toutes les interventions",
        columns: ["Intervention", "Dernier statut", "Prochaine action"],
        rows: [
          { thumb: "wrench", cells: ["Intervention A", "En cours"], dot: "green", sub: ["Maintenance", "Site client"], action: ["Confirmer l’arrivée", "Suivi d’intervention"] },
          { thumb: "wrench", cells: ["Intervention B", "À planifier"], dot: "yellow", sub: ["Vérification", "Zone industrielle"], action: ["Contacter l’équipe", "Planification"] },
          { thumb: "file", cells: ["Intervention C", "Terminée"], dot: "blue", sub: ["Dépannage", "Treichville"], action: ["Transmettre le compte rendu", "Rapport disponible"] },
        ] as TeamRow[],
      },
    },
  ],
};

export const flxCycle = {
  id: "cycle",
  title: "Du départ au compte rendu.",
  lead: "Une gestion de flotte simple et structurée, à chaque étape de vos opérations.",
  steps: [
    { icon: "clipboard" as FlxIconName, title: "Préparer", text: "Planifiez vos véhicules, équipements et équipes selon vos besoins." },
    { icon: "pin" as FlxIconName, title: "Suivre", text: "Suivez les positions, les activités et l’état de vos actifs." },
    { icon: "bell" as FlxIconName, title: "Réagir", text: "Soyez alerté des écarts et prenez les bonnes décisions." },
    { icon: "shieldCheck" as FlxIconName, title: "Vérifier", text: "Contrôlez l’utilisation, les documents et l’état de vos véhicules." },
    { icon: "chart" as FlxIconName, title: "Rapporter", text: "Accédez à des rapports clairs pour piloter vos opérations." },
  ],
};

export const flxFeatures = {
  id: "fonctionnalites",
  title: "Un pilotage qui s’adapte à votre organisation.",
  lead: "Des fonctionnalités pensées pour gérer facilement vos véhicules, équipements et équipes.",
  note: "Fonctions selon équipements, données disponibles et périmètre retenu.",
  groups: [
    {
      icon: "layers" as FlxIconName,
      title: "Superviser",
      text: "Une vision claire et centralisée de votre flotte.",
      items: [
        { icon: "database" as FlxIconName, label: "Parc centralisé" },
        { icon: "pin" as FlxIconName, label: "Positions et historiques" },
        { icon: "list" as FlxIconName, label: "États disponibles" },
        { icon: "search" as FlxIconName, label: "Recherche et filtres" },
      ],
    },
    {
      icon: "users" as FlxIconName,
      title: "Organiser",
      text: "Une gestion souple et structurée selon votre organisation.",
      items: [
        { icon: "users" as FlxIconName, label: "Groupes de véhicules" },
        { icon: "user" as FlxIconName, label: "Rôles et accès" },
        { icon: "book" as FlxIconName, label: "Repères opérationnels" },
        { icon: "clipboard" as FlxIconName, label: "Affectations selon configuration" },
      ],
    },
    {
      icon: "chart" as FlxIconName,
      title: "Analyser",
      text: "Des données utiles pour éclairer vos décisions.",
      items: [
        { icon: "clock" as FlxIconName, label: "Historiques" },
        { icon: "upload" as FlxIconName, label: "Exports" },
        { icon: "file" as FlxIconName, label: "Rapports configurables" },
        { icon: "folder" as FlxIconName, label: "Synthèses de projet" },
      ],
    },
    {
      icon: "plusSquare" as FlxIconName,
      title: "Faire évoluer",
      text: "Une solution qui grandit avec vos besoins.",
      items: [
        { icon: "plusSquare" as FlxIconName, label: "Ajout d’actifs" },
        { icon: "puzzle" as FlxIconName, label: "Intégrations étudiées" },
        { icon: "users" as FlxIconName, label: "Accompagnement des équipes" },
        { icon: "gear" as FlxIconName, label: "Évolution du paramétrage" },
      ],
    },
  ],
};

export const flxUsages = {
  id: "usages",
  title: "Des usages ancrés dans le terrain.",
  lead: "Une gestion de flotte au service de vos équipes, sur tous vos sites.",
  image: {
    src: `${img}/usage-professionnels-terrain.webp`,
    width: 1354,
    height: 641,
    alt: "Deux professionnels ONLOUTOU échangent autour d’une tablette devant un utilitaire blanc sur un site logistique.",
  },
  items: [
    { icon: "van" as FlxIconName, title: "Mobilité professionnelle", text: "Déplacements de vos équipes et collaborateurs.", href: "/solutions/location" },
    { icon: "box" as FlxIconName, title: "Transport et livraison", text: "Acheminement de marchandises et de matériels.", href: "/solutions/geolocalisation" },
    { icon: "wrench" as FlxIconName, title: "Interventions terrain", text: "Maintenance, SAV et opérations sur site.", href: "/solutions/geolocalisation#installation-terrain" },
    { icon: "excavator" as FlxIconName, title: "Équipements et actifs mobiles", text: "Suivi de vos engins et matériels.", href: "/solutions/securisation-actifs" },
    { icon: "pin" as FlxIconName, title: "Opérations multisites", text: "Une vision consolidée de l’ensemble de vos implantations.", href: "/solutions/plateformes-sur-mesure" },
  ],
};

export const flxReporting = {
  id: "tableaux-de-bord",
  titleLines: ["Des informations", "qui deviennent utiles."],
  lead: "Des rapports clairs et exploitables pour suivre l’activité de votre flotte, comprendre les usages et faciliter vos prises de décision.",
  points: [
    { icon: "file" as FlxIconName, title: "Rapports", text: "selon configuration" },
    { icon: "user" as FlxIconName, title: "Accès", text: "maîtrisés" },
    { icon: "puzzle" as FlxIconName, title: "Intégrations", text: "étudiées" },
  ],
  cta: { label: "Définir mes besoins de reporting", href: "/contact" },
  image: {
    src: `${img}/synthese-exploitation-vehicules.webp`,
    width: 1381,
    height: 706,
    alt: "Synthèse d’exploitation : activité par catégorie d’événement sur quatre semaines et détail par véhicule (données fictives).",
  },
  note: "Aperçu illustratif — données fictives",
};

export const flxDeploy = {
  id: "mise-en-place",
  kicker: "Mise en place",
  titleLines: ["Un déploiement", "construit avec"],
  titleUnderline: "vos équipes.",
  lead: "Nos experts vous accompagnent à chaque étape, en collaboration avec vos équipes, pour un suivi efficace et adapté à vos usages.",
  image: {
    src: `${img}/deploiement-technicien-utilitaire.webp`,
    width: 1269,
    height: 699,
    alt: "Un technicien ONLOUTOU installe un boîtier de suivi à l’arrière d’un utilitaire blanc.",
  },
  steps: [
    { title: "Cadrer les opérations", text: "Nous définissons ensemble le périmètre, les objectifs et les équipes impliquées." },
    { title: "Identifier les véhicules et les besoins", text: "Nous analysons votre parc et vos usages pour prioriser les cas d’usage." },
    { title: "Définir les équipements et données utiles", text: "Nous sélectionnons les équipements adaptés et les informations à remonter." },
    { title: "Installer et paramétrer", text: "Nos équipes installent les équipements et configurent la solution selon vos besoins." },
    { title: "Tester avec les équipes", text: "Nous validons les données, les événements et les accès avec vos utilisateurs." },
    { title: "Accompagner l’exploitation", text: "Nous restons à vos côtés pour faciliter la prise en main et l’amélioration continue." },
  ],
  note: "Positions, alertes et rapports dépendent des équipements, du réseau et du paramétrage retenu.",
};

export const flxFaq = {
  kicker: "FAQ",
  titleLines: ["Vos questions,", "avant de démarrer."],
  lead: "Des réponses claires pour vous aider à avancer sereinement dans votre projet de gestion de flotte.",
  cta: { label: "Nous contacter", href: "/contact" },
  items: [
    {
      question: "Quelle différence avec la géolocalisation ?",
      answer:
        "La géolocalisation fournit des positions. Le pilotage de flotte organise leur lecture avec les événements, les rôles et les rapports disponibles.",
    },
    {
      question: "Quels véhicules peut-on intégrer ?",
      answer:
        "La configuration peut être étudiée pour différents véhicules ou actifs, sous réserve de la compatibilité des équipements et des données recherchées.",
    },
    {
      question: "Peut-on adapter les accès des équipes ?",
      answer:
        "Des profils et des droits d’accès peuvent être définis selon les capacités de la plateforme et l’organisation de votre projet.",
    },
    {
      question: "Comment préparer le déploiement ?",
      answer:
        "Rassemblez la liste de vos véhicules, vos usages principaux et les équipes concernées. Nous cadrons ensuite le périmètre avec vous avant toute installation.",
    },
    {
      question: "Les alertes sont-elles automatiques ?",
      answer:
        "Les alertes disponibles doivent être configurées selon le matériel, les événements remontés et les règles retenues pour le projet.",
    },
    {
      question: "Peut-on intégrer la solution à un autre système ?",
      answer:
        "Les possibilités d’intégration sont étudiées au cas par cas, selon les systèmes concernés, les accès techniques et le périmètre validé.",
    },
    {
      question: "ONLOUTOU accompagne-t-il les équipes ?",
      answer:
        "L’accompagnement peut inclure le cadrage, le paramétrage, les tests, la prise en main et la formation, selon le projet.",
    },
    {
      question: "Quels délais prévoir pour démarrer ?",
      answer:
        "Le calendrier dépend du nombre de véhicules, des équipements à installer et du paramétrage retenu. Il est à confirmer selon qualification de votre besoin.",
    },
  ],
};

export const flxCta = {
  titleLines: ["Construisons un pilotage"],
  titleUnderline: "adapté",
  titleAfter: " à votre flotte.",
  lead: "Présentez vos véhicules, vos usages et vos priorités.",
  primary: { label: "Présenter ma flotte", href: "/contact" },
  secondary: { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
  phone: { label: site.phoneDisplay, href: `tel:${site.phoneTel}` },
  image: {
    src: `${img}/cta-agents-logistiques.webp`,
    width: 1925,
    height: 473,
    alt: "Deux agents logistiques ONLOUTOU tiennent une tablette devant une flotte de véhicules blancs.",
  },
};

export const flxExplore = {
  kicker: "Pour compléter votre projet",
  links: [
    { icon: "truck" as FlxIconName, title: "Location", text: "Des véhicules adaptés à vos besoins", href: "/solutions/location" },
    { icon: "car" as FlxIconName, title: "Vente", text: "Des véhicules pour développer votre activité", href: "/solutions/vente" },
    { icon: "pin" as FlxIconName, title: "Géolocalisation", text: "Suivez et sécurisez vos véhicules", href: "/solutions/geolocalisation" },
    { icon: "shield" as FlxIconName, title: "Sécurisation des actifs", text: "Protégez vos véhicules et vos équipements", href: "/solutions/securisation-actifs" },
    { icon: "laptop" as FlxIconName, title: "Plateformes numériques", text: "Des outils pour gérer votre flotte", href: "/solutions/plateformes-sur-mesure" },
  ],
};
