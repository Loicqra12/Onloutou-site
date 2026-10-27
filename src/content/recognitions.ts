export type RecognitionKind = "award" | "finalist" | "selection" | "presentation";

export type ImageRightsStatus = "approved" | "pending-rights" | "rejected";

export type RecognitionImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit?: string;
};

export type RecognitionSource = {
  label: string;
  href: string;
};

export type RecognitionEntry = {
  slug: string;
  year: string;
  title: string;
  status: string;
  summary: string;
  sources: RecognitionSource[];
  image?: RecognitionImage;
  imageAlt: string;
  imageCredit?: string;
  imageRightsStatus: ImageRightsStatus;
  featured: boolean;
  kind: RecognitionKind;
  showOnHome: boolean;
};

export const recognitionsIntro =
  "Au fil de son développement, ONLOUTOU a participé à plusieurs programmes africains consacrés à l’innovation, à l’inclusion financière et aux technologies appliquées aux équipements. Ces repères témoignent d’un parcours entrepreneurial construit entre la Côte d’Ivoire et le Maroc.";

export const recognitions: RecognitionEntry[] = [
  {
    slug: "fintech-challenge-bcp-2019",
    year: "2019",
    title: "Fintech Challenge du Groupe BCP",
    status: "Lauréate",
    summary:
      "ONLOUTOU a fait partie des six startups lauréates sélectionnées à l’issue d’un programme ayant réuni plus de 1 200 manifestations d’intérêt provenant de 34 pays. Cette distinction a conduit à une collaboration avec le Groupe BCP et Banque Atlantique Côte d’Ivoire autour d’une solution IoT destinée à la gestion à distance d’actifs financés.",
    sources: [
      {
        label: "Abidjan.net — finale et partenariats",
        href: "https://news.abidjan.net/articles/652983/finale-du-fintech-challenge-6-start-up-decrochent-des-partenariats-avec-le-groupe-bcp",
      },
      {
        label: "Vidéo — présentation",
        href: "https://www.youtube.com/watch?v=eAJDidNcANw",
      },
      {
        label: "Facebook — Location Sans Caution",
        href: "https://www.facebook.com/Location.Sans.Caution/posts/2192099221007134/",
      },
      {
        label: "Facebook — BCP Fintech",
        href: "https://www.facebook.com/BCPFINTECH/photos/1529978363812834/",
      },
    ],
    imageAlt: "Photo générale de la finale du Fintech Challenge du Groupe BCP en 2019",
    imageRightsStatus: "pending-rights",
    featured: true,
    kind: "award",
    showOnHome: true,
  },
  {
    slug: "impact-camp-2019",
    year: "2019",
    title: "Impact Camp by inwi",
    status: "Lauréate de la sélection",
    summary:
      "ONLOUTOU a été retenue parmi six startups africaines à l’issue d’un programme ayant reçu près de 400 candidatures issues de 23 pays. Cette sélection lui a permis de poursuivre son parcours vers la finale inwiDAYS.",
    sources: [
      {
        label: "Le Matin — vainqueurs Impact Camp",
        href: "https://lematin.ma/journal/2019/vainqueurs-limpact-camp-dinwi-annonces/322924.html",
      },
      {
        label: "Aujourd’hui le Maroc — inclusion financière",
        href: "https://aujourdhui.ma/emploi/formation/5eme-edition-de-limpact-camp-inwi-encourage-linclusion-financiere",
      },
      {
        label: "Labass.net — sélection inwiDAYS",
        href: "https://labass.net/33166-maroc-six-startups-africaines-retenues-pour-les-inwidays-2020.html",
      },
    ],
    imageAlt: "Participants à l’Impact Camp organisé à Ifrane en 2019",
    imageRightsStatus: "pending-rights",
    featured: false,
    kind: "selection",
    showOnHome: true,
  },
  {
    slug: "inwidays-2020",
    year: "2020",
    title: "inwiDAYS",
    status: "Finaliste",
    summary:
      "ONLOUTOU a présenté sa solution de location et de sécurisation d’équipements lors de la finale panafricaine d’inwiDAYS à Casablanca.",
    sources: [
      {
        label: "Medias24 — 8e édition",
        href: "https://medias24.com/2020/02/07/inwi-days-trois-startups-remportent-la-8e-edition/",
      },
      {
        label: "Les Éco — inclusion financière",
        href: "https://leseco.ma/business/inwidays-linclusion-financiere-recompense-ses-startups-africaines-innovantes.html",
      },
      {
        label: "Panorapost",
        href: "https://panorapost.ma/post.php?id=24947",
      },
    ],
    imageAlt: "Scène de l’événement inwiDAYS à Casablanca en 2020",
    imageRightsStatus: "pending-rights",
    featured: false,
    kind: "finalist",
    showOnHome: true,
  },
  {
    slug: "seedstars-abidjan-2020",
    year: "2020",
    title: "Seedstars Abidjan",
    status: "Startup sélectionnée",
    summary:
      "ONLOUTOU a été sélectionnée parmi les startups ivoiriennes en compétition lors de l’édition 2020 de Seedstars Abidjan.",
    sources: [
      {
        label: "Seedstars World — événement 2020",
        href: "https://www.seedstarsworld.com/event/seedstars-abidjan-2020/",
      },
      {
        label: "Startup Médias Afrique — concours",
        href: "https://startupmedias.africa/articles/concours-seedstars-abidjan-2020-capture-solution-classee-meilleure-startup",
      },
    ],
    imageAlt: "Visuel archivé lié à la participation d’ONLOUTOU à Seedstars Abidjan 2020",
    imageRightsStatus: "pending-rights",
    featured: false,
    kind: "selection",
    showOnHome: true,
  },
];

export const orangeTechnologyPresentation = {
  title: "Présentation technologique auprès d’Orange",
  summary:
    "ONLOUTOU a présenté sa technologie de sécurisation des équipements à des responsables d’Orange France et d’Orange Côte d’Ivoire.",
  sources: [
    {
      label: "LinkedIn — compte rendu de présentation",
      href: "https://ci.linkedin.com/posts/ousmane-adams-diaby-6b8a72156_onloutou-dgonloutou-dgonloutou-activity-6909249541904986112-0lI2",
    },
  ],
  kind: "presentation" as const,
};

export const homeRecognitionsCta = {
  label: "Découvrir notre parcours",
  href: "/a-propos#distinctions",
};

export function getFeaturedRecognition(): RecognitionEntry {
  const featured = recognitions.find((r) => r.featured);
  if (!featured) throw new Error("Missing featured recognition");
  return featured;
}

export function getSecondaryRecognitions(): RecognitionEntry[] {
  return recognitions.filter((r) => !r.featured);
}

export function getHomeRecognitionEntries(): RecognitionEntry[] {
  return recognitions.filter((r) => r.showOnHome);
}

/** Textes interdits — utilisés par les tests de conformité éditoriale. */
export const forbiddenRecognitionPhrases = [
  "Lauréate Orange Fab",
  "Accélérée par Orange Fab",
  "Financée par Orange Fab",
  "plus de 15 récompenses",
  "Challenge des 1 000 Entrepreneurs",
  "Marie-Louise Sela Glazai",
  "grande gagnante",
  "première place",
  "lauréate de Seedstars",
  "remporté inwiDAYS",
] as const;
