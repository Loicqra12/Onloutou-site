import { prCopy } from "@/content/partner-revenues";
import type { ArticleTerms } from "@/lib/article-validation";

export type PartnerRevenueStatus = "PENDING" | "PAID";
export type PartnerPayoutMethod = "MOBILE_MONEY" | "BANK_TRANSFER" | "CASH" | "OTHER";

export type PartnerRevenue = {
  id: string;
  reference: string;
  status: PartnerRevenueStatus;
  grossAmount: number;
  commissionBps: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  createdAt: string;
  product: {
    id: string;
    title: string;
    familySlug: string | null;
    terms: ArticleTerms;
    imageUrl: string | null;
  };
  location: {
    id: string;
    reference: string;
    status: string;
    quantity: number;
    startDate: string;
    endDate: string;
    commune: string;
  };
  payout: {
    id: string;
    reference: string;
    amount: number;
    method: PartnerPayoutMethod;
    paidAt: string;
    note: string | null;
  } | null;
};

export type PartnerPayout = {
  id: string;
  reference: string;
  amount: number;
  method: PartnerPayoutMethod;
  paidAt: string;
  note: string | null;
  revenues: { id: string; reference: string; netAmount: number; locationRef: string; productTitle: string }[];
};

export type PartnerFinanceTotals = {
  pendingNet: number;
  receivedThisMonth: number;
  commissionThisMonth: number;
  billedThisMonth: number;
};

export function revenueStatusLabel(status: PartnerRevenueStatus) {
  return prCopy.status[status];
}

export function revenueStatusBadge(status: PartnerRevenueStatus) {
  return status === "PAID" ? "pa-badge--ok" : "pa-badge--sent";
}

export function payoutMethodLabel(method: PartnerPayoutMethod) {
  return prCopy.method[method];
}

export function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export function formatRate(bps: number) {
  const value = bps / 100;
  return `${Number.isInteger(value) ? String(value) : value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;
}
