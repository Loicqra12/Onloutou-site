import type { Metadata } from "next";
import { site } from "@/content/site";
import { buildTwitterMetadata } from "@/lib/seo/social-metadata";
import { absoluteUrl } from "@/lib/seo/site-url";

export const homeDescription =
  "ONLOUTOU, entreprise technologique et opérationnelle en Côte d’Ivoire : location et vente d’équipements, géolocalisation, gestion de flotte, sécurisation d’actifs et plateformes numériques sur mesure.";

const homeCanonical = absoluteUrl("/");
const homeOgTitle = `${site.name} — Louer, acheter, connecter, construire`;

export const homeMetadata: Metadata = {
  title: {
    absolute: homeOgTitle,
  },
  description: homeDescription,
  ...(homeCanonical ? { alternates: { canonical: homeCanonical } } : {}),
  openGraph: {
    title: homeOgTitle,
    description: homeDescription,
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    ...(homeCanonical ? { url: homeCanonical } : {}),
  },
  twitter: buildTwitterMetadata(homeOgTitle, homeDescription),
};
