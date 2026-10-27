import { whatsappUrlForMessage } from "@/content/contact-page";

export type PartnerOption = { id: string; label: string };

export const partnerApplicationProfiles: PartnerOption[] = [
  { id: "supplier", label: "fournisseur d’équipements" },
  { id: "owner", label: "propriétaire ou gestionnaire de véhicules" },
  { id: "tech", label: "technicien ou installateur" },
  { id: "logistics", label: "logistique ou livraison" },
  { id: "partner-tech", label: "partenaire technologique" },
  { id: "commercial", label: "partenaire commercial" },
  { id: "ops", label: "structure opérationnelle" },
  { id: "other", label: "autre" },
];

export const partnerApplicationCapacities: PartnerOption[] = [
  { id: "vehicles", label: "proposer des véhicules" },
  { id: "motos", label: "proposer des motos" },
  { id: "tools", label: "proposer des outils ou matériels" },
  { id: "install", label: "installer ou maintenir" },
  { id: "deliver", label: "transporter ou livrer" },
  { id: "technology", label: "apporter une technologie" },
  { id: "opportunity", label: "présenter une opportunité" },
  { id: "support", label: "accompagner un projet" },
  { id: "other", label: "autre capacité" },
];

export const partnerApplicationZones: PartnerOption[] = [
  { id: "abidjan", label: "Abidjan" },
  { id: "ci", label: "autre ville de Côte d’Ivoire" },
  { id: "multi", label: "plusieurs zones" },
  { id: "other", label: "autre pays ou zone à préciser" },
];

export const partnerApplicationAvailabilities: PartnerOption[] = [
  { id: "once", label: "ponctuelle" },
  { id: "regular", label: "régulière" },
  { id: "projects", label: "selon les projets" },
  { id: "tbd", label: "à définir" },
];

export const partnerApplicationGoals: PartnerOption[] = [
  { id: "offer", label: "présenter une offre" },
  { id: "contact", label: "être contacté pour un besoin pertinent" },
  { id: "collab", label: "proposer une collaboration" },
  { id: "conditions", label: "comprendre les conditions" },
  { id: "complement", label: "proposer une capacité complémentaire" },
  { id: "other", label: "autre objectif" },
];

export const PARTNER_DESCRIPTION_MAX = 500;
export const PARTNER_NAME_MAX = 120;
export const PARTNER_ACTIVITY_MAX = 160;
export const PARTNER_LINK_MAX = 200;

export type PartnerApplicationFormData = {
  nameOrStructure: string;
  activity: string;
  profileId: string;
  capacityId: string;
  description: string;
  zoneId: string;
  availabilityId: string;
  goalId: string;
  professionalLink: string;
};

export type PartnerApplicationFieldErrors = Partial<
  Record<
    "nameOrStructure" | "activity" | "profileId" | "capacityId" | "description" | "zoneId" | "goalId" | "professionalLink",
    string
  >
>;

export function labelForOption(options: PartnerOption[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validatePartnerApplication(data: PartnerApplicationFormData): PartnerApplicationFieldErrors {
  const errors: PartnerApplicationFieldErrors = {};
  const name = data.nameOrStructure.trim();
  if (!name) errors.nameOrStructure = "Indiquez votre nom ou le nom de votre structure.";
  else if (name.length > PARTNER_NAME_MAX) errors.nameOrStructure = `Maximum ${PARTNER_NAME_MAX} caractères.`;

  if (!data.profileId) errors.profileId = "Sélectionnez un profil.";
  if (!data.capacityId) errors.capacityId = "Sélectionnez une capacité proposée.";
  if (!data.zoneId) errors.zoneId = "Sélectionnez une zone.";

  const desc = data.description.trim();
  if (!desc) errors.description = "Décrivez brièvement votre proposition.";
  else if (desc.length > PARTNER_DESCRIPTION_MAX) errors.description = `Maximum ${PARTNER_DESCRIPTION_MAX} caractères.`;

  if (!data.goalId) errors.goalId = "Sélectionnez un objectif.";

  const activity = data.activity.trim();
  if (activity.length > PARTNER_ACTIVITY_MAX) errors.activity = `Maximum ${PARTNER_ACTIVITY_MAX} caractères.`;

  const link = data.professionalLink.trim();
  if (link && !isValidOptionalUrl(link)) errors.professionalLink = "Indiquez une URL publique valide (http ou https).";
  if (link.length > PARTNER_LINK_MAX) errors.professionalLink = `Maximum ${PARTNER_LINK_MAX} caractères.`;

  return errors;
}

export function buildPartnerApplicationMessage(data: PartnerApplicationFormData): string {
  const profile = labelForOption(partnerApplicationProfiles, data.profileId);
  const capacity = labelForOption(partnerApplicationCapacities, data.capacityId);
  const zone = labelForOption(partnerApplicationZones, data.zoneId);
  const availability = labelForOption(partnerApplicationAvailabilities, data.availabilityId);
  const goal = labelForOption(partnerApplicationGoals, data.goalId);
  const activity = data.activity.trim();
  const link = data.professionalLink.trim();

  const lines = [
    "Bonjour ONLOUTOU,",
    "",
    "Je souhaite présenter une proposition de collaboration.",
    "",
    `Nom ou structure : ${data.nameOrStructure.trim()}`,
    `Activité : ${activity || "—"}`,
    `Profil : ${profile}`,
    `Capacité proposée : ${capacity}`,
    `Zone : ${zone}`,
    `Disponibilité : ${availability}`,
    `Objectif : ${goal}`,
    "",
    "Présentation :",
    data.description.trim(),
    "",
    "Lien professionnel :",
    link || "—",
    "",
    "Je comprends que cette prise de contact ne constitue pas une validation, une mission ou un engagement automatique.",
  ];

  return lines.join("\n");
}

export function buildPartnerApplicationWhatsAppUrl(data: PartnerApplicationFormData): string {
  return whatsappUrlForMessage(buildPartnerApplicationMessage(data));
}
