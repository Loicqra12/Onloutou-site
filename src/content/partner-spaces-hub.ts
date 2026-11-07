/* Espaces futurs et candidature livreur — contenu de la refonte (textes repris des 3 écrans Figma).
   Marqueur « rédigée » : texte absent des maquettes, écrit ici, à valider.
   Les données du tableau de bord partenaire sont fictives, exactement celles de la maquette. */

import { whatsappUrlForMessage } from "@/content/contact-page";
import type { PtnIconName, PtnImageId } from "@/content/partners-hub";
import type { PtnFaqContent } from "@/content/partners-subpages";

type Cta = { label: string; href: string };

/* ------------------------------------------------------------ Espace livreur */

export const ptnEslHero = {
  eyebrow: "ESPACE LIVREUR",
  badge: "EN PRÉPARATION",
  titleLines: ["Un futur espace", "pensé pour", "le terrain."],
  lead: "Une interface mobile envisagée pour réunir votre profil, vos disponibilités et les informations utiles à vos échanges.",
  primary: { label: "Découvrir l’aperçu", href: "#apercu-espace-livreur" } satisfies Cta,
  secondary: { label: "Présenter mon profil", href: "/devenir-livreur#candidature-livreur" } satisfies Cta,
  note: "Sans connexion, sans mission ni position réelle.",
  image: { id: "eslPhone" as PtnImageId, alt: "Main tenant un smartphone affichant l’aperçu conceptuel de l’espace livreur ONLOUTOU" },
  caption: "Interface conceptuelle",
};

export const ptnEslFeatures = {
  id: "apercu-espace-livreur",
  eyebrow: "FONCTIONS ENVISAGÉES",
  title: "L’essentiel, à portée de main.",
  items: [
    { icon: "user" as PtnIconName, title: "Profil & moyens", text: "Présenter votre expérience et votre véhicule." },
    { icon: "calendar" as PtnIconName, title: "Disponibilités", text: "Préciser les périodes et zones envisagées." },
    { icon: "phone" as PtnIconName, title: "Informations de mission", text: "Consulter les éléments utiles si une mission est confirmée." },
    { icon: "chat" as PtnIconName, title: "Échanges & assistance", text: "Retrouver les informations de contact et d’accompagnement." },
  ],
};

export const ptnEslUsage = {
  title: "Une interface adaptée aux usages du terrain.",
  caption: "Photo d’illustration",
  image: { id: "eslPhoto" as PtnImageId, alt: "Livreur à scooter consultant son smartphone devant un panneau ONLOUTOU" },
  items: [
    { icon: "eye" as PtnIconName, title: "Des informations lisibles", text: "Les détails utiles au premier regard." },
    { icon: "phone" as PtnIconName, title: "Des actions simples", text: "Un parcours pensé pour le téléphone." },
    { icon: "checklist" as PtnIconName, title: "Un statut clair", text: "Distinguer ce qui est prévu, à confirmer ou terminé." },
  ],
};

export const ptnEslNotice = "Le contenu, les fonctionnalités et les conditions d’accès restent à préciser avant l’ouverture.";

export const ptnEslCta = {
  title: "Vous pouvez déjà présenter votre profil.",
  lead: "Indépendant ou entreprise, partagez votre expérience, votre zone et vos moyens de transport.",
  primary: { label: "Devenir livreur partenaire", href: "/devenir-livreur#candidature-livreur" } satisfies Cta,
  secondary: { label: "J’ai un besoin de livraison", href: "/livraison#demande-livraison" } satisfies Cta,
};

export const ptnEslFaq: PtnFaqContent = {
  eyebrow: "QUESTIONS FRÉQUENTES",
  title: "Questions fréquentes",
  titleHidden: true,
  items: [
    {
      question: "Puis-je me connecter aujourd’hui ?",
      answer: "Non. Cet écran présente uniquement le concept du futur espace livreur.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Les missions présentées sont-elles réelles ?",
      answer:
        "Non. Les écrans présentés sont conceptuels : aucune mission, aucune position et aucune donnée réelle n’est affichée.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Comment manifester mon intérêt ?",
      answer:
        "Utilisez « Devenir livreur partenaire » pour présenter votre profil, votre zone et vos moyens de transport. Cela ne constitue pas une inscription ni une promesse de mission.",
    },
  ],
};

/* --------------------------------------------------------- Espace partenaire */

export const ptnEspHero = {
  eyebrow: "FUTUR ESPACE PARTENAIRE",
  badge: "EN PRÉPARATION",
  titleLines: ["Vos offres et vos", "échanges, dans un", "même espace."],
  lead: "Une interface envisagée pour organiser votre profil, vos équipements et vos collaborations.",
  primary: { label: "Découvrir l’aperçu", href: "#apercu-espace-partenaire" } satisfies Cta,
  secondary: { label: "Présenter mon organisation", href: "/devenir-partenaire#preparer-proposition" } satisfies Cta,
  note: "Présentation conceptuelle : aucune connexion ni donnée réelle.",
  image: { id: "espHero" as PtnImageId, alt: "Technicien de chantier en gilet jaune consultant une tablette devant une excavatrice" },
};

/** Maquette du tableau de bord : données fictives, exactement celles de l'écran Figma. */
export const ptnEspDashboard = {
  id: "apercu-espace-partenaire",
  label: "Aperçu conceptuel de l’espace partenaire, données fictives",
  bar: "APERÇU CONCEPTUEL — DONNÉES FICTIVES",
  brand: "ESPACE PARTENAIRE",
  nav: [
    { icon: "home" as PtnIconName, label: "Vue d’ensemble", active: true },
    { icon: "user" as PtnIconName, label: "Profil", active: false },
    { icon: "truck" as PtnIconName, label: "Équipements", active: false },
    { icon: "checklist" as PtnIconName, label: "Demandes", active: false },
    { icon: "doc" as PtnIconName, label: "Documents", active: false },
    { icon: "headset" as PtnIconName, label: "Assistance", active: false },
  ],
  title: "Vue d’ensemble",
  lead: "Retrouvez ici un aperçu des principales informations de votre espace partenaire.",
  cards: [
    { icon: "building" as PtnIconName, title: "Profil de l’organisation", text: "Informations générales et présentation.", chip: "À compléter" },
    { icon: "truck" as PtnIconName, title: "Offres proposées", text: "Vos équipements et services.", chip: "Exemples" },
    { icon: "chat" as PtnIconName, title: "Échanges", text: "Messages et demandes de collaboration.", chip: "Aperçu" },
  ],
  equipment: {
    title: "Exemples de fiches équipement",
    link: "Voir tous les équipements",
    headers: ["Équipement", "Disponibilité", "Zone"],
    rows: [
      { name: "Utilitaire", image: "dlUtilitaire" as PtnImageId, availability: "À renseigner", zone: "À préciser" },
      { name: "Groupe électrogène", image: "supExemple" as PtnImageId, availability: "À renseigner", zone: "À préciser" },
      { name: "Outillage", image: "supOutils" as PtnImageId, availability: "À renseigner", zone: "À préciser" },
    ],
  },
  todo: {
    title: "À préparer",
    lead: "Quelques éléments qui pourraient être nécessaires pour compléter votre espace.",
    items: [
      { icon: "doc" as PtnIconName, title: "Votre présentation", text: "Décrivez votre organisation et vos activités." },
      { icon: "gear" as PtnIconName, title: "Vos capacités", text: "Indiquez les équipements et services proposés." },
      { icon: "user" as PtnIconName, title: "Un contact", text: "Renseignez un interlocuteur pour les échanges." },
    ],
  },
};

export const ptnEspFeatures = {
  eyebrow: "FONCTIONNALITÉS ENVISAGÉES",
  title: "Ce que cet espace pourrait réunir.",
  items: [
    { icon: "building" as PtnIconName, title: "Profil de l’organisation", text: "Un espace pour présenter votre structure, vos activités et vos zones d’intervention." },
    { icon: "gear" as PtnIconName, title: "Fiches équipements", text: "La possibilité de décrire vos équipements et les services associés." },
    { icon: "chat" as PtnIconName, title: "Suivi des demandes", text: "Un espace pour consulter et suivre les échanges avec l’équipe ONLOUTOU." },
    { icon: "doc" as PtnIconName, title: "Documents utiles", text: "Un espace pour partager les documents qui pourraient être nécessaires." },
    { icon: "sliders" as PtnIconName, title: "Accès et paramètres", text: "Des réglages pour gérer les informations et les personnes de votre organisation." },
    { icon: "headset" as PtnIconName, title: "Assistance", text: "Un appui pour répondre à vos questions et vous accompagner dans l’utilisation de l’espace." },
  ],
};

export const ptnEspNotice = "Les fonctionnalités et les conditions d’accès seront précisées avant l’ouverture.";

export const ptnEspContact = {
  eyebrow: "RESTONS EN CONTACT",
  title: "En attendant, restons en contact.",
  cards: [
    {
      id: "partenaire",
      title: "Je souhaite devenir partenaire",
      text: "Présentez votre activité et les capacités que vous proposez.",
      image: { id: "espEchange" as PtnImageId, alt: "Deux professionnels échangeant autour d’une tablette" },
      cta: { label: "Préparer ma proposition", href: "/devenir-partenaire#preparer-proposition" } satisfies Cta,
      variant: "yellow" as const,
    },
    {
      id: "echange",
      title: "Je suis déjà en échange avec ONLOUTOU",
      text: "Contactez votre interlocuteur pour faire le point sur les prochaines étapes.",
      image: { id: "espAppel" as PtnImageId, alt: "Coordinateur de projet au téléphone devant un ordinateur portable" },
      cta: { label: "Contacter ONLOUTOU", href: "/contact" } satisfies Cta,
      variant: "outline" as const,
    },
  ],
};

export const ptnEspFaq: PtnFaqContent = {
  eyebrow: "QUESTIONS FRÉQUENTES",
  title: "Questions fréquentes",
  titleHidden: true,
  items: [
    {
      question: "Puis-je me connecter aujourd’hui ?",
      answer: "Non. Cette page présente un aperçu du futur espace partenaire.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Les données de l’aperçu sont-elles réelles ?",
      answer: "Non. Les informations de l’aperçu sont fictives et servent uniquement à illustrer le concept.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Quand les modalités d’accès seront-elles connues ?",
      answer:
        "Les fonctionnalités et les conditions d’accès seront précisées avant l’ouverture. Aucune date n’est annoncée pour le moment.",
    },
  ],
};

/* ------------------------------------------------------------ Devenir livreur */

export type PtnDlProfileId = "independant" | "entreprise";
export type PtnDlVehicleId = "moto" | "voiture" | "utilitaire" | "camion" | "plusieurs";

export const ptnDlHero = {
  badge: "DEVENIR LIVREUR PARTENAIRE",
  titleLines: ["Votre expérience", "du terrain mérite", "d’être connue."],
  lead: "Indépendant ou entreprise, présentez votre zone, votre expérience et les moyens de transport que vous pouvez mobiliser.",
  cta: { label: "Présenter mon profil", href: "#candidature-livreur" } satisfies Cta,
  note: "Une manifestation d’intérêt, sans mission ni revenu garanti.",
  image: { id: "dlHero" as PtnImageId, alt: "Livreuse casquée à scooter devant une camionnette que charge un livreur ONLOUTOU" },
};

export const ptnDlProfiles: { id: PtnDlProfileId; icon: PtnIconName; title: string; text: string; label: string }[] = [
  {
    id: "independant",
    icon: "user",
    title: "Je suis indépendant",
    text: "Votre expérience, vos disponibilités et votre moyen de transport.",
    label: "Indépendant",
  },
  {
    id: "entreprise",
    icon: "users",
    title: "Je représente une entreprise",
    text: "Votre organisation, votre flotte et vos zones d’intervention.",
    label: "Entreprise",
  },
];

export const ptnDlVehicles: { id: PtnDlVehicleId; label: string; image: PtnImageId; scene: string; alt: string }[] = [
  { id: "moto", label: "Moto", image: "dlMoto", scene: "road", alt: "Motocycliste professionnel sur une moto utilitaire noire" },
  { id: "voiture", label: "Voiture", image: "dlVoiture", scene: "road", alt: "Berline blanche moderne" },
  { id: "utilitaire", label: "Utilitaire", image: "dlUtilitaire", scene: "road", alt: "Fourgon utilitaire blanc" },
  { id: "camion", label: "Camion", image: "dlCamion", scene: "road", alt: "Camion utilitaire blanc" },
  { id: "plusieurs", label: "Plusieurs véhicules", image: "dlPlusieurs", scene: "road", alt: "Flotte de trois véhicules professionnels" },
];

export const ptnDlVehiclesIntro = {
  title: "Quel moyen pouvez-vous mobiliser ?",
  lead: "Sélectionnez le ou les moyens de transport que vous pouvez mettre à disposition.",
  note: "L’adéquation du moyen de transport dépendra du besoin et des vérifications.",
};

export const ptnDlForm = {
  id: "candidature-livreur",
  title: "Préparons votre présentation.",
  lead: "Renseignez les informations ci-dessous pour nous permettre d’étudier votre profil.",
  profileLegend: "Votre profil",
  name: { label: "Nom ou organisation", placeholder: "Votre nom ou le nom de votre organisation" },
  channel: { label: "Téléphone ou e-mail", placeholder: "Téléphone ou e-mail" },
  zone: { label: "Zone d’intervention", placeholder: "Ville, communes ou zones desservies" },
  transport: { label: "Moyen de transport", placeholder: "À préciser" },
  availability: { label: "Disponibilités", placeholder: "Vos créneaux habituels de disponibilité (ex. : en semaine, week-end...)" },
  experience: { label: "Expérience", placeholder: "Décrivez brièvement votre expérience dans le transport ou la livraison." },
  requiredSr: "Les champs marqués d’un astérisque sont obligatoires.", // rédigée
  submit: "Enregistrer mon intérêt",
  submitNote: "Relisez votre message avant de poursuivre sur WhatsApp.",
  error: "Merci de renseigner les champs obligatoires.", // rédigée
  panel: {
    title: "Les points à préciser",
    lead: "Ces informations nous aident à mieux comprendre votre profil et vos possibilités.",
    items: [
      { icon: "pin" as PtnIconName, title: "Votre zone habituelle", text: "Les villes, communes ou zones où vous pouvez intervenir." },
      { icon: "truck" as PtnIconName, title: "Le moyen réellement disponible", text: "Le type de véhicule que vous pouvez mettre à disposition." },
      { icon: "doc" as PtnIconName, title: "Votre expérience du transport", text: "Vos réalisations et votre connaissance du terrain." },
    ],
    note: "Les documents et conditions utiles seront précisés lors des échanges.",
  },
};

export type PtnDlValues = {
  profile: PtnDlProfileId | "";
  name: string;
  channel: string;
  zone: string;
  transport: string;
  availability: string;
  experience: string;
};

/** Message WhatsApp (gabarit rédigé, absent des maquettes) : à valider. */
export function buildPtnDlMessage(values: PtnDlValues): string {
  const lines: string[] = [];
  const add = (label: string, value: string) => {
    const v = value.trim();
    if (v) lines.push(`${label} : ${v}`);
  };
  add("Profil", ptnDlProfiles.find((item) => item.id === values.profile)?.label ?? "");
  add("Nom ou organisation", values.name);
  add("Téléphone ou e-mail", values.channel);
  add("Zone d’intervention", values.zone);
  add("Moyen de transport", values.transport);
  add("Disponibilités", values.availability);
  add("Expérience", values.experience);
  if (lines.length === 0) return "";
  return [
    "Bonjour ONLOUTOU, je souhaite présenter mon profil de livreur partenaire.",
    ...lines,
    "Une manifestation d’intérêt, sans mission ni revenu garanti.",
  ].join("\n");
}

export function buildPtnDlWhatsAppUrl(values: PtnDlValues): string {
  return whatsappUrlForMessage(buildPtnDlMessage(values));
}

export const ptnDlAfter = {
  title: "Et ensuite ?",
  lead: "Voici les principales étapes après l’envoi de votre profil.",
  steps: [
    { number: "01", icon: "doc" as PtnIconName, title: "Étude du profil", text: "Nous prenons connaissance des informations transmises." },
    { number: "02", icon: "chat" as PtnIconName, title: "Échange selon les besoins", text: "Nous revenons vers vous si votre profil correspond à des besoins." },
    { number: "03", icon: "users" as PtnIconName, title: "Modalités à définir", text: "Les modalités de collaboration seront discutées ensemble, selon la nature des besoins." },
  ],
};

export const ptnDlFaq: PtnFaqContent = {
  eyebrow: "QUESTIONS FRÉQUENTES",
  title: "Des questions sur la démarche ?",
  items: [
    {
      // rédigée (absente de la maquette)
      question: "L’envoi de mon profil garantit-il des missions ?",
      answer:
        "Non. Il s’agit d’une manifestation d’intérêt, sans mission ni revenu garanti. Nous revenons vers vous si votre profil correspond à des besoins.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Puis-je présenter plusieurs véhicules ?",
      answer:
        "Oui. Sélectionnez les moyens de transport que vous pouvez mettre à disposition, ou choisissez « Plusieurs véhicules ». Vous pourrez préciser le détail lors de l’échange.",
    },
    {
      // rédigée (absente de la maquette)
      question: "L’espace livreur est-il ouvert ?",
      answer:
        "Pas encore. L’espace livreur est en préparation : vous pouvez dès maintenant présenter votre profil et découvrir l’aperçu conceptuel.",
    },
  ],
};

export const ptnDlBand = {
  title: "Un futur espace pour organiser vos échanges.",
  badge: "EN PRÉPARATION",
  lead: "Nous travaillons sur un espace dédié aux livreurs partenaires.",
  cta: { label: "Découvrir l’aperçu", href: "/espace-livreur#apercu-espace-livreur" } satisfies Cta,
  note: "Sans connexion ni données réelles.",
};