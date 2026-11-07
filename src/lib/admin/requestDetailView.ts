export type AdminRequestDetail = {
  id: string;
  reference: string;
  type: string;
  status: string;
  contactName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  organization: string | null;
  zone: string | null;
  message: string;
  sourcePath: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
  events: { status: string; note: string | null; createdAt: string }[];
};

export type DetailField = { label: string; value: string };

const typeLabels: Record<string, string> = {
  CONTACT: "Contact",
  PRODUCT: "Produit / équipement connecté",
  RENTAL: "Location",
  PURCHASE: "Achat",
  GPS: "Géolocalisation / GPS",
  ASSET_SECURITY: "Sécurisation d’actifs",
  CUSTOM_PLATFORM: "Plateforme sur mesure",
  EQUIPMENT_CATALOG: "Matériel & outils",
  DELIVERY: "Livraison",
  PARTNER_SUPPLIER: "Partenaire — fourniture",
  PARTNER_DELIVERY: "Partenaire — logistique",
  PARTNER_TECH: "Partenaire — technologie",
  OTHER: "Autre / candidature",
};

const payloadLabelMap: Record<string, string> = {
  need: "Catégorie de besoin",
  needLabel: "Type de besoin",
  durationLabel: "Durée",
  supportLabel: "Accompagnement",
  familyLabel: "Famille",
  usageLabel: "Usage",
  quantityLabel: "Quantité",
  timelineLabel: "Échéance",
  domainLabel: "Domaine",
  goodsLabel: "Nature du bien",
  origin: "Départ",
  destination: "Destination",
  candidature: "Nature du dossier",
};

function pickPayloadFields(payload: Record<string, unknown>, type: string): DetailField[] {
  const skip = new Set(["openWhatsAppAfter"]);
  const fields: DetailField[] = [];
  for (const [key, raw] of Object.entries(payload)) {
    if (skip.has(key)) continue;
    if (raw === null || raw === undefined || raw === "") continue;
    if (typeof raw === "object") continue;
    const label = payloadLabelMap[key] ?? key;
    fields.push({ label, value: String(raw) });
  }
  if (type === "GPS" && payload.need === "gps") {
    fields.unshift({ label: "Nature", value: "Demande GPS / géolocalisation" });
  }
  return fields;
}

export function buildAdminRequestSections(request: AdminRequestDetail): {
  summary: DetailField[];
  contact: DetailField[];
  need: DetailField[];
  message: string;
  technicalJson: string;
} {
  const payload = request.payload ?? {};
  const summary: DetailField[] = [
    { label: "Référence", value: request.reference },
    { label: "Enregistrée le", value: new Date(request.createdAt).toLocaleString("fr-FR") },
    { label: "Type", value: typeLabels[request.type] ?? request.type },
    { label: "Statut", value: request.status },
  ];
  if (request.sourcePath) {
    summary.push({ label: "Page d’origine", value: request.sourcePath });
  }

  const contact: DetailField[] = [{ label: "Nom", value: request.contactName }];
  if (request.organization) contact.push({ label: "Organisation", value: request.organization });
  if (request.contactPhone) contact.push({ label: "Téléphone", value: request.contactPhone });
  if (request.contactEmail) contact.push({ label: "E-mail", value: request.contactEmail });
  if (request.zone) contact.push({ label: "Zone / lieu", value: request.zone });

  const need = pickPayloadFields(payload, request.type);

  return {
    summary,
    contact,
    need,
    message: request.message,
    technicalJson: JSON.stringify(payload, null, 2),
  };
}

export function requestTypeLabel(type: string): string {
  return typeLabels[type] ?? type;
}
