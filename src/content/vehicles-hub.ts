import { whatsappUrlForMessage } from "@/content/contact-page";
import type { VhpIconName } from "@/components/vehicles/redesign/VhpIcon";

/* Contenu de la page Véhicules professionnels — textes repris des écrans Figma. */

const imageBase = "/assets/images/equipment/vehicules";

export type VhpImageId =
  | "berline"
  | "devis"
  | "flotte-agents"
  | "fourgonnette"
  | "fourgon"
  | "minibus"
  | "pickup"
  | "remise-cles"
  | "suv"
  | "technicien";

/** Dimensions réelles des fichiers webp détourés. */
export const vhpImageSize: Record<VhpImageId, [number, number]> = {
  berline: [900, 404],
  devis: [900, 643],
  "flotte-agents": [1773, 577],
  fourgonnette: [900, 537],
  fourgon: [900, 517],
  minibus: [900, 487],
  pickup: [900, 454],
  "remise-cles": [1100, 698],
  suv: [900, 441],
  technicien: [1100, 785],
};

export const vhpImage = (id: VhpImageId) => `${imageBase}/${id}.webp`;

export const vhpHero = {
  eyebrow: "Véhicules professionnels",
  titleLines: ["Le véhicule adapté"],
  titleUnderline: "à chacune",
  titleAfter: " de vos",
  titleLast: "missions.",
  lead: "Déplacements, équipes, livraison ou intervention : trouvez le profil à étudier pour votre activité.",
  image: {
    id: "flotte-agents" as VhpImageId,
    alt: "Berline, SUV, pick-up et fourgon blancs alignés, avec deux agents ONLOUTOU qui consultent une tablette.",
  },
};

export type VhpModeId = "location" | "achat" | "comparer";
export const vhpModes: { id: VhpModeId; label: string; icon: VhpIconName }[] = [
  { id: "location", label: "Location", icon: "car" },
  { id: "achat", label: "Achat", icon: "cart" },
  { id: "comparer", label: "À comparer", icon: "chart" },
];

export type VhpTypeId = "berline" | "suv" | "pickup" | "utilitaire" | "fourgon" | "equipe";

export type VhpProfile = {
  id: VhpTypeId;
  label: string;
  text: string;
  image: VhpImageId;
  alt: string;
  tone: "park" | "city" | "site" | "dock" | "depot" | "road";
};

export const vhpProfiles: VhpProfile[] = [
  { id: "berline", label: "Berlines", text: "Déplacements professionnels", image: "berline", alt: "Berline blanche", tone: "park" },
  { id: "suv", label: "SUV", text: "Mobilité et confort selon vos parcours", image: "suv", alt: "SUV argenté", tone: "city" },
  { id: "pickup", label: "Pick-up", text: "Équipes et matériel sur le terrain", image: "pickup", alt: "Pick-up blanc double cabine", tone: "site" },
  { id: "utilitaire", label: "Utilitaires légers", text: "Livraison et interventions", image: "fourgonnette", alt: "Fourgonnette blanche", tone: "dock" },
  { id: "fourgon", label: "Fourgons", text: "Transport de matériel et marchandises", image: "fourgon", alt: "Grand fourgon blanc", tone: "depot" },
  { id: "equipe", label: "Transport d’équipe", text: "Minibus et besoins collectifs à étudier", image: "minibus", alt: "Minibus blanc, passagers qui embarquent", tone: "road" },
];

export const vhpTypeLabel = (id: VhpTypeId) => vhpProfiles.find((p) => p.id === id)!.label;
/** Libellé au singulier utilisé dans les listes et le message. */
export const vhpTypeSingular: Record<VhpTypeId, string> = {
  berline: "Berline",
  suv: "SUV",
  pickup: "Pick-up",
  utilitaire: "Utilitaire léger",
  fourgon: "Fourgon",
  equipe: "Transport d’équipe (minibus)",
};

export const vhpDates = [
  "Dès que possible",
  "Cette semaine",
  "Ce mois-ci",
  "Courte durée (moins d’une semaine)",
  "Moyenne durée (1 à 4 semaines)",
  "Longue durée (plus d’un mois)",
];
export const vhpPlaces = ["Abidjan", "Cocody", "Plateau", "Marcory", "Yopougon", "Bingerville", "Grand Abidjan", "Intérieur du pays"];
export const vhpOthers = ["Véhicule de remplacement", "Véhicule supplémentaire", "Autre type de véhicule", "Parc d’entreprise"];
export const vhpLoads = [
  "1 à 2 passagers",
  "3 à 5 passagers",
  "6 à 9 passagers",
  "10 passagers ou plus",
  "Charge légère (moins de 500 kg)",
  "Charge moyenne (500 kg à 1,5 t)",
  "Charge lourde (plus de 1,5 t)",
];
export const vhpQuantities = ["1", "2", "3", "4", "5", "6 à 10", "Plus de 10"];

export const vhpSearch = {
  typeLabel: "Type de véhicule",
  typePlaceholder: "Berline, SUV, utilitaire, fourgon...",
  placeLabel: "Lieu d’utilisation",
  placePlaceholder: "Ville ou commune",
  periodLabel: "Période",
  periodPlaceholder: "À préciser",
  submit: "Définir mon besoin",
  note: "Modèles, tarifs et disponibilités sur proposition.",
};

export const vhpProfilesSection = {
  id: "profils-vehicules",
  kicker: "Nos catégories de véhicules",
  title: "Explorez les profils de véhicules.",
  cta: "Étudier ce besoin",
  banner: {
    title: "Un modèle particulier ou un parc à constituer ?",
    text: "Nous étudions votre besoin et vous proposons les solutions adaptées.",
    cta: "Décrire ma demande",
  },
  criteria: [
    { icon: "users" as VhpIconName, title: "Passagers", text: "Nombre de personnes et confort recherchés." },
    { icon: "box" as VhpIconName, title: "Volume et charge", text: "Espace de chargement et type de matériel." },
    { icon: "road" as VhpIconName, title: "Terrain et trajets", text: "Ville, interurbain, routes spécifiques." },
    { icon: "clock" as VhpIconName, title: "Durée d’utilisation", text: "Courte, moyenne ou longue durée selon votre projet." },
  ],
};

export const vhpMission = {
  titleLines: ["Votre mission", "détermine le choix."],
  image: { id: "remise-cles" as VhpImageId, alt: "Agent ONLOUTOU en gilet jaune remettant les clés d’un pick-up blanc à un client." },
  rows: [
    { icon: "users" as VhpIconName, title: "Déplacements urbains", text: "Passagers, fréquence et stationnement." },
    { icon: "route" as VhpIconName, title: "Intervention terrain", text: "Accès, matériel et distances." },
    { icon: "box" as VhpIconName, title: "Transport léger", text: "Volume, charge et organisation." },
    { icon: "building" as VhpIconName, title: "Parc d’entreprise", text: "Quantité, durée et suivi souhaité." },
  ],
};

export const vhpForm = {
  id: "demande-vehicule",
  title: "Préparez votre demande de véhicule.",
  modeLabel: "Mode de demande",
  typeLabel: "Type de véhicule",
  typePlaceholder: "Choisir un véhicule",
  otherLabel: "Autre besoin",
  otherPlaceholder: "Sélectionner si besoin",
  quantityLabel: "Quantité",
  loadLabel: "Passagers ou charge",
  loadPlaceholder: "Nombre de passagers / charge",
  placeLabel: "Lieu d’utilisation",
  placePlaceholder: "Ville ou commune",
  datesLabel: "Dates ou durée",
  datesPlaceholder: "À préciser",
  missionLabel: "Votre mission",
  missionPlaceholder: "Décrivez brièvement votre besoin (trajets, fréquence, contraintes...)",
  servicesLabel: "Services complémentaires",
  servicesOptional: " (facultatif)",
  services: [
    { id: "chauffeur", label: "Chauffeur", icon: "user" as VhpIconName },
    { id: "livraison", label: "Livraison", icon: "truck" as VhpIconName },
    { id: "geolocalisation", label: "Géolocalisation", icon: "radar" as VhpIconName },
    { id: "apreciser", label: "À préciser", icon: "dots" as VhpIconName },
  ],
  contactLabel: "Vos coordonnées",
  name: "Nom",
  phone: "Téléphone",
  email: "E-mail (facultatif)",
  submit: "Enregistrer ma demande",
};

export const vhpSummary = {
  title: "Récapitulatif à vérifier avant l’envoi.",
  rows: [
    { id: "profil", icon: "user" as VhpIconName, title: "Profil", text: "Particulier ou professionnel" },
    { id: "usage", icon: "car" as VhpIconName, title: "Usage", text: "Type de véhicule et quantité" },
    { id: "lieu", icon: "pin" as VhpIconName, title: "Lieu", text: "Ville ou commune" },
    { id: "duree", icon: "calendar" as VhpIconName, title: "Durée", text: "Dates ou période souhaitée" },
  ],
  note: "Disponibilité et conditions après étude.",
  defaultImage: "suv" as VhpImageId,
};

export const vhpProposal = {
  title: "Une proposition claire avant de vous engager.",
  cards: [
    {
      title: "Véhicule & usage",
      icon: "car" as VhpIconName,
      image: "pickup" as VhpImageId,
      alt: "Pick-up blanc",
      lines: ["Le type de véhicule adapté", "Les options selon votre mission", "Des conseils de notre équipe"],
    },
    {
      title: "Prix & durée",
      icon: "file" as VhpIconName,
      image: "devis" as VhpImageId,
      alt: "Calculatrice, stylo et devis",
      lines: ["Une offre selon votre besoin", "Des options sur la durée", "Un devis clair avant validation"],
    },
    {
      title: "Services & responsabilités",
      icon: "wrench" as VhpIconName,
      image: "technicien" as VhpImageId,
      alt: "Technicien vérifiant le moteur d’un pick-up",
      lines: ["Options de livraison ou chauffeur", "Conseils d’utilisation et d’entretien", "Les responsabilités précisées"],
    },
  ],
};

export const vhpFaq = {
  title: "Questions fréquentes.",
  items: [
    {
      question: "Puis-je demander un modèle précis ?",
      answer: "Précisez votre préférence. Le modèle proposé et sa disponibilité seront confirmés après étude.",
    },
    {
      question: "La location peut-elle inclure un chauffeur ?",
      answer: "Oui, c’est une option à préciser dans votre demande. Elle est étudiée et chiffrée dans la proposition.",
    },
    {
      question: "Puis-je équiper plusieurs véhicules ?",
      answer: "Oui. Indiquez la quantité et la mission : nous étudions la composition du parc avec vous.",
    },
  ],
};

export const vhpBand = {
  title: "Un déplacement ponctuel ou un parc à organiser ?",
  cta: "Parlons de votre besoin",
};

export type VhpRequestFields = {
  mode: string;
  type: string;
  other: string;
  quantity: string;
  load: string;
  place: string;
  dates: string;
  mission: string;
  services: string[];
  name: string;
  phone: string;
  email: string;
};

export function buildVhpMessage(f: VhpRequestFields) {
  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite recevoir une proposition pour un véhicule.",
    "",
    `Mode de demande : ${f.mode}`,
    `Type de véhicule : ${f.type || "à préciser"}`,
    `Quantité : ${f.quantity}`,
  ];
  if (f.other) lines.push(`Autre besoin : ${f.other}`);
  if (f.load) lines.push(`Passagers ou charge : ${f.load}`);
  lines.push(`Lieu d’utilisation : ${f.place || "à préciser"}`, `Dates ou durée : ${f.dates || "à préciser"}`);
  if (f.mission) lines.push(`Mission : ${f.mission}`);
  lines.push(`Services complémentaires : ${f.services.length ? f.services.join(", ") : "aucun"}`);
  if (f.name) lines.push("", `Nom : ${f.name}`);
  if (f.phone) lines.push(`Téléphone : ${f.phone}`);
  if (f.email) lines.push(`E-mail : ${f.email}`);
  return lines.join("\n");
}

export const vhpWhatsappUrl = (f: VhpRequestFields) => whatsappUrlForMessage(buildVhpMessage(f));
