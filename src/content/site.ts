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

/** Liens publics déjà publiés par ONLOUTOU. Pas de compte TikTok vérifié dans les sources. */
export const siteSocialLinks = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/Location.Sans.Caution/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/onloutou-géolocalisation",
  },
  {
    id: "mail",
    label: "Écrire à contact@onloutou.com",
    href: "mailto:contact@onloutou.com",
  },
] as const;

/** Fiche publique « ONLOUTOU — N°1 de la location en Côte d’Ivoire » : 3,3/5, 25 avis. */
export const googleReviews = {
  title: "Avis Google",
  score: 3.3,
  scoreLabel: "3,3/5",
  countLabel: "25 avis",
  summary: "Note Google 3,3 sur 5, fondée sur 25 avis",
  action: "Laisser un avis",
  href: "https://www.google.com/maps/search/?api=1&query=ONLOUTOU%20N%C2%B01%20de%20la%20location%20en%20C%C3%B4te%20d%27Ivoire",
} as const;

export const siteLanguage = {
  label: "Langue",
  current: "Français",
} as const;

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
