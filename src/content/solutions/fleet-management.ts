import type { ServiceFaqItem } from "@/types/services";
import { whatsappHref } from "@/content/whatsapp-journeys";

export const fleetSeo = {
  title: "Géolocalisation et gestion de flotte",
  description:
    "GPS 2G/4G, M2M, supervision de flotte, alertes, géozones et tableaux de bord — déploiement et accompagnement ONLOUTOU.",
};

export const fleetContent = {
  heroHighlight: "géolocalisation",
  heroDescription:
    "Connecter véhicules, camions, engins et équipements mobiles pour les localiser, les superviser et produire des rapports utiles — selon matériel, couverture et contrat.",
  demoNotice:
    "Interface de démonstration — sans indicateurs chiffrés ni données temps réel.",
  capabilities: [
    { title: "GPS 2G / 4G", description: "Localisation et remontée de position selon équipement et réseau." },
    { title: "Connectivité M2M", description: "Paramétrage et télématique selon compatibilité du parc." },
    { title: "Historique & trajets", description: "Consultation des parcours et arrêts selon offre contractuelle." },
    { title: "Alertes & géozones", description: "Notifications configurables selon règles définies avec le client." },
    { title: "Suivi opérationnel", description: "Supervision Web et mobile pour les équipes autorisées." },
    { title: "Reporting", description: "Rapports et exports selon périmètre retenu." },
  ],
  anchors: {
    flotte: "Supervision multi-actifs et organisation du parc.",
    alertes: "Géozones, seuils et notifications — sans promesse d’immobilisation automatique universelle.",
    iot: "Données véhicule et capteurs selon matériel installé.",
  },
  deployment:
    "Installation, paramétrage, formation et support définis dans chaque contrat — sans SLA public non contractualisé.",
  exclusions:
    "Aucune promesse de précision absolue, couverture universelle, disponibilité 99,98 %, support 24/7, intervention garantie en délai fixe, ni optimisation automatique par IA.",
  faq: [
    {
      question: "Tous les véhicules sont-ils compatibles ?",
      answer:
        "La compatibilité dépend du véhicule, du traceur et du câblage — étude préalable nécessaire.",
    },
    {
      question: "Les données sont-elles en temps réel sur ce site ?",
      answer:
        "Non. Les visuels du site sont des démonstrations sans données opérationnelles réelles.",
    },
  ] satisfies ServiceFaqItem[],
  whatsapp: whatsappHref("gps"),
};
