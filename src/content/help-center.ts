import { deliveryServiceStatus } from "@/content/delivery-page";
import { driverPortalStatus } from "@/content/driver-portal-page";
import { partnerPortalStatus } from "@/content/partner-portal-page";
import { catalogStatus } from "@/content/products-page";
import { whatsappUrlForMessage } from "@/content/contact-page";
import type {
  HelpArticle,
  HelpAudience,
  HelpCategory,
  HelpServiceAvailability,
} from "@/types/help";

export type { HelpArticle, HelpAudience, HelpCategory, HelpArticleStatus } from "@/types/help";

function mapCatalogStatus(): HelpServiceAvailability {
  if (catalogStatus === "published") return "available";
  if (catalogStatus === "preparation") return "in-preparation";
  return "to-confirm";
}

function mapDeliveryStatus(): HelpServiceAvailability {
  if (deliveryServiceStatus === "available") return "available";
  if (deliveryServiceStatus === "pilot") return "pilot";
  return "in-preparation";
}

function mapPartnerPortal(): HelpServiceAvailability {
  if (partnerPortalStatus === "available") return "available";
  if (partnerPortalStatus === "pilot") return "pilot";
  if (partnerPortalStatus === "in-development") return "in-preparation";
  return "to-confirm";
}

function mapDriverPortal(): HelpServiceAvailability {
  if (driverPortalStatus === "available") return "available";
  if (driverPortalStatus === "pilot") return "pilot";
  if (driverPortalStatus === "planned") return "in-preparation";
  return "to-confirm";
}

export const helpServiceAvailability = {
  products: mapCatalogStatus(),
  delivery: mapDeliveryStatus(),
  partnerPortal: mapPartnerPortal(),
  driverPortal: mapDriverPortal(),
  partnerSubscription: "to-confirm" as HelpServiceAvailability,
  partnerSponsoring: "to-confirm" as HelpServiceAvailability,
  onlinePayment: "to-confirm" as HelpServiceAvailability,
};

export const helpCenterSeo = {
  title: "Centre d’aide et questions fréquentes",
  description:
    "Trouvez des réponses sur les solutions, équipements, produits, partenaires, livreurs et services ONLOUTOU.",
};

export const helpCenterBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Centre d’aide" },
];

export const helpCenterHero = {
  eyebrow: "CENTRE D’AIDE",
  titleBefore: "Comment pouvons-nous ",
  titleHighlight: "vous aider ?",
  intro:
    "Recherchez une réponse sur les solutions, les équipements, les produits, la livraison ou les espaces ONLOUTOU.",
  searchPlaceholder: "Rechercher une question, un service ou un équipement…",
  searchExamples: "Exemples : location, GPS, disponibilité, partenaire, livraison",
};

export const helpAudienceFilters: { id: HelpAudience; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "customer", label: "Client" },
  { id: "business", label: "Entreprise" },
  { id: "partner", label: "Partenaire" },
  { id: "driver", label: "Livreur" },
];

export const helpCategories: HelpCategory[] = [
  {
    id: "a-propos-contact",
    title: "ONLOUTOU et prise de contact",
    description: "Comprendre l’activité et entrer en relation.",
  },
  {
    id: "location-acquisition",
    title: "Location et acquisition",
    description: "Louer ou acquérir un équipement selon votre besoin.",
  },
  {
    id: "geolocalisation-flotte",
    title: "Géolocalisation et gestion de flotte",
    description: "Suivi, alertes et pilotage — selon matériel et contexte.",
  },
  {
    id: "equipements-produits",
    title: "Équipements et produits",
    description: "Familles d’équipements et demandes produits.",
  },
  {
    id: "livraison",
    title: "Livraison",
    description: "Transport et coordination — selon statut du service.",
  },
  {
    id: "partenaires",
    title: "Partenaires",
    description: "Collaborations et futur espace partenaire.",
  },
  {
    id: "livreurs",
    title: "Livreurs partenaires",
    description: "Réseau livreur et futur espace terrain.",
  },
  {
    id: "projets-plateformes",
    title: "Projets et plateformes",
    description: "Projets sur mesure et plateformes numériques.",
  },
];

const deliveryPrep =
  helpServiceAvailability.delivery === "in-preparation"
    ? "Le service de livraison est en préparation : les demandes peuvent être qualifiées sans garantie d’exécution immédiate."
    : helpServiceAvailability.delivery === "pilot"
      ? "La livraison peut être proposée de manière limitée selon zone et faisabilité — à confirmer pour chaque besoin."
      : "Une livraison n’est engagée qu’après qualification et confirmation explicite des conditions.";

const catalogPrep =
  helpServiceAvailability.products === "in-preparation"
    ? "Le catalogue en ligne n’est pas un stock temps réel : la disponibilité est confirmée après qualification."
    : "Seules les références validées peuvent être proposées ; la disponibilité reste à confirmer par demande.";

export const helpPopularArticleIds = [
  "comment-obtenir-un-prix",
  "comment-presenter-mon-besoin",
  "disponibilite-immediate",
  "comment-devenir-partenaire",
  "comment-devenir-livreur",
  "comment-contacter-onloutou",
] as const;

export const helpArticles: HelpArticle[] = [
  {
    id: "que-propose-onloutou",
    categoryId: "a-propos-contact",
    question: "Que propose ONLOUTOU ?",
    shortAnswer: "Location, acquisition, équipements connectés, projets et accompagnement selon besoin.",
    answer:
      "ONLOUTOU accompagne entreprises et particuliers sur la location et l’acquisition d’équipements, la géolocalisation, la gestion de flotte, les produits sur demande, la livraison lorsque le dispositif le permet, ainsi que des projets et plateformes étudiés au cas par cas. Le périmètre exact dépend de votre situation et doit être confirmé avant engagement. Consultez les solutions ou présentez votre besoin.",
    audiences: ["all"],
    keywords: ["onloutou", "solutions", "services", "activité"],
    status: "verified",
    relatedLinks: [
      { label: "À propos", href: "/a-propos" },
      { label: "Solutions", href: "/solutions" },
    ],
  },
  {
    id: "comment-presenter-mon-besoin",
    categoryId: "a-propos-contact",
    question: "Comment présenter mon besoin ?",
    shortAnswer: "Décrivez le contexte, l’équipement, la zone et l’échéance via les pages dédiées ou le contact.",
    answer:
      "Précisez ce que vous cherchez (location, achat, produit, livraison, projet), les contraintes de zone et de calendrier, et les informations utiles à la qualification. Les formulaires et configurateurs du site structurent une première prise de contact ; ils ne remplacent pas une proposition confirmée. Utilisez la page adaptée (produits, livraison, projets, devenir partenaire, etc.) ou le contact.",
    audiences: ["all", "customer", "business"],
    keywords: ["besoin", "demande", "qualifier", "formulaire"],
    status: "verified",
    relatedLinks: [
      { label: "Présenter mon besoin", href: "/contact" },
      { label: "Produits", href: "/produits/demande" },
    ],
  },
  {
    id: "comment-contacter-onloutou",
    categoryId: "a-propos-contact",
    question: "Comment contacter ONLOUTOU ?",
    shortAnswer: "Page Contact, téléphone ou WhatsApp — coordonnées centralisées sur le site.",
    answer:
      "La page Contact regroupe les moyens de joindre ONLOUTOU. Vous pouvez aussi utiliser WhatsApp avec un message structuré. Aucun engagement n’est créé par un simple message : l’équipe oriente vers la prochaine étape appropriée. Les horaires de réponse ne sont pas garantis 24 h/24.",
    audiences: ["all"],
    keywords: ["contact", "téléphone", "whatsapp", "joindre"],
    status: "verified",
    relatedLinks: [{ label: "Contacter ONLOUTOU", href: "/contact" }],
  },
  {
    id: "propositions-immediates",
    categoryId: "a-propos-contact",
    question: "Les propositions sont-elles immédiates ?",
    shortAnswer: "Non — qualification et confirmation avant tout engagement.",
    answer:
      "Une demande en ligne ou un message ne constitue pas une offre ferme. ONLOUTOU peut avoir besoin de précisions, de vérifications ou d’études avant de formuler une proposition. Les délais dépendent du sujet et ne sont pas annoncés de façon générale sur ce site.",
    audiences: ["all", "customer", "business"],
    keywords: ["délai", "immédiat", "proposition", "devis"],
    status: "verified",
    relatedLinks: [{ label: "Contact", href: "/contact" }],
  },
  {
    id: "informations-avant-echange",
    categoryId: "a-propos-contact",
    question: "Quelles informations préparer avant un échange ?",
    shortAnswer: "Contexte, équipement, zone, calendrier et contraintes principales.",
    answer:
      "Préparez une description claire du besoin, des références ou familles d’équipements visées, la zone d’utilisation ou d’intervention, les dates souhaitées et les contraintes (accès, installation, documents). Plus les éléments sont précis, plus l’orientation est efficace — sans garantir une réponse positive.",
    audiences: ["all", "business"],
    keywords: ["préparer", "documents", "brief"],
    status: "verified",
    relatedLinks: [{ label: "Expertise", href: "/expertise" }],
  },
  {
    id: "location-courte-duree",
    categoryId: "location-acquisition",
    question: "Peut-on louer un équipement pour une courte durée ?",
    shortAnswer: "Oui selon famille et disponibilité — à confirmer.",
    answer:
      "La location courte durée peut être étudiée selon le type d’équipement, la période et la disponibilité réelle. Elle n’est jamais supposée possible sans confirmation écrite ou formelle des conditions. Présentez votre besoin depuis la page Location.",
    audiences: ["all", "customer"],
    keywords: ["location", "courte durée", "louer"],
    status: "conditional",
    relatedLinks: [{ label: "Location", href: "/solutions/location" }],
  },
  {
    id: "location-ou-acquisition",
    categoryId: "location-acquisition",
    question: "Comment choisir entre location et acquisition ?",
    shortAnswer: "Selon durée d’usage, budget, contraintes et stratégie — à comparer au cas par cas.",
    answer:
      "La location convient souvent à un besoin temporaire ou à un test d’usage ; l’acquisition à un usage durable ou un actif à intégrer au patrimoine. ONLOUTOU peut orienter après qualification du besoin. Aucun mode n’est imposé par défaut.",
    audiences: ["all", "customer", "business"],
    keywords: ["location", "achat", "acquisition", "comparer"],
    status: "verified",
    relatedLinks: [
      { label: "Location", href: "/solutions/location" },
      { label: "Vente", href: "/solutions/vente" },
    ],
  },
  {
    id: "comment-obtenir-un-prix",
    categoryId: "location-acquisition",
    question: "Comment obtenir un prix ?",
    shortAnswer: "Après qualification — pas de tarif générique garanti sur le site.",
    answer:
      "Un prix dépend de la référence, de la période, de la quantité, de la zone, des services associés et des conditions applicables. Il est communiqué après étude du besoin, pas via une grille universelle sur ce site. Présentez votre demande sur la page concernée ou via le contact.",
    audiences: ["all", "customer", "business"],
    keywords: ["prix", "tarif", "devis", "coût"],
    status: "verified",
    relatedLinks: [
      { label: "Produits", href: "/produits" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    id: "disponibilite-immediate",
    categoryId: "location-acquisition",
    question: "La disponibilité est-elle immédiate ?",
    shortAnswer: "Non par défaut — confirmation nécessaire.",
    answer:
      "La disponibilité dépend de la référence, de la période, de la quantité et des conditions du projet. Elle doit être confirmée par ONLOUTOU avant toute commande ou location. Les pages produits et équipements ne constituent pas un stock en temps réel.",
    audiences: ["all", "customer"],
    keywords: ["disponibilité", "stock", "immédiat"],
    status: "conditional",
    relatedLinks: [{ label: "Produits", href: "/produits" }],
  },
  {
    id: "livraison-incluse-location",
    categoryId: "location-acquisition",
    question: "La livraison est-elle incluse ?",
    shortAnswer: "Uniquement si confirmé dans la proposition.",
    answer:
      "Livraison, retrait, installation ou mise en service ne sont jamais supposés inclus. Ils peuvent être étudiés et mentionnés explicitement dans une proposition. " + deliveryPrep,
    audiences: ["all", "customer"],
    keywords: ["livraison", "inclus", "transport"],
    status: "conditional",
    relatedLinks: [{ label: "Livraison", href: "/livraison" }],
  },
  {
    id: "informations-avant-engagement",
    categoryId: "location-acquisition",
    question: "Quelles informations sont confirmées avant engagement ?",
    shortAnswer: "Référence, prix, disponibilité, périmètre et responsabilités.",
    answer:
      "Avant engagement, les éléments essentiels (équipement ou service, conditions financières, calendrier, zone, livraison le cas échéant, responsabilités) doivent être validés explicitement. Une demande en ligne ne remplace pas ce cadre.",
    audiences: ["all", "business"],
    keywords: ["engagement", "contrat", "confirmation"],
    status: "verified",
    relatedLinks: [{ label: "Projets", href: "/projets" }],
  },
  {
    id: "difference-geo-flotte",
    categoryId: "geolocalisation-flotte",
    question: "Quelle différence entre géolocalisation et gestion de flotte ?",
    shortAnswer: "Position et alertes vs pilotage opérationnel plus large.",
    answer:
      "La géolocalisation vise le suivi de position et des alertes liées au matériel installé. La gestion de flotte englobe souvent une organisation plus large (véhicules, usages, reporting) selon la solution retenue. Le périmètre exact dépend de l’équipement, de l’installation, du réseau, de la configuration et de la plateforme — à définir avant déploiement.",
    audiences: ["business"],
    keywords: ["géolocalisation", "flotte", "gps", "différence"],
    status: "verified",
    relatedLinks: [
      { label: "Géolocalisation", href: "/solutions/geolocalisation" },
      { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
    ],
  },
  {
    id: "equipement-a-installer",
    categoryId: "geolocalisation-flotte",
    question: "Quel équipement faut-il installer ?",
    shortAnswer: "Dépend du véhicule ou actif et du scénario — étude préalable.",
    answer:
      "Le matériel (traceur, alimentation, capteurs) dépend du type de véhicule ou d’actif, des contraintes d’installation et du niveau de supervision visé. Une compatibilité ne peut pas être affirmée sans examen. L’installation est généralement nécessaire pour un suivi fiable.",
    audiences: ["business"],
    keywords: ["installation", "traceur", "matériel", "capteur"],
    status: "conditional",
    relatedLinks: [{ label: "Équipements connectés", href: "/equipements/equipements-connectes" }],
  },
  {
    id: "vehicules-compatibles",
    categoryId: "geolocalisation-flotte",
    question: "Tous les véhicules sont-ils compatibles ?",
    shortAnswer: "Non — compatibilité à vérifier cas par cas.",
    answer:
      "Chaque véhicule ou actif doit être évalué (alimentation, emplacement, usage). ONLOUTOU ne garantit pas une compatibilité universelle. Une étude préalable évite les engagements inadaptés.",
    audiences: ["business"],
    keywords: ["compatibilité", "véhicule"],
    status: "verified",
    relatedLinks: [{ label: "Véhicules", href: "/equipements/vehicules" }],
  },
  {
    id: "suivi-partout",
    categoryId: "geolocalisation-flotte",
    question: "Le suivi fonctionne-t-il partout ?",
    shortAnswer: "Dépend du réseau, du matériel et du contexte d’usage.",
    answer:
      "La qualité du suivi dépend de la couverture réseau, de l’installation, de la configuration et des conditions d’utilisation. Aucune couverture nationale ou permanente n’est promise sur ce site. Les limites doivent être discutées avant déploiement.",
    audiences: ["business"],
    keywords: ["couverture", "réseau", "zone"],
    status: "conditional",
    relatedLinks: [
      { label: "Géolocalisation", href: "/solutions/geolocalisation" },
      { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
    ],
  },
  {
    id: "alertes-gps",
    categoryId: "geolocalisation-flotte",
    question: "Peut-on recevoir des alertes ?",
    shortAnswer: "Oui selon solution configurée — types et canaux à définir.",
    answer:
      "Des alertes peuvent être envisagées selon le matériel, la plateforme et les règles configurées. Leur nature, leur délai et leur fiabilité dépendent du contexte technique. Elles ne remplacent pas les obligations légales de conduite ou de sécurité.",
    audiences: ["business"],
    keywords: ["alerte", "notification"],
    status: "conditional",
    relatedLinks: [{ label: "Géolocalisation", href: "/solutions/geolocalisation" }],
  },
  {
    id: "installation-necessaire",
    categoryId: "geolocalisation-flotte",
    question: "L’installation est-elle nécessaire ?",
    shortAnswer: "En pratique oui pour un suivi matériel fiable.",
    answer:
      "Un dispositif de suivi sérieux suppose en général une installation sur l’actif concernée, réalisée ou validée selon les standards applicables. Les modalités (qui installe, délais, coûts) font partie de la proposition.",
    audiences: ["business"],
    keywords: ["installation", "pose"],
    status: "verified",
    relatedLinks: [{ label: "Expertise", href: "/expertise" }],
  },
  {
    id: "temps-reel-position",
    categoryId: "geolocalisation-flotte",
    question: "La position est-elle toujours disponible en temps réel ?",
    shortAnswer: "Non garanti en continu — dépend du système et du réseau.",
    answer:
      "Le temps réel dépend du matériel, de la connectivité, de la configuration et des interruptions possibles. ONLOUTOU ne promet pas un flux positionnel ininterrompu sur ce site. Les attentes doivent être alignées lors de l’étude.",
    audiences: ["business"],
    keywords: ["temps réel", "position", "gps"],
    status: "conditional",
    relatedLinks: [{ label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" }],
  },
  {
    id: "types-equipements",
    categoryId: "equipements-produits",
    question: "Quels types d’équipements peut-on demander ?",
    shortAnswer: "Véhicules, motos, outils, matériels, équipements connectés — selon faisabilité.",
    answer:
      "Le hub Équipements présente les familles étudiées (véhicules, motos, outils, engins, connectés, etc.). Toute demande reste soumise à qualification et disponibilité. Aucune famille n’implique un stock illimité.",
    audiences: ["all", "customer", "business"],
    keywords: ["équipement", "véhicule", "outil"],
    status: "verified",
    relatedLinks: [{ label: "Équipements", href: "/equipements" }],
  },
  {
    id: "produits-disponibles-immediatement",
    categoryId: "equipements-produits",
    question: "Les produits affichés sont-ils disponibles immédiatement ?",
    shortAnswer: catalogPrep,
    answer:
      catalogPrep +
      " Présentez une demande produit pour qualifier référence, quantité et conditions.",
    audiences: ["all", "customer"],
    keywords: ["produit", "catalogue", "stock"],
    status: "conditional",
    relatedLinks: [{ label: "Produits", href: "/produits" }],
  },
  {
    id: "reference-ou-prix-produit",
    categoryId: "equipements-produits",
    question: "Comment obtenir une référence ou un prix ?",
    shortAnswer: "Via la demande produit ou le contact après qualification.",
    answer:
      "Indiquez la famille, la marque ou la référence visée, la quantité et le contexte. Un prix ou une alternative ne sont communiqués qu’après étude — pas depuis une fiche générique non validée.",
    audiences: ["all", "customer"],
    keywords: ["référence", "prix", "produit"],
    status: "verified",
    relatedLinks: [{ label: "Demande produit", href: "/produits/demande" }],
  },
  {
    id: "marque-precise",
    categoryId: "equipements-produits",
    question: "Peut-on demander une marque précise ?",
    shortAnswer: "Oui à indiquer — faisabilité à confirmer.",
    answer:
      "Vous pouvez préciser une marque ou une référence dans votre demande. Sa disponibilité dépend des sources mobilisables et des vérifications nécessaires. ONLOUTOU peut proposer une alternative si la référence n’est pas réalisable.",
    audiences: ["customer"],
    keywords: ["marque", "référence"],
    status: "verified",
    relatedLinks: [{ label: "Produits", href: "/produits" }],
  },
  {
    id: "neuf-ou-occasion",
    categoryId: "equipements-produits",
    question: "Peut-on demander du neuf ou de l’occasion ?",
    shortAnswer: "Les deux peuvent être étudiés selon famille et projet.",
    answer:
      "Neuf et occasion peuvent être envisagés selon la catégorie et les contraintes du client. Aucun état n’est garanti sans confirmation. Précisez votre préférence dans la demande.",
    audiences: ["customer"],
    keywords: ["neuf", "occasion"],
    status: "conditional",
    relatedLinks: [{ label: "Vente", href: "/solutions/vente" }],
  },
  {
    id: "installation-formation",
    categoryId: "equipements-produits",
    question: "L’installation ou la formation peut-elle être étudiée ?",
    shortAnswer: "Oui — faisabilité selon produit et périmètre.",
    answer:
      "Installation, mise en service ou formation peuvent être listées dans votre demande. Leur inclusion dépend du produit, de la zone et des conditions convenues. Rien n’est supposé inclus par défaut.",
    audiences: ["business", "customer"],
    keywords: ["installation", "formation"],
    status: "conditional",
    relatedLinks: [{ label: "Expertise", href: "/expertise" }],
  },
  {
    id: "livraison-disponible",
    categoryId: "livraison",
    question: "Le service de livraison est-il disponible ?",
    shortAnswer: deliveryPrep,
    answer: deliveryPrep + " Consultez la page Livraison pour le statut et les modalités de demande.",
    audiences: ["all", "customer"],
    keywords: ["livraison", "service", "disponible"],
    status: "conditional",
    relatedLinks: [{ label: "Livraison", href: "/livraison" }],
  },
  {
    id: "zones-livraison",
    categoryId: "livraison",
    question: "Quelles zones peuvent être étudiées ?",
    shortAnswer: "Selon dispositif et faisabilité — pas de carte universelle ici.",
    answer:
      "Les zones dépendent du type de bien, des moyens mobilisables et de l’organisation en vigueur. Aucune couverture nationale n’est affirmée sur ce site. Indiquez les lieux de collecte et de remise dans votre demande.",
    audiences: ["customer"],
    keywords: ["zone", "ville", "abidjan"],
    status: "conditional",
    relatedLinks: [{ label: "Demande livraison", href: "/livraison#demande-livraison" }],
  },
  {
    id: "biens-transportes",
    categoryId: "livraison",
    question: "Quels types de biens peuvent être transportés ?",
    shortAnswer: "Équipements et biens déclarés — refus des biens interdits ou non déclarés.",
    answer:
      "Seuls les biens correctement décrits et acceptés dans le cadre de la mission peuvent être transportés. Les biens interdits, dangereux ou non déclarés doivent être refusés. La faisabilité est confirmée après qualification.",
    audiences: ["customer"],
    keywords: ["colis", "équipement", "transport"],
    status: "verified",
    relatedLinks: [{ label: "Livraison", href: "/livraison" }],
  },
  {
    id: "prix-livraison",
    categoryId: "livraison",
    question: "Comment obtenir un prix de livraison ?",
    shortAnswer: "Après description du bien, des lieux et des contraintes.",
    answer:
      "Un montant dépend du bien, des adresses ou zones, du moyen nécessaire et des conditions d’accès. Il est communiqué après étude, pas via un tarif unique affiché sur ce site.",
    audiences: ["customer"],
    keywords: ["prix", "tarif livraison"],
    status: "verified",
    relatedLinks: [{ label: "Présenter mon besoin", href: "/livraison#demande-livraison" }],
  },
  {
    id: "besoin-recurrent",
    categoryId: "livraison",
    question: "Peut-on programmer un besoin récurrent ?",
    shortAnswer: "À étudier selon organisation — pas de promesse automatique.",
    answer:
      "Des besoins réguliers peuvent être discutés dans le cadre d’une relation qualifiée. Aucune récurrence n’est activée sans accord explicite sur le périmètre et les conditions.",
    audiences: ["business"],
    keywords: ["récurrent", "régulier"],
    status: "planned",
    relatedLinks: [{ label: "Contact", href: "/contact" }],
  },
  {
    id: "suivre-livraison",
    categoryId: "livraison",
    question: "Peut-on suivre une livraison ?",
    shortAnswer: "Selon dispositif — pas de suivi temps réel garanti ici.",
    answer:
      "Les modalités de suivi dépendent de l’organisation retenue et des outils effectivement en place. Ce site ne promet pas un suivi cartographique en direct pour chaque demande.",
    audiences: ["customer"],
    keywords: ["suivi", "tracking"],
    status: "conditional",
    relatedLinks: [{ label: "Livraison", href: "/livraison" }],
  },
  {
    id: "infos-livraison",
    categoryId: "livraison",
    question: "Quelles informations transmettre pour une livraison ?",
    shortAnswer: "Nature du bien, lieux, créneaux, contraintes d’accès et contact utile.",
    answer:
      "Décrivez le bien, les points de collecte et de remise, les contraintes (poids, dimensions, manutention), le calendrier souhaité et un contact joignable. Des précisions peuvent être demandées avant validation.",
    audiences: ["customer"],
    keywords: ["informations", "demande"],
    status: "verified",
    relatedLinks: [{ label: "Demande livraison", href: "/livraison#demande-livraison" }],
  },
  {
    id: "qui-peut-partenaire",
    categoryId: "partenaires",
    question: "Qui peut devenir partenaire ?",
    shortAnswer: "Fournisseurs, terrain, logistique, tech — selon qualification.",
    answer:
      "Entreprises et professionnels peuvent présenter une collaboration (fourniture, capacité terrain, logistique, technologie, etc.). Le profil doit correspondre aux besoins envisagés par ONLOUTOU. Aucune catégorie n’ouvre automatiquement un compte.",
    audiences: ["partner"],
    keywords: ["partenaire", "fournisseur"],
    status: "verified",
    relatedLinks: [{ label: "Partenaires", href: "/partenaires" }],
  },
  {
    id: "comment-devenir-partenaire",
    categoryId: "partenaires",
    question: "Comment devenir partenaire ?",
    shortAnswer: "Présenter l’organisation via Devenir partenaire.",
    answer:
      "Utilisez la page Devenir partenaire pour structurer votre proposition (activité, capacités, zone, type de collaboration). C’est une prise de contact, pas une inscription automatique. L’équipe étudie la pertinence avant toute suite.",
    audiences: ["partner"],
    keywords: ["devenir partenaire", "candidature"],
    status: "verified",
    relatedLinks: [{ label: "Devenir partenaire", href: "/devenir-partenaire" }],
  },
  {
    id: "candidature-garantit-collaboration",
    categoryId: "partenaires",
    question: "Une candidature garantit-elle une collaboration ?",
    shortAnswer: "Non.",
    answer:
      "Une proposition ne crée aucun engagement d’ONLOUTOU. Toute collaboration éventuelle dépend du besoin, des vérifications et de conditions formalisées séparément.",
    audiences: ["partner"],
    keywords: ["garantie", "collaboration"],
    status: "verified",
    relatedLinks: [{ label: "Devenir partenaire", href: "/devenir-partenaire" }],
  },
  {
    id: "proposer-produits-partenaire",
    categoryId: "partenaires",
    question: "Peut-on proposer des produits ?",
    shortAnswer: "Oui — validation avant publication.",
    answer:
      "Un partenaire peut présenter des produits ou capacités à mettre à disposition. Toute référence doit être qualifiée et validée avant diffusion. Le futur espace partenaire vise à structurer ce parcours lorsqu’il sera connecté.",
    audiences: ["partner"],
    keywords: ["produit", "catalogue partenaire"],
    status: "conditional",
    relatedLinks: [{ label: "Espace partenaire", href: "/espace-partenaire" }],
  },
  {
    id: "espace-partenaire-ouvert",
    categoryId: "partenaires",
    question: "L’espace partenaire est-il ouvert ?",
    shortAnswer:
      helpServiceAvailability.partnerPortal === "available"
        ? "Un accès peut être proposé aux profils validés."
        : "Prévisualisation publique seulement — pas de compte connecté.",
    answer:
      helpServiceAvailability.partnerPortal === "available"
        ? "Un portail peut être accessible aux organisations validées selon les conditions communiquées par ONLOUTOU."
        : "L’espace partenaire n’est pas ouvert comme service connecté au public. Une prévisualisation décrit les fonctions prévues. Aucune connexion ni donnée réelle n’est proposée depuis cette page.",
    audiences: ["partner"],
    keywords: ["espace partenaire", "portail"],
    status: "conditional",
    relatedLinks: [{ label: "Espace partenaire", href: "/espace-partenaire" }],
  },
  {
    id: "abonnements-partenaire",
    categoryId: "partenaires",
    question: "Les abonnements sont-ils disponibles ?",
    shortAnswer: "Non publiés — à confirmer.",
    answer:
      "Les plans, commissions et modes de paiement partenaires ne sont pas publiés sur ce site. Ils devront être validés avant toute ouverture commerciale du portail.",
    audiences: ["partner"],
    keywords: ["abonnement", "commission"],
    status: "planned",
    relatedLinks: [{ label: "Espace partenaire", href: "/espace-partenaire" }],
  },
  {
    id: "sponsoring-partenaire",
    categoryId: "partenaires",
    question: "Le sponsoring est-il disponible ?",
    shortAnswer: "Fonction à l’étude — non activée.",
    answer:
      "La mise en avant payante de produits reste à l’étude. Aucune campagne ni tarif n’est proposé depuis le site public.",
    audiences: ["partner"],
    keywords: ["sponsoring", "visibilité"],
    status: "planned",
    relatedLinks: [{ label: "Espace partenaire", href: "/espace-partenaire" }],
  },
  {
    id: "comment-devenir-livreur",
    categoryId: "livreurs",
    question: "Comment devenir livreur partenaire ?",
    shortAnswer: "Présenter le profil sur Devenir livreur.",
    answer:
      "Décrivez votre zone, votre moyen de transport et votre expérience via la page Devenir livreur. C’est une manifestation d’intérêt, pas une inscription ni une promesse de mission.",
    audiences: ["driver"],
    keywords: ["livreur", "devenir", "candidature"],
    status: "verified",
    relatedLinks: [{ label: "Devenir livreur", href: "/devenir-livreur" }],
  },
  {
    id: "moyens-transport-livreur",
    categoryId: "livreurs",
    question: "Quels moyens de transport peuvent être présentés ?",
    shortAnswer: "Ceux que vous pouvez réellement mobiliser — à confirmer.",
    answer:
      "Indiquez honnêtement le véhicule ou la mobilité que vous pouvez utiliser (vélo, moto, utilitaire, etc.). La pertinence dépend des besoins et des contraintes de mission — sans liste fermée garantie sur ce site.",
    audiences: ["driver"],
    keywords: ["véhicule", "moto", "transport"],
    status: "verified",
    relatedLinks: [{ label: "Devenir livreur", href: "/devenir-livreur" }],
  },
  {
    id: "documents-livreur",
    categoryId: "livreurs",
    question: "Quels documents pourront être demandés ?",
    shortAnswer: "Selon profil — via canal sécurisé si nécessaire.",
    answer:
      "Identité, permis ou autorisations applicables, documents du véhicule ou assurance peuvent être demandés selon le profil et la réglementation. La liste exacte est communiquée lors du processus, pas depuis cette FAQ générale.",
    audiences: ["driver"],
    keywords: ["document", "permis", "kyc"],
    status: "conditional",
    relatedLinks: [{ label: "Espace livreur", href: "/espace-livreur" }],
  },
  {
    id: "candidature-garantit-missions",
    categoryId: "livreurs",
    question: "Une candidature garantit-elle des missions ?",
    shortAnswer: "Non — aucun volume ni revenu garanti.",
    answer:
      "Une manifestation d’intérêt ne garantit ni compte, ni mission, ni revenu. Les missions dépendent des besoins réels et des conditions convenues.",
    audiences: ["driver"],
    keywords: ["mission", "garantie"],
    status: "verified",
    relatedLinks: [{ label: "Livraison", href: "/livraison" }],
  },
  {
    id: "revenus-livreur",
    categoryId: "livreurs",
    question: "Quels revenus peut-on attendre ?",
    shortAnswer: "Aucun revenu type n’est annoncé.",
    answer:
      "ONLOUTOU ne publie pas de revenu moyen, de bonus ou de commission livreur sur ce site. Les montants éventuels sont définis mission par mission ou dans un cadre contractuel séparé.",
    audiences: ["driver"],
    keywords: ["revenu", "salaire", "gain"],
    status: "verified",
    relatedLinks: [{ label: "Devenir livreur", href: "/devenir-livreur" }],
  },
  {
    id: "espace-livreur-disponible",
    categoryId: "livreurs",
    question: "L’espace livreur est-il disponible ?",
    shortAnswer:
      helpServiceAvailability.driverPortal === "available"
        ? "Accès selon profils validés."
        : "Prévisualisation publique — pas de compte connecté.",
    answer:
      helpServiceAvailability.driverPortal === "available"
        ? "Un accès peut être proposé aux livreurs dont la collaboration est validée."
        : "Seule une prévisualisation publique décrit les fonctions prévues (profil, disponibilités, missions). Aucun compte opérationnel n’est ouvert depuis cette page.",
    audiences: ["driver"],
    keywords: ["espace livreur", "application"],
    status: "conditional",
    relatedLinks: [{ label: "Espace livreur", href: "/espace-livreur" }],
  },
  {
    id: "app-mobile-livreur",
    categoryId: "livreurs",
    question: "Une application mobile existe-t-elle ?",
    shortAnswer: "Aucune application opérationnelle annoncée ici.",
    answer:
      "Une application dédiée pourra être envisagée avec le portail livreur. Aucune application n’est proposée au téléchargement depuis ce site à ce stade.",
    audiences: ["driver"],
    keywords: ["application", "mobile", "app"],
    status: "planned",
    relatedLinks: [{ label: "Espace livreur", href: "/espace-livreur" }],
  },
  {
    id: "projet-specifique",
    categoryId: "projets-plateformes",
    question: "ONLOUTOU peut-il étudier un projet spécifique ?",
    shortAnswer: "Oui — après qualification du besoin.",
    answer:
      "Appels d’offres, déploiements ou intégrations peuvent être étudiés si le périmètre est décrit clairement. Aucune acceptation automatique n’est promise. Présentez un brief via la page Projets.",
    audiences: ["business"],
    keywords: ["projet", "appel d'offres"],
    status: "verified",
    relatedLinks: [{ label: "Projets", href: "/projets" }],
  },
  {
    id: "demarrer-projet",
    categoryId: "projets-plateformes",
    question: "Comment démarre un projet ?",
    shortAnswer: "Prise de contact, qualification, puis étapes définies ensemble.",
    answer:
      "Le parcours commence par la description du contexte et des objectifs. ONLOUTOU précise ensuite les informations manquantes, les contraintes et la faisabilité avant toute phase d’exécution.",
    audiences: ["business"],
    keywords: ["démarrage", "processus"],
    status: "verified",
    relatedLinks: [{ label: "Brief projet", href: "/projets#brief-projet" }],
  },
  {
    id: "plateforme-sur-mesure",
    categoryId: "projets-plateformes",
    question: "Peut-on développer une plateforme sur mesure ?",
    shortAnswer: "À étudier — périmètre et faisabilité d’abord.",
    answer:
      "Des plateformes numériques peuvent être conçues selon le besoin, les intégrations et les contraintes. Aucune fonctionnalité n’est supposée disponible hors d’un cadrage validé. Voir Plateformes sur mesure.",
    audiences: ["business"],
    keywords: ["plateforme", "développement", "sur mesure"],
    status: "conditional",
    relatedLinks: [{ label: "Plateformes sur mesure", href: "/solutions/plateformes-sur-mesure" }],
  },
  {
    id: "qualification-besoins",
    categoryId: "projets-plateformes",
    question: "Comment les besoins sont-ils qualifiés ?",
    shortAnswer: "Échanges, précisions et vérifications selon le sujet.",
    answer:
      "ONLOUTOU clarifie le périmètre fonctionnel, technique, réglementaire et opérationnel avant engagement. Des documents ou ateliers peuvent être demandés. Les délais d’étude ne sont pas fixés globalement sur ce site.",
    audiences: ["business"],
    keywords: ["qualification", "besoin"],
    status: "verified",
    relatedLinks: [{ label: "Expertise", href: "/expertise" }],
  },
  {
    id: "delais-projet",
    categoryId: "projets-plateformes",
    question: "Les délais sont-ils définis avant l’étude ?",
    shortAnswer: "Non — estimés après cadrage.",
    answer:
      "Un calendrier sérieux dépend de la complexité, des dépendances et des validations client. Aucun délai standard n’est affiché ici. Une planification est proposée dans le cadre de l’étude.",
    audiences: ["business"],
    keywords: ["délai", "planning"],
    status: "verified",
    relatedLinks: [{ label: "Projets", href: "/projets" }],
  },
  {
    id: "preparer-appel-offres",
    categoryId: "projets-plateformes",
    question: "Quels éléments préparer pour un appel d’offres ?",
    shortAnswer: "Contexte, périmètre, contraintes, calendrier et critères de décision.",
    answer:
      "Rassemblez le cahier des charges ou une description structurée, les contraintes techniques, les interfaces attendues, le calendrier cible et les modalités de sélection. ONLOUTOU indiquera si le dossier est suffisant pour une première analyse.",
    audiences: ["business"],
    keywords: ["appel d'offres", "ao", "marché"],
    status: "verified",
    relatedLinks: [{ label: "Projets", href: "/projets" }],
  },
];

export const helpContactEscalation = {
  title: "Vous n’avez pas trouvé votre réponse ?",
  lead:
    "Présentez votre situation, les équipements concernés et les contraintes principales. L’équipe ONLOUTOU pourra vous orienter vers la prochaine étape appropriée.",
  primaryCta: { label: "Contacter ONLOUTOU", href: "/contact" },
  whatsappCta: { label: "Écrire sur WhatsApp" },
  whatsappMessage: `Bonjour ONLOUTOU,

Je n’ai pas trouvé la réponse à ma question dans le centre d’aide.

Sujet :
Contexte :
Service ou équipement concerné :
Question :`,
};

export function helpCenterWhatsappUrl() {
  return whatsappUrlForMessage(helpContactEscalation.whatsappMessage);
}

export function helpCenterBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Centre d’aide", item: `${baseUrl}/aide` },
    ],
  };
}

export function helpCenterFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: helpArticles.map((article) => ({
      "@type": "Question",
      name: article.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: article.answer,
      },
    })),
  };
}
