import type { DeploymentPhase } from "@/types/content";
import type { ServiceFaqItem } from "@/types/services";

export type PartnerPortalStatus = "planned" | "in-development" | "pilot" | "available";

export type PartnerModuleStatus =
  | "planned"
  | "in-development"
  | "pilot"
  | "available"
  | "to-confirm";

/** Audit : pas d’auth, API partenaire, ni portail privé dans le dépôt. */
export const partnerPortalStatus: PartnerPortalStatus = "in-development";

export const partnerPortalRealUrl: string | null = null;

export const partnerPortalSeo = {
  title: "Espace partenaire en préparation",
  description:
    "Découvrez l’aperçu du futur espace partenaire ONLOUTOU pour structurer les profils, produits, collaborations et outils de gestion.",
};

export const partnerPortalBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Espace partenaire" },
];

export const partnerPortalHero = {
  eyebrow: "ESPACE PARTENAIRE",
  badge: "En préparation",
  titleBefore: "Piloter ses offres et ses collaborations depuis ",
  titleHighlight: "un même espace.",
  intro:
    "ONLOUTOU prépare un environnement permettant aux partenaires de structurer leur profil, leurs produits, leurs disponibilités et leurs échanges.",
  primaryCta: { label: "Devenir partenaire", href: "/devenir-partenaire" },
  secondaryCta: { label: "Découvrir l’aperçu", href: "#apercu-espace-partenaire" },
};

export const partnerPortalPreviewSection = {
  id: "apercu-espace-partenaire",
  disclaimer: "Prévisualisation conceptuelle — aucune donnée partenaire réelle",
  topBar: { brand: "ONLOUTOU", context: "ESPACE PARTENAIRE", tag: "Prévisualisation" },
};

export type PartnerPreviewTabId = "overview" | "products" | "product-form";

export const partnerPreviewTabs: { id: PartnerPreviewTabId; label: string }[] = [
  { id: "overview", label: "Vue d’ensemble" },
  { id: "products", label: "Gestion des produits" },
  { id: "product-form", label: "Ajout d’un produit" },
];

export type PartnerNavItemId =
  | "overview"
  | "products"
  | "add-product"
  | "orders"
  | "statistics"
  | "subscription"
  | "sponsoring"
  | "settings"
  | "support";

export function moduleStatusLabel(status: PartnerModuleStatus): string {
  const map: Record<PartnerModuleStatus, string> = {
    planned: "Prévu",
    "in-development": "Aperçu",
    pilot: "Pilote",
    available: "Disponible",
    "to-confirm": "À confirmer",
  };
  return map[status];
}

export const partnerPortalModules = [
  { id: "overview" as PartnerNavItemId, label: "Vue d’ensemble", status: "in-development" as PartnerModuleStatus },
  { id: "products" as PartnerNavItemId, label: "Produits", status: "in-development" as PartnerModuleStatus },
  { id: "add-product" as PartnerNavItemId, label: "Ajouter un produit", status: "in-development" as PartnerModuleStatus },
  { id: "orders" as PartnerNavItemId, label: "Commandes", status: "planned" as PartnerModuleStatus },
  { id: "statistics" as PartnerNavItemId, label: "Statistiques", status: "planned" as PartnerModuleStatus },
  { id: "subscription" as PartnerNavItemId, label: "Abonnement", status: "to-confirm" as PartnerModuleStatus },
  { id: "sponsoring" as PartnerNavItemId, label: "Sponsoring", status: "to-confirm" as PartnerModuleStatus },
  { id: "settings" as PartnerNavItemId, label: "Paramètres", status: "planned" as PartnerModuleStatus },
  { id: "support" as PartnerNavItemId, label: "Assistance", status: "planned" as PartnerModuleStatus },
];

export const partnerModuleMatrix = [
  { module: "Profil", function: "Informations de l’organisation", status: "En développement" },
  { module: "Produits", function: "Création et gestion", status: "En développement" },
  { module: "Commandes", function: "Suivi des demandes", status: "Prévu" },
  { module: "Statistiques", function: "Indicateurs réels", status: "Prévu" },
  { module: "Documents", function: "Informations administratives", status: "Prévu" },
  { module: "Abonnement", function: "Plans et conditions", status: "À confirmer" },
  { module: "Sponsoring", function: "Mise en avant de produits", status: "À confirmer" },
  { module: "Paiements", function: "Transactions et historique", status: "À confirmer" },
  { module: "Paramètres", function: "Utilisateurs et préférences", status: "Prévu" },
  { module: "Assistance", function: "Aide et accompagnement", status: "Prévu" },
];

export const partnerDashboardPreview = {
  cards: [
    { title: "Profil partenaire", value: "Statut : à compléter" },
    { title: "Catalogue", value: "Aucun produit publié dans cet aperçu" },
    { title: "Documents", value: "Étape prévue après qualification" },
  ],
  actionsTitle: "Prochaines actions",
  actions: [
    "Présenter l’organisation",
    "Définir les familles d’offres",
    "Identifier les zones",
    "Préparer les informations utiles",
  ],
  activityTitle: "Activité de l’espace",
  activityEmpty:
    "Les activités, commandes et échanges apparaîtront ici lorsque le portail sera connecté à des données réelles.",
  modulesTitle: "Modules prévus",
  moduleChips: ["produits", "commandes", "statistiques", "documents", "assistance"],
};

export const partnerProductsPreview = {
  title: "Gestion des produits",
  lead: "Structure prévue pour organiser les produits, leurs statuts et leur disponibilité.",
  addLabel: "Ajouter un produit",
  empty: "Aucun produit réel n’est chargé dans cette prévisualisation.",
  columns: [
    "Produit",
    "Catégorie",
    "Mode",
    "Statut",
    "Disponibilité",
    "Dernière mise à jour",
    "Actions",
  ],
  demoRow: {
    product: "Exemple de structure",
    category: "Catégorie à définir",
    mode: "Mode à définir",
    status: "Brouillon",
    availability: "Non publié",
    updated: "—",
    actions: "Aperçu uniquement",
    tag: "Démonstration",
  },
  futureActions: ["modifier", "prévisualiser", "activer", "désactiver", "archiver"],
};

export const partnerProductFormPreview = {
  title: "Structure prévue pour ajouter un produit",
  notice: "Ce formulaire est une prévisualisation. Aucune information n’est enregistrée.",
  steps: [
    {
      title: "Informations générales",
      fields: ["nom du produit", "famille", "sous-catégorie", "description", "mode proposé"],
      modes: ["location", "acquisition", "les deux", "à confirmer"],
    },
    {
      title: "Images",
      slots: ["Image principale", "Image 2", "Image 3", "Image 4"],
    },
    {
      title: "Disponibilité",
      fields: [
        "disponible sur demande",
        "période",
        "jours",
        "horaires",
        "disponibilité à confirmer",
      ],
    },
    {
      title: "Informations complémentaires",
      fields: [
        "marque",
        "modèle",
        "état",
        "année",
        "caractéristiques",
        "instructions",
        "accessoires",
      ],
    },
  ],
  previewPanel: {
    title: "Aperçu du produit",
    lines: ["Nom à renseigner", "Description à renseigner", "Prix à confirmer", "Disponibilité à confirmer"],
  },
  buttons: ["Enregistrer comme brouillon", "Prévisualiser", "Soumettre pour validation"],
  disconnectedNotice: "Fonction disponible lorsque le portail sera connecté.",
};

export const partnerSubscriptionSection = {
  title: "Abonnements et conditions commerciales",
  status: "À confirmer",
  lead:
    "La structure des plans, les fonctions incluses, les commissions et les modes de paiement devront être validés avant leur publication.",
  criteria: [
    "nombre de produits",
    "accès aux statistiques",
    "outils de gestion",
    "nombre d’utilisateurs",
    "assistance",
    "visibilité",
    "intégrations",
  ],
};

export const partnerSponsoringSection = {
  title: "Mise en avant des produits",
  status: "Fonction à l’étude",
  lead:
    "Un futur module pourra permettre de demander une mise en avant limitée dans le temps, sous réserve de règles de visibilité, de prix et de validation encore à définir.",
  steps: [
    "Choisir un produit",
    "Définir une période",
    "Consulter les conditions",
    "Confirmer la demande",
    "Suivre les résultats",
  ],
};

export const partnerPortalJourneyPhases: DeploymentPhase[] = [
  { step: "01", title: "Présenter", description: "Transmettre les informations générales." },
  { step: "02", title: "Échanger", description: "Clarifier l’offre et le type de collaboration." },
  { step: "03", title: "Qualifier", description: "Identifier produits, services, zones et contraintes." },
  { step: "04", title: "Vérifier", description: "Examiner les informations et documents applicables." },
  { step: "05", title: "Valider", description: "Confirmer les conditions de collaboration." },
  { step: "06", title: "Activer", description: "Ouvrir un accès lorsque le portail sera réellement disponible." },
];

export const partnerJourneyNotice =
  "Une candidature ne garantit pas automatiquement l’ouverture d’un compte partenaire.";

export const partnerSecuritySection = {
  title: "Un espace partenaire doit protéger les données de chaque organisation.",
  items: [
    "authentification sécurisée",
    "comptes nominatifs",
    "séparation entre organisations",
    "rôles",
    "permissions",
    "protection des documents",
    "historique des actions sensibles",
    "révocation des accès",
    "validation des changements importants",
  ],
  notice:
    "Ces mécanismes doivent être implémentés et vérifiés avant l’ouverture du portail. La prévisualisation publique ne contient aucune donnée réelle.",
};

export const partnerJourneySection = {
  title: "Avant l’accès, la collaboration doit être qualifiée.",
};

export const partnerOrientationSection = {
  become: {
    title: "Je souhaite devenir partenaire",
    lead: "Présentez votre organisation, vos produits, vos services et le type de collaboration recherché.",
    cta: { label: "Devenir partenaire", href: "/devenir-partenaire" },
  },
  existing: {
    title: "Je suis déjà en échange avec ONLOUTOU",
    lead: "Utilisez les coordonnées déjà communiquées ou contactez l’équipe pour connaître les prochaines étapes.",
    cta: { label: "Contacter ONLOUTOU", href: "/contact" },
  },
};

export const partnerPortalFaq: ServiceFaqItem[] = [
  {
    question: "L’espace partenaire est-il déjà disponible ?",
    answer: "Non. Seule une prévisualisation publique est proposée. Aucun compte connecté n’est ouvert.",
  },
  {
    question: "À qui sera-t-il destiné ?",
    answer: "Aux organisations et professionnels dont la collaboration avec ONLOUTOU aura été qualifiée.",
  },
  {
    question: "Comment devenir partenaire ?",
    answer: "Présentez votre organisation via la page Devenir partenaire avant toute activation d’accès.",
  },
  {
    question: "Pourra-t-on ajouter des produits ?",
    answer: "Un module produits est en préparation. Les références devront être validées avant publication.",
  },
  {
    question: "Les produits seront-ils publiés immédiatement ?",
    answer: "Non. Une validation est prévue avant toute mise en ligne ou diffusion.",
  },
  {
    question: "Y aura-t-il des abonnements ?",
    answer:
      "Les abonnements, commissions et moyens de paiement ne sont pas encore publiés. Ils devront être validés avant l’ouverture commerciale du portail.",
  },
  {
    question: "Le sponsoring est-il disponible ?",
    answer: "Non. La mise en avant payante reste à l’étude et à confirmer.",
  },
  {
    question: "Quels moyens de paiement seront proposés ?",
    answer: "Aucun moyen de paiement n’est annoncé tant que le cadre légal et technique n’est pas validé.",
  },
  {
    question: "Quels documents seront demandés ?",
    answer: "La liste dépendra du profil partenaire et sera communiquée via un canal sécurisé.",
  },
  {
    question: "Comment les données seront-elles protégées ?",
    answer: "Des mécanismes d’authentification, de rôles et de séparation des organisations sont prévus avant ouverture.",
  },
];

export const partnerPortalFinalCta = {
  eyebrow: "COLLABORER AVEC ONLOUTOU",
  title: "Le futur espace commence par une collaboration bien définie.",
  lead: "Présentez votre organisation et vos capacités afin de préparer les prochaines étapes avec ONLOUTOU.",
  primary: { label: "Présenter mon organisation", href: "/devenir-partenaire" },
  secondary: { label: "Découvrir les partenaires", href: "/partenaires" },
  contact: { label: "Nous contacter", href: "/contact" },
  help: { label: "Centre d’aide", href: "/aide" },
};

export function partnerPortalBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Partenaires", item: `${baseUrl}/partenaires` },
      { "@type": "ListItem", position: 3, name: "Espace partenaire", item: `${baseUrl}/espace-partenaire` },
    ],
  };
}
