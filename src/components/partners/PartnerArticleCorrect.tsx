"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { categoryPathLabel, familyLabel } from "@/content/article-taxonomy";
import { paCopy, paPaths } from "@/content/partner-articles";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaConfirm, PaField, PaSect } from "@/components/partners/PaField";
import { quantityLabel, type PartnerArticle } from "@/lib/partner-articles";
import "@/styles/partner-articles.css";

export function PartnerArticleCorrect({ productId }: { productId: string }) {
  const router = useRouter();
  const t = paCopy.correct;
  const [article, setArticle] = useState<PartnerArticle | null>(null);
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [note, setNote] = useState("");
  const [replaced, setReplaced] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [abandon, setAbandon] = useState(false);

  const load = useCallback(async () => {
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`);
    if (!res.ok) { setError(res.error); return; }
    const p = res.data.product;
    setArticle(p);
    setHeight(p.specs?.height ?? "");
    setWidth(p.specs?.width ?? "");
    setDepth(p.specs?.depth ?? "");
    setNote(p.specs?.teamMessage ?? "");
  }, [productId]);

  useEffect(() => { void load(); }, [load]);

  const photoItems = (article?.corrections?.items ?? []).filter((item) => item.kind === "replace_photo");
  const needDims = (article?.corrections?.items ?? []).some((item) => item.kind === "dimensions");
  const flagged = new Set(photoItems.map((item) => item.kind === "replace_photo" ? item.imageId : ""));

  async function saveSpecs() {
    const dimensions = [height, width, depth].every((v) => v.trim())
      ? `${height.trim()} × ${width.trim()} × ${depth.trim()} cm`
      : article?.specs?.dimensions ?? "";
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`, {
      method: "PATCH",
      json: {
        specs: {
          ...(article?.specs ?? {}),
          height: height.trim(),
          width: width.trim(),
          depth: depth.trim(),
          dimensions,
          teamMessage: note.trim(),
        },
      },
    });
    if (!res.ok) { setError(res.error); return false; }
    setArticle(res.data.product);
    return true;
  }

  async function onReplace(imageId: string, file: File) {
    setUploadError(null);
    if (file.size > 5 * 1024 * 1024) { setUploadError(paCopy.a.tooLarge); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setUploadError(paCopy.a.badType); return; }
    const body = new FormData();
    body.append("file", file);
    const res = await apiFetch<{ image: { id: string } }>(`/partner/products/${productId}/images?replace=${encodeURIComponent(imageId)}`, { method: "POST", body });
    if (!res.ok) { setUploadError(res.error || paCopy.a.uploadFailed); return; }
    setReplaced((ids) => [...ids, imageId]);
    await load();
  }

  async function onSave() {
    setBusy(true); setError(null);
    await saveSpecs();
    setBusy(false);
  }

  async function onResend() {
    setBusy(true); setError(null);
    if (!(await saveSpecs())) { setBusy(false); return; }
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}/submit`, { method: "POST" });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    window.location.href = paPaths.article(productId, "suivi");
  }

  async function onAbandon() {
    setBusy(true); setError(null);
    const res = await apiFetch(`/partner/products/${productId}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    router.push(paPaths.articles);
  }

  if (!article) return <p>{paCopy.loading}</p>;
  const catLabel = categoryPathLabel(article.familySlug, article.categorySlug);
  const teamMessage = article.corrections?.message || article.rejectionReason || "";
  const photoTitle = photoItems.find((item) => item.kind === "replace_photo")?.title || paCopy.a.photos;

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={paPaths.articles}>{paCopy.a.crumb}</Link>
        {" / "}
        <strong>{article.title}</strong>
      </p>
      <div className="pa-head">
        <div>
          <h1>{t.title} <span className="pa-badge">{t.badge}</span></h1>
          <p>{t.lead}</p>
        </div>
      </div>
      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      <div className="pa-grid">
        <div>
          {teamMessage ? (
            <section className="pa-callout pa-callout--info" style={{ marginBottom: "0.75rem" }}>
              <DpIcon name="chat" />
              <div><strong>{t.teamTitle}</strong><p style={{ margin: "0.2rem 0 0", fontStyle: "italic" }}>“{teamMessage}”</p></div>
            </section>
          ) : null}

          <section className="pa-card">
            <PaSect icon="camera">{photoTitle}</PaSect>
            <div className="pa-photos">
              {(article.images ?? []).map((img) => {
                const flag = flagged.has(img.id) && !replaced.includes(img.id);
                return (
                  <div className={`pa-photo${flag ? " is-flagged" : ""}`} key={img.id}>
                    {img.url ? <img src={img.url} alt="" /> : null}
                    {flag ? <span className="pa-badge"><DpIcon name="info" /> {t.replace}</span> : null}
                  </div>
                );
              })}
              {photoItems[0] && photoItems[0].kind === "replace_photo" ? (
                <label className="pa-photo-add">
                  <DpIcon name="upload" />
                  {t.replacePhoto}
                  <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => {
                    const f = e.target.files?.[0];
                    const id = photoItems[0] && photoItems[0].kind === "replace_photo" ? photoItems[0].imageId : "";
                    if (f && id) void onReplace(id, f);
                    e.target.value = "";
                  }} />
                </label>
              ) : null}
            </div>
            <p className="pa-meta" style={{ marginTop: "0.45rem" }}><DpIcon name="info" /> {t.photoMeta}</p>
            {uploadError ? <p className="pa-flag">{uploadError}</p> : null}
          </section>

          {needDims ? (
            <section className="pa-card" style={{ marginTop: "0.65rem" }}>
              <PaSect icon="sliders">{t.dimensions}</PaSect>
              <div className="pa-fields">
                <PaField id="pa-h" label={t.height}><input id="pa-h" inputMode="numeric" placeholder={t.dimPlaceholder} value={height} onChange={(e) => setHeight(e.target.value)} /></PaField>
                <PaField id="pa-w" label={t.width}><input id="pa-w" inputMode="numeric" placeholder={t.dimPlaceholder} value={width} onChange={(e) => setWidth(e.target.value)} /></PaField>
                <PaField id="pa-d" label={t.depth}><input id="pa-d" inputMode="numeric" placeholder={t.dimPlaceholder} value={depth} onChange={(e) => setDepth(e.target.value)} /></PaField>
              </div>
            </section>
          ) : null}

          <section className="pa-card" style={{ marginTop: "0.65rem" }}>
            <PaSect icon="chat">{t.teamReply}</PaSect>
            <PaField className="pa-field pa-field--full">
              <textarea value={note} placeholder={t.teamReplyPh} onChange={(e) => setNote(e.target.value)} />
            </PaField>
          </section>
        </div>

        <aside className="pa-aside pa-draft-preview">
          <div className="pa-draft-preview__photo">
            {article.images?.[0]?.url ? <img src={article.images[0].url} alt="" /> : <DpIcon name="camera" />}
          </div>
          <h3>{article.title}</h3>
          <ul className="pa-draft-preview__meta">
            <li><DpIcon name="tag" /> {catLabel || familyLabel(article.familySlug)}</li>
            <li><DpIcon name="layers" /> {quantityLabel(article)}{article.terms?.commune ? ` · ${article.terms.commune}` : ""}</li>
          </ul>
          <p className="pa-badge"><DpIcon name="info" /> {t.badge}</p>
          <p className="pa-badge pa-badge--muted" style={{ marginTop: "0.4rem" }}><DpIcon name="eyeOff" /> {t.unpublished}</p>
          <p className="pa-callout pa-callout--panel" style={{ marginTop: "0.55rem" }}><DpIcon name="info" /> {t.kept}</p>
        </aside>
      </div>

      <div className="pa-sticky">
        <div className="pa-sticky__bar">
          <Link href={paPaths.articles} className="pa-btn">← {t.back}</Link>
          {!article.publishedAt ? (
            <button type="button" className="pa-link" disabled={busy} onClick={() => setAbandon(true)}>{paCopy.manage.abandon}</button>
          ) : null}
          <div className="pa-sticky__right">
            <button type="button" className="pa-btn" disabled={busy} onClick={() => void onSave()}>{busy ? paCopy.saving : t.save}</button>
            <button type="button" className="pa-btn pa-btn--yellow" disabled={busy} onClick={() => void onResend()}>{t.resend} →</button>
          </div>
        </div>
        <p className="pa-meta" style={{ textAlign: "right", marginTop: "0.35rem" }}><DpIcon name="info" /> {t.footerNote}</p>
        {abandon ? (
          <PaConfirm
            title={paCopy.manage.deleteConfirm}
            text={paCopy.manage.deleteConfirmText}
            confirm={paCopy.manage.abandon}
            busy={busy}
            onCancel={() => setAbandon(false)}
            onConfirm={() => void onAbandon()}
          />
        ) : null}
      </div>
    </div>
  );
}
