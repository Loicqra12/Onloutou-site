import type { NavItem } from "@/types/content";

export const site = {
  name: "ONLOUTOU",
  tagline: "Louer, acheter, connecter, construire",
  locale: "fr-FR",
  phoneDisplay: "+225 05 54 13 77 77",
  phoneTel: "+2250554137777",
  whatsappUrl:
    "https://wa.me/2250554137777?text=Bonjour%20ONLOUTOU%2C%20je%20souhaite%20vous%20parler%20d%27un%20projet.",
  location: "Abidjan · Côte d’Ivoire",
  copyrightYear: 2026,
};

export const announcement = {
  line1: "Solutions technologiques conçues en Côte d’Ivoire",
  line2: "Déploiement en Afrique de l’Ouest",
};

export const mainNav: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/solutions", label: "Solutions" },
  { href: "/expertise", label: "Expertise" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const contactHref = "/contact";

export const footerActivities = [
  "Location d’équipements",
  "Vente d’équipements",
  "Géolocalisation GPS & IoT",
  "Gestion de flotte",
  "Plateformes numériques",
  "Projets et appels d’offres",
];

export const trustNames = ["BNI", "BANQUE ATLANTIQUE", "COMOÉ CAPITAL"];

/** @deprecated Préférer `home-metadata.ts` et `createPageMetadata` pour les titres par page. */
export const seo = {
  title: "ONLOUTOU — Louer, connecter, piloter",
  description:
    "ONLOUTOU, entreprise en Côte d’Ivoire : location d’équipements, géolocalisation GPS, IoT, gestion de flotte, sécurisation d’actifs et plateformes technologiques.",
};
