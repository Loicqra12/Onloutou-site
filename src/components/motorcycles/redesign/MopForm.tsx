"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { mopDates, mopForm, mopImage, mopImageSize, mopQuantities, mopSummary, mopSummaryImage, mopUsageOptions, type MopUsageId } from "@/content/motos-hub";
import { HubFormSavedSection } from "@/components/forms/HubFormSavedSection";
import { useMop } from "./MopContext";
import { MopIcon, type MopIconName } from "./MopIcon";
import { MopModeTabs } from "./MopHero";

function Sel({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  icon: MopIconName;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="mop-label">
        {label}
      </label>
      <span className="mop-field mop-field--icon mop-field--select">
        <MopIcon name={icon} strokeWidth={1.5} />
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={value ? undefined : "is-placeholder"}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <MopIcon name="chevronDown" className="mop-field__caret" strokeWidth={1.8} />
      </span>
    </div>
  );
}

export function MopForm(): ReactNode {
  const t = useMop();
  const f = mopForm;
  const img = mopSummaryImage(t.usage);
  const [iw, ih] = mopImageSize[img];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await t.prepare();
  };

  const values: Record<string, string> = {
    usage: t.fields.usage,
    quantite: t.quantity,
    zone: t.fields.place,
    periode: t.dates,
  };

  return (
    <section id={f.id} className="mop-section mop-form-section" aria-labelledby="mop-form-title">
      <div className="mop-wrap">
        <div className="mop-form-grid">
          <form className="mop-form" onSubmit={onSubmit} noValidate aria-labelledby="mop-form-title">
            <h2 id="mop-form-title" className="mop-h2 mop-h2--form">
              {f.title}
            </h2>

            <MopModeTabs idPrefix="mop-form" variant="form" />

            <div className="mop-two">
              <Sel
                id="mop-usage"
                label={f.usageLabel}
                icon="bike"
                value={t.usage}
                onChange={(v) => t.setUsage(v as MopUsageId | "")}
                placeholder={f.usagePlaceholder}
                options={mopUsageOptions.map((u) => ({ value: u.id, label: u.label }))}
              />
              <div>
                <label htmlFor="mop-model" className="mop-label">
                  {f.modelLabel}
                  <span>{f.modelOptional}</span>
                </label>
                <span className="mop-field">
                  <input id="mop-model" type="text" value={t.model} placeholder={f.modelPlaceholder} onChange={(e) => t.setModel(e.target.value)} autoComplete="off" />
                </span>
              </div>
            </div>

            <div className="mop-three">
              <Sel id="mop-qty" label={f.quantityLabel} icon="minus" value={t.quantity} onChange={t.setQuantity} placeholder={f.quantityPlaceholder} options={mopQuantities.map((o) => ({ value: o, label: o }))} />
              <div>
                <label htmlFor="mop-place" className="mop-label">
                  {f.placeLabel}
                </label>
                <span className="mop-field mop-field--icon">
                  <MopIcon name="pin" strokeWidth={1.5} />
                  <input id="mop-place" type="text" list="mop-places" value={t.place} placeholder={f.placePlaceholder} onChange={(e) => t.setPlace(e.target.value)} autoComplete="off" />
                </span>
              </div>
              <Sel id="mop-dates" label={f.datesLabel} icon="calendar" value={t.dates} onChange={t.setDates} placeholder={f.datesPlaceholder} options={mopDates.map((o) => ({ value: o, label: o }))} />
            </div>

            <div>
              <label htmlFor="mop-distance" className="mop-label">
                {f.distanceLabel}
              </label>
              <span className="mop-field mop-field--icon">
                <MopIcon name="road" strokeWidth={1.5} />
                <input id="mop-distance" type="text" value={t.distance} placeholder={f.distancePlaceholder} onChange={(e) => t.setDistance(e.target.value)} autoComplete="off" />
              </span>
            </div>

            <div>
              <label htmlFor="mop-needs" className="mop-label">
                {f.needsLabel}
              </label>
              <span className="mop-field mop-field--area">
                <MopIcon name="file" strokeWidth={1.5} />
                <textarea id="mop-needs" rows={2} value={t.needs} placeholder={f.needsPlaceholder} onChange={(e) => t.setNeeds(e.target.value)} />
              </span>
            </div>

            <fieldset className="mop-options">
              <legend className="mop-label">
                {f.optionsLabel}
                <span>{f.optionsOptional}</span>
              </legend>
              <div className="mop-options__row">
                {f.options.map((o) => {
                  const on = t.options.includes(o.id);
                  return (
                    <label key={o.id} className={on ? "mop-check is-on" : "mop-check"}>
                      <input type="checkbox" checked={on} onChange={() => t.toggleOption(o.id)} />
                      <span className="mop-check__box" aria-hidden="true">
                        {on ? <MopIcon name="check" strokeWidth={3} /> : null}
                      </span>
                      <span>{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <span className="mop-label" id="mop-contact-label">
                {f.contactLabel}
              </span>
              <div className="mop-three" role="group" aria-labelledby="mop-contact-label">
                <span className="mop-field mop-field--icon">
                  <MopIcon name="user" strokeWidth={1.5} />
                  <input type="text" value={t.name} placeholder={f.name} aria-label={f.name} onChange={(e) => t.setName(e.target.value)} autoComplete="name" />
                </span>
                <span className="mop-field mop-field--icon">
                  <MopIcon name="phone" strokeWidth={1.5} />
                  <input type="tel" value={t.phone} placeholder={f.phone} aria-label={f.phone} onChange={(e) => t.setPhone(e.target.value)} autoComplete="tel" />
                </span>
                <span className="mop-field mop-field--icon">
                  <MopIcon name="mail" strokeWidth={1.5} />
                  <input type="email" value={t.email} placeholder={f.email} aria-label={f.email} onChange={(e) => t.setEmail(e.target.value)} autoComplete="email" />
                </span>
              </div>
            </div>

            <div className="mop-submit">
              <button type="submit" className="mop-btn mop-btn--yellow" disabled={t.pending}>
                {t.pending ? "Enregistrement…" : f.submit}
                <MopIcon name="arrowUpRight" />
              </button>
              <p>
                <MopIcon name="info" strokeWidth={1.5} />
                {f.hint}
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
              preparedClassName="mop-prepared"
              showAttachmentNotice
              renderWhatsAppFallback={(url, msg) => (
                <div className="mop-prepared" role="status">
                  <h3>Continuer sur WhatsApp</h3>
                  <p>L’enregistrement en ligne est indisponible : aucun dossier n’est créé tant que le serveur n’a pas répondu.</p>
                  <a href={url} className="mop-btn mop-btn--black" target="_blank" rel="noopener noreferrer">
                    <MopIcon name="whatsapp" />
                    Envoyer sur WhatsApp
                    <MopIcon name="arrowUpRight" />
                  </a>
                  <details>
                    <summary>Voir le message</summary>
                    <pre>{msg}</pre>
                  </details>
                </div>
              )}
            />
          </form>

          <aside className="mop-summary" aria-label={mopSummary.title} aria-live="polite">
            <h3>{mopSummary.title}</h3>
            <p className="mop-summary__lead">{mopSummary.lead}</p>
            <dl className="mop-summary__rows">
              {mopSummary.rows.map((r) => (
                <div key={r.id} data-row={r.id}>
                  <dt>
                    <MopIcon name={r.icon} strokeWidth={1.4} />
                    <span className="mop-summary__title">{r.title}</span>
                  </dt>
                  <dd className={values[r.id] ? "mop-summary__val" : "mop-summary__val is-empty"}>{values[r.id] || mopSummary.empty}</dd>
                </div>
              ))}
            </dl>
            <div className="mop-summary__photo">
              <Image key={img} src={mopImage(img)} alt="" width={iw} height={ih} sizes="(min-width: 900px) 30vw, 90vw" className="mop-summary__img" data-image={img} />
            </div>
            <p className="mop-summary__note">
              <MopIcon name="info" strokeWidth={1.5} />
              {mopSummary.note}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
