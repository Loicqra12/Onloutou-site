"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { HubFormSavedSection } from "@/components/forms/HubFormSavedSection";
import {
  cnxAssets,
  cnxForm,
  cnxIds,
  cnxImage,
  cnxImageSize,
  cnxInfosOptions,
  cnxInstalledOptions,
  cnxPowers,
  cnxSummary,
  cnxSummaryImage,
  type CnxAssetId,
  type CnxInstalledId,
} from "@/content/connected-hub";
import { useCnx } from "./CnxContext";
import { CnxIcon } from "./CnxIcon";

export function CnxForm(): ReactNode {
  const t = useCnx();
  const f = cnxForm;
  const img = cnxSummaryImage(t.asset);
  const [iw, ih] = cnxImageSize[img];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await t.prepare();
  };

  const live: Record<string, string> = {
    compatibilite: [t.fields.config, t.fields.asset].filter(Boolean).join(" · "),
    installation: t.fields.installed ? `Dispositif déjà installé : ${t.fields.installed}` : "",
    connectivite: [t.power, t.fields.infos.length ? `Suivi : ${t.fields.infos.join(", ")}` : ""].filter(Boolean).join(" · "),
    perimetre: [t.fields.zone, t.fields.quantity ? `Quantité : ${t.fields.quantity}` : ""].filter(Boolean).join(" · "),
  };

  return (
    <section id={cnxIds.form} className="cnx-section cnx-form-section" aria-labelledby="cnx-form-title">
      <div className="cnx-wrap">
        <h2 id="cnx-form-title" className="cnx-h2 cnx-h2--md cnx-h2--bar">
          {f.title}
        </h2>
        <p className="cnx-form-lead">{f.lead}</p>
        <div className="cnx-form-grid">
          <form className="cnx-form" onSubmit={onSubmit} noValidate aria-labelledby="cnx-form-title">
            <fieldset className="cnx-fieldset">
              <legend className="cnx-label">{f.assetLabel}</legend>
              <div className="cnx-assets">
                {cnxAssets.map((a) => {
                  const on = t.asset === a.id;
                  return (
                    <label key={a.id} className={on ? "cnx-asset is-on" : "cnx-asset"}>
                      <input type="radio" name="cnx-asset" value={a.id} checked={on} onChange={() => t.setAsset(a.id as CnxAssetId)} />
                      <CnxIcon name={a.icon} strokeWidth={1.5} />
                      <span>{a.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="cnx-three">
              <div>
                <label htmlFor="cnx-qty" className="cnx-label">
                  {f.quantityLabel}
                </label>
                <span className="cnx-field">
                  <input id="cnx-qty" type="text" value={t.quantity} placeholder={f.quantityPlaceholder} onChange={(e) => t.setQuantity(e.target.value)} autoComplete="off" />
                </span>
              </div>
              <div>
                <label htmlFor="cnx-zone" className="cnx-label">
                  {f.zoneLabel}
                </label>
                <span className="cnx-field cnx-field--icon">
                  <CnxIcon name="pin" strokeWidth={1.5} />
                  <input id="cnx-zone" type="text" value={t.zone} placeholder={f.zonePlaceholder} onChange={(e) => t.setZone(e.target.value)} autoComplete="off" />
                </span>
              </div>
              <div>
                <label htmlFor="cnx-power" className="cnx-label">
                  {f.powerLabel}
                </label>
                <span className="cnx-field cnx-field--select">
                  <select id="cnx-power" value={t.power} onChange={(e) => t.setPower(e.target.value)} className={t.power ? undefined : "is-placeholder"}>
                    <option value="">{f.powerPlaceholder}</option>
                    {cnxPowers.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <CnxIcon name="chevronDown" className="cnx-field__caret" strokeWidth={1.8} />
                </span>
              </div>
            </div>

            <fieldset className="cnx-fieldset">
              <legend className="cnx-label">{f.installedLabel}</legend>
              <div className="cnx-radios">
                {cnxInstalledOptions.map((o) => (
                  <label key={o.id} className="cnx-radio">
                    <input type="radio" name="cnx-installed" value={o.id} checked={t.installed === o.id} onChange={() => t.setInstalled(o.id as CnxInstalledId)} />
                    <span className="cnx-radio__dot" aria-hidden="true" />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="cnx-fieldset">
              <legend className="cnx-label">{f.infosLabel}</legend>
              <div className="cnx-radios">
                {cnxInfosOptions.map((o) => {
                  const on = t.infos.includes(o.id);
                  return (
                    <label key={o.id} className="cnx-radio cnx-radio--check">
                      <input type="checkbox" checked={on} onChange={() => t.toggleInfo(o.id)} />
                      <span className="cnx-radio__box" aria-hidden="true">
                        {on ? <CnxIcon name="check" strokeWidth={3} /> : null}
                      </span>
                      <span>{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="cnx-needs" className="cnx-label">
                {f.needsLabel}
              </label>
              <textarea id="cnx-needs" className="cnx-textarea" rows={2} value={t.needs} placeholder={f.needsPlaceholder} onChange={(e) => t.setNeeds(e.target.value)} />
            </div>

            <div className="cnx-three">
              <div>
                <label htmlFor="cnx-name" className="cnx-label">
                  {f.name}
                </label>
                <span className="cnx-field">
                  <input id="cnx-name" type="text" value={t.name} placeholder={f.namePlaceholder} onChange={(e) => t.setName(e.target.value)} autoComplete="name" />
                </span>
              </div>
              <div>
                <label htmlFor="cnx-phone" className="cnx-label">
                  {f.phone}
                </label>
                <span className="cnx-field">
                  <input id="cnx-phone" type="tel" value={t.phone} placeholder={f.phonePlaceholder} onChange={(e) => t.setPhone(e.target.value)} autoComplete="tel" />
                </span>
              </div>
              <div>
                <label htmlFor="cnx-email" className="cnx-label">
                  {f.email}
                  <span>{f.emailOptional}</span>
                </label>
                <span className="cnx-field">
                  <input id="cnx-email" type="email" value={t.email} placeholder={f.emailPlaceholder} onChange={(e) => t.setEmail(e.target.value)} autoComplete="email" />
                </span>
              </div>
            </div>

            <div className="cnx-submit">
              <button type="submit" className="cnx-btn cnx-btn--yellow" disabled={t.pending}>
                {t.pending ? "Enregistrement…" : f.submit}
                <CnxIcon name="arrowUpRight" />
              </button>
            </div>

            <HubFormSavedSection
              prepared={t.prepared}
              prepareError={t.prepareError}
              reference={t.reference}
              saveError={t.saveError}
              pending={t.pending}
              whatsappUrl={t.whatsappUrl}
              message={t.message}
              preparedClassName="cnx-prepared"
              renderWhatsAppFallback={(url, msg) => (
                <div className="cnx-prepared" role="status">
                  <h3>Continuer sur WhatsApp</h3>
                  <p>L’enregistrement en ligne est indisponible : aucun dossier n’est créé tant que le serveur n’a pas répondu.</p>
                  <a href={url} className="cnx-btn cnx-btn--black" target="_blank" rel="noopener noreferrer">
                    <CnxIcon name="whatsapp" />
                    Envoyer sur WhatsApp
                    <CnxIcon name="arrowUpRight" />
                  </a>
                  <details>
                    <summary>Voir le message</summary>
                    <pre>{msg}</pre>
                  </details>
                </div>
              )}
            />
          </form>

          <aside className="cnx-summary" aria-label={cnxSummary.title} aria-live="polite">
            <h3>{cnxSummary.title}</h3>
            <p className="cnx-summary__lead">{cnxSummary.lead}</p>
            <ul className="cnx-summary__rows">
              {cnxSummary.rows.map((r) => (
                <li key={r.id} data-row={r.id}>
                  <span className="cnx-summary__icon" aria-hidden="true">
                    <CnxIcon name={r.icon} strokeWidth={1.5} />
                  </span>
                  <strong>{r.title}</strong>
                  <span className="cnx-summary__text">
                    {r.text}
                    {live[r.id] ? <em className="cnx-summary__val">{live[r.id]}</em> : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="cnx-summary__photo">
              <Image key={img} src={cnxImage(img)} alt={cnxSummary.image.alt} width={iw} height={ih} sizes="(min-width: 900px) 34vw, 90vw" className="cnx-summary__img" data-image={img} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
