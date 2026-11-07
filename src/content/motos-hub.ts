import { whatsappUrlForMessage } from "@/content/contact-page";
import type { MopIconName } from "@/components/motorcycles/redesign/MopIcon";

/* Contenu de la page Motos & deux-roues — textes repris des écrans Figma. */

const imageBase = "/assets/images/equipment/motos";

export type MopImageId =
  | "tournee-abidjan"
  | "scooter"
  | "moto-livraison"
  | "moto-tout-terrain"
  | "moto-coffre"
  | "motard-casque"
  | "preparation-mission";

/** Dimensions réelles des fichiers webp. */
export const mopImageSize: Record<MopImageId, [number, number]> = {
  "tournee-abidjan": [1586, 992],
  scooter: [1000, 826],
  "moto-livraison": [1000, 728],
  "moto-tout-terrain": [1000, 755],
  "moto-coffre": [1000, 820],
  "motard-casque": [1000, 896],
  "preparation-mission": [1000, 1057],
};

export const mopImage = (id: MopImageId) => `${imageBase}/${id}.webp`;

export const mopHero = {
  eyebrow: "Motos & deux-roues",
  titleLines: ["Votre mobilité,", "au rythme"],
  titleUnderline: "du terrain.",
  lead: "Déplacements, livraisons ou interventions : choisissez le profil de deux-roues à étudier pour votre activité.",
  image: {
    id: "tournee-abidjan" as MopImageId,
    alt: "Livreur casqué sur une moto noire à coffre et coordinatrice qui consulte une tablette, devant un dépôt d’Abidjan.",
  },
};

export type MopModeId = "location" | "achat" | "comparer";
export const mopModes: { id: MopModeId; label: string; icon: MopIconName }[] = [
  { id: "location", label: "Location", icon: "bike" },
  { id: "achat", label: "Achat", icon: "cart" },
  { id: "comparer", label: "À comparer", icon: "chart" },
];

export type MopUsageId = "urbain" | "livraison" | "terrain" | "autre";

export type MopUsage = {
  id: Exclude<MopUsageId, "autre">;
  label: string;
  text: string;
  image: MopImageId;
  alt: string;
  tone: "city" | "dock" | "site";
};

export const mopUsages: MopUsage[] = [
  {
    id: "urbain",
    label: "Mobilité urbaine",
    text: "Déplacements professionnels et trajets de proximité.",
    image: "scooter",
    alt: "Maxi-scooter argenté",
    tone: "city",
  },
  {
    id: "livraison",
    label: "Livraison & tournées",
    text: "Organisation des trajets et transport de petites charges.",
    image: "moto-livraison",
    alt: "Moto noire équipée d’un grand coffre de livraison",
    tone: "dock",
  },
  {
    id: "terrain",
    label: "Interventions terrain",
    text: "Déplacements d’équipes et missions de service.",
    image: "moto-tout-terrain",
    alt: "Moto tout-terrain blanche avec top-case",
    tone: "site",
  },
];

/** Libellé des usages pour les listes déroulantes et le message. */
export const mopUsageOptions: { id: MopUsageId; label: string }[] = [
  ...mopUsages.map((u) => ({ id: u.id as MopUsageId, label: u.label })),
  { id: "autre", label: "Autre usage" },
];
export const mopUsageLabel = (id: MopUsageId) => mopUsageOptions.find((u) => u.id === id)!.label;

/** Photo du récapitulatif selon l’usage choisi. */
export const mopSummaryImage = (u: MopUsageId | ""): MopImageId => {
  if (u === "urbain") return "scooter";
  if (u === "livraison") return "moto-livraison";
  if (u === "terrain") return "moto-tout-terrain";
  return "moto-coffre";
};

export const mopDates = [
  "Dès que possible",
  "Cette semaine",
  "Ce mois-ci",
  "Courte durée (moins d’une semaine)",
  "Moyenne durée (1 à 4 semaines)",
  "Longue durée (plus d’un mois)",
];
export const mopPlaces = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Bingerville", "Grand Abidjan", "Intérieur du pays"];
export const mopQuantities = ["1", "2", "3", "4", "5", "6 à 10", "Plus de 10"];

export const mopSearch = {
  usageLabel: "Type d’usage",
  usagePlaceholder: "Mobilité urbaine, livraison, ...",
  placeLabel: "Ville d’utilisation",
  placePlaceholder: "Ville ou commune",
  periodLabel: "Durée d’utilisation",
  periodPlaceholder: "À préciser",
  submit: "Définir mon besoin",
  note: "Modèles, équipements et disponibilités à confirmer.",
};

export const mopProfilesSection = {
  id: "profils-motos",
  kicker: "Nos catégories de deux-roues",
  title: "Trois usages. Des besoins différents.",
  cta: "Étudier ce besoin",
};

export const mopDaily = {
  title: "Le bon choix commence par votre quotidien.",
  titleLines: ["Le bon choix commence", "par votre quotidien."],
  image: { id: "motard-casque" as MopImageId, alt: "Motard africain qui ajuste la jugulaire de son casque, blouson noir à bandes jaunes." },
  cards: [
    { icon: "mapRoute" as MopIconName, title: "Fréquence & distance", text: "Vos trajets, votre rythme et vos zones d’intervention." },
    { icon: "box" as MopIconName, title: "Charge & rangement", text: "Le volume à transporter et les équipements adaptés." },
    { icon: "road" as MopIconName, title: "Terrain & autonomie", text: "Ville, périurbain ou zones rurales, selon vos parcours." },
    { icon: "helmet" as MopIconName, title: "Conducteur & équipements", text: "Confort, sécurité et accessoires pour vos équipes." },
  ],
  banner: {
    title: "Un modèle spécifique ou plusieurs deux-roues à équiper ?",
    text: "Nous étudions votre besoin et vous proposons les solutions adaptées.",
    cta: "Décrire mon besoin",
  },
};

export const mopPrep = {
  eyebrow: "Motos et deux-roues",
  titleLines: ["Préparer la mission", "avant de"],
  titleUnderline: "prendre",
  titleAfter: "la route.",
  lead: "Une organisation claire pour des déplacements efficaces, en toute sécurité, adaptés à votre activité.",
  image: { id: "preparation-mission" as MopImageId, alt: "Motard équipé sur une moto blanche à coffre noir, face à un agent ONLOUTOU qui tient une tablette." },
  stepsTitle: "Checklist de préparation de mission",
  steps: [
    { icon: "file" as MopIconName, title: "Mission définie", text: "Objectifs et contraintes identifiés." },
    { icon: "clipboardCheck" as MopIconName, title: "Informations vérifiées", text: "Documents et autorisations à jour." },
    { icon: "wrench" as MopIconName, title: "Véhicule préparé", text: "Contrôles et équipements en place." },
    { icon: "box" as MopIconName, title: "Charge contrôlée", text: "Rangement et fixation sécurisés." },
    { icon: "helmet" as MopIconName, title: "Conducteur équipé", text: "Casque, gants et équipements adaptés." },
    { icon: "checkSquare" as MopIconName, title: "Départ confirmé", text: "Tout est prêt pour la mission." },
  ],
  note: "Équipements, accompagnement et responsabilités selon la proposition retenue.",
};

export const mopForm = {
  id: "demande-moto",
  title: "Préparez votre demande de deux-roues.",
  modeLabel: "Mode de demande",
  usageLabel: "Usage",
  usagePlaceholder: "Mobilité, Livraison, Intervention, Autre",
  modelLabel: "Modèle ou préférence",
  modelOptional: " (facultatif)",
  modelPlaceholder: "Ex. moto utilitaire, scooter, modèle spécifique",
  quantityLabel: "Quantité",
  quantityPlaceholder: "À préciser",
  placeLabel: "Ville ou zone",
  placePlaceholder: "Abidjan ou autre zone",
  datesLabel: "Dates ou durée",
  datesPlaceholder: "À préciser",
  distanceLabel: "Distances et charge prévues",
  distancePlaceholder: "Ex. trajets quotidiens, charge moyenne, type de marchandises",
  needsLabel: "Décrivez vos besoins",
  needsPlaceholder: "Ex. type de mission, contexte, contraintes...",
  optionsLabel: "Options à étudier",
  optionsOptional: " (facultatif)",
  options: [
    { id: "coffre", label: "Coffre ou rangement" },
    { id: "protection", label: "Équipements de protection" },
    { id: "geolocalisation", label: "Géolocalisation" },
    { id: "aetudier", label: "À étudier" },
  ],
  contactLabel: "Vos coordonnées",
  name: "Nom",
  phone: "Téléphone",
  email: "E-mail (facultatif)",
  submit: "Enregistrer ma demande",
  hint: "Vérifiez votre récapitulatif avant l’envoi.",
};

export const mopSummary = {
  title: "Votre récapitulatif",
  lead: "Voici les principales informations de votre demande.",
  empty: "À préciser",
  rows: [
    { id: "usage", icon: "bike" as MopIconName, title: "Usage" },
    { id: "quantite", icon: "cubes" as MopIconName, title: "Quantité" },
    { id: "zone", icon: "pin" as MopIconName, title: "Zone" },
    { id: "periode", icon: "calendar" as MopIconName, title: "Période" },
  ],
  note: "Disponibilité et conditions sur proposition.",
};

export const mopProposal = {
  title: "Ce que comprend votre proposition",
  cards: [
    {
      title: "Véhicule & accessoires",
      icon: "gear" as MopIconName,
      lines: ["Large choix de motos et scooters", "Coffres, supports et accessoires", "Équipements de sécurité adaptés"],
    },
    {
      title: "Durée & coût",
      icon: "coin" as MopIconName,
      lines: ["Formules courtes ou longues durées", "Conditions adaptées à votre activité", "Devis personnalisé sur demande"],
    },
    {
      title: "Entretien & responsabilités",
      icon: "shieldCheck" as MopIconName,
      lines: ["Véhicules contrôlés et prêts à l’usage", "Assistance selon la proposition", "Conseils pour une utilisation en toute sécurité"],
    },
  ],
};

export const mopFaq = {
  title: "Questions fréquentes",
  items: [
    {
      question: "Puis-je demander une flotte de motos ?",
      answer: "Précisez le nombre, les usages et la zone. Les possibilités seront étudiées pour votre projet.",
    },
    {
      question: "Les équipements sont-ils inclus ?",
      answer: "Coffres, supports et équipements de protection peuvent être intégrés à la proposition. Indiquez vos besoins dans la demande.",
    },
    {
      question: "Peut-on étudier un modèle précis ?",
      answer: "Oui. Précisez le modèle ou votre préférence : sa disponibilité et les conditions sont confirmées après étude.",
    },
  ],
};

export const mopBand = {
  title: "Une moto ou une flotte : parlons de votre activité.",
  text: "Nos spécialistes vous accompagnent pour étudier la meilleure solution.",
  cta: "Échanger avec l’équipe",
};

export type MopRequestFields = {
  mode: string;
  usage: string;
  model: string;
  quantity: string;
  place: string;
  dates: string;
  distance: string;
  needs: string;
  options: string[];
  name: string;
  phone: string;
  email: string;
};

export function buildMopMessage(f: MopRequestFields) {
  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite recevoir une proposition pour un deux-roues.",
    "",
    `Mode de demande : ${f.mode}`,
    `Usage : ${f.usage || "à préciser"}`,
  ];
  if (f.model) lines.push(`Modèle ou préférence : ${f.model}`);
  lines.push(`Quantité : ${f.quantity || "à préciser"}`, `Ville ou zone : ${f.place || "à préciser"}`, `Dates ou durée : ${f.dates || "à préciser"}`);
  if (f.distance) lines.push(`Distances et charge prévues : ${f.distance}`);
  if (f.needs) lines.push(`Besoins : ${f.needs}`);
  lines.push(`Options à étudier : ${f.options.length ? f.options.join(", ") : "aucune"}`);
  if (f.name) lines.push("", `Nom : ${f.name}`);
  if (f.phone) lines.push(`Téléphone : ${f.phone}`);
  if (f.email) lines.push(`E-mail : ${f.email}`);
  return lines.join("\n");
}

export const mopWhatsappUrl = (f: MopRequestFields) => whatsappUrlForMessage(buildMopMessage(f));
