/* Centre d’aide — contenu de la refonte (textes repris de l’écran Figma).
   Les questions et réponses viennent de help-center.ts (contenu existant du site).
   Rédigés ici (absents de la maquette ou à valider) : voir les marqueurs « rédigée ». */

import { helpArticles, helpCenterWhatsappUrl } from "@/content/help-center";
import type { GlyphName } from "@/components/about/redesign/AbtIcon";

export type HlpItem = {
  id: string;
  question: string;
  answer: string;
  links: { label: string; href: string }[];
};

export type HlpTopic = {
  id: string;
  title: string;
  icon: GlyphName;
  items: HlpItem[];
};

export const hlpHero = {
  eyebrow: "CENTRE D’AIDE",
  titleLines: ["Une question ?", "Trouvons la bonne réponse."],
  lead: "Location, équipements, GPS, projets ou partenariats : accédez aux informations utiles.",
  searchLabel: "Rechercher une question ou un sujet",
  searchPlaceholder: "Rechercher une question ou un sujet…",
  searchButton: "Rechercher",
  chips: ["Location", "GPS", "Devenir partenaire"],
  image: { src: "/assets/images/equipment/engins/pelle-chenilles-godet.webp", width: 900, height: 609 },
};

export const hlpTopicsIntro = { title: "Choisissez votre sujet." };

export const hlpBrowse = {
  eyebrow: "PARCOURIR L’AIDE",
  contact: { label: "Contacter ONLOUTOU", href: "/contact" },
};

export const hlpResults = {
  /** rédigée : absente de la maquette (recherche côté client). */
  title: "Résultats de la recherche",
  empty: "Aucune réponse exacte n’a été trouvée.",
  emptyHelp: "Essayez un autre mot ou présentez votre question à l’équipe.",
  open: "Voir la réponse",
  clear: "Effacer",
};

export const hlpMedia = {
  title: "Comprendre en images.",
  lead: "Un emplacement prévu pour vos tutoriels utiles.",
  badge: "VIDÉO À INTÉGRER",
  tileLabel: "Préparer une demande d’équipement",
  tileAria: "Emplacement vidéo à intégrer : Préparer une demande d’équipement",
  heading: "Un guide court, une action claire.",
  text: "Montrer les informations à préparer et les étapes à suivre.",
  note: "Emplacement à activer lorsque le tutoriel est disponible.",
};

export const hlpBand = {
  title: "Vous ne trouvez pas votre réponse ?",
  lead: "Présentez votre question directement à l’équipe.",
  primary: { label: "Contacter ONLOUTOU", href: "/contact" },
  whatsapp: { label: "WhatsApp", href: helpCenterWhatsappUrl() },
};

/** Sujets de la maquette ; les identifiants reprennent les catégories existantes (ancres /aide#… conservées). */
const topicDefs: { id: string; categoryId: string; title: string; icon: GlyphName }[] = [
  { id: "a-propos-contact", categoryId: "a-propos-contact", title: "Découvrir ONLOUTOU", icon: "book" },
  { id: "location-acquisition", categoryId: "location-acquisition", title: "Location & acquisition", icon: "excavator" },
  { id: "equipements-produits", categoryId: "equipements-produits", title: "Équipements", icon: "gear" },
  { id: "geolocalisation-flotte", categoryId: "geolocalisation-flotte", title: "GPS & gestion de flotte", icon: "pin" },
  { id: "livraison", categoryId: "livraison", title: "Livraison", icon: "truck" },
  { id: "partenaires", categoryId: "partenaires", title: "Partenaires", icon: "users" },
  { id: "livreurs", categoryId: "livreurs", title: "Livreurs partenaires", icon: "user" },
  { id: "projets-plateformes", categoryId: "projets-plateformes", title: "Projets numériques", icon: "laptop" },
];

/** Réponse de la maquette (écran Centre d’aide, sujet « Location & acquisition »). */
const presenterBesoin: HlpItem = {
  id: "comment-presenter-mon-besoin",
  question: "Comment présenter mon besoin ?",
  answer:
    "Indiquez le type d’équipement, l’usage, le lieu et la durée souhaitée. Ces précisions permettent d’étudier une proposition adaptée.",
  links: [{ label: "Préparer mon message", href: "/contact" }],
};

/** rédigée : question de la maquette sans réponse dans le contenu existant ; aucune disponibilité ni prix annoncé. */
const equipementAbsent: HlpItem = {
  id: "equipement-absent-du-site",
  question: "Puis-je demander un équipement absent du site ?",
  answer:
    "Oui, vous pouvez présenter votre besoin même si l’équipement n’apparaît pas sur le site. Son étude dépend du type d’équipement, de l’usage et de la disponibilité, à confirmer après qualification.",
  links: [{ label: "Préparer mon message", href: "/contact" }],
};

/** Libellés de la maquette pour deux questions du sujet « Location & acquisition » (réponses existantes). */
const screenQuestions: Record<string, string> = {
  "comment-obtenir-un-prix": "Comment sont précisés le prix et les conditions ?",
  "location-ou-acquisition": "Puis-je comparer location et achat ?",
};

const locationOrder = [
  "comment-presenter-mon-besoin",
  "equipement-absent-du-site",
  "disponibilite-immediate",
  "comment-obtenir-un-prix",
  "location-ou-acquisition",
];

function toItem(article: (typeof helpArticles)[number]): HlpItem {
  return {
    id: article.id,
    question: screenQuestions[article.id] ?? article.question,
    answer: article.answer,
    links: (article.relatedLinks ?? []).map((link) => ({ label: link.label, href: link.href })),
  };
}

export function buildHlpTopics(): HlpTopic[] {
  return topicDefs.map((def) => {
    const items = helpArticles
      .filter((article) => article.categoryId === def.categoryId && article.id !== presenterBesoin.id)
      .map(toItem);
    if (def.id === "location-acquisition") {
      const all = [presenterBesoin, equipementAbsent, ...items];
      const rank = (id: string) => {
        const index = locationOrder.indexOf(id);
        return index === -1 ? locationOrder.length : index;
      };
      all.sort((a, b) => rank(a.id) - rank(b.id));
      return { id: def.id, title: def.title, icon: def.icon, items: all };
    }
    return { id: def.id, title: def.title, icon: def.icon, items };
  });
}