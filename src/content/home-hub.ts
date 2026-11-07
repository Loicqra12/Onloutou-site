import { historicalReferenceLogos, homeMedia, siteMedia } from "@/content/media";
import { projectShowcaseItems, terrainGalleryItems, terrainMethodIntro } from "@/content/home";

/**
 * Accueil (refonte Figma) : contenu des sections `.hom-*`.
 * Les textes suivent la maquette ; les textes marqués « rédigé » sont ceux qui manquaient
 * dans les écrans (éléments repliés de l’accordéon 01, légendes d’images).
 */

const homeImg = "/assets/images/home";

export const homIds = {
  hero: "accueil",
  universes: "univers",
  universesAlias: "01",
  equipment: "equipements",
  geolocation: "flotte",
  method: "installation",
  build: "plateforme",
  projects: "projets",
  recognition: "distinctions-accueil",
  company: "a-propos",
  cta: "contact",
} as const;

export const homHero = {
  eyebrow: ["Louer", "Acheter", "Connecter", "Construire"],
  titleLines: ["Qui loue tout", "en Côte d’Ivoire ?"],
  titleBrand: "ONLOUTOU.",
  lead:
    "Véhicules, engins, outils et équipements du quotidien : dites-nous ce que vous recherchez. Géolocalisation et projets numériques : nous vous accompagnons aussi.",
  primary: { label: "Faire une demande de location", href: "/solutions/location" },
  secondary: { label: "Équiper ma flotte en GPS", href: "/solutions/geolocalisation" },
  explore: { label: "Explorer", href: "#01" },
  photo: homeMedia.hero.photo,
};

export const homPartners = {
  title: "Des relations qui font partie de notre parcours",
  link: { label: "Découvrir notre histoire", href: "/a-propos" },
  /** Libellés de la maquette, associés aux logos existants. */
  labels: {
    "banque-atlantique": "Géolocalisation",
    bni: "Géolocalisation",
    chapechape: "Projet ONLOUTOU",
    orange: "Parcours",
    "comoe-capital": "Accompagnement 2019–2021",
  } as Record<string, string>,
  logos: historicalReferenceLogos,
};

export const homUniverses = {
  eyebrow: "01 · Nos univers",
  title: "Un besoin. Plusieurs façons de vous accompagner.",
  aside: "Location, acquisition, géolocalisation et projets numériques : choisissez votre point de départ.",
  footnote: "Disponibilité et conditions confirmées après étude du besoin.",
  items: [
    {
      id: "louer",
      number: "01",
      title: "Louer",
      text: "Véhicules, engins, outils et matériel : une demande adaptée à votre usage.",
      cta: { label: "Découvrir la location", href: "/solutions/location" },
      image: { src: `${homeImg}/hom-01-espace-mobilite.webp`, alt: "Véhicules et motos devant l’espace ONLOUTOU", width: 1200, height: 900, position: "center 60%" },
      caption: { title: "Mobilité, équipement, matériel.", detail: "Espace mobilité ONLOUTOU" },
    },
    {
      // Texte et légende rédigés (éléments repliés absents de la maquette).
      id: "acheter",
      number: "02",
      title: "Acheter",
      text: "Des équipements à acquérir, avec caractéristiques et conditions confirmées avant engagement.",
      cta: { label: "Découvrir la vente", href: "/solutions/vente" },
      image: { src: `${homeImg}/hom-03-equipements-professionnels.webp`, alt: "Équipements professionnels présentés à Abidjan", width: 1200, height: 900, position: "center 45%" },
      caption: { title: "Équipements professionnels.", detail: "Présentés à Abidjan" },
    },
    {
      id: "connecter",
      number: "03",
      title: "Connecter & piloter",
      text: "Géolocaliser, superviser et sécuriser vos actifs : GPS, connectivité et alertes.",
      cta: { label: "Découvrir la géolocalisation", href: "/solutions/geolocalisation" },
      image: { src: homeMedia.geolocation.primary.src, alt: "Aperçu de démonstration de la géolocalisation d’une flotte", width: homeMedia.geolocation.primary.width, height: homeMedia.geolocation.primary.height, position: "center" },
      caption: { title: "Géolocalisation et supervision.", detail: "Interface de démonstration — données illustratives." },
    },
    {
      id: "construire",
      number: "04",
      title: "Construire",
      text: "Applications, tableaux de bord et intégrations adaptés à vos opérations.",
      cta: { label: "Découvrir les plateformes", href: "/solutions/plateformes-sur-mesure" },
      image: { src: homeMedia.geolocation.secondary.src, alt: "Aperçu de démonstration d’une interface de supervision", width: homeMedia.geolocation.secondary.width, height: homeMedia.geolocation.secondary.height, position: "center" },
      caption: { title: "Plateformes sur mesure.", detail: "Interface de démonstration — indicateurs illustratifs." },
    },
  ],
} as const;

export const homEquipment = {
  eyebrow: "02 · Équipements",
  title: "Location et vente, selon le terrain.",
  link: { label: "Explorer les équipements", href: "/equipements" },
  tiles: [
    { id: "installation", title: "Installation et mise en service", src: `${homeImg}/hom-02-installation-generateur.webp`, alt: "Technicien ONLOUTOU contrôlant un groupe électrogène jaune", width: 1200, height: 675, position: "center 30%" },
    { id: "equipements", title: "Équipements professionnels", src: `${homeImg}/hom-03-equipements-professionnels.webp`, alt: "Coin d’équipements professionnels à Abidjan", width: 1200, height: 900, position: "center" },
    { id: "logistique", title: "Solutions logistiques", src: `${homeImg}/hom-04-solutions-logistiques.webp`, alt: "Camion plateau blanc et mini-pelle à Abidjan", width: 1200, height: 900, position: "center" },
    { id: "mobilite", title: "Mobilité professionnelle", src: `${homeImg}/hom-05-mobilite-professionnelle.webp`, alt: "Véhicules blancs dans une cour d’Abidjan", width: 1200, height: 900, position: "40% center" },
  ],
  quickLinks: [
    { label: "Véhicules", href: "/equipements/vehicules" },
    { label: "Motos", href: "/equipements/motos" },
    { label: "Camions & engins", href: "/equipements/camions-engins" },
    { label: "Outils & matériel", href: "/equipements/outils-materiels" },
  ],
  request: { prefix: "Un équipement particulier ?", label: "Décrivez votre besoin", href: "/equipements#orientation-equipement" },
};

export const homGeo = {
  eyebrow: "03 · Géolocalisation",
  titleLines: ["Géolocalisez vos actifs.", "Pilotez vos opérations."],
  titleMark: "opérations.",
  lead: "Position, événements et historique : une vue utile pour suivre vos véhicules et vos équipements.",
  cta: { label: "Découvrir l’offre GPS", href: "/solutions/geolocalisation" },
  note: "Fonctionnalités selon le matériel et le périmètre retenu.",
  tabs: [
    { id: "localiser", number: "01", title: "Localiser", text: "Consulter la position et la dernière remontée disponible." },
    { id: "suivre", number: "02", title: "Suivre", text: "Observer les déplacements et les activités." },
    { id: "alerter", number: "03", title: "Alerter", text: "Repérer les événements et les sorties de zone." },
    { id: "analyser", number: "04", title: "Analyser", text: "Consulter les historiques et les rapports." },
  ],
  panel: {
    title: "Supervision de flotte",
    badge: "DÉMONSTRATION",
    views: [
      { id: "carte", label: "Carte" },
      { id: "liste", label: "Liste" },
    ],
    listTitle: "Véhicules",
    vehicles: [
      { id: "v1", kind: "van", label: "Véhicule 1", status: "En activité", tone: "ok" },
      { id: "v2", kind: "excavator", label: "Véhicule 2", status: "À l’arrêt", tone: "idle" },
      { id: "v3", kind: "truck", label: "Véhicule 3", status: "En déplacement", tone: "move" },
    ],
    city: "Abidjan",
    lastPosition: { title: "Dernière position reçue", detail: "Véhicule de démonstration" },
    // Texte existant de l’accueil (donnée illustrative), repris pour l’onglet « Alerter ».
    alert: { title: "Sortie de zone détectée", detail: "Donnée illustrative" },
    footnote: "Interface illustrative — données et positions fictives.",
  },
} as const;

export const homGestures = {
  eyebrow: "Sur le terrain",
  title: "Les gestes derrière la technologie.",
  items: [
    { label: "Pose GPS", id: "raccordement" },
    { label: "Contrôle", id: "cablage" },
    { label: "Préparation", id: "depot" },
    { label: "Mobilité", id: "conducteur" },
    { label: "Installation", id: "generateur" },
    { label: "Coordination", id: "formation" },
  ].map((entry) => {
    const photo = terrainGalleryItems.find((item) => item.id === entry.id)!;
    return { label: entry.label, src: photo.src, alt: photo.alt, width: photo.width, height: photo.height, position: photo.objectPosition };
  }),
};

export const homMethod = {
  eyebrow: "04 · Terrain & méthode",
  title: "Du terrain à la supervision, chaque étape compte.",
  titleMark: "compte.",
  lead: "Nous préparons, installons et contrôlons les équipements, puis accompagnons leur prise en main.",
  cta: { label: "Découvrir notre méthode", href: "/expertise" },
  note: "Un accompagnement adapté au périmètre de votre projet.",
  emblem: terrainMethodIntro.emblem,
  steps: [
    { number: "01", title: "Cadrer le besoin", text: "Usage, contraintes et périmètre.", active: true },
    { number: "02", title: "Installer et paramétrer", text: "Déploiement et configuration.", active: false },
    { number: "03", title: "Contrôler et tester", text: "Vérifications avant mise en service.", active: false },
    { number: "04", title: "Former et accompagner", text: "Prise en main et suivi.", active: false },
  ],
};

export const homBuild = {
  eyebrow: "05 · Construire",
  title: "Plateformes et projets sur mesure.",
  titleMark: "sur mesure.",
  lead: "Des outils numériques conçus pour vos usages, vos équipes et vos opérations.",
  modulesTitle: "Exemples de modules à composer",
  modules: [
    { icon: "bars", title: "Tableaux de bord", text: "Une vue claire sur les informations utiles." },
    { icon: "bell", title: "Alertes", text: "Des événements définis selon vos besoins." },
    { icon: "doc", title: "Rapports", text: "Des exports et synthèses pour vos équipes." },
    { icon: "user", title: "Accès", text: "Des rôles adaptés aux responsabilités." },
    { icon: "puzzle", title: "Intégrations", text: "Des connexions avec vos outils existants." },
    { icon: "layers", title: "Opérations", text: "Le suivi de vos activités et interventions." },
  ],
  projects: { label: "Découvrez nos projets :", names: ["ChapeChape Résidence", "KPS Services", "APA", "OVPR"], note: "APA et OVPR : MVP · Sidsun : en développement" },
  cta: { label: "Explorer nos projets", href: "/projets" },
} as const;

const tabLabels: Record<string, string> = {
  mobilite: "Mobilité",
  installation: "Installation GPS",
  supervision: "Supervision",
  equipements: "Équipements",
  plateforme: "Plateformes",
};

export const homProjects = {
  eyebrow: "06 · Projets & terrains d’action",
  title: "Des projets construits pour le terrain.",
  titleMark: "terrain.",
  aside: "De la mobilité aux plateformes numériques, explorez nos domaines d’intervention.",
  link: { label: "Voir nos réalisations", href: "/projets" },
  items: projectShowcaseItems.map((item) => ({
    id: item.id,
    index: item.index,
    tab: tabLabels[item.id] ?? item.shortTitle,
    title: item.title,
    text: item.id === "mobilite" ? "Des moyens adaptés à vos usages et aux contraintes du terrain." : item.description,
    cta: "cta" in item ? { label: item.cta, href: item.href } : null,
    note: "note" in item ? item.note : null,
    src: item.src,
    alt: item.alt,
    width: item.width,
    height: item.height,
    position: item.objectPosition,
  })),
};

export const homRecognition = {
  eyebrow: "Repères historiques",
  title: "Parcours et distinctions",
  lead: "Des étapes qui ont marqué le développement d’ONLOUTOU.",
  cards: [
    { icon: "medal", title: "Fintech Challenge BCP", status: "LAURÉAT · 2019", tone: "gold" },
    { icon: "rosette", title: "Impact Camp", status: "SÉLECTION · 2019", tone: "sand" },
    { icon: "ribbon", title: "inwiDAYS", status: "FINALISTE · 2020", tone: "sand" },
    { icon: "ribbon", title: "Seedstars Abidjan", status: "PARTICIPATION · 2020", tone: "sand" },
  ],
  cta: { label: "Découvrir notre parcours", href: "/a-propos#parcours" },
  video: {
    title: "ONLOUTOU et le groupe BCP",
    detail: "Vidéo publiée par Banque Populaire du Maroc · 2019",
    link: { label: "Voir sur YouTube", href: "https://youtu.be/eAJDidNcANw" },
  },
} as const;

export const homCompany = {
  eyebrow: "07 · L’entreprise",
  title: "Une histoire née sur le terrain.",
  lead: "Depuis 2016, ONLOUTOU développe des réponses aux besoins d’équipement, de géolocalisation et de projets numériques.",
  facts: [
    { value: "2016", label: "Année de création" },
    { value: "Abidjan", label: "Notre ancrage" },
  ],
  text: "Découvrez notre parcours, nos équipes et les projets que nous construisons.",
  primary: { label: "Découvrir ONLOUTOU", href: "/a-propos" },
  team: { label: "Rencontrer l’équipe", href: "/a-propos#about-team" },
  canal: { title: "Reportage Canal · 3 min", detail: "Dans notre présentation", link: { label: "Découvrir le reportage", href: "/a-propos#reportage-canal" } },
  captionArchives: "Archives ONLOUTOU",
  /** Images déjà utilisées par la section « entreprise » de l’accueil précédent. */
  photos: [
    { ...homeMedia.about.facade, position: "center 52%" },
    { ...homeMedia.about.team, position: "center 18%" },
    { ...siteMedia.about.standExposition, position: "center 30%" },
  ],
};

export const homCta = {
  titleLines: ["Un équipement à trouver ?", "Un projet à faire avancer ?"],
  lead: "Présentez-nous votre besoin, nous étudierons la solution adaptée.",
  primary: { label: "Décrire mon besoin", href: "/contact" },
  whatsapp: { label: "Échanger sur WhatsApp", href: "https://wa.me/2250554137777" },
};