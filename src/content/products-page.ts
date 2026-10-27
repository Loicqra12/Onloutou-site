import { whatsappUrlForMessage } from "@/content/contact-page";
import { site } from "@/content/site";
import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export type ProductCatalogStatus = "preparation" | "request-only" | "published";

/**
 * Preuve : pages équipements/solutions (familles sans stock ni prix), EquipmentPreviewSection,
 * disclaimers « pas un catalogue » — aucun ProductRecord validé dans le dépôt.
 */
export const catalogStatus: ProductCatalogStatus = "request-only";

export type ProductAvailability = "on-request" | "available" | "unavailable" | "preorder";

export type ProductAccessMode = "purchase" | "rental" | "project";

export type ProductFamily = {
  slug: string;
  name: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number; objectPosition?: string };
  href: string;
};

export type ProductRecord = {
  slug: string;
  name: string;
  family: string;
  reference?: string;
  accessModes: ProductAccessMode[];
  availability: ProductAvailability;
  images: string[];
  verifiedFacts: string[];
};

/** Catalogue publié — vide tant qu’aucune fiche n’est validée. */
export const publishedProductCatalog: ProductRecord[] = [];

const vehiclesBase = "/assets/images/equipment/vehicles";
const motosBase = "/assets/images/equipment/motorcycles";
const trucksBase = "/assets/images/equipment/camions-engins";
const projectA = "/assets/images/projects/project-a";
const projectB = "/assets/images/projects/project-b";
const solutionsBase = "/assets/images/solutions";

export const productIllustrativeCaption =
  "Visuel illustratif — référence et disponibilité à confirmer";

export const productsPageMedia = {
  heroPrimary: {
    src: `${projectA}/mobilite-professionnelle-cour-logistique.png`,
    alt: "Berline, utilitaire et scooter dans une cour logistique professionnelle",
    width: 1536,
    height: 1024,
    objectPosition: "48% 58%",
  },
  heroSecondary: {
    src: `${solutionsBase}/installation-traceur-gps-onloutou.png`,
    alt: "Technicien installant un traceur GPS sur un véhicule",
    width: 1586,
    height: 992,
    objectPosition: "55% 42%",
  },
  heroTertiary: {
    src: `${projectB}/inspection-groupe-electrogene.png`,
    alt: "Technicien inspectant un groupe électrogène sur site",
    width: 1536,
    height: 1024,
    objectPosition: "58% 46%",
  },
  qualityWarehouse: {
    src: `${projectA}/gestion-equipements-entrepot.png`,
    alt: "Opératrice organisant des équipements en entrepôt",
    width: 1536,
    height: 1024,
    objectPosition: "64% 38%",
  },
};

function catalogEyebrow() {
  if (catalogStatus === "published") return "PRODUITS · SÉLECTION PROFESSIONNELLE";
  if (catalogStatus === "preparation") return "PRODUITS · CATALOGUE EN PRÉPARATION";
  return "PRODUITS · SÉLECTION SUR DEMANDE";
}

export const productsPageSeo = {
  title: "Produits, véhicules et équipements professionnels",
  description:
    "Explorez les familles de véhicules, matériels, équipements connectés et solutions professionnelles étudiées par ONLOUTOU selon vos usages.",
};

export const productsBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Produits" },
];

export const productsHero = {
  eyebrow: catalogEyebrow(),
  titleBefore: "Des produits choisis pour ",
  titleHighlight: "des usages réels.",
  intro:
    "Explorez les familles de véhicules, matériels et équipements qu’ONLOUTOU peut étudier pour vos opérations, vos projets et vos besoins professionnels.",
  notice: "Les références, prix et disponibilités sont confirmés après qualification.",
  panelSteps: ["Besoin", "Usage", "Mode d’accès", "Référence", "Proposition"],
  primaryCta: { label: "Explorer les familles", href: "#familles-produits" },
  secondaryCta: { label: "Décrire mon besoin", href: "#demande-produit" },
};

export type ProductIntentId =
  | "vehicle"
  | "equipment"
  | "connected"
  | "rent"
  | "buy"
  | "special";

export const productIntentRail = {
  id: "intentions-produits",
  items: [
    { id: "vehicle" as ProductIntentId, label: "Je cherche un véhicule", href: "#familles-produits", family: "véhicule" },
    { id: "equipment" as ProductIntentId, label: "Je cherche un équipement", href: "#familles-produits", family: "outils ou matériels" },
    { id: "connected" as ProductIntentId, label: "Je cherche un matériel connecté", href: "#familles-produits", family: "équipement connecté" },
    { id: "rent" as ProductIntentId, label: "Je veux louer", href: "#modes-acces", mode: "location" },
    { id: "buy" as ProductIntentId, label: "Je veux acquérir", href: "#modes-acces", mode: "acquisition" },
    { id: "special" as ProductIntentId, label: "J’ai un besoin particulier", href: "#demande-produit", family: "besoin spécifique" },
  ],
};

export const PRODUCT_REQUEST_PREFILL_KEY = "onloutou-product-request-prefill";

export type ProductRequestPrefill = {
  familyLabel?: string;
  modeLabel?: string;
  useCaseId?: string;
};

export const productsFamiliesSection = {
  id: "familles-produits",
  title: "Explorer les produits par famille.",
  families: [
    {
      number: "01",
      title: "Véhicules",
      subfamilies: ["berlines", "SUV", "véhicules utilitaires", "autres véhicules selon le projet"],
      usages: ["déplacements professionnels", "flotte terrain", "missions inter-sites"],
      notice:
        "Les modèles, motorisations, états, années, disponibilités et conditions sont confirmés pour chaque proposition.",
      href: "/equipements/vehicules",
      extraLinks: [
        { label: "Location", href: "/solutions/location" },
        { label: "Acquisition", href: "/solutions/vente" },
      ],
      image: {
        src: `${vehiclesBase}/Flotte professionnelle inspectée à Abidjan-2.png`,
        alt: "Berline, SUV et utilitaire présentés dans une cour professionnelle",
        width: 1672,
        height: 941,
        objectPosition: "52% 48%",
      },
      requestFamily: "véhicule",
    },
    {
      number: "02",
      title: "Motos et mobilité légère",
      subfamilies: [
        "motos urbaines",
        "mobilité professionnelle",
        "deux-roues adaptés à certains besoins opérationnels",
        "accessoires à étudier",
      ],
      usages: ["tournées courtes", "liaisons urbaines", "opérations nécessitant de la manœuvrabilité"],
      notice: null,
      href: "/equipements/motos",
      extraLinks: [],
      image: {
        src: `${motosBase}/Motos professionnelles dans une cour d’Abidjan-2.png`,
        alt: "Motos professionnelles alignées dans une cour à Abidjan",
        width: 1586,
        height: 992,
        objectPosition: "50% 55%",
      },
      requestFamily: "moto",
    },
    {
      number: "03",
      title: "Camions et engins",
      subfamilies: ["camions porteurs", "véhicules de chantier", "engins", "équipements lourds selon besoin"],
      usages: ["transport de charges", "chantier", "logistique lourde"],
      notice:
        "Les capacités, configurations, documents et conditions d’exploitation doivent être vérifiés avant toute proposition.",
      href: "/equipements/camions-engins",
      extraLinks: [],
      image: {
        src: `${trucksBase}/Camions et engins sur site à Abidjan-1.png`,
        alt: "Camions et engins sur un site professionnel à Abidjan",
        width: 1586,
        height: 992,
        objectPosition: "48% 50%",
      },
      requestFamily: "camion ou engin",
    },
    {
      number: "04",
      title: "Outils et matériels professionnels",
      subfamilies: ["outillage", "énergie", "maintenance", "chantier léger", "stockage", "logistique"],
      usages: ["interventions techniques", "chantier", "autonomie énergétique"],
      notice: null,
      href: "/equipements/outils-materiels",
      extraLinks: [],
      image: {
        src: `${vehiclesBase}/Chargement professionnel dans une cour d’Abidjan-1.png`,
        alt: "Agents chargeant du matériel dans un véhicule utilitaire",
        width: 1586,
        height: 992,
        objectPosition: "55% 50%",
      },
      requestFamily: "outils ou matériels",
    },
    {
      number: "05",
      title: "Équipements connectés",
      subfamilies: [
        "traceurs",
        "balises",
        "connectivité",
        "capteurs ou accessoires compatibles",
        "interfaces de supervision",
      ],
      usages: ["suivi d’actifs", "sécurisation", "supervision opérationnelle"],
      notice: null,
      href: "/equipements/equipements-connectes",
      extraLinks: [],
      image: {
        src: `${solutionsBase}/installation-gps-berline-onloutou.png`,
        alt: "Installation de solution de géolocalisation sur une berline",
        width: 1586,
        height: 992,
        objectPosition: "54% 44%",
      },
      requestFamily: "équipement connecté",
    },
    {
      number: "06",
      title: "Besoins spécifiques",
      subfamilies: [],
      usages: ["recherche dédiée", "combinaison de produits", "intégration technique"],
      notice:
        "Certains projets nécessitent une recherche dédiée, une combinaison de produits ou une intégration technique. La demande est alors étudiée à partir du résultat attendu et des contraintes du terrain.",
      href: "#demande-produit",
      extraLinks: [],
      image: null,
      requestFamily: "besoin spécifique",
    },
  ],
};

export type ProductUseCaseId =
  | "move"
  | "deliver"
  | "equip"
  | "track"
  | "project"
  | "undefined";

export const productsUseExplorer = {
  id: "usage-produits",
  title: "Commencez par ce que vous devez accomplir.",
  tag: "Familles à explorer",
  cases: [
    {
      id: "move" as ProductUseCaseId,
      title: "Déplacer une équipe",
      suggestions: ["véhicules", "motos", "location", "acquisition"],
      links: [
        { label: "Véhicules", href: "/equipements/vehicules" },
        { label: "Location", href: "/solutions/location" },
      ],
    },
    {
      id: "deliver" as ProductUseCaseId,
      title: "Livrer ou transporter",
      suggestions: ["mobilité légère", "utilitaire", "camion", "coordination logistique"],
      links: [{ label: "Livraison", href: "/livraison" }],
    },
    {
      id: "equip" as ProductUseCaseId,
      title: "Équiper une intervention",
      suggestions: ["outils", "énergie", "équipements de maintenance", "matériels de chantier léger"],
      links: [{ label: "Outils & matériels", href: "/equipements/outils-materiels" }],
    },
    {
      id: "track" as ProductUseCaseId,
      title: "Suivre des actifs",
      suggestions: ["traceurs filaires", "balises autonomes", "connectivité", "plateforme"],
      links: [
        { label: "Équipements connectés", href: "/equipements/equipements-connectes" },
        { label: "Géolocalisation", href: "/solutions/geolocalisation" },
      ],
    },
    {
      id: "project" as ProductUseCaseId,
      title: "Structurer un projet",
      suggestions: ["sourcing", "combinaison d’équipements", "intégration", "formation", "maintenance à étudier"],
      links: [{ label: "Projets", href: "/projets" }],
    },
    {
      id: "undefined" as ProductUseCaseId,
      title: "Besoin non défini",
      suggestions: ["cadrage accompagné"],
      cta: { label: "Être accompagné dans le cadrage", href: "#demande-produit" },
      links: [],
    },
  ],
};

export const productsAccessSection = {
  id: "modes-acces",
  title: "Trois manières d’accéder au bon équipement.",
  modes: [
    {
      title: "Acquisition",
      description:
        "Adaptée lorsque le besoin est durable et que le produit doit intégrer le patrimoine ou le parc de l’entreprise.",
      href: "/solutions/vente",
      label: "En savoir plus sur l’acquisition",
    },
    {
      title: "Location",
      description:
        "Adaptée à un besoin temporaire, ponctuel ou limité à une période définie, sous réserve de disponibilité et de conditions.",
      href: "/solutions/location",
      label: "En savoir plus sur la location",
    },
    {
      title: "Projet",
      description:
        "Adapté lorsqu’il faut associer plusieurs équipements, installation, connectivité, plateforme, formation, maintenance ou intégration.",
      href: "/projets",
      label: "Voir les projets",
    },
  ],
};

export const productsSourcingSection = {
  title: "Une proposition dépend aussi de l’écosystème mobilisable.",
  lead:
    "Selon le besoin, ONLOUTOU peut étudier différentes sources d’approvisionnement, références ou partenaires afin de construire une proposition cohérente avec l’usage et les contraintes identifiés.",
  principles: [
    "besoin avant référence",
    "vérification avant engagement",
    "alternatives lorsque cela est possible",
    "transparence sur les éléments à confirmer",
  ],
  partnersLink: { label: "Partenaires", href: "/partenaires" },
  proposeLink: { label: "Proposer vos produits", href: "/devenir-partenaire" },
};

export const productsQualitySection = {
  title: "Une meilleure demande produit une proposition plus juste.",
  items: [
    "usage recherché",
    "quantité indicative",
    "environnement",
    "fréquence",
    "contraintes techniques",
    "budget indicatif si le demandeur souhaite le communiquer",
    "calendrier",
    "lieu d’utilisation",
    "services associés",
  ],
  note: "Un budget indicatif aide à orienter la recherche, mais ne constitue ni une commande ni un engagement.",
};

export const productsCommercialProcess: DeploymentPhase[] = [
  { step: "01", title: "Décrire", description: "Préciser l’usage et le résultat attendu." },
  { step: "02", title: "Qualifier", description: "Identifier les contraintes et le mode d’accès." },
  { step: "03", title: "Rechercher", description: "Étudier les familles et références pertinentes." },
  { step: "04", title: "Vérifier", description: "Confirmer caractéristiques, état, documents et disponibilité." },
  { step: "05", title: "Proposer", description: "Transmettre les éléments commerciaux applicables." },
  { step: "06", title: "Valider", description: "Confirmer par écrit la référence et les conditions." },
];

export const productsCatalogFuture = {
  title: "Fiches produit détaillées — à venir",
  lead:
    "L’architecture est prête pour accueillir des références validées (caractéristiques vérifiées, disponibilité, modes d’accès). Aucune fiche individuelle n’est publiée tant que les informations ne sont pas confirmées.",
  statuses: [
    { key: "on-request", label: "Sur demande" },
    { key: "available", label: "Disponible — si confirmé" },
    { key: "unavailable", label: "Indisponible" },
    { key: "preorder", label: "Précommande — si applicable" },
  ],
};

export const productRequestSection = {
  id: "demande-produit",
  title: "Décrivez le produit ou l’équipement recherché.",
};

export const productRequestOptions = {
  families: [
    { id: "vehicle", label: "véhicule" },
    { id: "moto", label: "moto" },
    { id: "truck", label: "camion ou engin" },
    { id: "tools", label: "outils ou matériels" },
    { id: "connected", label: "équipement connecté" },
    { id: "special", label: "besoin spécifique" },
    { id: "unknown", label: "je ne sais pas encore" },
  ],
  modes: [
    { id: "buy", label: "acquisition" },
    { id: "rent", label: "location" },
    { id: "compare", label: "comparer les deux" },
    { id: "project", label: "projet global" },
    { id: "tbd", label: "à déterminer" },
  ],
  conditions: [
    { id: "new", label: "neuf" },
    { id: "used", label: "occasion" },
    { id: "both", label: "les deux peuvent être étudiés" },
    { id: "none", label: "sans préférence" },
    { id: "na", label: "non applicable" },
  ],
  services: [
    { id: "delivery", label: "livraison" },
    { id: "install", label: "installation" },
    { id: "config", label: "configuration" },
    { id: "training", label: "formation" },
    { id: "maint", label: "maintenance" },
    { id: "geo", label: "géolocalisation" },
    { id: "platform", label: "plateforme" },
    { id: "advice", label: "conseil" },
    { id: "tbd", label: "à déterminer" },
  ],
};

const familiesWithCondition = new Set(["vehicle", "moto", "truck", "tools", "connected", "special", "unknown"]);

export function shouldShowConditionField(familyId: string) {
  return familiesWithCondition.has(familyId);
}

export function buildProductRequestWhatsAppMessage(fields: {
  familyLabel: string;
  usage: string;
  modeLabel: string;
  quantity: string;
  conditionLabel: string;
  characteristics: string;
  budget: string;
  schedule: string;
  zone: string;
  servicesLabels: string;
  details: string;
}) {
  const line = (label: string, value: string) => `${label} : ${value?.trim() ? value.trim() : "—"}`;
  return [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite recevoir des informations sur un produit ou un équipement.",
    "",
    line("Famille", fields.familyLabel),
    line("Usage principal", fields.usage),
    line("Mode souhaité", fields.modeLabel),
    line("Quantité indicative", fields.quantity),
    line("État souhaité", fields.conditionLabel),
    line("Caractéristiques connues", fields.characteristics),
    line("Budget indicatif", fields.budget),
    line("Date ou période", fields.schedule),
    line("Zone d’utilisation ou de livraison", fields.zone),
    line("Services associés", fields.servicesLabels),
    line("Précisions", fields.details),
  ].join("\n");
}

export function buildProductRequestWhatsAppUrl(fields: Parameters<typeof buildProductRequestWhatsAppMessage>[0]) {
  return whatsappUrlForMessage(buildProductRequestWhatsAppMessage(fields));
}

export const productsTransparency = {
  title: "Informations à confirmer avant toute commande",
  items: [
    "fabricant",
    "référence",
    "version",
    "état",
    "année si applicable",
    "caractéristiques",
    "accessoires",
    "quantité",
    "disponibilité",
    "prix",
    "taxes",
    "livraison",
    "installation",
    "formation",
    "garantie applicable",
    "maintenance",
    "documents",
    "conditions de paiement",
  ],
  note:
    "Les images de familles ne constituent pas une offre contractuelle. La référence, les caractéristiques, le prix, la disponibilité et les conditions sont confirmés dans une proposition dédiée.",
};

export const productsDeliveryTeaser = {
  title: "Prévoir aussi l’acheminement.",
  lead:
    "Selon le produit, la zone et les moyens mobilisables, la proposition peut intégrer ou distinguer les conditions de livraison, de retrait, d’installation ou de mise en service.",
  link: { label: "Découvrir la livraison", href: "/livraison" },
};

function buildProductsFaqItems(): ServiceFaqItem[] {
  const stockAnswer =
    catalogStatus === "published"
      ? "Seules les références explicitement validées peuvent être proposées. La disponibilité reste à confirmer pour chaque demande."
      : "Les familles présentées ne correspondent pas à un stock en ligne. Toute disponibilité est confirmée après qualification.";

  const fichesAnswer =
    catalogStatus === "published"
      ? "Les fiches détaillées seront publiées au fur et à mesure des validations."
      : "Les fiches produit détaillées seront proposées lorsque des références complètes et vérifiées seront disponibles — pas de fiche inventée sur ce site.";

  return [
    { question: "Les produits affichés sont-ils disponibles immédiatement ?", answer: stockAnswer },
    {
      question: "Comment obtenir un prix ?",
      answer: "Un prix n’est communiqué qu’après qualification du besoin, de la référence étudiée et des conditions applicables.",
    },
    {
      question: "Peut-on demander une marque ou une référence précise ?",
      answer: "Oui, vous pouvez l’indiquer dans votre demande. Sa faisabilité dépend des sources mobilisables et des vérifications nécessaires.",
    },
    {
      question: "ONLOUTOU propose-t-il du neuf et de l’occasion ?",
      answer: "Les deux peuvent être étudiés selon la famille et le projet, sans garantie de disponibilité pour un état donné.",
    },
    {
      question: "Peut-on louer au lieu d’acheter ?",
      answer: "Oui, selon le besoin et la disponibilité. Comparez les modes d’accès ou précisez-le dans le configurateur.",
    },
    {
      question: "La livraison est-elle incluse ?",
      answer: "La livraison, le retrait ou l’installation ne sont jamais supposés inclus sans l’avoir confirmé dans une proposition.",
    },
    {
      question: "Peut-on demander une installation ou une formation ?",
      answer: "Ces services peuvent être étudiés et listés dans votre demande. Leur faisabilité dépend du produit et du périmètre convenu.",
    },
    { question: "Quand les fiches produit détaillées seront-elles disponibles ?", answer: fichesAnswer },
  ];
}

export const productsFaq = buildProductsFaqItems();

export const productsFinalCta = {
  eyebrow: "DEMANDE PRODUIT",
  title: "Ne cherchez pas seulement une référence. Cherchez une réponse adaptée.",
  lead:
    "Décrivez l’usage, les contraintes et le mode d’accès souhaité. ONLOUTOU vous aidera à structurer la recherche et les éléments à confirmer.",
  primary: { label: "Décrire mon besoin", href: "#demande-produit" },
  secondary: { label: "Explorer les équipements", href: "/equipements" },
  contact: { label: "Contact", href: "/contact" },
};

export const productsPositioningNote =
  "Cette page aide à rechercher une référence et à formuler une demande. La page Équipements présente les univers, capacités d’accompagnement et parcours par famille.";

export function productsBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Produits", item: `${baseUrl}/produits` },
    ],
  };
}

export function productsCollectionJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: productsPageSeo.title,
    description: productsPageSeo.description,
    url: `${baseUrl}/produits`,
    isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  };
}
