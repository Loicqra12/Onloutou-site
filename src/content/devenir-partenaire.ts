export const dpImg = "/assets/images/devenirpartner";

export const dpPaths = {
  landing: "/devenir-partenaire",
  entry: "/espace-partenaire",
  login: "/espace-partenaire/connexion",
  register: "/espace-partenaire/inscription",
  home: "/espace-partenaire/accueil",
  articles: "/espace-partenaire/articles",
  requests: "/espace-partenaire/demandes",
  account: "/espace-partenaire/compte",
  password: "/espace-partenaire/mot-de-passe",
  passwordNew: "/espace-partenaire/mot-de-passe/nouveau",
  verify: "/espace-partenaire/verification",
} as const;

export const dpLandingSeo = {
  title: "Devenir partenaire",
  description:
    "Proposez vos articles à la location sur ONLOUTOU\u00a0: électroménager, mobilier, informatique, réception ou matériel professionnel.",
};

export const dpBreadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Devenir partenaire" },
];

export const dpHero = {
  badge: "ESPACE PARTENAIRE",
  title: "Vos articles ont une place sur ONLOUTOU.",
  lead: "Électroménager, mobilier, informatique, réception ou matériel professionnel\u00a0: proposez vos articles à la location.",
  primary: { label: "Créer mon compte partenaire", href: "/espace-partenaire/inscription" },
  secondary: { label: "Me connecter", href: "/espace-partenaire/connexion" },
  note: "Vous préparez vos fiches. ONLOUTOU les vérifie avant publication.",
  image: {
    file: "01_devenir_partenaire_photo_principale.png",
    webp: "01_devenir_partenaire_photo_principale.webp",
    width: 858,
    height: 488,
    alt: "Professionnelle souriante, une tablette à la main, dans un intérieur avec un réfrigérateur, un ordinateur portable et une poussette.",
  },
};

export const dpPillars = [
  {
    id: "familles",
    title: "Un compte, plusieurs familles",
    text: "Proposez différents types d’articles sur un même compte.",
    icon: "laptop" as const,
  },
  {
    id: "conditions",
    title: "Vos conditions de location",
    text: "Fixez vos tarifs, disponibilités et modalités.",
    icon: "sliders" as const,
  },
  {
    id: "suivi",
    title: "Un suivi au même endroit",
    text: "Gérez vos articles, demandes et locations depuis votre espace.",
    icon: "calendar" as const,
  },
];

export const dpStepsTitle = "Du premier article à la première demande.";

export const dpSteps = [
  {
    id: "compte",
    number: "01",
    title: "Créez votre compte",
    text: "Renseignez vos informations et complétez votre profil.",
    icon: "user" as const,
  },
  {
    id: "preparer",
    number: "02",
    title: "Préparez vos articles",
    text: "Ajoutez vos articles avec des photos claires et des détails précis.",
    icon: "box" as const,
  },
  {
    id: "valider",
    number: "03",
    title: "Faites valider vos fiches",
    text: "Nos équipes vérifient vos articles pour une mise en ligne fiable.",
    icon: "doc" as const,
  },
  {
    id: "repondre",
    number: "04",
    title: "Répondez aux demandes",
    text: "Recevez des demandes de location et confirmez celles que vous convenez.",
    icon: "calendar" as const,
  },
];

export const dpFamiliesTitle = "Du quotidien aux besoins professionnels.";

export const dpFamilyCards = [
  {
    id: "electromenager",
    title: "Électroménager",
    href: "/articles/electromenager",
    image: {
      file: "08_famille_electromenager.png",
      webp: "08_famille_electromenager.webp",
      width: 1536,
      height: 1024,
      alt: "Professionnelle ouvrant un réfrigérateur dans un espace d’électroménager.",
    },
  },
  {
    id: "informatique",
    title: "Informatique & téléphonie",
    href: "/articles/informatique",
    image: {
      file: "09_famille_informatique.png",
      webp: "09_famille_informatique.webp",
      width: 1536,
      height: 1024,
      alt: "Professionnel devant un ordinateur portable, un téléphone à côté, dans un magasin d’électronique.",
    },
  },
  {
    id: "mobilier",
    title: "Mobilier & décoration",
    href: "/articles/mobilier",
    image: {
      file: "10_famille_mobilier.png",
      webp: "10_famille_mobilier.webp",
      width: 1536,
      height: 1024,
      alt: "Salon contemporain avec un canapé, un coussin jaune et un vase de fleurs.",
    },
  },
  {
    id: "reception",
    title: "Réception & événementiel",
    href: "/articles/reception",
    image: {
      file: "11_famille_reception.png",
      webp: "11_famille_reception.webp",
      width: 1536,
      height: 1024,
      alt: "Serveur dressant une table de réception en terrasse.",
    },
  },
];

/** Chips 01B. Identifiant canonique «\u00a0enfance\u00a0»\u00a0; l’ancien id «\u00a0bebe\u00a0» est correspondance uniquement. */
export const dpFamilyChips = [
  { id: "enfance", label: "Bébé & enfance", href: "/articles/enfance", icon: "stroller" as const },
  { id: "vehicules", label: "Véhicules", href: "/equipements/vehicules", icon: "van" as const },
  { id: "camions-engins", label: "Camions & engins", href: "/equipements/camions-engins", icon: "excavator" as const },
  { id: "motos", label: "Motos", href: "/equipements/motos", icon: "moto" as const },
  { id: "outils-materiel", label: "Outils & matériel", href: "/equipements/outils-materiels", icon: "tools" as const },
  { id: "equipements-connectes", label: "Équipements connectés", href: "/equipements/equipements-connectes", icon: "connected" as const },
];

export const dpDifferent = {
  label: "Mon article est différent",
  href: "/contact?need=partenariat",
};

export const dpFaq = {
  items: [
    {
      id: "plusieurs",
      question: "Puis-je proposer plusieurs types d’articles\u00a0?",
      answer: "Oui. Un seul compte vous permet de proposer des articles dans plusieurs familles.",
    },
    {
      id: "visible",
      question: "Quand mon article devient-il visible\u00a0?",
      // Rédigé (réponse absente de la maquette, alignée sur le cahier des charges).
      answer:
        "Après validation par ONLOUTOU. Une fiche en brouillon ou en cours de vérification n’apparaît pas encore au public.",
    },
    {
      id: "locations",
      question: "Comment sont confirmées les locations\u00a0?",
      // Rédigé (réponse absente de la maquette, alignée sur le cahier des charges).
      answer:
        "Une demande reçue ou une réponse de votre part ne crée pas automatiquement une réservation. Vous confirmez, proposez un ajustement ou déclinez depuis votre espace, lorsque cette fonction sera disponible.",
    },
  ],
};

export const dpClosing = {
  title: "Prêt à proposer votre premier article\u00a0?",
  primary: { label: "Créer mon compte", href: "/espace-partenaire/inscription" },
  already: "Déjà partenaire\u00a0?",
  loginLabel: "Me connecter",
  loginHref: "/espace-partenaire/connexion",
};

export const homeOfferArticles = {
  id: "proposer-mes-articles",
  title: "Vous avez des articles à louer\u00a0?",
  lead: "Un réfrigérateur, des chaises, un ordinateur ou un engin\u00a0: proposez vos articles sur ONLOUTOU.",
  cta: { label: "Devenir partenaire", href: "/devenir-partenaire" },
};

export const dpEntry = {
  seo: {
    title: "Espace partenaire",
    description: "Créez votre compte partenaire, connectez-vous ou accédez à votre espace ONLOUTOU.",
  },
  badge: "ESPACE PARTENAIRE",
  title: "Votre espace pour proposer vos articles.",
  lead: "Un compte pour préparer vos fiches, suivre les demandes et échanger avec ONLOUTOU.",
  create: { label: "Créer mon compte", href: "/espace-partenaire/inscription" },
  login: { label: "Me connecter", href: "/espace-partenaire/connexion" },
  access: { label: "Accéder à mon espace", href: "/espace-partenaire/accueil" },
  image: {
    file: "01_devenir_partenaire_photo_principale.png",
    webp: "01_devenir_partenaire_photo_principale.webp",
    width: 858,
    height: 488,
    alt: "Professionnelle souriante, une tablette à la main, dans un intérieur avec un réfrigérateur, un ordinateur portable et une poussette.",
  },
};

export const dpAuth = {
  back: "Retour au site",
  login: {
    title: "Heureux de vous retrouver.",
    lead: "Connectez-vous pour gérer vos articles et vos demandes.",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.com",
    password: "Mot de passe",
    forgot: "Mot de passe oublié\u00a0?",
    submit: "Me connecter",
    newbie: "Vous débutez sur ONLOUTOU\u00a0?",
    create: "Créer mon compte partenaire",
    help: "Besoin d’aide\u00a0?",
    helpLink: "Contacter ONLOUTOU",
    helpHref: "/contact",
    caption: "Vos articles. Vos demandes. Votre espace.",
    kicker: "ESPACE PARTENAIRE",
    image: {
      file: "02_connexion_partenaire_photo.png",
      webp: "02_connexion_partenaire_photo.webp",
      width: 644,
      height: 691,
      alt: "Professionnelle en tablier consultant une tablette dans un atelier, près d’un réfrigérateur et d’un ordinateur portable.",
    },
    legal: {
      privacy: { label: "Confidentialité", href: "/confidentialite" },
      terms: { label: "Conditions", href: "/conditions-utilisation" },
    },
  },
  register: {
    title: "Créer mon compte",
    already: "Déjà inscrit\u00a0?",
    login: "Me connecter",
    name: "Nom et prénom",
    namePlaceholder: "Votre nom complet",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.com",
    password: "Mot de passe",
    passwordPlaceholder: "Créer un mot de passe",
    passwordHint: "Choisissez un mot de passe unique.",
    // Pas de page «\u00a0conditions partenaires\u00a0»\u00a0: libellé exact demandé, liens vers les textes existants.
    terms: "J’accepte les conditions d’utilisation et j’ai lu la politique de confidentialité",
    termsCguHref: "/conditions-utilisation",
    termsPrivacyHref: "/confidentialite",
    submit: "Créer mon compte",
    after: "Vous pourrez ensuite compléter votre profil et préparer votre premier article.",
    help: "Besoin d’aide\u00a0?",
    helpLink: "Contactez-nous",
    helpHref: "/contact",
    introTitle: "Un compte pour tous vos articles.",
    introLead: "Préparez vos fiches et retrouvez vos demandes au même endroit.",
    bullets: [
      "Plusieurs familles, un seul compte",
      "Des brouillons à compléter à votre rythme",
      "Validation avant publication",
    ],
    photos: [
      {
        file: "03_inscription_refrigerateur.png",
        webp: "03_inscription_refrigerateur.webp",
        width: 373,
        height: 207,
        alt: "Homme souriant à côté d’un réfrigérateur inox.",
      },
      {
        file: "04_inscription_ordinateur.png",
        webp: "04_inscription_ordinateur.webp",
        width: 358,
        height: 207,
        alt: "Femme travaillant sur un ordinateur portable en terrasse.",
      },
      {
        file: "05_inscription_mobilier.png",
        webp: "05_inscription_mobilier.webp",
        width: 373,
        height: 199,
        alt: "Homme présentant un fauteuil jaune dans un salon.",
      },
      {
        file: "06_inscription_vaisselle.png",
        webp: "06_inscription_vaisselle.webp",
        width: 358,
        height: 199,
        alt: "Femme souriante devant un service de vaisselle blanche.",
      },
    ],
  },
};

export const dpPassword = {
  requestTitle: "Mot de passe oublié\u00a0?",
  requestLead: "Indiquez l’adresse e-mail de votre compte. Si l’envoi est disponible, vous recevrez un lien pour choisir un nouveau mot de passe.",
  submit: "Envoyer le lien",
  back: "Retour à la connexion",
  newTitle: "Choisir un nouveau mot de passe",
  newLead: "Le mot de passe doit contenir au moins 10 caractères.",
  newSubmit: "Enregistrer le mot de passe",
  expiredTitle: "Lien expiré ou invalide",
  expiredLead: "Ce lien n’est plus valable. Vous pouvez en demander un nouveau.",
  resend: "Demander un nouvel envoi",
  doneTitle: "Mot de passe mis à jour",
  doneLead: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
};

export const dpVerify = {
  pendingTitle: "Vérifiez votre adresse e-mail",
  pendingLead: "La vérification de l’adresse et l’approbation de votre profil partenaire sont deux étapes distinctes. Vous pouvez déjà compléter votre profil.",
  resend: "Renvoyer l’e-mail",
  verifiedTitle: "Adresse vérifiée",
  verifiedLead: "Votre e-mail est confirmé. L’équipe ONLOUTOU examinera votre profil lorsqu’il sera complet et transmis.",
  expiredTitle: "Lien de vérification expiré",
  expiredLead: "Ce lien n’est plus valable. Demandez un nouvel envoi pour vérifier votre adresse.",
  continue: "Continuer vers mon espace",
};

export const dpSpace = {
  badge: "ESPACE PARTENAIRE",
  seeSite: "Voir le site",
  welcome: "Bienvenue, {name}.",
  welcomeLead: "Préparons votre premier article.",
  breadcrumbHome: "Accueil",
  spaceRoot: "Mon espace",
  prepare: "Préparer un article",
  bannerTitle: "Profil à compléter",
  bannerText: "Complétez votre profil pour demander sa validation. Vous pouvez déjà préparer des articles en brouillon.",
  bannerCta: "Compléter mon profil",
  reviewingTitle: "Profil en vérification",
  reviewingText: "Votre profil a été transmis à l’équipe ONLOUTOU. Vous pouvez continuer à préparer des articles en brouillon.",
  approvedTitle: "Profil approuvé",
  approvedText: "Votre profil a été validé. Vous pouvez envoyer vos fiches pour validation.",
  rejectedTitle: "Profil à revoir",
  rejectedPrefix: "Votre candidature n’a pas été retenue",
  steps: {
    profile: "Compléter mon profil",
    article: "Préparer un article",
    send: "Envoyer pour validation",
    locked: "Après approbation du profil",
  },
  articlesTitle: "Mes articles",
  articlesEmpty: "Aucun article pour le moment",
  firstTitle: "Votre premier article commence ici.",
  firstText: "Ajoutez des photos et décrivez ce que vous souhaitez louer.",
  firstCta: "Préparer mon premier article",
  visibility: "Un article devient visible après validation par ONLOUTOU.",
  sideTitle: "Votre espace, simplement",
  side: [
    { href: "/espace-partenaire/articles", title: "Mes articles", text: "Retrouvez vos fiches et brouillons", icon: "layers" as const },
    { href: "/espace-partenaire/demandes", title: "Demandes", text: "Suivez les demandes transmises par ONLOUTOU", icon: "list" as const },
    { href: "/espace-partenaire/locations", title: "Locations", text: "Préparez les locations confirmées", icon: "calendar" as const },
    { href: "/espace-partenaire/compte", title: "Mon compte", text: "Mettez à jour vos informations", icon: "user" as const },
  ],
  nav: [
    { id: "accueil", href: "/espace-partenaire/accueil", label: "Accueil", icon: "home" as const },
    { id: "articles", href: "/espace-partenaire/articles", label: "Mes articles", icon: "layers" as const },
    { id: "demandes", href: "/espace-partenaire/demandes", label: "Demandes", icon: "list" as const },
    { id: "locations", href: "/espace-partenaire/locations", label: "Locations", icon: "calendar" as const },
    { id: "revenus", href: "/espace-partenaire/revenus", label: "Revenus", icon: "coins" as const },
    { id: "compte", href: "/espace-partenaire/compte", label: "Mon compte", icon: "user" as const },
  ],
  help: "Besoin d’aide\u00a0?",
  contact: "Contacter ONLOUTOU",
  contactHref: "/contact",
  helpHref: "/espace-partenaire/aide",
  notifications: "Notifications",
  placeholderLead: "Cette partie de l’espace arrive à l’étape suivante. Aucune donnée fictive n’est affichée ici.",
  firstImage: {
    file: "07_accueil_partenaire_articles.png",
    webp: "07_accueil_partenaire_articles.webp",
    width: 717,
    height: 197,
    alt: "Réfrigérateur, ordinateur portable et assiettes sur une table, près d’une fenêtre.",
  },
  account: {
    title: "Mon compte",
    lead: "Renseignez les informations utiles sur votre activité, puis transmettez votre profil pour validation.",
    personKind: "Vous agissez en tant que",
    individual: "Particulier",
    professional: "Professionnel",
    phone: "Téléphone",
    commune: "Commune",
    commercialName: "Nom commercial",
    commercialHint: "Obligatoire pour un professionnel.",
    save: "Enregistrer le brouillon",
    submit: "Transmettre pour validation",
    submitted: "Profil transmis. Il est en cours de vérification.",
  },
};

export const headerAccess = {
  become: { label: "Mettre mes articles en location", href: "/devenir-partenaire" },
  login: { label: "Se connecter", href: "/espace-partenaire/connexion" },
  space: { label: "Mon espace", href: "/espace-partenaire/accueil" },
};
