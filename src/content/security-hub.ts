import { site } from "@/content/site";
import { whatsappHref } from "@/content/whatsapp-journeys";
import type { SecIconName } from "@/components/security/redesign/SecIcon";

const img = "/assets/images/solutions/securisation-actifs/hub";

export const secBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Sécurisation des actifs" },
];

export const secHero = {
  kicker: "Sécurisation des actifs",
  titleLines: ["Mieux suivre"],
  titleUnderlineLine: { before: "vos ", underline: "actifs." },
  titleLinesAfter: ["Mieux encadrer", "les risques."],
  lead: "Associez équipements, remontées d’information et supervision à un cadre défini pour votre projet.",
  primary: { label: "Étudier mon besoin", href: "/contact" },
  secondary: { label: "Explorer les possibilités", href: "#dispositif" },
  image: {
    src: `${img}/hero-technicien-groupe-electrogene.webp`,
    width: 1313,
    height: 838,
    alt: "Un technicien ONLOUTOU en casque blanc paramètre un boîtier de suivi sur un groupe électrogène jaune, devant des engins de chantier.",
  },
  card: {
    title: "Événement à examiner",
    meta: "Actif mobile • Géozone",
    link: "Consulter le contexte",
  },
  caption: "Aperçu illustratif — données fictives",
};

export const secStrip: { icon: SecIconName; title: string; text: string }[] = [
  { icon: "excavator", title: "Matériel adapté", text: "Des solutions selon vos usages et environnements." },
  { icon: "monitorChart", title: "Supervision organisée", text: "Remontées d’information et suivi centralisé." },
  { icon: "docShield", title: "Cadre contractuel", text: "Un périmètre défini, selon votre projet." },
];

export const secDevice = {
  id: "dispositif",
  kicker: "Possibilités à étudier",
  title: "Un dispositif adapté à vos actifs.",
  lead: "Le périmètre se construit selon vos équipements, vos usages et les informations disponibles.",
  note: "Les fonctions dépendent du matériel, de la couverture réseau et du contrat.",
  cards: [
    { icon: "generator" as SecIconName, title: "Équipements financés", text: "Suivi à définir selon le contexte contractuel.", href: "#references" },
    { icon: "truck" as SecIconName, title: "Actifs mobiles", text: "Remontée de position selon les dispositifs installés.", href: "/solutions/geolocalisation" },
    { icon: "pin" as SecIconName, title: "Alertes et géozones", text: "Paramétrage selon les situations à surveiller.", href: "/solutions/geolocalisation#alertes" },
    { icon: "bell" as SecIconName, title: "Événements", text: "Détection selon les équipements et données disponibles.", href: "/solutions/geolocalisation#alertes" },
    { icon: "gear" as SecIconName, title: "Déploiement et supervision", text: "Accompagnement à la mise en place et à l’exploitation.", href: "#cadre" },
    { icon: "report" as SecIconName, title: "Rapports et exports", text: "Informations structurées selon le périmètre retenu.", href: "/solutions/gestion-de-flotte#tableaux-de-bord" },
  ],
};

export const secFrame = {
  id: "cadre",
  kicker: "Notre démarche",
  titleLines: ["Un cadre clair,"],
  titleUnderline: "dès le départ.",
  lead: "Définissons ensemble ce qui doit être suivi, les événements utiles et les conditions d’exploitation.",
  rows: [
    { icon: "file" as SecIconName, label: "Identifier les actifs", href: "#a-preciser" },
    { icon: "gear" as SecIconName, label: "Définir les événements", href: "/solutions/geolocalisation#alertes" },
    { icon: "pin" as SecIconName, label: "Valider le périmètre", href: "/contact" },
  ],
  image: {
    src: `${img}/cadre-professionnels-tablette.webp`,
    width: 908,
    height: 1376,
    alt: "Deux professionnels en casque consultent une tablette devant des engins de chantier jaunes.",
  },
  brief: {
    id: "a-preciser",
    title: "À préciser pour votre projet",
    items: ["Type et quantité d’actifs", "Zones d’utilisation", "Objectifs de suivi", "Équipements déjà installés"],
    href: "/contact",
    warning: "L’immobilisation d’un équipement n’est pas une capacité universelle ou automatique.",
  },
};

export const secReferences = {
  id: "references",
  kicker: "Références historiques",
  titleLines: ["Une expérience du suivi", "d’équipements financés."],
  text: "ONLOUTOU dispose de références historiques dans la mise en œuvre de solutions GPS liées à des opérations de crédit-bail, notamment auprès de la BNI et de Banque Atlantique Côte d’Ivoire.",
  disclaimer: "Ces mentions ne constituent pas une liste de partenariats actifs ni une garantie de résultat.",
};

export const secFaq = {
  id: "faq",
  kicker: "FAQ",
  titleLines: ["Les questions"],
  titleUnderline: "à éclaircir.",
  lead: "Des réponses claires pour mieux comprendre le fonctionnement, le périmètre et les conditions de mise en œuvre.",
  items: [
    {
      question: "Est-ce réservé aux banques ?",
      answer:
        "Le besoin peut aussi concerner des entreprises ou des gestionnaires d’actifs. Le dispositif est étudié selon le contexte du projet.",
    },
    {
      question: "Quels équipements peut-on suivre ?",
      answer:
        "Des équipements financés ou des actifs mobiles peuvent être étudiés, sous réserve de la compatibilité du matériel et des informations disponibles.",
    },
    {
      question: "Comment sont définies les alertes ?",
      answer:
        "Les alertes et géozones sont paramétrées avec vous, selon les situations à surveiller, le matériel installé et les données remontées.",
    },
    {
      question: "Quelles sont les conditions de fonctionnement ?",
      answer:
        "Les fonctions dépendent du matériel installé, de la couverture réseau et des termes du contrat. Elles sont précisées lors du cadrage du projet.",
    },
    {
      question: "Faut-il installer un dispositif sur chaque actif ?",
      answer:
        "Le suivi repose sur des équipements adaptés à chaque actif. Le périmètre et les actifs concernés sont définis avec vous avant toute installation.",
    },
    {
      question: "L’immobilisation d’un équipement est-elle possible ?",
      answer:
        "Il ne s’agit pas d’une capacité universelle ou automatique. Elle dépend du matériel, du contexte contractuel et du paramétrage retenu.",
    },
    {
      question: "Les mêmes informations sont-elles disponibles pour tous les actifs ?",
      answer:
        "Non, pas nécessairement. Positions, événements et rapports varient selon les équipements, la couverture réseau et le périmètre retenu.",
    },
    {
      question: "Que préparer avant de vous contacter ?",
      answer:
        "Indiquez le type et la quantité d’actifs, leurs zones d’utilisation, vos objectifs de suivi et les équipements déjà installés. Cela permet de cadrer le besoin plus vite.",
    },
  ],
};

export const secCta = {
  id: "contact",
  kicker: "Contactez-nous",
  titleLines: ["Parlons de vos actifs", "et de vos priorités."],
  lead: "Décrivez votre parc, vos usages et le suivi recherché.",
  primary: { label: "Présenter mon besoin", href: "/contact" },
  whatsapp: { label: "Échanger sur WhatsApp", href: whatsappHref("assetSecurity") },
  phone: { label: site.phoneDisplay, href: `tel:${site.phoneTel}` },
  image: {
    src: `${img}/cta-techniciens-atelier.webp`,
    width: 1500,
    height: 681,
    alt: "Deux techniciens ONLOUTOU consultent une tablette près d’un équipement jaune dans un atelier.",
  },
};

export const secExplore = {
  kicker: "Pour compléter votre projet",
  links: [
    { icon: "truck" as SecIconName, title: "Location", text: "Des véhicules et engins pour vos opérations.", href: "/solutions/location" },
    { icon: "cart" as SecIconName, title: "Vente", text: "Des équipements adaptés à vos besoins.", href: "/solutions/vente" },
    { icon: "pin" as SecIconName, title: "Géolocalisation", text: "Le suivi de vos actifs en temps réel.", href: "/solutions/geolocalisation" },
    { icon: "users" as SecIconName, title: "Gestion de flotte", text: "Des outils pour plus de performance.", href: "/solutions/gestion-de-flotte" },
    { icon: "monitor" as SecIconName, title: "Plateformes numériques", text: "Des solutions connectées pour vos opérations.", href: "/solutions/plateformes-sur-mesure" },
  ],
};
