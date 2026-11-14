import { plCopy } from "@/content/partner-locations";
import type { ArticleTerms } from "@/lib/article-validation";

export type PartnerLocationStatus = "TO_PREPARE" | "IN_PROGRESS" | "TO_RETURN" | "COMPLETED" | "INCIDENT";

export type PartnerLocation = {
  id: string;
  reference: string;
  status: PartnerLocationStatus;
  quantity: number;
  startDate: string;
  endDate: string;
  commune: string;
  delivery: string | null;
  fees: string | null;
  addressNote: string | null;
  onloutouNote: string | null;
  createdAt: string;
  product: {
    id: string;
    title: string;
    familySlug: string | null;
    terms: ArticleTerms;
    imageUrl: string | null;
  };
  demand: { id: string; reference: string; brief: string | null; replyMessage: string | null; replyKind: string | null };
  revenue: { id: string; reference: string; status: string; netAmount: number } | null;
};

export type PartnerNotice = {
  id: string;
  kind: "DEMAND" | "LOCATION" | "ARTICLE" | "PROFILE" | "MESSAGE" | "PAYOUT";
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export function locationStatusLabel(status: PartnerLocationStatus) {
  return plCopy.status[status];
}

export function locationStatusBadge(status: PartnerLocationStatus) {
  if (status === "TO_PREPARE" || status === "TO_RETURN") return "";
  if (status === "IN_PROGRESS") return "pa-badge--sent";
  if (status === "INCIDENT") return "pa-badge--warn";
  return "pa-badge--closed";
}

export function locationStepIndex(status: PartnerLocationStatus) {
  if (status === "TO_PREPARE") return 1;
  if (status === "IN_PROGRESS") return 2;
  if (status === "TO_RETURN" || status === "INCIDENT") return 3;
  return 3;
}
