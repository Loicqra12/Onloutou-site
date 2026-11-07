import { whatsappUrlForMessage } from "@/content/contact-page";
import type { CnxIconName } from "@/components/equipment/connected/CnxIcon";

/* Contenu de la page Équipements connectés — textes repris des écrans Figma. */

const imageBase = "/assets/images/equipment/connectes";

export type CnxImageId =
  | "hero-installation"
  | "traceur-filaire"
  | "balise-autonome"
  | "boitier-embarque"
  | "capteurs-identification"
  | "plateforme-ordinateur"
  | "mat-telecom"
  | "operateur-tablette"
  | "traceur-industriel"
  | "camion-fourgon"
  | "fourgons-flotte"
  | "cadenas-gps";

/** Dimensions réelles des fichiers webp. */
export const cnxImageSize: Record<CnxImageId, [number, number]> = {
  "hero-installation": [1385, 1024],
  "traceur-filaire": [760, 383],
  "balise-autonome": [700, 673],
  "boitier-embarque": [760, 401],
  "capteurs-identification": [760, 532],
  "plateforme-ordinateur": [760, 509],
  "mat-telecom": [396, 1505],
  "operateur-tablette": [760, 475],
  "traceur-industriel": [1000, 512],
  "camion-fourgon": [760, 480],
  "fourgons-flotte": [900, 325],
  "cadenas-gps": [640, 744],
};

export const cnxImage = (id: CnxImageId) => `${imageBase}/${id}.webp`;

export const cnxIds = {
  devices: "dispositifs",
  chain: "architecture-connectee",
  steps: "mise-en-place",
  form: "demande-connectee",
  faq: "faq",
};

export const cnxHero = {
  eyebrow: "Équipements connectés",
  titleLines: ["Connectez vos", "équipements à une"],
  titleUnderline: "information utile.",
  lead: "Traceurs, balises et capteurs : construisons la configuration adaptée à vos actifs et à vos usages.",
  primary: "Étudier mon équipement",
  secondary: "Explorer les dispositifs",
  image: {
    id: "hero-installation" as CnxImageId,
    alt: "Technicien casqué en gilet jaune qui installe un boîtier de suivi dans un fourgon, avec traceur filaire, balise et capteur au premier plan.",
  },
};

export type CnxAssetId = "vehicule" | "moto" | "camion" | "materiel" | "fixe" | "autre";

export const cnxAssets: { id: CnxAssetId; label: string; icon: CnxIconName }[] = [
  { id: "vehicule", label: "Véhicule", icon: "car" },
  { id: "moto", label: "Moto", icon: "bike" },
  { id: "camion", label: "Camion ou engin", icon: "truck" },
  { id: "materiel", label: "Matériel mobile", icon: "cart" },
  { id: "fixe", label: "Installation fixe", icon: "building" },
  { id: "autre", label: "Autre", icon: "dots" },
];
export const cnxAssetLabel = (id: CnxAssetId) => cnxAssets.find((a) => a.id === id)!.label;

export type CnxDeviceId = "filaire" | "balise" | "boitier" | "capteurs";

export const cnxDevicesSection = {
  title: "Quel dispositif pour quel actif ?",
  cta: "Étudier cette configuration",
  note: "Références, compatibilités et fonctions à confirmer.",
  cards: [
    { id: "filaire" as CnxDeviceId, asset: "vehicule" as CnxAssetId, title: "Traceurs filaires", text: "Véhicules et équipements alimentés.", image: "traceur-filaire" as CnxImageId, alt: "Traceur GPS filaire noir avec faisceau de câbles et connecteur" },
    { id: "balise" as CnxDeviceId, asset: "materiel" as CnxAssetId, title: "Balises autonomes", text: "Actifs mobiles selon autonomie requise.", image: "balise-autonome" as CnxImageId, alt: "Balise autonome noire robuste avec poignée" },
    { id: "boitier" as CnxDeviceId, asset: "camion" as CnxAssetId, title: "Boîtiers embarqués", text: "Données selon véhicule et compatibilité.", image: "boitier-embarque" as CnxImageId, alt: "Boîtier télématique noir avec connecteur" },
    { id: "capteurs" as CnxDeviceId, asset: "fixe" as CnxAssetId, title: "Capteurs & identification", text: "Mesures ou événements selon le projet.", image: "capteurs-identification" as CnxImageId, alt: "Capteurs IoT noirs et plaque d’identification" },
  ],
};

export const cnxChain = {
  title: "Un équipement connecté fait partie d’un ensemble.",
  steps: [
    { icon: "excavator" as CnxIconName, title: "L’actif", text: "Véhicule, engin ou matériel.", image: "camion-fourgon" as CnxImageId, alt: "Camion fourgon blanc", tone: "sand" },
    { icon: "device" as CnxIconName, title: "Le dispositif", text: "Boîtier, balise ou capteur.", image: "traceur-industriel" as CnxImageId, alt: "Traceur industriel noir avec câble", tone: "light" },
    { icon: "radar" as CnxIconName, title: "La connexion", text: "Réseau et transmission.", image: "mat-telecom" as CnxImageId, alt: "Mât télécom avec antennes", tone: "sky" },
    { icon: "monitor" as CnxIconName, title: "La plateforme", text: "Consultation et configuration.", image: "plateforme-ordinateur" as CnxImageId, alt: "Ordinateur portable affichant une carte de flotte", tone: "wood" },
    { icon: "report" as CnxIconName, title: "L’exploitation", text: "Suivi, alertes et rapports.", image: "operateur-tablette" as CnxImageId, alt: "Opérateur en gilet jaune qui consulte une tablette devant une chargeuse", tone: "sand" },
  ],
  practical: {
    title: "Quelques éléments pratiques à prévoir",
    items: [
      { icon: "plug" as CnxIconName, title: "Alimentation", text: "Selon l’actif et le dispositif." },
      { icon: "signalBars" as CnxIconName, title: "Couverture réseau", text: "Selon vos zones d’exploitation." },
      { icon: "file" as CnxIconName, title: "Informations attendues", text: "Selon vos usages et objectifs." },
    ],
    cardTitle: "Vous avez déjà du matériel ?",
    cardText: "Étudions sa compatibilité",
  },
};

export const cnxInfo = {
  title: ["Du matériel installé aux", "informations exploitables."],
  lead: "Nos solutions d’équipements connectés transforment vos actifs en sources d’informations fiables, pour un meilleur suivi, plus de sécurité et une gestion simplifiée.",
  rows: [
    { icon: "pin" as CnxIconName, title: "Consulter les actifs", text: "Visualisez la position et le statut de vos équipements en temps réel." },
    { icon: "chart" as CnxIconName, title: "Comprendre les événements", text: "Analysez les alertes, trajets et usages pour prendre de meilleures décisions." },
    { icon: "report" as CnxIconName, title: "Préparer les rapports", text: "Générez des rapports clairs pour le suivi et le pilotage de vos activités." },
  ],
  note: "Les fonctions dépendent du dispositif, de l’installation, de la connectivité et du paramétrage.",
};

export const cnxDashboard = {
  label: "Aperçu illustratif d’un tableau de suivi d’actifs",
  title: "Suivi de mes actifs",
  filter: "Tous les actifs",
  menu: [
    { icon: "map" as CnxIconName, label: "Carte", active: true },
    { icon: "bell" as CnxIconName, label: "Événements", active: false },
    { icon: "chart" as CnxIconName, label: "Rapports", active: false },
    { icon: "gear" as CnxIconName, label: "Paramètres", active: false },
  ],
  eventsTitle: "Événements récents",
  eventsFilter: "Tous",
  events: [
    { tone: "yellow", icon: "truck" as CnxIconName, asset: "Actif A", when: "Aujourd’hui, 10:24", what: "Mouvement détecté" },
    { tone: "red", icon: "alertTriangle" as CnxIconName, asset: "Actif B", when: "Aujourd’hui, 08:17", what: "Sortie de zone" },
    { tone: "green", icon: "engine" as CnxIconName, asset: "Actif C", when: "Hier, 18:03", what: "Moteur démarré" },
    { tone: "yellow", icon: "pin" as CnxIconName, asset: "Actif A", when: "Hier, 14:25", what: "Arrêt prolongé" },
  ],
  footer: "Aperçu illustratif — données fictives",
};

export const cnxSteps = {
  title: "Une mise en place, étape par étape.",
  items: [
    { icon: "file" as CnxIconName, title: "Recenser", text: "Identifiez vos actifs et vos besoins de suivi." },
    { icon: "search" as CnxIconName, title: "Qualifier", text: "Évaluez les usages et les contraintes de votre activité." },
    { icon: "gear" as CnxIconName, title: "Sélectionner", text: "Choisissez la solution la plus adaptée à vos équipements." },
    { icon: "wrench" as CnxIconName, title: "Installer", text: "Nous planifions et réalisons l’installation sur site." },
    { icon: "sliders" as CnxIconName, title: "Configurer", text: "Paramétrez les alertes, les zones et les accès aux données." },
    { icon: "users" as CnxIconName, title: "Accompagner", text: "Nos équipes vous forment et restent à vos côtés." },
  ],
};

export const cnxPowers = [
  "Alimentation permanente (véhicule, engin)",
  "Batterie ou autonomie requise",
  "Alimentation secteur",
  "Énergie solaire",
  "Je ne sais pas",
];
export const cnxInstalledOptions = [
  { id: "oui", label: "Oui" },
  { id: "non", label: "Non" },
  { id: "nsp", label: "Je ne sais pas" },
] as const;
export type CnxInstalledId = (typeof cnxInstalledOptions)[number]["id"];
export const cnxInfosOptions = [
  { id: "position", label: "Position" },
  { id: "historique", label: "Historique" },
  { id: "alertes", label: "Alertes" },
  { id: "rapports", label: "Rapports" },
  { id: "autre", label: "Autre" },
];

export const cnxForm = {
  title: "Parlez-nous de vos actifs.",
  lead: "Décrivez votre besoin et recevez une réponse adaptée de nos équipes.",
  assetLabel: "Type d’actif",
  quantityLabel: "Quantité",
  quantityPlaceholder: "À préciser",
  zoneLabel: "Zone d’utilisation",
  zonePlaceholder: "Ville ou commune",
  powerLabel: "Alimentation disponible",
  powerPlaceholder: "À préciser",
  installedLabel: "Un dispositif est-il déjà installé ?",
  infosLabel: "Quelles informations souhaitez-vous suivre ?",
  needsLabel: "Informations attendues et contraintes",
  needsPlaceholder: "Décrivez votre besoin, les usages, les contraintes techniques ou organisationnelles...",
  name: "Nom",
  namePlaceholder: "Votre nom",
  phone: "Téléphone",
  phonePlaceholder: "+225 07 00 00 00 00",
  email: "E-mail",
  emailOptional: " (facultatif)",
  emailPlaceholder: "votre@email.com",
  submit: "Enregistrer mon projet",
};

export const cnxSummary = {
  title: "Récapitulatif à vérifier avant l’envoi.",
  lead: "Les points à valider pour un traitement rapide et adapté.",
  rows: [
    { id: "compatibilite", icon: "puzzle" as CnxIconName, title: "Compatibilité", text: "Vérifier la compatibilité avec vos actifs et les protocoles disponibles." },
    { id: "installation", icon: "wrench" as CnxIconName, title: "Installation", text: "Définir les conditions d’installation et d’intégration sur site." },
    { id: "connectivite", icon: "radar" as CnxIconName, title: "Connectivité", text: "Valider la couverture réseau et les moyens de transmission des données." },
    { id: "perimetre", icon: "users" as CnxIconName, title: "Périmètre de service", text: "Confirmer la zone d’intervention et les services associés." },
  ],
  image: { alt: "Boîtier de suivi noir ONLOUTOU posé sur le sol, engins jaunes en arrière-plan" },
};

/** Photo du récapitulatif selon le type d’actif. */
export const cnxSummaryImage = (a: CnxAssetId | ""): CnxImageId => {
  if (a === "vehicule") return "traceur-filaire";
  if (a === "moto" || a === "materiel") return "balise-autonome";
  if (a === "camion") return "boitier-embarque";
  if (a === "fixe") return "capteurs-identification";
  return "traceur-industriel";
};

export const cnxFaq = {
  title: "Questions fréquentes.",
  items: [
    {
      question: "Peut-on utiliser un équipement déjà installé ?",
      answer: "La compatibilité se vérifie selon le matériel, ses protocoles et la solution envisagée.",
    },
    {
      question: "Tous les actifs remontent-ils les mêmes données ?",
      answer: "Non. Les données disponibles dépendent du dispositif, de l’installation, de la connectivité et du paramétrage.",
    },
    {
      question: "L’installation et la formation sont-elles incluses ?",
      answer: "Elles peuvent être intégrées à la proposition. Précisez votre besoin dans la demande : nous l’étudions avec vous.",
    },
  ],
};

export const cnxSolutions = {
  title: "Nos solutions associées.",
  cards: [
    { title: "Géolocalisation", text: "Suivez vos actifs en temps réel et optimisez vos déplacements.", href: "/solutions/geolocalisation", image: "camion-fourgon" as CnxImageId, alt: "Camion fourgon blanc", tone: "palm" },
    { title: "Gestion de flotte", text: "Centralisez les données de vos véhicules et équipements.", href: "/solutions/gestion-de-flotte", image: "fourgons-flotte" as CnxImageId, alt: "Quatre fourgons blancs alignés", tone: "palm" },
    { title: "Sécurisation des actifs", text: "Réduisez les risques et protégez vos équipements.", href: "/solutions/securisation-actifs", image: "cadenas-gps" as CnxImageId, alt: "Cadenas GPS jaune et noir fixé à un portail", tone: "dark" },
  ],
};

export const cnxBand = {
  title: "Relions vos équipements à vos besoins.",
  text: "Nos experts vous accompagnent pour trouver la solution la plus adaptée à vos enjeux.",
  cta: "Échanger sur mon projet",
};

export type CnxRequestFields = {
  config: string;
  asset: string;
  quantity: string;
  zone: string;
  power: string;
  installed: string;
  infos: string[];
  needs: string;
  name: string;
  phone: string;
  email: string;
};

export function buildCnxMessage(f: CnxRequestFields) {
  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite étudier un projet d’équipements connectés.",
    "",
    `Type d’actif : ${f.asset || "à préciser"}`,
  ];
  if (f.config) lines.push(`Configuration étudiée : ${f.config}`);
  lines.push(
    `Quantité : ${f.quantity || "à préciser"}`,
    `Zone d’utilisation : ${f.zone || "à préciser"}`,
    `Alimentation disponible : ${f.power || "à préciser"}`,
    `Dispositif déjà installé : ${f.installed || "à préciser"}`,
    `Informations à suivre : ${f.infos.length ? f.infos.join(", ") : "à préciser"}`,
  );
  if (f.needs) lines.push(`Informations attendues et contraintes : ${f.needs}`);
  if (f.name) lines.push("", `Nom : ${f.name}`);
  if (f.phone) lines.push(`Téléphone : ${f.phone}`);
  if (f.email) lines.push(`E-mail : ${f.email}`);
  return lines.join("\n");
}

export const cnxWhatsappUrl = (f: CnxRequestFields) => whatsappUrlForMessage(buildCnxMessage(f));
