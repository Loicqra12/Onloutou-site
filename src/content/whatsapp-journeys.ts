import { whatsappUrlForMessage } from "@/content/contact-page";

export const whatsappJourneys = {
  rental:
    "Bonjour ONLOUTOU, je souhaite obtenir des informations concernant une location d’équipement.",
  purchase:
    "Bonjour ONLOUTOU, je recherche un équipement à l’achat ou un devis selon disponibilité.",
  gps:
    "Bonjour ONLOUTOU, je souhaite discuter d’un besoin en géolocalisation et gestion de flotte.",
  assetSecurity:
    "Bonjour ONLOUTOU, je souhaite échanger sur la sécurisation et le suivi d’actifs.",
  customPlatform:
    "Bonjour ONLOUTOU, je souhaite présenter un projet de plateforme ou d’application sur mesure.",
  equipmentCatalog:
    "Bonjour ONLOUTOU, je cherche un équipement (location ou achat) et souhaite vérifier les disponibilités.",
  partnerSupplier:
    "Bonjour ONLOUTOU, je souhaite proposer des équipements en tant que partenaire fournisseur.",
  partnerDelivery:
    "Bonjour ONLOUTOU, je souhaite rejoindre le réseau de partenaires livreurs.",
  partnerTech:
    "Bonjour ONLOUTOU, je souhaite explorer un partenariat technologique avec ONLOUTOU.",
} as const;

export function whatsappHref(key: keyof typeof whatsappJourneys) {
  return whatsappUrlForMessage(whatsappJourneys[key]);
}
