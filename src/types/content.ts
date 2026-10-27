export type NavItem = {
  href: string;
  label: string;
};

export type SolutionPillar = {
  id: string;
  tabLabel: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  activityDomains: string[];
};

export type ExpertiseCase = {
  index: string;
  tag: string;
  title: string;
  description: string;
  variant?: "featured";
};

export type PlatformJourney = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
};

export type ProcessStep = {
  number: string;
  phase: string;
  title: string;
  description: string;
};

export type TeamMember = {
  initials: string;
  role: string;
  name: string;
  bio: string;
  variant?: "alt" | "join";
};

export type Metric = {
  value: string;
  label: string;
};

export type CapabilityItem = {
  title: string;
  points: string[];
  note?: string;
};

export type CapabilityCategory = {
  id: string;
  title: string;
  summary: string;
  items: CapabilityItem[];
};

export type DeploymentPhase = {
  /** Ancre optionnelle sur la carte de l'étape. */
  id?: string;
  step: string;
  title: string;
  description: string;
};

export type EditorialDisclaimer = {
  id: string;
  label: string;
  text: string;
};
