import { whatsappUrlForMessage } from "@/content/contact-page";
import type { CmeIconName } from "@/components/trucks/redesign/CmeIcon";

/* Contenu de la page Camions et engins — textes repris des écrans Figma. */

const imageBase = "/assets/images/equipment/engins";

export type CmeImageId =
  | "bulldozer"
  | "camion-conteneur"
  | "camion-benne-pelleteuse"
  | "camion-benne-levee"
  | "chargeuse-articulee"
  | "chariot-elevateur"
  | "chef-chantier-chargeuse"
  | "foreuse"
  | "groupe-engins-ouvriers"
  | "grue-nacelle"
  | "mini-pelle"
  | "pelle-chenilles"
  | "pelle-pneus"
  | "pelle-chenilles-godet"
  | "rouleau"
  | "tracteur"
  | "tractopelle";

/** Dimensions réelles des fichiers webp détourés. */
export const cmeImageSize: Record<CmeImageId, [number, number]> = {
  bulldozer: [900, 502],
  "camion-conteneur": [900, 563],
  "camion-benne-pelleteuse": [900, 504],
  "camion-benne-levee": [900, 712],
  "chargeuse-articulee": [900, 492],
  "chariot-elevateur": [900, 598],
  "chef-chantier-chargeuse": [1000, 674],
  foreuse: [829, 1468],
  "groupe-engins-ouvriers": [1800, 667],
  "grue-nacelle": [900, 709],
  "mini-pelle": [900, 589],
  "pelle-chenilles": [900, 631],
  "pelle-pneus": [900, 596],
  "pelle-chenilles-godet": [900, 609],
  rouleau: [900, 584],
  tracteur: [900, 519],
  tractopelle: [900, 528],
};

export const cmeImage = (id: CmeImageId) => `${imageBase}/${id}.webp`;

export const cmeSeo = {
  title: "Camions et engins professionnels en location ou acquisition",
  description:
    "ONLOUTOU étudie les besoins en camions, engins de chantier et équipements lourds selon la mission, le terrain, la durée, la zone et la disponibilité.",
};

export const cmeHero = {
  breadcrumb: [
    { label: "Accueil", href: "/" },
    { label: "Équipements", href: "/equipements" },
    { label: "Camions et engins" },
  ],
  titleLines: ["Camions, engins,", "moyens spécialisés.", "Votre projet"],
  titleUnderline: "donne la direction.",
  lead: ["Transport, chantier, levage, agriculture :", "décrivez l’équipement à louer, la mission", "et le lieu d’intervention."],
  image: {
    id: "groupe-engins-ouvriers" as CmeImageId,
    alt: "Pelle hydraulique, camion-benne et grue mobile sur un chantier, avec des ouvriers équipés.",
  },
  search: {
    whatLabel: "Quel camion ou engin recherchez-vous ?",
    whatPlaceholder: "Ex. camion benne, pelle mécanique...",
    whereLabel: "Lieu du projet",
    wherePlaceholder: "Ville ou commune",
    whenLabel: "Période",
    whenPlaceholder: "À préciser",
    submit: "Explorer",
    missing: "Un équipement spécifique ?",
    describe: "Décrivez votre besoin",
    note: "Disponibilités, capacités et conditions à confirmer.",
  },
};

export type CmeGroupId = "transport" | "terrassement" | "levage" | "all";
export type CmeCategoryId =
  | "transport"
  | "bennes"
  | "terrassement"
  | "levage"
  | "manutention"
  | "routes"
  | "agriculture"
  | "specialises";
export type CmeMissionId =
  | "terrassement"
  | "chargement"
  | "transport"
  | "evacuation"
  | "levage"
  | "manutention"
  | "compactage"
  | "agricole"
  | "forage";
export type CmeCapacityId = "compact" | "moyenne" | "lourde";

export const cmeCategoriesSection = {
  kicker: "Nos catégories",
  title: "Toutes les familles pour vos opérations.",
  banner: {
    title: "Votre besoin ne rentre pas dans une case ?",
    text: "Notre équipe vous accompagne pour trouver le camion ou l’engin adapté à votre projet.",
    cta: "Demander un camion ou un engin spécifique",
  },
};

export type CmeCategory = {
  id: CmeCategoryId;
  label: string;
  text: string;
  group: CmeGroupId;
  image: CmeImageId;
  alt: string;
  /** Dégradé de fond derrière le détourage (ciel + sol). */
  tone: "sky" | "sand" | "grey";
};

export const cmeCategories: CmeCategory[] = [
  { id: "transport", label: "Transport & logistique", text: "Camions plateaux, porteurs, tracteurs, citernes...", group: "transport", image: "camion-conteneur", alt: "Camion porteur blanc avec conteneur bleu", tone: "grey" },
  { id: "bennes", label: "Bennes & évacuation", text: "Camions bennes, bennes ampliroll, camions-grue...", group: "transport", image: "camion-benne-levee", alt: "Camion-benne blanc, benne levée", tone: "sand" },
  { id: "terrassement", label: "Terrassement", text: "Pelles mécaniques, chargeuses, bulldozers, niveleuses...", group: "terrassement", image: "pelle-chenilles-godet", alt: "Pelle sur chenilles jaune, godet baissé", tone: "sand" },
  { id: "levage", label: "Levage & travail en hauteur", text: "Grues mobiles, nacelles, chariots télescopiques...", group: "levage", image: "grue-nacelle", alt: "Grue mobile jaune avec nacelle élévatrice", tone: "sky" },
  { id: "manutention", label: "Manutention", text: "Chariots élévateurs, transpalettes, manutention tout terrain...", group: "levage", image: "chariot-elevateur", alt: "Chariot élévateur jaune et palette de blocs", tone: "grey" },
  { id: "routes", label: "Routes & compactage", text: "Compacteurs, finisseurs, équipements routiers...", group: "all", image: "rouleau", alt: "Rouleau compresseur jaune", tone: "grey" },
  { id: "agriculture", label: "Agriculture & travaux ruraux", text: "Tracteurs, remorques, broyeurs, équipements agricoles...", group: "all", image: "tracteur", alt: "Tracteur agricole vert avec faucheuse rouge", tone: "sky" },
  { id: "specialises", label: "Engins spécialisés", text: "Rigs de forage, brise-roches, équipements sur mesure...", group: "all", image: "foreuse", alt: "Foreuse rotative jaune sur chenilles", tone: "sand" },
];

export const cmeCategoryById = (id: CmeCategoryId) => cmeCategories.find((c) => c.id === id)!;

export const cmeMissions: { id: CmeMissionId; label: string }[] = [
  { id: "terrassement", label: "Terrassement" },
  { id: "chargement", label: "Chargement" },
  { id: "transport", label: "Transport" },
  { id: "evacuation", label: "Évacuation" },
  { id: "levage", label: "Levage" },
  { id: "manutention", label: "Manutention" },
  { id: "compactage", label: "Compactage" },
  { id: "agricole", label: "Travaux agricoles" },
  { id: "forage", label: "Forage" },
];

export const cmeCapacities: { id: CmeCapacityId; label: string }[] = [
  { id: "compact", label: "Compact" },
  { id: "moyenne", label: "Moyenne" },
  { id: "lourde", label: "Lourde" },
];

export const cmeZones = ["Abidjan", "Grand Abidjan", "Intérieur du pays"];
export const cmePeriods = ["Immédiate", "Cette semaine", "Ce mois-ci", "À planifier"];

export const cmeCatalog = {
  id: "profils-camions-engins",
  title: "À chaque opération, le bon équipement.",
  lead: "Explorez les types de matériels puis précisez les caractéristiques utiles à votre projet.",
  searchPlaceholder: "Rechercher : benne, grue, pelle, tracteur...",
  searchLabel: "Rechercher un camion ou un engin",
  filters: { family: "Famille", mission: "Mission", capacity: "Capacité recherchée", zone: "Zone", period: "Période" },
  groups: [
    { id: "transport" as CmeGroupId, label: "Transport", icon: "truck" as CmeIconName },
    { id: "terrassement" as CmeGroupId, label: "Terrassement", icon: "excavator" as CmeIconName },
    { id: "levage" as CmeGroupId, label: "Levage", icon: "crane" as CmeIconName },
    { id: "all" as CmeGroupId, label: "Toutes les familles", icon: "grid" as CmeIconName },
  ],
  capacityPending: "Capacité à préciser",
  add: "Ajouter à ma demande",
  added: "Ajouté à ma demande",
  note: "Types présentés à titre indicatif — modèles et disponibilité sur demande.",
  empty: "Aucun type ne correspond à ces filtres. Décrivez votre besoin, nous l’étudions.",
  reset: "Réinitialiser les filtres",
};

export type CmeProduct = {
  id: string;
  name: string;
  text: string;
  category: CmeCategoryId;
  image: CmeImageId;
  alt: string;
  missions: CmeMissionId[];
  capacity: CmeCapacityId;
};

export const cmeProducts: CmeProduct[] = [
  { id: "mini-pelle", name: "Mini-pelle", text: "Accès contraints et petits terrassements.", category: "terrassement", image: "mini-pelle", alt: "Mini-pelle jaune sur chenilles", missions: ["terrassement"], capacity: "compact" },
  { id: "pelle-chenilles", name: "Pelle sur chenilles", text: "Excavation et travaux de terrain.", category: "terrassement", image: "pelle-chenilles", alt: "Pelle hydraulique jaune sur chenilles", missions: ["terrassement", "chargement"], capacity: "moyenne" },
  { id: "pelle-pneus", name: "Pelle sur pneus", text: "Interventions et mobilité sur site.", category: "terrassement", image: "pelle-pneus", alt: "Pelle hydraulique jaune sur pneus", missions: ["terrassement"], capacity: "moyenne" },
  { id: "chargeuse", name: "Chargeuse", text: "Chargement et déplacement de matériaux.", category: "terrassement", image: "chargeuse-articulee", alt: "Chargeuse articulée jaune au godet bas", missions: ["chargement", "terrassement"], capacity: "moyenne" },
  { id: "tractopelle", name: "Tractopelle", text: "Terrassement et manutention.", category: "terrassement", image: "tractopelle", alt: "Tractopelle jaune", missions: ["terrassement", "manutention"], capacity: "moyenne" },
  { id: "bulldozer", name: "Bulldozer", text: "Poussée et préparation de terrain.", category: "terrassement", image: "bulldozer", alt: "Bulldozer jaune à chenilles", missions: ["terrassement"], capacity: "lourde" },
  { id: "camion-conteneur", name: "Camion porte-conteneur", text: "Transport de conteneurs et de charges lourdes.", category: "transport", image: "camion-conteneur", alt: "Camion porte-conteneur blanc et bleu", missions: ["transport"], capacity: "lourde" },
  { id: "camion-benne", name: "Camion-benne", text: "Évacuation de déblais et de matériaux.", category: "bennes", image: "camion-benne-levee", alt: "Camion-benne blanc, benne levée", missions: ["evacuation", "transport"], capacity: "lourde" },
  { id: "camion-benne-pelle", name: "Camion-benne et pelle", text: "Chargement et évacuation sur le même chantier.", category: "bennes", image: "camion-benne-pelleteuse", alt: "Camion-benne blanc et pelleteuse jaune", missions: ["evacuation", "chargement"], capacity: "lourde" },
  { id: "grue-mobile", name: "Grue mobile avec nacelle", text: "Levage et travail en hauteur.", category: "levage", image: "grue-nacelle", alt: "Grue mobile jaune avec nacelle élévatrice", missions: ["levage"], capacity: "lourde" },
  { id: "chariot-elevateur", name: "Chariot élévateur", text: "Manutention de palettes et de charges.", category: "manutention", image: "chariot-elevateur", alt: "Chariot élévateur jaune et palette", missions: ["manutention"], capacity: "compact" },
  { id: "rouleau", name: "Rouleau compresseur", text: "Compactage de voiries et de plateformes.", category: "routes", image: "rouleau", alt: "Rouleau compresseur jaune", missions: ["compactage"], capacity: "moyenne" },
  { id: "tracteur", name: "Tracteur agricole", text: "Travaux agricoles et ruraux.", category: "agriculture", image: "tracteur", alt: "Tracteur agricole vert avec faucheuse rouge", missions: ["agricole"], capacity: "moyenne" },
  { id: "foreuse", name: "Foreuse rotative", text: "Forage et fondations.", category: "specialises", image: "foreuse", alt: "Foreuse rotative jaune sur chenilles", missions: ["forage"], capacity: "lourde" },
];

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export type CmeFilter = {
  query: string;
  group: CmeGroupId;
  category: CmeCategoryId | null;
  mission: CmeMissionId | "";
  capacity: CmeCapacityId | "";
};

export function cmeFilterProducts(f: CmeFilter): CmeProduct[] {
  const q = norm(f.query.trim());
  return cmeProducts.filter((p) => {
    if (f.mission && !p.missions.includes(f.mission)) return false;
    if (f.capacity && p.capacity !== f.capacity) return false;
    if (q) {
      const hay = norm(
        [p.name, p.text, cmeCategoryById(p.category).label, ...p.missions.map((m) => cmeMissions.find((x) => x.id === m)?.label ?? "")].join(" "),
      );
      return q.split(/\s+/).every((w) => hay.includes(w));
    }
    if (f.category) return p.category === f.category;
    if (f.group === "all") return true;
    return cmeCategoryById(p.category).group === f.group;
  });
}

export const cmeMission = {
  id: "mission-engin",
  title: ["Précisez la mission.", "Nous affinons", "le choix."],
  text: ["Charge, portée, hauteur, accès", "et état du sol orientent", "la sélection."],
  image: { id: "chef-chantier-chargeuse" as CmeImageId, alt: "Chef de chantier en gilet ONLOUTOU consultant un plan devant une chargeuse." },
  card: {
    title: "Votre projet en quelques détails.",
    mission: "Mission",
    terrain: "Terrain",
    terrainPlaceholder: "À préciser",
    terrains: ["Terrain meuble", "Terrain rocheux", "Sol urbain ou revêtu", "Accès difficile ou étroit"],
    capacity: "Capacité recherchée",
    capacityPlaceholder: "Décrivez votre besoin",
    operator: "Opérateur",
    operators: [
      { id: "avec", label: "Avec" },
      { id: "sans", label: "Sans" },
      { id: "etudier", label: "À étudier" },
    ],
    submit: "Configurer ma demande",
    applied: "Configuration ajoutée à votre demande. Complétez-la ci-dessous.",
  },
  banner: {
    title: "Vous connaissez le travail à réaliser, mais pas l’engin ?",
    text: "Décrivez l’opération ou joignez une photo du site.",
    cta: "Être accompagné dans mon choix",
  },
};

export const cmeForm = {
  id: "demande-camion-engin",
  titleBefore: "Préparons",
  titleAfter: " votre demande de location.",
  lead: "Un camion, un engin ou plusieurs moyens pour la même opération.",
  blocks: [
    { n: "01", title: "Équipement et mission", text: "Décrivez le matériel et l’objectif de votre opération." },
    { n: "02", title: "Terrain et période", text: "Où et quand se déroule votre projet ?" },
    { n: "03", title: "Services souhaités", text: "Précisez les services complémentaires." },
    { n: "04", title: "Contact", text: "Vos coordonnées pour vous recontacter." },
  ],
  equipmentLabel: "Matériel recherché",
  equipmentPlaceholder: "Ex. benne, grue, pelle...",
  quantityLabel: "Quantité",
  addAnother: "Ajouter un autre équipement",
  remove: "Retirer cet équipement",
  descriptionLabel: "Description de l’opération",
  descriptionPlaceholder: "Ex. chargement de déchets, terrassement, levage sur chantier...",
  capacityLabel: "Capacité recherchée",
  capacityOptional: " (si connue)",
  capacityPlaceholder: "Ex. 20 m³, 10 tonnes, 30 m...",
  placeLabel: "Ville ou site",
  placePlaceholder: "Ex. Abidjan, Yopougon...",
  startLabel: "Date de début",
  startPlaceholder: "JJ/MM/AAAA",
  durationLabel: "Durée",
  durationPlaceholder: "Ex. 1 semaine...",
  accessLabel: "Accès et contraintes",
  accessOptional: " (facultatif)",
  accessPlaceholder: "Ex. état des routes, hauteur sous plafond, espace disponible...",
  services: [
    { id: "operateur", label: "Avec opérateur", icon: "helmet" as CmeIconName },
    { id: "transport", label: "Transport sur site", icon: "truck" as CmeIconName },
    { id: "assistance", label: "Assistance", icon: "wrench" as CmeIconName },
    { id: "etudier", label: "À étudier", icon: "file" as CmeIconName },
  ],
  nameLabel: "Nom ou entreprise",
  namePlaceholder: "Ex. Nom, entreprise...",
  phoneLabel: "Téléphone",
  phonePlaceholder: "Ex. 05 54 13 77 77",
  emailLabel: "E-mail",
  emailOptional: " (facultatif)",
  emailPlaceholder: "Ex. vous@exemple.ci",
  fileLabel: "Photo du site ou document technique",
  fileOptional: " — facultatif",
  fileHint: "Glissez un fichier ici ou cliquez pour parcourir",
  fileFormats: "JPG, PNG ou PDF",
  fileMax: "Max. 10 Mo",
  maxFileBytes: 10 * 1024 * 1024,
  submit: "Enregistrer ma demande",
  submitNote: "Vérifiez votre récapitulatif avant l’envoi.",
};

export const cmeSummary = {
  title: "Votre projet",
  lead: "Voici un récapitulatif de votre demande.",
  rows: [
    { id: "equipment", label: "Équipements", icon: "truck" as CmeIconName },
    { id: "mission", label: "Mission", icon: "report" as CmeIconName },
    { id: "place", label: "Lieu", icon: "pin" as CmeIconName },
    { id: "period", label: "Période", icon: "calendar" as CmeIconName },
  ],
  empty: "Non précisé",
  image: { id: "camion-benne-pelleteuse" as CmeImageId, alt: "Camion-benne blanc chargé par une pelle, sous les palmiers." },
  noteTitle: "Devis et disponibilité après étude.",
  noteText: "Chaque demande est analysée par notre équipe pour vous proposer une solution adaptée à votre projet, à votre site et à vos contraintes.",
};

export const cmeConditions = {
  title: "Les conditions, précisées avant de confirmer.",
  lead: "Les principaux éléments étudiés et validés dans notre proposition.",
  note: "Seule la proposition validée fixe les prestations et conditions retenues.",
  cards: [
    {
      title: "Équipement & mission",
      text: "Détails du matériel et de l’usage prévu.",
      image: "camion-benne-pelleteuse" as CmeImageId,
      alt: "Camion-benne blanc",
      rows: [
        { icon: "helmet" as CmeIconName, label: "Catégorie", text: "Type d’engin ou de véhicule" },
        { icon: "car" as CmeIconName, label: "Modèle", text: "Selon disponibilité" },
        { icon: "gauge" as CmeIconName, label: "Capacité", text: "À confirmer selon le besoin" },
        { icon: "box" as CmeIconName, label: "Quantité", text: "Selon votre demande" },
        { icon: "shieldCheck" as CmeIconName, label: "État", text: "Matériel contrôlé et opérationnel" },
      ],
    },
    {
      title: "Exploitation & services",
      text: "Conditions d’utilisation et services associés.",
      image: "pelle-chenilles" as CmeImageId,
      alt: "Pelle hydraulique jaune sur chenilles",
      rows: [
        { icon: "userCog" as CmeIconName, label: "Opérateur", text: "Avec ou sans opérateur" },
        { icon: "truck" as CmeIconName, label: "Transport", text: "Sur site selon besoin" },
        { icon: "fuel" as CmeIconName, label: "Carburant", text: "Selon type de prestation" },
        { icon: "wrench" as CmeIconName, label: "Maintenance", text: "Matériel suivi et entretenu" },
        { icon: "shield" as CmeIconName, label: "Sécurité", text: "Conforme aux normes en vigueur" },
        { icon: "info" as CmeIconName, label: "Responsabilités", text: "Définies dans la proposition" },
      ],
    },
    {
      title: "Durée & budget",
      text: "Périmètre et conditions financières.",
      image: "rouleau" as CmeImageId,
      alt: "Rouleau compresseur jaune",
      rows: [
        { icon: "calendar" as CmeIconName, label: "Période", text: "Dates et durée d’utilisation" },
        { icon: "coin" as CmeIconName, label: "Prix", text: "Selon la solution proposée" },
        { icon: "report" as CmeIconName, label: "Taxes", text: "Selon la réglementation en vigueur" },
        { icon: "shield" as CmeIconName, label: "Assurances", text: "Selon le type d’équipement" },
        { icon: "shieldCheck" as CmeIconName, label: "Garanties", text: "Selon les conditions définies" },
        { icon: "file" as CmeIconName, label: "Restitution", text: "Modalités précisées dans l’offre" },
      ],
    },
  ],
};

export const cmeSteps = {
  title: "Comment ça marche ?",
  items: [
    { n: 1, icon: "file" as CmeIconName, title: "Décrire", text: "Renseignez votre besoin en quelques minutes." },
    { n: 2, icon: "search" as CmeIconName, title: "Étudier", text: "Notre équipe analyse votre demande." },
    { n: 3, icon: "clipboard" as CmeIconName, title: "Proposer", text: "Vous recevez une solution adaptée avec les conditions." },
    { n: 4, icon: "check" as CmeIconName, title: "Confirmer", text: "Vous validez la proposition pour lancer la location." },
  ],
};

export const cmeFaq = {
  title: "Questions fréquentes.",
  items: [
    {
      question: "Puis-je demander un engin non présenté ?",
      answer: "Oui, décrivez le type d’engin ou la mission. Nous étudierons les possibilités et les conditions.",
    },
    {
      question: "L’opérateur et le transport sont-ils inclus ?",
      answer: "Ils sont proposés selon la prestation : avec ou sans opérateur, transport sur site selon besoin. Tout est précisé dans la proposition.",
    },
    {
      question: "Peut-on réunir plusieurs équipements ?",
      answer: "Oui. Ajoutez-les à votre demande ou décrivez-les dans le formulaire : nous étudions l’ensemble pour la même opération.",
    },
    {
      question: "Les tarifs sont-ils affichés ?",
      answer: "Non. Le tarif et la disponibilité sont communiqués sur proposition, après étude de votre projet.",
    },
    {
      question: "Quels documents puis-je joindre ?",
      answer: "Une photo du site ou un document technique au format JPG, PNG ou PDF (10 Mo maximum).",
    },
  ],
};

export const cmeBand = {
  title: "Un projet complexe ?",
  text: " Échangeons sur vos besoins.",
  cta: "Parler à l’équipe",
};

export type CmeRequestFields = {
  items: string[];
  quantity: number;
  mission: string;
  terrain: string;
  capacity: string;
  description: string;
  place: string;
  start: string;
  duration: string;
  period: string;
  access: string;
  operator: string;
  services: string[];
  fileName: string;
  name: string;
  phone: string;
  email: string;
};

export function buildCmeMessage(f: CmeRequestFields) {
  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite recevoir une proposition pour une location de camion ou d’engin.",
    "",
    `Équipement : ${f.items.length ? f.items.join(" ; ") : "à préciser"}`,
    `Quantité : ${f.quantity}`,
    `Mission : ${f.mission || "à préciser"}`,
  ];
  if (f.terrain) lines.push(`Terrain : ${f.terrain}`);
  lines.push(`Capacité recherchée : ${f.capacity || "à préciser"}`);
  if (f.description) lines.push(`Description : ${f.description}`);
  lines.push(
    `Lieu : ${f.place || "à préciser"}`,
    `Début : ${f.start || f.period || "à préciser"}`,
    `Durée : ${f.duration || "à préciser"}`,
  );
  if (f.access) lines.push(`Accès et contraintes : ${f.access}`);
  if (f.operator) lines.push(`Opérateur : ${f.operator}`);
  lines.push(`Services souhaités : ${f.services.length ? f.services.join(", ") : "à déterminer"}`);
  if (f.fileName) lines.push(`Pièce jointe (à envoyer dans la conversation) : ${f.fileName}`);
  if (f.name) lines.push("", `Nom : ${f.name}`);
  if (f.phone) lines.push(`Téléphone : ${f.phone}`);
  if (f.email) lines.push(`E-mail : ${f.email}`);
  return lines.join("\n");
}

export const cmeWhatsappUrl = (f: CmeRequestFields) => whatsappUrlForMessage(buildCmeMessage(f));
