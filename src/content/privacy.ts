import { formatLegalDateFr, legalEntityInformation, legalNoticeIsIndexable } from "@/content/legal";
import type { LegalDocumentStatus } from "@/types/legal";
import type {
  DataProcessingActivity,
  ThirdPartyService,
  TrackingStatus,
} from "@/types/privacy";

export const privacyPolicyStatus: LegalDocumentStatus = "awaiting-validation";

export const privacyPolicyLastUpdated = "2026-11-05";

export const privacyPolicySeo = {
  title: "Politique de confidentialité",
  description:
    "Consultez les informations relatives au traitement des données personnelles sur le site ONLOUTOU.",
};

export const privacyPolicyBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Confidentialité" },
];

export const privacyDraftBanner = {
  title: "Document en cours de validation",
  lead:
    "L’inventaire technique des traitements a été préparé, mais certaines informations juridiques ou organisationnelles doivent encore être confirmées avant publication définitive.",
};

/** Aligné sur l’audit cookies 2026-10-19 — sessionStorage fonctionnel ; pas d’analytics ; hébergeur prod à confirmer. */
export const trackingStatus: TrackingStatus = "essential-only";

export const privacyTocSections = [
  { id: "responsable", title: "Responsable du traitement" },
  { id: "champ-application", title: "Champ d’application" },
  { id: "donnees-traitees", title: "Données traitées" },
  { id: "finalites", title: "Finalités" },
  { id: "formulaires-whatsapp", title: "Formulaires et WhatsApp" },
  { id: "services-tiers", title: "Services tiers" },
  { id: "cookies", title: "Cookies et stockage local" },
  { id: "durees", title: "Durées de conservation" },
  { id: "destinataires", title: "Destinataires" },
  { id: "transferts", title: "Transferts hors du pays" },
  { id: "securite", title: "Sécurité" },
  { id: "droits", title: "Droits des personnes" },
  { id: "mineurs", title: "Mineurs" },
  { id: "modifications", title: "Modifications" },
  { id: "contact-confidentialite", title: "Contact confidentialité" },
] as const;

export const privacyProse = {
  scope: `Cette politique concerne le site public ONLOUTOU et les fonctionnalités réellement accessibles lors de votre visite (pages d’information, configurateurs de demande, liens de contact). Des applications, espaces connectés ou portails partenaires et livreurs pourront faire l’objet d’informations complémentaires ou d’une mise à jour de cette politique avant leur mise en service.`,
  portalPreview: `Les pages présentant les futurs espaces partenaire et livreur sont actuellement des prévisualisations. Elles ne permettent pas de créer un compte, de déposer un document, de recevoir une mission ou d’effectuer un paiement.`,
  whatsappForms: `Certains formulaires du site préparent un message destiné à WhatsApp. Tant que l’utilisateur n’active pas le lien d’envoi, les informations saisies restent en principe dans le navigateur (mémoire de la page) et ne sont pas transmises à un serveur ONLOUTOU identifié dans le code actuel du site. Lorsque le formulaire est rempli, le message peut être encodé dans l’adresse du lien affiché avant l’envoi. Après ouverture ou envoi dans WhatsApp, le traitement dépend du service utilisé et de ses propres conditions.`,
  noServerForms: `À la date de l’audit technique du dépôt, aucun envoi de formulaire vers une API ONLOUTOU n’a été identifié : les demandes passent par téléphone, WhatsApp ou navigation sur le site.`,
  cookiesIntro: `Les cookies et stockages sont décrits dans la politique dédiée. Aucun outil de mesure d’audience ni de publicité n’est activé par le site. Un bandeau enregistre le choix du visiteur dans le navigateur. Un stockage de session peut préremplir certains configurateurs entre deux pages. Les cookies éventuellement déposés par l’hébergeur ou le CDN en production restent à confirmer.`,
  retentionPending: `Durées de conservation à formaliser avant validation juridique. Les messages conservés dans WhatsApp ou dans votre messagerie ne constituent pas un stockage géré par le site ONLOUTOU.`,
  transfersPending: `Transferts et garanties à confirmer. L’utilisation de WhatsApp, d’un hébergeur ou d’autres prestataires peut impliquer des traitements dans plusieurs pays ; la localisation exacte et les garanties applicables n’ont pas été validées dans le cadre de cette version.`,
  security: `ONLOUTOU cherche à limiter les données traitées et à appliquer des mesures adaptées au fonctionnement du site (par exemple diffusion en HTTPS lorsque l’hébergement le permet, absence de collecte serveur identifiée pour les configurateurs audités). Aucun système ne peut toutefois garantir une sécurité absolue.`,
  rightsIntro: `Selon le cadre applicable, vous pouvez disposer de droits relatifs à vos données (information, accès, rectification, opposition, effacement, limitation, etc.). Les modalités précises, délais de réponse et autorité compétente doivent être confirmés juridiquement avant publication définitive.`,
  rightsContact: `Pour toute question relative à la confidentialité ou aux données personnelles, vous pouvez contacter ONLOUTOU en précisant l’objet de votre demande. Ne communiquez pas de données sensibles (pièce d’identité, mot de passe, coordonnées bancaires, etc.) via des canaux non sécurisés.`,
  minors: `Les services et formulaires du site s’adressent principalement à des personnes capables de formuler un besoin professionnel ou une demande de collaboration. Les conditions d’âge ou d’éligibilité pour devenir partenaire ou livreur relèvent des règles du service concerné, à définir lors de l’ouverture des parcours dédiés.`,
  changes: `Cette politique peut évoluer lorsque le site change, qu’un nouveau formulaire est activé, qu’un espace privé ouvre, qu’un outil de mesure est ajouté, qu’un service tiers change ou qu’une obligation applicable évolue.`,
};

export const privacyDataCategories: { title: string; items: string[]; status: "verified" | "to-confirm" }[] = [
  {
    title: "Données fournies volontairement (configurateurs et contact)",
    status: "verified",
    items: [
      "Nom ou structure (selon formulaire)",
      "Téléphone ou moyen de contact",
      "Ville, zone ou lieu",
      "Description du besoin, type d’équipement ou de livraison",
      "Quantités, budget, délais, contraintes indiqués dans les champs libres",
    ],
  },
  {
    title: "Données techniques (hébergement)",
    status: "to-confirm",
    items: [
      "Adresse IP, journaux de requêtes, horodatage",
      "Type de navigateur ou d’appareil (selon journaux serveur)",
    ],
  },
  {
    title: "Données de navigation (mesure d’audience)",
    status: "verified",
    items: ["Non collectées par un outil d’analytics identifié dans le code source actuel"],
  },
  {
    title: "Données issues des échanges externes",
    status: "verified",
    items: [
      "Contenu des messages WhatsApp après envoi par l’utilisateur",
      "Contenu des appels téléphoniques (hors périmètre du site)",
    ],
  },
];

export const privacyPurposes: { label: string; status: "verified" | "to-confirm" }[] = [
  { label: "Répondre à une demande ou une prise de contact", status: "verified" },
  { label: "Qualifier un besoin (produits, équipements, livraison)", status: "verified" },
  { label: "Préparer une candidature partenaire ou livreur via WhatsApp", status: "verified" },
  { label: "Orienter l’utilisateur dans le centre d’aide", status: "verified" },
  { label: "Assurer la sécurité technique ou diagnostiquer une erreur (journaux hébergeur)", status: "to-confirm" },
];

export const dataProcessingActivities: DataProcessingActivity[] = [
  {
    id: "whatsapp-request",
    title: "Demandes via configurateurs WhatsApp",
    status: "verified",
    dataCategories: ["Identité/contact", "Besoin décrit", "Zone", "Détails libres"],
    purposes: ["Prise de contact", "Qualification du besoin"],
    source: "Saisie utilisateur dans le navigateur",
    recipients: ["Équipe ONLOUTOU via WhatsApp", "Meta (WhatsApp)"],
    storage: "Pas de stockage serveur ONLOUTOU identifié ; message côté WhatsApp après envoi",
    retention:
      "Non fixé côté ONLOUTOU : le message reste dans la conversation WhatsApp des participants, selon WhatsApp",
    legalBasis:
      "Initiative de la personne qui envoie une demande en vue d’une prestation — à reprendre dans la déclaration",
    userActionRequired: true,
  },
  {
    id: "session-prefill",
    title: "Préremplissage session entre pages produits / équipements",
    status: "verified",
    dataCategories: ["Choix de famille, mode ou usage"],
    purposes: ["Faciliter la saisie"],
    source: "Navigation sur le site",
    recipients: ["Aucun transfert réseau identifié"],
    storage: "sessionStorage du navigateur",
    retention: "Jusqu’à fermeture de l’onglet ou consommation par le configurateur",
    legalBasis: "Fonctionnement demandé par la navigation, limité à la session du navigateur",
    userActionRequired: false,
  },
  {
    id: "tel-contact",
    title: "Appels téléphoniques",
    status: "verified",
    dataCategories: ["Numéro appelé"],
    purposes: ["Contact direct"],
    source: "Clic sur lien tel:",
    recipients: ["Opérateur téléphonique"],
    storage: null,
    retention: "Hors du site : données de trafic selon l’opérateur, non gérées par ONLOUTOU",
    legalBasis: "Appel lancé par la personne vers le numéro publié",
    userActionRequired: true,
  },
  {
    id: "hosting-logs",
    title: "Journaux d’hébergement",
    status: "to-confirm",
    dataCategories: ["IP", "Requêtes HTTP", "Horodatage"],
    purposes: ["Fonctionnement et sécurité du site"],
    source: "Visite du site hébergé",
    recipients: ["Hébergeur (à identifier)"],
    storage: "Serveurs hébergeur",
    retention: "Durée non connue : l’hébergeur effectif n’est pas identifié",
    legalBasis: "Fonctionnement et sécurité du site, si ces journaux existent — non confirmé",
    userActionRequired: false,
  },
  {
    id: "future-portals",
    title: "Espaces partenaire et livreur (futurs)",
    status: "planned",
    dataCategories: ["Compte, documents, missions, paiements — non collectés à ce jour"],
    purposes: ["Gestion de la relation partenaire / livreur"],
    source: "Non implémenté",
    recipients: [],
    storage: null,
    retention: "Sans objet : aucun compte n’est ouvert",
    legalBasis: "Non applicable tant que l’espace n’est pas ouvert",
    userActionRequired: false,
  },
  {
    id: "cookie-choice",
    title: "Mémorisation du choix du bandeau",
    status: "verified",
    dataCategories: ["Choix « nécessaires » ou « tout accepter », sans identifiant nominatif"],
    purposes: ["Ne pas redemander le même choix à chaque page"],
    source: "Action sur le bandeau ou sur « Gérer mes cookies »",
    recipients: ["Aucun transfert réseau identifié"],
    storage: "localStorage du navigateur, clé onloutou-cookie-choice",
    retention: "Jusqu’à effacement par la personne ou par le navigateur",
    legalBasis: "Préférence enregistrée par la personne ; aucun traceur de mesure n’est activé",
    userActionRequired: true,
  },
  {
    id: "youtube-on-click",
    title: "Lecture d’une vidéo YouTube après clic",
    status: "verified",
    dataCategories: ["Données que YouTube peut traiter après le clic, selon ses règles"],
    purposes: ["Afficher la vidéo demandée sur la page À propos"],
    source: "Clic de l’utilisateur sur le lecteur",
    recipients: ["YouTube / Google"],
    storage: "Chez le service vidéo, hors site ONLOUTOU",
    retention: "Selon YouTube ; non documentée par ONLOUTOU",
    legalBasis: "Lecture demandée par la personne ; le lecteur n’est pas chargé avant le clic",
    userActionRequired: true,
  },
];

export const thirdPartyServices: ThirdPartyService[] = [
  {
    id: "whatsapp",
    name: "WhatsApp (Meta)",
    purpose: "Messagerie lorsque l’utilisateur ouvre un lien wa.me préparé sur le site",
    website: "https://www.whatsapp.com/",
    privacyUrl: "https://www.whatsapp.com/legal/privacy-policy",
    dataCategories: ["Contenu du message", "Numéros concernés", "Métadonnées selon WhatsApp"],
    active: true,
    status: "verified",
    transferMoment: "Au clic sur le lien d’envoi / ouverture de WhatsApp",
  },
  {
    id: "telecom",
    name: "Opérateur de téléphonie",
    purpose: "Passage d’appel via lien tel:",
    dataCategories: ["Numéro appelé", "Données de trafic selon l’opérateur"],
    active: true,
    status: "verified",
    transferMoment: "Au lancement de l’appel",
  },
  {
    id: "hosting",
    name: "Hébergeur du site (à confirmer)",
    purpose: "Hébergement et diffusion du site",
    dataCategories: ["Journaux techniques", "Adresse IP"],
    active: true,
    status: "to-confirm",
    transferMoment: "À chaque requête vers le site en production",
  },
];

export function privacyPolicyIsIndexable(status: LegalDocumentStatus = privacyPolicyStatus): boolean {
  return legalNoticeIsIndexable(status);
}

export function privacyPolicyBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Confidentialité", item: `${baseUrl}/confidentialite` },
    ],
  };
}

export function privacyResponsibleVerifiedFields(): { label: string; value: string }[] {
  const specs: { label: string; field: { status: string; value: string | null } }[] = [
    { label: "Dénomination", field: legalEntityInformation.commercialName },
    { label: "Forme juridique", field: legalEntityInformation.legalForm },
    { label: "Siège social", field: legalEntityInformation.registeredOffice },
    { label: "Téléphone", field: legalEntityInformation.publicPhone },
  ];
  return specs.flatMap((item) =>
    item.field.status === "verified" && item.field.value ? [{ label: item.label, value: item.field.value }] : [],
  );
}

export function privacyValidationChecklist(): { label: string; done: boolean }[] {
  return [
    { label: "Identité du responsable du traitement", done: legalEntityInformation.legalName.status === "verified" },
    { label: "Coordonnée confidentialité dédiée", done: legalEntityInformation.publicEmail.status === "verified" },
    { label: "Inventaire des formulaires", done: true },
    { label: "Fonctionnement exact de WhatsApp", done: true },
    { label: "Inventaire des cookies (prod)", done: false },
    { label: "Inventaire du stockage local", done: true },
    { label: "Inventaire des services tiers", done: false },
    { label: "Hébergeur", done: false },
    { label: "Journaux techniques", done: false },
    { label: "Finalités", done: false },
    { label: "Fondements juridiques", done: false },
    { label: "Destinataires", done: false },
    { label: "Durées de conservation", done: false },
    { label: "Transferts internationaux", done: false },
    { label: "Mesures de sécurité réelles", done: false },
    { label: "Droits et procédure", done: false },
    { label: "Autorité compétente si applicable", done: false },
    { label: "Date de validation", done: privacyPolicyStatus === "validated" || privacyPolicyStatus === "published" },
    { label: "Validateur juridique", done: false },
  ];
}

export { formatLegalDateFr };
