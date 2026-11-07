"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { HubFormSavedSection } from "@/components/forms/HubFormSavedSection";
import { cmeForm, cmeImage, cmeImageSize, cmeSummary } from "@/content/trucks-hub";
import { useCme } from "./CmeContext";
import { CmeDate } from "./CmeDate";
import { CmeIcon } from "./CmeIcon";

function Block({ n, title, text, id, children }: { n: string; title: string; text: string; id: string; children: React.ReactNode }) {
  return (
    <section className="cme-block" aria-labelledby={id}>
      <header className="cme-block__head">
        <span className="cme-block__num" aria-hidden="true">
          {n}
        </span>
        <div>
          <h3 id={id}>{title}</h3>
          <p>{text}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

export function CmeForm() {
  const t = useCme();
  const f = cmeForm;
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await t.prepare();
  };

  const onAddRow = () => {
    const key = t.addRow();
    window.requestAnimationFrame(() => document.getElementById(`cme-eq-${key}`)?.focus());
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    t.pickFile(e.dataTransfer.files?.[0] ?? null);
  };

  const empty = cmeSummary.empty;
  const periodValue = (() => {
    const bits = [t.fields.start, t.fields.duration].filter(Boolean);
    if (bits.length) return bits.join(" · ");
    return t.periodHint || empty;
  })();
  const values: Record<string, string> = {
    equipment: t.named.length ? `${t.named.map((i) => i.name.trim()).join(", ")}${t.quantity > 1 ? ` (×${t.quantity})` : ""}` : empty,
    mission: t.missionSet ? t.mission : empty,
    place: t.fields.place || empty,
    period: periodValue,
  };

  const [b1, b2, b3, b4] = f.blocks;
  const sw = cmeImageSize[cmeSummary.image.id];

  return (
    <section id={f.id} className="cme-section cme-form-section" aria-labelledby="cme-form-title">
      <div className="cme-wrap">
        <h2 id="cme-form-title" className="cme-h2 cme-h2--form">
          <span className="cme-underline">{f.titleBefore}</span>
          {f.titleAfter}
        </h2>
        <p className="cme-lead">{f.lead}</p>

        <div className="cme-form-grid">
          <form className="cme-form" onSubmit={onSubmit} noValidate aria-label="Demande de location de camion ou d’engin">
            <Block n={b1.n} title={b1.title} text={b1.text} id="cme-b1">
              <div className="cme-eq">
                <div className="cme-eq__list">
                  <span className="cme-label" id="cme-eq-label">
                    {f.equipmentLabel}
                  </span>
                  <ul className="cme-rows">
                    {t.items.map((item, i) => (
                      <li key={item.key} className="cme-row">
                        <span className="cme-field cme-field--icon cme-field--grow">
                          <CmeIcon name="search" strokeWidth={1.5} />
                          <input
                            id={`cme-eq-${item.key}`}
                            type="text"
                            value={item.name}
                            placeholder={f.equipmentPlaceholder}
                            aria-label={`${f.equipmentLabel} ${i + 1}`}
                            onChange={(e) => t.setItemName(item.key, e.target.value)}
                            autoComplete="off"
                          />
                        </span>
                        {t.items.length > 1 ? (
                          <button type="button" className="cme-iconbtn" aria-label={`${f.remove} ${i + 1}`} onClick={() => t.removeRow(item.key)}>
                            <CmeIcon name="trash" strokeWidth={1.6} />
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="cme-eq__qty">
                  <span className="cme-label" id="cme-qty-label">
                    {f.quantityLabel}
                  </span>
                  <div className="cme-qty" role="group" aria-labelledby="cme-qty-label">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={99}
                      value={t.quantity}
                      aria-labelledby="cme-qty-label"
                      onChange={(e) => t.setQuantity(Number(e.target.value))}
                    />
                    <span className="cme-qty__btns">
                      <button type="button" aria-label="Augmenter la quantité" onClick={() => t.setQuantity(t.quantity + 1)} disabled={t.quantity >= 99}>
                        <CmeIcon name="chevronUp" strokeWidth={2} />
                      </button>
                      <button type="button" aria-label="Diminuer la quantité" onClick={() => t.setQuantity(t.quantity - 1)} disabled={t.quantity <= 1}>
                        <CmeIcon name="chevronDown" strokeWidth={2} />
                      </button>
                    </span>
                  </div>
                </div>
                <div className="cme-eq__add">
                  <button type="button" className="cme-btn cme-btn--outline" onClick={onAddRow}>
                    <CmeIcon name="circlePlus" strokeWidth={1.6} />
                    {f.addAnother}
                  </button>
                </div>
              </div>
              <div className="cme-two">
                <div>
                  <label htmlFor="cme-description" className="cme-label">
                    {f.descriptionLabel}
                  </label>
                  <textarea
                    id="cme-description"
                    className="cme-textarea"
                    rows={3}
                    value={t.description}
                    placeholder={f.descriptionPlaceholder}
                    onChange={(e) => t.setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="cme-capacity" className="cme-label">
                    {f.capacityLabel}
                    <span>{f.capacityOptional}</span>
                  </label>
                  <textarea
                    id="cme-capacity"
                    className="cme-textarea"
                    rows={3}
                    value={t.capacity}
                    placeholder={f.capacityPlaceholder}
                    onChange={(e) => t.setCapacity(e.target.value)}
                  />
                </div>
              </div>
            </Block>

            <Block n={b2.n} title={b2.title} text={b2.text} id="cme-b2">
              <div className="cme-three">
                <div>
                  <label htmlFor="cme-place" className="cme-label">
                    {f.placeLabel}
                  </label>
                  <span className="cme-field cme-field--icon">
                    <CmeIcon name="pin" strokeWidth={1.5} />
                    <input id="cme-place" type="text" value={t.place} placeholder={f.placePlaceholder} onChange={(e) => t.setPlace(e.target.value)} autoComplete="address-level2" />
                  </span>
                </div>
                <div>
                  <label htmlFor="cme-start" className="cme-label">
                    {f.startLabel}
                  </label>
                  <CmeDate id="cme-start" value={t.start} onChange={t.setStart} placeholder={f.startPlaceholder} />
                </div>
                <div>
                  <label htmlFor="cme-duration" className="cme-label">
                    {f.durationLabel}
                  </label>
                  <span className="cme-field cme-field--icon">
                    <CmeIcon name="clock" strokeWidth={1.5} />
                    <input id="cme-duration" type="text" value={t.duration} placeholder={f.durationPlaceholder} onChange={(e) => t.setDuration(e.target.value)} autoComplete="off" />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="cme-access" className="cme-label">
                  {f.accessLabel}
                  <span>{f.accessOptional}</span>
                </label>
                <textarea id="cme-access" className="cme-textarea" rows={3} value={t.access} placeholder={f.accessPlaceholder} onChange={(e) => t.setAccess(e.target.value)} />
              </div>
            </Block>

            <Block n={b3.n} title={b3.title} text={b3.text} id="cme-b3">
              <div className="cme-checks" role="group" aria-labelledby="cme-b3">
                {f.services.map((s) => {
                  const on = t.services.includes(s.id);
                  return (
                    <label key={s.id} className={on ? "cme-check is-on" : "cme-check"}>
                      <input type="checkbox" checked={on} onChange={() => t.toggleService(s.id)} />
                      <span className="cme-check__box" aria-hidden="true">
                        {on ? <CmeIcon name="check" strokeWidth={3} /> : null}
                      </span>
                      <CmeIcon name={s.icon} strokeWidth={1.4} className="cme-check__icon" />
                      <span>{s.label}</span>
                    </label>
                  );
                })}
              </div>
            </Block>

            <Block n={b4.n} title={b4.title} text={b4.text} id="cme-b4">
              <div className="cme-three">
                <div>
                  <label htmlFor="cme-name" className="cme-label">
                    {f.nameLabel}
                  </label>
                  <span className="cme-field cme-field--icon">
                    <CmeIcon name="user" strokeWidth={1.5} />
                    <input id="cme-name" type="text" value={t.name} placeholder={f.namePlaceholder} onChange={(e) => t.setName(e.target.value)} autoComplete="name" />
                  </span>
                </div>
                <div>
                  <label htmlFor="cme-phone" className="cme-label">
                    {f.phoneLabel}
                  </label>
                  <span className="cme-field cme-field--icon">
                    <CmeIcon name="phone" strokeWidth={1.5} />
                    <input id="cme-phone" type="tel" value={t.phone} placeholder={f.phonePlaceholder} onChange={(e) => t.setPhone(e.target.value)} autoComplete="tel" />
                  </span>
                </div>
                <div>
                  <label htmlFor="cme-email" className="cme-label">
                    {f.emailLabel}
                    <span>{f.emailOptional}</span>
                  </label>
                  <span className="cme-field cme-field--icon">
                    <CmeIcon name="mail" strokeWidth={1.5} />
                    <input id="cme-email" type="email" value={t.email} placeholder={f.emailPlaceholder} onChange={(e) => t.setEmail(e.target.value)} autoComplete="email" />
                  </span>
                </div>
              </div>

              <div>
                <label
                  className={dragging ? "cme-drop is-dragging" : "cme-drop"}
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
                    className="cme-sr-input"
                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                    aria-label={`${f.fileLabel}${f.fileOptional}`}
                    onChange={(e) => t.pickFile(e.target.files?.[0] ?? null)}
                  />
                  <CmeIcon name="upload" strokeWidth={1.3} className="cme-drop__icon" />
                  <span className="cme-drop__text">
                    <strong>
                      {f.fileLabel}
                      <span>{f.fileOptional}</span>
                    </strong>
                    {t.fileName ? <em>{t.fileName}</em> : <span>{f.fileHint}</span>}
                  </span>
                  <span className="cme-drop__meta">
                    <span>{f.fileFormats}</span>
                    <span>{f.fileMax}</span>
                  </span>
                </label>
                {t.fileName ? (
                  <button
                    type="button"
                    className="cme-textbtn"
                    onClick={() => {
                      t.pickFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    Retirer le fichier
                  </button>
                ) : null}
                {t.fileError ? (
                  <p className="cme-error" role="alert">
                    {t.fileError}
                  </p>
                ) : null}
              </div>
            </Block>

            <div className="cme-form__submit">
              <button type="submit" className="cme-btn cme-btn--yellow cme-btn--lg" disabled={t.pending}>
                {t.pending ? "Enregistrement…" : f.submit}
                <CmeIcon name="arrowUpRight" />
              </button>
              <p>
                <CmeIcon name="info" strokeWidth={1.8} />
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
              preparedClassName="cme-prepared"
              showAttachmentNotice
              renderWhatsAppFallback={(url, msg) => (
                <div className="cme-prepared" role="status">
                  <h3>Continuer sur WhatsApp</h3>
                  <p>L’enregistrement en ligne est indisponible : aucun dossier n’est créé tant que le serveur n’a pas répondu.</p>
                  <a href={url} className="cme-btn cme-btn--black" target="_blank" rel="noopener noreferrer">
                    <CmeIcon name="whatsapp" />
                    Envoyer sur WhatsApp
                    <CmeIcon name="arrowUpRight" />
                  </a>
                  <details>
                    <summary>Voir le message</summary>
                    <pre>{msg}</pre>
                  </details>
                </div>
              )}
            />
          </form>

          <aside className="cme-summary" aria-label={cmeSummary.title} aria-live="polite">
            <h3>{cmeSummary.title}</h3>
            <p className="cme-summary__lead">{cmeSummary.lead}</p>
            <dl className="cme-summary__rows">
              {cmeSummary.rows.map((r) => (
                <div key={r.id} data-row={r.id}>
                  <dt>
                    <CmeIcon name={r.icon} strokeWidth={1.4} />
                    {r.label}
                  </dt>
                  <dd className={values[r.id] === empty ? "is-empty" : undefined}>{values[r.id]}</dd>
                </div>
              ))}
            </dl>
            <div className="cme-summary__photo">
              <div className="cme-summary__sky" aria-hidden="true" />
              <Image
                src={cmeImage(cmeSummary.image.id)}
                alt={cmeSummary.image.alt}
                width={sw[0]}
                height={sw[1]}
                sizes="(min-width: 900px) 30vw, 90vw"
                className="cme-summary__img"
              />
            </div>
            <div className="cme-summary__note">
              <CmeIcon name="file" strokeWidth={1.4} />
              <div>
                <strong>{cmeSummary.noteTitle}</strong>
                <p>{cmeSummary.noteText}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
