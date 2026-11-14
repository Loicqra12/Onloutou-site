"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { categoryPathLabel, familyLabel, getFamily } from "@/content/article-taxonomy";
import { paCopy, paPaths } from "@/content/partner-articles";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaConfirm, PaField, PaSect } from "@/components/partners/PaField";
import { formatFrRange, quantityLabel, statusLabel, unitWord, type PartnerArticle } from "@/lib/partner-articles";
import { rangeAvailability, type UnavailabilityInput } from "@/lib/article-validation";
import "@/styles/partner-articles.css";

export function PartnerArticleManage({ productId }: { productId: string }) {
  const router = useRouter();
  const t = paCopy.manage;
  const [article, setArticle] = useState<PartnerArticle | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [unavailForm, setUnavailForm] = useState<UnavailabilityInput | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);

  const load = useCallback(async () => {
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`);
    if (!res.ok) { setError(res.error); return; }
    const p = res.data.product;
    setArticle(p);
    const first = p.unavailabilities?.[0];
    setFrom(first?.startDate ?? "");
    setTo(first?.endDate ?? "");
  }, [productId]);

  useEffect(() => { void load(); }, [load]);

  const qty = Number(article?.terms?.quantity ?? 0);
  const periods = article?.unavailabilities ?? [];
  const stock = useMemo(() => {
    if (!from || !to) return rangeAvailability(qty, periods, periods[0]?.startDate ?? "2026-01-01", periods[0]?.endDate ?? "2026-01-01");
    return rangeAvailability(qty, periods, from, to);
  }, [qty, periods, from, to]);

  async function savePeriods(next: UnavailabilityInput[]) {
    setBusy(true); setError(null);
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}/availability`, {
      method: "PATCH",
      json: { unavailabilities: next },
    });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    setArticle(res.data.product);
    setUnavailForm(null);
    setEditIndex(null);
  }

  async function archiveFiche() {
    setBusy(true); setError(null);
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}/archive`, { method: "POST", json: {} });
    setBusy(false);
    if (!res.ok) { setError(res.error); setConfirm(null); return; }
    setArticle(res.data.product);
    setConfirm(null);
  }

  async function deleteFiche() {
    setBusy(true); setError(null);
    const res = await apiFetch(`/partner/products/${productId}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    router.push(paPaths.articles);
  }

  async function togglePause() {
    if (!article) return;
    setBusy(true); setError(null);
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}/pause`, {
      method: "POST",
      json: { paused: article.status === "APPROVED" },
    });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    setArticle(res.data.product);
  }

  function confirmUnavail() {
    if (!unavailForm?.startDate || !unavailForm?.endDate) return;
    const row = { ...unavailForm, quantity: Number(unavailForm.quantity || 1) };
    const next = [...periods];
    if (editIndex != null) next[editIndex] = row;
    else next.push(row);
    void savePeriods(next);
  }

  if (!article) return <p>{paCopy.loading}</p>;
  const published = article.status === "APPROVED";
  const archived = article.status === "ARCHIVED";
  const canDelete = article.status === "DRAFT" || (article.status === "REJECTED" && !article.publishedAt);
  const canArchive = article.status === "APPROVED" || article.status === "DISABLED" || article.status === "REJECTED";
  const catLabel = categoryPathLabel(article.familySlug, article.categorySlug);
  const publicPath = getFamily(article.familySlug)?.publicPath ?? "/";

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={paPaths.articles}>{paCopy.a.crumb}</Link>
        {" / "}
        <strong>{article.title}</strong>
      </p>
      <div className="pa-head">
        <h1>{t.title}</h1>
        {archived ? null : <Link href={publicPath} className="pa-btn">{t.public} ↗</Link>}
      </div>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      <section className="pa-card pa-manage-hero">
        <div className="pa-draft-preview__photo">
          {article.images?.[0]?.url ? <img src={article.images[0].url} alt="" /> : <DpIcon name="camera" />}
        </div>
        <div>
          <h2>{article.title}</h2>
          <ul className="pa-draft-preview__meta">
            <li><DpIcon name="tag" /> {catLabel || familyLabel(article.familySlug)}</li>
            {article.terms?.commune ? <li><DpIcon name="pin" /> {article.terms.commune}</li> : null}
          </ul>
          <p className={`pa-badge ${published ? "pa-badge--ok" : "pa-badge--muted"}`}>
            <DpIcon name={published ? "check" : archived ? "folder" : "pause"} /> {statusLabel(article.status)}
          </p>
        </div>
      </section>

      <div className="pa-grid" style={{ marginTop: "0.75rem" }}>
        <section className="pa-card">
          <PaSect icon="calendar">{t.stockTitle}</PaSect>
          <div className="pa-avail-row">
            <p style={{ margin: 0, fontWeight: 700 }}>{t.qtyTotal.replace("{n}", String(qty)).replace("{unit}", unitWord(article.terms?.rentalMode, qty))}</p>
            {archived ? null : <Link href={paPaths.article(productId, "conditions")} className="pa-link">{t.modify}</Link>}
          </div>
          <div className="pa-consult">
            <PaField id="pa-du" label={t.from} icon="calendar">
              <input id="pa-du" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </PaField>
            <PaField id="pa-au" label={t.to} icon="calendar">
              <input id="pa-au" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </PaField>
            <button type="button" className="pa-btn pa-btn--yellow pa-btn--sm" onClick={() => setFrom(from)}>{t.consult}</button>
          </div>
          <div className="pa-stock">
            <div className="pa-stock__tile"><strong>{stock.total}</strong><span><DpIcon name="layers" /> {t.total}</span></div>
            <div className="pa-stock__tile pa-stock__tile--warn"><strong>{stock.unavailable}</strong><span><DpIcon name="xCircle" /> {t.unavailable}</span></div>
            <div className="pa-stock__tile pa-stock__tile--ok"><strong>{stock.available}</strong><span><DpIcon name="check" /> {t.available}</span></div>
          </div>
          <h3 className="pa-sect" style={{ marginTop: "0.85rem" }}>{t.periods}</h3>
          <table className="pa-mini-table">
            <thead><tr><th>{t.dates}</th><th>{t.qty}</th><th>{t.reason}</th><th>{t.actions}</th></tr></thead>
            <tbody>
              {periods.map((row, i) => (
                <tr key={`${row.startDate}-${i}`}>
                  <td>{formatFrRange(row.startDate, row.endDate)}</td>
                  <td>{row.quantity} {unitWord(article.terms?.rentalMode, row.quantity)}</td>
                  <td>{row.reason || "—"}</td>
                  <td>
                    {archived ? "—" : (
                      <>
                        <button type="button" className="pa-icon-btn" aria-label="Modifier" onClick={() => { setEditIndex(i); setUnavailForm({ ...row }); }}><DpIcon name="pen" /></button>
                        <button type="button" className="pa-icon-btn" aria-label="Supprimer" onClick={() => void savePeriods(periods.filter((_, j) => j !== i))}><DpIcon name="trash" /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {archived ? null : unavailForm ? (
            <div className="pa-unavail__form pa-unavail__form--5" style={{ marginTop: "0.55rem" }}>
              <PaField icon="calendar" label={paCopy.b.unavailStart}><input type="date" value={unavailForm.startDate} onChange={(e) => setUnavailForm((f) => f ? { ...f, startDate: e.target.value } : f)} /></PaField>
              <PaField icon="calendar" label={paCopy.b.unavailEnd}><input type="date" value={unavailForm.endDate} onChange={(e) => setUnavailForm((f) => f ? { ...f, endDate: e.target.value } : f)} /></PaField>
              <PaField label={paCopy.b.unavailQty}><input type="number" min={1} value={unavailForm.quantity} onChange={(e) => setUnavailForm((f) => f ? { ...f, quantity: Number(e.target.value) } : f)} /></PaField>
              <PaField label={t.reason}><input value={unavailForm.reason ?? ""} placeholder="Entretien" onChange={(e) => setUnavailForm((f) => f ? { ...f, reason: e.target.value } : f)} /></PaField>
              <button type="button" className="pa-btn pa-btn--sm" disabled={busy} onClick={confirmUnavail}>Valider</button>
            </div>
          ) : (
            <div className="pa-manage-add">
              <button type="button" className="pa-btn" onClick={() => { setEditIndex(null); setUnavailForm({ startDate: from || "", endDate: to || "", quantity: 1, reason: "" }); }}>+ {t.addUnavail}</button>
              <p className="pa-hint"><DpIcon name="info" /> {t.periodsHint}</p>
            </div>
          )}
        </section>

        <aside>
          <section className="pa-aside">
            <PaSect icon="eye">{t.publication}</PaSect>
            <p className={`pa-badge ${published ? "pa-badge--ok" : "pa-badge--muted"}`}><DpIcon name={published ? "check" : archived ? "folder" : "pause"} /> {statusLabel(article.status)}</p>
            <p>{archived ? t.archivedText : published ? t.publishedText : t.pausedText}</p>
            {archived ? null : (
              <>
                <button type="button" className="pa-btn" style={{ width: "100%", marginTop: "0.55rem" }} disabled={busy} onClick={() => void togglePause()}>
                  <DpIcon name="pause" /> {published ? t.pause : t.resume}
                </button>
                <p className="pa-hint"><DpIcon name="info" /> {t.pauseHint}</p>
              </>
            )}
          </section>
          {archived ? null : (
          <section className="pa-aside" style={{ marginTop: "0.65rem" }}>
            <PaSect icon="folder">{t.dangerTitle}</PaSect>
            {canArchive ? <p>{t.archiveText}</p> : null}
            {canDelete ? <p>{t.deleteText}</p> : null}
            {canArchive ? (
              <button type="button" className="pa-btn" style={{ width: "100%", marginTop: "0.55rem" }} disabled={busy} onClick={() => setConfirm("archive")}>
                {t.archive}
              </button>
            ) : null}
            {canDelete ? (
              <button type="button" className="pa-btn" style={{ width: "100%", marginTop: "0.55rem" }} disabled={busy} onClick={() => setConfirm("delete")}>
                <DpIcon name="trash" /> {t.delete}
              </button>
            ) : null}
            {confirm === "archive" ? (
              <PaConfirm title={t.archiveConfirm} text={t.archiveConfirmText} confirm={t.archive} busy={busy} onCancel={() => setConfirm(null)} onConfirm={() => void archiveFiche()} />
            ) : null}
            {confirm === "delete" ? (
              <PaConfirm title={t.deleteConfirm} text={t.deleteConfirmText} confirm={t.delete} busy={busy} onCancel={() => setConfirm(null)} onConfirm={() => void deleteFiche()} />
            ) : null}
          </section>
          )}
          {archived ? null : (
          <section className="pa-aside" style={{ marginTop: "0.65rem" }}>
            <div className="pa-card__head">
              <PaSect icon="pen" plain>{t.infoTitle}</PaSect>
              <Link href={paPaths.article(productId, "verifier")} className="pa-modify">{t.editFiche}</Link>
            </div>
            <p className="pa-hint"><DpIcon name="info" /> {t.editHint}</p>
          </section>
          )}
        </aside>
      </div>

      <p className="pa-callout pa-callout--info" style={{ marginTop: "0.75rem" }}><DpIcon name="info" /> {t.stockBanner}</p>
    </div>
  );
}
