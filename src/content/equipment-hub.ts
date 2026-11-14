import { whatsappUrlForMessage } from "@/content/contact-page";
import { megaMenuEquipementsImage } from "@/content/mega-menu-equipements-image";
import type { EqpIconName } from "@/components/equipment/hub/EqpIcon";

const media = "/assets/images/equipment/hub";

export const eqpHero = {
  eyebrow: "Véhicules · Matériels · Équipements",
  titleLines: ["Les bons", "équipements.", "Pour vos opérations."],
  intro: "Explorez les familles de matériels à étudier en location ou à l’achat, selon votre usage.",
  primaryCta: { label: "Explorer les familles", href: "#univers-equipements" },
  secondaryCta: { label: "Présenter mon besoin", href: "#orientation-equipement" },
  caveat: "Références et disponibilités à confirmer après qualification.",
  image: {
    src: megaMenuEquipementsImage.src,
    alt: megaMenuEquipementsImage.alt,
    width: megaMenuEquipementsImage.width,
    height: megaMenuEquipementsImage.height,
  },
  breadcrumb: [{ label: "Accueil", href: "/" }, { label: "Équipements" }],
};

export const eqpUsages: { icon: EqpIconName; label: string }[] = [
  { icon: "van", label: "Mobilité professionnelle" },
  { icon: "excavator", label: "Chantiers & manutention" },
  { icon: "bolt", label: "Outils & énergie" },
  { icon: "wifi", label: "Actifs connectés" },
];

export type EqpFamily = {
  id: string;
  anchor: string;
  number: string;
  label: string;
  title: string;
  features: { icon: EqpIconName; label: string }[];
  image: { src: string; alt: string; width: number; height: number; fit?: "cover" | "contain"; position?: string };
  links: { label: string; href: string }[];
};

const rentLink = { label: "Découvrir la location", href: "/solutions/location" };
const buyLink = { label: "Étudier une acquisition", href: "/solutions/vente" };

export const eqpFamilies = {
  id: "univers-equipements",
  kicker: "Explorer les familles",
  title: "Votre usage, notre point de départ.",
  lead: "Choisissez une famille pour découvrir les besoins couverts.",
  disclaimer: "Modèles et disponibilités à confirmer.",
  items: [
    {
      id: "vehicules",
      anchor: "famille-vehicules",
      number: "01",
      label: "Véhicules professionnels",
      title: "Véhicules professionnels",
      features: [
        { icon: "users", label: "Mobilité d’équipe" },
        { icon: "wrench", label: "Intervention terrain" },
        { icon: "box", label: "Transport léger" },
        { icon: "briefcase", label: "Mission professionnelle" },
        { icon: "calendar", label: "Besoin ponctuel ou durable" },
      ],
      image: {
        src: `${media}/famille-vehicules.webp`,
        alt: "Berline, pick-up et utilitaire blancs garés devant un entrepôt à Abidjan",
        width: 1400,
        height: 788,
        position: "50% 62%",
      },
      links: [{ label: "Définir mon besoin véhicule", href: "/equipements/vehicules" }, rentLink, buyLink],
    },
    {
      id: "motos",
      anchor: "famille-motos",
      number: "02",
      label: "Motos & mobilité légère",
      title: "Motos & mobilité légère",
      features: [
        { icon: "pin", label: "Déplacement urbain" },
        { icon: "users", label: "Activité de proximité" },
        { icon: "box", label: "Livraison" },
        { icon: "wrench", label: "Opération terrain" },
      ],
      image: {
        src: `${media}/famille-motos.webp`,
        alt: "Motos professionnelles alignées dans une cour à Abidjan",
        width: 1400,
        height: 788,
        position: "50% 72%",
      },
      links: [{ label: "Définir mon besoin moto", href: "/equipements/motos" }, rentLink, buyLink],
    },
    {
      id: "camions",
      anchor: "famille-camions-engins",
      number: "03",
      label: "Camions & engins",
      title: "Camions & engins",
      features: [
        { icon: "truck", label: "Transport" },
        { icon: "box", label: "Logistique" },
        { icon: "gear", label: "Manutention" },
        { icon: "excavator", label: "Chantier" },
        { icon: "briefcase", label: "Opération spécialisée" },
      ],
      image: {
        src: `${media}/famille-camions-engins.webp`,
        alt: "Camions benne et chargeuse sur un site à Abidjan, avec deux professionnels en gilet",
        width: 1400,
        height: 788,
        position: "50% 55%",
      },
      links: [{ label: "Définir mon besoin camion ou engin", href: "/equipements/camions-engins" }, rentLink, buyLink],
    },
    {
      id: "outils",
      anchor: "famille-outils-materiels",
      number: "04",
      label: "Outils & matériel",
      title: "Outils & matériel",
      features: [
        { icon: "wrench", label: "Intervention technique" },
        { icon: "excavator", label: "Chantier" },
        { icon: "bolt", label: "Énergie" },
        { icon: "gear", label: "Maintenance" },
        { icon: "calendar", label: "Opération temporaire" },
      ],
      image: {
        src: `${media}/famille-outils-materiels.webp`,
        alt: "Deux techniciens déchargeant des mallettes d’outils d’un utilitaire blanc",
        width: 1400,
        height: 876,
        position: "50% 45%",
      },
      links: [{ label: "Définir mon besoin matériel", href: "/equipements/outils-materiels" }, rentLink, buyLink],
    },
    {
      id: "connectes",
      anchor: "famille-equipements-connectes",
      number: "05",
      label: "Équipements connectés",
      title: "Équipements connectés",
      features: [
        { icon: "pin", label: "Localisation" },
        { icon: "monitor", label: "Supervision" },
        { icon: "shield", label: "Sécurisation" },
        { icon: "bell", label: "Alertes" },
        { icon: "clipboard", label: "Suivi d’actifs" },
      ],
      image: {
        src: `${media}/apercu-tableau-de-bord.webp`,
        alt: "Aperçu illustratif d’un tableau de bord de suivi : véhicule, engin et équipement avec position, entretien et connexion",
        width: 1756,
        height: 896,
        fit: "contain",
      },
      links: [
        { label: "Qualifier un équipement connecté", href: "/equipements/equipements-connectes" },
        { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
        { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
      ],
    },
  ] as EqpFamily[],
};

export const eqpRentBuy = {
  kicker: "Location ou acquisition",
  title: "Deux façons de vous équiper.",
  rent: {
    icon: "calendar" as EqpIconName,
    title: "Louer",
    lead: "Pour une mission, un renfort ou une durée à définir.",
    points: [
      { icon: "clock" as EqpIconName, label: "Durée à préciser" },
      { icon: "box" as EqpIconName, label: "Disponibilité à confirmer" },
      { icon: "file" as EqpIconName, label: "Conditions selon le matériel" },
      { icon: "wrench" as EqpIconName, label: "Services à étudier" },
    ],
    cta: { label: "Explorer la location", href: "/solutions/location" },
  },
  buy: {
    icon: "cart" as EqpIconName,
    title: "Acheter",
    lead: "Pour un usage durable et un besoin récurrent.",
    points: [
      { icon: "gear" as EqpIconName, label: "Caractéristiques à définir" },
      { icon: "link" as EqpIconName, label: "Compatibilité à vérifier" },
      { icon: "file" as EqpIconName, label: "Référence à confirmer" },
      { icon: "users" as EqpIconName, label: "Accompagnement à préciser" },
    ],
    cta: { label: "Explorer l’acquisition", href: "/solutions/vente" },
  },
};

export const eqpTerrain = {
  kicker: "Bien choisir vos équipements",
  titleLines: ["Le terrain détermine", "les bons critères."],
  items: [
    { number: "01", title: "Usage & contexte", text: "Activité · Environnement · Zone · Utilisateurs" },
    { number: "02", title: "Contraintes matérielles", text: "Capacité · Mobilité · Alimentation · Fréquence" },
    { number: "03", title: "Services associés", text: "Installation · Maintenance · Suivi éventuel" },
  ],
  note: "Les caractéristiques sont validées avant toute proposition.",
  image: {
    src: "/assets/images/projects/project-a/gestion-equipements-entrepot.png",
    alt: "Opératrice vérifiant des équipements sur une tablette dans un entrepôt",
    width: 1536,
    height: 1024,
  },
};

export const eqpTracking = {
  kicker: "Suivi et connectivité",
  titleLines: ["Vos équipements,", "mieux suivis."],
  lead: "Un dispositif de géolocalisation ou de supervision peut compléter votre équipement, selon sa compatibilité.",
  links: [
    { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
    { label: "Explorer la gestion de flotte", href: "/solutions/gestion-de-flotte" },
  ],
  mockTitle: "Aperçu illustratif",
  rows: [
    { icon: "van" as EqpIconName, name: "Véhicule A" },
    { icon: "excavator" as EqpIconName, name: "Engin B" },
    { icon: "generator" as EqpIconName, name: "Équipement C" },
  ],
  columns: [
    { icon: "pin" as EqpIconName, label: ["Position", "disponible"] },
    { icon: "file" as EqpIconName, label: ["Dernier", "événement"] },
    { icon: "wifi" as EqpIconName, label: ["Suivi", "configuré"] },
  ],
  caption: "Compatibilité, alimentation, réseau et accès à valider.",
};

export const eqpProcess = {
  kicker: "Notre approche",
  title: "Qualifier avant de proposer.",
  steps: [
    { number: "01", title: "Identifier", text: "La famille et l’usage." },
    { number: "02", title: "Préciser", text: "Quantité, lieu et durée." },
    { number: "03", title: "Vérifier", text: "Contraintes et disponibilité." },
    { number: "04", title: "Orienter", text: "Location, achat et services." },
    { number: "05", title: "Proposer", text: "Périmètre et conditions." },
    { number: "06", title: "Confirmer", text: "Référence et modalités." },
  ],
  cta: { label: "Préciser mon besoin", href: "#orientation-equipement" },
};

/* ---------- Formulaire de demande ---------- */

export const eqpBrief = {
  id: "orientation-equipement",
  title: "Parlons de votre besoin",
  lead: "Quelques repères pour orienter votre demande.",
  families: [
    { id: "vehicule", label: "Véhicule", icon: "van" as EqpIconName, phrase: "un véhicule" },
    { id: "moto", label: "Moto", icon: "moto" as EqpIconName, phrase: "une moto" },
    { id: "engin", label: "Camion et engin", icon: "excavator" as EqpIconName, phrase: "un camion ou un engin" },
    { id: "outil", label: "Outil ou matériel", icon: "wrench" as EqpIconName, phrase: "un outil ou un matériel" },
    { id: "connecte", label: "Équipement connecté", icon: "wifi" as EqpIconName, phrase: "un équipement connecté" },
    { id: "autre", label: "Autre", icon: "dots" as EqpIconName, phrase: "un autre équipement" },
  ],
  modes: [
    { id: "louer", label: "Louer", icon: "calendar" as EqpIconName, summary: "Location", verb: "louer" },
    { id: "acheter", label: "Acheter", icon: "cart" as EqpIconName, summary: "Achat", verb: "acheter" },
    { id: "comparer", label: "Comparer", icon: "chart" as EqpIconName, summary: "Comparaison", verb: "comparer la location et l’achat" },
    { id: "definir", label: "À définir", icon: "dots" as EqpIconName, summary: "À définir", verb: "définir le mode (location ou achat)" },
  ],
  usages: [
    "Mobilité professionnelle",
    "Transport et livraison",
    "Chantier et manutention",
    "Intervention technique",
    "Énergie",
    "Géolocalisation et supervision",
    "Autre usage",
  ],
  quantities: ["Une unité", "Deux à cinq unités", "Plus de cinq unités", "Quantité à définir"],
  zones: ["Abidjan", "Autre ville de Côte d’Ivoire", "Autre zone à préciser"],
  services: ["Livraison", "Installation", "Configuration", "Supervision", "À préciser"],
  durationPlaceholder: "À préciser",
  notice: "Cette demande ne constitue pas une réservation.",
};

export const eqpBriefDefaults = {
  family: "vehicule",
  mode: "louer",
  usage: eqpBrief.usages[0],
  quantity: eqpBrief.quantities[0],
  zone: eqpBrief.zones[0],
  duration: "",
  services: [] as string[],
};

export type EqpBriefState = typeof eqpBriefDefaults;

export function summarizeEqpBrief(state: EqpBriefState) {
  const family = eqpBrief.families.find((f) => f.id === state.family) ?? eqpBrief.families[0];
  const mode = eqpBrief.modes.find((m) => m.id === state.mode) ?? eqpBrief.modes[0];
  const duration = state.duration.trim() || eqpBrief.durationPlaceholder;
  const services = state.services.length ? state.services.join(", ") : "";
  return {
    family: family.label === "Véhicule" ? "Véhicule" : family.label,
    familyPhrase: family.phrase,
    mode: mode.summary,
    modeVerb: mode.verb,
    usage: state.usage,
    quantity: state.quantity,
    zone: state.zone,
    duration,
    services,
  };
}

export function buildEqpWhatsAppUrl(state: EqpBriefState) {
  const s = summarizeEqpBrief(state);
  const parts = [
    "Bonjour ONLOUTOU, je souhaite vous présenter un besoin d’équipement.",
    `Famille : ${s.family}.`,
    `Mode : ${s.mode}.`,
    `Usage : ${s.usage}.`,
    `Quantité : ${s.quantity}.`,
    `Zone : ${s.zone}.`,
    `Durée ou échéance : ${s.duration}.`,
  ];
  if (s.services) parts.push(`Accompagnement : ${s.services}.`);
  parts.push("Pouvez-vous m’orienter ?");
  return whatsappUrlForMessage(parts.join(" "));
}

export const eqpConfirm = {
  title: "Ce que nous confirmons ensemble",
  items: [
    { icon: "box" as EqpIconName, title: "L’équipement", text: "Famille, référence, caractéristiques, quantité." },
    { icon: "file" as EqpIconName, title: "Les conditions", text: "Prix, disponibilité, délai, durée et zone." },
    { icon: "gear" as EqpIconName, title: "Les services", text: "Livraison, installation, garantie, maintenance et restitution." },
  ],
  note: "Les éléments retenus figurent dans la proposition ou le contrat.",
};

export const eqpFaq = {
  titleLines: ["Vos questions.", "Nos réponses"],
  items: [
    {
      question: "Tous les équipements sont-ils disponibles ?",
      answer: "Les références et disponibilités sont confirmées après qualification de votre besoin.",
    },
    {
      question: "Puis-je comparer location et achat ?",
      answer:
        "Oui. Certaines catégories peuvent être étudiées en location ou en acquisition, selon le matériel, le contexte et la disponibilité. Le choix dépend notamment de la durée, de la fréquence d’utilisation et des services recherchés.",
    },
    {
      question: "Puis-je demander un équipement non présenté ?",
      answer:
        "Oui. Vous pouvez décrire un autre besoin afin qu’il soit qualifié, sans garantie automatique de disponibilité.",
    },
    {
      question: "Quels sont les délais de mise à disposition ?",
      answer:
        "Les délais dépendent de la famille d’équipement, de sa disponibilité et de la zone concernée. Ils sont à confirmer selon qualification, avant toute proposition.",
    },
    {
      question: "La livraison et l’installation sont-elles possibles à Abidjan et à l’intérieur du pays ?",
      answer:
        "La livraison et l’installation peuvent être étudiées à Abidjan et dans d’autres villes de Côte d’Ivoire, selon le matériel, la zone et les conditions. Leur faisabilité et leurs modalités sont à confirmer selon qualification.",
    },
    {
      question: "La maintenance et l’assistance sont-elles prévues ?",
      answer:
        "L’entretien, la maintenance et l’assistance peuvent faire partie des services étudiés avec la proposition, selon l’équipement. Leur périmètre est précisé dans la proposition ou le contrat applicable.",
    },
    {
      question: "Existe-t-il une durée minimale de location ?",
      answer:
        "La durée dépend de l’équipement et de votre besoin. Une éventuelle durée minimale est à confirmer selon qualification et figure dans la proposition ou le contrat applicable.",
    },
    {
      question: "Peut-on ajouter la géolocalisation à un équipement loué ?",
      answer:
        "Lorsque l’équipement est compatible et que les conditions techniques le permettent, un dispositif de géolocalisation ou de supervision peut être étudié. Compatibilité, alimentation, réseau et accès sont à valider.",
    },
    {
      question: "Quelles informations ou quels documents faut-il fournir ?",
      answer:
        "Pour qualifier votre demande, indiquez la famille, l’usage, la quantité, la zone et la durée ou l’échéance. Les éventuels documents à fournir sont précisés lors de la qualification.",
    },
  ],
};

export const eqpFinalCta = {
  titleLines: ["Votre activité mérite", "les bons moyens."],
  cta: { label: "Échanger avec ONLOUTOU", href: "/contact" },
};
