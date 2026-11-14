import type { ServiceRequestStatus, ServiceRequestType } from "@prisma/client";

export const OPEN_REQUEST_STATUSES: ServiceRequestStatus[] = [
  "RECEIVED",
  "IN_REVIEW",
  "WAITING_CLIENT",
  "QUOTED",
];

export function requestTypeLabel(type: ServiceRequestType | string): string {
  const labels: Record<string, string> = {
    CONTACT: "Contact",
    PRODUCT: "Produit",
    RENTAL: "Location",
    PURCHASE: "Achat",
    GPS: "Géolocalisation",
    ASSET_SECURITY: "Sécurisation d’actifs",
    CUSTOM_PLATFORM: "Plateforme",
    EQUIPMENT_CATALOG: "Matériel",
    DELIVERY: "Livraison",
    PARTNER_SUPPLIER: "Partenaire — fourniture",
    PARTNER_DELIVERY: "Partenaire — logistique",
    PARTNER_TECH: "Partenaire — technologie",
    OTHER: "Autre",
  };
  return labels[type] ?? type;
}

export function requestStageLabel(status: ServiceRequestStatus | string, payload?: unknown): string {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const proposal = data.proposal && typeof data.proposal === "object" ? (data.proposal as Record<string, unknown>) : null;
  const rental = data.rental && typeof data.rental === "object" ? (data.rental as Record<string, unknown>) : null;

  if (rental?.status === "confirmed" || rental?.reserved === true) {
    return "Location confirmée";
  }
  if (proposal?.clientResponse === "accepted" || rental?.agreementReceived) {
    return "Location non confirmée";
  }
  if (proposal?.status === "sent" || proposal?.sentToClient === true) {
    return "Proposition transmise";
  }
  if (
    (proposal?.status === "draft" || proposal?.status === "ready") &&
    status !== "WAITING_CLIENT" &&
    status !== "CLOSED" &&
    status !== "CANCELLED"
  ) {
    return "Proposition en préparation";
  }
  const labels: Record<string, string> = {
    RECEIVED: "Demande reçue",
    IN_REVIEW: "En qualification",
    WAITING_CLIENT: "En attente client",
    QUOTED: "Offre en préparation",
    CLOSED: "Clôturé",
    CANCELLED: "Annulé",
  };
  return labels[status] ?? status;
}

export function requestNextAction(status: ServiceRequestStatus | string, payload?: unknown): string {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const proposal = data.proposal && typeof data.proposal === "object" ? (data.proposal as Record<string, unknown>) : null;
  const rental = data.rental && typeof data.rental === "object" ? (data.rental as Record<string, unknown>) : null;
  const payment = data.payment && typeof data.payment === "object" ? (data.payment as Record<string, unknown>) : null;
  const initial = payment?.initial && typeof payment.initial === "object" ? (payment.initial as Record<string, unknown>) : null;

  const logistics = data.logistics && typeof data.logistics === "object" ? (data.logistics as Record<string, unknown>) : null;
  const departure = logistics?.departure && typeof logistics.departure === "object" ? (logistics.departure as Record<string, unknown>) : null;
  const plan = logistics?.plan && typeof logistics.plan === "object" ? (logistics.plan as Record<string, unknown>) : null;
  const handover = logistics?.handover && typeof logistics.handover === "object" ? (logistics.handover as Record<string, unknown>) : null;
  const proof = handover?.proof && typeof handover.proof === "object" ? (handover.proof as Record<string, unknown>) : null;
  const arrival = handover?.arrival && typeof handover.arrival === "object" ? (handover.arrival as Record<string, unknown>) : null;
  const returnFlow = logistics?.returnFlow && typeof logistics.returnFlow === "object" ? (logistics.returnFlow as Record<string, unknown>) : null;
  const returnPlan = returnFlow?.plan && typeof returnFlow.plan === "object" ? (returnFlow.plan as Record<string, unknown>) : null;
  const returnPickup = returnFlow?.pickup && typeof returnFlow.pickup === "object" ? (returnFlow.pickup as Record<string, unknown>) : null;
  const returnDepot = returnFlow?.depot && typeof returnFlow.depot === "object" ? (returnFlow.depot as Record<string, unknown>) : null;
  const closure = data.closure && typeof data.closure === "object" ? (data.closure as Record<string, unknown>) : null;
  const depositDecision =
    closure?.depositDecision && typeof closure.depositDecision === "object"
      ? (closure.depositDecision as Record<string, unknown>)
      : null;
  const partnerPayout =
    closure?.partnerPayout && typeof closure.partnerPayout === "object"
      ? (closure.partnerPayout as Record<string, unknown>)
      : null;
  const selection = data.selection && typeof data.selection === "object" ? (data.selection as Record<string, unknown>) : null;
  const selectionItems = Array.isArray(selection?.items) ? selection.items : [];
  const hasPartnerItem = selectionItems.some(
    (row) => row && typeof row === "object" && (row as Record<string, unknown>).ownerKind !== "onloutou",
  );
  if (status === "CLOSED" || closure?.closed) return "Consulter";
  if (depositDecision?.submitted && (!hasPartnerItem || partnerPayout?.submitted)) return "Clôturer le dossier";
  if (depositDecision?.submitted) return "Préparer le reversement";
  if (logistics?.status === "return_closed") return "Bilan de retour";
  if (returnDepot?.allValidated) return "Restituer au partenaire";
  if (returnPickup?.recorded) return "Contrôler au dépôt";
  if (returnPlan?.missionsCreated) return "Constater la reprise";
  if (proof?.handedOver || rental?.status === "active") return "Organiser la reprise";
  if (arrival?.readyForProof) return "Recueillir la preuve";
  if (departure?.authorized) return "Contrôler à l’arrivée";
  if (plan?.missionsCreated) return "Préparer";
  if (rental?.status === "confirmed" || rental?.reserved === true) return "Organiser la livraison";
  if (initial?.verified === true) return "Confirmer";
  if (proposal?.clientResponse === "accepted" || rental?.agreementReceived) return "Vérifier le paiement";
  if (proposal?.status === "sent" || proposal?.sentToClient === true) return "Relancer";

  const labels: Record<string, string> = {
    RECEIVED: "Compléter le besoin",
    IN_REVIEW: "Préparer",
    WAITING_CLIENT: "Relancer",
    QUOTED: "Préparer",
    CLOSED: "Consulter",
    CANCELLED: "Consulter",
  };
  return labels[status] ?? "Ouvrir";
}

export function requestOrigin(
  payload: unknown,
  sourcePath: string | null,
): { key: "web" | "phone" | "whatsapp" | "other"; label: string } {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const source = String(data.source ?? data.origin ?? "").toLowerCase();
  if (/whatsapp/.test(source)) return { key: "whatsapp", label: "WhatsApp" };
  if (/tel|phone|appel/.test(source)) return { key: "phone", label: "Téléphone" };
  if (source === "web" || source === "site") return { key: "web", label: "Site" };
  if (source === "other") return { key: "other", label: "Autre" };
  if (/admin/.test(source)) return { key: "other", label: "Administration" };
  if (sourcePath) return { key: "web", label: "Site" };
  if (source) return { key: "other", label: String(data.source ?? data.origin) };
  return { key: "web", label: "Site" };
}

export function requestPeriodLine(
  payload: unknown,
  zone: string | null,
): { period: string | null; place: string | null } {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const timeline = typeof data.timelineLabel === "string" ? data.timelineLabel : "";
  const deadline = typeof data.deadline === "string" ? data.deadline : "";
  const start = typeof data.startDate === "string" ? data.startDate : typeof data.dateDebut === "string" ? data.dateDebut : "";
  const end = typeof data.endDate === "string" ? data.endDate : typeof data.dateFin === "string" ? data.dateFin : "";
  let period: string | null = null;
  if (start && end) period = `${start} – ${end}`;
  else if (timeline) period = timeline;
  else if (deadline) period = deadline;
  else if (start) period = start;
  return { period, place: zone };
}

export function envisagedArticles(
  payload: unknown,
  fallbackTitle: string,
): { title: string; owner: string; quantity: string; availability: string }[] {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const raw = data.articles ?? data.items ?? data.products;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((item) => {
      const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        title: String(row.title ?? row.name ?? row.label ?? fallbackTitle),
        owner: String(row.owner ?? row.proprietaire ?? row.partnerName ?? "À confirmer"),
        quantity: String(row.quantity ?? row.qty ?? row.quantite ?? "—"),
        availability: "À confirmer",
      };
    });
  }
  const family = typeof data.familyLabel === "string" ? data.familyLabel : fallbackTitle;
  const qty = typeof data.quantityLabel === "string" ? data.quantityLabel : "—";
  return [
    {
      title: family,
      owner: "À confirmer",
      quantity: qty,
      availability: "À confirmer",
    },
  ];
}

export function requestTitle(row: {
  organization: string | null;
  contactName: string;
  type: string;
  payload?: unknown;
}): string {
  const data = row.payload && typeof row.payload === "object" ? (row.payload as Record<string, unknown>) : {};
  const family = typeof data.familyLabel === "string" ? data.familyLabel : "";
  const org = row.organization?.trim();
  if (org && family) return `${org} · ${family}`;
  if (org) return `${org} · ${requestTypeLabel(row.type)}`;
  if (family) return `${row.contactName} · ${family}`;
  return `${row.contactName} · ${requestTypeLabel(row.type)}`;
}

export function requestNeedLine(row: { zone: string | null; message: string; payload?: unknown }): string {
  const data = row.payload && typeof row.payload === "object" ? (row.payload as Record<string, unknown>) : {};
  const family = typeof data.familyLabel === "string" ? data.familyLabel : "";
  const bits = [family, row.zone].filter(Boolean);
  return bits.join(" · ");
}
