export type BazarNamingStatus = "internal-name-to-confirm" | "confirmed";

export type BazarHistoricalStatus = "historical";

export type BazarGalleryImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  offsetClass?: "bazar-gallery__item--offset-a" | "bazar-gallery__item--offset-b" | "bazar-gallery__item--offset-c";
};

export type BazarCategory = {
  id: string;
  title: string;
  items: string[];
};

export const bazarNamingStatus: BazarNamingStatus = "internal-name-to-confirm";

export const bazarProject = {
  id: "bazar-onloutou",
  anchor: "bazar-onloutou",
  period: "2017",
  status: "historical" as BazarHistoricalStatus,
  namingStatus: bazarNamingStatus as BazarNamingStatus,
  publicTitle: "Aux origines du catalogue ONLOUTOU",
  confirmedTitle: "Le Bazar d’ONLOUTOU — aux origines du catalogue multi-équipements",
  eyebrow: "Archives ONLOUTOU · 2017",
  introParagraphs: [
    "Dès 2017, ONLOUTOU développait une offre de location multi-équipements couvrant les besoins du quotidien, l’outillage professionnel, la mobilité, l’événementiel, le numérique et certains matériels de chantier.",
    "Cette première approche du catalogue a permis d’explorer des usages très différents, pour les particuliers comme pour les professionnels. Elle constitue l’une des fondations du positionnement actuel d’ONLOUTOU autour de la location, de la connectivité et du développement de solutions technologiques.",
  ],
  disclaimer:
    "Archives historiques. Les catégories et équipements présentés illustrent le périmètre exploré à cette période et ne constituent pas un catalogue de disponibilités actuelles.",
  primaryCta: {
    label: "Découvrir nos solutions actuelles",
    href: "/solutions/location",
  },
  secondaryCta: {
    label: "Comprendre l’évolution d’ONLOUTOU",
    href: "/a-propos#parcours",
  },
  categories: [
    {
      id: "engins-chantier",
      title: "Engins et chantier",
      items: [
        "camion malaxeur",
        "excavateur et rétrochargeur",
        "niveleuse",
        "échafaudage",
        "groupe électrogène",
        "outillage professionnel",
      ],
    },
    {
      id: "maison-electro",
      title: "Maison et électroménager",
      items: [
        "réfrigérateur",
        "congélateur",
        "machine à laver",
        "cuisinière",
        "aspirateur",
        "machine à café",
      ],
    },
    {
      id: "mobilite",
      title: "Mobilité",
      items: ["vélos", "motos", "véhicules et équipements de déplacement"],
    },
    {
      id: "numerique",
      title: "Numérique et bureautique",
      items: ["ordinateurs", "tablettes", "smartphones", "imprimantes"],
    },
    {
      id: "audiovisuel",
      title: "Audiovisuel et événementiel",
      items: [
        "caméras",
        "appareils photo",
        "matériel d’animation",
        "vaisselle et matériel de réception",
        "salles de réunion",
      ],
    },
    {
      id: "sante",
      title: "Santé et accessibilité",
      items: ["fauteuils roulants", "déambulateurs", "béquilles", "lits médicalisés"],
    },
    {
      id: "services",
      title: "Services",
      items: [
        "artisans et prestations associées",
        "besoins ponctuels de particuliers et de professionnels",
      ],
    },
  ] satisfies BazarCategory[],
  /** Visuels approuvés uniquement — chemins sous `public/assets/images/projects/bazar-onloutou/`. */
  images: [] satisfies BazarGalleryImage[],
};

export function getBazarPublicTitle(): string {
  const naming: BazarNamingStatus = bazarProject.namingStatus;
  return naming === "confirmed" ? bazarProject.confirmedTitle : bazarProject.publicTitle;
}

export const rentalCatalogOriginsBand = {
  eyebrow: "Notre point de départ",
  title: "Une culture historique de la location multi-équipements",
  text:
    "Avant le développement des solutions connectées actuelles, ONLOUTOU explorait déjà un catalogue couvrant des usages domestiques, professionnels, événementiels et techniques.",
  linkLabel: "Découvrir les archives du catalogue",
  linkHref: "/projets#bazar-onloutou",
};

export const homeBazarArchiveCard = {
  index: "Archives · 2017",
  title: "Aux origines du catalogue ONLOUTOU",
  description:
    "Une première approche multi-équipements, avant le développement des solutions connectées actuelles.",
  href: "/projets#bazar-onloutou",
};

/** Chaînes interdites sur les pages liées au bazar (prix, coordonnées historiques, etc.). */
export const bazarForbiddenContent = [
  "Louer maintenant",
  "jet privé",
  "disponible immédiatement",
  "FCFA",
  "francs CFA",
] as const;
