import {
  articleFamilies,
  articleFamilyHint,
  articleFamilyHref,
  otherArticleHref,
} from "@/content/article-families";
import { megaMenuEquipementsImage } from "@/content/mega-menu-equipements-image";
import { site } from "@/content/site";
import type { HeaderNavItem, MegaMenuConfig, NavImage } from "@/types/navigation";

const projectA = "/assets/images/projects/project-a";
const projectB = "/assets/images/projects/project-b";

const img = (
  src: string,
  alt: string,
  width: number,
  height: number,
  objectPosition: string,
): NavImage => ({ src, alt, width, height, objectPosition });

const mobilityImage = img(
  `${projectA}/mobilite-professionnelle-cour-logistique.png`,
  "Utilitaire, berline et scooter présentés dans une cour logistique",
  1536,
  1024,
  "48% 58%",
);

const supervisionImage = img(
  `${projectA}/supervision-flotte-abidjan.png`,
  "Écran de démonstration de supervision de flotte consulté depuis un bureau — données illustratives",
  1536,
  1024,
  "72% 42%",
);

const digitalImage = img(
  `${projectA}/reunion-projet-numerique.png`,
  "Équipe discutant d'un outil numérique autour d'une tablette",
  1536,
  1024,
  "58% 40%",
);

const equipmentMenuImage = img(
  megaMenuEquipementsImage.src,
  megaMenuEquipementsImage.alt,
  megaMenuEquipementsImage.width,
  megaMenuEquipementsImage.height,
  megaMenuEquipementsImage.objectPosition,
);

const expertiseImage = img(
  `${projectB}/formation-dispositif-connecte.png`,
  "Techniciens ONLOUTOU consultant une tablette devant un groupe électrogène",
  1536,
  1024,
  "42% 38%",
);

const facadeImage = img(
  "/assets/images/about/facade-onloutou-slogan.png",
  "Façade ONLOUTOU avec enseigne jaune et noire",
  1742,
  903,
  "center 52%",
);

const solutionsMenu: MegaMenuConfig = {
  id: "solutions",
  label: "Solutions",
  variant: "columns",
  eyebrow: "Nos solutions",
  width: 1156,
  asideWeight: 1.2,
  overview: { label: "Toutes les solutions", href: "/solutions" },
  groups: [
    {
      id: "equiper",
      iconId: "excavator",
      title: "Équiper",
      description: "Les moyens adaptés à votre activité.",
      items: [
        { type: "link", label: "Location d'équipements", href: "/solutions/location", emphasis: true },
        { type: "link", label: "Vente d'équipements", href: "/solutions/vente" },
        { type: "link", label: "Explorer les familles", href: "/equipements" },
      ],
    },
    {
      id: "connecter",
      iconId: "pin",
      title: "Connecter & piloter",
      description: "Gardez la maîtrise du terrain.",
      items: [
        { type: "link", label: "Géolocalisation", href: "/solutions/geolocalisation" },
        { type: "link", label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
        { type: "link", label: "Sécurisation des actifs", href: "/solutions/securisation-actifs" },
      ],
    },
    {
      id: "construire",
      iconId: "cog",
      title: "Construire",
      description: "Des outils conçus pour vos usages.",
      items: [
        { type: "link", label: "Plateformes sur mesure", href: "/solutions/plateformes-sur-mesure" },
        {
          type: "link",
          label: "Applications métier",
          href: "/solutions/plateformes-sur-mesure#roles-interfaces",
        },
        {
          type: "link",
          label: "Préparer un projet",
          href: "/solutions/plateformes-sur-mesure#brief-projet",
        },
      ],
    },
  ],
  visual: {
    image: mobilityImage,
    title: "Un besoin. La bonne solution.",
    subtitle: "Parlons de votre activité.",
    cta: { label: "Trouver ma solution", href: "/solutions#contact-solutions" },
  },
  footer: {
    iconId: "chat",
    text: "Un projet à préciser ?",
    cta: { label: "Échangeons sur votre besoin", href: "/contact" },
  },
};

const equipmentMenu: MegaMenuConfig = {
  id: "equipements",
  label: "Articles & équipements",
  variant: "split-families",
  eyebrow: "Articles & équipements",
  width: 1180,
  asideWeight: 0.78,
  overview: { label: "Vue d'ensemble", href: "/equipements" },
  sections: [
    {
      id: "quotidien",
      title: "Articles du quotidien",
      hint: articleFamilyHint,
    },
    {
      id: "professionnel",
      title: "Véhicules & matériel professionnel",
    },
  ],
  groups: [
    ...articleFamilies.map((family) => ({
      id: family.id,
      sectionId: "quotidien",
      iconId: family.iconId,
      title: family.label,
      description: family.hint,
      href: articleFamilyHref(family.id),
      items: [],
    })),
    {
      id: "vehicules",
      sectionId: "professionnel",
      iconId: "van" as const,
      title: "Véhicules professionnels",
      href: "/equipements/vehicules",
      items: [],
    },
    {
      id: "camions",
      sectionId: "professionnel",
      iconId: "excavator" as const,
      title: "Camions & engins",
      href: "/equipements/camions-engins",
      items: [],
    },
    {
      id: "connectes",
      sectionId: "professionnel",
      iconId: "signal" as const,
      title: "Équipements connectés",
      href: "/equipements/equipements-connectes",
      items: [],
    },
    {
      id: "motos",
      sectionId: "professionnel",
      iconId: "bike" as const,
      title: "Motos & deux-roues",
      href: "/equipements/motos",
      items: [],
    },
    {
      id: "outils",
      sectionId: "professionnel",
      iconId: "drill" as const,
      title: "Outils & matériel",
      href: "/equipements/outils-materiels",
      items: [],
    },
  ],
  promo: {
    iconId: "document",
    title: "Location ou achat ?",
    cta: { label: "Comparer les options", href: "/solutions/vente#acheter-ou-louer" },
  },
  visual: {
    image: equipmentMenuImage,
    cta: { label: "Je cherche un autre article", href: otherArticleHref },
    ctaStyle: "button",
  },
  footer: {
    iconId: "info",
    text: "Disponibilité confirmée après étude du besoin.",
  },
};

const expertiseMenu: MegaMenuConfig = {
  id: "expertise",
  label: "Expertise",
  variant: "columns",
  eyebrow: "Notre expertise",
  width: 1156,
  asideWeight: 1.15,
  overview: { label: "Découvrir l'expertise", href: "/expertise" },
  groups: [
    {
      id: "preparer",
      iconId: "document-gear",
      title: "Préparer & déployer",
      description: "Poser les bonnes bases.",
      items: [
        { type: "link", label: "Cadrage du projet", href: "/expertise#cadrage" },
        { type: "link", label: "Déploiement terrain", href: "/expertise#deploiement" },
        { type: "link", label: "Installation & paramétrage", href: "/expertise#installation-parametrage" },
      ],
    },
    {
      id: "exploiter",
      iconId: "team",
      title: "Exploiter & accompagner",
      description: "Faire vivre les solutions au quotidien.",
      items: [
        { type: "link", label: "Flotte & opérations", href: "/expertise#flotte-operations" },
        { type: "link", label: "Supervision & reporting", href: "/expertise#supervision-reporting" },
        { type: "link", label: "Formation & accompagnement", href: "/expertise#transfert-suivi" },
      ],
    },
    {
      id: "solutions-associees",
      iconId: "pin",
      title: "Solutions associées",
      description: "Les solutions liées à ces prestations.",
      items: [
        { type: "link", label: "Géolocalisation : installation terrain", href: "/solutions/geolocalisation#installation-terrain" },
        { type: "link", label: "Gestion de flotte : pilotage", href: "/solutions/gestion-de-flotte#pilotage" },
        {
          type: "link",
          label: "Gestion de flotte : tableaux de bord",
          href: "/solutions/gestion-de-flotte#tableaux-de-bord",
        },
      ],
    },
  ],
  visual: {
    image: expertiseImage,
    title: "Du terrain au suivi.",
    subtitle: "Une approche adaptée à vos opérations.",
  },
  footer: {
    iconId: "document",
    text: "Appels d'offres & projets structurés",
    cta: { label: "Parlons de votre projet", href: "/projets#brief-projet" },
  },
};

const projectsMenu: MegaMenuConfig = {
  id: "projets",
  label: "Projets",
  variant: "cards",
  eyebrow: "Explorer les projets",
  width: 1156,
  overview: { label: "Vue d'ensemble", href: "/projets" },
  groups: [],
  cards: [
    {
      id: "realisations-numeriques",
      title: "Réalisations numériques",
      description: "Sites, interfaces et espaces de gestion.",
      href: "/projets#realisations-numeriques",
      image: digitalImage,
    },
    {
      id: "missions-terrain",
      title: "Missions terrain",
      description: "Géolocalisation, installation et supervision.",
      href: "/projets#missions-terrain",
      image: supervisionImage,
    },
    {
      id: "innovations",
      title: "Innovations & MVP",
      description: "Des initiatives à différents stades de développement.",
      href: "/projets#innovations",
      image: mobilityImage,
    },
  ],
  cardsNote: "Chaque projet est présenté selon son périmètre et son avancement.",
  footer: {
    iconId: "chat",
    text: "Votre projet commence par un besoin.",
    cta: { label: "Préparer mon brief", href: "/projets#brief-projet" },
  },
};

const partnersMenu: MegaMenuConfig = {
  id: "partenaires",
  label: "Partenaires",
  variant: "columns",
  eyebrow: "Grandir ensemble",
  width: 1156,
  asideWeight: 1.3,
  overview: { label: "Voir les partenariats", href: "/partenaires" },
  groups: [
    {
      id: "collaborer",
      iconId: "handshake",
      title: "Collaborer",
      description: "Construire une relation utile.",
      items: [
        { type: "link", label: "Devenir partenaire", href: "/devenir-partenaire", emphasis: true },
        {
          type: "link",
          label: "Présenter une proposition",
          href: "/devenir-partenaire#preparer-proposition",
        },
        { type: "link", label: "Nos modes de collaboration", href: "/partenaires#profils-partenaires" },
      ],
    },
    {
      id: "profils",
      iconId: "network",
      title: "Les profils",
      description: "Trouver votre place dans le réseau.",
      items: [
        { type: "link", label: "Fournisseurs", href: "/partenaires/fournisseurs" },
        { type: "link", label: "Livraison & coordination", href: "/livraison" },
        { type: "link", label: "Partenaires technologiques", href: "/partenaires/technologiques" },
        { type: "link", label: "Devenir livreur", href: "/devenir-livreur" },
      ],
    },
  ],
  aside: {
    id: "espaces",
    iconId: "grid",
    title: "Vos espaces",
    description: "Des outils pour simplifier les échanges.",
    items: [
      {
        type: "link",
        label: "Espace partenaire",
        href: "/espace-partenaire",
      },
      {
        type: "link",
        label: "Découvrir le futur espace livreur",
        href: "/espace-livreur",
        badge: "En préparation",
      },
    ],
    note: "L’espace partenaire est accessible avec un compte. L’espace livreur est encore en préparation.",
  },
  footer: {
    iconId: "handshake",
    text: "Une idée de collaboration ?",
    cta: { label: "Échangeons sur votre proposition", href: "/contact" },
  },
};

const aboutMenu: MegaMenuConfig = {
  id: "a-propos",
  label: "À propos",
  variant: "columns",
  eyebrow: "Découvrir ONLOUTOU",
  width: 1030,
  asideWeight: 1.25,
  groups: [
    {
      id: "entreprise",
      iconId: "building",
      title: "L'entreprise",
      items: [
        { type: "link", label: "Notre approche", href: "/a-propos#about-principles" },
        { type: "link", label: "Équipe & compétences", href: "/a-propos#about-team" },
        { type: "link", label: "Présence régionale", href: "/a-propos#about-implantation" },
        { type: "link", label: "Références historiques", href: "/a-propos#about-references" },
      ],
    },
    {
      id: "contact-aide",
      iconId: "chat",
      title: "Nous joindre",
      items: [
        { type: "link", label: "Contact", href: "/contact" },
        { type: "link", label: "Centre d'aide", href: "/aide" },
      ],
      note: "Une question ? Notre équipe vous accompagne.",
    },
  ],
  visual: {
    image: facadeImage,
    title: "Notre histoire",
    subtitle: "Découvrez le parcours d'ONLOUTOU.",
    cta: { label: "Lire notre histoire", href: "/a-propos#parcours" },
  },
};

export const headerNavigation: HeaderNavItem[] = [
  { type: "link", id: "accueil", label: "Accueil", href: "/" },
  { type: "menu", id: "solutions", label: "Solutions", href: "/solutions", menu: solutionsMenu },
  { type: "menu", id: "equipements", label: "Articles & équipements", href: "/equipements", menu: equipmentMenu },
  { type: "menu", id: "expertise", label: "Expertise", href: "/expertise", menu: expertiseMenu },
  { type: "menu", id: "projets", label: "Projets", href: "/projets", menu: projectsMenu },
  { type: "menu", id: "partenaires", label: "Partenaires", href: "/partenaires", menu: partnersMenu },
  { type: "menu", id: "a-propos", label: "À propos", href: "/a-propos", menu: aboutMenu },
];

export const headerUtility = {
  location: "Abidjan, Côte d’Ivoire",
  phoneDisplay: "05 54 13 77 77",
  phoneTel: site.phoneTel,
  phoneHref: `tel:${site.phoneTel}`,
  whatsappUrl: "https://wa.me/2250554137777",
  whatsappLabel: "Échanger sur WhatsApp",
};

export const headerCta = {
  label: "Nous contacter",
  href: "/contact",
};

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/partenaires") {
    return (
      pathname === "/partenaires" ||
      pathname.startsWith("/partenaires/") ||
      pathname === "/devenir-partenaire" ||
      pathname.startsWith("/devenir-partenaire/")
    );
  }
  const [path] = href.split("#");
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function menuItems() {
  return headerNavigation.filter((item) => item.type === "menu");
}
