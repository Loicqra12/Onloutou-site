import type { SolutionUniverse } from "@/types/services";

export const onloutouUniverses: SolutionUniverse[] = [
  {
    id: "louer",
    title: "Louer",
    shortTitle: "Louer",
    tagline: "Location d’équipements",
    summary:
      "Véhicules, engins, outils et matériels professionnels : une demande structurée, des conditions confirmées avant engagement.",
    capabilities: [
      "Véhicules et mobilité",
      "Camions et engins",
      "Outils et matériels",
      "Demande spécifique",
    ],
    href: "/solutions/location",
    icon: "◫",
  },
  {
    id: "acheter",
    title: "Acheter",
    shortTitle: "Acheter",
    tagline: "Vente d’équipements",
    summary:
      "Recherche, mise en relation et accompagnement pour l’achat d’équipements — caractéristiques et prix confirmés sur devis.",
    capabilities: [
      "Vente sur demande",
      "Véhicules et engins",
      "Matériels professionnels",
      "Devis et validation",
    ],
    href: "/solutions/vente",
    icon: "▣",
  },
  {
    id: "connecter",
    title: "Connecter & piloter",
    shortTitle: "Connecter",
    tagline: "GPS · flotte · IoT",
    summary:
      "Géolocalisation, supervision, alertes et remontée de données pour sécuriser et piloter vos actifs mobiles.",
    capabilities: [
      "Géolocalisation GPS",
      "Gestion de flotte",
      "Alertes et géozones",
      "Sécurisation d’actifs",
    ],
    href: "/solutions#connecter-piloter",
    icon: "⌖",
  },
  {
    id: "construire",
    title: "Construire",
    shortTitle: "Construire",
    tagline: "Plateformes & projets",
    summary:
      "Applications Web et mobiles, tableaux de bord, intégrations et déploiement terrain pour vos opérations.",
    capabilities: [
      "Plateformes sur mesure",
      "Tableaux de bord",
      "Intégrations",
      "Déploiement et formation",
    ],
    href: "/solutions/plateformes-sur-mesure",
    icon: "{ }",
  },
];

export const universesIntro = {
  number: "01",
  eyebrow: "Nos univers",
  title: "Une entreprise,",
  titleHighlight: "quatre capacités.",
  description:
    "De la location à la vente d’équipements, de la géolocalisation aux plateformes numériques — ONLOUTOU relie terrain, mobilité et données.",
};
