export const plCopy = {
  list: {
    title: "Mes locations.",
    lead: "Retrouvez les locations confirmées par ONLOUTOU.",
    tabs: { all: "Toutes", prepare: "À préparer", progress: "En cours", returned: "À reprendre", done: "Terminées" },
    search: "Rechercher une référence ou un article",
    cols: { location: "Location", period: "Période", qty: "Quantité", place: "Lieu", status: "Statut", action: "Action" },
    open: "Ouvrir",
    empty: "Aucune location confirmée pour le moment.",
    emptyText: "Une location apparaît ici uniquement après confirmation par ONLOUTOU. Une réponse à une demande ne suffit pas.",
    foot: "Une location confirmée est un engagement avec ONLOUTOU. Les conditions de livraison restent précisées par l’équipe.",
  },
  status: {
    TO_PREPARE: "À préparer",
    IN_PROGRESS: "En cours",
    TO_RETURN: "À reprendre",
    COMPLETED: "Terminée",
    INCIDENT: "Incident",
  },
  detail: {
    crumb: "Locations",
    title: "Une location confirmée.",
    badge: "Confirmée",
    ref: "Réf. {ref}",
    demand: "Demande",
    qty: "Quantité",
    period: "Période",
    commune: "Commune",
    delivery: "Livraison",
    fees: "Frais",
    address: "Adresse et créneaux",
    noteTitle: "Message de l’équipe ONLOUTOU",
    stepsTitle: "Déroulement",
    steps: [
      { id: "selected", title: "Proposition retenue", text: "ONLOUTOU a confirmé votre proposition." },
      { id: "prepare", title: "Préparation", text: "Vérifiez l’article, la quantité et les dates." },
      { id: "run", title: "Mise à disposition", text: "Livraison ou retrait selon les consignes ONLOUTOU." },
      { id: "return", title: "Reprise", text: "La fin de location et la reprise seront confirmées." },
    ],
    stockTitle: "Stock et indisponibilités",
    stockText: "Cette location ne met pas encore à jour automatiquement vos indisponibilités. Ajoutez la période sur la fiche si une partie du stock est engagée.",
    editStock: "Gérer les indisponibilités",
    back: "Retour aux locations",
    seeDemand: "Voir la demande",
    seeArticle: "Voir l’article",
    help: "Une question sur cette location ?",
    contact: "Contacter ONLOUTOU",
    seeRevenue: "Voir le revenu",
  },
};

export const pnCopy = {
  title: "Vos notifications.",
  lead: "Les suites de vos fiches, demandes et locations apparaissent ici.",
  empty: "Aucune notification pour le moment.",
  emptyText: "Vous serez informé ici lorsqu’une demande, une location, un revenu ou une fiche changera de statut.",
  markAll: "Tout marquer comme lu",
  unread: "Non lue",
};

export const phCopy = {
  title: "Besoin d’aide ?",
  lead: "Les réponses les plus utiles pour gérer vos fiches, demandes, locations et revenus.",
  contact: "Contacter ONLOUTOU",
  contactText: "Pour une demande en cours ou une location confirmée, écrivez à l’équipe. N’échangez pas directement avec le client.",
  items: [
    {
      q: "Quand une demande bloque-t-elle mon stock ?",
      a: "Jamais à la réponse. Seule une location confirmée par ONLOUTOU crée un engagement. Ajoutez alors une indisponibilité sur la fiche si une partie du stock est prise.",
    },
    {
      q: "Puis-je modifier une réponse déjà transmise ?",
      a: "Oui, tant qu’ONLOUTOU n’a pas retenu ou clôturé la demande. Après confirmation d’une location, la réponse n’est plus modifiable.",
    },
    {
      q: "Que signifie « À corriger » sur une fiche ?",
      a: "ONLOUTOU a besoin d’une précision (photo, dimensions, tarif). Les autres informations sont conservées. Renvoyez la fiche une fois les points traités.",
    },
    {
      q: "Comment une location apparaît-elle ?",
      a: "Après votre réponse, ONLOUTOU étudie puis, si votre proposition est retenue, crée une location. Elle s’affiche dans Mes locations, pas dans Demandes.",
    },
    {
      q: "Qui parle au client ?",
      a: "ONLOUTOU. Vous échangez avec l’équipe : adresse, créneaux, frais et incidents passent par votre espace ou le contact ONLOUTOU.",
    },
    {
      q: "Comment retirer un article ?",
      a: "Un brouillon jamais envoyé peut être supprimé. Une fiche publiée se met en pause ou s’archive. Une location en cours empêche l’archivage.",
    },
    {
      q: "Que faire si mon profil est refusé ?",
      a: "Le motif s’affiche dans votre espace. Corrigez les points demandés puis renvoyez le profil. Aucun article ne peut être publié tant que le profil n’est pas approuvé.",
    },
    {
      q: "Quand suis-je payé ?",
      a: "Un revenu n’apparaît qu’après une location terminée. ONLOUTOU calcule le net (montant moins commission) puis effectue le reversement. Ce n’est pas un paiement automatique.",
    },
    {
      q: "Comment est calculée la commission ?",
      a: "Le taux convenu (15 % par défaut) est appliqué au montant de la location, calculé à partir du tarif de votre fiche. Le taux utilisé est figé sur chaque revenu.",
    },
  ],
};
