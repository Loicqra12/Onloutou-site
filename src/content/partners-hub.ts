/* Pages Partenaires — contenu de la refonte (textes repris des 2 écrans Figma).
   Les réponses de FAQ notées « rédigée » et le gabarit du message WhatsApp sont écrits ici
   (absents des maquettes) : à valider. */

import { whatsappUrlForMessage } from "@/content/contact-page";

export type PtnIconName =
  | "doc"
  | "check"
  | "arrowUpRight"
  | "arrowRight"
  | "arrowDown"
  | "chevronUp"
  | "chevronDown"
  | "pin"
  | "box"
  | "calendar"
  | "calendarCheck"
  | "user"
  | "mail"
  | "users"
  | "gear"
  | "laptop"
  | "share"
  | "wrench"
  | "grid"
  | "bolt"
  | "target"
  | "info"
  | "building"
  | "truck"
  | "chat"
  | "eye"
  | "phone"
  | "checklist"
  | "sliders"
  | "headset"
  | "home";

export type PtnImageId =
  | "fournisseurs"
  | "hero"
  | "livraison"
  | "technologie"
  | "terrain"
  | "espaceLivreur"
  | "espacePartenaire"
  | "proposition"
  | "drvColis"
  | "techHero"
  | "techDossier"
  | "supHero"
  | "supVehicules"
  | "supMotos"
  | "supEngins"
  | "supOutils"
  | "supTechniques"
  | "supAutres"
  | "supExemple"
  | "supBande"
  | "eslPhone"
  | "eslPhoto"
  | "espHero"
  | "espEchange"
  | "espAppel"
  | "dlHero"
  | "dlMoto"
  | "dlVoiture"
  | "dlUtilitaire"
  | "dlCamion"
  | "dlPlusieurs";

const base = "/assets/images/partners/partenaire";
const baseSub = "/assets/images/partners/fournisseur";
const baseSpace = "/assets/images/partners/space";

export const ptnImages: Record<PtnImageId, { src: string; width: number; height: number }> = {
  fournisseurs: { src: `${base}/ptn-01-fournisseurs-equipements.webp`, width: 1400, height: 706 },
  hero: { src: `${base}/ptn-02-hero-plan-technique.webp`, width: 1400, height: 650 },
  livraison: { src: `${base}/ptn-03-livraison-logistique.webp`, width: 1400, height: 909 },
  technologie: { src: `${base}/ptn-04-technologie-gps.webp`, width: 1400, height: 911 },
  terrain: { src: `${base}/ptn-05-prestations-terrain.webp`, width: 1068, height: 981 },
  espaceLivreur: { src: `${base}/ptn-06-espace-livreur.webp`, width: 1400, height: 931 },
  espacePartenaire: { src: `${base}/ptn-07-espace-partenaire.webp`, width: 1400, height: 832 },
  proposition: { src: `${base}/ptn-08-proposition.webp`, width: 1400, height: 749 },
  drvColis: { src: `${baseSub}/ptn-drv-01-remise-colis.webp`, width: 1400, height: 934 },
  techHero: { src: `${baseSub}/ptn-tech-01-hero-gps.webp`, width: 1400, height: 959 },
  techDossier: { src: `${baseSub}/ptn-tech-02-dossier-technique.webp`, width: 1400, height: 861 },
  supHero: { src: `${baseSub}/ptn-sup-01-hero-generateur.webp`, width: 1287, height: 1149 },
  supVehicules: { src: `${baseSub}/ptn-sup-02-vehicules-utilitaires.webp`, width: 1400, height: 760 },
  supMotos: { src: `${baseSub}/ptn-sup-03-motos-deux-roues.webp`, width: 1343, height: 1000 },
  supEngins: { src: `${baseSub}/ptn-sup-04-camions-engins.webp`, width: 1400, height: 877 },
  supOutils: { src: `${baseSub}/ptn-sup-05-outils-materiel.webp`, width: 1400, height: 869 },
  supTechniques: { src: `${baseSub}/ptn-sup-06-equipements-techniques.webp`, width: 1259, height: 987 },
  supAutres: { src: `${baseSub}/ptn-sup-07-autres-equipements.webp`, width: 1400, height: 666 },
  supExemple: { src: `${baseSub}/ptn-sup-08-exemple-groupe-electrogene.webp`, width: 1223, height: 951 },
  supBande: { src: `${baseSub}/ptn-sup-09-bandeau-proposition.webp`, width: 1400, height: 912 },
  eslPhone: { src: `${baseSpace}/ptn-spc-12-telephone-espace-livreur.webp`, width: 1118, height: 1308 },
  eslPhoto: { src: `${baseSpace}/ptn-spc-11-livreur-smartphone.webp`, width: 1400, height: 934 },
  espHero: { src: `${baseSpace}/ptn-spc-08-hero-espace-partenaire.webp`, width: 1347, height: 1102 },
  espEchange: { src: `${baseSpace}/ptn-spc-09-echange-tablette.webp`, width: 1400, height: 978 },
  espAppel: { src: `${baseSpace}/ptn-spc-10-coordinateur-appel.webp`, width: 1299, height: 974 },
  dlHero: { src: `${baseSpace}/ptn-spc-01-livreuse-scooter-camionnette.webp`, width: 1400, height: 903 },
  dlMoto: { src: `${baseSpace}/ptn-spc-02-moto.webp`, width: 1272, height: 1096 },
  dlVoiture: { src: `${baseSpace}/ptn-spc-03-voiture.webp`, width: 1400, height: 647 },
  dlUtilitaire: { src: `${baseSpace}/ptn-spc-04-utilitaire.webp`, width: 1400, height: 841 },
  dlCamion: { src: `${baseSpace}/ptn-spc-05-camion.webp`, width: 1400, height: 887 },
  dlPlusieurs: { src: `${baseSpace}/ptn-spc-06-plusieurs-vehicules.webp`, width: 1400, height: 531 },
};

/** Page de proposition = route existante (anciennement « Devenir partenaire »). */
export const ptnRoutes = {
  hub: "/partenaires",
  proposal: "/devenir-partenaire",
  proposalForm: "/devenir-partenaire#preparer-proposition",
  partnerSpacePreview: "/espace-partenaire#apercu-espace-partenaire",
  driverSpacePreview: "/espace-livreur#apercu-espace-livreur",
} as const;

export type PtnTypeId = "equipements" | "terrain" | "livraison" | "technologie";

/** Types de collaboration du formulaire (ordre de la maquette). */
export const ptnTypes: { id: PtnTypeId; label: string; text: string }[] = [
  { id: "equipements", label: "Fourniture d’équipements", text: "Proposer des équipements fiables et adaptés." },
  { id: "terrain", label: "Terrain & maintenance", text: "Réaliser des travaux, de l’installation ou de la maintenance." },
  { id: "livraison", label: "Livraison & logistique", text: "Appuyer les opérations de transport et de logistique." },
  { id: "technologie", label: "Technologie & autres", text: "Apporter des solutions numériques et d’autres expertises." },
];

export const ptnTypeIds = ptnTypes.map((type) => type.id) as readonly PtnTypeId[];

/** Lien d'une carte du hub : ouvre le formulaire avec le type présélectionné. */
export const ptnProposalHref = (type: PtnTypeId) => `${ptnRoutes.proposal}?type=${type}#preparer-proposition`;

/* ---------- /partenaires ---------- */

export const ptnHubHero = {
  eyebrow: "PARTENAIRES",
  titleLines: ["Votre savoir-faire.", "Nos projets", "communs."],
  lead: "Équipements, terrain, logistique ou technologie : trouvons la bonne façon de travailler ensemble.",
  primary: { label: "Proposer une collaboration", href: ptnRoutes.proposalForm },
  secondary: { label: "Trouver mon profil", href: "#profils-partenaires" },
  image: {
    id: "hero" as PtnImageId,
    alt: "Une responsable et un partenaire examinent un plan technique à côté d’un ordinateur portable",
  },
};

export const ptnProfiles = {
  id: "profils-partenaires",
  eyebrow: "COLLABORATIONS",
  title: "Quelle place souhaitez-vous prendre ?",
  items: [
    {
      id: "equipements" as PtnTypeId,
      title: "Fournisseurs d’équipements",
      text: "Proposez des équipements fiables et adaptés aux besoins de nos projets.",
      cta: "Proposer du matériel",
      image: "fournisseurs" as PtnImageId,
      alt: "Un pick-up blanc, une pelle et une chargeuse jaunes",
      scene: "yard",
    },
    {
      id: "livraison" as PtnTypeId,
      title: "Livraison & logistique",
      text: "Appuyez nos opérations avec des solutions de transport et de logistique sur tout le territoire.",
      cta: "Présenter mes capacités",
      image: "livraison" as PtnImageId,
      alt: "Un coordinateur logistique avec une tablette devant un camion blanc",
      scene: "street",
    },
    {
      id: "technologie" as PtnTypeId,
      title: "Technologie & intégration",
      text: "Apportez des solutions numériques et techniques pour améliorer nos opérations.",
      cta: "Proposer mon expertise",
      image: "technologie" as PtnImageId,
      alt: "Un technicien configure un boîtier GPS devant son ordinateur portable",
      scene: "office",
    },
    {
      id: "terrain" as PtnTypeId,
      title: "Prestations terrain",
      text: "Réalisez des travaux, de l’installation à la maintenance, avec des équipes qualifiées sur le terrain.",
      cta: "Présenter mon activité",
      image: "terrain" as PtnImageId,
      alt: "Un géomètre règle une station totale sur un chantier",
      scene: "site",
    },
  ],
};

export const ptnProcess = {
  id: "demarche",
  eyebrow: "NOTRE DÉMARCHE",
  title: "Une collaboration se construit.",
  steps: [
    { number: "01", title: "Présenter", text: "Votre activité, vos capacités et votre zone." },
    { number: "02", title: "Échanger", text: "Le besoin, le périmètre et les modalités." },
    { number: "03", title: "Formaliser", text: "Les conditions retenues avant de démarrer." },
  ],
  note: "Chaque proposition est étudiée ; son envoi ne vaut pas validation.",
};

export const ptnSpaces = {
  id: "espaces-partenaires",
  eyebrow: "OUTILS À VENIR",
  title: "Des espaces pour mieux collaborer.",
  lead: "Bientôt, des espaces dédiés pour simplifier vos propositions, suivre les échanges et faciliter la collaboration.",
  badge: "EN PRÉPARATION",
  items: [
    {
      id: "espace-partenaire",
      title: "Espace partenaire",
      text: "Soumettez vos propositions et suivez leur avancement.",
      cta: { label: "Voir l’aperçu", href: ptnRoutes.partnerSpacePreview },
      image: "espacePartenaire" as PtnImageId,
      alt: "Aperçu conceptuel de l’espace partenaire sur ordinateur portable et tablette",
    },
    {
      id: "espace-livreur",
      title: "Espace livreur",
      text: "Consultez vos missions et échangez avec vos équipes.",
      cta: { label: "Voir l’aperçu", href: ptnRoutes.driverSpacePreview },
      image: "espaceLivreur" as PtnImageId,
      alt: "Aperçu conceptuel de l’espace livreur sur smartphone, avec un livreur et un camion",
    },
  ],
  note: "Aperçus conceptuels, sans connexion ni données réelles.",
};

export const ptnBanner = {
  id: "capacite",
  eyebrow: "REJOIGNEZ-NOUS",
  title: "Une capacité à proposer ?",
  lead: "Que vous fournissiez, transportiez, installiez, intégriez ou accompagniez, partagez votre savoir-faire. Construisons ensemble des projets utiles.",
  cta: { label: "Préparer ma proposition", href: ptnRoutes.proposalForm },
};

/* ---------- /devenir-partenaire (« Proposer une collaboration ») ---------- */

export const ptnProposalHero = {
  breadcrumb: [
    { label: "Accueil", href: "/" },
    { label: "Partenaires", href: "/partenaires" },
    { label: "Proposer une collaboration" },
  ],
  titleLines: ["Présentez ce que", "vous pouvez apporter."],
  lead: "Votre activité, vos moyens et votre zone : les informations utiles pour commencer l’échange.",
  cta: { label: "Préparer ma proposition", href: "#preparer-proposition" },
  note: "Une prise de contact, sans inscription automatique.",
  image: {
    id: "proposition" as PtnImageId,
    alt: "Une responsable prépare une proposition de collaboration sur son ordinateur portable",
  },
};

export const ptnForm = {
  id: "preparer-proposition",
  title: "Votre proposition, en quelques points.",
  steps: ["Votre activité", "Votre proposition", "Vos coordonnées"],
  activity: {
    title: "Votre activité",
    typeLegend: "Quel type de collaboration proposez-vous ?",
    name: { label: "Nom ou organisation", placeholder: "" },
    zone: { label: "Zone d’intervention", placeholder: "Ville, communes ou régions" },
  },
  proposal: {
    title: "Votre proposition",
    description: { label: "Que souhaitez-vous proposer ?", placeholder: "Équipements, compétences, capacités disponibles..." },
    availability: { label: "Disponibilités", placeholder: "À préciser" },
    goal: { label: "Objectif de la collaboration", placeholder: "Votre attente" },
  },
  contact: {
    title: "Vos coordonnées",
    person: { label: "Personne à contacter", placeholder: "" },
    channel: { label: "Téléphone ou e-mail", placeholder: "" },
  },
  requiredNote: "Champs obligatoires",
  submit: "Enregistrer ma proposition",
  submitNote: "Relisez votre proposition avant de poursuivre sur WhatsApp.",
  error: "Merci de renseigner les champs obligatoires.",
  panel: {
    title: "Votre proposition",
    empty: "Votre résumé apparaîtra ici.",
    checklist: ["Une activité clairement décrite", "Une zone précisée", "Un contact pour échanger"],
    note: "L’envoi ne garantit pas une collaboration.",
  },
};

export type PtnFormValues = {
  type: PtnTypeId | "";
  name: string;
  zone: string;
  description: string;
  availability: string;
  goal: string;
  person: string;
  channel: string;
};

/** Message affiché dans le panneau et envoyé sur WhatsApp (gabarit rédigé, à valider). */
export function buildPtnMessage(values: PtnFormValues): string {
  const lines: string[] = [];
  const add = (label: string, value: string) => {
    const v = value.trim();
    if (v) lines.push(`${label} : ${v}`);
  };
  const type = ptnTypes.find((item) => item.id === values.type);
  add("Type de collaboration", type?.label ?? "");
  add("Nom ou organisation", values.name);
  add("Zone d’intervention", values.zone);
  add("Proposition", values.description);
  add("Disponibilités", values.availability);
  add("Objectif de la collaboration", values.goal);
  add("Personne à contacter", values.person);
  add("Téléphone ou e-mail", values.channel);
  if (lines.length === 0) return "";
  return ["Bonjour ONLOUTOU, je souhaite proposer une collaboration.", ...lines].join("\n");
}

export function buildPtnWhatsAppUrl(values: PtnFormValues): string {
  return whatsappUrlForMessage(buildPtnMessage(values));
}

/** État de la liste de contrôle du panneau. */
export function ptnChecklistState(values: PtnFormValues): [boolean, boolean, boolean] {
  return [
    values.type !== "" && values.description.trim() !== "",
    values.zone.trim() !== "",
    values.person.trim() !== "" && values.channel.trim() !== "",
  ];
}

export const ptnAfter = {
  title: "Et après votre prise de contact ?",
  steps: [
    { number: "01", title: "Lecture de votre proposition", text: "Nous prenons connaissance des informations transmises." },
    { number: "02", title: "Échange si le besoin correspond", text: "Nous revenons vers vous si votre proposition correspond à un projet." },
    { number: "03", title: "Conditions à définir ensemble", text: "Si l’échange se poursuit, les modalités sont précisées avec vous." },
  ],
};

export const ptnFaq = {
  title: "Questions fréquentes",
  items: [
    {
      question: "Quels documents préparer ?",
      answer: "Présentez d’abord votre activité. Les pièces utiles seront précisées selon le projet.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Ma proposition vaut-elle validation ?",
      answer:
        "Non. L’envoi ne garantit pas une collaboration. Nous prenons connaissance de votre proposition et revenons vers vous si elle correspond à un projet.",
    },
    {
      // rédigée (absente de la maquette)
      question: "Puis-je proposer plusieurs capacités ?",
      answer:
        "Oui. Choisissez le type de collaboration principal et décrivez vos autres capacités dans le champ « Que souhaitez-vous proposer ? ». Elles pourront être précisées lors de l’échange.",
    },
  ],
};