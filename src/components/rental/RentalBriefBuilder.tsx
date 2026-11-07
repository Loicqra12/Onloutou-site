"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NeedIcon } from "@/components/rental/RentalBriefIcons";
import { BriefContactSave } from "@/components/forms/BriefContactSave";
import {
  buildRentalBriefSummary,
  buildRentalWhatsAppUrl,
  rentalBriefGuide,
  rentalBriefOptions,
} from "@/content/rental-page";
import { site } from "@/content/site";

const defaultNeed = rentalBriefOptions.needTypes[0].label;
const defaultDuration = rentalBriefOptions.durations[0].label;
const defaultZone = rentalBriefOptions.zones[0].label;
const defaultSupport = rentalBriefOptions.support[0].label;

export function RentalBriefBuilder() {
  const [needLabel, setNeedLabel] = useState(defaultNeed);
  const [durationLabel, setDurationLabel] = useState(defaultDuration);
  const [zoneLabel, setZoneLabel] = useState(defaultZone);
  const [supportLabel, setSupportLabel] = useState(defaultSupport);

  const summary = useMemo(
    () => buildRentalBriefSummary({ needLabel, durationLabel, zoneLabel, supportLabel }),
    [needLabel, durationLabel, zoneLabel, supportLabel],
  );

  const whatsappHref = useMemo(
    () => buildRentalWhatsAppUrl({ needLabel, durationLabel, zoneLabel, supportLabel }),
    [needLabel, durationLabel, zoneLabel, supportLabel],
  );

  const recap = [
    { label: "Équipement", value: needLabel },
    { label: "Zone", value: zoneLabel },
    { label: "Durée", value: durationLabel },
    { label: "Accompagnement", value: supportLabel },
  ];

  return (
    <section
      id="demande-location"
      className="rental-builder section-spacing scroll-mt-28"
      aria-labelledby="rental-builder-title"
    >
      <div className="container-content">
        <h2 id="rental-builder-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Préparer ma demande
        </h2>
        <p className="rental-builder__lead">
          Sélectionnez les repères ci-dessous, enregistrez votre demande en ligne puis poursuivez sur WhatsApp si vous le souhaitez — sans réservation confirmée ni tarif affiché.
        </p>
        <p className="rental-builder__hint">{rentalBriefGuide.closing}</p>

        <div className="rental-builder__layout">
          <form className="rental-builder__form" onSubmit={(e) => e.preventDefault()}>
            <fieldset className="rental-builder__fieldset">
              <legend>01 · Type de besoin</legend>
              <div className="rental-builder__needs">
                {rentalBriefOptions.needTypes.map((opt) => (
                  <label
                    key={opt.id}
                    className={`rental-builder__need${needLabel === opt.label ? " is-checked" : ""}`}
                  >
                    <input
                      type="radio"
                      name="rental-need"
                      value={opt.label}
                      checked={needLabel === opt.label}
                      onChange={() => setNeedLabel(opt.label)}
                    />
                    <NeedIcon id={opt.id} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rental-builder__fieldset">
              <legend>02 · Durée indicative</legend>
              <div className="rental-builder__options">
                {rentalBriefOptions.durations.map((opt) => (
                  <label key={opt.id} className="rental-builder__option">
                    <input
                      type="radio"
                      name="rental-duration"
                      value={opt.label}
                      checked={durationLabel === opt.label}
                      onChange={() => setDurationLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rental-builder__fieldset">
              <legend>03 · Zone</legend>
              <div className="rental-builder__options">
                {rentalBriefOptions.zones.map((opt) => (
                  <label key={opt.id} className="rental-builder__option">
                    <input
                      type="radio"
                      name="rental-zone"
                      value={opt.label}
                      checked={zoneLabel === opt.label}
                      onChange={() => setZoneLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rental-builder__fieldset">
              <legend>04 · Accompagnement souhaité</legend>
              <div className="rental-builder__options">
                {rentalBriefOptions.support.map((opt) => (
                  <label key={opt.id} className="rental-builder__option">
                    <input
                      type="radio"
                      name="rental-support"
                      value={opt.label}
                      checked={supportLabel === opt.label}
                      onChange={() => setSupportLabel(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </form>

          <aside className="rental-builder__summary-wrap" aria-live="polite">
            <p className="rental-builder__summary-label">Résumé</p>
            <dl className="rental-builder__recap">
              {recap.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="rental-builder__summary">{summary}</p>
            <BriefContactSave
              source="location-brief"
              type="RENTAL"
              zone={zoneLabel}
              message={summary}
              payload={{ needLabel, durationLabel, zoneLabel, supportLabel }}
              whatsappUrl={whatsappHref}
              whatsappLabel="Continuer sur WhatsApp"
              className="rental-builder__actions"
            />
            <a href={`tel:${site.phoneTel}`} className="rental-builder__phone">
              {site.phoneDisplay}
            </a>
            <Link href="/contact" className="rental-builder__contact link-motion">
              Voir la page contact
            </Link>
          </aside>
        </div>

        <noscript>
          <p className="rental-builder__noscript">
            Sans JavaScript, utilisez la{" "}
            <Link href="/contact">page contact</Link> ou WhatsApp en précisant catégorie, durée, zone et accompagnement
            souhaité.
          </p>
        </noscript>
      </div>
    </section>
  );
}
