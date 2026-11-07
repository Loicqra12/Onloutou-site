import { site } from "@/content/site";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type { TemIconName } from "@/components/tools/redesign/TemIcon";

const img = "/assets/images/equipment/outils-materiel";
export const temImage = (name: string) => `${img}/${name}.webp`;

export const temBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements", href: "/equipements" },
  { label: "Outils et matériels" },
];

export const temHero = {
  eyebrow: "Abidjan, Côte d’Ivoire · Outils et matériel",
  titleBefore: "Le matériel",
  titleUnderline: "qu’il vous faut.",
  titleAfter: "Pour tous vos projets.",
  lead: ["Travaux, entretien, événements ou activité", "professionnelle : explorez les familles de matériel", "et décrivez votre besoin."],
  image: {
    src: temImage("hero-materiel-socles"),
    width: 1364,
    height: 910,
    alt: "Nettoyeur haute pression, groupe électrogène, perceuse sans fil et enceinte jaunes et noirs présentés sur des socles clairs.",
  },
  search: {
    whatLabel: "Que souhaitez-vous louer ?",
    whatPlaceholder: "Un outil, un équipement, un usage…",
    whereLabel: "Lieu d’utilisation",
    wherePlaceholder: "Ville ou commune",
    whenLabel: "Dates",
    whenPlaceholder: "À préciser",
    submit: "Explorer",
    missing: "Vous ne trouvez pas votre matériel ?",
    describe: "Décrivez votre besoin",
    note: "Disponibilités et conditions confirmées après étude.",
  },
};

export type TemFamilyId = "energie" | "outillage" | "nettoyage" | "batiment" | "evenementiel" | "autres";
export type TemCategoryId =
  | "outillage"
  | "batiment"
  | "energie"
  | "pompage"
  | "nettoyage"
  | "jardin"
  | "manutention"
  | "evenementiel"
  | "son"
  | "cuisine"
  | "informatique"
  | "specialise";
export type TemUsageId = "chantier" | "evenement" | "secours";
export type TemEnergyId = "electrique" | "thermique" | "batterie" | "manuel";

export const temFamilies: { id: TemFamilyId; label: string; icon: TemIconName }[] = [
  { id: "energie", label: "Énergie & éclairage", icon: "bolt" },
  { id: "outillage", label: "Outillage & atelier", icon: "wrench" },
  { id: "nettoyage", label: "Nettoyage & entretien", icon: "broom" },
  { id: "batiment", label: "Bâtiment & rénovation", icon: "wall" },
  { id: "evenementiel", label: "Événementiel", icon: "calendar" },
  { id: "autres", label: "Autres univers", icon: "dots" },
];

export const temCategories: { id: TemCategoryId; label: string; family: TemFamilyId; image: string; alt: string }[] = [
  { id: "outillage", label: "Outillage & atelier", family: "outillage", image: "perceuse-2", alt: "Perceuse sans fil jaune et noire" },
  { id: "batiment", label: "Bâtiment & rénovation", family: "batiment", image: "betonniere", alt: "Bétonnière orange" },
  { id: "energie", label: "Énergie & éclairage", family: "energie", image: "groupe-electrogene", alt: "Groupe électrogène jaune et noir" },
  { id: "pompage", label: "Pompage & traitement d’eau", family: "autres", image: "pompe-submersible", alt: "Pompe submersible inox avec tuyau bleu" },
  { id: "nettoyage", label: "Nettoyage & entretien", family: "nettoyage", image: "nettoyeur-haute-pression", alt: "Nettoyeur haute pression jaune et noir" },
  { id: "jardin", label: "Jardin & agriculture", family: "autres", image: "tondeuse", alt: "Tondeuse à gazon rouge et noire" },
  { id: "manutention", label: "Manutention & stockage", family: "autres", image: "transpalette", alt: "Transpalette manuel jaune" },
  { id: "evenementiel", label: "Événementiel & réception", family: "evenementiel", image: "tente-reception", alt: "Tente de réception blanche et chaises" },
  { id: "son", label: "Son, image & éclairage", family: "evenementiel", image: "enceinte-projecteur", alt: "Enceinte noire et projecteur de scène" },
  { id: "cuisine", label: "Cuisine & restauration", family: "evenementiel", image: "chafing-dish", alt: "Chafing-dish inox avec support" },
  { id: "informatique", label: "Informatique & bureautique", family: "autres", image: "ordinateur-videoprojecteur", alt: "Ordinateur portable et vidéoprojecteur" },
  { id: "specialise", label: "Matériel spécialisé", family: "autres", image: "instrument-topographique", alt: "Instrument topographique jaune avec trépied et mallette" },
];

export const temUsages: { id: TemUsageId; label: string }[] = [
  { id: "chantier", label: "Chantier" },
  { id: "evenement", label: "Événement" },
  { id: "secours", label: "Secours électrique" },
];

export const temEnergies: { id: TemEnergyId; label: string }[] = [
  { id: "electrique", label: "Électrique" },
  { id: "thermique", label: "Thermique" },
  { id: "batterie", label: "Batterie" },
  { id: "manuel", label: "Manuel" },
];

export const temCities = ["Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro", "Autre ville"];

export type TemProduct = {
  id: string;
  name: string;
  text: string;
  category: TemCategoryId;
  image: string;
  imageWidth: number;
  imageHeight: number;
  usages: TemUsageId[];
  energy: TemEnergyId;
};

const p = (
  id: string,
  name: string,
  text: string,
  category: TemCategoryId,
  image: string,
  size: [number, number],
  usages: TemUsageId[],
  energy: TemEnergyId,
): TemProduct => ({ id, name, text, category, image, imageWidth: size[0], imageHeight: size[1], usages, energy });

export const temProducts: TemProduct[] = [
  p("groupe-electrogene-compact", "Groupe électrogène compact", "Alimentation ponctuelle.", "energie", "generateur-compact", [640, 486], ["chantier", "evenement", "secours"], "thermique"),
  p("groupe-electrogene-industriel", "Groupe électrogène industriel", "Besoins de puissance à préciser.", "energie", "generateur-industriel", [640, 371], ["chantier", "secours"], "thermique"),
  p("tour-eclairage", "Tour d’éclairage", "Éclairage extérieur.", "energie", "tour-eclairage", [640, 560], ["chantier", "evenement"], "thermique"),
  p("projecteur-chantier", "Projecteur de chantier", "Éclairage de proximité.", "energie", "projecteur-led", [640, 574], ["chantier", "evenement"], "electrique"),
  p("distribution-electrique", "Distribution électrique", "Coffrets et raccordements.", "energie", "coffret-electrique", [640, 487], ["chantier", "evenement"], "electrique"),
  p("station-energie-portable", "Station d’énergie portable", "Autonomie à étudier.", "energie", "station-energie", [640, 439], ["chantier", "secours"], "batterie"),
  p("perceuse-sans-fil", "Perceuse sans fil", "Perçage et vissage courants.", "outillage", "perceuse-1", [640, 626], ["chantier"], "batterie"),
  p("perceuse-visseuse", "Perceuse-visseuse", "Travaux d’atelier et de finition.", "outillage", "perceuse-2", [587, 640], ["chantier"], "batterie"),
  p("kit-chantier", "Kit d’équipement de chantier", "Outillage et protections à préciser.", "outillage", "kit-chantier", [900, 600], ["chantier"], "batterie"),
  p("nettoyeur-haute-pression", "Nettoyeur haute pression", "Nettoyage de surfaces et de véhicules.", "nettoyage", "nettoyeur-haute-pression", [429, 640], ["chantier", "evenement"], "electrique"),
  p("betonniere", "Bétonnière", "Préparation de béton sur site.", "batiment", "betonniere", [640, 551], ["chantier"], "electrique"),
  p("tente-reception", "Tente de réception", "Abri et mobilier à préciser.", "evenementiel", "tente-reception", [640, 405], ["evenement"], "manuel"),
  p("enceinte-projecteur", "Enceinte et projecteur de scène", "Sonorisation et éclairage de scène.", "son", "enceinte-projecteur", [640, 460], ["evenement"], "electrique"),
  p("chafing-dish", "Chafing-dish inox", "Service et maintien au chaud.", "cuisine", "chafing-dish", [640, 393], ["evenement"], "thermique"),
  p("pompe-submersible", "Pompe submersible", "Évacuation et transfert d’eau.", "pompage", "pompe-submersible", [640, 500], ["chantier"], "electrique"),
  p("tondeuse", "Tondeuse à gazon", "Entretien d’espaces verts.", "jardin", "tondeuse", [640, 498], ["chantier"], "thermique"),
  p("transpalette", "Transpalette manuel", "Manutention de charges palettisées.", "manutention", "transpalette", [640, 478], ["chantier"], "manuel"),
  p("camion-utilitaire", "Petit camion utilitaire", "Transport de matériel, à préciser.", "manutention", "camion-utilitaire", [640, 349], ["chantier"], "thermique"),
  p("ordinateur-videoprojecteur", "Ordinateur et vidéoprojecteur", "Présentations et réunions.", "informatique", "ordinateur-videoprojecteur", [640, 262], ["evenement"], "electrique"),
  p("instrument-topographique", "Instrument topographique", "Mesure et implantation sur chantier.", "specialise", "instrument-topographique", [426, 640], ["chantier"], "batterie"),
];

export const temCategoryById = (id: TemCategoryId) => temCategories.find((c) => c.id === id)!;
export const temFamilyById = (id: TemFamilyId) => temFamilies.find((f) => f.id === id)!;

export function temNormalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export type TemFilter = {
  query: string;
  family: TemFamilyId;
  category: TemCategoryId | null;
  usage: TemUsageId | "";
  energy: TemEnergyId | "";
};

export function temFilterProducts(f: TemFilter): TemProduct[] {
  const q = temNormalize(f.query);
  return temProducts.filter((prod) => {
    const cat = temCategoryById(prod.category);
    if (q) {
      const hay = temNormalize(`${prod.name} ${prod.text} ${cat.label} ${prod.usages.join(" ")} ${prod.energy}`);
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    } else if (f.category) {
      if (prod.category !== f.category) return false;
    } else if (cat.family !== f.family) {
      return false;
    }
    if (f.usage && !prod.usages.includes(f.usage)) return false;
    if (f.energy && prod.energy !== f.energy) return false;
    return true;
  });
}

export const temCatalog = {
  kicker: "Explorer les équipements",
  titleBefore: "Trouvez ",
  titleUnderline: "le bon matériel,",
  titleAfter: "selon votre usage.",
  searchPlaceholder: "Rechercher un équipement ou un usage",
  datePlaceholder: "À préciser",
  filterTitle: "Affiner ma recherche",
  familyTitle: "Famille d’équipements",
  usageTitle: "Usage",
  energyTitle: "Source d’énergie",
  energyPlaceholder: "À préciser",
  help: { title: "Besoin d’aide pour choisir ?", text: "Nos conseillers vous orientent vers le matériel adapté à votre projet." },
  lead: "Exemples de matériels à rechercher — disponibilité sur demande.",
  compare: "Comparer",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
};

export const temCategoriesSection = {
  kicker: "Explorez nos catégories",
  title: "Explorez tous les univers.",
  banner: { title: "Une demande qui sort des catégories ?", text: "Nous l’étudions aussi.", cta: "Décrire mon besoin" },
};

export const temShowroom = {
  title: ["Pas dans la sélection ?", "Parlons-en."],
  text: "Un modèle précis, un matériel rare ou plusieurs équipements à réunir : décrivez votre besoin, même sans connaître la référence.",
  cta: "Demander un matériel spécifique",
  image: {
    src: temImage("conseil-showroom"),
    width: 1200,
    height: 480,
    alt: "Un conseiller ONLOUTOU présente une sélection de matériels à une cliente dans un showroom.",
  },
};

export const temSteps: { icon: TemIconName; title: string; text: string }[] = [
  { icon: "file", title: "Vous décrivez", text: "Votre besoin, l’usage et les conditions de votre projet." },
  { icon: "search", title: "Nous recherchons", text: "Nos équipes identifient les meilleurs équipements disponibles." },
  { icon: "clipboardCheck", title: "Vous validez la proposition", text: "Vous recevez une réponse adaptée et un devis personnalisé." },
];

export const temRequestBar = { label: "Ma demande", empty: "Aucun équipement pour le moment", next: "Continuer" };

export const temForm = {
  id: "demande-materiel",
  titleBefore: "Votre besoin",
  titleAfter: ", en quelques détails.",
  lead: "Ajoutez un ou plusieurs équipements, même s’ils ne figurent pas dans les catégories.",
  steps: ["Matériel", "Projet", "Coordonnées"],
  equipmentLabel: "Matériel recherché",
  equipmentPlaceholder: "Ex. perceuse, tente, caméra…",
  addAnother: "Ajouter un autre équipement",
  remove: "Retirer cet équipement",
  cityLabel: "Ville ou commune",
  cityPlaceholder: "Ex. Abidjan, Cocody",
  startLabel: "Date de début",
  endLabel: "Date de fin",
  datePlaceholder: "À préciser",
  quantityLabel: "Quantité",
  usageLabel: "Décrivez votre usage ou les caractéristiques recherchées",
  usagePlaceholder: "Ex. travaux de rénovation, événement en extérieur, besoins spécifiques…",
  fileLabel: "Joindre une photo ou une référence — facultatif",
  fileHint: "Glissez une image ici ou cliquez pour parcourir",
  fileFormats: "Formats acceptés : JPG, PNG, PDF (max 10 Mo)",
  servicesLabel: "Services souhaités",
  servicesOptional: " (facultatif)",
  services: [
    { id: "livraison", label: "Livraison", icon: "truck" as TemIconName },
    { id: "installation", label: "Installation", icon: "wrench" as TemIconName },
    { id: "formation", label: "Formation", icon: "userPlus" as TemIconName },
    { id: "preciser", label: "À préciser", icon: "dots" as TemIconName },
  ],
  contactLabel: "Vos coordonnées",
  name: "Nom",
  phone: "Téléphone",
  email: "E-mail (facultatif)",
  profileLabel: "Vous êtes",
  profiles: [
    { id: "particulier", label: "Particulier" },
    { id: "professionnel", label: "Professionnel" },
  ],
  submit: "Enregistrer ma demande",
  submitNote: "Vous pourrez vérifier le récapitulatif avant l’envoi.",
  maxFileBytes: 10 * 1024 * 1024,
};

export const temSummary = {
  title: "Votre demande de location",
  equipment: "Matériel",
  quantity: "Quantité",
  place: "Lieu",
  period: "Période",
  toSpecify: "À préciser",
  priceTitle: "Tarif et disponibilité sur proposition.",
  priceText: "Nous étudions votre demande et revenons vers vous rapidement avec une offre adaptée à vos besoins.",
  image: {
    src: temImage("kit-chantier"),
    width: 900,
    height: 600,
    alt: "Perceuse sans fil, casque de chantier jaune, gants et mètre ruban.",
  },
};

export const temFlow: { title: string; text: string; icon: TemIconName }[] = [
  { icon: "file", title: "Décrire le besoin", text: "Dites-nous ce dont vous avez besoin." },
  { icon: "chat", title: "Recevoir une proposition", text: "Nos équipes vous envoient une offre adaptée." },
  { icon: "handshake", title: "Confirmer les conditions", text: "Vous validez et nous organisons la location." },
];

export const temProposal = {
  titleBefore: "Ce qui sera",
  titleAfter: " précisé dans votre proposition.",
  cards: [
    {
      icon: "gear" as TemIconName,
      title: ["Matériel & accessoires"],
      image: "perceuse-1",
      size: [640, 626] as [number, number],
      alt: "Perceuse sans fil jaune et noire",
      items: ["Modèle et marque proposés", "Compatibilité avec votre usage", "Accessoires inclus", "Consommables (si applicable)", "État du matériel"],
    },
    {
      icon: "calendar" as TemIconName,
      title: ["Durée & coût"],
      image: "generateur-ouvert",
      size: [640, 439] as [number, number],
      alt: "Groupe électrogène jaune et noir",
      items: ["Période de location", "Détail du tarif", "Taxes applicables", "Caution éventuelle", "Conditions de modification"],
    },
    {
      icon: "truck" as TemIconName,
      title: ["Livraison", "& restitution"],
      image: "camion-utilitaire",
      size: [640, 349] as [number, number],
      alt: "Petit camion utilitaire blanc",
      items: ["Options de livraison et d’installation", "Lieu et horaires convenus", "Modalités de restitution", "État des lieux", "Responsabilités et assurance (si applicable)"],
    },
  ],
};

export const temFaq = {
  title: ["Questions", " fréquentes."],
  items: [
    {
      question: "Et si mon matériel n’apparaît pas ?",
      answer: "Décrivez-le ou ajoutez une photo. Nous étudierons les possibilités adaptées à votre besoin.",
    },
    {
      question: "Puis-je demander plusieurs équipements ?",
      answer: "Oui. Ajoutez-les à votre demande ou décrivez-les dans le formulaire : nous étudierons l’ensemble avec vous.",
    },
    {
      question: "La livraison est-elle incluse ?",
      answer: "La livraison et l’installation sont des services optionnels, précisés dans votre proposition selon le lieu et le matériel.",
    },
    {
      question: "Les tarifs sont-ils affichés ?",
      answer: "Non. Le tarif et la disponibilité sont communiqués sur proposition, après étude de votre besoin.",
    },
    {
      question: "Quels documents puis-je joindre ?",
      answer: "Une photo ou une référence au format JPG, PNG ou PDF (10 Mo maximum). Elle aide à préciser le matériel recherché.",
    },
    {
      question: "Puis-je acheter plutôt que louer ?",
      answer: "Précisez-le dans votre demande : les possibilités d’acquisition sont étudiées au cas par cas.",
    },
  ],
};

export const temWhatsappBand = {
  title: "Un besoin particulier ? Parlons-en.",
  text: "Notre équipe vous accompagne pour trouver la meilleure solution.",
  cta: "Échanger sur WhatsApp",
};

export type TemRequestFields = {
  items: string[];
  quantity: number;
  place: string;
  start: string;
  end: string;
  usage: string;
  services: string[];
  fileName: string;
  name: string;
  phone: string;
  email: string;
  profile: string;
};

export function buildTemMessage(f: TemRequestFields) {
  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite recevoir une proposition pour une location de matériel.",
    "",
    `Matériel : ${f.items.length ? f.items.join(" ; ") : "à préciser"}`,
    `Quantité : ${f.quantity}`,
    `Lieu : ${f.place || "à préciser"}`,
    `Période : ${f.start || f.end ? `du ${f.start || "à préciser"} au ${f.end || "à préciser"}` : "à préciser"}`,
    `Usage : ${f.usage || "à préciser"}`,
    `Services souhaités : ${f.services.length ? f.services.join(", ") : "à déterminer"}`,
  ];
  if (f.fileName) lines.push(`Pièce jointe (à envoyer dans la conversation) : ${f.fileName}`);
  lines.push("", `Profil : ${f.profile}`);
  if (f.name) lines.push(`Nom : ${f.name}`);
  if (f.phone) lines.push(`Téléphone : ${f.phone}`);
  if (f.email) lines.push(`E-mail : ${f.email}`);
  return lines.join("\n");
}

export const temWhatsappUrl = (f: TemRequestFields) => whatsappUrlForMessage(buildTemMessage(f));
export const temPhone = { display: site.phoneDisplay, tel: site.phoneTel };
