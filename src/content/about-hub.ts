/* Page À propos — contenu de la refonte (textes repris des 5 écrans Figma).
   Aucun fait ni aucune date n’est ajouté : tout vient des maquettes.
   Les URL externes viennent du code existant (company-history.ts, media-mentions.ts). */

export type AbtIconName = "arrowUpRight" | "arrowRight" | "arrowDown" | "play" | "car" | "search" | "fork" | "fuel" | "plug" | "snow" | "speaker" | "leaf";

const base = "/assets/images/about";

export const abtImages = {
  hero: { src: `${base}/abt-01-devanture-palmiers.webp`, width: 1200, height: 900 },
  canalPoster: { src: `${base}/abt-02-espace-location.webp`, width: 800, height: 378 },
  reportagePoster: { src: `${base}/reportage-canal-poster.jpg`, width: 640, height: 368 },
  team: { src: `${base}/abt-03-equipe-vehicule.webp`, width: 900, height: 1200 },
  facadeSlogan: { src: `${base}/abt-04-facade-slogan.webp`, width: 1400, height: 726 },
  history: { src: `${base}/abt-05-facade-vehicule-arbre.webp`, width: 1400, height: 726 },
  stand: { src: `${base}/abt-06-stand-exposition.webp`, width: 1100, height: 825 },
  chapechape: { src: "/assets/images/projects/projet/prj-01-chapechape-residence.webp", width: 1400, height: 933 },
} as const;

/** Reportage Canal : fichier local volumineux (≈ 25 Mo), servi tel quel, chargé à la demande. */
export const abtCanalVideoSrc = "/assets/images/about/video/VID-20261101-WA0017.mp4";

export const abtBcp = {
  videoId: "eAJDidNcANw",
  watchUrl: "https://youtu.be/eAJDidNcANw",
  embedUrl: "https://www.youtube-nocookie.com/embed/eAJDidNcANw?autoplay=1&rel=0",
} as const;

export const abtIds = {
  approach: "about-principles",
  history: "parcours",
  recognition: "distinctions",
  collaboration: "accompagnement",
  further: "presse",
  team: "about-team",
  archives: "archives",
  projects: "ecosysteme",
} as const;

export const abtHero = {
  eyebrow: "À PROPOS D’ONLOUTOU",
  title: "Le terrain comme point de départ.",
  subtitle: "La technologie pour aller plus loin.",
  lead: "Location d’équipements, solutions connectées et projets numériques : ONLOUTOU construit des réponses à partir des usages.",
  primary: { label: "Découvrir notre parcours", href: `#${abtIds.history}` },
  secondary: { label: "Rencontrer l’équipe", href: `#${abtIds.team}` },
  image: { alt: "Devanture ONLOUTOU, enseigne jaune « On fait tout, On a tout et on loue tout », entourée de palmiers" },
  caption: "Une image de l’histoire d’ONLOUTOU.",
};

export const abtSubnav = [
  { label: "Notre approche", href: `#${abtIds.approach}` },
  { label: "Notre histoire", href: `#${abtIds.history}` },
  { label: "L’équipe", href: `#${abtIds.team}` },
  { label: "Nos projets", href: `#${abtIds.projects}` },
];

export const abtCanal = {
  eyebrow: "ONLOUTOU EN IMAGES",
  title: "Découvrez ONLOUTOU dans un reportage Canal.",
  lead: "Un regard sur l’entreprise et ses activités.",
  badge: "REPORTAGE CANAL",
  duration: "3 min",
  button: "Regarder le reportage",
  note: "Lecture à la demande",
  posterAlt: "Image du reportage Canal+ : présentation d’un équipement ONLOUTOU dans les locaux de l’entreprise",
  videoLabel: "Reportage Canal sur ONLOUTOU",
};

export const abtHistory = {
  eyebrow: "NOTRE HISTOIRE",
  title: "Un parcours construit étape par étape.",
  lead: "De la location aux projets technologiques, des repères pour comprendre l’évolution d’ONLOUTOU.",
  items: [
    { year: "2016", title: "Les débuts d’ONLOUTOU", text: "La location de biens et d’équipements, associée à une composante technologique." },
    { year: "2019", title: "Un accompagnement structurant", text: "Entrée au portefeuille de Comoé Capital." },
    { year: "2019", title: "De l’innovation à la collaboration", text: "Fintech Challenge du Groupe BCP et collaboration avec Banque Atlantique Côte d’Ivoire." },
    { year: "2021", title: "Fin du cycle d’investissement", text: "Sortie du portefeuille de Comoé Capital." },
  ],
  note: "Repères documentés : Comoé Capital · Groupe BCP",
  imageAlt: "Façade ONLOUTOU en centre-ville, enseigne jaune au-dessus de la devanture, véhicule noir stationné devant",
};

export const abtRecognition = {
  title: "Des étapes de reconnaissance.",
  items: [
    { year: "2019", status: "LAURÉAT", title: "Fintech Challenge — Groupe BCP", text: "Une étape du parcours entrepreneurial." },
    { year: "2019", status: "SÉLECTIONNÉ", title: "Impact Camp by inwi", text: "Une étape du parcours entrepreneurial." },
    { year: "2020", status: "FINALISTE", title: "inwiDAYS", text: "Une étape du parcours entrepreneurial." },
    { year: "2020", status: "PARTICIPANT", title: "Seedstars Abidjan", text: "Une étape du parcours entrepreneurial." },
  ],
};

export const abtCollab = {
  eyebrow: "UNE COLLABORATION RACONTÉE EN VIDÉO.",
  title: "Du Fintech Challenge à Banque Atlantique.",
  text: "Un retour sur la collaboration autour de la gestion à distance de véhicules en leasing via une technologie IoT.",
  link: "Voir la vidéo officielle",
  source: "Vidéo publiée par Banque Populaire du Maroc · 31 décembre 2019",
  thumbnail: { src: "/assets/images/about/bcp-fintech-challenge-thumbnail.jpg", width: 1280, height: 720 },
  playLabel: "Lire la vidéo Du Fintech Challenge à Banque Atlantique",
  iframeTitle: "Du Fintech Challenge à Banque Atlantique — vidéo publiée par Banque Populaire du Maroc",
};

/** URL reprises de company-history.ts / media-mentions.ts (aucune URL inventée). */
export const abtFurther = {
  title: "Pour aller plus loin",
  links: [
    { label: "Comoé Capital", href: "https://comoecapital.com/portefeuille/onloutou/" },
    {
      label: "We Are Tech Africa · 2022",
      href: "https://www.wearetech.africa/fr/fils/solutions/en-cote-d-ivoire-onloutou-permet-de-louer-tout-type-de-biens-en-quelques-clics",
    },
    { label: "Seedstars · 2020", href: "https://www.seedstarsworld.com/event/seedstars-abidjan-2020/" },
  ],
};

export const abtTeam = {
  eyebrow: "L’ÉQUIPE ONLOUTOU",
  title: "Des compétences complémentaires, un engagement commun.",
  lead: "De la vision à la mise en œuvre, une équipe qui relie les projets numériques aux réalités du terrain.",
  founder: {
    tag: "VISION & DÉVELOPPEMENT",
    name: "Adams Ousmane Diaby",
    role: "Fondateur · Président-directeur général",
    text: "Porte la vision d’ONLOUTOU, le développement de l’entreprise et ses collaborations.",
    image: { src: "/assets/images/about/teams/adams_diaby.jpg", width: 840, height: 1080, position: "center 24%" },
    social: [{ network: "linkedin" as const, href: "https://www.linkedin.com/in/ousmane-adams-diaby-6b8a72156" }],
  },
  members: [
    {
      tag: "CFO",
      name: "Seri Djati Stéphane",
      title: "Sous-directeur",
      role: "Finance & relations partenaires",
      text: "Suivi financier, comptabilité et coordination des partenaires.",
      image: { src: "/assets/images/about/teams/seridjati.jpg", width: 1151, height: 1536, position: "center 18%" },
    },
    {
      tag: "CTO",
      name: "Sidney Jordan",
      role: "Direction technique & projets",
      text: "Développement numérique, cybersécurité et pilotage des projets.",
      image: { src: "/assets/images/about/teams/sidney-jordan.jpg", width: 1254, height: 1254, position: "center 16%" },
      social: [
        { network: "linkedin" as const, href: "https://www.linkedin.com/in/sir-sidney-jordan-39587a283" },
        { network: "github" as const, href: "https://github.com/Loicqra12" },
      ],
    },
    {
      tag: "TERRAIN",
      name: "Kaboré Hervé",
      role: "Géolocalisation & coordination terrain",
      text: "Plateformes GPS et coordination des installations sur les flottes.",
      image: { src: "/assets/images/about/teams/kabore-herve-original.jpg", width: 1437, height: 1536, position: "center 28%" },
    },
    {
      tag: "TECHNIQUE",
      name: "El Hadj Sadou Coulibaly",
      role: "Électronique & installations automobiles",
      text: "Interventions techniques et coordination des installations automobiles.",
      image: { src: "/assets/images/about/teams/photo_elhadj_sadou_koulibaly.png", width: 1536, height: 2093, position: "center 20%" },
    },
  ],
  cta: { title: "Un projet à construire avec nous ?", label: "Parlons de votre besoin", href: "/contact" },
};

export const abtArchives = {
  eyebrow: "COLLABORATIONS & ARCHIVES",
  title: "Des images qui racontent notre parcours.",
  lead: "Retrouvez une collaboration documentée et des moments de l’histoire d’ONLOUTOU.",
  videoTitle: "Du Fintech Challenge à Banque Atlantique.",
  videoText: "Un retour sur la collaboration autour de la gestion à distance de véhicules en leasing.",
  videoButton: "Voir la vidéo sur YouTube",
  videoSource: "Publié par Banque Populaire du Maroc",
  momentsTitle: "Quelques moments de notre histoire.",
  badge: "ARCHIVE",
  moments: [
    {
      id: "identite",
      image: { ...abtImages.team },
      alt: "Trois membres de l’équipe ONLOUTOU devant un véhicule aux couleurs de l’entreprise, tenant l’enseigne jaune",
      caption: "Autour de l’identité ONLOUTOU.",
    },
    {
      id: "salon",
      image: { ...abtImages.stand },
      alt: "Deux représentants ONLOUTOU sur un stand de salon, devant un panneau de présentation et un drone",
      caption: "Présentation des solutions lors d’un salon.",
    },
    {
      id: "espace",
      image: { ...abtImages.canalPoster },
      alt: "Espace ONLOUTOU dédié à la location d’équipements, avec tapis rouge et présentoir d’appareils",
      caption: "Un espace dédié à la location d’équipements.",
    },
  ],
  footer: {
    title: "Des équipements aux solutions connectées.",
    text: "Ces archives illustrent les activités et les étapes du développement de l’entreprise.",
    /** Conserve le lien historique /a-propos → /projets#bazar-onloutou (archives catalogue 2017). */
    cta: { label: "Explorer nos projets", href: "/projets#bazar-onloutou" },
  },
};

export const abtEcosystem = {
  eyebrow: "L’ÉCOSYSTÈME ONLOUTOU",
  title: "Des projets qui prolongent notre savoir-faire.",
  lead: "Des réalisations numériques et des initiatives à différents stades de développement.",
  featured: {
    title: "ChapeChape Résidence",
    badge: "PROJET EXISTANT",
    text: "Un projet ONLOUTOU autour de la location et de la gestion de résidences.",
    tags: "Site · Applications · Gestion",
    cta: { label: "Découvrir le projet", href: "/projets#chapechape-residence" },
    caption: "Illustration",
    alt: "Salon meublé lumineux avec cuisine ouverte, illustration du projet ChapeChape Résidence",
  },
  collab: {
    title: "Des réalisations menées en collaboration.",
    badge: "RÉALISATION",
    items: [
      { name: "KPS Services", text: "Site web et tableau de bord" },
      { name: "CNDPEP-CI", text: "Site et espace de gestion" },
    ],
    note: "Avec l’équipe ChapeChape Résidence.",
  },
  initiatives: {
    title: "Les initiatives en préparation.",
    items: [
      { icon: "car" as AbtIconName, name: "APA — Allo Pièce Auto", badge: "MVP", text: "Un projet de plateforme de pièces automobiles." },
      { icon: "search" as AbtIconName, name: "OVPR", badge: "MVP", text: "Objets volés, perdus ou retrouvés." },
      { icon: "fork" as AbtIconName, name: "Sidsun", badge: "EN DÉVELOPPEMENT", text: "Gestion de restaurant, nourrie par l’expérience du Kiosque ONLOUTOU." },
      { icon: "fuel" as AbtIconName, name: "Carburant à la demande", badge: "À VENIR", text: "Un projet de ravitaillement mobile sur demande." },
    ],
    cta: { label: "Voir les projets et leurs aperçus", href: "/projets" },
  },
  needs: {
    title: "Des besoins variés à étudier.",
    lead: "Vous recherchez un équipement hors des familles habituelles ? Présentez votre usage.",
    items: [
      { icon: "plug" as AbtIconName, label: "Énergie & pompage" },
      { icon: "snow" as AbtIconName, label: "Froid & climatisation" },
      { icon: "speaker" as AbtIconName, label: "Événementiel & audiovisuel" },
      { icon: "leaf" as AbtIconName, label: "Nettoyage & espaces verts" },
    ],
    note: "Pistes à qualifier selon le besoin, les partenaires et les disponibilités.",
    cta: { label: "Décrire mon besoin", href: "/contact" },
  },
};

export const abtBand = {
  title: "Parlons de votre prochain projet.",
  primary: { label: "Contacter ONLOUTOU", href: "/contact" },
  secondary: { label: "Explorer nos réalisations", href: "/projets" },
};