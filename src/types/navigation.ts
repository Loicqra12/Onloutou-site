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

export type NavEntry =
  | { type: "link"; label: string; href: string }
  | { type: "info"; label: string; note?: string };

export type NavGroup = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  iconId?: string;
  items: NavEntry[];
};

export type NavVisual = {
  image: NavImage;
  caption?: string;
  title?: string;
  subtitle?: string;
  cta?: NavCta;
};

export type NavCard = {
  id: string;
  title: string;
  description: string;
  href?: string;
  image: NavImage;
};

export type MegaMenuLayout = "columns-visual" | "list-visual" | "cards" | "simple-visual" | "columns-3-visual" | "grid-icon-visual" | "two-col-visual-footer" | "three-col-flat" | "two-col-visual";

export type MegaMenuConfig = {
  id: string;
  label: string;
  layout: MegaMenuLayout;
  overviewHref?: string;
  overviewLabel?: string;
  groups: NavGroup[];
  cards?: NavCard[];
  visual?: NavVisual;
  visuals?: Record<string, NavVisual>;
  defaultVisual?: string;
  footerCta?: NavCta;
};

export type HeaderNavItem =
  | { type: "link"; id: string; label: string; href: string }
  | { type: "menu"; id: string; label: string; href: string; menu: MegaMenuConfig };
