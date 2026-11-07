import { site } from "@/content/site";
import type {
  HostingInformation,
  LegalDocumentStatus,
  LegalEntityInformation,
  VerifiedLegalField,
} from "@/types/legal";

/**
 * Identité confirmée par le propriétaire le 2026-11-05.
 * Le document n’est pas marqué validé : e-mail professionnel, représentant légal,
 * hébergeur effectif et droit applicable restent non confirmés.
 */
export const legalNoticeStatus: LegalDocumentStatus = "awaiting-validation";

/** Date de la mise à jour qui publie l’identité confirmée. */
export const legalNoticeLastUpdated = "2026-11-05";

export const legalNoticeSeo = {
  title: "Mentions légales",
  description:
    "Consultez les informations relatives à l’éditeur, à l’hébergement et à l’utilisation du site ONLOUTOU.",
};

export const legalNoticeBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Mentions légales" },
];

export const legalDraftBanner = {
  title: "Document en cours de validation",
  lead:
    "Certaines informations officielles doivent encore être confirmées avant la publication définitive de cette page.",
};

const ownerConfirmation = {
  source: "Confirmation du propriétaire, 5 novembre 2026",
  lastVerifiedAt: "2026-11-05",
} as const;

export const legalEntityInformation: LegalEntityInformation = {
  commercialName: {
    value: site.name,
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  legalName: {
    value: "ONLOUTOU",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  legalForm: {
    value: "Société à responsabilité limitée unipersonnelle — SARLU",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  capital: {
    value: "3\u00a0000\u00a0000\u00a0FCFA",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  registryNumber: {
    value: "CI-ABJ-2016-A-3617",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  taxNumber: {
    value: "1541839S",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  registeredOffice: {
    value: "Abidjan, Riviera Bonoumin, lot 25, îlot 18, Côte d’Ivoire",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  publicPhone: {
    value: site.phoneDisplay,
    status: "verified",
    source: "src/content/site.ts — identique à la confirmation du propriétaire",
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  publicEmail: { value: null, status: "missing" },
  publicationDirector: {
    value: "Adams Ousmane Diaby",
    status: "verified",
    source: ownerConfirmation.source,
    lastVerifiedAt: ownerConfirmation.lastVerifiedAt,
  },
  legalRepresentative: { value: null, status: "missing" },
};

/** Repère d’accès communiqué par le propriétaire. Distinct de l’adresse du siège. */
export const legalPracticalLandmark = "À proximité de la CNPS, non loin du rond-point CGK";

/** Hébergeur production non attesté dans le dépôt (.openai/hosting.json = build statique uniquement). */
export const hostingInformation: HostingInformation = {
  providerName: { value: null, status: "to-confirm", source: "deployment-not-finalized" },
  legalName: { value: null, status: "to-confirm" },
  address: { value: null, status: "to-confirm" },
  website: { value: null, status: "to-confirm" },
  phone: { value: null, status: "to-confirm" },
};

export const legalTocSections = [
  { id: "editeur", title: "Identité de l’éditeur" },
  { id: "coordonnees", title: "Siège et coordonnées" },
  { id: "publication", title: "Direction de la publication" },
  { id: "hebergement", title: "Hébergement" },
  { id: "objet", title: "Objet du site" },
  { id: "articulation", title: "Documents applicables" },
  { id: "propriete-intellectuelle", title: "Propriété intellectuelle" },
  { id: "signalement", title: "Signalement" },
  { id: "donnees-personnelles", title: "Données personnelles" },
  { id: "cookies", title: "Cookies" },
  { id: "droit-applicable", title: "Droit applicable" },
  { id: "sources", title: "Sources et limites" },
  { id: "mise-a-jour", title: "Mise à jour" },
] as const;

export const legalEditorFieldLabels: Record<string, string> = {
  commercialName: "Nom commercial",
  legalName: "Raison sociale",
  legalForm: "Forme juridique",
  capital: "Capital social",
  registryNumber: "Numéro d’immatriculation (RCCM)",
  taxNumber: "Compte contribuable",
  registeredOffice: "Siège social",
  legalRepresentative: "Représentant légal",
};

export const legalProse = {
  intellectualProperty: `Sauf mention contraire, les contenus originaux présents sur ce site sont destinés à la communication d’ONLOUTOU. Les marques, noms, logiciels, photographies ou ressources appartenant à des tiers demeurent soumis aux droits de leurs titulaires respectifs.`,
  siteUse: `Les informations publiées sur ce site sont fournies à titre général et peuvent évoluer. Elles ne constituent pas automatiquement une offre contractuelle et doivent être confirmées avant tout engagement. Elles ne remplacent pas un devis, un contrat ou une proposition validée par ONLOUTOU.`,
  liability: `ONLOUTOU veille à présenter des informations aussi claires et actualisées que possible. Certaines informations peuvent toutefois évoluer ou nécessiter une confirmation spécifique. L’utilisateur est invité à vérifier les éléments déterminants avant toute décision ou engagement. La disponibilité du site, l’absence d’erreur, les interruptions temporaires ou les contenus fournis par des tiers ne peuvent être garantis de manière absolue.`,
  externalLinks: `Le site peut contenir des liens vers des services ou sites externes. ONLOUTOU n’exerce pas de contrôle sur leurs contenus, leurs conditions d’utilisation ni leurs politiques de confidentialité. L’accès à ces ressources relève de la responsabilité de l’utilisateur.`,
  personalData: `Les informations relatives à la collecte et au traitement des données personnelles sont décrites dans la politique de confidentialité du site. Cette page ne remplace pas cette politique.`,
  cookies: `Les cookies, stockages navigateur et services tiers sont décrits dans la politique dédiée aux cookies. Un bandeau permet d’enregistrer le choix du visiteur. Aucun cookie publicitaire ni de mesure d’audience n’est déposé par le site.`,
  hostingPending: `L’hébergeur effectif du site en production n’est pas encore confirmé. Aucun prestataire n’est donc nommé sur cette page.`,
  applicableLawPending: `Les dispositions relatives au droit applicable et à la juridiction compétente seront ajoutées après validation juridique au regard de l’entité éditrice et des activités réelles d’ONLOUTOU.`,
  publicationPending: `Le nom du responsable de la publication sera indiqué lorsqu’il aura été confirmé.`,
};

export const legalFooterLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Politique de cookies" },
  { action: "cookies", label: "Gérer mes cookies" },
  { href: "/conditions-utilisation", label: "Conditions d’utilisation" },
  { href: "/mentions-legales#propriete-intellectuelle", label: "Propriété intellectuelle" },
  { href: "/sitemap.xml", label: "Plan du site" },
  { href: "/contact", label: "Contact / Réclamation" },
] as const;

export const termsOfUseStatus: LegalDocumentStatus = "awaiting-validation";

export const termsOfUseLastUpdated = "2026-11-05";

export const termsOfUseSeo = {
  title: "Conditions d’utilisation",
  description:
    "Consultez les conditions applicables à l’utilisation du site public ONLOUTOU.",
};

export const termsOfUseBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Conditions d’utilisation" },
];

export const termsDraftBanner = {
  title: "Document en cours de validation",
  lead:
    "Ce texte décrit l’usage du site public dans son état actuel. Les dispositions définitives seront confirmées après validation juridique.",
};

export const legalRelatedDocumentLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Politique relative aux cookies" },
  { href: "/conditions-utilisation", label: "Conditions d’utilisation" },
  { href: "/contact", label: "Contact" },
] as const;

export const termsOfUseTocSections = [
  { id: "objet", title: "Objet et champ" },
  { id: "definitions", title: "Définitions" },
  { id: "documents", title: "Documents applicables" },
  { id: "acces", title: "Accès au site" },
  { id: "services", title: "Services présentés" },
  { id: "role", title: "Rôle d’ONLOUTOU" },
  { id: "contenus-site", title: "Fiches, photos et démonstrations" },
  { id: "demandes-contact", title: "Demandes et échanges" },
  { id: "formation-contrat", title: "Demande, devis et contrat" },
  { id: "comptes", title: "Comptes et habilitations" },
  { id: "engagements", title: "Engagements de l’utilisateur" },
  { id: "utilisations-interdites", title: "Usages interdits" },
  { id: "contenus-utilisateurs", title: "Contenus transmis" },
  { id: "propriete-intellectuelle", title: "Propriété intellectuelle" },
  { id: "liens-externes", title: "Services et liens de tiers" },
  { id: "disponibilite", title: "Disponibilité et maintenance" },
  { id: "suspension", title: "Suspension des accès" },
  { id: "responsabilite", title: "Responsabilités" },
  { id: "donnees-cookies", title: "Données et cookies" },
  { id: "conditions-commerciales", title: "Conditions commerciales" },
  { id: "espaces-partenaire-livreur", title: "Espaces partenaire et livreur" },
  { id: "reclamations", title: "Réclamations" },
  { id: "modification", title: "Modification" },
  { id: "droit-applicable", title: "Droit applicable" },
  { id: "contact", title: "Contact" },
] as const;

export const termsOfUseProse = {
  object:
    "Les présentes conditions encadrent l’accès et l’utilisation du site internet public ONLOUTOU. Elles ne régissent pas la fourniture de services, la location, la vente, la livraison, le partenariat commercial ou l’activité de livreur, qui relèvent d’accords distincts confirmés par ONLOUTOU.",
  access:
    "Le site est accessible via un navigateur web compatible. Certaines fonctions peuvent nécessiter JavaScript. L’utilisateur est responsable de la configuration de son équipement, de sa connexion et des logiciels qu’il utilise pour accéder au site.",
  information:
    "Les contenus publiés (textes, visuels, exemples d’interfaces, descriptions de parcours) sont fournis à titre informatif. Sauf confirmation écrite ou contractuelle, ils ne constituent pas une offre, un devis, une commande ni un engagement de résultat.",
  planned:
    "Certaines pages présentent des fonctionnalités en préparation ou en prévisualisation (notamment les futurs espaces partenaire et livreur). Tant qu’elles ne sont pas ouvertes officiellement, elles ne permettent pas de créer un compte, de déposer un document, de recevoir une mission ou d’effectuer un paiement.",
  contactRequests:
    "Les formulaires connectés à l’API enregistrent une demande ou une candidature avec référence ONLOUTOU. Les autres configurateurs préparent encore un message (WhatsApp ou contact) sans dossier en ligne tant qu’ils ne sont pas branchés.",
  prohibited:
    "Il est notamment interdit d’utiliser le site de manière frauduleuse, de tenter d’accéder à des zones non autorisées, d’introduire du code malveillant, de surcharger volontairement l’infrastructure, de collecter des données d’autres utilisateurs sans base légale, ou d’utiliser les contenus d’une manière portant atteinte aux droits d’ONLOUTOU ou de tiers.",
  commercial:
    "Toute relation commerciale (location, achat, prestation, abonnement, projet sur mesure, etc.) fait l’objet de conditions, devis ou contrats séparés. Les informations du site public ne les remplacent pas.",
  portals:
    "Les pages de prévisualisation des espaces partenaire et livreur sont fournies à titre conceptuel. L’ouverture de comptes, la gestion de catalogue, de missions, de documents ou de paiements sera encadrée par des conditions dédiées publiées avant mise en service.",
  changes:
    "ONLOUTOU peut adapter ces conditions lorsque le site évolue, que de nouvelles fonctions sont ajoutées ou que des exigences applicables le nécessitent. La date de dernière mise à jour est indiquée en bas de cette page.",
  contact:
    "Pour toute question relative à l’utilisation du site, vous pouvez utiliser la page contact. Ne transmettez pas de données sensibles par des canaux non sécurisés.",
};

export function termsOfUseIsIndexable(status: LegalDocumentStatus = termsOfUseStatus): boolean {
  return legalNoticeIsIndexable(status);
}

export function termsOfUseBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Conditions d’utilisation",
        item: `${baseUrl}/conditions-utilisation`,
      },
    ],
  };
}

export function legalNoticeIsIndexable(status: LegalDocumentStatus = legalNoticeStatus): boolean {
  return status === "validated" || status === "published";
}

export function formatLegalDateFr(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

export function verifiedLegalFields(
  entity: LegalEntityInformation,
  keys: (keyof LegalEntityInformation)[],
): { key: keyof LegalEntityInformation; label: string; value: string }[] {
  const rows: { key: keyof LegalEntityInformation; label: string; value: string }[] = [];
  for (const key of keys) {
    const field: VerifiedLegalField = entity[key];
    if (field.status !== "verified" || !field.value) continue;
    const label = legalEditorFieldLabels[key] ?? key;
    rows.push({ key, label, value: field.value });
  }
  return rows;
}

export function legalBlockingChecklist(): { label: string; done: boolean }[] {
  const entity = legalEntityInformation;
  const hosting = hostingInformation;
  return [
    { label: "Raison sociale officielle", done: entity.legalName.status === "verified" },
    { label: "Forme juridique", done: entity.legalForm.status === "verified" },
    { label: "Capital social", done: entity.capital.status === "verified" },
    { label: "Numéro RCCM", done: entity.registryNumber.status === "verified" },
    { label: "Numéro fiscal applicable", done: entity.taxNumber.status === "verified" },
    { label: "Adresse du siège", done: entity.registeredOffice.status === "verified" },
    { label: "Représentant légal", done: entity.legalRepresentative.status === "verified" },
    { label: "Directeur de publication", done: entity.publicationDirector.status === "verified" },
    { label: "Email officiel", done: entity.publicEmail.status === "verified" },
    { label: "Hébergeur final", done: hosting.providerName.status === "verified" },
    { label: "Coordonnées juridiques de l’hébergeur", done: hosting.legalName.status === "verified" && hosting.address.status === "verified" },
    { label: "Droit applicable", done: false },
    { label: "Juridiction ou mécanisme de règlement des différends", done: false },
    { label: "Date de validation", done: legalNoticeStatus === "validated" || legalNoticeStatus === "published" },
    { label: "Validateur du document", done: false },
  ];
}

export function legalNoticeBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Mentions légales", item: `${baseUrl}/mentions-legales` },
    ],
  };
}
