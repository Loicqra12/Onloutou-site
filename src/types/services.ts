export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceCapability = {
  title: string;
  description: string;
};

export type SolutionUniverseId = "louer" | "acheter" | "connecter" | "construire";

export type SolutionUniverse = {
  id: SolutionUniverseId;
  title: string;
  shortTitle: string;
  tagline: string;
  summary: string;
  capabilities: string[];
  href: string;
  icon: string;
};

export type MegaMenuLink = {
  label: string;
  href: string;
};

export type MegaMenuColumn = {
  id: SolutionUniverseId;
  title: string;
  tagline: string;
  icon: string;
  primaryHref: string;
  links: MegaMenuLink[];
};

export type HeaderNavItem =
  | { type: "link"; href: string; label: string }
  | { type: "solutions"; label: string };
