export type SiteMedia = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  kind: "photo" | "dashboard" | "logo" | "animated-svg";
  demonstration?: boolean;
};

const solutionsBase = "/assets/images/solutions";
const aboutBase = "/assets/images/about";
const dashboardBase = `${solutionsBase}/dashboard`;
const illustrationsBase = "/assets/illustrations/platform";

export const siteMedia = {
  logo: {
    src: "/assets/images/logo/embleme-ovale-onloutou.png",
    alt: "Emblème ONLOUTOU",
    width: 1918,
    height: 820,
    kind: "logo",
  } satisfies SiteMedia,
  solutions: {
    installationBerline: {
      src: `${solutionsBase}/installation-gps-berline-onloutou.png`,
      alt: "Technicien ONLOUTOU intervenant sur l’installation d’un dispositif GPS dans une berline.",
      width: 1536,
      height: 1024,
      kind: "photo",
    },
    installationTraceur: {
      src: `${solutionsBase}/installation-traceur-gps-onloutou.png`,
      alt: "Technicien ONLOUTOU installant un traceur GPS dans un véhicule.",
      width: 1536,
      height: 1024,
      kind: "photo",
    },
    inspectionCablage: {
      src: `${solutionsBase}/inspection-cablage-onloutou.png`,
      alt: "Techniciens ONLOUTOU inspectant le câblage d’un véhicule avant une intervention.",
      width: 1403,
      height: 1121,
      kind: "photo",
    },
  },
  dashboards: {
    geolocalisationAbidjan: {
      src: `${dashboardBase}/geolocalisation-flotte-abidjan.png`,
      alt: "Interface de démonstration de géolocalisation de flotte — données illustratives.",
      width: 1672,
      height: 941,
      kind: "dashboard",
      demonstration: true,
    },
    supervision: {
      src: `${dashboardBase}/supervision-flotte-onloutou.png`,
      alt: "Interface de démonstration de supervision de flotte — données illustratives.",
      width: 1586,
      height: 992,
      kind: "dashboard",
      demonstration: true,
    },
  },
  about: {
    facadeSlogan: {
      src: `${aboutBase}/facade-onloutou-slogan.png`,
      alt: "Façade ONLOUTOU avec enseigne jaune et noire et slogan de l’entreprise.",
      caption: "Identité visuelle ONLOUTOU — photographie d’archive, sans indication d’adresse actuelle.",
      width: 1742,
      height: 903,
      kind: "photo",
    },
    facadeVehiculeArbre: {
      src: `${aboutBase}/facade-onloutou-vehicule-arbre.png`,
      alt: "Vue extérieure d’un espace ONLOUTOU avec un véhicule stationné et un arbre.",
      width: 1742,
      height: 903,
      kind: "photo",
    },
    devanturePalmiers: {
      src: `${aboutBase}/devanture-onloutou-palmiers.png`,
      alt: "Devanture ONLOUTOU avec palmiers et porte ouverte.",
      width: 1448,
      height: 1086,
      kind: "photo",
    },
    equipeVehicule: {
      src: `${aboutBase}/equipe-onloutou-vehicule.png`,
      alt: "Membres d’une équipe ONLOUTOU devant un véhicule aux couleurs de l’entreprise.",
      caption: "Une histoire portée par des équipes proches du terrain.",
      width: 1086,
      height: 1448,
      kind: "photo",
    },
    standExposition: {
      src: `${aboutBase}/stand-exposition-onloutou.png`,
      alt: "Deux participants devant un stand d’exposition ONLOUTOU et un équipement de démonstration.",
      caption: "Archive ONLOUTOU — présentation de solutions dans un cadre professionnel.",
      width: 1448,
      height: 1086,
      kind: "photo",
    },
  },
  illustrations: {
    geolocalisation: {
      src: `${illustrationsBase}/onloutou-geolocalisation-animee.svg`,
      alt:
        "Illustration du fonctionnement d’une solution ONLOUTOU reliant véhicules, boîtier GPS et interface de supervision.",
      width: 1200,
      height: 690,
      kind: "animated-svg",
      demonstration: true,
    },
    ecosysteme: {
      src: `${illustrationsBase}/onloutou-ecosysteme-anime.svg`,
      alt:
        "Illustration animée de l’écosystème ONLOUTOU reliant location, équipements connectés et plateformes numériques.",
      width: 1200,
      height: 690,
      kind: "animated-svg",
    },
  },
} as const;

const homeEquipment = "/assets/images/home/equipment";

export const homeMedia = {
  hero: {
    photo: {
      ...siteMedia.solutions.installationTraceur,
      alt: "Technicien ONLOUTOU installant un traceur GPS dans un véhicule",
    },
    dashboard: {
      ...siteMedia.dashboards.supervision,
      alt: "Aperçu de démonstration de la supervision d’une flotte",
    },
  },
  ecosystem: {
    ...siteMedia.illustrations.ecosysteme,
    alt: "Illustration de l’écosystème de services ONLOUTOU",
  },
  equipment: {
    mobility: {
      src: `${homeEquipment}/berline-scooter-utilitaire-abidjan.png`,
      alt: "Berline et scooter utilitaire présentés dans un environnement urbain à Abidjan",
      width: 1448,
      height: 1086,
      kind: "photo" as const,
    },
    logistics: {
      src: `${homeEquipment}/camion-utilitaire-cour-logistique.png`,
      alt: "Camion utilitaire stationné dans une cour logistique",
      width: 1448,
      height: 1086,
      kind: "photo" as const,
    },
    professional: {
      src: `${homeEquipment}/equipe-onloutou-inspection-equipements.png`,
      alt: "Équipe ONLOUTOU inspectant des équipements professionnels",
      width: 1448,
      height: 1086,
      kind: "photo" as const,
    },
    field: {
      src: `${homeEquipment}/techniciens-onloutou-au-travail.png`,
      alt: "Techniciens ONLOUTOU pendant une intervention technique",
      width: 1448,
      height: 1086,
      kind: "photo" as const,
    },
  },
  geolocation: {
    illustration: {
      ...siteMedia.illustrations.geolocalisation,
      alt: "Illustration du fonctionnement de la géolocalisation et de la supervision ONLOUTOU",
    },
    primary: siteMedia.dashboards.geolocalisationAbidjan,
    secondary: siteMedia.dashboards.supervision,
  },
  installation: {
    install: siteMedia.solutions.installationBerline,
    check: siteMedia.solutions.inspectionCablage,
  },
  projects: {
    ...siteMedia.about.standExposition,
    alt: "Deux participants devant un stand d’exposition ONLOUTOU et un équipement de démonstration",
  },
  about: {
    facade: {
      ...siteMedia.about.facadeSlogan,
      alt: "Façade des locaux ONLOUTOU",
    },
    team: {
      ...siteMedia.about.equipeVehicule,
      alt: "Membres de l’équipe ONLOUTOU devant un véhicule",
    },
  },
} as const;

export type InstitutionalLogo = {
  id: string;
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  visualScale?: number;
  visualMaxWidth?: number;
  visualMaxHeight?: number;
};

export const historicalReferenceLogos: readonly InstitutionalLogo[] = [
  {
    id: "banque-atlantique",
    name: "Banque Atlantique",
    src: "/assets/images/logo/logo-partner/partner1_logo.png",
    alt: "Logo de Banque Atlantique",
    width: 225,
    height: 225,
    visualScale: 1.18,
    visualMaxWidth: 118,
    visualMaxHeight: 52,
  },
  {
    id: "bni",
    name: "BNI",
    src: "/assets/images/logo/logo-partner/partner2_logo.png",
    alt: "Logo de BNI",
    width: 230,
    height: 218,
    visualScale: 1.08,
    visualMaxWidth: 72,
    visualMaxHeight: 50,
  },
  {
    id: "chapechape",
    name: "ChapeChape Résidence",
    src: "/assets/images/logo/logo-partner/partner3_logo.png",
    alt: "Logo de ChapeChape Résidence",
    width: 58,
    height: 58,
    visualScale: 1.12,
    visualMaxWidth: 58,
    visualMaxHeight: 52,
  },
  {
    id: "orange",
    name: "Orange",
    src: "/assets/images/logo/logo-partner/partner4_logo.png",
    alt: "Logo d’Orange",
    width: 96,
    height: 54,
    visualScale: 1,
    visualMaxWidth: 96,
    visualMaxHeight: 54,
  },
  {
    id: "comoe-capital",
    name: "Comoé Capital",
    src: "/assets/images/logo/logo-partner/partner5_logo.png",
    alt: "Logo de Comoé Capital",
    width: 160,
    height: 80,
    visualScale: 1.22,
    visualMaxWidth: 160,
    visualMaxHeight: 54,
  },
];
