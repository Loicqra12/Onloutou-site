import { pdCopy } from "@/content/partner-demands";
import type { ArticleTerms, UnavailabilityInput } from "@/lib/article-validation";

export type PartnerDemandStatus = "PENDING" | "ANSWERED" | "CLOSED";
export type PartnerDemandReplyKind = "AVAILABLE" | "ADJUSTMENT" | "UNAVAILABLE";
export type PartnerDemandOutcome = "WAITING" | "SELECTED" | "DECLINED" | "CANCELLED" | "EXPIRED";

export type PartnerDemand = {
  id: string;
  reference: string;
  status: PartnerDemandStatus;
  requestedQty: number;
  startDate: string;
  endDate: string;
  commune: string;
  deliveryRequested: boolean;
  brief: string | null;
  toClarify: string[];
  replyKind: PartnerDemandReplyKind | null;
  replyQty: number | null;
  replyStart: string | null;
  replyEnd: string | null;
  replyDelivery: string | null;
  replyFees: string | null;
  replyMessage: string | null;
  repliedAt: string | null;
  outcome: PartnerDemandOutcome;
  outcomeNote: string | null;
  location: { id: string; reference: string; status: string } | null;
  createdAt: string;
  stock: { total: number; unavailable: number; available: number };
  product: {
    id: string;
    title: string;
    familySlug: string | null;
    terms: ArticleTerms;
    imageUrl: string | null;
    unavailabilities: UnavailabilityInput[];
  };
  partner: { name: string; commune: string | null };
};

export function canEditDemandReply(demand: Pick<PartnerDemand, "status" | "outcome" | "location">) {
  if (demand.location) return false;
  if (demand.status === "CLOSED") return false;
  const outcome = demand.outcome ?? "WAITING";
  if (outcome !== "WAITING") return false;
  return demand.status === "ANSWERED";
}

export function demandStatusLabel(status: PartnerDemandStatus, outcome?: PartnerDemandOutcome | null) {
  if (outcome && outcome !== "WAITING") return pdCopy.outcome[outcome];
  return pdCopy.status[status];
}

export function demandStatusBadge(status: PartnerDemandStatus, outcome?: PartnerDemandOutcome | null) {
  if (outcome === "SELECTED") return "pa-badge--ok";
  if (outcome === "DECLINED" || outcome === "CANCELLED" || outcome === "EXPIRED") return "pa-badge--closed";
  if (status === "PENDING") return "";
  if (status === "ANSWERED") return "pa-badge--sent";
  return "pa-badge--closed";
}

export function demandDeliveryLine(delivery?: string | null, fees?: string | null) {
  if (!delivery) return "—";
  if (!fees) return delivery;
  const fee = fees.toLowerCase() === "à convenir" ? "frais à convenir" : fees.toLowerCase();
  return `${delivery}, ${fee}`;
}

export function demandServiceLine(delivery: string, fees: string) {
  if (delivery === "Non") return "Sans livraison";
  if (fees.toLowerCase() === "à convenir") return "Livraison à convenir";
  if (fees.toLowerCase() === "inclus") return "Livraison, frais inclus";
  return `Livraison, ${fees.toLowerCase()}`;
}

export const clarifyIcons = ["pin", "calendar", "van"] as const;
