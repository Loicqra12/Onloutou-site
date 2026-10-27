import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export const TOOLS_FAMILY_PREFILL_KEY = "onloutou-tools-family";
export const TOOLS_MODE_PREFILL_KEY = "onloutou-tools-mode";

const menuBase = "/assets/images/menu";
const projectABase = "/assets/images/projects/project-a";
const projectBBase = "/assets/images/projects/project-b";

export const toolsEquipmentPageSeo = {
  title: "Outils et matériels professionnels en location ou acquisition",
  description:
    "Qualifiez vos besoins en outils, matériels techniques, énergie, maintenance et équipements professionnels avec ONLOUTOU en Côte d’Ivoire.",
};

export const toolsEquipmentMedia = {
  hero: {
    src: `${menuBase}/Contrôle d’un groupe électrogène à Abidjan-2.png`,
    alt: "Technicien contrôlant un groupe électrogène avec du matériel technique autour",
    width: 1586,
    height: 992,
    objectPosition: "55% 42%",
  },
  readiness: {
    src: `${projectABase}/gestion-equipements-entrepot.png`,
    alt: "Opératrice organisant et scannant des équipements en entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  inspection: {
    src: `${projectBBase}/inspection-groupe-electrogene.png`,
    alt: "Technicien inspectant un groupe électrogène avant utilisation",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
  },
};

export const toolsEquipmentHeroCartouche = {
  title: "Sélection guidée",
  items: ["Usage", "Environnement", "Énergie", "Fréquence", "Logistique"],
};

export const toolsEquipmentBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements", href: "/equipements" },
  { label: "Outils et matériels" },
];

export const toolsEquipmentHero = {
  eyebrow: "ÉQUIPEMENTS · OUTILS ET MATÉRIELS",
  titleBefore: "Le bon matériel commence par ",
  titleHighlight: "le travail à accomplir.",
  intro:
    "ONLOUTOU vous aide à qualifier les outils et matériels adaptés à vos interventions, à votre environnement et à votre organisation, en location ou en acquisition selon les possibilités étudiées.",
  primaryCta: { label: "Définir mon besoin", href: "#demande-materiel" },
  secondaryCta: { label: "Explorer les familles", href: "#familles-materiels" },
};

export const toolsQualificationQuestions = [
  "Quel travail doit être réalisé ?",
  "Dans quel environnement ?",
  "Quelle source d’énergie est disponible ?",
  "À quelle fréquence le matériel sera-t-il utilisé ?",
  "Comment sera-t-il transporté et stocké ?",
] as const;

export type ToolsFamilyId =
  | "intervention"
  | "energie"
  | "chantier"
  | "maintenance"
  | "stockage"
  | "particulier";

export const toolsEquipmentFamilies = {
  id: "familles-materiels",
  title: "Des familles organisées par usage, pas par catalogue.",
  items: [
    {
      id: "intervention" as ToolsFamilyId,
      number: "01",
      title: "Outillage d’intervention",
      description: "Matériels pour préparer, intervenir et sécuriser une opération technique sur site ou en atelier.",
      examples: [
        "outils manuels",
        "outillage électroportatif",
        "accessoires d’intervention",
        "équipements de préparation",
        "solutions de rangement",
      ],
      contexts: ["intervention technique", "maintenance légère", "préparation de poste", "dépannage encadré"],
      questions: ["nature du travail", "accès", "alimentation", "durée", "équipements complémentaires"],
    },
    {
      id: "energie" as ToolsFamilyId,
      number: "02",
      title: "Énergie et autonomie",
      description: "Solutions d’alimentation à étudier selon l’usage, l’environnement et les contraintes du site.",
      examples: [
        "groupes électrogènes",
        "solutions d’alimentation",
        "rallonges et accessoires adaptés",
        "équipements d’autonomie énergétique à étudier",
      ],
      contexts: ["coupure réseau", "site isolé", "renfort temporaire", "événement professionnel"],
      questions: ["besoin énergétique à préciser", "environnement", "bruit", "autonomie", "raccordements"],
    },
    {
      id: "chantier" as ToolsFamilyId,
      number: "03",
      title: "Chantier léger et opérations terrain",
      description: "Équipements mobiles et de préparation pouvant être étudiés pour des opérations terrain encadrées.",
      examples: [
        "équipements de préparation",
        "pompage ou compression selon besoin",
        "éclairage de travail",
        "accès et intervention",
        "équipements mobiles de chantier",
      ],
      contexts: ["chantier léger", "accès difficile", "travaux temporaires", "renfort d’équipe"],
      questions: ["type d’opération", "sol", "circulation", "durée", "sécurité applicable"],
    },
    {
      id: "maintenance" as ToolsFamilyId,
      number: "04",
      title: "Maintenance et inspection",
      description: "Instruments et matériels pour contrôler, entretenir ou diagnostiquer — sans promesse de certification.",
      examples: [
        "instruments de contrôle",
        "équipements d’inspection",
        "matériels d’entretien",
        "outils de diagnostic",
        "accessoires de sécurité associés à l’usage",
      ],
      contexts: ["contrôle périodique", "diagnostic", "entretien programmé", "inspection avant usage"],
      questions: ["objet du contrôle", "fréquence", "compétence opérateur", "documentation", "environnement"],
    },
    {
      id: "stockage" as ToolsFamilyId,
      number: "05",
      title: "Stockage et logistique",
      description: "Organisation du matériel, de la circulation interne et de la préparation avant déploiement.",
      examples: ["rangement", "organisation d’atelier", "stockage mobile", "transport interne", "préparation des équipements"],
      contexts: ["entrepôt", "atelier", "base chantier", "logistique interne"],
      questions: ["volume", "fréquence de rotation", "accès", "traçabilité", "conditionnement"],
    },
    {
      id: "particulier" as ToolsFamilyId,
      number: "06",
      title: "Besoins particuliers",
      description:
        "Certains projets nécessitent une combinaison de matériels, d’accessoires, de logistique et d’accompagnement. ONLOUTOU étudie alors la demande à partir de l’usage réel et des contraintes du terrain.",
      examples: [],
      contexts: ["projet multisite", "combinaison de familles", "contraintes fortes", "accompagnement à cadrer"],
      questions: ["périmètre global", "calendrier", "sites", "services associés", "priorités"],
    },
  ],
};

export const toolsFamilyRequestLabels: Record<ToolsFamilyId, string> = {
  intervention: "outillage d’intervention",
  energie: "énergie et autonomie",
  chantier: "chantier léger",
  maintenance: "maintenance et inspection",
  stockage: "stockage et logistique",
  particulier: "besoin particulier",
};

export const toolsReadinessSection = {
  title: "Un matériel n’est utile que s’il est prêt au bon moment.",
  axes: [
    "identification du besoin",
    "préparation des accessoires",
    "organisation du stockage",
    "disponibilité pour l’opération",
  ],
  lead: "Avant toute proposition, nous cherchons notamment à comprendre :",
  bullets: [
    "le travail attendu",
    "les contraintes du site",
    "les accessoires indispensables",
    "le transport et le rangement",
    "le niveau d’accompagnement souhaité",
  ],
};

export const toolsInspectionSection = {
  title: "Vérifier avant de proposer.",
  factors: [
    "son usage prévu",
    "son environnement",
    "la source d’énergie",
    "la puissance ou capacité nécessaire",
    "les accessoires compatibles",
    "les conditions de transport",
    "la compétence de l’opérateur",
    "les exigences de maintenance",
  ],
  prudence:
    "Les caractéristiques, accessoires, capacités et conditions d’utilisation varient selon la référence effectivement proposée. Ils doivent être confirmés avant toute commande, location ou déploiement.",
};

export const toolsRentAcquireCompare = {
  title: "Louer, acquérir ou comparer",
  rent: {
    title: "Location",
    when: [
      "le besoin est temporaire",
      "la fréquence d’utilisation est limitée",
      "le projet nécessite une durée définie",
      "l’entreprise souhaite éviter une acquisition immédiate",
    ],
    href: "/solutions/location",
    label: "Explorer la location",
  },
  buy: {
    title: "Acquisition",
    when: [
      "le besoin est récurrent",
      "l’équipement doit être intégré durablement",
      "l’entreprise veut constituer son propre parc",
      "les conditions d’exploitation sont maîtrisées",
    ],
    href: "/solutions/vente",
    label: "Explorer l’acquisition",
  },
  compare: {
    title: "Étude comparative",
    when: [
      "la durée n’est pas encore claire",
      "plusieurs scénarios doivent être comparés",
      "les contraintes logistiques influencent le choix",
      "des services complémentaires sont nécessaires",
    ],
    cta: { label: "Comparer les options", href: "#demande-materiel", mode: "comparer les deux" },
  },
};

export const toolsConnectedSection = {
  title: "Certains équipements peuvent aussi être suivis.",
  lead:
    "Lorsque la nature de l’équipement, son environnement et la solution technique le permettent, un projet peut intégrer des fonctions d’identification, de positionnement, d’alerte ou de suivi d’usage.",
  links: [
    { label: "Géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
    { label: "Plateformes sur mesure", href: "/solutions/plateformes-sur-mesure" },
  ],
};

export const toolsSelectionMatrix = {
  title: "Sept critères pour cadrer votre besoin.",
  criteria: [
    { number: "01", title: "fonction attendue", detail: "Quel résultat opérationnel le matériel doit permettre d’atteindre." },
    { number: "02", title: "environnement d’utilisation", detail: "Intérieur, extérieur, humidité, poussière, circulation, accès." },
    { number: "03", title: "source d’énergie", detail: "Réseau, groupe, batterie, contrainte à préciser — sans valeur imposée." },
    { number: "04", title: "fréquence et durée", detail: "Ponctuel, saisonnier, récurrent ou projet long — à confirmer." },
    { number: "05", title: "transport et stockage", detail: "Mobilisation, rangement, sécurisation et préparation avant usage." },
    { number: "06", title: "accessoires et consommables", detail: "Câbles, fixations, protections, consommables éventuels à lister." },
    { number: "07", title: "opérateurs et accompagnement", detail: "Compétence disponible, formation, mise en service ou support à étudier." },
  ],
};

export const toolsEquipmentProcess = {
  title: "De la demande au matériel proposé.",
  steps: [
    { title: "Décrire", description: "Préciser le travail et le résultat attendu." },
    { title: "Qualifier", description: "Identifier le site, les contraintes et la fréquence." },
    { title: "Sélectionner", description: "Étudier la famille et les caractéristiques pertinentes." },
    { title: "Vérifier", description: "Confirmer compatibilités, accessoires et accompagnement." },
    { title: "Proposer", description: "Présenter une option de location, d’acquisition ou une comparaison." },
    { title: "Confirmer", description: "Valider la référence, les conditions et la disponibilité." },
  ],
};

export const toolsRequestOptions = {
  modes: [
    { id: "rent", label: "location" },
    { id: "buy", label: "acquisition" },
    { id: "compare", label: "comparer les deux" },
    { id: "tbd", label: "à déterminer" },
  ],
  durations: [
    { id: "once", label: "besoin ponctuel" },
    { id: "days", label: "quelques jours" },
    { id: "weeks", label: "plusieurs semaines" },
    { id: "recurring", label: "récurrent" },
    { id: "tbd", label: "à déterminer" },
  ],
  services: [
    { id: "delivery", label: "livraison" },
    { id: "install", label: "installation ou mise en service" },
    { id: "training", label: "formation" },
    { id: "maintenance", label: "maintenance" },
    { id: "connected", label: "suivi connecté à étudier" },
    { id: "support", label: "accompagnement à déterminer" },
  ],
};

export function buildToolsEquipmentWhatsAppMessage(fields: {
  familyLabel: string;
  usage: string;
  quantity: string;
  modeLabel: string;
  durationLabel: string;
  zone: string;
  energy: string;
  servicesLabels: string;
  details: string;
}) {
  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite étudier un besoin en outils ou matériels professionnels.",
    "",
    `Famille : ${fields.familyLabel}`,
    `Usage : ${fields.usage || "à préciser"}`,
    `Quantité indicative : ${fields.quantity || "non précisée"}`,
    `Mode souhaité : ${fields.modeLabel}`,
    `Durée ou fréquence : ${fields.durationLabel}`,
    `Zone d’utilisation : ${fields.zone || "à préciser"}`,
    `Contraintes : ${fields.energy || "non précisées"}`,
    `Services souhaités : ${fields.servicesLabels || "à déterminer"}`,
    `Précisions : ${fields.details || "—"}`,
  ];
  return lines.join("\n");
}

export function buildToolsEquipmentWhatsAppUrl(fields: Parameters<typeof buildToolsEquipmentWhatsAppMessage>[0]) {
  return whatsappUrlForMessage(buildToolsEquipmentWhatsAppMessage(fields));
}

export const toolsTransparency = {
  title: "Informations confirmées avant engagement",
  items: [
    "référence exacte",
    "caractéristiques utiles",
    "accessoires inclus ou nécessaires",
    "consommables éventuels",
    "état du matériel si applicable",
    "quantité",
    "disponibilité",
    "prix",
    "taxes",
    "livraison",
    "mise en service",
    "formation",
    "garantie applicable",
    "maintenance éventuelle",
  ],
  note:
    "Aucune disponibilité, caractéristique ou condition commerciale n’est considérée comme acquise avant confirmation écrite.",
};

export const toolsEquipmentFaq: ServiceFaqItem[] = [
  {
    question: "Quels types de matériels peut-on demander ?",
    answer:
      "Les familles présentées couvrent l’intervention, l’énergie, le chantier léger, la maintenance, le stockage et les besoins combinés. Chaque demande est qualifiée selon l’usage réel.",
  },
  {
    question: "Peut-on louer un matériel pour quelques jours ?",
    answer: "Une location de courte durée peut être étudiée selon la catégorie, la zone et la disponibilité — à confirmer après qualification.",
  },
  {
    question: "Comment choisir entre location et acquisition ?",
    answer:
      "Le choix dépend de la fréquence, de la durée, de la logistique et des services nécessaires. Une étude comparative peut être proposée lorsque le scénario n’est pas encore fixé.",
  },
  {
    question: "Les accessoires sont-ils inclus ?",
    answer: "Les accessoires et consommables doivent être listés et confirmés dans la proposition. Ils ne sont pas supposés inclus par défaut.",
  },
  {
    question: "ONLOUTOU peut-il assurer la livraison ou la mise en service ?",
    answer: "Ces services peuvent être étudiés selon le matériel et le projet. Ils doivent être explicitement confirmés avant engagement.",
  },
  {
    question: "Certains matériels peuvent-ils être géolocalisés ?",
    answer:
      "Un suivi connecté peut être étudié lorsque l’équipement, l’environnement et la solution technique sont compatibles — sans garantie universelle.",
  },
  {
    question: "Comment obtenir un prix ou vérifier la disponibilité ?",
    answer:
      "Transmettez une demande structurée par WhatsApp ou téléphone. Prix, disponibilité et conditions ne sont confirmés qu’après étude.",
  },
];

export const toolsFinalCta = {
  title: "Un besoin bien défini évite un matériel mal adapté.",
  lead:
    "Présentez-nous votre opération, vos contraintes et votre calendrier. L’équipe ONLOUTOU vous aidera à structurer la demande avant toute proposition.",
  primary: { label: "Définir mon besoin", href: "#demande-materiel" },
  secondaryPhoneLabel: "Appeler ONLOUTOU",
  tertiary: { label: "Retour aux équipements", href: "/equipements" },
};

export function toolsEquipmentBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Équipements", item: `${baseUrl}/equipements` },
      { "@type": "ListItem", position: 3, name: "Outils et matériels", item: `${baseUrl}/equipements/outils-materiels` },
    ],
  };
}

export function toolsEquipmentServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Étude de besoins en outils et matériels professionnels",
    provider: { "@type": "Organization", name: "ONLOUTOU", url: baseUrl },
    areaServed: "Côte d’Ivoire",
    description: toolsEquipmentPageSeo.description,
    url: `${baseUrl}/equipements/outils-materiels`,
  };
}
