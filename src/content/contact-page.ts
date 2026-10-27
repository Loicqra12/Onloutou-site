import { site } from "@/content/site";

export const contactSeo = {
  title: "Contact — Côte d’Ivoire",
  description:
    "Location d’équipements, géolocalisation, gestion de flotte, plateformes numériques et appels d’offres : contactez ONLOUTOU par téléphone ou WhatsApp.",
};

export const contactHero = {
  title: "Parlons de votre besoin",
  description:
    "Entreprises, banques, institutions, gestionnaires de flotte, personnes en recherche d’équipements en location ou porteurs de projets technologiques : décrivez votre contexte et nous vous orientons vers la bonne démarche.",
};

export type ContactChoice = {
  id: string;
  title: string;
  description: string;
  whatsappMessage: string;
};

export const contactChoices: ContactChoice[] = [
  {
    id: "achat",
    title: "Achat d’équipement",
    description:
      "Recherche, devis et mise en relation pour l’achat d’un équipement selon disponibilité.",
    whatsappMessage:
      "Bonjour ONLOUTOU, je recherche un équipement à l’achat ou un devis selon disponibilité.",
  },
  {
    id: "location",
    title: "Location",
    description:
      "Électroménager, outils, véhicules, camions, engins ou équipements professionnels.",
    whatsappMessage:
      "Bonjour ONLOUTOU, je souhaite obtenir des informations concernant une location.",
  },
  {
    id: "actifs",
    title: "Sécurisation d’actifs",
    description:
      "Suivi d’actifs mobiles ou financés, alertes et supervision selon matériel et contrat.",
    whatsappMessage:
      "Bonjour ONLOUTOU, je souhaite échanger sur la sécurisation et le suivi d’actifs.",
  },
  {
    id: "gps",
    title: "GPS et gestion de flotte",
    description:
      "Géolocalisation, alertes, supervision, reporting et sécurisation des véhicules.",
    whatsappMessage:
      "Bonjour ONLOUTOU, je souhaite discuter d’un besoin en géolocalisation et gestion de flotte.",
  },
  {
    id: "plateforme",
    title: "Plateforme technologique",
    description:
      "Plateforme Web ou mobile, tableau de bord, intégration ou développement sur mesure.",
    whatsappMessage:
      "Bonjour ONLOUTOU, je souhaite présenter un projet de plateforme technologique.",
  },
  {
    id: "ao",
    title: "Appel d’offres et projet institutionnel",
    description:
      "Transmission d’un cahier des charges, demande d’étude ou préparation d’une proposition technique.",
    whatsappMessage:
      "Bonjour ONLOUTOU, je souhaite échanger concernant un appel d’offres ou un cahier des charges.",
  },
];

export const preparationChecklist = [
  "Nature du besoin",
  "Nombre d’équipements ou de véhicules",
  "Zone d’intervention",
  "Fonctionnalités recherchées",
  "Délai souhaité",
  "Cahier des charges disponible, le cas échéant",
];

export const contactPrudenceNotice =
  "Les fonctionnalités, équipements, délais, garanties et niveaux de service sont confirmés après étude du besoin et validation du périmètre contractuel.";

export function whatsappUrlForMessage(message: string) {
  const phone = site.phoneTel.replace("+", "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
