import type {
  CapabilityCategory,
  DeploymentPhase,
  EditorialDisclaimer,
} from "@/types/content";

/** Contenu interne enrichi — réutilisable pour /solutions et /expertise (non publié tel quel sur l’accueil). */

export const editorialDisclaimers: EditorialDisclaimer[] = [
  {
    id: "installation",
    label: "Installation",
    text:
      "ONLOUTOU adapte la méthode d’installation au véhicule et cherche à limiter toute modification du câblage d’origine. La compatibilité et les conditions d’intervention sont validées avant la pose.",
  },
  {
    id: "engagements",
    label: "Engagements",
    text:
      "Les niveaux de disponibilité, d’assistance, de maintenance et de garantie sont définis dans chaque contrat selon le périmètre retenu.",
  },
  {
    id: "features",
    label: "Fonctionnalités",
    text:
      "Les fonctionnalités disponibles dépendent des équipements, de la plateforme, de la compatibilité des véhicules et du périmètre contractuel.",
  },
  {
    id: "immobilisation",
    label: "Immobilisation à distance",
    text:
      "La commande d’immobilisation est une fonctionnalité optionnelle, réservée aux utilisateurs habilités et configurée afin d’éviter toute coupure dangereuse d’un véhicule en mouvement.",
  },
  {
    id: "can-carburant",
    label: "Données véhicule et carburant",
    text:
      "La disponibilité et la précision des données CAN et carburant dépendent du véhicule, de son année, de son équipement électronique et du matériel installé. Une vérification de compatibilité est réalisée avant engagement.",
  },
];

export const deploymentPhases: DeploymentPhase[] = [
  {
    step: "01",
    title: "Étude du besoin et audit du parc",
    description:
      "Analyse des usages, des véhicules et des contraintes opérationnelles avant toute proposition technique.",
  },
  {
    step: "02",
    title: "Choix des équipements et préparation",
    description:
      "Sélection des traceurs et accessoires selon le besoin ; aucune spécification matérielle n’est présentée comme universelle sans validation du modèle retenu.",
  },
  {
    step: "03",
    title: "Installation et paramétrage",
    description:
      "Pose documentée, paramétrage selon les besoins et intégration sur parcs légers, utilitaires ou mixtes.",
  },
  {
    step: "04",
    title: "Tests de transmission et validation",
    description:
      "Contrôles de remontée de données, des alertes et des accès avant mise en service opérationnelle.",
  },
  {
    step: "05",
    title: "Formation des utilisateurs",
    description:
      "Formation des administrateurs et superviseurs, manuels en français et fiches pratiques de sécurité selon le périmètre.",
  },
  {
    step: "06",
    title: "Assistance et maintenance",
    description:
      "Accompagnement et maintenance définis contractuellement ; documentation d’administration et procès-verbal de pose lorsque applicable.",
  },
];

export const capabilityCategories: CapabilityCategory[] = [
  {
    id: "equipements",
    title: "Équipements et installation",
    summary:
      "Fourniture, pose et paramétrage de solutions de géolocalisation adaptées au parc et au contexte d’exploitation.",
    items: [
      {
        title: "Traceurs et pose",
        points: [
          "Fourniture et installation de traceurs GPS 2G/4G selon le modèle retenu pour le projet",
          "Paramétrage selon les besoins opérationnels",
          "Pose discrète et documentée",
          "Intégration sur véhicules légers, utilitaires et flottes mixtes",
        ],
        note:
          "Les dimensions, tensions, fréquences et capacités dépendent du modèle de traceur effectivement proposé ; elles ne sont pas présentées comme universellement disponibles.",
      },
    ],
  },
  {
    id: "connectivite",
    title: "Connectivité",
    summary:
      "Remontée de positions et continuité de service selon les moyens de transmission disponibles.",
    items: [
      {
        title: "Transmission des données",
        points: [
          "Connectivité par SIM data M2M",
          "Configuration à distance des équipements",
          "Stockage temporaire des positions en cas de perte de réseau, lorsque l’équipement le permet",
        ],
      },
    ],
  },
  {
    id: "supervision",
    title: "Supervision de flotte",
    summary:
      "Visibilité opérationnelle sur les véhicules suivis, accessible selon les droits de chaque utilisateur.",
    items: [
      {
        title: "Suivi et alertes",
        points: [
          "Localisation en temps réel",
          "Historique des trajets",
          "Suivi des arrêts et vitesses",
          "Géozones et alertes",
          "Points d’intérêt métier",
          "Supervision simultanée de plusieurs véhicules",
          "Accès Web et mobile",
          "Gestion des utilisateurs et des niveaux d’accès",
        ],
      },
    ],
  },
  {
    id: "operations",
    title: "Exploitation et optimisation",
    summary:
      "Outils d’aide à l’exploitation et au pilotage des missions, sans promesse d’automatisation avancée non démontrée.",
    items: [
      {
        title: "Pilotage opérationnel",
        points: [
          "Préparation et suivi des missions",
          "Analyse des itinéraires",
          "Suivi des déviations",
          "Aide à l’organisation des tournées",
          "Rapprochement entre véhicules, conducteurs et missions",
          "Calendrier de maintenance préventive",
          "Indicateurs d’exploitation",
        ],
        note:
          "Les fonctions d’optimisation restent des outils d’aide à la décision ; elles ne constituent pas une promesse d’algorithme avancé, d’intelligence artificielle ou d’optimisation automatique systématique.",
      },
    ],
  },
  {
    id: "reporting",
    title: "Reporting",
    summary:
      "Restitution des données de déplacement et d’usage pour le pilotage, selon la plateforme et le contrat.",
    items: [
      {
        title: "Rapports et exports",
        points: [
          "Rapports kilométriques",
          "Rapports de vitesse et d’arrêts",
          "Historiques de déplacement",
          "Exports PDF, XLSX ou CSV selon la plateforme utilisée",
          "Rapports périodiques",
          "Tableaux de bord destinés aux responsables de flotte",
        ],
        note: "Fonctionnalités configurables selon la solution et le contrat.",
      },
    ],
  },
  {
    id: "securite",
    title: "Sécurité des actifs",
    summary:
      "Alertes et actions de protection des actifs, dans le respect des contraintes techniques et contractuelles.",
    items: [
      {
        title: "Alertes et protection",
        points: [
          "Alertes de sortie de zone",
          "Alertes de déconnexion",
          "Alertes de mouvement",
          "Détection d’événements selon les capteurs disponibles",
          "Immobilisation à distance lorsqu’elle est techniquement compatible et contractuellement autorisée",
        ],
        note: editorialDisclaimers.find((d) => d.id === "immobilisation")?.text,
      },
    ],
  },
  {
    id: "donnees-vehicule",
    title: "Données véhicule et carburant",
    summary:
      "Exploitation des données embarquées lorsque les interfaces et le parc le permettent.",
    items: [
      {
        title: "CAN et carburant",
        points: [
          "Récupération de données véhicule selon les interfaces disponibles",
          "Intégration CAN selon le modèle, l’année et la compatibilité du véhicule",
          "Suivi du carburant lorsqu’une source de données fiable est disponible",
          "Alertes de ravitaillement ou de variation anormale selon la configuration",
        ],
        note: editorialDisclaimers.find((d) => d.id === "can-carburant")?.text,
      },
    ],
  },
  {
    id: "formation",
    title: "Formation et transfert de compétences",
    summary:
      "Accompagnement des équipes client pour une prise en main sécurisée des outils.",
    items: [
      {
        title: "Formation et documentation",
        points: [
          "Formation des administrateurs et superviseurs",
          "Manuels utilisateurs en français",
          "Documentation d’administration",
          "Fiches pratiques de sécurité",
          "Procès-verbal de pose et de mise en service",
        ],
      },
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance",
    summary:
      "Suivi technique et interventions définis au contrat, sans engagement public de délais ou de disponibilité chiffrés.",
    items: [
      {
        title: "Assistance technique",
        points: [
          "Assistance et maintenance selon le contrat",
          "Évolution des paramétrages dans le cadre du périmètre convenu",
        ],
        note: editorialDisclaimers.find((d) => d.id === "engagements")?.text,
      },
    ],
  },
  {
    id: "integrations",
    title: "Intégrations personnalisées",
    summary:
      "Adaptation des plateformes et des flux de données aux processus métier du client.",
    items: [
      {
        title: "Plateformes et interfaces",
        points: [
          "Conception de plateformes Web et mobile",
          "Tableaux de bord et gestion des accès",
          "Rapports métier et intégrations adaptées aux opérations du client",
          "API et échanges de données selon le besoin",
        ],
        note: editorialDisclaimers.find((d) => d.id === "features")?.text,
      },
    ],
  },
];

/** Synthèses affichables sur l’accueil (piliers solutions). */
export const homePillarSummaries = {
  louer:
    "Mise à disposition et location d’équipements pour particuliers, professionnels et opérateurs terrain — périmètre historique de l’activité ONLOUTOU.",
  connecter:
    "Installation de traceurs GPS 2G/4G, connectivité M2M, géolocalisation, alertes, géozones et remontée de données selon la compatibilité des véhicules.",
  construire:
    "Conception de plateformes Web et mobile, tableaux de bord, gestion des accès, rapports métier et intégrations adaptées aux opérations du client.",
};

/** Thèmes d’expertise pour l’accueil (texte court). */
export const homeExpertiseThemes = [
  "Déploiement de flotte",
  "Sécurisation d’actifs financés",
  "Supervision opérationnelle",
  "Reporting",
  "Formation et transfert de compétences",
  "Participation aux appels d’offres",
];