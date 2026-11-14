"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { abidjanCommunes } from "@/content/partner-profile-wizard";
import {
  articleConditions,
  articleFamilies,
  categoryPathLabel,
  familyLabel,
  getCategory,
  getFamily,
  minDurations,
  pricePeriods,
  rentalModes,
} from "@/content/article-taxonomy";
import { paCopy, paPaths } from "@/content/partner-articles";
import { DpIcon } from "@/components/partners/DpIcon";
import { PaBox, PaConfirm, PaField, PaSect } from "@/components/partners/PaField";
import { formatPrice, type PartnerArticle } from "@/lib/partner-articles";
import type { ArticleTerms, UnavailabilityInput } from "@/lib/article-validation";
import "@/styles/partner-articles.css";

function formatFrDay(iso: string, opts?: { day?: "numeric" | "2-digit"; month?: "long" | "short"; year?: "numeric" }): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC", ...opts });
}

export function formatFrRange(start: string, end: string): string {
  const a = /^(\d{4})-(\d{2})-(\d{2})/.exec(start.trim());
  const b = /^(\d{4})-(\d{2})-(\d{2})/.exec(end.trim());
  if (!a || !b) return `${formatFrDay(start)} – ${formatFrDay(end)}`;
  const da = new Date(Date.UTC(Number(a[1]), Number(a[2]) - 1, Number(a[3])));
  const db = new Date(Date.UTC(Number(b[1]), Number(b[2]) - 1, Number(b[3])));
  const dayA = da.getUTCDate();
  const dayB = db.getUTCDate();
  const monthB = db.toLocaleDateString("fr-FR", { month: "long", timeZone: "UTC" });
  const yearB = db.getUTCFullYear();
  if (a[1] === b[1] && a[2] === b[2]) return `${dayA} – ${dayB} ${monthB} ${yearB}`;
  if (a[1] === b[1]) {
    const monthA = da.toLocaleDateString("fr-FR", { month: "long", timeZone: "UTC" });
    return `${dayA} ${monthA} – ${dayB} ${monthB} ${yearB}`;
  }
  return `${formatFrDay(start)} – ${formatFrDay(end)}`;
}

function unavailUnit(mode: ArticleTerms["rentalMode"], n: number) {
  if (mode === "LOT") return n > 1 ? "lots" : "lot";
  return n > 1 ? "appareils" : "appareil";
}

type Etape = "article" | "conditions" | "verifier" | "suivi";

export function PartnerArticleWizard({ productId }: { productId: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const etape = ((search.get("etape") as Etape) || "article");
  const [article, setArticle] = useState<PartnerArticle | null>(null);
  const [profileApproved, setProfileApproved] = useState(false);
  const [profileTitle, setProfileTitle] = useState("");
  const [profileCommune, setProfileCommune] = useState("");
  const [title, setTitle] = useState("");
  const [familySlug, setFamilySlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryRequest, setCategoryRequest] = useState("");
  const [showCatRequest, setShowCatRequest] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [terms, setTerms] = useState<ArticleTerms>({ availableFrom: "NOW", pickup: true, depositKind: "TO_DISCUSS" });
  const [unavailabilities, setUnavailabilities] = useState<UnavailabilityInput[]>([]);
  const [unavailForm, setUnavailForm] = useState<UnavailabilityInput | null>(null);
  const [unavailEditIndex, setUnavailEditIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropDraft, setDropDraft] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [prod, me] = await Promise.all([
      apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`),
      apiFetch<{ profile: { status: string; commune?: string | null; commercialName?: string | null; organizationName?: string; user: { displayName?: string | null } } }>("/partner/me"),
    ]);
    if (!prod.ok) { setError(prod.error); return; }
    const p = prod.data.product;
    setArticle(p);
    setTitle(p.title ?? "");
    setFamilySlug(p.familySlug ?? "");
    setCategorySlug(p.categorySlug ?? "");
    setCategoryRequest(p.categoryRequest ?? "");
    setShowCatRequest(Boolean(p.categoryRequest));
    setCatOpen(!p.categorySlug);
    setCondition(p.condition ?? "");
    setDescription(p.description ?? "");
    setSpecs(p.specs ?? {});
    const profileCommune = me.ok ? (me.data.profile.commune || "") : "";
    const mergedTerms: ArticleTerms = { availableFrom: "NOW", pickup: true, depositKind: "TO_DISCUSS", ...(p.terms ?? {}) } as ArticleTerms;
    if (!mergedTerms.commune?.trim() && profileCommune) mergedTerms.commune = profileCommune;
    setTerms(mergedTerms);
    setUnavailabilities(p.unavailabilities ?? []);
    if (me.ok) {
      setProfileApproved(me.data.profile.status === "APPROVED");
      setProfileTitle(me.data.profile.commercialName || me.data.profile.organizationName || me.data.profile.user.displayName || "");
      setProfileCommune(profileCommune);
    }
  }, [productId]);

  useEffect(() => { void load(); }, [load]); // eslint-disable-line react-hooks/set-state-in-effect

  function go(next: Etape) {
    router.replace(paPaths.article(productId, next));
  }

  const payload = useCallback(() => ({
    title: title.trim() || "Nouvelle fiche",
    familySlug: familySlug || null,
    categorySlug: categorySlug || null,
    categoryRequest: categoryRequest.trim() || null,
    condition: condition || null,
    description: description || null,
    specs,
    terms: {
      ...terms,
      deliveryFees: terms.delivery ? (terms.deliveryFees?.trim() || paCopy.b.feesAgree) : terms.deliveryFees,
    },
    unavailabilities,
  }), [title, familySlug, categorySlug, categoryRequest, condition, description, specs, terms, unavailabilities]);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`, { method: "PATCH", json: payload() });
    setBusy(false);
    if (!res.ok) { setError(res.error); return false; }
    setArticle(res.data.product);
    return true;
  }

  async function onSaveQuit() {
    if (await save()) router.push(paPaths.articles);
  }

  async function onContinue(next: Etape) {
    if (await save()) go(next);
  }

  async function onSubmit() {
    if (busy) return;
    if (!(await save())) return;
    setBusy(true);
    const res = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}/submit`, { method: "POST" });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    setArticle(res.data.product);
    go("suivi");
  }

  async function onDeleteDraft() {
    setBusy(true);
    setError(null);
    const res = await apiFetch(`/partner/products/${productId}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    router.push(paPaths.articles);
  }

  async function onUpload(file: File) {
    setUploadError(null);
    if ((article?.images?.length ?? 0) >= 4) { setUploadError(paCopy.a.tooMany); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError(paCopy.a.tooLarge); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setUploadError(paCopy.a.badType); return; }
    const body = new FormData();
    body.append("file", file);
    const res = await apiFetch<{ image: { id: string } }>(`/partner/products/${productId}/images`, { method: "POST", body });
    if (!res.ok) {
      const api = res.error ?? "";
      const unavailable = /stockage|configuré|non disponible/i.test(api);
      setUploadError(unavailable ? paCopy.a.uploadUnavailable : (api || paCopy.a.uploadFailed));
      return;
    }
    const fresh = await apiFetch<{ product: PartnerArticle }>(`/partner/products/${productId}`);
    if (fresh.ok) {
      setArticle((current) => current
        ? { ...current, images: fresh.data.product.images, reference: fresh.data.product.reference, status: fresh.data.product.status }
        : fresh.data.product);
    }
  }

  function confirmUnavail() {
    if (!unavailForm?.startDate || !unavailForm?.endDate) return;
    const row = { ...unavailForm, quantity: Number(unavailForm.quantity || 1) };
    if (unavailEditIndex != null) {
      setUnavailabilities((u) => u.map((r, j) => (j === unavailEditIndex ? row : r)));
    } else {
      setUnavailabilities((u) => [...u, row]);
    }
    setUnavailForm(null);
    setUnavailEditIndex(null);
  }

  const family = getFamily(familySlug);
  const category = getCategory(familySlug, categorySlug);
  const specFields = category?.specs ?? [];
  const qty = Number(terms.quantity ?? 0);
  const unitWord = unavailUnit(terms.rentalMode, qty);
  const catLabel = categoryPathLabel(familySlug, categorySlug);
  const specLine = [condition, specs.capacity || specs.memory || specs.composition].filter(Boolean).join(" · ");

  if (!article) return <p className="pa">{error ?? paCopy.loading}</p>;

  const previewPhoto = article.images?.[0]?.url ? (
    <div className="pa-draft-preview__photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.images[0].url} alt="" />
    </div>
  ) : (
    <div className="pa-draft-preview__photo" aria-hidden><DpIcon name="camera" /></div>
  );

  return (
    <div className="pa pa-main-pad">
      <p className="pa-crumb">
        <Link href={paPaths.articles}>{paCopy.a.crumb}</Link>
        {" / "}
        <strong>{article.reference ? paCopy.d.fiche.replace("{ref}", article.reference) : (title || "Nouvelle fiche")}</strong>
        {etape === "verifier" ? " / Vérifier" : null}
      </p>

      {etape !== "suivi" ? (
        <>
          <div className="pa-head">
            <div>
              <h1>{etape === "article" ? paCopy.a.title : etape === "conditions" ? paCopy.b.title : paCopy.c.title} <span className="pa-badge">{paCopy.draft}</span></h1>
              <p>{etape === "article" ? paCopy.a.lead : etape === "conditions" ? paCopy.b.lead : paCopy.c.lead}</p>
            </div>
          </div>
          <nav className="pa-stepper" aria-label="Étapes">
            <Link href={paPaths.article(productId, "article")} className={`pa-step${etape === "article" ? " is-current" : " is-done"}`}>
              <span className="pa-step__n">{etape === "article" ? "1" : <DpIcon name="check" />}</span> {paCopy.a.step1}
            </Link>
            <span className="pa-step__line" aria-hidden />
            <Link href={paPaths.article(productId, "conditions")} className={`pa-step${etape === "conditions" ? " is-current" : etape === "verifier" ? " is-done" : ""}`}>
              <span className="pa-step__n">{etape === "verifier" ? <DpIcon name="check" /> : "2"}</span> {paCopy.a.step2}
            </Link>
            <span className="pa-step__line" aria-hidden />
            <Link href={paPaths.article(productId, "verifier")} className={`pa-step${etape === "verifier" ? " is-current" : ""}`}>
              <span className="pa-step__n">3</span> {paCopy.a.step3}
            </Link>
          </nav>
        </>
      ) : (
        <div className="pa-head">
          <div>
            <h1>{paCopy.d.title} <span className="pa-badge pa-badge--review">{paCopy.d.badge}</span></h1>
            <p>{paCopy.d.lead}</p>
          </div>
        </div>
      )}

      {error ? <p className="pa-error" role="alert">{error}</p> : null}

      {etape === "article" ? (
        <div className="pa-grid">
          <section className="pa-card">
            <PaField id="pa-name" label={paCopy.a.name} className="pa-field pa-field--full">
              <input id="pa-name" value={title} onChange={(e) => setTitle(e.target.value)} />
            </PaField>

            <div className="pa-field pa-field--full" style={{ marginTop: "0.65rem" }}>
              <label>{paCopy.a.category}</label>
              <div className="pa-cat__row">
                <PaBox icon="tag">
                  <input
                    id="pa-cat-display"
                    readOnly
                    value={catLabel || ""}
                    placeholder="Choisir une catégorie"
                    aria-label={paCopy.a.category}
                    onClick={() => setCatOpen(true)}
                  />
                </PaBox>
                <button type="button" className="pa-btn pa-btn--ghost" onClick={() => setCatOpen((v) => !v)}>{paCopy.a.categoryChange}</button>
              </div>
              {catOpen ? (
                <div className="pa-cat__panel">
                  <PaField select>
                    <select aria-label="Famille" value={familySlug} onChange={(e) => { setFamilySlug(e.target.value); setCategorySlug(""); }}>
                      <option value="">Famille</option>
                      {articleFamilies.map((f) => <option key={f.slug} value={f.slug}>{f.label}</option>)}
                    </select>
                  </PaField>
                  <PaField select>
                    <select aria-label="Catégorie" value={categorySlug} onChange={(e) => { setCategorySlug(e.target.value); if (e.target.value) setCatOpen(false); }} disabled={!family}>
                      <option value="">Catégorie</option>
                      {family?.categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                    </select>
                  </PaField>
                </div>
              ) : null}
              <p style={{ margin: "0.35rem 0 0" }}><button type="button" className="pa-link pa-link--quiet" onClick={() => setShowCatRequest((v) => !v)}>{paCopy.a.categoryMissing}</button></p>
              {showCatRequest ? (
                <PaField id="pa-catreq" label={paCopy.a.categoryRequestLabel} className="pa-field" >
                  <input id="pa-catreq" value={categoryRequest} onChange={(e) => setCategoryRequest(e.target.value)} />
                </PaField>
              ) : null}
              {showCatRequest ? <p className="pa-hint">{paCopy.a.categoryMissingHint}</p> : null}
            </div>

            <div style={{ marginTop: "0.55rem" }}>
              <div className="pa-photos-head">
                <PaSect plain>{paCopy.a.photos}</PaSect>
                <p className="pa-meta">{paCopy.a.photosCount.replace("{n}", String(article.images?.length ?? 0))}</p>
              </div>
              <div className="pa-photos">
                {(article.images ?? []).map((img, i) => (
                  <div className="pa-photo" key={img.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {img.url ? <img src={img.url} alt="" /> : null}
                    {i === 0 ? <span className="pa-badge">{paCopy.a.mainPhoto}</span> : null}
                  </div>
                ))}
                {(article.images?.length ?? 0) < 4 ? (
                  <label className="pa-photo-add">
                    <DpIcon name="camera" />
                    {paCopy.a.addPhoto}
                    <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void onUpload(f); e.target.value = ""; }} />
                  </label>
                ) : null}
              </div>
              {uploadError ? <p className="pa-flag">{uploadError}</p> : null}
            </div>

            <div style={{ marginTop: "0.55rem" }}>
              <PaSect plain>{paCopy.a.specs}</PaSect>
              <div className="pa-specs">
                <PaField id="pa-cond" label={paCopy.a.condition} select>
                  <select id="pa-cond" value={condition} onChange={(e) => setCondition(e.target.value)}>
                    <option value="">—</option>
                    {articleConditions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </PaField>
                {specFields.map((field) => (
                  <PaField id={`pa-spec-${field.id}`} key={field.id} label={field.label} optional={field.optional}>
                    <input id={`pa-spec-${field.id}`} placeholder={field.placeholder} value={specs[field.id] ?? ""} onChange={(e) => setSpecs((s) => ({ ...s, [field.id]: e.target.value }))} />
                  </PaField>
                ))}
                <PaField id="pa-desc" label={paCopy.a.description} className="pa-field pa-field--full">
                  <textarea id="pa-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                </PaField>
              </div>
            </div>
          </section>
          <aside className="pa-aside pa-draft-preview">
            <span className="pa-badge">{paCopy.a.preview}</span>
            {previewPhoto}
            <h3>{title || "Nouvelle fiche"}</h3>
            <ul className="pa-draft-preview__meta">
              {specLine ? <li><DpIcon name="gear" /> {specLine}</li> : null}
              {familySlug ? <li><DpIcon name="tag" /> {familyLabel(familySlug) || catLabel}</li> : null}
            </ul>
            <p className="pa-badge pa-badge--muted"><DpIcon name="eyeOff" /> {paCopy.notVisible}</p>
            <p className="pa-callout pa-callout--panel" style={{ marginTop: "0.55rem" }}><DpIcon name="info" /> {paCopy.a.previewHint}</p>
          </aside>
        </div>
      ) : null}

      {etape === "conditions" ? (
        <div className="pa-grid">
          <div>
            <section className="pa-card">
              <PaSect icon="coins">{paCopy.b.qtyTitle}</PaSect>
              <div className="pa-fields">
                <PaField id="pa-qty" label={paCopy.b.quantity} required>
                  <input id="pa-qty" type="number" min={1} value={terms.quantity ?? ""} onChange={(e) => setTerms((t) => ({ ...t, quantity: e.target.value ? Number(e.target.value) : undefined }))} />
                </PaField>
                <PaField id="pa-mode" label={paCopy.b.rentalMode} required select>
                  <select id="pa-mode" value={terms.rentalMode ?? "UNIT"} onChange={(e) => setTerms((t) => ({ ...t, rentalMode: e.target.value as "UNIT" | "LOT" }))}>
                    {rentalModes.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </PaField>
                <PaField id="pa-price" label={paCopy.b.price} required suffix="FCFA">
                  <input id="pa-price" type="number" min={0} value={terms.priceAmount ?? ""} onChange={(e) => setTerms((t) => ({ ...t, priceAmount: e.target.value ? Number(e.target.value) : undefined }))} />
                </PaField>
                {terms.rentalMode === "LOT" ? (
                  <>
                    <PaField id="pa-lots" label={paCopy.b.lotCount} required>
                      <input id="pa-lots" type="number" min={1} value={terms.lotCount ?? ""} onChange={(e) => setTerms((t) => ({ ...t, lotCount: e.target.value ? Number(e.target.value) : undefined, quantity: e.target.value ? Number(e.target.value) : t.quantity }))} />
                    </PaField>
                    <PaField id="pa-pieces" label={paCopy.b.piecesPerLot} required>
                      <input id="pa-pieces" type="number" min={1} value={terms.piecesPerLot ?? ""} onChange={(e) => setTerms((t) => ({ ...t, piecesPerLot: e.target.value ? Number(e.target.value) : undefined }))} />
                    </PaField>
                    <span />
                  </>
                ) : null}
                <PaField id="pa-period" label={paCopy.b.period} required select>
                  <select id="pa-period" value={terms.pricePeriod ?? "WEEK"} onChange={(e) => setTerms((t) => ({ ...t, pricePeriod: e.target.value as ArticleTerms["pricePeriod"] }))}>
                    {pricePeriods.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </PaField>
                <PaField id="pa-min" label={paCopy.b.minDuration} required select>
                  <select id="pa-min" value={terms.minDuration ?? "1_WEEK"} onChange={(e) => setTerms((t) => ({ ...t, minDuration: e.target.value }))}>
                    {minDurations.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </PaField>
                <PaField id="pa-deposit" label={paCopy.b.deposit} required select>
                  <select id="pa-deposit" value={terms.depositKind ?? "TO_DISCUSS"} onChange={(e) => setTerms((t) => ({ ...t, depositKind: e.target.value as ArticleTerms["depositKind"] }))}>
                    <option value="TO_DISCUSS">{paCopy.b.discuss}</option>
                    <option value="AMOUNT">Montant en FCFA</option>
                  </select>
                </PaField>
              </div>
              <p className="pa-callout" style={{ marginTop: "0.6rem" }}><DpIcon name="info" /> {paCopy.b.priceHint}</p>
            </section>
            <section className="pa-card" style={{ marginTop: "0.65rem" }}>
              <PaSect icon="calendar">{paCopy.b.availTitle}</PaSect>
              <div className="pa-avail-row">
                <PaField id="pa-from" label={paCopy.b.availableFrom} required select icon="calendar">
                  <select id="pa-from" value={terms.availableFrom ?? "NOW"} onChange={(e) => setTerms((t) => ({ ...t, availableFrom: e.target.value }))}>
                    <option value="NOW">{paCopy.b.availableNow}</option>
                  </select>
                </PaField>
                <button type="button" className="pa-btn pa-btn--yellow pa-btn--sm" onClick={() => { setUnavailEditIndex(null); setUnavailForm({ startDate: "", endDate: "", quantity: 1 }); }}>+ {paCopy.b.addUnavail}</button>
              </div>
              <div className="pa-unavail">
                {unavailabilities.map((row, i) => {
                  if (unavailEditIndex === i) return null;
                  const n = Number(row.quantity || 0);
                  const left = Math.max(0, qty - n);
                  const unit = unavailUnit(terms.rentalMode, n);
                  const leftUnit = unavailUnit(terms.rentalMode, left);
                  return (
                    <div key={`${row.startDate}-${i}`}>
                      <div className="pa-chip">
                        <DpIcon name="calendar" />
                        <span className="pa-chip__text">{formatFrRange(row.startDate, row.endDate)} · {n} {unit} indisponible{n > 1 ? "s" : ""}</span>
                        <button type="button" className="pa-icon-btn" aria-label="Modifier la période" onClick={() => { setUnavailEditIndex(i); setUnavailForm({ ...row }); }}><DpIcon name="pen" /></button>
                        <button type="button" className="pa-icon-btn" aria-label="Supprimer" onClick={() => setUnavailabilities((u) => u.filter((_, j) => j !== i))}><DpIcon name="trash" /></button>
                      </div>
                      {qty > 0 && row.startDate && row.endDate ? (
                        <p className="pa-hint pa-hint--remain"><DpIcon name="info" /> {(left > 1 ? paCopy.b.remainPlural : paCopy.b.remain).replace("{left}", String(left)).replace("{unit}", leftUnit).replace("{total}", String(qty))}</p>
                      ) : null}
                    </div>
                  );
                })}
                {unavailForm ? (
                  <div className="pa-unavail__form">
                    <PaField icon="calendar" label={paCopy.b.unavailStart}>
                      <input type="date" aria-label={paCopy.b.unavailStart} value={unavailForm.startDate} onChange={(e) => setUnavailForm((f) => f ? { ...f, startDate: e.target.value } : f)} />
                    </PaField>
                    <PaField icon="calendar" label={paCopy.b.unavailEnd}>
                      <input type="date" aria-label={paCopy.b.unavailEnd} value={unavailForm.endDate} onChange={(e) => setUnavailForm((f) => f ? { ...f, endDate: e.target.value } : f)} />
                    </PaField>
                    <PaField label={paCopy.b.unavailQty}>
                      <input type="number" min={1} max={qty || undefined} aria-label={paCopy.b.unavailQty} value={unavailForm.quantity} onChange={(e) => setUnavailForm((f) => f ? { ...f, quantity: Number(e.target.value) } : f)} />
                    </PaField>
                    <button type="button" className="pa-btn pa-btn--sm" onClick={confirmUnavail}>Valider</button>
                  </div>
                ) : null}
              </div>
            </section>
            <section className="pa-card" style={{ marginTop: "0.65rem" }}>
              <PaSect icon="van">{paCopy.b.pickupTitle}</PaSect>
              <div className="pa-pickup">
                <PaField id="pa-commune" label={paCopy.b.commune} required select icon="pin">
                  <select id="pa-commune" value={terms.commune ?? ""} onChange={(e) => setTerms((t) => ({ ...t, commune: e.target.value }))}>
                    <option value="">—</option>
                    {abidjanCommunes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </PaField>
                <div className="pa-pickup__checks">
                  <label className="pa-check"><input type="checkbox" checked={Boolean(terms.pickup)} onChange={(e) => setTerms((t) => ({ ...t, pickup: e.target.checked }))} /> <DpIcon name="shop" /> {paCopy.b.pickup}</label>
                  <label className="pa-check"><input type="checkbox" checked={Boolean(terms.delivery)} onChange={(e) => setTerms((t) => ({
                    ...t,
                    delivery: e.target.checked,
                    deliveryFees: e.target.checked ? (t.deliveryFees || paCopy.b.feesAgree) : t.deliveryFees,
                  }))} /> <DpIcon name="van" /> {paCopy.b.delivery}</label>
                </div>
                {terms.delivery ? (
                  <div className="pa-pickup__zone">
                    <PaField id="pa-zone" label={paCopy.b.deliveryZone} required icon="pin">
                      <input id="pa-zone" value={terms.deliveryZone ?? ""} onChange={(e) => setTerms((t) => ({ ...t, deliveryZone: e.target.value }))} />
                    </PaField>
                    <PaField id="pa-fees" label={paCopy.b.deliveryFees} required>
                      <input id="pa-fees" value={terms.deliveryFees ?? ""} placeholder={paCopy.b.feesAgree} onChange={(e) => setTerms((t) => ({ ...t, deliveryFees: e.target.value }))} />
                    </PaField>
                  </div>
                ) : <div />}
                <div className="pa-pickup__checks pa-pickup__checks--solo">
                  <label className="pa-check"><input type="checkbox" checked={Boolean(terms.installation)} onChange={(e) => setTerms((t) => ({ ...t, installation: e.target.checked }))} /> <DpIcon name="tools" /> {paCopy.b.installation}</label>
                </div>
              </div>
            </section>
          </div>
          <aside className="pa-aside pa-draft-preview">
            <span className="pa-badge">{paCopy.draft}</span>
            {previewPhoto}
            <h3>{title || "Nouvelle fiche"}</h3>
            <ul className="pa-draft-preview__meta">
              {condition ? <li><DpIcon name="gear" /> {condition}</li> : null}
              <li><DpIcon name="layers" /> {qty ? `${qty} ${unitWord}` : paCopy.list.qtyToSet}</li>
              {formatPrice(terms) !== "—" ? <li><DpIcon name="tag" /> {formatPrice(terms)}</li> : null}
              {terms.commune ? <li><DpIcon name="pin" /> {terms.commune}</li> : null}
            </ul>
            <p className="pa-callout pa-callout--panel" style={{ marginTop: "0.55rem" }}><DpIcon name="info" /> {paCopy.b.sideHint}</p>
          </aside>
        </div>
      ) : null}

      {etape === "verifier" ? (
        <div className="pa-grid">
          <div>
            <section className="pa-card">
              <div className="pa-card__head">
                <PaSect icon="box">{paCopy.c.article}</PaSect>
                <Link href={paPaths.article(productId, "article")} className="pa-modify"><DpIcon name="pen" /> {paCopy.modify}</Link>
              </div>
              <div className="pa-recap-article">
                {article.images?.[0]?.url ? (
                  <div className="pa-draft-preview__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.images[0].url} alt="" />
                  </div>
                ) : <div className="pa-draft-preview__photo" aria-hidden><DpIcon name="camera" /></div>}
                <div>
                  <h3>{title}</h3>
                  <p>{catLabel}</p>
                  {specLine ? <p className="pa-draft-preview__meta" style={{ display: "flex", gap: "0.4rem", margin: "0.2rem 0" }}><DpIcon name="gear" /> {specLine}</p> : null}
                  <p className="pa-draft-preview__meta" style={{ display: "flex", gap: "0.4rem", margin: "0.2rem 0" }}><DpIcon name="camera" /> {(article.images?.length ?? 0)} photo{(article.images?.length ?? 0) > 1 ? "s" : ""}</p>
                  <p>{description}</p>
                </div>
              </div>
            </section>
            <section className="pa-card" style={{ marginTop: "0.65rem" }}>
              <div className="pa-card__head">
                <PaSect icon="sliders">{paCopy.c.conditions}</PaSect>
                <Link href={paPaths.article(productId, "conditions")} className="pa-modify"><DpIcon name="pen" /> {paCopy.modify}</Link>
              </div>
              <table className="pa-recap">
                <tbody>
                  <tr><th>{paCopy.c.qty}</th><td>{qty ? `${qty} ${unitWord}` : "—"}</td></tr>
                  <tr><th>{paCopy.c.price}</th><td>{formatPrice(terms)}</td></tr>
                  <tr><th>{paCopy.c.minDuration}</th><td>{minDurations.find((d) => d.id === terms.minDuration)?.label ?? "—"}</td></tr>
                  <tr><th>{paCopy.c.deposit}</th><td>{terms.depositKind === "TO_DISCUSS" ? paCopy.b.discuss : (terms.depositAmount ?? "—")}</td></tr>
                  <tr><th>{paCopy.c.commune}</th><td>{terms.commune ?? "—"}</td></tr>
                  <tr><th>{paCopy.c.pickup}</th><td>{terms.pickup ? "Sur place" : "—"}</td></tr>
                  <tr><th>{paCopy.c.delivery}</th><td>{terms.delivery ? `${terms.deliveryZone ?? ""}${terms.deliveryFees ? `, ${terms.deliveryFees}` : ""}` : "—"}</td></tr>
                  <tr><th>{paCopy.c.unavail}</th><td>{unavailabilities.length ? unavailabilities.map((u) => {
                    const n = Number(u.quantity || 0);
                    const unit = unavailUnit(terms.rentalMode, n);
                    return `${formatFrRange(u.startDate, u.endDate)} : ${n} ${unit} indisponible${n > 1 ? "s" : ""}`;
                  }).join(" ; ") : "—"}</td></tr>
                </tbody>
              </table>
            </section>
          </div>
          <aside>
            <div className="pa-aside">
              <PaSect icon="send">{paCopy.c.afterTitle}</PaSect>
              <ul className="pa-how">
                {paCopy.c.after.map((item) => (
                  <li key={item.title}>
                    <span className="pa-how__icon" aria-hidden><DpIcon name={item.icon} /></span>
                    <div><strong>{item.title}</strong><p>{item.text}</p></div>
                  </li>
                ))}
              </ul>
              <p className="pa-callout pa-callout--info" style={{ marginTop: "0.65rem" }}><DpIcon name="info" /> <strong>{paCopy.c.notImmediate}</strong></p>
              <p style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}><DpIcon name="calendar" /> {paCopy.c.follow}</p>
            </div>
            {!profileApproved ? (
              <div className="pa-aside" style={{ marginTop: "0.65rem" }}>
                <h2>{paCopy.c.blockedTitle}</h2>
                <p>{paCopy.c.blockedText}</p>
                <Link href={paPaths.profileSuivi} className="pa-link">{paCopy.c.blockedLink}</Link>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      {etape === "suivi" ? (
        <>
        <div className="pa-grid">
          <section className="pa-card">
            <div className="pa-recap-article">
              {previewPhoto}
              <div>
                <h2>{title}</h2>
                <ul className="pa-draft-preview__meta">
                  {catLabel ? <li><DpIcon name="tag" /> {catLabel}</li> : null}
                  <li><DpIcon name="layers" /> {[qty ? `${qty} ${unitWord}` : null, terms.commune].filter(Boolean).join(" · ")}</li>
                  {article.reference ? <li><DpIcon name="list" /> {paCopy.d.fiche.replace("{ref}", article.reference)}</li> : null}
                </ul>
              </div>
            </div>
            <div className="pa-tracker" aria-label={paCopy.d.title}>
              <div className="pa-tracker__row">
                <span className="pa-tracker__dot is-done"><DpIcon name="check" /></span>
                <span className="pa-tracker__line is-done" />
                <span className="pa-tracker__dot is-current"><DpIcon name="search" /></span>
                <span className="pa-tracker__line" />
                <span className="pa-tracker__dot"><DpIcon name="clock" /></span>
              </div>
              <div className="pa-tracker__labels">
                <span className="pa-tracker__label is-done">{paCopy.d.step1}</span>
                <span className="pa-tracker__label is-current">{paCopy.d.step2}</span>
                <span className="pa-tracker__label">{paCopy.d.step3}</span>
              </div>
            </div>
            <h2>{paCopy.d.nextTitle}</h2>
            <div className="pa-next">
              <ul className="pa-next__list">
                {paCopy.d.next.map((item) => (
                  <li key={item.text}>
                    <span className="pa-how__icon" aria-hidden><DpIcon name={item.icon} /></span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <div className="pa-next__aside">
                <Link href={paPaths.article(productId, "verifier")}><DpIcon name="list" /> {paCopy.d.consult}</Link>
              </div>
            </div>
          </section>
          <aside>
            {profileApproved ? (
              <div className="pa-callout pa-callout--ok"><DpIcon name="check" /><div><strong>{paCopy.d.profileOk}</strong><p>{profileTitle}{profileCommune ? ` · ${profileCommune}` : ""}</p></div></div>
            ) : null}
            <div className="pa-callout pa-callout--info" style={{ marginTop: "0.65rem" }}><div><strong>{paCopy.d.inReview}</strong><p>{paCopy.d.inReviewText}</p></div></div>
          </aside>
        </div>
        </>
      ) : null}

      {etape === "suivi" ? (
        <div className="pa-sticky">
          <div className="pa-sticky__bar">
            <Link href={paPaths.articles} className="pa-btn pa-btn--yellow">{paCopy.seeArticles} →</Link>
            <Link href={paPaths.nouveau} className="pa-btn">+ {paCopy.proposeAnother}</Link>
          </div>
        </div>
      ) : (
        <div className="pa-sticky">
          <div className="pa-sticky__bar">
            <button type="button" className="pa-btn" onClick={() => etape === "article" ? router.push(paPaths.articles) : go(etape === "verifier" ? "conditions" : "article")}>← {paCopy.back}</button>
            <div className="pa-sticky__right">
              {article?.status === "DRAFT" ? (
                <button type="button" className="pa-link" disabled={busy} onClick={() => setDropDraft(true)}>{paCopy.manage.delete}</button>
              ) : null}
              <button type="button" className="pa-btn" disabled={busy} onClick={() => void onSaveQuit()}>{busy ? paCopy.saving : paCopy.saveQuit}</button>
              {etape === "verifier" ? (
                <button type="button" className="pa-btn pa-btn--yellow" disabled={busy || !profileApproved} onClick={() => void onSubmit()}>{busy ? paCopy.sending : paCopy.send} →</button>
              ) : (
                <button type="button" className="pa-btn pa-btn--yellow" disabled={busy} onClick={() => void onContinue(etape === "article" ? "conditions" : "verifier")}>
                  {etape === "article" ? paCopy.continueConditions : paCopy.continueVerify} →
                </button>
              )}
            </div>
          </div>
          {dropDraft ? (
            <PaConfirm
              title={paCopy.manage.deleteConfirm}
              text={paCopy.manage.deleteConfirmText}
              confirm={paCopy.manage.delete}
              busy={busy}
              onCancel={() => setDropDraft(false)}
              onConfirm={() => void onDeleteDraft()}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
