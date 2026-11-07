"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { HubFormSavedSection } from "@/components/forms/HubFormSavedSection";
import { temForm, temImage, temProducts, temSummary } from "@/content/tools-hub";
import { useTem } from "./TemContext";
import { TemDate } from "./TemDate";
import { TemIcon } from "./TemIcon";

export function TemForm() {
  const t = useTem();
  const f = temForm;
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const done = [
    t.named.length > 0,
    Boolean(t.zone.trim() || t.start || t.end || t.usageText.trim()),
    Boolean(t.name.trim() || t.phone.trim()),
  ];
  const current = done.findIndex((d) => !d);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await t.prepare();
  };

  const onAddRow = () => {
    const key = t.addRow();
    window.requestAnimationFrame(() => document.getElementById(`tem-eq-${key}`)?.focus());
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    t.pickFile(e.dataTransfer.files?.[0] ?? null);
  };

  const firstProduct = t.named.find((i) => i.productId);
  const product = firstProduct ? temProducts.find((p) => p.id === firstProduct.productId) : undefined;
  const period =
    t.fields.start || t.fields.end ? `${t.fields.start || temSummary.toSpecify} → ${t.fields.end || temSummary.toSpecify}` : temSummary.toSpecify;

  return (
    <section id={f.id} className="tem-section tem-form-section" aria-labelledby="tem-form-title">
      <div className="tem-wrap">
        <h2 id="tem-form-title" className="tem-h2 tem-h2--form">
          <span className="tem-underline">{f.titleBefore}</span>
          {f.titleAfter}
        </h2>
        <p className="tem-lead">{f.lead}</p>

        <div className="tem-form-grid">
          <form className="tem-form" onSubmit={onSubmit} noValidate aria-label="Demande de matériel">
            <ol className="tem-stepper" aria-label="Étapes de la demande">
              {f.steps.map((label, i) => {
                const state = done[i] ? "is-done" : i === current ? "is-current" : "";
                return (
                  <li key={label} className={state} aria-current={i === current ? "step" : undefined}>
                    <span className="tem-stepper__num">
                      {done[i] ? <TemIcon name="check" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="tem-stepper__label">{label}</span>
                  </li>
                );
              })}
            </ol>

            <fieldset className="tem-fs">
              <legend>{f.equipmentLabel}</legend>
              <ul className="tem-rows">
                {t.items.map((item, i) => {
                  const p = item.productId ? temProducts.find((x) => x.id === item.productId) : undefined;
                  return (
                    <li key={item.key} className="tem-row">
                      <span className="tem-row__thumb">
                        {p ? <Image src={temImage(p.image)} alt="" width={80} height={64} className="tem-row__img" /> : <TemIcon name="box" strokeWidth={1.3} />}
                      </span>
                      <span className="tem-field tem-field--grow">
                        <input
                          id={`tem-eq-${item.key}`}
                          type="text"
                          value={item.name}
                          placeholder={f.equipmentPlaceholder}
                          aria-label={`${f.equipmentLabel} ${i + 1}`}
                          onChange={(e) => t.setItemName(item.key, e.target.value)}
                          autoComplete="off"
                        />
                      </span>
                      <button type="button" className="tem-iconbtn" aria-label={`${f.remove} ${i + 1}`} onClick={() => t.removeRow(item.key)}>
                        <TemIcon name="trash" strokeWidth={1.6} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="tem-btn tem-btn--soft" onClick={onAddRow}>
                <TemIcon name="circlePlus" strokeWidth={1.6} />
                {f.addAnother}
              </button>
            </fieldset>

            <div className="tem-form__project">
              <div>
                <label htmlFor="tem-zone" className="tem-label">
                  {f.cityLabel}
                </label>
                <span className="tem-field tem-field--icon">
                  <TemIcon name="pin" strokeWidth={1.5} />
                  <input id="tem-zone" type="text" value={t.zone} placeholder={f.cityPlaceholder} onChange={(e) => t.setZone(e.target.value)} autoComplete="address-level2" />
                </span>
              </div>
              <div>
                <label htmlFor="tem-start" className="tem-label">
                  {f.startLabel}
                </label>
                <TemDate id="tem-start" value={t.start} onChange={t.setStart} placeholder={f.datePlaceholder} />
              </div>
              <div>
                <label htmlFor="tem-end" className="tem-label">
                  {f.endLabel}
                </label>
                <TemDate id="tem-end" value={t.end} onChange={t.setEnd} placeholder={f.datePlaceholder} />
              </div>
              <div>
                <span className="tem-label" id="tem-qty-label">
                  {f.quantityLabel}
                </span>
                <div className="tem-qty" role="group" aria-labelledby="tem-qty-label">
                  <button type="button" aria-label="Diminuer la quantité" onClick={() => t.setQuantity(t.quantity - 1)} disabled={t.quantity <= 1}>
                    <TemIcon name="minus" strokeWidth={1.8} />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    value={t.quantity}
                    aria-labelledby="tem-qty-label"
                    onChange={(e) => t.setQuantity(Number(e.target.value))}
                  />
                  <button type="button" aria-label="Augmenter la quantité" onClick={() => t.setQuantity(t.quantity + 1)} disabled={t.quantity >= 99}>
                    <TemIcon name="plus" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="tem-usage-text" className="tem-label">
                {f.usageLabel}
              </label>
              <textarea
                id="tem-usage-text"
                className="tem-textarea"
                rows={3}
                value={t.usageText}
                placeholder={f.usagePlaceholder}
                onChange={(e) => t.setUsageText(e.target.value)}
              />
            </div>

            <div>
              <span className="tem-label" id="tem-file-label">
                {f.fileLabel}
              </span>
              <label
                className={dragging ? "tem-drop is-dragging" : "tem-drop"}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="tem-sr-input"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  aria-labelledby="tem-file-label"
                  onChange={(e) => t.pickFile(e.target.files?.[0] ?? null)}
                />
                <TemIcon name="image" strokeWidth={1.4} />
                <span className="tem-drop__text">
                  {t.fileName ? (
                    <strong>{t.fileName}</strong>
                  ) : (
                    <>
                      <strong>{f.fileHint}</strong>
                      <span>{f.fileFormats}</span>
                    </>
                  )}
                </span>
              </label>
              {t.fileName ? (
                <button
                  type="button"
                  className="tem-textbtn"
                  onClick={() => {
                    t.pickFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  Retirer le fichier
                </button>
              ) : null}
              {t.fileError ? (
                <p className="tem-error" role="alert">
                  {t.fileError}
                </p>
              ) : null}
            </div>

            <fieldset className="tem-fs">
              <legend>
                {f.servicesLabel}
                <span>{f.servicesOptional}</span>
              </legend>
              <div className="tem-chips">
                {f.services.map((s) => {
                  const on = t.services.includes(s.id);
                  return (
                    <button key={s.id} type="button" className={on ? "tem-chipbtn is-on" : "tem-chipbtn"} aria-pressed={on} onClick={() => t.toggleService(s.id)}>
                      <TemIcon name={s.icon} strokeWidth={1.5} />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="tem-form__contact">
              <fieldset className="tem-fs">
                <legend>{f.contactLabel}</legend>
                <div className="tem-contact">
                  <span className="tem-field tem-field--icon">
                    <TemIcon name="user" strokeWidth={1.5} />
                    <input type="text" value={t.name} placeholder={f.name} aria-label={f.name} onChange={(e) => t.setName(e.target.value)} autoComplete="name" />
                  </span>
                  <span className="tem-field tem-field--icon">
                    <TemIcon name="phone" strokeWidth={1.5} />
                    <input type="tel" value={t.phone} placeholder={f.phone} aria-label={f.phone} onChange={(e) => t.setPhone(e.target.value)} autoComplete="tel" />
                  </span>
                  <span className="tem-field tem-field--icon">
                    <TemIcon name="mail" strokeWidth={1.5} />
                    <input type="email" value={t.email} placeholder={f.email} aria-label={f.email} onChange={(e) => t.setEmail(e.target.value)} autoComplete="email" />
                  </span>
                </div>
              </fieldset>
              <fieldset className="tem-fs tem-profile">
                <legend>{f.profileLabel}</legend>
                <div>
                  {f.profiles.map((p) => (
                    <label key={p.id}>
                      <input type="radio" name="tem-profile" value={p.id} checked={t.profile === p.id} onChange={() => t.setProfile(p.id)} />
                      <span className="tem-radio" aria-hidden="true" />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="tem-form__submit">
              <button type="submit" className="tem-btn tem-btn--yellow tem-btn--lg" disabled={t.pending}>
                {t.pending ? "Enregistrement…" : f.submit}
                <TemIcon name="arrowUpRight" />
              </button>
              <p>
                <TemIcon name="info" strokeWidth={1.6} />
                {f.submitNote}
              </p>
            </div>

            <HubFormSavedSection
              prepared={t.prepared}
              prepareError={t.prepareError}
              reference={t.reference}
              saveError={t.saveError}
              pending={t.pending}
              whatsappUrl={t.whatsappUrl}
              message={t.message}
              preparedClassName="tem-prepared"
              showAttachmentNotice
              renderWhatsAppFallback={(url, msg) => (
                <div className="tem-prepared" role="status">
                  <h3>Continuer sur WhatsApp</h3>
                  <p>L’enregistrement en ligne est indisponible : aucun dossier n’est créé tant que le serveur n’a pas répondu.</p>
                  <a href={url} className="tem-btn tem-btn--black" target="_blank" rel="noopener noreferrer">
                    <TemIcon name="whatsapp" />
                    Envoyer sur WhatsApp
                    <TemIcon name="arrowUpRight" />
                  </a>
                  <details>
                    <summary>Voir le message</summary>
                    <pre>{msg}</pre>
                  </details>
                </div>
              )}
            />
          </form>

          <aside className="tem-summary" aria-label={temSummary.title} aria-live="polite">
            <h3>{temSummary.title}</h3>
            <div className="tem-summary__item">
              <span className="tem-summary__thumb">
                {product ? <Image src={temImage(product.image)} alt="" width={120} height={96} className="tem-summary__thumbimg" /> : <TemIcon name="box" strokeWidth={1.2} />}
              </span>
              <dl>
                <dt>{temSummary.equipment}</dt>
                <dd>{t.named.length ? t.named.map((i) => i.name.trim()).join(", ") : "—"}</dd>
                <dt>{temSummary.quantity}</dt>
                <dd>{t.named.length ? t.quantity : "—"}</dd>
              </dl>
            </div>
            <dl className="tem-summary__meta">
              <dt>{temSummary.place}</dt>
              <dd>{t.zone.trim() || temSummary.toSpecify}</dd>
              <dt>{temSummary.period}</dt>
              <dd>{period}</dd>
            </dl>
            <div className="tem-summary__price">
              <span className="tem-summary__priceico">
                <TemIcon name="file" strokeWidth={1.5} />
              </span>
              <div>
                <strong>{temSummary.priceTitle}</strong>
              </div>
              <p>{temSummary.priceText}</p>
            </div>
            <div className="tem-summary__media">
              <Image
                src={temSummary.image.src}
                alt={temSummary.image.alt}
                width={temSummary.image.width}
                height={temSummary.image.height}
                sizes="(min-width: 900px) 30vw, 90vw"
                className="tem-summary__img"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
