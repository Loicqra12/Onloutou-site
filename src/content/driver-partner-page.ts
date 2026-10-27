import { whatsappUrlForMessage } from "@/content/contact-page";
import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export type DeliveryNetworkStatus = "preparation" | "pilot" | "applications-open" | "active";

/** Preuve : delivery-page, header « Espace livreur — non ouvert », partners-page réseau en préparation. */
export const deliveryNetworkStatus: DeliveryNetworkStatus = "preparation";

const menuBase = "/assets/images/menu";
const projectA = "/assets/images/projects/project-a";
const projectB = "/assets/images/projects/project-b";
const vehiclesBase = "/assets/images/equipment/vehicles";

export const driverPartnerMedia = {
  hero: {
    src: `${menuBase}/mega-menu-partenaires-livreurs.png`,
    alt: "Livreuse et responsable logistique près d’un scooter et de colis",
    width: 1586,
    height: 992,
    objectPosition: "58% 50%",
  },
  logisticsPrep: {
    src: `${projectA}/gestion-equipements-entrepot.png`,
    alt: "Préparation et organisation d’équipements en entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
  mobility: {
    src: `${projectA}/mobilite-professionnelle-cour-logistique.png`,
    alt: "Berline, utilitaire et scooter dans une cour logistique",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  fleet: {
    src: `${vehiclesBase}/Flotte professionnelle inspectée à Abidjan-2.png`,
    alt: "Diversité de véhicules professionnels sur un site",
    width: 1672,
    height: 941,
    objectPosition: "52% 48%",
  },
};

export const driverPartnerJourneyLine = [
  "Profil",
  "Qualification",
  "Vérification",
  "Préparation",
  "Collaboration éventuelle",
] as const;

function networkCopy() {
  if (deliveryNetworkStatus === "applications-open" || deliveryNetworkStatus === "active") {
    return {
      eyebrow: "LIVREURS PARTENAIRES · CANDIDATURES OUVERTES",
      introLead:
        "Les candidatures sont étudiées selon les besoins, les zones et les moyens de transport recherchés.",
      seoTitle: "Devenir livreur partenaire",
    };
  }
  return {
    eyebrow: "LIVREURS PARTENAIRES · RÉSEAU EN PRÉPARATION",
    introLead:
      "Présentez votre profil pour être informé des futures possibilités de collaboration.",
    seoTitle: "Réseau de livreurs en préparation",
  };
}

const net = networkCopy();

export const driverPartnerSeo = {
  title: net.seoTitle,
  description:
    "Présentez votre profil, vos zones d’intervention et votre moyen de transport pour de futures possibilités de livraison avec ONLOUTOU.",
};

export const driverPartnerBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Livraison", href: "/livraison" },
  { label: "Devenir livreur" },
];

export const driverPartnerHero = {
  eyebrow: net.eyebrow,
  titleBefore: "Votre expérience terrain peut ",
  titleHighlight: "faire avancer tout un réseau.",
  intro:
    "Présentez votre profil, votre zone d’intervention et le moyen de transport que vous pouvez mobiliser pour de futures possibilités de collaboration avec ONLOUTOU.",
  panelFields: ["Zone", "Moyen de transport", "Expérience", "Disponibilité", "Types de missions"],
  primaryCta: { label: "Présenter mon profil", href: "#candidature-livreur" },
  secondaryCta: { label: "Comprendre le parcours", href: "#parcours-livreur" },
  deliveryNeedLink: { label: "J’ai plutôt un besoin de livraison", href: "/livraison#demande-livraison" },
};

export const driverTransparencyBand = [
  "Candidature étudiée",
  "Documents vérifiés ultérieurement",
  "Missions selon les besoins",
  "Aucun revenu garanti",
] as const;

export const driverProfileTypesSection = {
  title: "Plusieurs profils, une même exigence de sérieux.",
  profiles: [
    {
      id: "independent",
      number: "01",
      title: "Livreur indépendant",
      description:
        "Pour une personne disposant d’un moyen de transport et souhaitant présenter son expérience et sa zone d’intervention.",
      prepare: ["identité et coordonnées", "zone habituelle", "moyen mobilisable", "disponibilité indicative"],
      verify: ["cohérence profil / besoin", "documents ultérieurement", "communication"],
      cta: { label: "Présenter mon profil", href: "#candidature-livreur" },
      image: driverPartnerMedia.mobility,
    },
    {
      id: "owner",
      number: "02",
      title: "Conducteur ou propriétaire de véhicule",
      description:
        "Pour une personne pouvant mobiliser une voiture, un utilitaire, un camion ou un autre moyen adapté.",
      prepare: ["type de véhicule", "propriété ou mise à disposition", "zones", "documents déclaratifs"],
      verify: ["adéquation véhicule / mission", "état général à confirmer", "contraintes d’accès"],
      cta: { label: "Présenter mon profil", href: "#candidature-livreur" },
      image: driverPartnerMedia.fleet,
    },
    {
      id: "company",
      number: "03",
      title: "Entreprise logistique",
      description:
        "Pour une structure disposant d’une organisation, de véhicules, de conducteurs et de capacités opérationnelles à présenter.",
      prepare: ["raison sociale", "flotte indicative", "zones couvertes", "coordination interne"],
      verify: ["capacité opérationnelle", "documents entreprise ultérieurement", "périmètre de mission"],
      cta: { label: "Présenter mon profil", href: "#candidature-livreur" },
      image: driverPartnerMedia.logisticsPrep,
    },
  ],
};

export type DriverVehicleId = "moto" | "car" | "utility" | "truck" | "fleet";

export const driverVehicleSection = {
  title: "Présentez le moyen que vous pouvez réellement mobiliser.",
  tag: "Qualification nécessaire — éligibilité non confirmée automatiquement",
  vehicles: [
    {
      id: "moto" as DriverVehicleId,
      label: "Moto",
      prepare: [
        "type de moto",
        "zone habituelle",
        "capacité à transporter un colis correctement sécurisé",
        "documents applicables",
        "disponibilité indicative",
      ],
    },
    {
      id: "car" as DriverVehicleId,
      label: "Voiture",
      prepare: [
        "type de véhicule",
        "état général",
        "espace disponible",
        "zone",
        "documents applicables",
      ],
    },
    {
      id: "utility" as DriverVehicleId,
      label: "Utilitaire",
      prepare: [
        "configuration",
        "volume indicatif",
        "accessibilité",
        "zones",
        "expérience logistique",
      ],
    },
    {
      id: "truck" as DriverVehicleId,
      label: "Camion",
      prepare: [
        "catégorie",
        "configuration",
        "usages habituels",
        "zones",
        "documents applicables",
        "contraintes d’accès",
      ],
    },
    {
      id: "fleet" as DriverVehicleId,
      label: "Plusieurs véhicules ou flotte",
      prepare: [
        "nombre indicatif",
        "catégories",
        "organisation",
        "conducteurs",
        "zones",
        "capacité de coordination",
      ],
    },
  ],
};

export const driverQualitiesSection = {
  title: "La qualité d’une livraison ne commence pas sur la route.",
  principles: [
    "comprendre les consignes",
    "vérifier le bien avant le départ",
    "protéger correctement ce qui est transporté",
    "communiquer en cas de difficulté",
    "respecter les conditions convenues",
    "confirmer correctement la remise",
  ],
  notice:
    "Les exigences précises peuvent varier selon le type de mission, le bien transporté, le moyen utilisé et les conditions définies avec les parties.",
  image: {
    src: `${projectB}/conducteur-routes-abidjan.png`,
    alt: "Conducteur sur route professionnelle à Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "50% 45%",
  },
};

export const driverCriteriaSection = {
  title: "Ce que nous chercherons à comprendre.",
  items: [
    "identité et coordonnées",
    "statut du profil",
    "ville et zones d’intervention",
    "moyen de transport",
    "expérience",
    "documents applicables",
    "disponibilité indicative",
    "types de missions acceptées",
    "capacité de communication",
    "contraintes particulières",
  ],
  notice:
    "La liste exacte des documents et vérifications dépendra du profil, du véhicule, du statut de la collaboration et des exigences applicables.",
};

export const driverPartnerProcess = {
  id: "parcours-livreur",
  title: "De la manifestation d’intérêt à une collaboration éventuelle.",
  notice:
    "La transmission d’un profil et le passage des premières étapes ne garantissent ni validation, ni mission, ni revenu.",
  phases: [
    { step: "01", title: "Présenter", description: "Le candidat transmet les informations générales sur son profil." },
    {
      step: "02",
      title: "Examiner",
      description: "ONLOUTOU examine la cohérence entre le profil et les besoins envisagés.",
    },
    {
      step: "03",
      title: "Échanger",
      description: "Un échange peut préciser zones, expérience, véhicule, disponibilité et attentes.",
    },
    {
      step: "04",
      title: "Vérifier",
      description: "Les documents et conditions applicables pourront être vérifiés dans une phase ultérieure.",
    },
    {
      step: "05",
      title: "Préparer",
      description: "Selon le dispositif retenu, les procédures, outils ou attentes peuvent être présentés.",
    },
    {
      step: "06",
      title: "Collaborer",
      description:
        "Une collaboration ou une mission peut être proposée si un besoin compatible existe et si les conditions sont acceptées.",
    },
  ] satisfies DeploymentPhase[],
};

export const driverSafetySection = {
  title: "La sécurité passe avant la rapidité.",
  items: [
    "véhicule adapté et entretenu",
    "respect des règles de circulation",
    "chargement correctement sécurisé",
    "pas d’utilisation dangereuse du téléphone",
    "signalement des incidents",
    "respect des personnes et des biens",
    "refus des marchandises interdites ou non déclarées",
  ],
  notice:
    "Les règles détaillées seront précisées dans les procédures ou documents applicables au dispositif effectivement mis en place.",
};

export const driverMissionTypesSection = {
  title: "Des besoins différents selon les opérations.",
  tag: "missions pouvant être étudiées — selon disponibilité et qualification",
  items: [
    "livraison urbaine",
    "récupération de matériel",
    "acheminement d’équipements",
    "transfert entre sites",
    "livraison professionnelle planifiée",
    "opération récurrente",
    "mission logistique spécifique",
  ],
};

export const driverCompensationSection = {
  title: "Les conditions doivent être connues avant d’accepter.",
  items: [
    "nature de la mission",
    "zone",
    "distance ou périmètre",
    "moyen nécessaire",
    "calendrier",
    "montant",
    "frais éventuels",
    "responsabilités",
    "modalités de paiement",
    "procédure en cas d’incident",
    "preuve de réalisation",
  ],
  notice:
    "Aucun tarif, revenu minimum, nombre de missions ou fréquence de paiement n’est garanti sur cette page. Les conditions applicables doivent être communiquées et acceptées avant chaque engagement.",
};

export const driverApplicationSection = {
  id: "candidature-livreur",
  title: "Présentez votre profil.",
};

export const driverFormOptions = {
  profileTypes: [
    { id: "independent", label: "livreur indépendant" },
    { id: "driver", label: "conducteur" },
    { id: "owner", label: "propriétaire de véhicule" },
    { id: "company", label: "entreprise logistique" },
    { id: "other", label: "autre" },
  ],
  transports: [
    { id: "moto", label: "moto" },
    { id: "car", label: "voiture" },
    { id: "utility", label: "utilitaire" },
    { id: "truck", label: "camion" },
    { id: "multi", label: "plusieurs véhicules" },
    { id: "other", label: "autre" },
  ],
  ownership: [
    { id: "personal", label: "personnel" },
    { id: "company", label: "appartenant à une structure" },
    { id: "provided", label: "mis à disposition" },
    { id: "other", label: "autre situation à préciser" },
  ],
  documents: [
    { id: "license", label: "permis applicable" },
    { id: "vehicle", label: "document du véhicule" },
    { id: "insurance", label: "assurance applicable" },
    { id: "id", label: "document d’identité" },
    { id: "company", label: "documents de l’entreprise" },
    { id: "tbd", label: "à vérifier" },
    { id: "na", label: "non applicable" },
  ],
  experience: [
    { id: "beginner", label: "débutant" },
    { id: "lt1", label: "moins d’un an" },
    { id: "1-3", label: "un à trois ans" },
    { id: "gt3", label: "plus de trois ans" },
    { id: "other", label: "expérience différente à expliquer" },
  ],
  availability: [
    { id: "occasional", label: "occasionnelle" },
    { id: "days", label: "certains jours" },
    { id: "regular", label: "régulière" },
    { id: "discuss", label: "à discuter" },
  ],
  missionTypes: [
    { id: "small", label: "petits colis" },
    { id: "product", label: "produits" },
    { id: "equip", label: "équipements" },
    { id: "pro", label: "matériels professionnels" },
    { id: "utility", label: "transport utilitaire" },
    { id: "ops", label: "opérations logistiques" },
    { id: "discuss", label: "à discuter" },
  ],
  zoneHints: [
    { id: "abidjan", label: "Abidjan et communes" },
    { id: "peri", label: "périphérie proche" },
    { id: "other", label: "autre zone (à préciser)" },
  ],
};

export const driverDataNotice =
  "Ne transmettez pas de photo de pièce d’identité, de permis, de carte grise, d’assurance, de coordonnées bancaires ou d’autres documents sensibles par ce premier formulaire. ONLOUTOU précisera ultérieurement le canal sécurisé et les documents éventuellement nécessaires.";

export const driverFutureSpaceSection = {
  title: "Un espace livreur pourra être développé par étapes.",
  features: [
    "profil",
    "documents",
    "disponibilités",
    "missions",
    "statuts",
    "historique",
    "assistance",
  ],
  notice:
    "Ces fonctions ne sont pas encore présentées comme disponibles tant que leur développement et leurs règles de fonctionnement ne sont pas confirmés.",
};

export const driverConsentLabel =
  "Je comprends que cette démarche constitue une manifestation d’intérêt et ne garantit aucune validation, mission, rémunération ou collaboration.";

export function buildDriverPartnerWhatsAppMessage(fields: {
  profileTypeLabel: string;
  name: string;
  city: string;
  zonesLabels: string;
  zonesDetail: string;
  transportLabel: string;
  ownershipLabel: string;
  documentsLabels: string;
  experienceLabel: string;
  availabilityLabel: string;
  missionLabels: string;
  phone: string;
  details: string;
}) {
  const zonesCombined = [fields.zonesLabels, fields.zonesDetail].filter((z) => z?.trim()).join(" — ") || "—";
  const line = (label: string, value: string) => `${label} : ${value?.trim() ? value.trim() : "—"}`;
  return [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite présenter mon profil pour de futures possibilités de livraison ou de collaboration logistique.",
    "",
    line("Type de profil", fields.profileTypeLabel),
    line("Nom ou structure", fields.name),
    line("Ville / commune", fields.city),
    line("Zones d’intervention", zonesCombined),
    line("Moyen de transport", fields.transportLabel),
    line("Propriété du moyen", fields.ownershipLabel),
    line("Documents déclarés disponibles", fields.documentsLabels),
    line("Expérience", fields.experienceLabel),
    line("Disponibilité indicative", fields.availabilityLabel),
    line("Types de missions recherchées", fields.missionLabels),
    line("Téléphone", fields.phone),
    line("Précisions", fields.details),
  ].join("\n");
}

export function buildDriverPartnerWhatsAppUrl(fields: Parameters<typeof buildDriverPartnerWhatsAppMessage>[0]) {
  return whatsappUrlForMessage(buildDriverPartnerWhatsAppMessage(fields));
}

function buildDriverPartnerFaq(): ServiceFaqItem[] {
  const revenueAnswer =
    "Aucun revenu ne peut être annoncé sans modèle commercial, type de mission, tarification et conditions validés.";

  const appAnswer =
    "Aucune application livreur n’est proposée comme disponible aujourd’hui. Les outils numériques feront l’objet d’une phase distincte.";

  return [
    {
      question: "Qui peut présenter son profil ?",
      answer:
        "Livreur indépendant, conducteur, propriétaire de véhicule ou structure logistique peut manifester son intérêt. La suite dépend des besoins étudiés.",
    },
    {
      question: "Faut-il posséder son véhicule ?",
      answer:
        "Un moyen personnel, d’entreprise ou mis à disposition peut être indiqué. L’adéquation reste à qualifier pour chaque collaboration.",
    },
    {
      question: "Quels moyens de transport sont recherchés ?",
      answer:
        "Moto, voiture, utilitaire, camion ou flotte peuvent être étudiés selon les missions envisagées — sans liste exhaustive garantie.",
    },
    {
      question: "Quels documents seront nécessaires ?",
      answer:
        "La liste exacte sera communiquée ultérieurement via un canal adapté. Ne transmettez pas de copies sensibles par ce formulaire.",
    },
    {
      question: "L’inscription garantit-elle des missions ?",
      answer: "Non. Il s’agit d’une manifestation d’intérêt sans promesse de mission, de revenu ou de contrat.",
    },
    { question: "Combien peut gagner un livreur ?", answer: revenueAnswer },
    {
      question: "Quelles zones sont concernées ?",
      answer:
        "Les zones indiquées servent à comprendre votre périmètre. Elles ne signifient pas une couverture ou des missions garanties par ONLOUTOU.",
    },
    {
      question: "Comment les profils sont-ils examinés ?",
      answer:
        "ONLOUTOU examine la cohérence du profil avec les besoins envisagés, puis peut proposer un échange avant toute vérification documentaire.",
    },
    { question: "Existe-t-il déjà une application livreur ?", answer: appAnswer },
    {
      question: "Comment serai-je contacté ?",
      answer: "Via les coordonnées fournies, généralement par téléphone ou WhatsApp, selon l’avancement du projet.",
    },
  ];
}

export const driverPartnerFaq = buildDriverPartnerFaq();

export const driverPartnerFinalCta = {
  eyebrow: "MANIFESTATION D’INTÉRÊT",
  title: "Présentez ce que vous pouvez réellement mobiliser.",
  lead:
    "Votre profil, votre zone, votre moyen de transport et votre expérience nous aideront à comprendre les possibilités de collaboration.",
  primary: { label: "Présenter mon profil", href: "#candidature-livreur" },
  secondary: { label: "Découvrir la livraison", href: "/livraison" },
  partnerLink: { label: "Je représente plutôt une entreprise partenaire", href: "/devenir-partenaire" },
  portalLink: { label: "Découvrir l’espace livreur (aperçu)", href: "/espace-livreur" },
};

export function driverPartnerBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Livraison", item: `${baseUrl}/livraison` },
      { "@type": "ListItem", position: 3, name: "Devenir livreur", item: `${baseUrl}/devenir-livreur` },
    ],
  };
}
