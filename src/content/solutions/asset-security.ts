import type { ServiceFaqItem } from "@/types/services";
import { whatsappHref } from "@/content/whatsapp-journeys";

export const assetSecuritySeo = {
  title: "Sécurisation d’actifs",
  description:
    "Suivi d’équipements financés et d’actifs mobiles, alertes et supervision — fonctions selon matériel, réseau et contrat.",
};

export const assetSecurityContent = {
  heroHighlight: "actifs",
  heroDescription:
    "Capacité complémentaire à la géolocalisation : sécuriser et suivre des actifs mobiles, avec alertes et rapports — sans présenter les références historiques comme partenariats actuels garantis.",
  capabilities: [
    "Suivi d’équipements financés (selon contexte contractuel)",
    "Suivi d’actifs mobiles et remontée de position",
    "Alertes et géozones configurables",
    "Détection d’événements selon équipements installés",
    "Accompagnement au déploiement et supervision",
    "Rapports et exports selon périmètre",
  ],
  historicalNotice:
    "ONLOUTOU dispose de références historiques dans la mise en œuvre de solutions GPS liées à des opérations de crédit-bail, notamment auprès de la BNI et de Banque Atlantique Côte d’Ivoire. Ces mentions ne constituent pas une liste de partenariats actifs ni une garantie de résultat.",
  disclaimer:
    "Les fonctions dépendent du matériel installé, de la couverture réseau et des termes du contrat. L’immobilisation d’un équipement n’est pas une capacité universelle ou automatique.",
  faq: [
    {
      question: "Est-ce réservé aux banques ?",
      answer:
        "Non. Tout opérateur d’actifs mobiles peut étudier un dispositif adapté — cadrage lors du contact.",
    },
    {
      question: "Les logos de banques sont-ils affichés ?",
      answer: "Non sur cette page. Seules des formulations prudentes sur l’historique sont utilisées.",
    },
  ] satisfies ServiceFaqItem[],
  whatsapp: whatsappHref("assetSecurity"),
};
