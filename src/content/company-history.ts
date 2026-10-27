import type { RecognitionSource } from "@/content/recognitions";

export type VerificationStatus = "verified" | "pending-internal-confirmation" | "excluded";

export type CompanyHistoryMilestone = {
  id: string;
  period: string;
  title: string;
  summary: string;
  sources?: RecognitionSource[];
  archiveLink?: { label: string; href: string };
};

export const companyJourneyIntro = {
  title: "Notre histoire",
  lead:
    "Une lecture chronologique du parcours d’ONLOUTOU, fondée sur des sources publiques et des archives internes — sans prétendre à l’exhaustivité de chaque étape opérationnelle.",
};

export const companyHistoryMilestones: CompanyHistoryMilestone[] = [
  {
    id: "2016-creation",
    period: "2016",
    title: "Naissance d’ONLOUTOU",
    summary:
      "ONLOUTOU est créée en Côte d’Ivoire avec l’ambition de rendre différents équipements plus accessibles grâce à la location.",
    sources: [
      {
        label: "Comoé Capital — portefeuille",
        href: "https://comoecapital.com/portefeuille/onloutou/",
      },
    ],
  },
  {
    id: "2017-catalogue",
    period: "2017",
    title: "Premières offres multi-équipements",
    summary:
      "ONLOUTOU élargit son catalogue de location à plusieurs familles de besoins : équipements du quotidien, numérique, événementiel, mobilité, outillage et matériels professionnels.",
    sources: [
      {
        label: "Banabaana — annonce historique",
        href: "https://www.banabaana.com/ann_page.php?id=9667",
      },
    ],
    archiveLink: {
      label: "Explorer cette archive",
      href: "/projets#bazar-onloutou",
    },
  },
  {
    id: "2018-pepites",
    period: "2018",
    title: "Visibilité dans l’écosystème technologique",
    summary:
      "ONLOUTOU est référencée au sein de l’écosystème French Tech Abidjan sur la plateforme Les Pépites Tech.",
    sources: [
      {
        label: "Les Pépites Tech — fiche startup",
        href: "https://lespepitestech.com/startup-de-la-french-tech/onloutou",
      },
    ],
  },
  {
    id: "2019-structuration",
    period: "2019",
    title: "Structuration et reconnaissance",
    summary:
      "ONLOUTOU rejoint le portefeuille de Comoé Capital et fait partie des six startups lauréates du Fintech Challenge du Groupe BCP.",
    sources: [
      {
        label: "Comoé Capital — portefeuille",
        href: "https://comoecapital.com/portefeuille/onloutou/",
      },
      {
        label: "Abidjan.net — Fintech Challenge",
        href: "https://news.abidjan.net/articles/652983/finale-du-fintech-challenge-6-start-up-decrochent-des-partenariats-avec-le-groupe-bcp",
      },
      {
        label: "Vidéo — présentation",
        href: "https://www.youtube.com/watch?v=eAJDidNcANw",
      },
    ],
  },
  {
    id: "2020-panafrique",
    period: "2020",
    title: "Parcours panafricain",
    summary:
      "ONLOUTOU poursuit son parcours entrepreneurial entre la Côte d’Ivoire et le Maroc avec Impact Camp, la finale inwiDAYS et Seedstars Abidjan.",
  },
  {
    id: "2021-comoe",
    period: "2021",
    title: "Fin du cycle Comoé Capital",
    summary:
      "Le cycle d’investissement historique avec Comoé Capital, engagé en 2019, arrive à son terme en 2021.",
    sources: [
      {
        label: "Comoé Capital — portefeuille",
        href: "https://comoecapital.com/portefeuille/onloutou/",
      },
    ],
  },
  {
    id: "2022-presse",
    period: "2022",
    title: "Mise en lumière dans la presse technologique",
    summary:
      "Le parcours d’ONLOUTOU et son approche combinant location et technologie sont présentés dans la presse technologique africaine.",
    sources: [
      {
        label: "We Are Tech Africa — portrait",
        href: "https://www.wearetech.africa/fr/fils/solutions/en-cote-d-ivoire-onloutou-permet-de-louer-tout-type-de-biens-en-quelques-clics",
      },
    ],
  },
  {
    id: "aujourdhui",
    period: "Aujourd’hui",
    title: "Un périmètre élargi",
    summary:
      "L’expérience acquise nourrit aujourd’hui des solutions de location, de vente d’équipements, de géolocalisation, de gestion de flotte, de sécurisation d’actifs et de développement de plateformes numériques.",
  },
];

export const historicalSupportContent = {
  title: "Un accompagnement structurant",
  summary:
    "En 2019, ONLOUTOU a intégré le portefeuille de Comoé Capital, fonds associé à I&P Développement. Cet accompagnement a soutenu une ambition centrale : faciliter l’accès aux équipements en associant location, sécurisation et technologie. Le cycle d’investissement annoncé par Comoé Capital s’est achevé en 2021.",
  sources: [
    {
      label: "Comoé Capital — portefeuille",
      href: "https://comoecapital.com/portefeuille/onloutou/",
    },
    {
      label: "I&P — fiche entreprise",
      href: "https://www.ietp.com/fr/entreprises/onloutou",
    },
    {
      label: "I&P — rapport d’impact 2020 (PDF)",
      href: "https://www.ietp.com/sites/default/files/ESG_Impact_Annual_Report_IPDEV2_March_2020_WEB.pdf",
    },
  ],
};

export const historicalMetricsNote =
  "Repères issus de sources publiques et d’archives ONLOUTOU — non présentés comme des données actuellement auditées ou certifiées.";

/** Produits historiques Gust — non publiés tant que non confirmés en interne. */
export const pendingInnovationArchives = [
  {
    codename: "FINDME",
    publicationStatus: "pending-internal-confirmation" as VerificationStatus,
    sourceUrl: "https://gust.com/companies/onloutou",
  },
  {
    codename: "I'M HERE",
    publicationStatus: "pending-internal-confirmation" as VerificationStatus,
    sourceUrl: "https://gust.com/companies/onloutou",
  },
] as const;

export const homeHistoryPreview = {
  since: "Depuis 2016",
  highlights: [
    { title: "Fintech Challenge BCP", detail: "Lauréate 2019" },
    { title: "Impact Camp", detail: "Sélection 2019" },
    { title: "inwiDAYS", detail: "Finaliste 2020" },
    { title: "Seedstars Abidjan", detail: "Startup sélectionnée 2020" },
  ],
};

export const forbiddenHistoryPhrases = [
  "plus de 15 récompenses",
  "plus de 1 000 clients",
  "lauréate Seedstars",
  "gagnante d'inwiDAYS",
  "gagnante d’inwiDAYS",
  "lauréate Orange Fab",
  "partenaire actuel de Comoé Capital",
  "investissement direct de l'AFD",
  "investissement direct de l’AFD",
  "labellisée French Tech",
  "lauréate French Tech",
  "Challenge des 1 000 Entrepreneurs",
] as const;
