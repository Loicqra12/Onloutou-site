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
  | "building";

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
  /** Mention discrète en bas d'un groupe-carte. */
  note?: string;
};

export type NavVisual = {
  image: NavImage;
  title: string;
  subtitle?: string;
  cta?: NavCta;
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
 * - `cards` : cartes image
 */
export type MegaMenuVariant = "columns" | "icon-grid" | "cards";

export type MegaMenuConfig = {
  id: string;
  label: string;
  variant: MegaMenuVariant;
  eyebrow: string;
  /** Largeur maximale du panneau (px), ajustée au contenu. */
  width: number;
  overview?: NavCta;
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
