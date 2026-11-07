/* Page Expertise — contenu de la refonte (textes repris des écrans Figma).
   Les réponses de la FAQ notées « rédigée » sont absentes des maquettes : à valider. */

export type ExpIconName =
  | "docSearch"
  | "gear"
  | "wrench"
  | "network"
  | "chart"
  | "graduation"
  | "chat"
  | "doc"
  | "nodes"
  | "people"
  | "arrowUpRight"
  | "arrowRight"
  | "arrowDown"
  | "plus"
  | "minus";

export type ExpImageId =
  | "hero"
  | "banque"
  | "btp"
  | "transport"
  | "institutions"
  | "cadrage"
  | "deploiement"
  | "installation"
  | "flotte"
  | "reporting"
  | "formation"
  | "methode";

const base = "/assets/images/expertise";

export const expImages: Record<ExpImageId, { src: string; width: number; height: number }> = {
  hero: { src: `${base}/exp-01-hero-plan-technique.webp`, width: 1400, height: 919 },
  banque: { src: `${base}/exp-02-secteur-banque.webp`, width: 1315, height: 986 },
  btp: { src: `${base}/exp-03-secteur-btp.webp`, width: 1400, height: 865 },
  transport: { src: `${base}/exp-04-secteur-transport.webp`, width: 1400, height: 635 },
  institutions: { src: `${base}/exp-05-secteur-institutions.webp`, width: 1400, height: 691 },
  cadrage: { src: `${base}/exp-06-cadrage.webp`, width: 1400, height: 829 },
  deploiement: { src: `${base}/exp-07-deploiement.webp`, width: 1400, height: 937 },
  installation: { src: `${base}/exp-08-installation.webp`, width: 1400, height: 933 },
  flotte: { src: `${base}/exp-09-flotte-operations.webp`, width: 1400, height: 840 },
  reporting: { src: `${base}/exp-10-reporting.webp`, width: 1400, height: 858 },
  formation: { src: `${base}/exp-11-formation.webp`, width: 1400, height: 836 },
  methode: { src: `${base}/exp-12-methode.webp`, width: 1400, height: 916 },
};

export const expLinks = {
  project: "/projets#brief-projet",
  contact: "/contact",
} as const;

/** Début de l'écran « Prestations » (cible de « Explorer nos expertises »). */
export const expServicesId = "savoir-faire";

export const expHero = {
  eyebrow: "CONSEIL · TERRAIN · TECHNOLOGIE",
  titleLines: ["Du besoin", "au terrain,", "une expertise", "à chaque étape."],
  lead: "Cadrer votre projet, préparer les équipements et accompagner vos équipes dans leur utilisation.",
  primary: { label: "Parler de mon projet", href: expLinks.project },
  secondary: { label: "Explorer nos expertises", href: `#${expServicesId}` },
  image: {
    id: "hero" as ExpImageId,
    alt: "Une cheffe de projet et un technicien examinent un plan technique à côté d’un ordinateur portable",
    caption: "Illustration d’une situation de travail.",
  },
};

/** Barre noire de raccourcis : chaque entrée cible la carte correspondante de l'écran Prestations. */
export const expShortcuts: { label: string; href: string; icon: ExpIconName }[] = [
  { label: "Cadrage", href: "#cadrage", icon: "docSearch" },
  { label: "Déploiement", href: "#deploiement", icon: "gear" },
  { label: "Installation", href: "#installation-parametrage", icon: "wrench" },
  { label: "Opérations", href: "#flotte-operations", icon: "network" },
  { label: "Reporting", href: "#supervision-reporting", icon: "chart" },
  { label: "Formation", href: "#transfert-suivi", icon: "graduation" },
];

export const expSectors = {
  title: "À chaque activité, ses contraintes.",
  lead: "Nous adaptons l’approche au contexte, aux équipements et aux usages.",
  items: [
    {
      id: "banque",
      title: "Banque & crédit-bail",
      text: "Suivi des actifs financés et informations utiles aux équipes.",
      image: "banque" as ExpImageId,
      alt: "Un conseiller et une collègue examinent un dossier",
    },
    {
      id: "transport",
      title: "Transport & logistique",
      text: "Organisation des véhicules, trajets et opérations.",
      image: "transport" as ExpImageId,
      alt: "Un responsable logistique avec une tablette devant trois camions blancs",
    },
    {
      id: "btp",
      title: "BTP & industrie",
      text: "Équipements mobiles, conditions de chantier et suivi terrain.",
      image: "btp" as ExpImageId,
      alt: "Un chef de chantier avec une tablette devant une pelle mécanique",
    },
    {
      id: "institutions",
      title: "Entreprises & institutions",
      text: "Outils métier, coordination et besoins spécifiques.",
      image: "institutions" as ExpImageId,
      alt: "Deux collègues devant un écran affichant une carte",
    },
  ],
  banner: {
    title: "Votre projet mobilise plusieurs métiers ?",
    text: "Construisons une approche adaptée à votre besoin.",
    cta: { label: "Présenter mon contexte", href: expLinks.project },
  },
};

export const expServices = {
  id: expServicesId,
  kicker: "NOS EXPERTISES",
  title: "Six savoir-faire, un accompagnement cohérent.",
  lead: "Identifiez l’intervention utile à votre projet. Le périmètre se définit selon vos besoins.",
  previewLabel: "À préciser ensemble",
  items: [
    {
      id: "cadrage",
      number: "01",
      icon: "doc" as ExpIconName,
      title: "Cadrage du projet",
      text: "Comprendre les usages, les contraintes et les objectifs avant de définir une solution.",
      preview: "Périmètre, priorités et critères de validation.",
      image: "cadrage" as ExpImageId,
      alt: "Un chef de projet et une collègue étudient un plan",
    },
    {
      id: "deploiement",
      number: "02",
      icon: "gear" as ExpIconName,
      title: "Déploiement terrain",
      text: "Organiser la préparation, les interventions sur site et les vérifications de mise en service.",
      preview: "Planning, accès, moyens et responsabilités.",
      image: "deploiement" as ExpImageId,
      alt: "Un technicien prépare deux valises de câblage et d’outillage",
    },
    {
      id: "installation-parametrage",
      number: "03",
      icon: "wrench" as ExpIconName,
      title: "Installation & paramétrage",
      text: "Installer les équipements concernés et configurer les fonctions prévues pour leur usage.",
      preview: "Compatibilité, réglages et tests.",
      image: "installation" as ExpImageId,
      alt: "Un technicien installe un faisceau électrique sur un engin",
    },
    {
      id: "flotte-operations",
      number: "04",
      icon: "network" as ExpIconName,
      title: "Flotte & opérations",
      text: "Structurer les informations utiles au suivi des véhicules, des équipements et des activités.",
      preview: "Parc, usages, rôles et besoins de suivi.",
      image: "flotte" as ExpImageId,
      alt: "Une responsable et un collègue avec une tablette devant des camions",
    },
    {
      id: "supervision-reporting",
      number: "05",
      icon: "chart" as ExpIconName,
      title: "Supervision & reporting",
      text: "Définir les indicateurs, les vues et les rapports utiles au pilotage de l’activité.",
      preview: "Données, alertes et indicateurs pertinents.",
      image: "reporting" as ExpImageId,
      alt: "Un responsable observe un écran de tableau de bord",
    },
    {
      id: "transfert-suivi",
      number: "06",
      icon: "graduation" as ExpIconName,
      title: "Formation & accompagnement",
      text: "Accompagner la prise en main des outils et transmettre les repères nécessaires aux équipes.",
      preview: "Utilisateurs, supports et modalités de suivi.",
      image: "formation" as ExpImageId,
      alt: "Une formatrice présente un écran à des équipes",
    },
  ],
  associated: {
    title: "Les solutions associées",
    text: "Explorez les offres qui peuvent mobiliser ces expertises.",
    links: [
      { label: "Géolocalisation", href: "/solutions/geolocalisation" },
      { label: "Gestion de flotte", href: "/solutions/gestion-de-flotte" },
      { label: "Projets sur mesure", href: "/solutions/plateformes-sur-mesure" },
    ],
  },
  combine: {
    text: "Une intervention peut combiner plusieurs expertises.",
    cta: { label: "Parler de mon projet", href: expLinks.project },
  },
};

export const expMethod = {
  kicker: "NOTRE MÉTHODE",
  titleLines: ["Un cadre clair,", "du premier échange", "au suivi."],
  steps: [
    { number: "01", title: "Cadrage", text: "Comprendre le besoin et les contraintes." },
    { number: "02", title: "Architecture", text: "Définir les choix techniques et le périmètre." },
    { number: "03", title: "Préparation", text: "Organiser les moyens et les interventions." },
    { number: "04", title: "Déploiement", text: "Installer, paramétrer et mettre en service." },
    { number: "05", title: "Recette", text: "Vérifier les points convenus ensemble." },
    { number: "06", title: "Transfert & suivi", text: "Former, documenter et accompagner." },
  ],
  note: "Les étapes et les livrables sont adaptés au projet.",
  image: {
    id: "methode" as ExpImageId,
    alt: "Une cheffe de projet présente une liste de vérification des équipements à deux techniciens",
    caption: "Illustration d’un accompagnement d’équipe.",
  },
};

export const expTender = {
  title: "Un cahier des charges à étudier ?",
  text: "Présentez votre contexte, les équipements concernés et les contraintes de votre consultation.",
  cta: { label: "Présenter ma demande", href: expLinks.contact },
};

export const expFaq = {
  title: "Avant de démarrer.",
  lead: "Quelques repères pour préparer notre échange.",
  items: [
    {
      question: "Faut-il déjà avoir une solution définie ?",
      answer: "Non. Le premier échange peut servir à préciser le besoin et les contraintes.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Peut-on combiner plusieurs expertises ?",
      answer:
        "Oui. Une intervention peut associer plusieurs expertises, par exemple le cadrage, l’installation et la formation. La combinaison se précise ensemble, selon votre projet.",
    },
    {
      // rédigée (absente de la maquette)
      question: "L’accompagnement inclut-il la formation ?",
      answer:
        "La formation et l’accompagnement font partie des expertises proposées. Les utilisateurs concernés, les supports et les modalités de suivi se précisent ensemble.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Comment sont définis les délais et le périmètre ?",
      answer:
        "Ils se définissent selon vos besoins, après l’étude de votre contexte. Le périmètre et le calendrier sont précisés dans la proposition applicable.",
    },
  ],
};

export const expFinal = {
  titleLines: ["Votre besoin mérite", "une approche adaptée."],
  text: "Parlons de votre contexte et des prochaines étapes.",
  primary: { label: "Parler de mon projet", href: expLinks.project },
  secondary: { label: "Nous contacter", href: expLinks.contact },
};