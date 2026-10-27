import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

export type DeliveryServiceStatus = "preparation" | "pilot" | "available";

/** Preuve : partners-page (« prépare un réseau »), FAQ espace livreur non ouvert, méga-menu « non ouvert au public ». */
export const deliveryServiceStatus: DeliveryServiceStatus = "preparation";

const menuBase = "/assets/images/menu";
const projectA = "/assets/images/projects/project-a";

export const deliveryPageMedia = {
  hero: {
    src: `${menuBase}/mega-menu-partenaires-livreurs.png`,
    alt: "Coordination logistique : responsable et livreuse près d’un scooter et de colis",
    width: 1586,
    height: 992,
    objectPosition: "60% 52%",
  },
  logisticsWarehouse: {
    src: `${projectA}/gestion-equipements-entrepot.png`,
    alt: "Opératrice organisant des équipements en entrepôt avant une opération",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  mobilityCourtyard: {
    src: `${projectA}/mobilite-professionnelle-cour-logistique.png`,
    alt: "Utilitaire, berline et scooter dans une cour logistique professionnelle",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  urbanCoordination: {
    src: `${menuBase}/Coordination logistique urbaine à Abidjan-1.png`,
    alt: "Coordinateur et livreur préparant une opération de livraison urbaine",
    width: 1586,
    height: 992,
    objectPosition: "55% 45%",
  },
};

export const deliveryJourneyLine = [
  "Demande",
  "Qualification",
  "Affectation",
  "Collecte",
  "Acheminement",
  "Confirmation",
] as const;

export const deliveryBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Livraison" },
];

function statusCopy() {
  if (deliveryServiceStatus === "available") {
    return {
      eyebrow: "LIVRAISON · COORDINATION LOGISTIQUE",
      intro:
        "ONLOUTOU coordonne des besoins de livraison et de logistique en tenant compte du type de bien, du trajet, des contraintes et du moyen de transport à mobiliser.",
      primaryCta: { label: "Demander une livraison", href: "#demande-livraison" },
      secondaryCta: { label: "Devenir livreur partenaire", href: "/devenir-livreur" },
      seoTitle: "Livraison et coordination logistique en Côte d’Ivoire",
    };
  }
  if (deliveryServiceStatus === "pilot") {
    return {
      eyebrow: "LIVRAISON · PHASE PILOTE",
      intro:
        "ONLOUTOU structure une approche de livraison et de coordination logistique reliant les besoins, les équipements, les partenaires et les opérations terrain.",
      primaryCta: { label: "Présenter mon besoin", href: "#demande-livraison" },
      secondaryCta: { label: "Rejoindre le réseau de livreurs", href: "/devenir-livreur" },
      seoTitle: "Livraison et coordination logistique — phase pilote",
    };
  }
  return {
    eyebrow: "LIVRAISON · SERVICE EN PRÉPARATION",
    intro:
      "ONLOUTOU structure une approche de livraison et de coordination logistique reliant les besoins, les équipements, les partenaires et les opérations terrain.",
    primaryCta: { label: "Présenter mon besoin", href: "#demande-livraison" },
    secondaryCta: { label: "Rejoindre le réseau de livreurs", href: "/devenir-livreur" },
    seoTitle: "Livraison et coordination logistique en préparation",
  };
}

const copy = statusCopy();

export const deliveryPageSeo = {
  title: copy.seoTitle,
  description:
    "Découvrez l’approche ONLOUTOU pour qualifier les besoins de livraison, coordonner les moyens logistiques et développer un réseau de partenaires terrain.",
};

export const deliveryHero = {
  eyebrow: copy.eyebrow,
  titleBefore: "Du besoin terrain jusqu’à ",
  titleHighlight: "la bonne destination.",
  intro: copy.intro,
  primaryCta: copy.primaryCta,
  secondaryCta: copy.secondaryCta,
  cartouche: ["Bien à transporter", "Départ", "Destination", "Contraintes", "Moyen adapté"],
  routeDisclaimer: "Parcours illustratif — disponibilité à confirmer",
};

export const deliveryAudiencePaths = {
  client: {
    title: "J’ai un besoin de livraison",
    lead: "Décrivez ce qui doit être transporté, le point de départ, la destination et les contraintes particulières.",
    cta: { label: "Qualifier ma demande", href: "#demande-livraison" },
  },
  driver: {
    title: "Je souhaite livrer",
    lead: "Présentez votre profil, votre zone d’intervention et le moyen de transport que vous pouvez mobiliser.",
    cta: { label: "Présenter mon profil", href: "/devenir-livreur" },
  },
};

export const deliveryNeedsSection = {
  title: "Chaque livraison commence par une contrainte réelle.",
  categories: [
    {
      title: "Équipements et matériels",
      items: ["outils", "matériels professionnels", "petits équipements", "accessoires", "pièces ou éléments nécessaires à une intervention"],
    },
    {
      title: "Produits et marchandises",
      items: [
        "colis professionnels",
        "produits conditionnés",
        "commandes ou approvisionnements",
        "marchandises compatibles avec le dispositif proposé",
      ],
    },
    {
      title: "Mobilité opérationnelle",
      items: [
        "liaison entre plusieurs sites",
        "récupération de matériel",
        "acheminement vers une équipe terrain",
        "transfert planifié",
      ],
    },
    {
      title: "Projets spécifiques",
      items: [
        "opérations multi-étapes",
        "besoins récurrents",
        "coordination avec plusieurs intervenants",
        "contraintes particulières à étudier",
      ],
    },
  ],
  notice:
    "La prise en charge dépend de la nature du bien, de ses dimensions, de son poids, de son conditionnement, du trajet, des moyens disponibles et des conditions convenues.",
  exclusions:
    "Marchandises dangereuses, transport médical, espèces, documents confidentiels, produits illégaux, personnes, animaux, denrées sensibles et biens sans emballage adapté ne sont pas acceptés implicitement et doivent faire l’objet d’une étude spécifique.",
};

export const deliveryProcess = {
  id: "fonctionnement-livraison",
  title: "Un parcours clair avant le départ.",
  steps: [
    {
      number: "01",
      title: "Décrire",
      items: ["le bien", "le volume indicatif", "le départ", "la destination", "le calendrier", "les contraintes"],
    },
    {
      number: "02",
      title: "Qualifier",
      items: ["la faisabilité", "le conditionnement", "l’accessibilité", "le type de transport", "les restrictions éventuelles"],
    },
    {
      number: "03",
      title: "Proposer",
      items: ["le trajet", "le moyen disponible", "le partenaire mobilisable", "le périmètre du service"],
    },
    {
      number: "04",
      title: "Confirmer",
      items: ["les coordonnées utiles", "les conditions", "le montant si applicable", "le créneau", "les responsabilités"],
    },
    {
      number: "05",
      title: "Acheminer",
      items: ["réaliser la mission selon les conditions convenues", "sans promesse de suivi en direct non confirmé"],
    },
    {
      number: "06",
      title: "Clôturer",
      items: ["confirmer la remise ou signaler un incident selon le processus applicable"],
    },
  ],
};

export const deliveryLogisticsSection = {
  title: "La livraison se prépare avant de rouler.",
  checks: [
    "identifier correctement le bien",
    "prévoir un conditionnement adapté",
    "vérifier les accès",
    "choisir un moyen de transport cohérent",
    "clarifier la remise à destination",
  ],
  panel:
    "Les dimensions, le poids, la fragilité, la valeur déclarée et les conditions de manipulation doivent être communiqués avant toute confirmation.",
};

export type DeliveryTransportId = "two-wheel" | "light" | "utility" | "truck" | "special";

export const deliveryTransportOptions = {
  title: "Quel moyen pour quel besoin ?",
  tag: "Option à étudier",
  items: [
    {
      id: "two-wheel" as DeliveryTransportId,
      label: "deux-roues",
      studiedFor: [
        "petits colis",
        "trajets urbains",
        "biens compatibles avec un transport sécurisé sur deux-roues",
      ],
      note: "Qualification nécessaire",
    },
    {
      id: "light" as DeliveryTransportId,
      label: "véhicule léger",
      studiedFor: [
        "colis ou matériels de taille modérée",
        "besoins nécessitant davantage de protection",
        "trajets urbains ou interurbains selon faisabilité",
      ],
      note: "Compatibilité à confirmer",
    },
    {
      id: "utility" as DeliveryTransportId,
      label: "utilitaire",
      studiedFor: [
        "volumes plus importants",
        "équipements professionnels",
        "opérations nécessitant un espace de chargement dédié",
      ],
      note: "Option à étudier",
    },
    {
      id: "truck" as DeliveryTransportId,
      label: "camion",
      studiedFor: [
        "charges ou volumes nécessitant un véhicule adapté",
        "besoins logistiques professionnels",
        "opérations à qualifier spécifiquement",
      ],
      note: "Qualification nécessaire",
    },
    {
      id: "special" as DeliveryTransportId,
      label: "moyen spécialisé",
      studiedFor: [],
      specialText:
        "Certains biens exigent des conditions particulières de manutention, de fixation, de température ou de sécurité. Ils doivent faire l’objet d’une étude dédiée.",
      note: "Étude dédiée",
    },
  ],
};

export const deliveryDigitalSection = {
  title: "Une coordination qui peut évoluer avec les outils numériques.",
  availableToday: [
    "prise de contact et qualification par WhatsApp ou téléphone",
    "structuration d’une demande ou d’un profil livreur",
    "orientation vers les pages partenaires et solutions existantes",
  ],
  plannedOrStudy: [
    "création d’une demande structurée en ligne",
    "attribution et statut d’opération",
    "partage d’informations en temps réel",
    "preuve de remise numérique",
    "historique et notifications",
    "intégration avec d’autres plateformes",
  ],
  notice:
    "L’expérience numérique de livraison est en cours de structuration. Les fonctions finales dépendront du périmètre retenu et des besoins validés.",
  platformLink: { label: "Plateformes sur mesure", href: "/solutions/plateformes-sur-mesure" },
};

export const deliverySafetySection = {
  title: "Des informations claires avant chaque opération.",
  items: [
    "identité des interlocuteurs",
    "nature du bien",
    "conditionnement",
    "état apparent",
    "point de collecte",
    "point de remise",
    "accessibilité",
    "restrictions",
    "moyen de transport",
    "modalités financières",
    "responsabilités",
    "procédure en cas d’incident",
  ],
  notice:
    "Les conditions de prise en charge, de transport, de remise, de responsabilité et d’indemnisation doivent être précisées avant l’exécution de toute mission.",
};

export const deliveryRequestSection = {
  id: "demande-livraison",
  title: "Préparez votre besoin de livraison.",
};

export const deliveryDriverTeaser = {
  id: "devenir-livreur",
  eyebrow: "RÉSEAU DE LIVRAISON",
  title: "Vous disposez d’un moyen de transport et d’une expérience terrain ?",
  lead:
    "La page dédiée vous permet de présenter votre profil, vos zones et votre moyen de transport pour de futures possibilités de collaboration.",
  disclaimers: [
    "une validation",
    "une mission",
    "un revenu",
    "une fréquence de travail",
    "un contrat",
    "une exclusivité",
  ],
  legalNotice:
    "Une manifestation d’intérêt ne constitue pas une promesse de mission ou de collaboration.",
  primaryCta: { label: "Présenter mon profil", href: "/devenir-livreur#candidature-livreur" },
  secondaryCta: { label: "Voir la page livreur partenaire", href: "/devenir-livreur" },
  portalLink: { label: "Aperçu de l’espace livreur", href: "/espace-livreur" },
};

export function buildDriverInterestWhatsAppMessage(fields: {
  name: string;
  phone: string;
  city: string;
  zones: string;
  transport: string;
  documents: string;
  experience: string;
  availability: string;
  missionTypes: string;
  details: string;
}) {
  return [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite présenter mon profil pour de futures missions de livraison ou de logistique.",
    "",
    `Nom ou structure : ${fields.name || "—"}`,
    `Téléphone : ${fields.phone || "—"}`,
    `Ville / commune : ${fields.city || "—"}`,
    `Zones d’intervention : ${fields.zones || "—"}`,
    `Moyen de transport : ${fields.transport || "—"}`,
    `Documents disponibles : ${fields.documents || "—"}`,
    `Expérience : ${fields.experience || "—"}`,
    `Disponibilité indicative : ${fields.availability || "—"}`,
    `Types de missions recherchées : ${fields.missionTypes || "—"}`,
    `Précisions : ${fields.details || "—"}`,
  ].join("\n");
}

export function buildDriverInterestWhatsAppUrl(fields: Parameters<typeof buildDriverInterestWhatsAppMessage>[0]) {
  return whatsappUrlForMessage(buildDriverInterestWhatsAppMessage(fields));
}

export const deliveryRequestOptions = {
  goods: [
    { id: "small", label: "petit colis" },
    { id: "product", label: "produit" },
    { id: "equipment", label: "équipement" },
    { id: "pro", label: "matériel professionnel" },
    { id: "goods", label: "marchandise" },
    { id: "other", label: "autre" },
  ],
  constraints: [
    { id: "fragile", label: "fragile" },
    { id: "bulky", label: "volumineux" },
    { id: "heavy", label: "lourd" },
    { id: "value", label: "valeur particulière à déclarer" },
    { id: "handling", label: "manutention nécessaire" },
    { id: "access", label: "accès difficile" },
    { id: "other", label: "autre" },
    { id: "none", label: "aucune information particulière" },
  ],
  vehicles: [
    { id: "2w", label: "deux-roues" },
    { id: "light", label: "véhicule léger" },
    { id: "utility", label: "utilitaire" },
    { id: "truck", label: "camion" },
    { id: "tbd", label: "à déterminer" },
  ],
  recurrence: [
    { id: "once", label: "ponctuel" },
    { id: "regular", label: "régulier" },
    { id: "multi", label: "projet à plusieurs étapes" },
    { id: "tbd", label: "à déterminer" },
  ],
};

export function buildDeliveryRequestWhatsAppMessage(fields: {
  goodsLabel: string;
  description: string;
  quantity: string;
  dimensions: string;
  origin: string;
  destination: string;
  schedule: string;
  constraintsLabels: string;
  vehicleLabel: string;
  recurrenceLabel: string;
  details: string;
}) {
  const line = (label: string, value: string) => `${label} : ${value?.trim() ? value.trim() : "—"}`;
  return [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite présenter un besoin de livraison.",
    "",
    line("Nature du bien", fields.goodsLabel),
    line("Description", fields.description),
    line("Quantité indicative", fields.quantity),
    line("Dimensions ou poids connus", fields.dimensions),
    line("Point de départ", fields.origin),
    line("Destination", fields.destination),
    line("Date ou période souhaitée", fields.schedule),
    line("Contraintes", fields.constraintsLabels),
    line("Moyen envisagé", fields.vehicleLabel),
    line("Fréquence", fields.recurrenceLabel),
    line("Précisions", fields.details),
  ].join("\n");
}

export function buildDeliveryRequestWhatsAppUrl(fields: Parameters<typeof buildDeliveryRequestWhatsAppMessage>[0]) {
  return whatsappUrlForMessage(buildDeliveryRequestWhatsAppMessage(fields));
}

export const deliveryTransparency = {
  title: "Ce qui doit être confirmé avant une mission.",
  items: [
    "faisabilité",
    "disponibilité",
    "zone",
    "moyen de transport",
    "conditionnement",
    "manutention",
    "calendrier",
    "prix",
    "taxes",
    "modalités de paiement",
    "responsabilités",
    "preuve de remise",
    "procédure en cas d’incident",
    "éventuelles exclusions",
  ],
  note:
    "Aucune mission, disponibilité, couverture, durée ou condition tarifaire n’est considérée comme confirmée avant validation explicite des parties.",
};

function faqForStatus(): ServiceFaqItem[] {
  const availabilityAnswer =
    deliveryServiceStatus === "available"
      ? "Des missions peuvent être étudiées selon la zone, le bien et les moyens mobilisables. Chaque demande reste à confirmer."
      : deliveryServiceStatus === "pilot"
        ? "Une phase pilote peut être étudiée sur certains besoins. La disponibilité dépend du périmètre et des partenaires mobilisables."
        : "Le service est en préparation. Vous pouvez déjà présenter un besoin ou un profil livreur pour être recontacté selon l’avancement du projet.";

  return [
    { question: "Le service de livraison est-il déjà disponible ?", answer: availabilityAnswer },
    {
      question: "Quelles zones peuvent être couvertes ?",
      answer:
        "La faisabilité et la zone doivent être confirmées pour chaque besoin selon les moyens mobilisables et les conditions de l’opération.",
    },
    {
      question: "Quels types de biens peuvent être transportés ?",
      answer:
        "Les catégories présentées sur cette page peuvent être étudiées. Nature, conditionnement, restrictions et légalité doivent être vérifiés avant confirmation.",
    },
    {
      question: "Comment connaître le prix ?",
      answer: "Un montant n’est communiqué qu’après qualification du bien, du trajet, du moyen et des conditions convenues.",
    },
    {
      question: "Peut-on programmer des livraisons récurrentes ?",
      answer: "Un besoin récurrent peut être étudié. Fréquence, zone et faisabilité doivent être confirmées.",
    },
    {
      question: "Peut-on suivre une livraison ?",
      answer:
        "Un suivi détaillé ou en temps réel n’est proposé que si le dispositif retenu le prévoit explicitement — à confirmer pour chaque mission.",
    },
    {
      question: "Comment devenir livreur partenaire ?",
      answer:
        "Présentez votre profil sur la page Devenir livreur (/devenir-livreur). Aucun espace livreur autonome n’est ouvert pour le moment.",
    },
    {
      question: "L’envoi d’un profil garantit-il des missions ?",
      answer: "Non. Il s’agit d’une manifestation d’intérêt sans promesse de mission, de revenu ou de collaboration.",
    },
  ];
}

export const deliveryFaq = faqForStatus();

export const deliveryFinalCta = {
  title: "Un besoin, un trajet, des contraintes à clarifier.",
  lead:
    "Présentez votre opération à ONLOUTOU pour vérifier les possibilités de coordination, les moyens nécessaires et les prochaines étapes.",
  primary: { label: "Présenter mon besoin", href: "#demande-livraison" },
  secondary: { label: "Présenter mon profil de livreur", href: "/devenir-livreur" },
  contact: { label: "Contact", href: "/contact" },
};

export const deliveryRelatedLinks = {
  partnersHub: { label: "Découvrir les partenaires", href: "/partenaires" },
  becomePartner: { label: "Devenir partenaire", href: "/devenir-partenaire" },
  deliveryHub: { label: "Page livraison", href: "/livraison" },
};

export function deliveryBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Livraison", item: `${baseUrl}/livraison` },
    ],
  };
}

export function deliveryServiceJsonLd(baseUrl: string) {
  if (deliveryServiceStatus === "preparation") {
    return null;
  }
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Coordination logistique et livraison",
    provider: { "@type": "Organization", name: "ONLOUTOU", url: baseUrl },
    areaServed: "Côte d’Ivoire",
    description: deliveryPageSeo.description,
    url: `${baseUrl}/livraison`,
  };
}
