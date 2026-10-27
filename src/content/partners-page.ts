import { site } from "@/content/site";
import { whatsappUrlForMessage } from "@/content/contact-page";
import { whatsappHref } from "@/content/whatsapp-journeys";
import type { ServiceFaqItem } from "@/types/services";

export const partnersHubSeo = {
  title: "Partenaires, fournisseurs et acteurs terrain",
  description:
    "Découvrez les formes de collaboration qu’ONLOUTOU peut étudier avec des fournisseurs, techniciens, acteurs logistiques, livreurs et partenaires technologiques.",
};

export const partnersPositioning =
  "ONLOUTOU étudie des collaborations avec des acteurs capables de fournir, déployer, exploiter ou accompagner des solutions utiles aux opérations.";

export const partnersIllustrationDisclaimer = "Illustration d’une collaboration opérationnelle.";

export const partnersMedia = {
  hero: {
    src: "/assets/images/menu/mega-menu-partenaires-livreurs.png",
    alt: "Coordination logistique : responsable et livreuse près d’un scooter et de colis",
    width: 1586,
    height: 992,
    objectPosition: "60% 52%",
  },
  stand: {
    src: "/assets/images/about/stand-exposition-onloutou.png",
    alt: "Deux participants devant un stand d’exposition ONLOUTOU",
    width: 1448,
    height: 1086,
    objectPosition: "50% 40%",
    caption: "Échange autour des activités ONLOUTOU.",
  },
  training: {
    src: "/assets/images/projects/project-b/formation-dispositif-connecte.png",
    alt: "Formation terrain à l’utilisation d’un dispositif connecté",
    width: 1536,
    height: 1024,
    objectPosition: "48% 38%",
  },
  logistics: {
    src: "/assets/images/projects/project-b/operation-logistique-depot-abidjan.png",
    alt: "Opération logistique avec véhicules dans un dépôt à Abidjan",
    width: 1536,
    height: 1024,
    objectPosition: "40% 32%",
  },
};

export const partnersHero = {
  eyebrow: "PARTENAIRES · TERRAIN · COLLABORATION",
  titleBefore: "Construire des collaborations ",
  titleHighlight: "utiles aux opérations.",
  intro:
    "ONLOUTOU étudie des collaborations avec des acteurs capables de proposer des équipements, des compétences, une présence terrain ou des services complémentaires.",
  caveat:
    "Toute collaboration fait l’objet d’une qualification, d’une validation et de conditions définies séparément.",
  primaryCta: { label: "Présenter ma proposition", href: "/devenir-partenaire" },
  secondaryCta: { label: "Explorer les profils", href: "#profils-partenaires" },
};

export const partnersContributions = {
  lead: "Une collaboration peut concerner une seule contribution ou associer plusieurs capacités.",
  items: ["Fournir", "Installer", "Transporter", "Intégrer", "Accompagner"] as const,
};

export type PartnerProfileId =
  | "suppliers"
  | "technicians"
  | "logistics"
  | "tech"
  | "commercial"
  | "operational";

export const partnersProfiles = {
  id: "profils-partenaires",
  title: "Plusieurs profils peuvent compléter un projet.",
  items: [
    {
      id: "suppliers" as PartnerProfileId,
      number: "01",
      title: "Fournisseurs et détenteurs d’équipements",
      points: ["Véhicules", "Motos", "Matériels", "Outils", "Équipements professionnels", "Dispositifs compatibles"],
      note: "Les catégories, conditions, documents et responsabilités sont vérifiés avant toute proposition.",
      visual: "schema" as const,
    },
    {
      id: "technicians" as PartnerProfileId,
      number: "02",
      title: "Techniciens et installateurs",
      points: ["Préparation", "Installation", "Raccordement", "Contrôle", "Paramétrage", "Maintenance prévue au contrat"],
      note: "Une intervention ne signifie pas automatiquement un statut de partenaire agréé.",
      visual: "training" as const,
    },
    {
      id: "logistics" as PartnerProfileId,
      number: "03",
      title: "Logistique et livraison",
      points: ["Transport", "Mise à disposition", "Récupération", "Livraison", "Suivi de mission", "Remontée d’information"],
      note: "Les conditions dépendent du projet et de la zone.",
      visual: "logistics" as const,
    },
    {
      id: "tech" as PartnerProfileId,
      number: "04",
      title: "Partenaires technologiques",
      points: ["Logiciels", "API", "Connectivité", "Matériel connecté", "Intégration", "Expertise complémentaire"],
      note: "Une intégration technique reste à étudier selon le projet et les accès disponibles.",
      visual: "schema" as const,
    },
    {
      id: "commercial" as PartnerProfileId,
      number: "05",
      title: "Partenaires commerciaux ou apporteurs d’opportunités",
      points: ["Besoins", "Prospects", "Projets", "Opportunités de collaboration"],
      note:
        "Toute rémunération, commission, exclusivité ou responsabilité doit être définie dans un accord distinct. Aucun avantage n’est acquis par la simple prise de contact.",
      visual: "schema" as const,
    },
    {
      id: "operational" as PartnerProfileId,
      number: "06",
      title: "Structures opérationnelles",
      points: [
        "Capacité terrain",
        "Connaissance locale",
        "Équipements",
        "Utilisateurs",
        "Contexte métier",
        "Accompagnement au déploiement",
      ],
      note: null,
      visual: "schema" as const,
    },
  ],
};

export const partnersRoleSplit = {
  title: "Des rôles différents, des responsabilités à préciser.",
  partner: {
    title: "Partenaire",
    definition:
      "Un partenaire peut proposer une capacité, un équipement, une compétence, une technologie ou une présence utile à un projet.",
    info: [
      "Identité de la structure",
      "Domaine d’activité",
      "Zone",
      "Capacités",
      "Références vérifiables",
      "Documents selon le contexte",
      "Disponibilité",
      "Conditions proposées",
    ],
  },
  delivery: {
    title: "Livreur ou opérateur terrain",
    definition:
      "Un livreur ou opérateur terrain peut intervenir sur une mission définie de transport, de mise à disposition, de récupération ou de remontée d’information.",
    hubLink: { label: "Devenir livreur partenaire", href: "/devenir-livreur" },
    info: [
      "Identité",
      "Zone d’intervention",
      "Moyen de déplacement",
      "Disponibilité",
      "Expérience",
      "Documents nécessaires",
      "Conditions de mission",
    ],
  },
  disclaimer: "La prise de contact ne constitue ni une mission, ni une embauche, ni une garantie d’activité.",
};

export const partnersCollaborationPath = {
  title: "Qualifier avant de collaborer.",
  steps: [
    { title: "Présenter", description: "Le demandeur décrit son activité, ses capacités et la collaboration recherchée." },
    { title: "Vérifier", description: "Les informations, documents et conditions nécessaires sont examinés selon le contexte." },
    { title: "Évaluer", description: "ONLOUTOU étudie la pertinence, la capacité et les risques opérationnels." },
    { title: "Tester si nécessaire", description: "Une première intervention ou un pilote peut être défini lorsque cela est pertinent." },
    { title: "Formaliser", description: "Les rôles, responsabilités, conditions et modalités sont documentés." },
    { title: "Suivre", description: "La collaboration est évaluée selon les engagements prévus." },
  ],
};

export const partnersVerification = {
  title: "La collaboration repose sur des éléments vérifiables.",
  items: [
    "Activité réelle",
    "Capacité opérationnelle",
    "Disponibilité",
    "Zone",
    "Qualité",
    "Conformité documentaire selon le contexte",
    "Sécurité",
    "Confidentialité",
    "Traçabilité",
    "Communication",
    "Responsabilité",
    "Respect des engagements convenus",
  ],
  note: "Les critères applicables dépendent du type de collaboration et du projet.",
};

export const partnersFutureSpaces = {
  id: "espaces-partenaires",
  title: "Préparer des espaces adaptés à chaque rôle.",
  disclaimer:
    "Aperçu conceptuel — ces espaces ne sont pas encore présentés comme des services ouverts au public.",
  partnerSpace: {
    label: "Futur espace partenaire",
    previewHref: "/espace-partenaire",
    previewCta: "Voir l’aperçu complet",
    features: [
      "Profil de la structure",
      "Capacités déclarées",
      "Documents",
      "Opportunités",
      "Demandes",
      "Propositions",
      "Suivi",
      "Échanges",
      "Historique",
    ],
  },
  deliverySpace: {
    label: "Futur espace livreur",
    previewHref: "/espace-livreur",
    previewCta: "Voir l’aperçu complet",
    features: [
      "Profil",
      "Zone",
      "Disponibilité",
      "Missions proposées",
      "Détails d’intervention",
      "Statuts",
      "Preuve ou confirmation",
      "Historique",
    ],
  },
};

export const partnersPrinciples = [
  "Clarté des rôles",
  "Informations vérifiables",
  "Sécurité des interventions",
  "Respect des utilisateurs",
  "Confidentialité",
  "Traçabilité",
  "Communication",
  "Qualité",
  "Amélioration continue",
] as const;

export const partnersInterestOptions = {
  profiles: [
    { id: "supplier", label: "fournisseur d’équipements" },
    { id: "owner", label: "propriétaire ou gestionnaire de véhicules" },
    { id: "tech", label: "technicien ou installateur" },
    { id: "logistics", label: "logistique ou livraison" },
    { id: "partner-tech", label: "partenaire technologique" },
    { id: "commercial", label: "partenaire commercial" },
    { id: "ops", label: "structure opérationnelle" },
    { id: "other", label: "autre" },
  ],
  proposals: [
    { id: "supply", label: "fournir du matériel" },
    { id: "field", label: "proposer une capacité terrain" },
    { id: "install", label: "installer ou maintenir" },
    { id: "deliver", label: "livrer ou transporter" },
    { id: "integrate", label: "intégrer une technologie" },
    { id: "opp", label: "présenter une opportunité" },
    { id: "support", label: "accompagner un projet" },
    { id: "other", label: "autre proposition" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "autre ville de Côte d’Ivoire" },
    { id: "multi", label: "plusieurs zones" },
    { id: "other", label: "autre pays ou zone à préciser" },
  ],
  statuses: [
    { id: "company", label: "entreprise" },
    { id: "pro", label: "professionnel indépendant" },
    { id: "org", label: "association ou structure" },
    { id: "equipped", label: "particulier équipé" },
    { id: "tbd", label: "statut à préciser" },
  ],
  capacities: [
    { id: "once", label: "intervention ponctuelle" },
    { id: "regular", label: "capacité régulière" },
    { id: "multi-equip", label: "plusieurs équipements" },
    { id: "multi-people", label: "plusieurs personnes" },
    { id: "tbd", label: "capacité à préciser" },
  ],
  goals: [
    { id: "offer", label: "présenter une offre" },
    { id: "contact", label: "être contacté pour des projets" },
    { id: "collab", label: "proposer une collaboration" },
    { id: "conditions", label: "comprendre les conditions" },
    { id: "other", label: "autre" },
  ],
};

export function buildPartnerInterestSummary(s: {
  profileLabel: string;
  proposalLabel: string;
  zoneLabel: string;
  statusLabel: string;
  capacityLabel: string;
  goalLabel: string;
}) {
  return `Je souhaite présenter une proposition en tant que ${s.profileLabel}. Je peux ${s.proposalLabel} dans la zone ${s.zoneLabel}. Statut : ${s.statusLabel}. Capacité : ${s.capacityLabel}. Mon objectif est de ${s.goalLabel}.`;
}

export function buildPartnerWhatsAppUrl(s: Parameters<typeof buildPartnerInterestSummary>[0]) {
  const summary = buildPartnerInterestSummary(s);
  return whatsappUrlForMessage(`Bonjour ONLOUTOU, ${summary} Pouvez-vous m’indiquer la suite du processus ?`);
}

export const partnersFaq: ServiceFaqItem[] = [
  {
    question: "Qui peut proposer une collaboration ?",
    answer:
      "Une entreprise, un professionnel, une structure ou un acteur disposant d’une capacité utile peut présenter une proposition. Son admissibilité dépend du besoin et des vérifications applicables.",
  },
  {
    question: "L’envoi d’une proposition garantit-il une collaboration ?",
    answer: "Non. Toute proposition doit être analysée et ne crée aucun engagement automatique.",
  },
  {
    question: "Existe-t-il une commission standard ?",
    answer:
      "Aucune commission ne doit être annoncée sans accord spécifique. Les conditions financières éventuelles sont définies séparément.",
  },
  {
    question: "L’espace partenaire est-il déjà accessible ?",
    answer:
      "Non. Les fonctionnalités présentées sur cette page sont conceptuelles. Aucun espace partenaire connecté n’est ouvert au public à ce stade.",
  },
  {
    question: "L’espace livreur est-il déjà ouvert ?",
    answer:
      "Non. Aucune inscription active ni espace livreur fonctionnel n’est proposé depuis cette page.",
  },
  {
    question: "Quels documents peuvent être demandés ?",
    answer:
      "Les documents dépendent du profil, de la mission, du matériel et des exigences applicables. Ils sont demandés uniquement dans un cadre défini.",
  },
  {
    question: "Les partenaires reçoivent-ils automatiquement des missions ?",
    answer: "Non. Une qualification ou un accord ne garantit pas un volume de mission.",
  },
  {
    question: "Peut-on proposer des équipements ?",
    answer:
      "Oui, une proposition peut être présentée, mais la catégorie, l’état, les caractéristiques, les documents et les conditions doivent être évalués.",
  },
];

export const partnersEditorialNotice =
  "Cette page présente des formes possibles de collaboration. Elle ne constitue ni un appel d’offres, ni une offre d’emploi, ni un contrat, ni une promesse de mission, de revenu ou de commission. Toute relation éventuelle fait l’objet d’une validation et de conditions distinctes.";

export const partnersFinalCta = {
  titleBefore: "Une collaboration utile commence par ",
  titleHighlight: "une proposition claire.",
  lead:
    "Présentez votre activité, votre capacité, votre zone et le type de collaboration recherché. ONLOUTOU pourra déterminer si un échange plus approfondi est pertinent.",
  primary: { label: "Présenter ma proposition", href: "/devenir-partenaire" },
  secondary: { label: "Parler à ONLOUTOU", href: "/contact" },
};

export const partnersBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Partenaires" },
];

export function partnersBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Partenaires", item: `${baseUrl}/partenaires` },
    ],
  };
}

export function partnersWebPageJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: partnersHubSeo.title,
    description: partnersHubSeo.description,
    url: `${baseUrl}/partenaires`,
    isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  };
}

/* —— Hub cartes (accueil + sous-pages) —— */

export const partnersSeo = partnersHubSeo;

export const partnerHubCards = [
  {
    id: "fournisseurs",
    title: "Fournisseurs & propriétaires",
    summary:
      "Proposer des équipements, des véhicules ou des matériels — qualification et conditions à définir.",
    href: "/partenaires#profils-partenaires",
    cta: "Voir les profils",
  },
  {
    id: "livreurs",
    title: "Livreurs & logistique",
    summary: "Transport, livraison et remontée d’information selon mission et zone.",
    href: "/devenir-partenaire",
    cta: "Présenter une proposition",
  },
  {
    id: "technologiques",
    title: "Partenaires technologiques",
    summary: "Technologies, intégrations et expertise complémentaire étudiées par projet.",
    href: "/partenaires#espaces-partenaires",
    cta: "Futurs espaces",
  },
];

export const supplierPage = {
  seo: {
    title: "Partenaires fournisseurs",
    description:
      "Proposer des équipements en location ou à la vente avec ONLOUTOU — processus général et contact.",
  },
  heroHighlight: "fournisseurs",
  intro:
    "Vous disposez d’équipements à mettre à disposition ou à vendre : ONLOUTOU peut structurer la relation, qualifier les demandes et coordonner la mise en relation.",
  points: [
    "Proposer des équipements en location ou à la vente",
    "Transmettre des informations techniques et des visuels autorisés",
    "Répondre aux demandes qualifiées selon vos disponibilités",
    "Préparer, à terme, la gestion des disponibilités dans les futurs espaces connectés",
  ],
  notice:
    "Aucun volume de demandes, revenu, commission ou délai de paiement n’est garanti. Les modalités sont définies contractuellement.",
  whatsapp: whatsappHref("partnerSupplier"),
};

export const deliveryPage = {
  seo: {
    title: "Partenaires livreurs",
    description:
      "Réseau de livraison et logistique ONLOUTOU — missions possibles et prise de contact.",
  },
  heroHighlight: "livreurs",
  intro:
    "ONLOUTOU prépare un réseau de partenaires pour la livraison, le retrait et le retour d’équipements, avec remontée de statut.",
  missions: [
    "Récupération et livraison",
    "Retour et vérification visuelle",
    "Preuve de remise (selon processus convenu)",
    "Remontée du statut de mission",
  ],
  notice:
    "Aucune promesse de revenus, de fréquence de missions ou de délai de paiement. Contact via WhatsApp ou téléphone pour une première prise de contact.",
  whatsapp: whatsappHref("partnerDelivery"),
};

export const techPage = {
  seo: {
    title: "Partenaires technologiques",
    description:
      "Intégrateurs, installateurs GPS/IoT, maintenance et experts mobilisables sur les projets ONLOUTOU.",
  },
  heroHighlight: "technologiques",
  intro:
    "Compléter les déploiements clients : matériel, connectivité, intégration, développement ou maintenance selon les projets.",
  profiles: [
    "Intégrateurs et installateurs GPS / IoT",
    "Fournisseurs de matériel et connectivité",
    "Professionnels de maintenance",
    "Développeurs ou experts mobilisables selon projet",
    "Partenaires d’infrastructure selon besoin",
  ],
  notice:
    "La nature contractuelle (sous-traitance, partenariat commercial, mission ponctuelle) est précisée pour chaque collaboration.",
  whatsapp: whatsappHref("partnerTech"),
};
