import type { EquipmentCategory } from "@/types/equipment";

export const equipmentSeo = {
  title: "Équipements — location et vente",
  description:
    "Catalogue éditorial des familles d’équipements ONLOUTOU : véhicules, engins, outils et matériels — disponibilités selon besoin, zone et partenaires.",
};

export const equipmentHero = {
  titleHighlight: "équipements",
  description:
    "Porte d’entrée vers vos demandes de location ou d’achat. Aucune marketplace fonctionnelle pour le moment : catégories, orientations et contact direct.",
};

export const equipmentNotice =
  "Les catégories, disponibilités et conditions dépendent du besoin, de la zone et des partenaires mobilisés. Aucun stock, tarif ou délai n’est affiché sans validation préalable.";

export const equipmentCategories: EquipmentCategory[] = [
  {
    slug: "vehicules",
    name: "Véhicules",
    summary: "Véhicules légers et utilitaires selon projet et disponibilité partenaire.",
    transactionModes: ["rental", "sale", "both"],
    icon: "▭",
    requestMessage:
      "Bonjour ONLOUTOU, je cherche un véhicule (location ou achat) selon disponibilité.",
  },
  {
    slug: "deux-roues",
    name: "Deux-roues",
    summary: "Vélos et deux-roues pour mobilité ou activité professionnelle.",
    transactionModes: ["rental", "sale"],
    icon: "○",
    requestMessage: "Bonjour ONLOUTOU, je cherche un deux-roues en location ou à l’achat.",
  },
  {
    slug: "camions-engins",
    name: "Camions et engins",
    summary: "Engins de chantier, camions et matériel lourd — conditions sur étude.",
    transactionModes: ["rental", "sale", "both"],
    icon: "▰",
    requestMessage:
      "Bonjour ONLOUTOU, je cherche un camion ou un engin (location ou achat).",
  },
  {
    slug: "outils",
    name: "Outils",
    summary: "Outillage et petit matériel pour chantier, atelier ou usage professionnel.",
    transactionModes: ["rental", "sale"],
    icon: "⚒",
    requestMessage: "Bonjour ONLOUTOU, je cherche des outils en location ou à l’achat.",
  },
  {
    slug: "materiels-pro",
    name: "Matériels professionnels",
    summary: "Équipements métier selon secteur et faisabilité logistique.",
    transactionModes: ["rental", "sale", "both"],
    icon: "▣",
    requestMessage:
      "Bonjour ONLOUTOU, je cherche un matériel professionnel (location ou achat).",
  },
  {
    slug: "electromenager",
    name: "Électroménager",
    summary: "Électroménager et équipements du quotidien selon catalogue partenaire.",
    transactionModes: ["rental"],
    icon: "⌂",
    requestMessage: "Bonjour ONLOUTOU, je souhaite louer un équipement électroménager.",
  },
  {
    slug: "connectes",
    name: "Équipements connectés",
    summary: "Actifs pouvant être suivis ou supervisés — en lien avec nos offres GPS et IoT.",
    transactionModes: ["both"],
    icon: "⌖",
    requestMessage:
      "Bonjour ONLOUTOU, je cherche un équipement connecté ou à superviser.",
  },
  {
    slug: "autres",
    name: "Autres demandes",
    summary: "Besoin spécifique non listé : décrivez votre contexte, nous orientons la demande.",
    transactionModes: ["rental", "sale"],
    icon: "…",
    requestMessage:
      "Bonjour ONLOUTOU, j’ai une demande d’équipement spécifique à préciser avec vous.",
  },
];
