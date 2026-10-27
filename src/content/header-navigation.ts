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

const warehouseImage = img(
  `${projectA}/gestion-equipements-entrepot.png`,
  "Opératrice scannant des équipements dans un entrepôt",
  1536,
  1024,
  "64% 38%",
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
  "72% 40%",
);

const equipmentMenuImage = img(
  "/assets/images/menu/mega-menu-equipements-onloutou.png",
  "Technicien contrôlant un groupe électrogène, avec un utilitaire et une moto en arrière-plan",
  1586,
  992,
  "82% 68%",
);

const expertiseImage = img(
  `${projectB}/controle-cablage-automobile.png`,
  "Contrôle du câblage automobile avant une installation",
  1536,
  1024,
  "55% 42%",
);

const facadeImage = img(
  "/assets/images/about/facade-onloutou-slogan.png",
  "Façade ONLOUTOU avec enseigne jaune et noire",
  1742,
  903,
  "center 52%",
);

// Step 1 — Solutions: 3 groups (Équiper / Connecter & piloter / Construire), layout columns-3-visual
const solutionsMenu: MegaMenuConfig = {
  id: "solutions",
  label: "Solutions",
  layout: "columns-3-visual",
  overviewHref: "/solutions",
  overviewLabel: "Toutes les solutions",
  defaultVisual: "equiper",
  groups: [
    {
      id: "equiper",
      title: "Équiper",
      description: "Location, vente et sélection d'équipements.",
      href: "/equipements",
      items: [
        { type: "link", label: "Location de véhicules", href: "/solutions/location#vehicules" },
        { type: "link", label: "Location de camions et engins", href: "/solutions/location#camions" },
        { type: "link", label: "Location d'équipements", href: "/solutions/location#outils" },
        { type: "link", label: "Vente d'équipements", href: "/solutions/vente" },
        { type: "link", label: "Explorer le catalogue", href: "/equipements" },
      ],
    },
    {
      id: "connecter",
      title: "Connecter & piloter",
      description: "Géolocalisation, flotte, alertes et supervision.",
      href: "/solutions#connecter-piloter",
      items: [
        { type: "link", label: "Géolocalisation", href: "/solutions/geolocalisation" },
        { type: "link", label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
        { type: "link", label: "Alertes et géozones", href: "/solutions/geolocalisation#alertes" },
        { type: "link", label: "Supervision des actifs", href: "/solutions/securisation-actifs" },
        { type: "link", label: "Tableaux de bord", href: "/solutions/gestion-de-flotte#tableaux-de-bord" },
      ],
    },
    {
      id: "construire",
      title: "Construire",
      description: "Plateformes Web, mobile et outils métier.",
      href: "/solutions/plateformes-sur-mesure",
      items: [
        { type: "link", label: "Plateformes Web et mobile", href: "/solutions/plateformes-sur-mesure#types-plateformes" },
        { type: "link", label: "Applications métier", href: "/solutions/plateformes-sur-mesure#roles-interfaces" },
        { type: "link", label: "Intégrations", href: "/solutions/plateformes-sur-mesure#architecture-fonctionnelle" },
        { type: "link", label: "Préparer un projet", href: "/solutions/plateformes-sur-mesure#brief-projet" },
      ],
    },
  ],
  visuals: {
    equiper: {
      image: mobilityImage,
      caption: "Mobilité professionnelle pour les opérations de terrain.",
      cta: { label: "Voir la location", href: "/solutions/location" },
    },
    connecter: {
      image: supervisionImage,
      caption: "Interface de démonstration — données illustratives.",
      cta: { label: "Voir la géolocalisation", href: "/solutions/geolocalisation" },
    },
    construire: {
      image: digitalImage,
      caption: "Outils numériques conçus avec les équipes métier.",
      cta: { label: "Voir les plateformes", href: "/solutions/plateformes-sur-mesure" },
    },
  },
};

// Step 2 — Équipements: 5 groups with iconId, layout grid-icon-visual
const equipmentMenu: MegaMenuConfig = {
  id: "equipements",
  label: "Équipements",
  layout: "grid-icon-visual",
  overviewHref: "/equipements",
  groups: [
    {
      id: "vehicules",
      iconId: "car",
      title: "Véhicules professionnels",
      description: "Utilitaires, berlines, 4×4",
      href: "/equipements/vehicules",
      items: [
        { type: "link", label: "Véhicules en location", href: "/solutions/location#vehicules" },
        { type: "link", label: "Véhicules à la vente", href: "/solutions/vente#vehicules" },
      ],
    },
    {
      id: "motos",
      iconId: "bike",
      title: "Motos et deux-roues",
      description: "Livraison et déplacements terrain",
      href: "/equipements/motos",
      items: [
        { type: "link", label: "Motos professionnelles", href: "/equipements/motos" },
      ],
    },
    {
      id: "camions",
      iconId: "truck",
      title: "Camions et engins",
      description: "Transport lourd, BTP, chantier",
      href: "/equipements/camions-engins",
      items: [
        { type: "link", label: "Camions et utilitaires lourds", href: "/solutions/location#camions" },
        { type: "link", label: "Engins de chantier", href: "/equipements/camions-engins" },
      ],
    },
    {
      id: "outils",
      iconId: "gear",
      title: "Outils et matériels",
      description: "Outillage professionnel",
      href: "/equipements/outils-materiels",
      items: [
        { type: "link", label: "Matériels professionnels", href: "/solutions/vente#outils" },
        { type: "link", label: "Outillage", href: "/equipements/outils-materiels" },
      ],
    },
    {
      id: "connectes",
      iconId: "signal",
      title: "Équipements connectés",
      description: "GPS, trackers, IoT",
      href: "/equipements/equipements-connectes",
      items: [
        { type: "link", label: "Trackers et boîtiers GPS", href: "/equipements/equipements-connectes" },
        { type: "link", label: "Orienter ma demande", href: "/equipements#orientation-equipement" },
      ],
    },
  ],
  visual: {
    image: equipmentMenuImage,
    caption: "Des équipements adaptés aux réalités du terrain.",
    cta: { label: "Orienter ma demande", href: "/equipements#orientation-equipement" },
  },
};

// Step 3 — Expertise: 2 groups + footerCta, layout two-col-visual-footer, broken links fixed
const expertiseMenu: MegaMenuConfig = {
  id: "expertise",
  label: "Expertise",
  layout: "two-col-visual-footer",
  overviewHref: "/expertise",
  overviewLabel: "Voir l'expertise",
  groups: [
    {
      id: "preparer",
      title: "Préparer & déployer",
      items: [
        { type: "link", label: "Déploiement terrain", href: "/expertise#approche" },
        { type: "link", label: "Installation et paramétrage", href: "/expertise#installation" },
        { type: "link", label: "Ingénierie matérielle", href: "/expertise" },
        { type: "link", label: "Mise en service", href: "/expertise#approche" },
      ],
    },
    {
      id: "exploiter",
      title: "Exploiter & accompagner",
      items: [
        { type: "link", label: "Supervision et reporting", href: "/solutions/gestion-de-flotte" },
        { type: "link", label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
        { type: "link", label: "Formation", href: "/expertise#formation" },
        { type: "link", label: "Support et maintenance", href: "/expertise" },
      ],
    },
  ],
  footerCta: { label: "Appels d'offres et projets structurés", href: "/projets" },
  visual: {
    image: expertiseImage,
    caption: "Une expertise de terrain, de l'installation au suivi.",
    cta: { label: "Découvrir l'expertise", href: "/expertise" },
  },
};

// Step 4 — Projets: fix hrefs (#mobilite, #supervision)
const projectsMenu: MegaMenuConfig = {
  id: "projets",
  label: "Projets",
  layout: "cards",
  overviewHref: "/projets",
  overviewLabel: "Vue d'ensemble des projets",
  groups: [],
  cards: [
    {
      id: "mobilite",
      title: "Mobilité professionnelle",
      description: "Véhicules et équipements sélectionnés selon les usages et le terrain.",
      href: "/projets#mobilite",
      image: mobilityImage,
    },
    {
      id: "supervision",
      title: "Supervision de flotte",
      description: "Positions, alertes et suivi opérationnel — interfaces illustratives.",
      href: "/projets#supervision",
      image: supervisionImage,
    },
    {
      id: "numerique",
      title: "Projet numérique sur mesure",
      description: "Plateformes et outils conçus avec les équipes métier.",
      href: "/projets#brief-projet",
      image: digitalImage,
    },
  ],
  footerCta: { label: "Préparer mon brief", href: "/projets#brief-projet" },
};

// Step 5 — Partenaires: 3 groups, no visual, layout three-col-flat
const partnersMenu: MegaMenuConfig = {
  id: "partenaires",
  label: "Partenaires",
  layout: "three-col-flat",
  overviewHref: "/partenaires",
  overviewLabel: "Vue d'ensemble",
  groups: [
    {
      id: "collaborer",
      title: "Collaborer",
      items: [
        { type: "link", label: "Vue d'ensemble", href: "/partenaires" },
        { type: "link", label: "Devenir partenaire", href: "/devenir-partenaire" },
        { type: "link", label: "Présenter une proposition", href: "/devenir-partenaire" },
        { type: "link", label: "Livraison et coordination", href: "/livraison" },
      ],
    },
    {
      id: "profils",
      title: "Les profils",
      items: [
        { type: "link", label: "Fournisseurs", href: "/partenaires/fournisseurs" },
        { type: "link", label: "Livreurs", href: "/partenaires/livreurs" },
        { type: "link", label: "Technologiques", href: "/partenaires/technologiques" },
        { type: "link", label: "Profils de collaboration", href: "/partenaires#profils-partenaires" },
      ],
    },
    {
      id: "espaces",
      title: "Vos futurs espaces",
      items: [
        { type: "info", label: "Espace partenaire", note: "En préparation — aperçu conceptuel." },
        { type: "info", label: "Espace livreur", note: "En préparation — aperçu conceptuel." },
      ],
    },
  ],
};

// Step 6 — À propos: 2 groups (L'entreprise / Contact & aide), layout two-col-visual
const aboutMenu: MegaMenuConfig = {
  id: "a-propos",
  label: "À propos",
  layout: "two-col-visual",
  overviewHref: "/a-propos",
  overviewLabel: "Lire notre histoire",
  groups: [
    {
      id: "entreprise",
      title: "L'entreprise",
      items: [
        { type: "link", label: "Notre histoire", href: "/a-propos#about-history" },
        { type: "link", label: "Notre approche", href: "/a-propos#about-principles" },
        { type: "link", label: "Présence régionale", href: "/a-propos#about-implantation" },
        { type: "link", label: "Équipe et compétences", href: "/a-propos#about-team" },
        { type: "link", label: "Références historiques", href: "/a-propos#about-references" },
      ],
    },
    {
      id: "contact-aide",
      title: "Contact & aide",
      items: [
        { type: "link", label: "Nous contacter", href: "/contact" },
        { type: "link", label: "Centre d'aide", href: "/aide" },
      ],
    },
  ],
  visual: {
    image: facadeImage,
    caption: "Photographie d'archive — identité visuelle ONLOUTOU.",
    cta: { label: "Lire notre histoire", href: "/a-propos" },
  },
};

export const headerNavigation: HeaderNavItem[] = [
  { type: "link", id: "accueil", label: "Accueil", href: "/" },
  { type: "menu", id: "solutions", label: "Solutions", href: "/solutions", menu: solutionsMenu },
  { type: "menu", id: "equipements", label: "Équipements", href: "/equipements", menu: equipmentMenu },
  { type: "menu", id: "expertise", label: "Expertise", href: "/expertise", menu: expertiseMenu },
  { type: "menu", id: "projets", label: "Projets", href: "/projets", menu: projectsMenu },
  { type: "menu", id: "partenaires", label: "Partenaires", href: "/partenaires", menu: partnersMenu },
  { type: "menu", id: "a-propos", label: "À propos", href: "/a-propos", menu: aboutMenu },
];

export const headerUtility = {
  location: "Abidjan, Côte d'Ivoire",
  phoneDisplay: site.phoneDisplay,
  phoneTel: site.phoneTel,
  whatsappUrl: site.whatsappUrl,
  whatsappLabel: "WhatsApp",
};

export const headerCta = {
  label: "Nous contacter",
  href: "/contact",
};

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const [path] = href.split("#");
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function menuItems() {
  return headerNavigation.filter((item) => item.type === "menu");
}
