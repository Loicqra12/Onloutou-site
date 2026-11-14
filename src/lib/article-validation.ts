/** Validation des indisponibilités et des trous de brouillon (partagée logique serveur). */

export type UnavailabilityInput = {
  startDate: string;
  endDate: string;
  quantity: number;
  reason?: string | null;
  id?: string;
};

export function parseIsoDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function eachDay(start: Date, end: Date): string[] {
  const days: string[] = [];
  const cur = new Date(start.getTime());
  while (cur.getTime() <= end.getTime()) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}

export function validateUnavailabilities(
  total: number,
  periods: UnavailabilityInput[],
): { ok: true } | { ok: false; error: string } {
  if (!Number.isInteger(total) || total < 1) {
    return { ok: false, error: "La quantité totale doit être un entier positif." };
  }
  const normalized: { start: Date; end: Date; quantity: number }[] = [];
  for (const period of periods) {
    const start = parseIsoDate(period.startDate);
    const end = parseIsoDate(period.endDate);
    if (!start || !end) {
      return { ok: false, error: "Chaque période d’indisponibilité doit avoir des dates valides (AAAA-MM-JJ)." };
    }
    if (end.getTime() < start.getTime()) {
      return { ok: false, error: "La date de fin d’une indisponibilité ne peut pas précéder sa date de début." };
    }
    if (!Number.isInteger(period.quantity) || period.quantity < 1) {
      return { ok: false, error: "La quantité indisponible doit être un entier positif." };
    }
    if (period.quantity > total) {
      return { ok: false, error: "La quantité indisponible ne peut pas dépasser la quantité totale." };
    }
    normalized.push({ start, end, quantity: period.quantity });
  }
  const load = new Map<string, number>();
  for (const period of normalized) {
    for (const day of eachDay(period.start, period.end)) {
      const next = (load.get(day) ?? 0) + period.quantity;
      if (next > total) {
        return {
          ok: false,
          error: `La somme des indisponibilités le ${day} dépasse la quantité totale (${total}).`,
        };
      }
      load.set(day, next);
    }
  }
  return { ok: true };
}

export function rangeAvailability(
  total: number,
  periods: UnavailabilityInput[],
  start: string,
  end: string,
): { total: number; unavailable: number; available: number } {
  const from = parseIsoDate(start);
  const to = parseIsoDate(end);
  if (!from || !to || !total) return { total, unavailable: 0, available: total };
  let max = 0;
  for (const day of eachDay(from, to)) {
    let load = 0;
    for (const period of periods) {
      if (period.startDate <= day && day <= period.endDate) load += period.quantity;
    }
    if (load > max) max = load;
  }
  return { total, unavailable: max, available: Math.max(0, total - max) };
}

export type ArticleTerms = {
  quantity?: number | null;
  rentalMode?: "UNIT" | "LOT" | null;
  lotCount?: number | null;
  piecesPerLot?: number | null;
  priceAmount?: number | null;
  pricePeriod?: "DAY" | "WEEK" | "MONTH" | null;
  minDuration?: string | null;
  depositKind?: "AMOUNT" | "TO_DISCUSS" | null;
  depositAmount?: number | null;
  commune?: string | null;
  pickup?: boolean | null;
  delivery?: boolean | null;
  deliveryZone?: string | null;
  deliveryFees?: string | null;
  installation?: boolean | null;
  availableFrom?: string | null;
};

export type DraftGap =
  | "photos"
  | "identity"
  | "category"
  | "description"
  | "conditions"
  | "lots"
  | "none";

export function detectDraftGap(input: {
  title?: string | null;
  familySlug?: string | null;
  categorySlug?: string | null;
  categoryRequest?: string | null;
  description?: string | null;
  condition?: string | null;
  imageCount: number;
  terms?: ArticleTerms | null;
}): DraftGap {
  const title = input.title?.trim() ?? "";
  if (title.length < 3 || !input.familySlug || !input.condition) return "identity";
  if (!input.categorySlug && !input.categoryRequest?.trim()) return "category";
  if (!input.description?.trim()) return "description";
  if (input.imageCount < 1) return "photos";
  const terms = input.terms ?? {};
  const qty = Number(terms.quantity ?? 0);
  if (terms.rentalMode === "LOT" && (!terms.lotCount || !terms.piecesPerLot)) return "lots";
  if (!qty || !terms.rentalMode || terms.priceAmount == null || !terms.pricePeriod || !terms.minDuration || !terms.depositKind || !terms.commune || !(terms.pickup || terms.delivery)) {
    return "conditions";
  }
  if (terms.delivery && (!terms.deliveryZone || !terms.deliveryFees)) return "conditions";
  return "none";
}
