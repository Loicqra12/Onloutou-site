export type TeamQuoteStatus = "approved" | "pending-validation";

export type TeamMemberProfile = {
  id: string;
  name: string;
  role: string;
  shortRole?: string;
  biography: string;
  biographyExtra?: string;
  quote: string;
  quoteStatus: TeamQuoteStatus;
  expertise: string[];
  image: {
    src: string | null;
    alt: string;
    focalPoint?: string;
    width?: number;
    height?: number;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
  };
  featured?: boolean;
  initials: string;
};

const TEAM_IMAGE_BASE = "/assets/images/team";

function teamImagePath(filename: string): string {
  return `${TEAM_IMAGE_BASE}/${filename}`;
}

/** Intitulé retenu faute de forme juridique « PDG » validée dans les contenus internes du dépôt. */
export const founderRoleTitle = "Fondateur & Directeur général";

export const aboutTeamIntro = {
  eyebrow: "L’équipe ONLOUTOU",
  title: "Une équipe entre vision, technologie et terrain",
  lead:
    "Des compétences complémentaires réunies pour concevoir, financer, déployer et maintenir des solutions adaptées aux réalités opérationnelles.",
};

export const aboutTeamMembers: TeamMemberProfile[] = [
  {
    id: "adams-ousmane-diaby",
    name: "Adams Ousmane Diaby",
    role: founderRoleTitle,
    biography:
      "Fondateur d’ONLOUTOU, Adams Ousmane Diaby porte la vision stratégique et le développement de l’entreprise. Son parcours entrepreneurial associe connaissance du terrain, location d’équipements, innovation technologique et construction de partenariats destinés à rendre les équipements et les services plus accessibles.",
    quote:
      "Rendre les équipements et les technologies utiles plus accessibles, c’est créer de nouvelles possibilités pour les particuliers comme pour les entreprises.",
    quoteStatus: "pending-validation",
    expertise: [
      "Vision stratégique",
      "Entrepreneuriat",
      "Développement de partenariats",
      "Location et services",
      "Innovation",
    ],
    image: {
      src: null,
      alt: "Portrait d’Adams Ousmane Diaby, fondateur d’ONLOUTOU",
      width: 1200,
      height: 1500,
      focalPoint: "50% 35%",
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/ousmane-adams-diaby-6b8a72156",
    },
    featured: true,
    initials: "AOD",
  },
  {
    id: "seri-djati-stephane",
    name: "Seri Djati Stéphane",
    role: "Sous-directeur",
    shortRole: "CFO",
    biography:
      "Comptable de formation, Seri Djati Stéphane assure le pilotage financier, administratif et comptable d’ONLOUTOU. Il contribue également à la coordination des relations avec les partenaires de l’entreprise et à la continuité des échanges nécessaires au suivi des projets.",
    quote:
      "Une croissance durable repose sur des finances rigoureuses, des engagements clairs et des partenariats construits dans la confiance.",
    quoteStatus: "pending-validation",
    expertise: ["Finance", "Comptabilité", "Administration", "Suivi des partenariats", "Coordination"],
    image: {
      src: null,
      alt: "Portrait de Seri Djati Stéphane, sous-directeur",
      width: 1200,
      height: 1500,
    },
    socialLinks: {},
    initials: "SDS",
  },
  {
    id: "sidney-jordan",
    name: "Sidney Jordan",
    role: "Directeur technique & Chef de projets numériques",
    shortRole: "CTO",
    biography:
      "Sidney Jordan pilote les orientations informatiques et techniques d’ONLOUTOU ainsi que la conception de ses projets numériques. Développeur full-stack et spécialiste des problématiques de cybersécurité, il intervient sur l’architecture des plateformes, les applications, la sécurité, l’intégration technique et la transformation des besoins opérationnels en produits numériques.",
    biographyExtra:
      "Entrepreneur technologique, il est également cofondateur et CTO de ChapeChape Résidence, une plateforme numérique dédiée à la location et à la gestion immobilière.",
    quote:
      "Une technologie utile transforme un besoin réel en une solution simple, sécurisée et durable.",
    quoteStatus: "pending-validation",
    expertise: [
      "Direction technique",
      "Développement d’applications",
      "Architecture logicielle",
      "Cybersécurité",
      "Gestion de projets numériques",
    ],
    image: {
      src: null,
      alt: "Portrait de Sidney Jordan, directeur technique d’ONLOUTOU",
      width: 1200,
      height: 1500,
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/sir-sidney-jordan-39587a283",
      github: "https://github.com/Loicqra12",
    },
    initials: "SJ",
  },
  {
    id: "kabore-herve",
    name: "Kaboré Hervé",
    role: "Directeur des opérations de géolocalisation",
    biography:
      "Informaticien de formation, Kaboré Hervé supervise les plateformes de géolocalisation exploitées par ONLOUTOU. Il coordonne la préparation technique, le paramétrage, le suivi opérationnel et les interventions terrain associées aux installations réalisées sur les véhicules et équipements suivis.",
    biographyExtra:
      "Il veille à la continuité entre les outils de supervision, les équipes d’installation et les besoins opérationnels des projets.",
    quote:
      "Une solution de géolocalisation n’a de valeur que lorsqu’elle reste fiable du paramétrage initial jusqu’à son utilisation sur le terrain.",
    quoteStatus: "pending-validation",
    expertise: [
      "Plateformes GPS",
      "Supervision de flotte",
      "Paramétrage",
      "Coordination terrain",
      "Support opérationnel",
    ],
    image: {
      src: null,
      alt: "Portrait de Kaboré Hervé, directeur des opérations de géolocalisation",
      width: 1200,
      height: 1500,
    },
    socialLinks: {},
    initials: "KH",
  },
  {
    id: "el-hadj-sadou-coulibaly",
    name: "El Hadj Sadou Coulibaly",
    role: "Responsable des installations & de l’électronique embarquée",
    biography:
      "Expert en électronique, électricien automobile et mécanicien de métier, El Hadj Sadou Coulibaly coordonne les installations techniques réalisées sur les véhicules. Il intervient dans la préparation, la pose, le contrôle du câblage, les essais et la vérification du bon fonctionnement des équipements embarqués.",
    quote:
      "Une installation fiable commence par la maîtrise du véhicule, du câblage et de chaque détail électronique.",
    quoteStatus: "pending-validation",
    expertise: [
      "Électronique",
      "Électricité automobile",
      "Mécanique",
      "Installation de traceurs",
      "Diagnostic terrain",
    ],
    image: {
      src: null,
      alt: "Portrait d’El Hadj Sadou Coulibaly, responsable des installations",
      width: 1200,
      height: 1500,
    },
    socialLinks: {},
    initials: "ESC",
  },
];

/** Chemins publics attendus lorsque les portraits seront déposés (non utilisés tant que fichiers absents). */
export const aboutTeamImageFilenames = {
  adams: "adams-ousmane-diaby.webp",
  seri: "seri-djati-stephane.webp",
  sidney: "sidney-jordan.webp",
  kabore: "kabore-herve.webp",
  sadou: "el-hadj-sadou-coulibaly.webp",
} as const;

export function getAboutTeamFounder(): TeamMemberProfile {
  const founder = aboutTeamMembers.find((m) => m.featured);
  if (!founder) throw new Error("Aucun membre fondateur défini");
  return founder;
}

export function getAboutTeamGridMembers(): TeamMemberProfile[] {
  return aboutTeamMembers.filter((m) => !m.featured);
}

export function resolveTeamImageSrc(member: TeamMemberProfile): string | null {
  if (!member.image.src) return null;
  return member.image.src;
}

/** À appeler après dépôt des fichiers WebP pour activer les portraits. */
export function withTeamImagePaths(members: TeamMemberProfile[]): TeamMemberProfile[] {
  const fileById: Record<string, string> = {
    "adams-ousmane-diaby": aboutTeamImageFilenames.adams,
    "seri-djati-stephane": aboutTeamImageFilenames.seri,
    "sidney-jordan": aboutTeamImageFilenames.sidney,
    "kabore-herve": aboutTeamImageFilenames.kabore,
    "el-hadj-sadou-coulibaly": aboutTeamImageFilenames.sadou,
  };
  return members.map((member) => {
    const file = fileById[member.id];
    if (!file) return member;
    return {
      ...member,
      image: { ...member.image, src: teamImagePath(file) },
    };
  });
}
