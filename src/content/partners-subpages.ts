/* Sous-pages Partenaires — contenu de la refonte (textes repris des 3 écrans Figma).
   Marqueur « rédigée » : texte absent des maquettes, écrit ici, à valider.
   Aucun prix, tarif ni disponibilité n'est affiché. */

import { whatsappUrlForMessage } from "@/content/contact-page";
import { ptnProposalHref, ptnRoutes, type PtnIconName, type PtnImageId } from "@/content/partners-hub";

type Cta = { label: string; href: string };
export type PtnFaqContent = { eyebrow?: string; title: string; titleHidden?: boolean; items: { question: string; answer: string }[] };

/* ---------------------------------------------------------------- Livreurs */

export type PtnDeliveryGoodsId = "colis" | "equipement" | "materiel" | "autre";

export const ptnDeliveryGoods: { id: PtnDeliveryGoodsId; label: string }[] = [
  { id: "colis", label: "Colis" },
  { id: "equipement", label: "Équipement" },
  { id: "materiel", label: "Matériel professionnel" },
  { id: "autre", label: "Autre" },
];

/** « Je souhaite livrer » / « Devenir livreur partenaire » : page existante de candidature livreur. */
export const ptnDriverApplyHref = "/devenir-livreur";

export const ptnDrvHero = {
  badge: "SERVICE EN PRÉPARATION",
  titleLines: ["Un besoin à", "transporter ?", "Commençons", "par le trajet."],
  lead: "Décrivez le bien, le point de départ et la destination pour étudier les possibilités de livraison.",
  primary: { label: "Présenter mon besoin", href: "#demande-livraison" } satisfies Cta,
  secondary: { label: "Je souhaite livrer", href: ptnDriverApplyHref } satisfies Cta,
  image: { id: "drvColis" as PtnImageId, alt: "Remise d’un colis entre une cliente et un livreur ONLOUTOU devant un fourgon" },
  caption: "Photo d’illustration",
};

export const ptnDrvChoices: { id: string; icon: PtnIconName; title: string; text: string; cta: Cta; variant: "yellow" | "outline" }[] = [
  {
    id: "besoin",
    icon: "box",
    title: "J’ai un besoin de livraison",
    text: "Décrire un trajet et ses contraintes.",
    cta: { label: "Préparer ma demande", href: "#demande-livraison" },
    variant: "yellow",
  },
  {
    id: "services",
    icon: "users",
    title: "Je souhaite proposer mes services",
    text: "Présenter mon profil et mes moyens.",
    cta: { label: "Devenir livreur partenaire", href: ptnDriverApplyHref },
    variant: "outline",
  },
];

export const ptnDrvForm = {
  id: "demande-livraison",
  title: "Votre trajet, votre besoin.",
  lead: "Renseignez les informations ci-dessous pour nous permettre d’étudier votre demande.",
  pickup: { label: "Point de collecte", placeholder: "Ville, quartier ou adresse" },
  destination: { label: "Destination", placeholder: "Ville, quartier ou adresse" },
  goodsLegend: "Bien à transporter",
  quantity: { label: "Quantité et dimensions", placeholder: "À préciser" },
  date: { label: "Date souhaitée", placeholder: "À préciser" },
  details: { label: "Précisions utiles", placeholder: "Poids, fragilité, accès, manutention..." },
  name: { label: "Votre nom", placeholder: "Votre nom" },
  channel: { label: "Téléphone ou e-mail", placeholder: "Téléphone ou e-mail" },
  requiredNote: "Champs obligatoires",
  submit: "Enregistrer ma demande",
  submitNote: "Vous pourrez relire le message avant de poursuivre sur WhatsApp.",
  error: "Merci de renseigner les champs obligatoires.", // rédigée
  panel: {
    title: "Votre demande",
    lead: "Récapitulatif des informations saisies.",
    pickupEmpty: "Départ à renseigner",
    destinationEmpty: "Destination à renseigner",
    note: "Les conditions, la faisabilité et le tarif restent à confirmer.",
  },
};

export type PtnDeliveryValues = {
  pickup: string;
  destination: string;
  goods: PtnDeliveryGoodsId | "";
  quantity: string;
  date: string;
  details: string;
  name: string;
  channel: string;
};

/** Message WhatsApp (gabarit rédigé, absent des maquettes) : à valider. */
export function buildPtnDeliveryMessage(values: PtnDeliveryValues): string {
  const lines: string[] = [];
  const add = (label: string, value: string) => {
    const v = value.trim();
    if (v) lines.push(`${label} : ${v}`);
  };
  add("Point de collecte", values.pickup);
  add("Destination", values.destination);
  add("Bien à transporter", ptnDeliveryGoods.find((item) => item.id === values.goods)?.label ?? "");
  add("Quantité et dimensions", values.quantity);
  add("Date souhaitée", values.date);
  add("Précisions utiles", values.details);
  add("Nom", values.name);
  add("Téléphone ou e-mail", values.channel);
  if (lines.length === 0) return "";
  return [
    "Bonjour ONLOUTOU, j’ai un besoin de livraison à étudier.",
    ...lines,
    "Les conditions, la faisabilité et le tarif restent à confirmer.",
  ].join("\n");
}

export function buildPtnDeliveryWhatsAppUrl(values: PtnDeliveryValues): string {
  return whatsappUrlForMessage(buildPtnDeliveryMessage(values));
}

export const ptnDrvSteps = {
  eyebrow: "COMMENT ÇA SE PASSE ?",
  title: "Avant toute prise en charge.",
  items: [
    { number: "01", icon: "doc" as PtnIconName, title: "Vérifier la faisabilité", text: "Nous étudions votre besoin, le trajet et ses contraintes." },
    { number: "02", icon: "gear" as PtnIconName, title: "Préciser les conditions", text: "Les modalités de livraison sont discutées selon la nature du bien et le contexte." },
    { number: "03", icon: "users" as PtnIconName, title: "Confirmer l’organisation", text: "Une fois les éléments validés, nous convenons ensemble des prochaines étapes." },
  ],
};

export const ptnDrvFaq: PtnFaqContent = {
  eyebrow: "QUESTIONS FRÉQUENTES",
  title: "Des questions sur la livraison ?",
  items: [
    {
      question: "Le service est-il déjà ouvert ?",
      answer: "Le service est en préparation. Vous pouvez présenter votre besoin pour un échange, sans réservation confirmée.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Comment connaître les modalités et le prix ?",
      answer:
        "Les modalités et le tarif ne sont pas fixés à l’avance : ils sont précisés avec vous après l’étude de votre besoin, selon le bien, le trajet et le contexte.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Comment proposer mes services de livraison ?",
      answer:
        "Utilisez « Devenir livreur partenaire » pour présenter votre profil et vos moyens. Cela ne constitue ni une inscription automatique ni une promesse de mission.",
    },
  ],
};

/* ---------------------------------------------------------- Technologiques */

export const ptnTechHero = {
  eyebrow: "PARTENAIRES TECHNOLOGIQUES",
  titleLines: ["Relions vos", "technologies aux", "besoins du terrain."],
  lead: "GPS, IoT, logiciels, intégration ou maintenance : présentez votre solution et la contribution que vous envisagez.",
  cta: { label: "Proposer une solution", href: ptnProposalHref("technologie") } satisfies Cta,
  image: { id: "techHero" as PtnImageId, alt: "Technicien configurant un boîtier GPS devant un ordinateur affichant une carte" },
  caption: "Technologie & terrain",
};

export const ptnTechDomains = {
  id: "domaines",
  eyebrow: "NOS DOMAINES DE COLLABORATION",
  title: "Des expertises qui se complètent.",
  items: [
    { icon: "pin" as PtnIconName, title: "GPS & objets connectés", text: "Dispositifs, capteurs et connectivité." },
    { icon: "laptop" as PtnIconName, title: "Logiciels & plateformes", text: "Applications, outils métier et interfaces." },
    { icon: "share" as PtnIconName, title: "Intégration & interopérabilité", text: "Échanges de données et connexion des systèmes." },
    { icon: "wrench" as PtnIconName, title: "Déploiement & maintenance", text: "Installation, diagnostic et accompagnement technique." },
  ],
};

export const ptnTechProcess = {
  id: "demarche-technique",
  eyebrow: "NOTRE DÉMARCHE",
  title: "Du besoin à la solution qui s’intègre.",
  steps: [
    { number: "01", icon: "doc" as PtnIconName, titleLines: ["Comprendre", "le contexte"], text: "Vos objectifs, votre périmètre et vos contraintes." },
    { number: "02", icon: "gear" as PtnIconName, titleLines: ["Évaluer", "la compatibilité"], text: "La faisabilité technique, les interfaces et les conditions d’intégration." },
    { number: "03", icon: "target" as PtnIconName, titleLines: ["Définir", "le périmètre"], text: "Les prochaines étapes et les modalités de collaboration." },
  ],
  note: "Les modalités techniques et commerciales se précisent ensemble.",
};

export const ptnTechProposal = {
  id: "proposition-technique",
  eyebrow: "PRÉPARER VOTRE PROPOSITION",
  title: "Ce qui nous aide à étudier votre proposition.",
  lead: "Pour mieux comprendre votre solution et son potentiel dans nos projets, voici les éléments utiles :",
  checklist: [
    "Le besoin auquel vous répondez",
    "Votre solution et ses prérequis",
    "Les possibilités d’intégration",
    "Votre capacité de déploiement",
    "Un contact technique",
  ],
  card: {
    badge: "TRAME À PRÉPARER",
    title: "Votre proposition technique",
    rows: [
      { icon: "doc" as PtnIconName, label: "Solution", text: "Description de la solution et de sa valeur ajoutée." },
      { icon: "grid" as PtnIconName, label: "Cas d’usage", text: "Exemples d’applications et contextes pertinents." },
      { icon: "gear" as PtnIconName, label: "Compatibilité", text: "Prérequis techniques et conditions d’intégration." },
      { icon: "users" as PtnIconName, label: "Accompagnement", text: "Modalités de déploiement et de maintenance envisagées." },
    ],
  },
  image: { id: "techDossier" as PtnImageId, alt: "Dossier technique, stylo doré et boîtier GPS" },
};

export const ptnTechBanner = {
  id: "collaborons",
  eyebrow: "COLLABORONS ENSEMBLE",
  title: "Une technologie à mettre au service d’un projet ?",
  lead: "Partagez votre solution, nous l’étudions avec attention.",
  primary: { label: "Préparer ma proposition", href: ptnProposalHref("technologie") } satisfies Cta,
  secondary: { label: "Échanger avec ONLOUTOU", href: "/contact" } satisfies Cta,
  note: "Toute collaboration reste soumise à l’étude du besoin et à des conditions définies ensemble.",
};

export const ptnTechFaq: PtnFaqContent = {
  eyebrow: "QUESTIONS FRÉQUENTES",
  title: "Questions fréquentes",
  titleHidden: true,
  items: [
    {
      // rédigée (absente de la maquette)
      question: "Puis-je proposer une solution déjà existante ?",
      answer:
        "Oui. Présentez la solution, ce qu’elle apporte et ses prérequis. Nous étudions sa pertinence au regard des besoins du terrain.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Peut-on collaborer sur une seule partie d’un projet ?",
      answer:
        "Oui. Vous pouvez proposer une contribution ciblée, par exemple un composant, une intégration ou de la maintenance. Le périmètre est défini ensemble.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Quelles informations techniques transmettre ?",
      answer:
        "Le besoin auquel vous répondez, votre solution et ses prérequis, les possibilités d’intégration, votre capacité de déploiement et un contact technique.",
    },
  ],
};

/* ------------------------------------------------------------- Fournisseurs */

export const ptnSupHero = {
  eyebrow: "FOURNISSEURS & DÉTENTEURS D’ÉQUIPEMENTS",
  titleLines: ["Vos équipements", "peuvent répondre", "à de nouveaux besoins."],
  lead: "Présentez les matériels que vous pouvez proposer à la location ou à la vente, leurs caractéristiques et leur disponibilité.",
  primary: { label: "Proposer mes équipements", href: ptnProposalHref("equipements") } satisfies Cta,
  secondary: { label: "Voir les familles", href: "#familles" } satisfies Cta,
  note: "Chaque offre fait l’objet d’un échange et d’une qualification.",
  image: { id: "supHero" as PtnImageId, alt: "Technicien en gilet jaune, tablette en main, devant un groupe électrogène" },
};

export const ptnSupTagline = "Un véhicule, un outil, une machine ou une flotte : partons de ce que vous pouvez mobiliser.";

export const ptnSupFamilies = {
  id: "familles",
  eyebrow: "FAMILLES D’ÉQUIPEMENTS",
  title: "Des familles variées. Une même exigence de clarté.",
  lead: "Ces exemples ne limitent pas les propositions possibles.",
  items: [
    { label: "Véhicules & utilitaires", image: "supVehicules" as PtnImageId, scene: "road", alt: "Fourgon blanc compact" },
    { label: "Motos & deux-roues", image: "supMotos" as PtnImageId, scene: "studio", alt: "Scooter utilitaire graphite avec top-case noir" },
    { label: "Camions & engins", image: "supEngins" as PtnImageId, scene: "earth", alt: "Mini-pelle hydraulique jaune sur chenilles" },
    { label: "Outils & matériel", image: "supOutils" as PtnImageId, scene: "wall", alt: "Perceuse sans fil et mallette d’outils" },
    { label: "Équipements techniques", image: "supTechniques" as PtnImageId, scene: "wall", alt: "Groupe électrogène robuste jaune et noir" },
    { label: "Autres équipements", image: "supAutres" as PtnImageId, scene: "wall", alt: "Projecteur, nettoyeur haute pression et autolaveuse" },
  ],
};

export const ptnSupOffer = {
  eyebrow: "COMMENT ÇA MARCHE ?",
  title: "Une offre facile à comprendre.",
  steps: [
    { number: "01", title: "Le matériel", text: "Type, état, caractéristiques et visuels." },
    { number: "02", title: "La disponibilité", text: "Périodes, quantité et zone." },
    { number: "03", title: "Les modalités", text: "Location ou vente, transport et conditions." },
    { number: "04", title: "Le contact", text: "Une personne pour préciser la proposition." },
  ],
  example: {
    badge: "EXEMPLE DE PRÉSENTATION",
    title: "Groupe électrogène",
    image: { id: "supExemple" as PtnImageId, alt: "Groupe électrogène compact jaune et noir" },
    rows: [
      { icon: "bolt" as PtnIconName, label: "Puissance", value: "à préciser" },
      { icon: "wrench" as PtnIconName, label: "État", value: "à renseigner" },
      { icon: "calendarCheck" as PtnIconName, label: "Disponibilité", value: "à confirmer" },
      { icon: "pin" as PtnIconName, label: "Zone", value: "à préciser" },
    ],
  },
};

export const ptnSupBand = {
  id: "proposer",
  eyebrow: "EN PRÉPARATION",
  title: "Présentez ce que vous pouvez proposer.",
  lead: "La proposition ouvre un échange. Les conditions seront définies selon le matériel et le besoin.",
  primary: { label: "Préparer ma proposition", href: ptnProposalHref("equipements") } satisfies Cta,
  secondary: { label: "Aperçu du futur espace partenaire", href: ptnRoutes.partnerSpacePreview } satisfies Cta,
  image: { id: "supBande" as PtnImageId, alt: "Deux professionnels examinant une tablette devant des équipements" },
};

export const ptnSupFaq: PtnFaqContent = {
  eyebrow: "QUESTIONS FRÉQUENTES",
  title: "Vos questions, nos réponses.",
  items: [
    {
      // rédigée (absente de la maquette)
      question: "Puis-je proposer un seul équipement ?",
      answer:
        "Oui. Un seul équipement peut faire l’objet d’une proposition. Précisez son type, son état, ses caractéristiques et sa disponibilité.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Puis-je proposer du matériel hors de ces catégories ?",
      answer:
        "Oui. Les familles présentées sont des exemples et ne limitent pas les propositions possibles. Décrivez simplement ce que vous pouvez mobiliser.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Comment sont définies les modalités ?",
      answer:
        "Elles sont précisées lors de l’échange, selon le matériel et le besoin : location ou vente, transport et conditions.",
    },
  ],
};