import type { RecognitionSource } from "@/content/recognitions";

export type MediaMention = {
  id: string;
  publisher: string;
  label: string;
  href: string;
};

export const mediaMentionsSection = {
  title: "Ils parlent d’ONLOUTOU",
  lead:
    "Liens vers des publications institutionnelles ou presse — pour consultation et vérification, sans présentation comme partenariat média actuel.",
};

export const mediaMentions: MediaMention[] = [
  {
    id: "comoe",
    publisher: "Comoé Capital",
    label: "Entreprise accompagnée",
    href: "https://comoecapital.com/portefeuille/onloutou/",
  },
  {
    id: "ietp",
    publisher: "Investisseurs & Partenaires",
    label: "Investissement à impact",
    href: "https://www.ietp.com/fr/entreprises/onloutou",
  },
  {
    id: "wearetech",
    publisher: "We Are Tech Africa",
    label: "Portrait de la solution",
    href: "https://www.wearetech.africa/fr/fils/solutions/en-cote-d-ivoire-onloutou-permet-de-louer-tout-type-de-biens-en-quelques-clics",
  },
  {
    id: "pepites",
    publisher: "Les Pépites Tech",
    label: "Écosystème French Tech Abidjan",
    href: "https://lespepitestech.com/startup-de-la-french-tech/onloutou",
  },
  {
    id: "seedstars",
    publisher: "Seedstars",
    label: "Startup en compétition",
    href: "https://www.seedstarsworld.com/event/seedstars-abidjan-2020/",
  },
];

export function mediaMentionsAsSources(): RecognitionSource[] {
  return mediaMentions.map((m) => ({ label: `${m.publisher} — ${m.label}`, href: m.href }));
}
