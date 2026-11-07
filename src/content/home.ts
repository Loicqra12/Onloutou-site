import { homeExpertiseThemes, homePillarSummaries } from "@/content/capabilities";
import { homeMedia } from "@/content/media";
import type {
  ExpertiseCase,
  Metric,
  PlatformJourney,
  ProcessStep,
  SolutionPillar,
  TeamMember,
} from "@/types/content";

export const hero = {
  eyebrow: "Louer · Acheter · Connecter · Construire",
  titleLine1: "Équiper le terrain.",
  titleLine2: "Piloter les opérations.",
  lead:
    "ONLOUTOU associe équipements, mobilité, géolocalisation et plateformes numériques pour accompagner les opérations réelles des entreprises.",
  trustLabel: "Références et accompagnements historiques",
  trustDisclaimer:
    "Ces mentions renvoient à l’historique d’ONLOUTOU et ne constituent pas une liste de partenariats nécessairement actifs aujourd’hui.",
};

export const homeUniverseIntro = {
  eyebrow: "Nos univers",
  title: "Des équipements au pilotage de vos opérations.",
  lead:
    "ONLOUTOU réunit mobilité, équipements, géolocalisation et plateformes numériques dans une approche adaptée aux réalités du terrain.",
};

export const homeUniverses = [
  {
    id: "louer",
    number: "01",
    title: "Louer",
    description:
      "Mobiliser véhicules, engins, outils et équipements professionnels selon les besoins de vos opérations.",
    href: "/solutions/location",
    media: {
      type: "photo" as const,
      src: homeMedia.equipment.mobility.src,
      alt: "Berline et scooter utilitaire présentés à Abidjan",
      width: homeMedia.equipment.mobility.width,
      height: homeMedia.equipment.mobility.height,
      objectPosition: "center 42%",
    },
  },
  {
    id: "acheter",
    number: "02",
    title: "Acheter",
    description:
      "Être accompagné dans la recherche et l’acquisition d’équipements adaptés, avec des caractéristiques et conditions confirmées avant engagement.",
    href: "/solutions/vente",
    media: {
      type: "photo" as const,
      src: homeMedia.equipment.professional.src,
      alt: "Équipe ONLOUTOU inspectant des équipements professionnels",
      width: homeMedia.equipment.professional.width,
      height: homeMedia.equipment.professional.height,
      objectPosition: "center 40%",
    },
  },
  {
    id: "connecter",
    number: "03",
    title: "Connecter & piloter",
    description:
      "Géolocaliser, superviser et sécuriser les actifs grâce au GPS, à la connectivité et aux alertes opérationnelles.",
    href: "/solutions/geolocalisation",
    media: {
      type: "dashboard" as const,
      src: homeMedia.geolocation.primary.src,
      alt: "Aperçu de démonstration de la géolocalisation d’une flotte",
      width: homeMedia.geolocation.primary.width,
      height: homeMedia.geolocation.primary.height,
      objectPosition: "center",
      disclaimer: "Interface de démonstration — données illustratives.",
    },
  },
  {
    id: "construire",
    number: "04",
    title: "Construire",
    description:
      "Concevoir des applications Web et mobiles, des tableaux de bord et des intégrations adaptés aux projets et aux opérations.",
    href: "/solutions/plateformes-sur-mesure",
    media: {
      type: "dashboard" as const,
      src: homeMedia.geolocation.secondary.src,
      alt: "Aperçu de démonstration d’une interface de supervision",
      width: homeMedia.geolocation.secondary.width,
      height: homeMedia.geolocation.secondary.height,
      objectPosition: "center",
      disclaimer: "Interface de démonstration — indicateurs illustratifs.",
    },
  },
] as const;

export type EquipmentEditorialItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  variant: "dominant" | "supporting";
  sizes: string;
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition: string;
  };
};

export const homeEquipmentIntro = {
  eyebrow: "02 · Équipements",
  titleLead: "Location et vente,",
  titleRest: "selon le terrain.",
  lead:
    "Des solutions sélectionnées selon votre besoin, votre zone d’intervention et les conditions confirmées avant engagement.",
  cta: {
    label: "Parler de votre besoin",
    href: "/contact",
  },
};

export const homeEquipmentItems: EquipmentEditorialItem[] = [
  {
    id: "mobilite",
    number: "01",
    title: "Mobilité professionnelle",
    description: "Véhicules et deux-roues adaptés aux besoins de déplacement et d’exploitation.",
    variant: "dominant",
    sizes: "(max-width: 767px) 100vw, (max-width: 1199px) 62vw, 46vw",
    media: {
      src: homeMedia.equipment.mobility.src,
      alt: "Berline, scooter utilitaire et technicien ONLOUTOU à Abidjan",
      width: homeMedia.equipment.mobility.width,
      height: homeMedia.equipment.mobility.height,
      objectPosition: "62% 38%",
    },
  },
  {
    id: "equipements",
    number: "02",
    title: "Équipements professionnels",
    description: "Inspection et préparation de matériels au-delà des seuls véhicules.",
    variant: "supporting",
    sizes: "(max-width: 1199px) 100vw, 32vw",
    media: {
      src: homeMedia.equipment.professional.src,
      alt: "Techniciens ONLOUTOU inspectant des équipements professionnels",
      width: homeMedia.equipment.professional.width,
      height: homeMedia.equipment.professional.height,
      objectPosition: "center 22%",
    },
  },
  {
    id: "installation",
    number: "03",
    title: "Installation et mise en service",
    description: "Vérification et mise en service d’équipements selon les besoins du projet.",
    variant: "supporting",
    sizes: "(max-width: 767px) 100vw, (max-width: 1199px) 36vw, 24vw",
    media: {
      src: homeMedia.equipment.field.src,
      alt: "Techniciens ONLOUTOU préparant un équipement avant sa mise en service",
      width: homeMedia.equipment.field.width,
      height: homeMedia.equipment.field.height,
      objectPosition: "center 40%",
    },
  },
  {
    id: "logistique",
    number: "04",
    title: "Solutions logistiques",
    description: "Utilitaires et besoins logistiques étudiés selon chaque demande.",
    variant: "supporting",
    sizes: "(max-width: 767px) 100vw, (max-width: 1199px) 36vw, 24vw",
    media: {
      src: homeMedia.equipment.logistics.src,
      alt: "Technicien ONLOUTOU inspectant un camion utilitaire",
      width: homeMedia.equipment.logistics.width,
      height: homeMedia.equipment.logistics.height,
      objectPosition: "42% 68%",
    },
  },
];

export type FleetCapability = {
  id: "localiser" | "suivre" | "alerter" | "analyser";
  number: string;
  title: string;
  description: string;
  visualTarget: "map" | "route" | "notification" | "analytics";
};

export const homeFleetIntro = {
  eyebrow: "03 · Connecter et piloter",
  titleLead: "Géolocalisez vos actifs.",
  titleRest: "Pilotez vos opérations.",
  lead:
    "Du boîtier installé sur le terrain à l’interface de supervision, ONLOUTOU relie position, alertes et données opérationnelles dans une même chaîne.",
  note: "Les fonctionnalités et engagements applicables dépendent du matériel, de la couverture et du contrat retenu.",
  cta: {
    label: "Découvrir l’offre",
    href: "/solutions",
  },
  disclaimer: "Interfaces de démonstration — données, indicateurs et positions illustratifs.",
  alert: {
    title: "Sortie de zone détectée",
    detail: "Donnée illustrative",
  },
};

export const homeFleetCapabilities: FleetCapability[] = [
  {
    id: "localiser",
    number: "01",
    title: "Localiser",
    description: "Visualiser la position et la dernière remontée disponible.",
    visualTarget: "map",
  },
  {
    id: "suivre",
    number: "02",
    title: "Suivre",
    description: "Observer les déplacements et l’activité des actifs connectés.",
    visualTarget: "route",
  },
  {
    id: "alerter",
    number: "03",
    title: "Alerter",
    description: "Configurer des événements et des zones de surveillance.",
    visualTarget: "notification",
  },
  {
    id: "analyser",
    number: "04",
    title: "Analyser",
    description: "Consulter les états, historiques et rapports disponibles.",
    visualTarget: "analytics",
  },
];

export const terrainMethodIntro = {
  eyebrow: "04 · Terrain",
  title: "Du terrain à la supervision, chaque étape compte.",
  lead:
    "ONLOUTOU prépare, déploie et contrôle les équipements afin de construire une chaîne opérationnelle cohérente, de l’installation à la prise en main.",
  cta: {
    label: "Découvrir notre méthode",
    href: "/expertise#approche",
  },
  emblem: {
    src: "/assets/images/logo/embleme-ovale-onloutou.png",
    alt: "",
    width: 1918,
    height: 820,
  },
};

export const terrainGalleryItems = [
  {
    id: "raccordement",
    src: "/assets/images/projects/project-b/raccordement-boitier-gps.png",
    alt: "Raccordement d’un boîtier GPS dans un véhicule",
    width: 1536,
    height: 1024,
    objectPosition: "46% 52%",
    span: "wide",
  },
  {
    id: "cablage",
    src: "/assets/images/projects/project-b/controle-cablage-automobile.png",
    alt: "Contrôle du câblage automobile avant mise en service",
    width: 1536,
    height: 1024,
    objectPosition: "48% 42%",
    span: "mid",
  },
  {
    id: "depot",
    src: "/assets/images/projects/project-b/operation-logistique-depot-abidjan.png",
    alt: "Opération logistique dans un dépôt à Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "40% 32%",
    span: "mid",
  },
  {
    id: "conducteur",
    src: "/assets/images/projects/project-b/conducteur-routes-abidjan.png",
    alt: "Conducteur au volant d’un véhicule professionnel",
    width: 1536,
    height: 1024,
    objectPosition: "30% 38%",
    span: "wide",
  },
  {
    id: "generateur",
    src: "/assets/images/projects/project-b/inspection-groupe-electrogene.png",
    alt: "Inspection technique d’un groupe électrogène",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
    span: "mid",
  },
  {
    id: "formation",
    src: "/assets/images/projects/project-b/formation-dispositif-connecte.png",
    alt: "Formation terrain à l’utilisation d’un dispositif connecté",
    width: 1536,
    height: 1024,
    objectPosition: "48% 38%",
    span: "wide",
  },
] as const;

export const terrainMethodSteps = [
  { id: "cadrer", number: "01", title: "Cadrer le besoin", shortTitle: "Cadrer" },
  { id: "installer", number: "02", title: "Installer et paramétrer", shortTitle: "Installer" },
  { id: "controler", number: "03", title: "Contrôler et tester", shortTitle: "Contrôler" },
  { id: "former", number: "04", title: "Former et accompagner", shortTitle: "Accompagner" },
] as const;

export const homeBuildIntro = {
  eyebrow: "05 · Construire",
  title: "Plateformes et projets sur mesure",
  lead:
    "ONLOUTOU conçoit des outils numériques adaptés aux opérations. La composition ci-contre illustre des modules possibles. Elle ne décrit pas une plateforme déjà commercialisée.",
  note: "Exemple de composition fonctionnelle",
};

export const homeBuildModules = [
  { title: "Tableaux de bord", text: "Vues utiles au pilotage, selon le périmètre retenu." },
  { title: "Alertes", text: "Repères configurables, sans promesse de temps réel public." },
  { title: "Rapports", text: "Exports et synthèses définis avec les équipes." },
  { title: "Accès", text: "Comptes et rôles selon les responsabilités." },
  { title: "Intégrations", text: "Connexions étudiées avec les outils existants." },
  { title: "Opérations", text: "Suivi des interventions et de la mise en service." },
] as const;

export const homeBuildScene = {
  src: homeMedia.geolocation.secondary.src,
  alt: "",
  width: homeMedia.geolocation.secondary.width,
  height: homeMedia.geolocation.secondary.height,
  sizes: "100vw",
};

export const projectShowcaseIntro = {
  eyebrow: "06 · Projets",
  title: "Des projets construits pour le terrain",
  lead:
    "De l’équipement à la plateforme numérique, ONLOUTOU adapte chaque intervention aux réalités opérationnelles du projet.",
};

export const projectShowcaseItems = [
  {
    id: "mobilite",
    index: "01",
    title: "Mobilité et équipements",
    shortTitle: "Mobilité",
    description:
      "Des moyens de mobilité et des équipements sélectionnés selon les usages, les contraintes du terrain et le périmètre du projet.",
    href: "/solutions/location#vehicules",
    cta: "Découvrir les solutions",
    src: "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
    alt: "Utilitaire, berline et scooter présentés dans une cour logistique",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  {
    id: "installation",
    index: "02",
    title: "Installation et mise en service",
    shortTitle: "Installation GPS",
    description:
      "Pose, raccordement, paramétrage et contrôle du dispositif avant sa prise en main opérationnelle.",
    href: "/solutions/geolocalisation#installation-terrain",
    cta: "Voir la géolocalisation",
    src: "/assets/images/projects/project-a/installation-gps-embarque.png",
    alt: "Technicien installant un dispositif GPS embarqué dans un pick-up",
    width: 1536,
    height: 1024,
    objectPosition: "62% 48%",
  },
  {
    id: "supervision",
    index: "03",
    title: "Supervision de flotte",
    shortTitle: "Supervision",
    description:
      "Une interface de pilotage peut réunir positions, alertes et informations utiles au suivi des opérations.",
    note: "Interface et données illustratives.",
    src: "/assets/images/projects/project-a/supervision-flotte-abidjan.png",
    alt: "Écran de démonstration de supervision de flotte consulté depuis un bureau",
    width: 1536,
    height: 1024,
    objectPosition: "72% 42%",
  },
  {
    id: "equipements",
    index: "04",
    title: "Gestion des équipements",
    shortTitle: "Équipements",
    description:
      "Identifier, organiser et suivre les équipements mobilisés dans les opérations quotidiennes.",
    href: "/expertise",
    cta: "Explorer les expertises",
    src: "/assets/images/projects/project-a/gestion-equipements-entrepot.png",
    alt: "Opératrice scannant des équipements dans un entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  {
    id: "plateforme",
    index: "05",
    title: "Plateformes sur mesure",
    shortTitle: "Plateforme",
    description:
      "Concevoir des outils numériques adaptés aux processus, aux équipes et au contexte du projet.",
    href: "/projets#plateformes",
    cta: "Voir les domaines de projets",
    src: "/assets/images/projects/project-a/reunion-projet-numerique.png",
    alt: "Équipe discutant d’un outil numérique autour d’une tablette",
    width: 1536,
    height: 1024,
    objectPosition: "72% 40%",
  },
] as const;

export const homeFleetScene = {
  primary: {
    src: homeMedia.geolocation.primary.src,
    alt: "Aperçu de démonstration de la carte de géolocalisation ONLOUTOU",
    width: homeMedia.geolocation.primary.width,
    height: homeMedia.geolocation.primary.height,
    label: "Carte des actifs",
    sizes: "(max-width: 767px) 100vw, (max-width: 1199px) 86vw, 52vw",
  },
  secondary: {
    src: homeMedia.geolocation.secondary.src,
    alt: "Aperçu de démonstration du tableau de supervision de flotte ONLOUTOU",
    width: homeMedia.geolocation.secondary.width,
    height: homeMedia.geolocation.secondary.height,
    label: "Supervision",
    sizes: "(max-width: 767px) 100vw, (max-width: 1199px) 62vw, 32vw",
  },
};

export const metricsDisclaimer =
  "Repères historiques déclarés par ONLOUTOU — non présentés comme des chiffres actuellement audités ou certifiés.";

export const metrics: Metric[] = [
  { value: "2016", label: "Année de création" },
  { value: "1 000+", label: "Clients accompagnés" },
  { value: "15+", label: "Distinctions obtenues" },
  { value: "4", label: "Pays touchés (présence historiquement déclarée)" },
];

export const solutionsIntro = {
  number: "01",
  eyebrow: "Nos métiers",
  title: "Une entreprise,",
  titleHighlight: "trois forces.",
  description:
    "De l’accès à un équipement jusqu’au pilotage des données, nous couvrons toute la chaîne de valeur.",
};

export const solutionPillars: SolutionPillar[] = [
  {
    id: "louer",
    tabLabel: "Louer",
    number: "01",
    tag: "Location & marketplace",
    title: "L’équipement qu’il faut, au moment où il le faut.",
    description:
      "Une approche de location flexible pour les particuliers, les professionnels et les opérateurs terrain. " +
      homePillarSummaries.louer,
    bullets: [
      "Électroménager et équipements du quotidien",
      "Vélos, outils et matériel professionnel",
      "Véhicules, camions et engins de chantier",
      "Gestion des annonces, commandes et livraisons",
    ],
    activityDomains: [
      "Location d’électroménager, de vélos, d’outils, de véhicules, de camions et d’engins de chantier",
    ],
  },
  {
    id: "connecter",
    tabLabel: "Connecter",
    number: "02",
    tag: "GPS · IoT · Données",
    title: "Chaque actif devient visible et pilotable.",
    description:
      "Nous connectons les véhicules et équipements pour sécuriser les actifs, maîtriser les opérations et éclairer les décisions. " +
      homePillarSummaries.connecter,
    bullets: [
      "Géolocalisation, historique des trajets, géozones et alertes",
      "Connectivité M2M et paramétrage selon le parc",
      "Supervision de flotte et remontée de données selon compatibilité véhicule",
      "Sécurisation et suivi des équipements financés",
      "Collecte, centralisation et exploitation des données GPS",
    ],
    activityDomains: [
      "Géolocalisation GPS",
      "Solutions IoT",
      "Gestion de flotte",
      "Sécurisation et suivi des équipements financés",
      "Accompagnement du crédit-bail (références historiques auprès de la BNI et de Banque Atlantique Côte d’Ivoire)",
      "Collecte, centralisation et exploitation des données GPS",
    ],
  },
  {
    id: "construire",
    tabLabel: "Construire",
    number: "03",
    tag: "Produits numériques",
    title: "Du besoin terrain à la plateforme métier.",
    description:
      "Nous concevons des outils numériques adaptés aux réalités opérationnelles des entreprises et institutions africaines. " +
      homePillarSummaries.construire,
    bullets: [
      "Applications web et mobiles sur mesure",
      "Tableaux de bord et plateformes métiers",
      "API, intégrations et flux de données",
      "Participation à des appels d’offres",
      "Réalisation de projets technologiques pour entreprises et institutions",
      "Formation, déploiement et support",
    ],
    activityDomains: [
      "Conception de plateformes et de solutions numériques",
      "Participation à des appels d’offres",
      "Réalisation de projets technologiques pour des entreprises et institutions",
    ],
  },
];

export const expertiseIntro = {
  number: "02",
  eyebrow: "Expertise terrain",
  title: "Des technologies utiles,",
  titleHighlight: "dans la vraie vie.",
  description:
    "Nous partons des contraintes opérationnelles pour livrer une solution exploitable, mesurable et durable. Champs d’intervention : " +
    homeExpertiseThemes.join(", ").replace(/, ([^,]*)$/, " et $1") +
    ".",
};

export const expertiseCases: ExpertiseCase[] = [
  {
    index: "01",
    tag: "Banque & crédit-bail",
    title: "Sécuriser les actifs financés",
    description:
      "ONLOUTOU dispose de références historiques dans la mise en œuvre de solutions GPS et de suivi d’actifs liées à des opérations de crédit-bail, notamment auprès de la BNI et de Banque Atlantique Côte d’Ivoire.",
    variant: "featured",
  },
  {
    index: "02",
    tag: "Flotte & opérations",
    title: "Piloter véhicules et équipements",
    description:
      "Déploiement de flotte, localisation, historiques, alertes et supervision opérationnelle. Reporting et tableaux de bord configurables selon la plateforme et le contrat, avec formation des équipes utilisatrices.",
  },
  {
    index: "03",
    tag: "Appels d’offres",
    title: "Concevoir et déployer des projets",
    description:
      "Analyse du besoin, réponses aux appels d’offres, proposition technique, déploiement, transfert de compétences et maintenance définis contractuellement — sans engagement public de niveaux de service chiffrés.",
  },
];

export const expertiseFlow = ["GPS embarqué", "Plateforme", "Données utiles", "Décision"];

export const platformIntro = {
  number: "03",
  eyebrow: "Écosystème produit",
  title: "Une plateforme pensée",
  titleHighlight: "pour chaque acteur.",
  description:
    "Utilisateurs, partenaires, livreurs et administrateurs disposent chacun des outils adaptés à leur mission.",
};

export const platformJourneys: PlatformJourney[] = [
  {
    number: "01",
    title: "Parcours utilisateurs",
    subtitle: "Catalogue · commande · paiement · suivi",
    description:
      "Parcours de location et de suivi conçu pour les utilisateurs finaux, de la découverte au suivi de commande.",
  },
  {
    number: "02",
    title: "Espace partenaires",
    subtitle: "Produits · performance · abonnements",
    description:
      "Outils pour les partenaires qui publient, suivent et pilotent leur activité sur la plateforme.",
  },
  {
    number: "03",
    title: "Pilotage des opérations",
    subtitle: "Admin · API · localisation · livraison",
    description:
      "Environnement d’administration, intégrations et suivi opérationnel pour les équipes terrain.",
  },
  {
    number: "04",
    title: "Présence institutionnelle",
    subtitle: "Vision · équipe · événements · actualités",
    description:
      "Vitrine et communication institutionnelle alignée avec l’identité et les messages de l’entreprise.",
  },
];

export const processIntro = {
  number: "04",
  eyebrow: "Notre méthode",
  title: "Du problème au résultat.",
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    phase: "Écouter",
    title: "Comprendre le terrain",
    description:
      "Utilisateurs, contraintes, données disponibles et objectifs opérationnels.",
  },
  {
    number: "02",
    phase: "Concevoir",
    title: "Définir la bonne réponse",
    description:
      "Architecture, matériel, parcours, indicateurs et proposition chiffrée.",
  },
  {
    number: "03",
    phase: "Déployer",
    title: "Passer à l’échelle",
    description:
      "Installation, paramétrage, tests de transmission, formation et mise en production selon le périmètre retenu.",
  },
  {
    number: "04",
    phase: "Accompagner",
    title: "Mesurer et améliorer",
    description:
      "Support, maintenance, analyse des données et évolution continue.",
  },
];

export const aboutContent = {
  eyebrow: "Notre histoire",
  title: "Née pour rendre l’usage",
  titleHighlight: "plus simple que la possession.",
  paragraphs: [
    "Créée à Abidjan en 2016, ONLOUTOU a commencé par rendre des équipements accessibles à la location. L’entreprise a ensuite étendu son savoir-faire à la géolocalisation, à l’IoT, au pilotage de flottes et à la conception de plateformes métiers.",
    "Aujourd’hui, cette double culture — terrain et technologie — permet de répondre aux besoins des particuliers, des entreprises, des banques et des institutions.",
    "Comoé Capital : investisseur historique d’ONLOUTOU en 2019, avec une sortie annoncée en 2021.",
  ],
  mapTitle: "Rayonnement historique",
  mapSubtitle: "Afrique de l’Ouest & centrale",
  mapNote: "Présences et activités historiquement déclarées",
  countries: ["Côte d’Ivoire", "Guinée", "Burkina Faso", "Gabon"],
};

export const teamIntro = {
  number: "05",
  eyebrow: "Leadership",
  title: "Une équipe qui connaît",
  titleHighlight: "le terrain et la tech.",
};

export const teamMembers: TeamMember[] = [
  {
    initials: "AD",
    role: "Fondateur & Directeur général",
    name: "Adams Ousmane Diaby",
    bio:
      "Vision stratégique, développement des partenariats et expertise dans la location et les solutions de sécurisation d’actifs.",
  },
  {
    initials: "SJ",
    role: "CTO · Produits technologiques",
    name: "Gnon Sidney Jordan",
    bio:
      "Conception des plateformes, architecture produit et pilotage technique des projets numériques et IoT.",
    variant: "alt",
  },
  {
    initials: "＋",
    role: "Écosystème d’experts",
    name: "Ingénieurs, techniciens & partenaires",
    bio:
      "Une équipe élargie mobilisée selon les besoins : GPS, IoT, développement, installation, formation et support.",
    variant: "join",
  },
];

export const contactCta = {
  eyebrow: "Parlons de votre projet",
  title: "Un actif à connecter ?",
  titleLine2: "Une opération à digitaliser ?",
  description:
    "Présentez-nous votre besoin. Notre équipe vous aide à cadrer une réponse technique et opérationnelle adaptée à votre contexte.",
  primaryLabel: "Parler à notre équipe",
  whatsappLabel: "Écrire sur WhatsApp",
};

export const footerTagline =
  "Équiper, connecter et piloter les actifs qui font avancer vos opérations.";
