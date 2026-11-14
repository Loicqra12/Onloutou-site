export type NavIconId =
  | "excavator"
  | "pin"
  | "cog"
  | "van"
  | "bike"
  | "drill"
  | "signal"
  | "document"
  | "document-gear"
  | "team"
  | "chat"
  | "info"
  | "preview"
  | "handshake"
  | "network"
  | "grid"
  | "building"
  | "fridge"
  | "laptop"
  | "sofa"
  | "cloche"
  | "stroller";

export type NavImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
};

export type NavCta = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavEntry = {
  type: "link";
  label: string;
  href: string;
  /** Premier choix du groupe : flèche jaune persistante. */
  emphasis?: boolean;
  /** Mention d'état affichée à côté du libellé (ex. « En préparation »). */
  badge?: string;
};

export type NavGroup = {
  id: string;
  title: string;
  description?: string;
  /** Si renseigné et sans `items`, le titre devient un lien. */
  href?: string;
  iconId?: NavIconId;
  items: NavEntry[];
  /** Colonne dans le variant `split-families`. */
  sectionId?: string;
  /** Mention discrète en bas d'un groupe-carte. */
  note?: string;
};

export type NavVisual = {
  image: NavImage;
  title?: string;
  subtitle?: string;
  cta?: NavCta;
  /** `button` : bouton jaune plein, comme « Je cherche un autre article ». */
  ctaStyle?: "link" | "button";
};

export type MegaMenuSection = {
  id: string;
  title: string;
  hint?: string;
};

export type NavCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: NavImage;
};

export type NavPromo = {
  iconId: NavIconId;
  title: string;
  cta: NavCta;
};

export type NavFooter = {
  iconId: NavIconId;
  text: string;
  cta?: NavCta;
};

/**
 * - `columns` : groupes en colonnes + visuel ou carte à droite
 * - `icon-grid` : grille de familles (2 colonnes) + visuel
 * - `split-families` : deux colonnes nommées + visuel et bouton
 * - `cards` : cartes image
 */
export type MegaMenuVariant = "columns" | "icon-grid" | "split-families" | "cards";

export type MegaMenuConfig = {
  id: string;
  label: string;
  variant: MegaMenuVariant;
  eyebrow: string;
  /** Largeur maximale du panneau (px), ajustée au contenu. */
  width: number;
  overview?: NavCta;
  /** Titres des colonnes pour `split-families`. */
  sections?: MegaMenuSection[];
  groups: NavGroup[];
  /** Carte additionnelle dans la dernière colonne (ex. « Vos futurs espaces »). */
  aside?: NavGroup;
  promo?: NavPromo;
  cards?: NavCard[];
  cardsNote?: string;
  visual?: NavVisual;
  /** Poids (fr) de la colonne visuelle ou carte par rapport à un groupe. */
  asideWeight?: number;
  footer?: NavFooter;
};

export type HeaderNavItem =
  | { type: "link"; id: string; label: string; href: string }
  | { type: "menu"; id: string; label: string; href: string; menu: MegaMenuConfig };
