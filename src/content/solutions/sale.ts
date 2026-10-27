import type { ServiceFaqItem } from "@/types/services";
import { whatsappHref } from "@/content/whatsapp-journeys";

export const saleSeo = {
  title: "Vente d’équipements",
  description:
    "Achat d’équipements, recherche spécifique et devis ONLOUTOU — caractéristiques confirmées avant validation, selon disponibilité.",
};

export const saleContent = {
  heroHighlight: "vente",
  heroDescription:
    "Une offre distincte de la location : recherche d’équipement, mise en relation et accompagnement jusqu’à la proposition — sur devis et selon disponibilité.",
  topics: [
    "Vente d’équipements neufs ou d’occasion selon offre partenaire",
    "Recherche d’un modèle ou d’une configuration précise",
    "Mise en relation avec fournisseurs et propriétaires",
    "Accompagnement dans le choix et la validation des caractéristiques",
    "Livraison ou récupération selon projet",
    "Demande de prix et de devis formalisée",
  ],
  sections: [
    {
      id: "vehicules",
      title: "Véhicules et engins",
      text: "Véhicules et engins proposés selon catalogue partenaire et faisabilité — jamais comme stock garanti en ligne.",
    },
    {
      id: "materiels",
      title: "Matériels professionnels",
      text: "Équipements métier : fiches et caractéristiques confirmées avant validation de l’offre.",
    },
    {
      id: "outillage",
      title: "Outillage",
      text: "Outillage et consommables selon demande — conditions dans le devis.",
    },
    {
      id: "demande",
      title: "Sur demande",
      text: "Équipements non listés : décrivez le besoin, ONLOUTOU oriente la recherche.",
    },
  ],
  prudence:
    "Formulations applicables : selon disponibilité, sur devis, caractéristiques confirmées avant validation, conditions précisées dans l’offre ou le contrat. Aucune fausse promotion ni produit inventé.",
  faq: [
    {
      question: "Puis-je acheter directement sur le site ?",
      answer:
        "Non. Ce site est institutionnel : la commande passe par contact, devis et validation contractuelle.",
    },
    {
      question: "Les prix sont-ils affichés ?",
      answer: "Non. Les prix sont communiqués sur devis après qualification du besoin.",
    },
  ] satisfies ServiceFaqItem[],
  whatsapp: whatsappHref("purchase"),
};
