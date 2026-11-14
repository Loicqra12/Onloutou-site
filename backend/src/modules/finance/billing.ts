import type { ArticleTerms } from "../catalog/article-validation.js";

export const DEFAULT_COMMISSION_BPS = 1500;

export function inclusiveDayCount(start: Date, end: Date): number {
  const a = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const b = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  return Math.max(1, Math.round((b - a) / 86_400_000) + 1);
}

export function billedPeriods(days: number, period?: ArticleTerms["pricePeriod"]): number {
  if (period === "DAY") return days;
  if (period === "MONTH") return Math.max(1, Math.ceil(days / 30));
  return Math.max(1, Math.ceil(days / 7));
}

export function computeLocationGross(terms: ArticleTerms | undefined, quantity: number, start: Date, end: Date): number {
  const price = Number(terms?.priceAmount ?? 0);
  if (!price || quantity < 1) return 0;
  return Math.round(price * quantity * billedPeriods(inclusiveDayCount(start, end), terms?.pricePeriod));
}

export function splitCommission(gross: number, bps: number) {
  const rate = Number.isFinite(bps) && bps >= 0 ? bps : DEFAULT_COMMISSION_BPS;
  const commissionAmount = Math.round((gross * rate) / 10_000);
  return { commissionBps: rate, commissionAmount, netAmount: gross - commissionAmount };
}

export function asTerms(value: unknown): ArticleTerms {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as ArticleTerms;
  return {};
}
