import { whatsappUrlForMessage } from "@/content/contact-page";
import { siteMedia } from "@/content/media";
import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export const CONNECTED_ASSET_PREFILL_KEY = "onloutou-connected-asset";

const solutions = siteMedia.solutions;
const dashboards = siteMedia.dashboards;
const geoSvg = siteMedia.illustrations.geolocalisation;

export const connectedEquipmentPageSeo = {
  title: "Équipements connectés, traceurs GPS et balises",
  description:
    "ONLOUTOU étudie les traceurs GPS, balises autonomes, équipements embarqués, connectivité et plateformes adaptés aux actifs professionnels.",
};

export const connectedEquipmentMedia = {
  heroInstall: {
    ...solutions.installationTraceur,
    objectPosition: "52% 42%",
  },
  installBerline: {
    ...solutions.installationBerline,
    objectPosition: "50% 40%",
  },
  installTraceur: solutions.installationTraceur,
  inspectCabling: {
    ...solutions.inspectionCablage,
    objectPosition: "55% 38%",
  },
  dashboardGeo: dashboards.geolocalisationAbidjan,
  dashboardSupervision: dashboards.supervision,
  architectureSvg: geoSvg,
};

export const connectedEquipmentBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements", href: "/equipements" },
  { label: "Équipements connectés" },
];

export const connectedEquipmentHero = {
  eyebrow: "ÉQUIPEMENTS · ÉQUIPEMENTS CONNECTÉS",
  titleBefore: "Connecter le terrain à ",
  titleHighlight: "une supervision utile.",
  intro:
    "ONLOUTOU étudie les équipements, la connectivité et l’intégration nécessaires pour localiser, superviser ou sécuriser différents types d’actifs.",
  chain: ["Actif", "Équipement", "Réseau", "Plateforme", "Alerte"],
  chainDisclaimer: "Architecture illustrative — configuration selon le projet",
  primaryCta: { label: "Qualifier mon équipement", href: "#demande-connectee" },
  secondaryCta: { label: "Comprendre l’architecture", href: "#architecture-connectee" },
};

export const connectedQuickQuestions = [
  "Quel actif ?",
  "Quelle alimentation ?",
  "Quelle zone d’utilisation ?",
  "Quelles informations sont réellement nécessaires ?",
] as const;

export const connectedArchitecture = {
  id: "architecture-connectee",
  title: "Un équipement connecté ne fonctionne jamais seul.",
  notice:
    "Les fonctions disponibles dépendent de l’équipement retenu, de son installation, de la connectivité, de la plateforme et du contexte d’exploitation.",
  layers: [
    {
      number: "01",
      title: "L’actif",
      items: [
        "véhicule",
        "moto",
        "camion",
        "engin",
        "équipement mobile",
        "matériel non motorisé",
        "installation fixe",
      ],
    },
    {
      number: "02",
      title: "L’équipement",
      items: [
        "traceur filaire",
        "balise autonome",
        "boîtier embarqué",
        "capteur ou accessoire compatible",
        "dispositif d’identification",
      ],
    },
    {
      number: "03",
      title: "La connectivité",
      items: [
        "réseau mobile",
        "carte SIM ou connectivité M2M",
        "transmission configurée selon la solution",
        "remontée différée ou périodique selon l’équipement",
      ],
    },
    {
      number: "04",
      title: "La plateforme",
      items: [
        "cartographie",
        "consultation des actifs",
        "historique selon configuration",
        "gestion d’alertes",
        "rapports",
        "droits d’accès",
      ],
    },
    {
      number: "05",
      title: "L’exploitation",
      items: [
        "supervision",
        "organisation des opérations",
        "analyse d’événements",
        "accompagnement à la décision",
        "suivi des interventions",
      ],
    },
  ],
};

export type ConnectedAssetId =
  | "light-vehicle"
  | "moto"
  | "truck"
  | "powered"
  | "no-power"
  | "fixed";

export const connectedAssetExplorer = {
  title: "Le choix commence par l’actif à connecter.",
  disclaimer: "Équipement à confirmer après qualification",
  items: [
    {
      id: "light-vehicle" as ConnectedAssetId,
      label: "voiture ou véhicule léger",
      checks: [
        "alimentation disponible",
        "type d’utilisation",
        "fréquence de transmission recherchée",
        "environnement d’installation",
        "besoins d’alerte",
        "accès au véhicule pour l’installation",
      ],
      families: ["traceur filaire à étudier", "connectivité embarquée", "accessoires de pose"],
      limits: ["emplacement à valider", "interférences possibles", "configuration réseau à confirmer"],
    },
    {
      id: "moto" as ConnectedAssetId,
      label: "moto",
      checks: ["alimentation", "vibrations", "exposition", "discrétion", "accès batterie ou circuit"],
      families: ["boîtier compact à étudier", "balise selon contraintes"],
      limits: ["autonomie à confirmer", "fixation à valider", "environnement routier"],
    },
    {
      id: "truck" as ConnectedAssetId,
      label: "camion ou engin",
      checks: ["alimentation", "usage professionnel", "environnement chantier ou route", "alertes souhaitées"],
      families: ["traceur embarqué", "capteurs ou entrées à étudier"],
      limits: ["compatibilité actif", "maintenance d’accès", "connectivité zone"],
    },
    {
      id: "powered" as ConnectedAssetId,
      label: "équipement alimenté",
      checks: ["type d’alimentation", "cycles d’usage", "emplacement du boîtier", "besoin de transmission"],
      families: ["traceur ou module à étudier", "interfaces compatibles"],
      limits: ["environnement industriel", "câblage à qualifier"],
    },
    {
      id: "no-power" as ConnectedAssetId,
      label: "équipement sans alimentation permanente",
      checks: [
        "autonomie réellement nécessaire",
        "fréquence de déplacement",
        "fréquence de transmission",
        "accessibilité pour la maintenance",
        "environnement",
        "taille et discrétion attendues",
      ],
      families: ["balise autonome à étudier", "configuration possible selon compatibilité"],
      limits: ["autonomie à confirmer", "pas de transmission permanente garantie"],
    },
    {
      id: "fixed" as ConnectedAssetId,
      label: "installation fixe ou besoin particulier",
      checks: ["nature du site", "alimentation", "connectivité", "sécurité", "intégration plateforme"],
      families: ["dispositif fixe à étudier", "solution sur mesure à cadrer"],
      limits: ["périmètre projet à définir", "services associés à confirmer"],
    },
  ],
};

export const connectedAssetRequestLabels: Record<ConnectedAssetId, string> = {
  "light-vehicle": "voiture ou véhicule léger",
  moto: "moto",
  truck: "camion ou engin",
  powered: "équipement mobile alimenté",
  "no-power": "matériel sans alimentation permanente",
  fixed: "installation fixe ou besoin particulier",
};

export const connectedEquipmentFamiliesSection = {
  title: "Des équipements différents pour des contraintes différentes.",
  families: [
    {
      number: "01",
      title: "Traceurs filaires",
      lead: "Pour les actifs disposant d’une alimentation adaptée et d’un environnement compatible avec une installation embarquée.",
      criteria: ["alimentation", "emplacement", "pose", "fréquence de transmission", "réseau disponible", "accessoires"],
    },
    {
      number: "02",
      title: "Balises autonomes",
      lead: "Pour les actifs nécessitant une alimentation indépendante ou ne disposant pas d’une alimentation permanente exploitable.",
      criteria: [
        "autonomie recherchée",
        "fréquence de transmission",
        "mobilité",
        "accessibilité",
        "conditions climatiques",
        "méthode de fixation",
      ],
    },
    {
      number: "03",
      title: "Connectivité et transmission",
      lead: "Éléments à configurer selon le projet — sans garantie de couverture ou de transmission instantanée.",
      criteria: ["SIM", "connectivité M2M", "configuration réseau", "paramétrage de transmission", "cycle de communication"],
    },
    {
      number: "04",
      title: "Capteurs et accessoires",
      lead: "Possibilités à étudier selon le matériel et le contexte.",
      criteria: [
        "bouton ou entrée d’alerte",
        "identification",
        "accessoires de fixation",
        "alimentation complémentaire",
        "interfaces compatibles",
        "capteurs selon projet",
      ],
    },
    {
      number: "05",
      title: "Interfaces et plateformes",
      lead: "Accès et fonctions selon la solution retenue — sans tarif ni stock affiché.",
      criteria: [
        "accès Web ou mobile selon solution",
        "cartographie",
        "événements",
        "alertes",
        "rapports",
        "profils utilisateurs",
        "intégrations à étudier",
      ],
    },
  ],
};

export const connectedInstallationStory = {
  title: "La qualité du projet dépend aussi de l’installation.",
  notice:
    "Le processus exact varie selon l’actif, l’équipement, le véhicule, l’accès technique et le périmètre contractuel.",
  phases: [
    {
      key: "prepare",
      title: "Préparer",
      steps: [
        "identifier le véhicule ou l’équipement",
        "examiner les contraintes",
        "définir l’emplacement",
        "préparer les accessoires",
      ],
      imageKey: "installBerline" as const,
    },
    {
      key: "install",
      title: "Installer",
      steps: [
        "réaliser la pose selon la configuration retenue",
        "protéger le câblage",
        "limiter les interférences avec l’utilisation normale",
        "documenter l’intervention",
      ],
      imageKey: "installTraceur" as const,
    },
    {
      key: "test",
      title: "Tester",
      steps: [
        "contrôler l’alimentation",
        "vérifier la transmission",
        "confirmer la remontée dans l’interface",
        "enregistrer les informations utiles au suivi",
      ],
      imageKey: "inspectCabling" as const,
    },
    {
      key: "handover",
      title: "Transmettre",
      steps: [
        "expliquer le fonctionnement",
        "remettre les accès nécessaires",
        "préciser les limites",
        "présenter les conditions de support ou de maintenance applicables",
      ],
      imageKey: "installTraceur" as const,
    },
  ],
};

export const connectedSupervisionSection = {
  title: "Du signal technique à l’information exploitable.",
  functions: ["visualiser", "rechercher", "recevoir des événements", "produire des informations utiles aux opérations"],
  demoLabel: "Interface de démonstration",
  dataLabel: "Données et positions présentées à titre illustratif.",
  links: [
    { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
};

export const connectedQualificationCriteria = {
  title: "Huit critères avant de retenir un équipement.",
  items: [
    { number: "01", title: "type d’actif", detail: "Nature du véhicule, engin, matériel ou installation à équiper." },
    { number: "02", title: "alimentation disponible", detail: "Permanent, intermittent ou absent — à documenter avant sélection." },
    { number: "03", title: "zone d’utilisation", detail: "Périmètre géographique et contraintes de couverture à étudier." },
    { number: "04", title: "fréquence de déplacement", detail: "Statique, occasionnel ou intensif — sans supposer une précision." },
    { number: "05", title: "fréquence de transmission recherchée", detail: "Périodique, événementielle ou à définir — sans promesse temps réel." },
    { number: "06", title: "environnement et exposition", detail: "Intérieur, extérieur, poussière, humidité, vibrations." },
    { number: "07", title: "fonctions réellement utiles", detail: "Localisation, alertes, rapports, intégration — à prioriser." },
    { number: "08", title: "accès pour installation et maintenance", detail: "Disponibilité des actifs, compétences et planning." },
  ],
};

export const connectedTransparency = {
  title: "Une fiche technique ne suffit pas.",
  items: [
    "référence exacte",
    "réseau pris en charge",
    "mode d’alimentation",
    "autonomie applicable",
    "fréquence de transmission",
    "dimensions",
    "résistance environnementale",
    "méthode de fixation",
    "accessoires",
    "compatibilité avec l’actif",
    "modalités d’installation",
    "abonnement ou connectivité",
    "plateforme associée",
    "garantie applicable",
    "disponibilité",
    "prix",
    "maintenance",
  ],
  note:
    "Aucune compatibilité, autonomie, précision, couverture, fonction ou disponibilité n’est considérée comme acquise avant validation de la référence et du contexte d’utilisation.",
};

export const connectedEquipmentProcess: DeploymentPhase[] = [
  { step: "01", title: "Recenser", description: "Identifier les actifs et leurs usages." },
  { step: "02", title: "Qualifier", description: "Documenter alimentation, environnement et contraintes." },
  { step: "03", title: "Sélectionner", description: "Étudier l’équipement et la connectivité." },
  { step: "04", title: "Installer", description: "Préparer la pose et réaliser les contrôles convenus." },
  { step: "05", title: "Configurer", description: "Associer l’équipement à la plateforme et aux accès." },
  { step: "06", title: "Accompagner", description: "Transmettre les usages et organiser le suivi applicable." },
];

export const connectedRequestOptions = {
  assets: [
    { id: "light-vehicle", label: "voiture ou véhicule léger" },
    { id: "moto", label: "moto" },
    { id: "truck", label: "camion" },
    { id: "machine", label: "engin" },
    { id: "mobile", label: "équipement mobile" },
    { id: "no-power", label: "matériel sans alimentation permanente" },
    { id: "fixed", label: "installation fixe" },
    { id: "other", label: "autre" },
  ],
  power: [
    { id: "permanent", label: "alimentation permanente possible" },
    { id: "intermittent", label: "alimentation intermittente" },
    { id: "none", label: "aucune alimentation disponible" },
    { id: "unknown", label: "information inconnue" },
  ],
  needs: [
    { id: "loc", label: "localisation" },
    { id: "history", label: "historique de déplacements" },
    { id: "alerts", label: "alertes" },
    { id: "supervision", label: "supervision d’activité" },
    { id: "security", label: "sécurisation" },
    { id: "maintenance", label: "maintenance ou événement technique" },
    { id: "platform", label: "intégration à une plateforme" },
    { id: "tbd", label: "besoin à préciser" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "Côte d’Ivoire" },
    { id: "multi", label: "plusieurs pays" },
    { id: "specific", label: "zone spécifique à décrire" },
    { id: "tbd", label: "à déterminer" },
  ],
  frequencies: [
    { id: "occasional", label: "consultation occasionnelle" },
    { id: "regular", label: "suivi opérationnel régulier" },
    { id: "events", label: "événements et alertes" },
    { id: "tbd", label: "à déterminer après étude" },
  ],
  services: [
    { id: "equipment", label: "fourniture de l’équipement" },
    { id: "install", label: "installation" },
    { id: "config", label: "configuration" },
    { id: "platform", label: "plateforme" },
    { id: "training", label: "formation" },
    { id: "maintenance", label: "maintenance" },
    { id: "integration", label: "intégration" },
    { id: "global", label: "accompagnement global" },
  ],
};

export function buildConnectedEquipmentWhatsAppMessage(fields: {
  assetLabel: string;
  count: string;
  powerLabel: string;
  needLabel: string;
  zoneLabel: string;
  frequencyLabel: string;
  servicesLabels: string;
  details: string;
}) {
  return [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite étudier un projet d’équipements connectés.",
    "",
    `Type d’actif : ${fields.assetLabel}`,
    `Nombre indicatif : ${fields.count || "non précisé"}`,
    `Alimentation disponible : ${fields.powerLabel}`,
    `Besoin principal : ${fields.needLabel}`,
    `Zone d’utilisation : ${fields.zoneLabel}`,
    `Fréquence souhaitée : ${fields.frequencyLabel}`,
    `Services souhaités : ${fields.servicesLabels || "à déterminer"}`,
    `Précisions : ${fields.details || "—"}`,
  ].join("\n");
}

export function buildConnectedEquipmentWhatsAppUrl(fields: Parameters<typeof buildConnectedEquipmentWhatsAppMessage>[0]) {
  return whatsappUrlForMessage(buildConnectedEquipmentWhatsAppMessage(fields));
}

export const connectedEquipmentFaq: ServiceFaqItem[] = [
  {
    question: "Quelle différence entre un traceur filaire et une balise autonome ?",
    answer:
      "Un traceur filaire s’appuie généralement sur une alimentation de l’actif. Une balise autonome vise les cas sans alimentation permanente. La référence et la configuration doivent être confirmées.",
  },
  {
    question: "Peut-on connecter un équipement sans alimentation permanente ?",
    answer: "Cela peut être étudié avec une balise ou un dispositif adapté. Autonomie, transmission et maintenance doivent être qualifiées.",
  },
  {
    question: "Tous les équipements fonctionnent-ils partout ?",
    answer: "Non. La couverture, le réseau et l’environnement dépendent du projet et de la référence retenue.",
  },
  {
    question: "L’installation est-elle obligatoire ?",
    answer: "Une installation encadrée est généralement nécessaire pour un équipement embarqué. Le périmètre est défini dans la proposition.",
  },
  {
    question: "Peut-on utiliser une plateforme déjà existante ?",
    answer: "Une intégration peut être étudiée selon les interfaces, les droits et le périmètre technique — à confirmer.",
  },
  {
    question: "Peut-on recevoir des alertes ?",
    answer: "Des alertes configurables peuvent faire partie de la solution selon l’équipement et la plateforme — sans garantie universelle.",
  },
  {
    question: "Quelle autonomie peut-on attendre ?",
    answer: "Elle dépend de la référence, de la fréquence de transmission et de l’usage. Aucune valeur ne doit être supposée sans confirmation.",
  },
  {
    question: "Comment connaître le prix et la disponibilité ?",
    answer: "Transmettez une demande qualifiée. Prix, disponibilité et conditions ne sont confirmés qu’après étude.",
  },
];

export const connectedFinalCta = {
  eyebrow: "ÉTUDE TECHNIQUE",
  title: "Connectons seulement ce qui apporte une information utile.",
  lead:
    "Décrivez les actifs, les contraintes et les usages attendus. ONLOUTOU vous aidera à cadrer l’équipement, la connectivité et la plateforme à étudier.",
  primary: { label: "Qualifier mon projet", href: "#demande-connectee" },
  secondary: { label: "Découvrir nos solutions", href: "/solutions" },
  tertiary: { label: "Retour aux équipements", href: "/equipements" },
};

export function connectedEquipmentBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Équipements", item: `${baseUrl}/equipements` },
      { "@type": "ListItem", position: 3, name: "Équipements connectés", item: `${baseUrl}/equipements/equipements-connectes` },
    ],
  };
}

export function connectedEquipmentServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Étude d’équipements connectés et dispositifs de localisation",
    provider: { "@type": "Organization", name: "ONLOUTOU", url: baseUrl },
    areaServed: "Côte d’Ivoire",
    description: connectedEquipmentPageSeo.description,
    url: `${baseUrl}/equipements/equipements-connectes`,
  };
}
