"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import {
  vhpDates,
  vhpForm,
  vhpImage,
  vhpImageSize,
  vhpLoads,
  vhpOthers,
  vhpProfiles,
  vhpQuantities,
  vhpSummary,
  vhpTypeSingular,
  type VhpImageId,
  type VhpTypeId,
} from "@/content/vehicles-hub";
import { HubFormSavedSection } from "@/components/forms/HubFormSavedSection";
import { useVhp } from "./VhpContext";
import { VhpIcon, type VhpIconName } from "./VhpIcon";
import { VhpModeTabs } from "./VhpHero";

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
  icon?: VhpIconName;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="vhp-label">
        {label}
      </label>
      <span className={icon ? "vhp-field vhp-field--icon vhp-field--select" : "vhp-field vhp-field--select"}>
        {icon ? <VhpIcon name={icon} strokeWidth={1.5} /> : null}
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={value ? undefined : "is-placeholder"}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <VhpIcon name="chevronDown" className="vhp-field__caret" strokeWidth={1.8} />
      </span>
    </div>
  );
}

const typeImage = (t: VhpTypeId | ""): VhpImageId => (t ? vhpProfiles.find((p) => p.id === t)!.image : vhpSummary.defaultImage);

export function VhpForm(): ReactNode {
  const t = useVhp();
  const f = vhpForm;
  const img = typeImage(t.type);
  const [iw, ih] = vhpImageSize[img];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await t.prepare();
  };

  const usage = t.type ? `${vhpTypeSingular[t.type]} × ${t.quantity}` : "";
  const values: Record<string, string> = {
    profil: t.fields.name,
    usage,
    lieu: t.fields.place,
    duree: t.dates,
  };

  return (
    <section id={f.id} className="vhp-section vhp-form-section" aria-labelledby="vhp-form-title">
      <div className="vhp-wrap">
        <div className="vhp-form-grid">
          <form className="vhp-form" onSubmit={onSubmit} noValidate aria-labelledby="vhp-form-title">
            <h2 id="vhp-form-title" className="vhp-h2 vhp-h2--form">
              {f.title}
            </h2>

            <div>
              <span className="vhp-label">{f.modeLabel}</span>
              <VhpModeTabs idPrefix="vhp-form" variant="form" />
            </div>

            <div className="vhp-two">
              <Sel
                id="vhp-type"
                label={f.typeLabel}
                icon="car"
                value={t.type}
                onChange={(v) => t.setType(v as VhpTypeId | "")}
                placeholder={f.typePlaceholder}
                options={vhpProfiles.map((p) => ({ value: p.id, label: p.label }))}
              />
              <Sel id="vhp-other" label={f.otherLabel} value={t.other} onChange={t.setOther} placeholder={f.otherPlaceholder} options={vhpOthers.map((o) => ({ value: o, label: o }))} />
              <Sel id="vhp-qty" label={f.quantityLabel} value={t.quantity} onChange={t.setQuantity} options={vhpQuantities.map((o) => ({ value: o, label: o }))} />
              <Sel id="vhp-load" label={f.loadLabel} icon="users" value={t.load} onChange={t.setLoad} placeholder={f.loadPlaceholder} options={vhpLoads.map((o) => ({ value: o, label: o }))} />
              <div>
                <label htmlFor="vhp-place" className="vhp-label">
                  {f.placeLabel}
                </label>
                <span className="vhp-field vhp-field--icon vhp-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <input id="vhp-place" type="text" list="vhp-places" value={t.place} placeholder={f.placePlaceholder} onChange={(e) => t.setPlace(e.target.value)} autoComplete="off" />
                  <VhpIcon name="chevronDown" className="vhp-field__caret" strokeWidth={1.8} />
                </span>
              </div>
              <Sel id="vhp-dates" label={f.datesLabel} icon="calendar" value={t.dates} onChange={t.setDates} placeholder={f.datesPlaceholder} options={vhpDates.map((o) => ({ value: o, label: o }))} />
            </div>

            <div>
              <label htmlFor="vhp-mission" className="vhp-label">
                {f.missionLabel}
              </label>
              <textarea id="vhp-mission" className="vhp-textarea" rows={3} value={t.mission} placeholder={f.missionPlaceholder} onChange={(e) => t.setMission(e.target.value)} />
            </div>

            <div>
              <span className="vhp-label" id="vhp-services-label">
                {f.servicesLabel}
                <span>{f.servicesOptional}</span>
              </span>
              <div className="vhp-chips" role="group" aria-labelledby="vhp-services-label">
                {f.services.map((s) => {
                  const on = t.services.includes(s.id);
                  return (
                    <button key={s.id} type="button" className={on ? "vhp-chip is-on" : "vhp-chip"} aria-pressed={on} onClick={() => t.toggleService(s.id)}>
                      <VhpIcon name={s.icon} strokeWidth={1.5} />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="vhp-label" id="vhp-contact-label">
                {f.contactLabel}
              </span>
              <div className="vhp-three" role="group" aria-labelledby="vhp-contact-label">
                <span className="vhp-field vhp-field--icon">
                  <VhpIcon name="user" strokeWidth={1.5} />
                  <input type="text" value={t.name} placeholder={f.name} aria-label={f.name} onChange={(e) => t.setName(e.target.value)} autoComplete="name" />
                </span>
                <span className="vhp-field vhp-field--icon">
                  <VhpIcon name="phone" strokeWidth={1.5} />
                  <input type="tel" value={t.phone} placeholder={f.phone} aria-label={f.phone} onChange={(e) => t.setPhone(e.target.value)} autoComplete="tel" />
                </span>
                <span className="vhp-field vhp-field--icon">
                  <VhpIcon name="mail" strokeWidth={1.5} />
                  <input type="email" value={t.email} placeholder={f.email} aria-label={f.email} onChange={(e) => t.setEmail(e.target.value)} autoComplete="email" />
                </span>
              </div>
            </div>

            <button type="submit" className="vhp-btn vhp-btn--yellow vhp-btn--block" disabled={t.pending}>
              {t.pending ? "Enregistrement…" : f.submit}
              <VhpIcon name="arrowUpRight" />
            </button>

            <HubFormSavedSection
              prepared={t.prepared}
              prepareError={t.prepareError}
              reference={t.reference}
              saveError={t.saveError}
              pending={t.pending}
              whatsappUrl={t.whatsappUrl}
              message={t.message}
              preparedClassName="vhp-prepared"
              showAttachmentNotice
              renderWhatsAppFallback={(url, msg) => (
                <div className="vhp-prepared" role="status">
                  <h3>Continuer sur WhatsApp</h3>
                  <p>
                    L’enregistrement en ligne est indisponible : le message s’ouvre sans dossier créé chez ONLOUTOU tant que le serveur n’a pas répondu.
                  </p>
                  <a href={url} className="vhp-btn vhp-btn--black" target="_blank" rel="noopener noreferrer">
                    <VhpIcon name="whatsapp" />
                    Envoyer sur WhatsApp
                    <VhpIcon name="arrowUpRight" />
                  </a>
                  <details>
                    <summary>Voir le message</summary>
                    <pre>{msg}</pre>
                  </details>
                </div>
              )}
            />
          </form>

          <aside className="vhp-summary" aria-label={vhpSummary.title} aria-live="polite">
            <h3>{vhpSummary.title}</h3>
            <div className="vhp-summary__photo">
              <Image key={img} src={vhpImage(img)} alt="" width={iw} height={ih} sizes="(min-width: 900px) 30vw, 90vw" className="vhp-summary__img" data-image={img} />
            </div>
            <dl className="vhp-summary__rows">
              {vhpSummary.rows.map((r) => (
                <div key={r.id} data-row={r.id}>
                  <dt>
                    <VhpIcon name={r.icon} strokeWidth={1.4} />
                    <span className="vhp-summary__title">{r.title}</span>
                  </dt>
                  <dd className="vhp-summary__text">{r.text}</dd>
                  <dd className={values[r.id] ? "vhp-summary__val" : "vhp-summary__val is-empty"}>{values[r.id] || "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="vhp-summary__note">
              <VhpIcon name="info" strokeWidth={1.5} />
              {vhpSummary.note}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
