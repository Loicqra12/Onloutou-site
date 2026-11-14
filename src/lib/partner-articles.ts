import { detectDraftGap, type ArticleTerms, type DraftGap, type UnavailabilityInput } from "@/lib/article-validation";
import { paCopy } from "@/content/partner-articles";
import { familyLabel, getFamily } from "@/content/article-taxonomy";

export type { ArticleTerms, DraftGap, UnavailabilityInput };

export type ArticleImage = {
  id: string;
  sortOrder: number;
  url?: string | null;
  storageKey?: string;
};

export type PartnerArticle = {
  id: string;
  reference?: string | null;
  title: string;
  description?: string | null;
  status: "DRAFT" | "PENDING_REVIEW" | "REJECTED" | "APPROVED" | "DISABLED" | "ARCHIVED";
  rejectionReason?: string | null;
  familySlug?: string | null;
  categorySlug?: string | null;
  categoryRequest?: string | null;
  condition?: string | null;
  specs?: Record<string, string>;
  corrections?: {
    message?: string;
    items?: Array<{ kind: "replace_photo"; imageId: string; title: string } | { kind: "dimensions" }>;
  } | null;
  terms?: ArticleTerms;
  images?: ArticleImage[];
  unavailabilities?: UnavailabilityInput[];
  quantityHint?: number | null;
  category?: string;
  publishedAt?: string | null;
};

export function articleFamilyLabel(article: PartnerArticle): string {
  return familyLabel(article.familySlug) || getFamily(article.familySlug)?.label || "";
}

export function quantityLabel(article: PartnerArticle): string {
  const terms = article.terms ?? {};
  if (terms.rentalMode === "LOT") {
    const n = Number(terms.lotCount ?? 0);
    if (!n) return paCopy.list.qtyToSet;
    return `${n} ${n > 1 ? paCopy.list.unitLots : paCopy.list.unitLot}`;
  }
  const n = Number(terms.quantity ?? article.quantityHint ?? 0);
  if (!n) return paCopy.list.qtyToSet;
  return `${n} ${n > 1 ? paCopy.list.unitDevices : paCopy.list.unitDevice}`;
}

export function gapLabel(article: PartnerArticle): string | null {
  if (article.status !== "DRAFT" && article.status !== "REJECTED") return null;
  const gap = detectDraftGap({
    title: article.title,
    familySlug: article.familySlug,
    categorySlug: article.categorySlug,
    categoryRequest: article.categoryRequest,
    description: article.description,
    condition: article.condition,
    imageCount: article.images?.length ?? 0,
    terms: article.terms,
  });
  if (gap === "none") return null;
  return paCopy.gaps[gap];
}

export function statusLabel(status: PartnerArticle["status"]): string {
  return paCopy.statuses[status] ?? status;
}

export function formatFrRange(start: string, end: string): string {
  const a = /^(\d{4})-(\d{2})-(\d{2})/.exec(start.trim());
  const b = /^(\d{4})-(\d{2})-(\d{2})/.exec(end.trim());
  if (!a || !b) return `${start} – ${end}`;
  const da = new Date(Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3])));
  const db = new Date(Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3])));
  const dayA = da.getUTCDate();
  const dayB = db.getUTCDate();
  const monthB = db.toLocaleDateString("fr-FR", { month: "long", timeZone: "UTC" });
  const yearB = db.getUTCFullYear();
  if (a[1] === b[1] && a[2] === b[2]) return `${dayA} – ${dayB} ${monthB} ${yearB}`;
  return `${da.toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" })} – ${db.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
}

export function unitWord(mode: ArticleTerms["rentalMode"], n: number) {
  if (mode === "LOT") return n > 1 ? "lots" : "lot";
  return n > 1 ? "appareils" : "appareil";
}

/** Libellé narratif des maquettes (« 2 réfrigérateurs ») ; sinon l’unité de location. */
export function demandQtyPhrase(title: string, mode: ArticleTerms["rentalMode"], n: number) {
  if (mode === "LOT") return `${n} ${unitWord(mode, n)}`;
  const noun = title.replace(/\s+\d.*$/, "").trim().toLowerCase();
  if (noun && !noun.includes(" ") && noun.length >= 4 && noun.length <= 22) {
    const plural = n > 1 && !noun.endsWith("s") ? `${noun}s` : noun;
    return `${n} ${plural}`;
  }
  return `${n} ${unitWord(mode, n)}`;
}

export function formatPrice(terms?: ArticleTerms | null): string {
  if (!terms || terms.priceAmount == null) return "—";
  const period = terms.pricePeriod === "DAY" ? "jour" : terms.pricePeriod === "MONTH" ? "mois" : "semaine";
  const unit = terms.rentalMode === "LOT" ? "lot" : "appareil";
  return `${Number(terms.priceAmount).toLocaleString("fr-FR")} FCFA / ${unit} / ${period}`;
}
