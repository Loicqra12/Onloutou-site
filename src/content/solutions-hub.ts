import { deploymentPhases, editorialDisclaimers } from "@/content/capabilities";
import { onloutouUniverses } from "@/content/universes";

export const solutionsHubSeo = {
  title: "Solutions — louer, acheter, connecter, construire",
  description:
    "Hub des quatre univers ONLOUTOU : location et vente d’équipements, géolocalisation, gestion de flotte, sécurisation d’actifs et plateformes sur mesure.",
};

export const solutionsHubHero = {
  description:
    "Une entreprise technologique et opérationnelle : équipements, mobilité, données et projets numériques — avec la même exigence de prudence éditoriale sur les engagements.",
};

/** Destinations canoniques — alignées avec le mégamenu. */
export const detailedSolutionPages = [
  {
    href: "/solutions/location",
    title: "Location d’équipements",
    universe: "Louer",
    description: "Véhicules, engins et matériels selon le besoin et la zone.",
    image: {
      src: "/assets/images/equipment/vehicles/Flotte professionnelle inspectée à Abidjan-2.png",
      alt: "Berline, SUV et utilitaire présentés dans une cour professionnelle à Abidjan",
      width: 1672,
      height: 941,
      objectPosition: "52% 48%",
    },
  },
  {
    href: "/solutions/vente",
    title: "Vente d’équipements",
    universe: "Acheter",
    description: "Recherche et acquisition sur devis, sans catalogue figé.",
    image: {
      src: "/assets/images/projects/project-b/inspection-groupe-electrogene.png",
      alt: "Technicien inspectant un groupe électrogène",
      width: 1536,
      height: 1024,
      objectPosition: "58% 46%",
    },
  },
  {
    href: "/solutions/geolocalisation",
    title: "Géolocalisation",
    universe: "Connecter",
    description: "Traceurs, alertes, géozones et installation terrain.",
    image: {
      src: "/assets/images/projects/project-a/installation-gps-embarque.png",
      alt: "Technicien installant un dispositif GPS embarqué dans un véhicule",
      width: 1536,
      height: 1024,
      objectPosition: "62% 48%",
    },
  },
  {
    href: "/solutions/gestion-de-flotte",
    title: "Gestion de flotte",
    universe: "Connecter",
    description: "Supervision, tableaux de bord et pilotage opérationnel.",
    image: {
      src: "/assets/images/projects/project-a/mobilite-professionnelle-cour-logistique.png",
      alt: "Véhicules professionnels dans une cour logistique",
      width: 1536,
      height: 1024,
      objectPosition: "48% 58%",
    },
  },
  {
    href: "/solutions/securisation-actifs",
    title: "Sécurisation d’actifs",
    universe: "Connecter",
    description: "Protection et suivi des équipements financés ou mobiles.",
    image: {
      src: "/assets/images/solutions/installation-traceur-gps-onloutou.png",
      alt: "Technicien installant un traceur GPS dans un véhicule",
      width: 1536,
      height: 1024,
      objectPosition: "55% 42%",
    },
  },
  {
    href: "/solutions/plateformes-sur-mesure",
    title: "Plateformes sur mesure",
    universe: "Construire",
    description: "Outils Web, mobile et intégrations métier.",
    image: {
      src: "/assets/images/projects/project-a/gestion-equipements-entrepot.png",
      alt: "Équipements professionnels organisés dans un entrepôt",
      width: 1536,
      height: 1024,
      objectPosition: "64% 38%",
    },
  },
];

export const solutionsHubMethodPhoto = {
  src: "/assets/images/home/equipment/equipe-onloutou-inspection-equipements.png",
  alt: "Équipe ONLOUTOU inspectant des équipements professionnels",
  width: 1448,
  height: 1086,
  objectPosition: "center 40%",
};

export const solutionsHubUniverses = onloutouUniverses;

export const solutionsHubNeeds = [
  "Accéder à un équipement sans l’acheter immédiatement",
  "Trouver et acheter un matériel spécifique sur devis",
  "Superviser une flotte ou des actifs connectés",
  "Sécuriser des équipements financés ou mobiles",
  "Construire une plateforme ou un tableau de bord métier",
];

export const solutionsHubObjectives = [
  "/solutions/location",
  "/solutions/vente",
  "/solutions/gestion-de-flotte",
  "/solutions/securisation-actifs",
  "/solutions/plateformes-sur-mesure",
].map((href, index) => {
  const page = detailedSolutionPages.find((item) => item.href === href);
  return {
    href,
    title: page?.title ?? "",
    text: solutionsHubNeeds[index],
  };
});

export { deploymentPhases, editorialDisclaimers };

export const solutionsHubClosing =
  "Les prestations, délais, garanties et niveaux de service sont confirmés après étude du besoin et validation contractuelle.";
