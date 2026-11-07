import { site } from "@/content/site";
import type { GlxIconName } from "@/components/geolocation/redesign/GlxIcon";

const media = "/assets/images/solutions/geolocalisation";

export const glxHero = {
  breadcrumb: [
    { label: "Accueil", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: "Géolocalisation" },
  ],
  kicker: "Géolocalisation",
  titleLines: ["Gardez", "le lien avec", "vos véhicules."],
  intro: "Localisez vos actifs, consultez leurs trajets et exploitez les alertes utiles à vos opérations.",
  primaryCta: { label: "Étudier mon besoin", href: "/contact?need=gps" },
  secondaryCta: { label: "Voir le fonctionnement", href: "#fonctionnement" },
  caveat: "Fonctions selon le dispositif, la connectivité et la configuration retenue.",
  badge: { title: "Aperçu illustratif", text: "Données et positions fictives." },
  image: {
    src: `${media}/hero-ecran-balise-gps.webp`,
    alt: "Tablette affichant une carte de suivi de véhicules avec des positions fictives, et un boîtier GPS posé devant",
    width: 1536,
    height: 1024,
  },
};

export const glxStrip: { icon: GlxIconName; label: string }[] = [
  { icon: "wrench", label: "Installation terrain" },
  { icon: "pin", label: "Positions & historique" },
  { icon: "bell", label: "Alertes et géozones" },
  { icon: "monitor", label: "Supervision des actifs" },
];

export const glxField = {
  kicker: "Du matériel au suivi",
  titleLines: ["Une solution", "commence sur", "le terrain."],
  lead: "Le dispositif, sa pose et son paramétrage sont étudiés selon vos usages.",
  steps: ["Étudier le véhicule ou l’actif", "Vérifier la compatibilité", "Installer et contrôler"],
  cta: { label: "Découvrir notre approche", href: "#installation-terrain" },
  image: {
    src: `${media}/installation-tableau-de-bord.webp`,
    alt: "Technicien ONLOUTOU raccordant un dispositif GPS sous le tableau de bord d’un véhicule",
    width: 1400,
    height: 933,
  },
};

export const glxProcess = {
  id: "fonctionnement",
  kicker: "Notre approche",
  title: "Du terrain à votre écran.",
  steps: [
    { number: "01", title: "Équiper", text: "Installer un dispositif compatible." },
    { number: "02", title: "Transmettre", text: "Acheminer les données via le réseau disponible." },
    { number: "03", title: "Centraliser", text: "Rassembler positions et événements." },
    { number: "04", title: "Exploiter", text: "Consulter les informations utiles." },
  ],
};

export const glxPlatform = {
  id: "plateforme",
  kicker: "Votre espace de suivi",
  lead: "Retrouvez les informations utiles dans une interface centralisée.",
  caption: "Aperçu illustratif — données fictives. Interface et fonctions selon le projet.",
  tabs: [
    {
      id: "localisation",
      label: "Localisation",
      icon: "pin" as GlxIconName,
      image: {
        src: `${media}/apercu-localisation-flotte-abidjan.webp`,
        alt: "Interface de démonstration de géolocalisation de flotte à Abidjan : carte, liste des véhicules et indicateurs, données illustratives.",
        width: 1672,
        height: 941,
      },
    },
    {
      id: "supervision",
      label: "Supervision",
      icon: "chart" as GlxIconName,
      image: {
        src: `${media}/apercu-supervision-flotte.webp`,
        alt: "Interface de démonstration de supervision de flotte : indicateurs, alertes et activité, données illustratives.",
        width: 1586,
        height: 992,
      },
    },
  ],
};

export const glxFeatures = {
  id: "alertes",
  kicker: "Des fonctionnalités utiles",
  title: "Les informations qui comptent.",
  items: [
    { icon: "pin" as GlxIconName, title: "Localisation", text: "Consulter les positions disponibles." },
    { icon: "route" as GlxIconName, title: "Historique des trajets", text: "Revenir sur les déplacements." },
    { icon: "bell" as GlxIconName, title: "Alertes configurables", text: "Identifier les événements retenus." },
    { icon: "zone" as GlxIconName, title: "Géozones", text: "Définir des périmètres de suivi." },
    { icon: "chart" as GlxIconName, title: "Arrêts & mouvements", text: "Replacer les événements dans leur contexte." },
    { icon: "report" as GlxIconName, title: "Rapports & exports", text: "Partager les informations disponibles." },
    { icon: "users" as GlxIconName, title: "Profils & accès", text: "Adapter la visibilité aux utilisateurs." },
    { icon: "gear" as GlxIconName, title: "Données de l’actif", text: "Exploiter les remontées compatibles." },
  ],
  note: "Capacités à valider selon le matériel et le périmètre.",
};

export const glxUsages = {
  kicker: "Des solutions concrètes",
  title: "Des usages ancrés dans le réel.",
  cards: [
    {
      title: "Flottes professionnelles",
      text: "Suivre vos véhicules et optimiser vos opérations.",
      href: "/solutions/gestion-de-flotte",
      image: {
        src: `${media}/usage-flottes-professionnelles.webp`,
        alt: "Utilitaires blancs alignés devant un entrepôt",
        position: "50% 55%",
      },
    },
    {
      title: "Logistique & livraison",
      text: "Accompagner vos tournées au quotidien.",
      href: "/livraison",
      image: {
        src: `${media}/usage-logistique-livraison.webp`,
        alt: "Conducteur professionnel au volant d’un véhicule à Abidjan",
        position: "50% 40%",
      },
    },
    {
      title: "Équipements mobiles",
      text: "Suivre vos matériels, où qu’ils se trouvent.",
      href: "/solutions/securisation-actifs",
      image: {
        src: `${media}/usage-equipements-mobiles.webp`,
        alt: "Groupe électrogène jaune ONLOUTOU et deux techniciens sur un site",
        position: "70% 50%",
      },
    },
    {
      title: "Projets spécifiques",
      text: "Adapter le suivi à vos contraintes terrain.",
      href: "/solutions/plateformes-sur-mesure",
      image: {
        src: `${media}/usage-projets-specifiques.webp`,
        alt: "Équipe en gilets de chantier consultant une tablette devant un engin",
        position: "35% 45%",
      },
    },
  ],
};

export const glxInstall = {
  id: "installation-terrain",
  kicker: "Déploiement",
  titleLines: ["Installer.", "Contrôler.", "Accompagner."],
  lead: "Une mise en œuvre simple et maîtrisée, de l’étude à la prise en main par vos équipes.",
  image: {
    src: `${media}/installation-equipe-terrain.webp`,
    alt: "Deux techniciens ONLOUTOU contrôlant un véhicule avec une tablette devant un utilitaire",
    width: 1400,
    height: 933,
  },
  steps: [
    { number: "01", title: "Cadrer les usages", text: "Définir les objectifs et les contraintes." },
    { number: "02", title: "Vérifier la compatibilité", text: "Étudier le véhicule, l’actif et l’alimentation." },
    { number: "03", title: "Choisir le dispositif", text: "Valider le matériel et la connectivité." },
    { number: "04", title: "Installer & paramétrer", text: "Réaliser la pose et configurer le suivi." },
    { number: "05", title: "Tester", text: "Contrôler les remontées, alertes et accès." },
    { number: "06", title: "Accompagner", text: "Former les équipes et préciser le suivi." },
  ],
};

export const glxPilotage = {
  title: "Au-delà de la position, le pilotage.",
  text: "Organisez les rôles, les événements et les rapports de votre parc.",
  cta: { label: "Découvrir la gestion de flotte", href: "/solutions/gestion-de-flotte" },
};

export const glxFaq = {
  kicker: "FAQ",
  titleLines: ["Les réponses", "à vos questions."],
  lead: ["Une solution simple à déployer,", "claire à utiliser et adaptée", "à vos opérations terrain."],
  note: "Les fonctions dépendent du matériel installé, du réseau, de l’alimentation et de la configuration validée.",
  items: [
    {
      question: "Est-ce compatible avec tous les véhicules ?",
      answer:
        "Une vérification du véhicule, du dispositif et des données recherchées précède l’installation.",
    },
    {
      question: "Peut-on suivre plusieurs véhicules ?",
      answer:
        "Une organisation peut centraliser plusieurs actifs selon la configuration retenue et les droits d’accès définis.",
    },
    {
      question: "Que se passe-t-il sans réseau mobile ?",
      answer:
        "La transmission dépend de la couverture et du dispositif. Certains équipements peuvent conserver temporairement des informations, selon leurs caractéristiques, avant transmission.",
    },
    {
      question: "Peut-on configurer des alertes et des géozones ?",
      answer:
        "Ces fonctions peuvent être configurées lorsque le matériel et la plateforme retenus les prennent en charge.",
    },
    {
      question: "ONLOUTOU réalise-t-il l’installation ?",
      answer:
        "ONLOUTOU peut accompagner l’étude, l’installation, le paramétrage, les tests et la prise en main selon le périmètre convenu.",
    },
  ],
};

export const glxCta = {
  kicker: "Votre projet",
  titleLines: ["Étudions votre", "besoin de suivi."],
  lead: ["Présentez vos véhicules, vos actifs", "et vos contraintes terrain."],
  primary: { label: "Parler de mon projet", href: "/contact?need=gps" },
  phone: { label: "Appeler ONLOUTOU", href: `tel:${site.phoneTel}` },
  image: {
    src: `${media}/cta-technicien-tablette.webp`,
    alt: "Technicien ONLOUTOU consultant une tablette dans un atelier, avec des utilitaires en arrière-plan",
    width: 2172,
    height: 724,
  },
};

export const glxExplore = {
  kicker: "À explorer aussi",
  links: [
    { icon: "excavator" as GlxIconName, lines: ["Location", "d’équipements"], href: "/solutions/location" },
    { icon: "cart" as GlxIconName, lines: ["Vente", "d’équipements"], href: "/solutions/vente" },
    { icon: "users" as GlxIconName, lines: ["Gestion", "de flotte"], href: "/solutions/gestion-de-flotte" },
    { icon: "shield" as GlxIconName, lines: ["Sécurisation", "d’actifs"], href: "/solutions/securisation-actifs" },
    { icon: "gear" as GlxIconName, lines: ["Plateformes", "sur mesure"], href: "/solutions/plateformes-sur-mesure" },
  ],
};
