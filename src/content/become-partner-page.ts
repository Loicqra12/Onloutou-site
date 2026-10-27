import { partnersMedia, partnersPositioning } from "@/content/partners-page";
import type { ServiceFaqItem } from "@/types/services";

export const becomePartnerSeo = {
  title: "Proposer une collaboration à ONLOUTOU",
  description:
    "Préparez une proposition de collaboration avec ONLOUTOU en présentant votre activité, vos capacités, votre zone et le type de partenariat recherché.",
};

export const becomePartnerLegalNotice =
  "Présenter une proposition ne crée aucun engagement d’ONLOUTOU. Toute collaboration éventuelle dépend du besoin, des vérifications applicables, de la capacité du partenaire et de conditions formalisées séparément.";

export const becomePartnerBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Proposer une collaboration" },
];

export const becomePartnerHero = {
  eyebrow: "PROPOSER UNE COLLABORATION",
  titleBefore: "Présentez clairement ",
  titleHighlight: "ce que vous pouvez apporter.",
  intro:
    "Décrivez votre activité, vos capacités, votre zone et la forme de collaboration recherchée afin qu’ONLOUTOU puisse étudier la pertinence d’un échange.",
  notice: "Cette démarche constitue une prise de contact, pas une inscription ou une validation automatique.",
  primaryCta: { label: "Commencer la préparation", href: "#preparer-proposition" },
  secondaryCta: { label: "Comprendre les partenariats", href: "/partenaires" },
  steps: ["Profil", "Capacité", "Zone", "Objectif"],
};

export const becomePartnerMedia = {
  hero: partnersMedia.hero,
  stand: partnersMedia.stand,
};

export const becomePartnerAudiences = {
  footnote: "Cette liste n’est pas exhaustive. Toute proposition reste soumise à analyse.",
  items: [
    {
      id: "suppliers",
      title: "Fournisseurs et détenteurs d’équipements",
      points: ["véhicules", "motos", "matériels", "outils", "équipements techniques ou connectés"],
    },
    {
      id: "field",
      title: "Techniciens et prestataires terrain",
      points: ["installation", "contrôle", "maintenance", "accompagnement", "capacité technique"],
    },
    {
      id: "logistics",
      title: "Logistique et livraison",
      points: ["transport", "livraison", "récupération", "opérations terrain", "couverture d’une zone"],
    },
    {
      id: "tech-commercial",
      title: "Partenaires technologiques ou commerciaux",
      points: ["technologie", "logiciel", "intégration", "connectivité", "opportunité", "complément de service"],
    },
  ],
};

export const becomePartnerReadiness = {
  title: "Votre proposition est-elle prête à être étudiée ?",
  questions: [
    "Pouvez-vous décrire clairement votre activité ?",
    "Pouvez-vous préciser la capacité que vous proposez ?",
    "Connaissez-vous votre zone d’intervention ?",
    "Pouvez-vous indiquer vos disponibilités ?",
    "Disposez-vous des autorisations ou documents nécessaires à votre activité, lorsqu’ils sont applicables ?",
    "Pouvez-vous expliquer les conditions générales de votre proposition ?",
    "Acceptez-vous qu’une vérification puisse être nécessaire ?",
    "Comprenez-vous que la prise de contact ne garantit aucune collaboration ?",
  ],
  feedback: {
    few: "Vous pouvez tout de même continuer, mais certaines informations devront probablement être précisées.",
    some: "Votre proposition contient déjà plusieurs éléments utiles pour une première prise de contact.",
    all: "Vous semblez disposer des principales informations nécessaires pour présenter votre proposition.",
  },
};

export const becomePartnerSensitiveData = {
  title: "Ne transmettez pas encore de documents sensibles.",
  lead:
    "Pour cette première prise de contact, ne transmettez pas de pièce d’identité, document bancaire, mot de passe, code, signature, document confidentiel ou original administratif.",
  items: [
    "pièce d’identité",
    "coordonnées bancaires",
    "mot de passe",
    "code de vérification",
    "signature scannée",
    "document client confidentiel",
    "contrat confidentiel",
    "original administratif",
  ],
  note:
    "Si des documents sont nécessaires plus tard, leur nature et le canal de transmission devront être précisés dans un cadre défini.",
};

export const becomePartnerPrivacyNote =
  "Les informations saisies servent uniquement à préparer le message affiché avant l’ouverture de WhatsApp. Elles ne sont pas envoyées à ONLOUTOU tant que vous ne confirmez pas vous-même l’envoi dans WhatsApp.";

export const becomePartnerAfterContact = {
  title: "Que se passe-t-il après le message ?",
  disclaimer: "L’absence de suite ne constitue pas une validation implicite.",
  steps: [
    { title: "Réception", description: "ONLOUTOU prend connaissance des informations transmises." },
    {
      title: "Clarification éventuelle",
      description: "Des précisions peuvent être demandées si le profil correspond à un besoin pertinent.",
    },
    {
      title: "Vérification",
      description: "Les capacités, documents ou conditions nécessaires peuvent être examinés selon le contexte.",
    },
    {
      title: "Décision séparée",
      description: "Toute collaboration éventuelle doit être confirmée dans un cadre distinct.",
    },
  ],
};

export const becomePartnerCriteria = {
  title: "Une collaboration se construit sur des éléments concrets.",
  note: "Les critères exacts dépendent du profil et de la collaboration envisagée.",
  items: [
    "activité compréhensible",
    "capacité vérifiable",
    "communication claire",
    "respect des engagements",
    "sécurité",
    "confidentialité",
    "qualité",
    "disponibilité réelle",
    "documents applicables",
    "responsabilité",
  ],
};

export const becomePartnerFaq: ServiceFaqItem[] = [
  {
    question: "Cette page crée-t-elle un compte partenaire ?",
    answer: "Non. Elle permet uniquement de préparer et d’envoyer une prise de contact.",
  },
  {
    question: "La demande garantit-elle une collaboration ?",
    answer: "Non. La proposition doit être analysée et ne crée aucun engagement automatique.",
  },
  {
    question: "Dois-je envoyer mes documents maintenant ?",
    answer: "Non. Aucun document sensible ne doit être envoyé lors de cette première prise de contact.",
  },
  {
    question: "Combien coûte l’inscription ?",
    answer:
      "Aucun programme d’inscription n’est proposé depuis cette page. Aucun paiement ne doit vous être demandé pour préparer ce message.",
  },
  {
    question: "Existe-t-il une commission standard ?",
    answer: "Non. Aucune commission ou rémunération ne doit être supposée. Les conditions éventuelles sont définies séparément.",
  },
  {
    question: "Vais-je recevoir des missions ?",
    answer: "Aucun volume de mission ne peut être garanti.",
  },
  {
    question: "Puis-je proposer des équipements ?",
    answer:
      "Oui, une proposition peut être présentée, mais les catégories, caractéristiques, documents et conditions doivent être étudiés.",
  },
  {
    question: "Puis-je proposer mes services de livraison ?",
    answer:
      "Un acteur logistique peut présenter sa capacité sur la page Devenir livreur (/devenir-livreur). Cela ne constitue pas une inscription ni une promesse de mission.",
  },
  {
    question: "Quand l’espace partenaire sera-t-il disponible ?",
    answer:
      "Un aperçu public de l’espace partenaire est proposé. L’ouverture d’un compte connecté reste en préparation, sans date annoncée.",
  },
];

export const becomePartnerEditorialNotice =
  "Cette page facilite une prise de contact. Elle ne constitue ni une inscription, ni une offre d’emploi, ni un appel d’offres, ni un contrat, ni une promesse de mission, de revenu ou de commission.";

export const becomePartnerFinalCta = {
  titleBefore: "Une proposition claire facilite ",
  titleHighlight: "le premier échange.",
  lead: "Préparez les informations essentielles, vérifiez votre résumé puis choisissez vous-même de l’envoyer à ONLOUTOU.",
  primary: { label: "Préparer ma proposition", href: "#preparer-proposition" },
  secondary: { label: "Retour aux partenariats", href: "/partenaires" },
  portalLink: { label: "Découvrir l’espace partenaire (aperçu)", href: "/espace-partenaire" },
};

export const becomePartnerNoScriptForm =
  "JavaScript est nécessaire pour générer automatiquement le résumé WhatsApp. Vous pouvez utiliser la page Contact pour transmettre votre demande.";

export function becomePartnerBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Partenaires", item: `${baseUrl}/partenaires` },
      { "@type": "ListItem", position: 3, name: "Proposer une collaboration", item: `${baseUrl}/devenir-partenaire` },
    ],
  };
}

export { partnersPositioning };
