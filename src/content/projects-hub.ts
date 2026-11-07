/* Page Projets — contenu de la refonte (textes repris des 5 écrans Figma).
   Les réponses de FAQ notées « rédigée » et le gabarit du message WhatsApp sont écrits ici
   (absents des maquettes) : à valider. */

import { whatsappUrlForMessage } from "@/content/contact-page";

export type PrjIconName =
  | "target"
  | "bulb"
  | "team"
  | "monitor"
  | "phone"
  | "gear"
  | "pin"
  | "wrench"
  | "bars"
  | "chat"
  | "car"
  | "arrowUpRight"
  | "arrowRight"
  | "arrowDown"
  | "plus"
  | "minus";

export type PrjImageId =
  | "chapechape"
  | "hero"
  | "cogitech"
  | "apa"
  | "cndpep"
  | "kps"
  | "ovpr"
  | "carburant"
  | "sidsun"
  | "bni"
  | "baci"
  | "talentys"
  | "missions";

const base = "/assets/images/projects/projet";

export const prjImages: Record<PrjImageId, { src: string; width: number; height: number }> = {
  chapechape: { src: `${base}/prj-01-chapechape-residence.webp`, width: 1400, height: 933 },
  hero: { src: `${base}/prj-02-hero-equipe-ordinateur.webp`, width: 1400, height: 895 },
  cogitech: { src: `${base}/prj-03-cogitech-chantier.webp`, width: 1400, height: 888 },
  apa: { src: `${base}/prj-04-apa-mockup.webp`, width: 1400, height: 816 },
  cndpep: { src: `${base}/prj-05-cndpep-mockup.webp`, width: 1400, height: 906 },
  kps: { src: `${base}/prj-06-kps-mockup.webp`, width: 1400, height: 928 },
  ovpr: { src: `${base}/prj-07-ovpr-mockup.webp`, width: 1400, height: 813 },
  carburant: { src: `${base}/prj-08-carburant-ravitaillement.webp`, width: 1400, height: 714 },
  sidsun: { src: `${base}/prj-09-sidsun-restaurant.webp`, width: 1400, height: 926 },
  bni: { src: `${base}/prj-10-bni-responsable.webp`, width: 1400, height: 928 },
  baci: { src: `${base}/prj-11-baci-responsable.webp`, width: 1400, height: 908 },
  talentys: { src: `${base}/prj-12-talentys-logistique.webp`, width: 1343, height: 999 },
  missions: { src: `${base}/prj-13-missions-technicien-gps.webp`, width: 1400, height: 933 },
};

export const prjLinks = {
  brief: "#brief-projet",
  expertise: "/expertise",
  contact: "/contact",
  kps: "https://kpsservices.fr",
} as const;

export const prjIds = {
  digital: "realisations-numeriques",
  missions: "missions-terrain",
  innovations: "innovations",
  brief: "brief-projet",
} as const;

export const prjHero = {
  eyebrow: "PROJETS & RÉALISATIONS",
  titleLines: ["Des projets", "concrets.", "Des idées qui", "prennent forme."],
  lead: "Plateformes numériques, équipements connectés et initiatives ONLOUTOU : découvrez ce que nous construisons et déployons.",
  primary: { label: "Explorer les réalisations", href: `#${prjIds.digital}` },
  secondary: { label: "Présenter mon projet", href: prjLinks.brief },
  image: {
    id: "hero" as PrjImageId,
    alt: "Une cheffe de projet et un technicien examinent un ordinateur portable, avec un casque et un appareil de mesure sur la table",
    caption: "Illustration d’une situation de travail.",
  },
};

export const prjBar = [
  { number: "01", label: "Réalisations numériques", href: `#${prjIds.digital}` },
  { number: "02", label: "Missions terrain", href: `#${prjIds.missions}` },
  { number: "03", label: "Innovations & MVP", href: `#${prjIds.innovations}` },
];

export const prjFeatured = {
  id: "chapechape-residence",
  eyebrow: "PROJET ONLOUTOU",
  title: "ChapeChape Résidence",
  badge: "Projet existant",
  lead: "Un écosystème numérique pour la location et la gestion de résidences.",
  image: {
    id: "chapechape" as PrjImageId,
    alt: "Un salon meublé et un smartphone affichant l’application ChapeChape Résidence",
    caption: "Visuel de présentation — interface illustrative.",
  },
  points: [
    { icon: "target" as PrjIconName, title: "Le besoin", text: "Faciliter la recherche d’un logement et la gestion des résidences." },
    { icon: "bulb" as PrjIconName, title: "Le projet", text: "Un site, des applications et un espace de gestion réunis autour d’un même parcours." },
    { icon: "team" as PrjIconName, title: "L’équipe", text: "Projet porté par ONLOUTOU avec l’équipe ChapeChape Résidence." },
  ],
  tiles: [
    { icon: "monitor" as PrjIconName, label: "Web" },
    { icon: "phone" as PrjIconName, label: "Applications" },
    { icon: "gear" as PrjIconName, label: "Gestion" },
  ],
  /** Aucun site public de ChapeChape Résidence n'existe dans le code : le bouton renvoie à la carte elle-même. */
  cta: { label: "Découvrir ChapeChape Résidence", href: "#chapechape-residence" },
  note: "Chaque projet est présenté selon son périmètre et son avancement.",
};

export const prjDigital = {
  id: prjIds.digital,
  eyebrow: "RÉALISATIONS NUMÉRIQUES",
  titleLines: ["Des outils pensés", "pour ceux qui les utilisent."],
  lead: "Sites, interfaces et espaces de gestion : des réalisations menées avec l’équipe ChapeChape Résidence.",
  items: [
    {
      id: "kps-services",
      kicker: "SERVICES AUX ENTREPRISES",
      title: "KPS Services",
      text: "Un écosystème numérique au service du nettoyage professionnel.",
      rows: [
        { icon: "monitor" as PrjIconName, label: "Réalisation", text: "Site web et tableau de bord." },
        { icon: "team" as PrjIconName, label: "Collaboration", text: "Avec l’équipe ChapeChape Résidence." },
      ],
      chips: ["Site web", "Tableau de bord"],
      cta: { label: "Visiter le site", href: prjLinks.kps, note: "kpsservices.fr" },
      image: "kps" as PrjImageId,
      alt: "Site KPS Services affiché sur un écran d’ordinateur et une tablette",
      caption: "Illustration d’interface — aperçu non contractuel.",
      scene: "kps",
      reverse: false,
    },
    {
      id: "cndpep-ci",
      kicker: "INSTITUTIONNEL",
      title: "CNDPEP-CI",
      text: "Chambre nationale des détectives privés et enquêteurs professionnels de Côte d’Ivoire.",
      rows: [
        { icon: "monitor" as PrjIconName, label: "Réalisation", text: "Site web et espace de gestion." },
        { icon: "team" as PrjIconName, label: "Collaboration", text: "Avec l’équipe ChapeChape Résidence." },
      ],
      chips: ["Site institutionnel", "Gestion"],
      cta: null,
      image: "cndpep" as PrjImageId,
      alt: "Site CNDPEP-CI affiché sur un écran d’ordinateur et une tablette",
      caption: "Illustration d’interface — aperçu non contractuel.",
      scene: "cndpep",
      reverse: true,
    },
  ],
  band: {
    title: "Derrière chaque interface, une méthode.",
    cta: { label: "Découvrir notre expertise", href: prjLinks.expertise },
  },
};

export const prjMissions = {
  id: prjIds.missions,
  eyebrow: "MISSIONS TERRAIN",
  titleLines: ["La technologie,", "au plus près", "du terrain."],
  lead: "Géolocalisation, installation et supervision : des interventions adaptées aux usages de chaque flotte.",
  chips: [
    { icon: "pin" as PrjIconName, label: "GPS" },
    { icon: "wrench" as PrjIconName, label: "Installation" },
    { icon: "bars" as PrjIconName, label: "Supervision" },
  ],
  image: {
    id: "missions" as PrjImageId,
    alt: "Un technicien ONLOUTOU raccorde un boîtier GPS à l’intérieur d’un véhicule",
    caption: "Photo d’illustration.",
  },
  items: [
    {
      id: "bni",
      kicker: "SECTEUR BANCAIRE",
      title: "Banque BNI",
      text: "Accompagner le suivi des véhicules en leasing.",
      intervention: "Fourniture, installation et paramétrage de dispositifs GPS. Supervision et alertes.",
      perimeter: "Véhicules en leasing et flotte corporate.",
      image: "bni" as PrjImageId,
      alt: "Une responsable concentrée devant son ordinateur portable",
      scene: "office-a",
    },
    {
      id: "baci",
      kicker: "SECTEUR BANCAIRE",
      title: "Banque BACI",
      text: "Contribuer à la sécurisation des actifs roulants.",
      intervention: "Géolocalisation et suivi des véhicules mis à disposition des clients.",
      perimeter: "Flotte en leasing.",
      image: "baci" as PrjImageId,
      alt: "Un responsable concentré devant son ordinateur portable",
      scene: "office-b",
    },
    {
      id: "cogitech",
      kicker: "BTP & INDUSTRIE",
      title: "Cogitech",
      text: "Adapter le suivi aux contraintes du chantier.",
      intervention: "Gestion de flotte et suivi GPS sur plusieurs sites d’intervention.",
      perimeter: "Véhicules légers et utilitaires.",
      image: "cogitech" as PrjImageId,
      alt: "Deux techniciens en gilets jaunes devant une pelle mécanique, tablette en main",
      scene: "site",
    },
    {
      id: "talentys",
      kicker: "SERVICES & LOGISTIQUE",
      title: "Talenty’s",
      text: "Accompagner le pilotage de l’activité terrain.",
      intervention: "Visibilité en temps réel, accompagnement à l’optimisation des tournées et preuve d’activité.",
      perimeter: "Livraison et logistique.",
      image: "talentys" as PrjImageId,
      alt: "Un responsable avec une tablette et un livreur devant un utilitaire chargé de cartons",
      scene: "logistics",
    },
  ],
  labels: { intervention: "Intervention", perimeter: "Périmètre" },
  band: {
    title: "Un besoin similaire pour votre flotte ?",
    text: "Présentez-nous votre contexte, vos usages et vos contraintes.",
    primary: { label: "Parler de mon projet", href: prjLinks.brief },
    secondary: { label: "Notre expertise terrain", href: prjLinks.expertise },
  },
};

export const prjInnovations = {
  id: prjIds.innovations,
  eyebrow: "INNOVATIONS & MVP",
  titleLines: ["Les projets qui", "prennent forme"],
  lead: "Des initiatives ONLOUTOU à différents stades de développement.",
  note: "MVP : une première version du produit, avant son évolution.",
  mvps: [
    {
      id: "apa",
      badge: "MVP",
      title: "APA",
      subtitle: "Allo Pièce Auto",
      text: "Un projet de plateforme pour rechercher des pièces automobiles et faciliter sa mise en relation avec les besoins des clients.",
      chips: [
        { icon: "monitor" as PrjIconName, label: "Site web" },
        { icon: "phone" as PrjIconName, label: "Mobile" },
        { icon: "bars" as PrjIconName, label: "Tableau de bord" },
      ],
      /** Aucun contenu d'aperçu n'existe dans le code : le bouton renvoie à la carte du MVP. */
      cta: { label: "Voir les aperçus", href: "#apa" },
      image: "apa" as PrjImageId,
      alt: "Aperçu du MVP APA : site de pièces automobiles sur ordinateur et application mobile",
      caption: "Aperçus du MVP",
      reverse: false,
    },
    {
      id: "ovpr",
      badge: "MVP",
      title: "OVPR",
      subtitle: "Objets volés, perdus ou retrouvés",
      text: "Un projet pour faciliter la déclaration, la recherche et la restitution d’objets.",
      chips: [
        { icon: "monitor" as PrjIconName, label: "Site web" },
        { icon: "phone" as PrjIconName, label: "Mobile" },
        { icon: "bars" as PrjIconName, label: "Tableau de bord" },
      ],
      cta: { label: "Voir les aperçus", href: "#ovpr" },
      image: "ovpr" as PrjImageId,
      alt: "Aperçu du MVP OVPR : site de déclaration d’objets sur ordinateur et application mobile",
      caption: "Aperçus du MVP",
      reverse: true,
    },
  ],
  concepts: [
    {
      id: "sidsun",
      badge: "EN DÉVELOPPEMENT",
      tone: "soft",
      title: "Sidsun",
      subtitle: "Gestion de restaurant",
      text: "Un projet nourri par les besoins du Kiosque ONLOUTOU pour accompagner la gestion de la restauration.",
      image: "sidsun" as PrjImageId,
      alt: "Un responsable de restaurant utilise une tablette en cuisine",
      caption: "Illustration du projet",
      scene: "kitchen",
    },
    {
      id: "carburant",
      badge: "À VENIR",
      tone: "soft",
      title: "Carburant à la demande",
      subtitle: null,
      text: "Demander du carburant et être rejoint par un véhicule de ravitaillement : un projet de service mobile.",
      image: "carburant" as PrjImageId,
      alt: "Un camion-citerne ravitaille une berline grise",
      caption: "Illustration du concept",
      scene: "road",
    },
  ],
};

export const prjBrief = {
  id: prjIds.brief,
  eyebrow: "VOTRE PROJET",
  titleLines: ["Parlons de ce que vous", "voulez construire."],
  lead: "Un besoin précis ou une idée à clarifier ? Décrivez votre contexte pour préparer notre échange.",
  formTitle: "Présentez votre besoin",
  needLegend: "Votre besoin",
  needs: ["Projet numérique", "Mission terrain", "Autre besoin"],
  fields: {
    description: { label: "Décrivez votre projet", placeholder: "Votre objectif, votre contexte et les difficultés à résoudre…" },
    name: { label: "Nom", placeholder: "Votre nom" },
    organisation: { label: "Organisation", placeholder: "Facultatif" },
    phone: { label: "Téléphone (WhatsApp si possible)", placeholder: "07 00 00 00 00" },
    email: { label: "E-mail", placeholder: "Facultatif" },
    place: { label: "Lieu du projet", placeholder: "Ville ou zone concernée" },
    deadline: { label: "Échéance envisagée", placeholder: "À préciser" },
  },
  requiredNote: "Champs obligatoires",
  submit: "Enregistrer ma demande",
  saving: "Enregistrement…",
  submitNote: "Votre demande est d’abord enregistrée par ONLOUTOU. Vous pourrez ensuite ouvrir WhatsApp si vous le souhaitez.",
  error: "Merci de renseigner votre projet, votre nom et un numéro de téléphone (au moins 8 chiffres) ou un e-mail valide.",
  whatsappAfter: "Continuer sur WhatsApp",
  panel: {
    title: "Votre message",
    empty: "Votre récapitulatif apparaîtra ici après avoir renseigné le formulaire.",
    contactTitle: "Une autre façon de nous contacter",
    contact: { label: "Ouvrir la page Contact", href: prjLinks.contact },
  },
};

export type PrjBriefValues = {
  need: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  organisation: string;
  place: string;
  deadline: string;
};

/** Message affiché dans le panneau noir et envoyé sur WhatsApp (gabarit rédigé, à valider). */
export function buildPrjMessage(values: PrjBriefValues): string {
  const lines: string[] = [];
  const add = (label: string, value: string) => {
    const v = value.trim();
    if (v) lines.push(`${label} : ${v}`);
  };
  add("Besoin", values.need);
  add("Projet", values.description);
  add("Nom", values.name);
  add("Téléphone", values.phone);
  add("Organisation", values.organisation);
  add("Lieu du projet", values.place);
  add("Échéance envisagée", values.deadline);
  if (lines.length === 0) return "";
  return ["Bonjour ONLOUTOU, je souhaite présenter un projet.", ...lines].join("\n");
}

export function buildPrjWhatsAppUrl(values: PrjBriefValues): string {
  return whatsappUrlForMessage(buildPrjMessage(values));
}

export const prjFaq = {
  eyebrow: "FAQ",
  title: "Quelques réponses avant de commencer.",
  items: [
    {
      question: "Mon projet n’est pas encore complètement défini.",
      answer:
        "Vous pouvez nous présenter le besoin, les usages envisagés et les contraintes déjà connues. Ces éléments serviront de base à l’échange.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Quelle différence entre une réalisation et un MVP ?",
      answer:
        "Une réalisation est un site ou un espace de gestion mené avec l’équipe ChapeChape Résidence. Un MVP est une première version du produit, avant son évolution.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Comment découvrir les aperçus d’APA et d’OVPR ?",
      answer:
        "Les visuels d’APA et d’OVPR sont présentés dans la section Innovations & MVP. Pour en savoir plus, présentez-nous votre demande avec le formulaire ci-dessus.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Où retrouver votre méthode de travail ?",
      answer: "Notre méthode de travail est présentée sur la page Expertise, du cadrage au suivi.",
      link: { label: "Découvrir notre expertise", href: prjLinks.expertise },
    },
  ],
};