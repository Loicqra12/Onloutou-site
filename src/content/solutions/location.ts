import type { ServiceFaqItem } from "@/types/services";
import { whatsappHref } from "@/content/whatsapp-journeys";

export const locationSeo = {
  title: "Location d’équipements",
  description:
    "Location de véhicules, engins, outils et matériels professionnels en Côte d’Ivoire — demande, accompagnement et conditions selon disponibilité.",
};

export const locationContent = {
  heroHighlight: "location",
  heroDescription:
    "Une démarche structurée pour accéder à des équipements sans promesse de stock permanent : votre besoin, la zone et les partenaires mobilisés déterminent la faisabilité.",
  needs: [
    "Accès ponctuel ou récurrent à un équipement",
    "Mobilité professionnelle ou chantier",
    "Renfort de parc sans achat immédiat",
    "Besoin spécifique à cadrer avec ONLOUTOU",
  ],
  families: [
    { id: "vehicules", title: "Véhicules", items: ["Véhicules légers", "Utilitaires", "Mobilité pro"] },
    { id: "engins", title: "Camions et engins", items: ["Camions", "Engins de chantier", "Matériel lourd"] },
    { id: "outils", title: "Outils et matériels", items: ["Outillage", "Bricolage pro", "Petit matériel"] },
    { id: "autres", title: "Autres familles", items: ["Électroménager", "Matériel spécialisé", "Selon disponibilité"] },
  ],
  process: [
    { step: "01", title: "Expression du besoin", text: "Type d’équipement, durée souhaitée, zone et contraintes." },
    { step: "02", title: "Qualification", text: "Vérification de faisabilité avec les partenaires concernés." },
    { step: "03", title: "Proposition", text: "Conditions, disponibilité et modalités communiquées avant validation." },
    { step: "04", title: "Mise à disposition", text: "Livraison ou retrait selon le projet et les accords convenus." },
  ],
  accompaniment:
    "ONLOUTOU accompagne la demande, la coordination et le suivi administratif selon le périmètre retenu — sans engagement sur un délai ou un tarif standard universel.",
  delivery:
    "Livraison, retrait ou mise à disposition sur site : modalités précisées dans l’offre ou le contrat, selon logistique et partenaires.",
  conditions:
    "Les catégories, disponibilités et conditions dépendent du besoin, de la zone et des partenaires mobilisés. Aucun tarif, caution, durée minimale, stock ou garantie générale n’est affiché ici.",
  faq: [
    {
      question: "Un équipement est-il toujours disponible ?",
      answer:
        "Non. La disponibilité est confirmée après étude du besoin et des partenaires mobilisés.",
    },
    {
      question: "Comment obtenir un tarif ?",
      answer:
        "Les conditions financières sont communiquées sur devis ou proposition, jamais comme prix catalogue fixe sur ce site.",
    },
    {
      question: "Quelles zones sont couvertes ?",
      answer:
        "La faisabilité dépend de la zone d’intervention et des partenaires — à préciser lors de la demande.",
    },
  ] satisfies ServiceFaqItem[],
  whatsapp: whatsappHref("rental"),
};
