import { whatsappUrlForMessage } from "@/content/contact-page";
import type { ServiceFaqItem } from "@/types/services";

const motoBase = "/assets/images/equipment/motorcycles";

export const motorcyclesPageSeo = {
  title: "Motos et scooters professionnels en location ou acquisition",
  description:
    "ONLOUTOU étudie les besoins en scooters et motos professionnelles pour la mobilité urbaine, les livraisons et les opérations terrain.",
};

export const motorcyclesPositioning =
  "ONLOUTOU étudie les besoins en motos et scooters professionnels selon l’usage, la quantité, la durée, la zone, les contraintes opérationnelles et la disponibilité.";

export const motorcyclesQualificationNotice =
  "Les modèles, caractéristiques, conditions, équipements de sécurité et disponibilités sont confirmés après qualification.";

export const motorcyclesRepresentativeCaption =
  "Catégorie, modèle et disponibilité à confirmer.";

export const motorcyclesHeroCaption =
  "Plusieurs profils de deux-roues professionnels. Modèle et disponibilité à confirmer.";

export const motorcyclesMedia = {
  fleetHero: {
    src: `${motoBase}/Motos professionnelles dans une cour d’Abidjan-2.png`,
    alt: "Trois motos professionnelles présentées dans une cour à Abidjan",
    width: 1672,
    height: 941,
    objectPosition: "50% 46%",
  },
  urbanOps: {
    src: `${motoBase}/Préparation d’une tournée à Abidjan-1.png`,
    alt: "Livreur équipé d’un casque préparant une mission avec un coordinateur",
    width: 1586,
    height: 992,
    objectPosition: "52% 38%",
  },
  inspection: {
    src: `${motoBase}/Inspection d’une moto à Abidjan-3.png`,
    alt: "Technicien contrôlant l’état d’une moto professionnelle",
    width: 1586,
    height: 992,
    objectPosition: "56% 42%",
  },
};

export const motorcyclesBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Équipements", href: "/equipements" },
  { label: "Motos et mobilité légère" },
];

export const motorcyclesHero = {
  eyebrow: "ÉQUIPEMENTS · MOTOS ET MOBILITÉ LÉGÈRE",
  titleBefore: "Une mobilité professionnelle pensée pour ",
  titleHighlight: "le rythme du terrain.",
  intro:
    "ONLOUTOU étudie les besoins en scooters et motos professionnelles pour les déplacements urbains, les interventions, les livraisons et les opérations de proximité.",
  caveat: "Les catégories, équipements, conditions et disponibilités sont confirmés après étude.",
  primaryCta: { label: "Définir mon besoin", href: "#demande-moto" },
  secondaryCta: { label: "Explorer les usages", href: "#profils-motos" },
};

export const motorcyclesPrioritiesBand = {
  lead: "Le bon choix dépend de la mission, du conducteur, du parcours et des contraintes réelles.",
  items: ["Usage", "Zone", "Charge", "Sécurité", "Durée"] as const,
};

export type MotorcycleProfileId = "scooter" | "utility" | "versatile";

export const motorcyclesProfiles = {
  id: "profils-motos",
  title: "Choisir selon la mission, pas uniquement selon le modèle.",
  items: [
    {
      id: "scooter" as MotorcycleProfileId,
      number: "01",
      title: "Scooter urbain",
      visual: "schema" as const,
      usages: [
        "déplacements en ville",
        "rendez-vous",
        "missions de proximité",
        "mobilité légère",
        "petits trajets professionnels",
      ],
      criteria: ["fréquence", "distance", "rangement", "confort", "conditions urbaines", "sécurité"],
    },
    {
      id: "utility" as MotorcycleProfileId,
      number: "02",
      title: "Moto utilitaire",
      visual: "delivery" as const,
      usages: [
        "livraison",
        "transport léger",
        "déplacement d’un agent",
        "opération régulière",
        "activité terrain",
      ],
      criteria: ["charge", "fixation", "stabilité", "trajet", "fréquence", "équipement du conducteur"],
    },
    {
      id: "versatile" as MotorcycleProfileId,
      number: "03",
      title: "Moto polyvalente",
      visual: "schema" as const,
      usages: [
        "déplacement urbain et périurbain",
        "intervention terrain",
        "mission multisite",
        "usage professionnel varié",
      ],
      criteria: ["état des voies", "distance", "charge", "confort", "fréquence", "conditions d’exploitation"],
    },
  ],
};

export const motorcyclesUrbanStory = {
  title: "Préparer la mission avant de prendre la route.",
  lead:
    "Une opération de livraison ou de mobilité ne dépend pas seulement de la moto. Elle nécessite une mission claire, un équipement adapté, une charge correctement organisée et des conditions de sécurité définies.",
  steps: [
    "Affecter la mission",
    "Vérifier les informations",
    "Préparer le véhicule",
    "Contrôler la charge",
    "Équiper le conducteur",
    "Confirmer le départ",
  ],
  disclaimer:
    "Illustration d’une préparation opérationnelle — aucun service de mission en temps réel n’est présenté sur cette page.",
};

export const motorcyclesSafety = {
  title: "La sécurité commence avant le départ.",
  disclaimer:
    "Cette liste est indicative et ne remplace pas les contrôles, obligations ou recommandations applicables au véhicule et à son utilisation.",
  checkpoints: [
    "pneus",
    "freinage",
    "éclairage",
    "rétroviseurs",
    "casque",
    "éléments de protection",
    "fixation d’une charge",
    "documents applicables",
    "état général",
    "signalement d’une anomalie",
  ],
};

export const motorcyclesRentOrBuy = {
  title: "Une solution à choisir selon la durée et l’usage.",
  rent: {
    title: "Louer",
    lead: "La location peut être étudiée pour une mission, un renfort temporaire, une période définie ou un besoin à tester.",
    points: ["période", "quantité", "zone", "disponibilité", "restitution", "conditions"],
    cta: { label: "Explorer la location", href: "/solutions/location" },
  },
  buy: {
    title: "Acheter",
    lead: "L’acquisition peut être étudiée pour un usage durable, régulier ou l’intégration de motos dans une activité professionnelle.",
    points: ["catégorie", "caractéristiques", "quantité", "délai", "équipements", "accompagnement"],
    cta: { label: "Explorer l’acquisition", href: "/solutions/vente" },
  },
};

export const motorcyclesConnected = {
  title: "Suivre une mobilité légère lorsque le projet le nécessite.",
  lead:
    "Une solution de géolocalisation ou de supervision peut être étudiée pour certaines motos lorsque le dispositif, l’alimentation, la connectivité et les conditions d’installation sont compatibles.",
  flow: ["Moto", "Dispositif adapté", "Réseau", "Plateforme", "Équipe"],
  considerations: [
    "compatibilité",
    "emplacement",
    "alimentation",
    "réseau",
    "données disponibles",
    "alertes configurées",
    "droits d’accès",
  ],
  links: [
    { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
};

export const motorcyclesContextCriteria = {
  title: "Les informations qui orientent la recommandation.",
  groups: [
    {
      title: "Mission",
      items: ["déplacement", "livraison", "intervention", "mobilité d’équipe", "renfort temporaire"],
    },
    {
      title: "Parcours",
      items: ["zone urbaine", "zone périurbaine", "distance", "fréquence", "état des voies"],
    },
    {
      title: "Conducteur",
      items: ["expérience", "équipements", "conditions d’utilisation", "organisation du travail"],
    },
    {
      title: "Charge",
      items: ["nature", "volume", "fixation", "poids à vérifier", "contraintes de transport"],
    },
    {
      title: "Exploitation",
      items: ["durée", "quantité", "maintenance", "stockage", "suivi éventuel"],
    },
  ],
};

export const motorcyclesProcess = {
  title: "Du besoin à une solution confirmée.",
  steps: [
    { title: "Décrire", description: "Préciser l’usage, la zone et la fréquence." },
    { title: "Qualifier", description: "Identifier le profil de moto, la quantité et les contraintes." },
    { title: "Sécuriser", description: "Vérifier les équipements et les conditions nécessaires." },
    { title: "Comparer", description: "Étudier la location, l’acquisition ou les deux." },
    { title: "Proposer", description: "Présenter le périmètre et les modalités applicables." },
    { title: "Confirmer", description: "Valider les caractéristiques, la disponibilité, le prix et les conditions." },
  ],
};

export const motorcyclesRequestOptions = {
  modes: [
    { id: "rent", label: "louer" },
    { id: "buy", label: "acheter" },
    { id: "compare", label: "comparer" },
    { id: "tbd", label: "je ne sais pas encore" },
  ],
  profiles: [
    { id: "scooter", label: "scooter urbain" },
    { id: "utility", label: "moto utilitaire" },
    { id: "versatile", label: "moto polyvalente" },
    { id: "multi", label: "plusieurs profils" },
    { id: "tbd", label: "profil à définir" },
  ],
  usages: [
    { id: "pro", label: "déplacement professionnel" },
    { id: "team", label: "mobilité d’équipe" },
    { id: "delivery", label: "livraison" },
    { id: "field", label: "intervention terrain" },
    { id: "fleet", label: "renfort de parc" },
    { id: "other", label: "autre" },
  ],
  quantities: [
    { id: "one", label: "une moto" },
    { id: "few", label: "deux à cinq" },
    { id: "many", label: "plus de cinq" },
    { id: "tbd", label: "quantité à définir" },
  ],
  durations: [
    { id: "once", label: "une intervention" },
    { id: "days", label: "quelques jours" },
    { id: "weeks", label: "plusieurs semaines" },
    { id: "recurring", label: "besoin récurrent" },
    { id: "buy", label: "acquisition durable" },
    { id: "tbd", label: "durée à définir" },
  ],
  zones: [
    { id: "abidjan", label: "Abidjan" },
    { id: "ci", label: "autre ville de Côte d’Ivoire" },
    { id: "multi", label: "plusieurs zones" },
    { id: "other", label: "autre zone à préciser" },
  ],
  services: [
    { id: "moto", label: "moto uniquement" },
    { id: "delivery", label: "livraison à étudier" },
    { id: "safety", label: "équipements de sécurité à étudier" },
    { id: "geo", label: "géolocalisation à étudier" },
    { id: "fleet", label: "gestion de flotte à étudier" },
    { id: "multi", label: "plusieurs services" },
    { id: "tbd", label: "besoin à préciser" },
  ],
};

export function buildMotorcycleRequestSummary(s: {
  quantityLabel: string;
  profileLabel: string;
  usageLabel: string;
  zoneLabel: string;
  modeLabel: string;
  durationLabel: string;
  servicesLabel: string;
}) {
  return `Je recherche ${s.quantityLabel} de type ${s.profileLabel} pour ${s.usageLabel}, dans la zone ${s.zoneLabel}. Mode : ${s.modeLabel}. Durée : ${s.durationLabel}. Services à étudier : ${s.servicesLabel}.`;
}

export function buildMotorcycleWhatsAppUrl(s: Parameters<typeof buildMotorcycleRequestSummary>[0]) {
  return whatsappUrlForMessage(
    `Bonjour ONLOUTOU, ${buildMotorcycleRequestSummary(s)} Pouvez-vous m’orienter sur les prochaines étapes ?`,
  );
}

export const motorcyclesTransparency = {
  title: "Ce qui doit être confirmé",
  items: [
    "profil de moto",
    "modèle",
    "caractéristiques",
    "quantité",
    "disponibilité",
    "prix",
    "durée",
    "zone",
    "livraison",
    "équipements de sécurité",
    "assurance si applicable",
    "entretien",
    "restitution si location",
    "garantie applicable",
    "géolocalisation éventuelle",
  ],
  note: "Seuls les éléments figurant dans la proposition ou le contrat applicable sont considérés comme confirmés.",
};

export const motorcyclesFaq: ServiceFaqItem[] = [
  {
    question: "Les motos présentées sont-elles disponibles ?",
    answer: "Les images représentent des profils d’usage. Le modèle et la disponibilité doivent être confirmés.",
  },
  {
    question: "Peut-on louer ou acheter plusieurs motos ?",
    answer: "Une demande peut porter sur plusieurs unités. La quantité, l’usage, la zone et le calendrier doivent être précisés.",
  },
  {
    question: "Les casques sont-ils inclus ?",
    answer:
      "Les équipements de sécurité doivent être explicitement confirmés dans la proposition. Leur présence sur une image ne constitue pas une inclusion.",
  },
  {
    question: "Peut-on utiliser une moto pour la livraison ?",
    answer: "Un besoin de livraison peut être étudié selon la charge, le parcours, la sécurité et les conditions applicables.",
  },
  {
    question: "Cette page permet-elle de devenir livreur ?",
    answer: "Non. Cette page concerne les besoins en motos professionnelles. Elle ne constitue pas une inscription comme livreur.",
  },
  {
    question: "Peut-on ajouter la géolocalisation ?",
    answer: "Une solution peut être étudiée lorsque la moto, le dispositif et les conditions d’installation sont compatibles.",
  },
  {
    question: "L’entretien et l’assurance sont-ils inclus ?",
    answer: "Ils dépendent du mode retenu et des conditions contractuelles. Ils doivent être confirmés séparément.",
  },
  {
    question: "Peut-on choisir une marque ou un modèle ?",
    answer: "Une préférence peut être communiquée, mais elle ne doit pas être considérée comme disponible avant confirmation.",
  },
];

export const motorcyclesEditorialNotice =
  "Les images de cette page illustrent des profils de motos et des situations d’usage professionnel. Elles ne constituent pas un catalogue de modèles disponibles. Les références, équipements, prix, quantités, services et conditions sont confirmés après qualification.";

export const motorcyclesFinalCta = {
  titleBefore: "Préparons une mobilité adaptée à ",
  titleHighlight: "votre opération.",
  lead: "Précisez l’usage, la quantité, la zone, la durée et les services recherchés afin de mieux orienter la demande.",
  primary: { label: "Préparer ma demande", href: "#demande-moto" },
  secondary: { label: "Voir tous les équipements", href: "/equipements" },
};

export function motorcyclesBreadcrumbJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Équipements", item: `${baseUrl}/equipements` },
      { "@type": "ListItem", position: 3, name: "Motos et mobilité légère", item: `${baseUrl}/equipements/motos` },
    ],
  };
}

export function motorcyclesServiceJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Étude de besoins en motos et scooters professionnels",
    provider: { "@type": "Organization", name: "ONLOUTOU", url: baseUrl },
    areaServed: "Côte d’Ivoire",
    description: motorcyclesPageSeo.description,
    url: `${baseUrl}/equipements/motos`,
  };
}
