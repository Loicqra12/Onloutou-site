import { createPageMetadata } from "@/lib/seo/metadata";
import {
  PRD_CONFIRMATION_PATH,
  PRD_DEMANDE_PATH,
  PRD_FAMILLES_PATH,
  PRD_REMISE_PATH,
  PRD_ROOT,
  PRD_SUR_MESURE_PATH,
  PRD_VAISSELLE_PATH,
} from "@/content/produits-hub";

export function prdSeo(title: string, description: string, path: string) {
  return createPageMetadata({ title, description, path });
}

export const prdPageSeo = {
  hub: prdSeo(
    "Tous les produits",
    "Un article pour la maison, une réception à préparer ou du matériel pour votre activité en Côte d’Ivoire.",
    PRD_ROOT,
  ),
  familles: prdSeo(
    "Toutes les familles",
    "Parcourez les familles d’articles du quotidien et de matériel professionnel, ou décrivez un autre article.",
    PRD_FAMILLES_PATH,
  ),
  vaisselle: prdSeo(
    "Vaisselle de réception",
    "Des exemples pour composer votre demande. Les partenaires confirment les quantités pour vos dates.",
    PRD_VAISSELLE_PATH,
  ),
  demande: prdSeo(
    "Votre demande",
    "Retrouvez les articles de votre demande, indiquez la commune, la période et vos coordonnées.",
    PRD_DEMANDE_PATH,
  ),
  surMesure: prdSeo(
    "Demande sur mesure",
    "Indiquez le nom de l’article recherché ou décrivez son usage. Une photo peut aider le partenaire à l’identifier.",
    PRD_SUR_MESURE_PATH,
  ),
  remise: prdSeo(
    "Remise du matériel",
    "Indiquez comment récupérer les articles. Ces préférences permettent aux partenaires de chiffrer le transport.",
    PRD_REMISE_PATH,
  ),
  confirmation: prdSeo(
    "Demande enregistrée",
    "Un conseiller vérifie les disponibilités auprès des partenaires puis vous transmet une proposition.",
    PRD_CONFIRMATION_PATH,
  ),
};
