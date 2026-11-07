import { formatLegalDateFr, legalNoticeIsIndexable } from "@/content/legal";
import type { LegalDocumentStatus } from "@/types/legal";
import type { CookieInventoryItem, TrackingStatus } from "@/types/cookies";

export const cookiesPolicyStatus: LegalDocumentStatus = "awaiting-validation";

export const cookiesInventoryVersion = "2026-10-19.1";

export const cookiesLastAuditedAt = "2026-10-19";

export const cookiesLastUpdatedAt = "2026-11-05";

export const cookiesAuditEnvironment =
  "Build Next.js 16 en local (`npm run build` + `npm run start` sur http://localhost:3000)";

export const cookiesAuditBrowser = "Contrôle automatisé navigateur (Chromium) — contexte neuf par navigation";

export const cookiesAuditRoutes = [
  "/",
  "/produits",
  "/livraison",
  "/contact",
  "/aide",
  "/espace-partenaire",
  "/espace-livreur",
] as const;

export const cookiesAuditInteractions = [
  "Chargement initial de chaque route (sans interaction)",
  "Vérification document.cookie, localStorage, sessionStorage, IndexedDB, Cache Storage, iframes, scripts tiers",
  "Préremplissage produits : sessionStorage attendu uniquement après action de navigation dédiée (code source)",
];

export const cookiesAuditLimits = [
  "Hébergement de production et CDN non audités dans cet environnement",
  "Durées exactes des cookies serveur non attestées",
  "Cookies tiers possibles uniquement après ouverture volontaire d’un lien externe (WhatsApp, téléphone)",
  "Cette page ne constitue pas une validation juridique",
];

/**
 * Site public audité : pas d’analytics, pas de cookie HTTP applicatif.
 * sessionStorage fonctionnel (prefill) après navigation sur certains parcours.
 * Le choix du bandeau est enregistré dans localStorage (onloutou-cookie-choice).
 * Hébergeur prod : à confirmer.
 */
export const trackingStatus: TrackingStatus = "essential-only";

export const cookieChoiceStorageKey = "onloutou-cookie-choice";

export const cookiesPolicySeo = {
  title: "Politique relative aux cookies",
  description:
    "Consultez les informations relatives aux cookies, stockages et services tiers utilisés sur le site ONLOUTOU.",
};

export const cookiesPolicyBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Cookies" },
];

export const cookiesDraftBanner = {
  title: "Document en cours de validation",
  lead:
    "L’inventaire technique a été réalisé sur le site public actuel, mais certaines informations (notamment l’hébergement en production) restent à confirmer avant publication définitive.",
};

export const cookiesAuditStatusLabel: Record<TrackingStatus, string> = {
  "none-detected": "Aucun traceur non essentiel détecté",
  "essential-only": "Technologies nécessaires uniquement",
  "non-essential": "Préférences de consentement disponibles",
  "to-confirm": "Audit en cours de finalisation",
};

export const cookiesTocSections = [
  { id: "definition", title: "Qu’est-ce qu’un cookie ?" },
  { id: "audit", title: "Résultat du dernier audit" },
  { id: "technologies-utilisees", title: "Technologies utilisées" },
  { id: "categories", title: "Catégories" },
  { id: "services-tiers", title: "Services tiers" },
  { id: "preferences", title: "Préférences et consentement" },
  { id: "navigateurs", title: "Réglages du navigateur" },
  { id: "mise-a-jour", title: "Mise à jour" },
  { id: "contact", title: "Contact" },
] as const;

export const cookieInventory: CookieInventoryItem[] = [
  {
    id: "session-prefill-product",
    name: "onloutou-product-request-prefill",
    provider: "ONLOUTOU (site)",
    technology: "session-storage",
    category: "strictly-necessary",
    purpose: "Préremplir le configurateur produit après une navigation interne",
    domain: "Origine du site (sessionStorage)",
    duration: "Jusqu’à fermeture de l’onglet ou consommation par le configurateur",
    trigger: "Action utilisateur sur les parcours produits (ex. choix de famille ou d’usage)",
    required: false,
    active: true,
    status: "verified",
  },
  {
    id: "session-prefill-tools-family",
    name: "onloutou-tools-family",
    provider: "ONLOUTOU (site)",
    technology: "session-storage",
    category: "strictly-necessary",
    purpose: "Préremplir une demande d’équipements (famille)",
    domain: "Origine du site (sessionStorage)",
    duration: "Jusqu’à fermeture de l’onglet ou consommation",
    trigger: "Navigation dans les parcours outils / matériels",
    required: false,
    active: true,
    status: "verified",
  },
  {
    id: "session-prefill-tools-mode",
    name: "onloutou-tools-mode",
    provider: "ONLOUTOU (site)",
    technology: "session-storage",
    category: "strictly-necessary",
    purpose: "Préremplir le mode location ou acquisition",
    domain: "Origine du site (sessionStorage)",
    duration: "Jusqu’à fermeture de l’onglet ou consommation",
    trigger: "Choix de mode sur les pages équipements",
    required: false,
    active: true,
    status: "verified",
  },
  {
    id: "session-prefill-connected",
    name: "onloutou-connected-asset",
    provider: "ONLOUTOU (site)",
    technology: "session-storage",
    category: "strictly-necessary",
    purpose: "Préremplir une demande d’équipement connecté",
    domain: "Origine du site (sessionStorage)",
    duration: "Jusqu’à fermeture de l’onglet ou consommation",
    trigger: "Sélection d’un actif sur le parcours équipements connectés",
    required: false,
    active: true,
    status: "verified",
  },
  {
    id: "cookie-choice",
    name: "onloutou-cookie-choice",
    provider: "ONLOUTOU (site)",
    technology: "local-storage",
    category: "preferences",
    purpose: "Mémoriser le choix affiché dans le bandeau cookies, sans activer de mesure ni de publicité",
    domain: "Origine du site (localStorage)",
    duration: "Jusqu’à effacement par le visiteur ou par le navigateur",
    trigger: "Choix « Tout accepter », « Uniquement les nécessaires » ou enregistrement des préférences",
    required: false,
    active: true,
    status: "verified",
  },
  {
    id: "hosting-cookies",
    name: "Cookies d’hébergement / CDN (non identifiés)",
    provider: "Hébergeur ou CDN (à confirmer)",
    technology: "cookie",
    category: "unknown",
    purpose: "Fonctionnement technique possible côté infrastructure",
    domain: null,
    duration: null,
    trigger: "Visite du site en production",
    required: false,
    active: true,
    status: "to-confirm",
  },
];

export const cookiesProse = {
  definitionIntro:
    "Un cookie est un fichier ou identifiant qu’un site ou un service peut demander au navigateur d’enregistrer ou de relire. D’autres mécanismes peuvent avoir un effet comparable : stockage local, stockage de session, IndexedDB, identifiants techniques, pixels, scripts de mesure ou contenus intégrés depuis un tiers.",
  noneOnFirstLoad:
    "Lors du dernier audit en navigateur sur les routes publiques listées, aucun cookie HTTP n’a été observé dans `document.cookie` avant interaction, et aucun script tiers (analytics, réseaux sociaux, vidéo, carte) n’a été chargé automatiquement.",
  sessionStorageNote:
    "Des entrées de stockage de session peuvent apparaître uniquement après certaines navigations internes (configurateurs produits et équipements). Elles ne sont pas des cookies HTTP et ne sont pas utilisées pour de la publicité ou de la mesure d’audience dans le code audité.",
  noNonEssential:
    "Lors du dernier audit technique, aucun cookie ou traceur non essentiel déposé directement par le site public n’a été détecté avant interaction avec un service externe. Cette situation peut évoluer si de nouvelles fonctions, mesures d’audience, vidéos, cartes ou espaces connectés sont ajoutés.",
  consentNotRequired:
    "Le site n’utilise pas de cookie publicitaire ni d’outil de mesure d’audience. Le bandeau permet d’enregistrer votre choix dans le navigateur. Les technologies nécessaires, par exemple la reprise d’une demande dans le même onglet, restent actives.",
  whatsapp:
    "Le site ne charge pas de script WhatsApp avant votre action. Les boutons utilisent des liens (par exemple `wa.me`) ouvrant le service externe après un clic volontaire. Lorsque vous ouvrez le lien, vous quittez le site ONLOUTOU et le service applique ses propres conditions et technologies.",
  fonts:
    "Les polices sont intégrées via le mécanisme `next/font` : elles sont servies avec le site lors de l’audit local, sans requête vers des domaines Google observée au chargement des pages testées.",
  preferencesSection:
    "Le choix affiché dans le bandeau (tout accepter ou cookies nécessaires) est enregistré dans le stockage local du navigateur, sous la clé onloutou-cookie-choice. Il ne sert pas à de la publicité. Les saisies des formulaires restent dans la page tant qu’elles ne sont pas transmises.",
  browser:
    "Vous pouvez également limiter ou supprimer les cookies et stockages depuis les paramètres de votre navigateur. Les intitulés et menus varient selon les versions ; consultez l’aide officielle de votre navigateur pour la procédure à jour.",
  contact:
    "Pour toute question relative aux cookies ou aux technologies utilisées par le site, vous pouvez contacter ONLOUTOU en précisant l’objet de votre demande.",
  update:
    "L’inventaire sera revu en cas d’ajout de mesure d’audience, d’espace authentifié, de vidéo ou carte intégrée, de widget, de paiement, d’outil de support, de publicité ou d’un nouveau fournisseur.",
};

export function cookiesPolicyIsIndexable(status: LegalDocumentStatus = cookiesPolicyStatus): boolean {
  return legalNoticeIsIndexable(status);
}

export function cookiesPolicyBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Cookies", item: `${baseUrl}/cookies` },
    ],
  };
}

export function cookiesInventoryCounts() {
  const verified = cookieInventory.filter((i) => i.status === "verified" && i.active).length;
  const toConfirm = cookieInventory.filter((i) => i.status === "to-confirm").length;
  return { verified, toConfirm };
}

export function cookiesRequiresConsentManager(status: TrackingStatus = trackingStatus): boolean {
  return status === "non-essential";
}

export { formatLegalDateFr };
