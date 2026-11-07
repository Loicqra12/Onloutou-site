"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { mopDates, mopForm, mopHero, mopImage, mopImageSize, mopModes, mopPlaces, mopSearch, mopUsageOptions, type MopUsageId } from "@/content/motos-hub";
import { useMop } from "./MopContext";
import { MopIcon } from "./MopIcon";

export function MopModeTabs({ idPrefix, variant }: { idPrefix: string; variant: "hero" | "form" }) {
  const t = useMop();
  return (
    <div className={`mop-modes mop-modes--${variant}`} role="radiogroup" aria-label={mopForm.modeLabel}>
      {mopModes.map((m) => {
        const on = t.mode === m.id;
        return (
          <label key={m.id} className={on ? "mop-mode is-on" : "mop-mode"}>
            <input type="radio" name={`${idPrefix}-mode`} value={m.id} checked={on} onChange={() => t.setMode(m.id)} />
            <MopIcon name={m.icon} strokeWidth={1.5} />
            <span>{m.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function MopHero() {
  const t = useMop();
  const s = mopSearch;
  const [w, h] = mopImageSize[mopHero.image.id];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    t.scrollTo(mopForm.id);
  };

  return (
    <section className="mop-hero" aria-labelledby="mop-hero-title">
      <div className="mop-hero__stage">
        <Image
          src={mopImage(mopHero.image.id)}
          alt={mopHero.image.alt}
          width={w}
          height={h}
          priority
          sizes="(min-width: 1100px) 70vw, 100vw"
          className="mop-hero__img"
        />
        <div className="mop-hero__shade" aria-hidden="true" />
        <div className="mop-wrap mop-hero__copy">
          <p className="mop-kicker">{mopHero.eyebrow}</p>
          <h1 id="mop-hero-title" className="mop-h1">
            {mopHero.titleLines.map((l) => (
              <span key={l} className="mop-line">
                {l}{" "}
              </span>
            ))}
            <span className="mop-line">
              <span className="mop-underline">{mopHero.titleUnderline}</span>
            </span>
          </h1>
          <p className="mop-hero__lead">{mopHero.lead}</p>
        </div>
      </div>

      <div className="mop-wrap mop-search-wrap">
        <form className="mop-search" role="search" aria-label="Définir mon besoin de deux-roues" onSubmit={onSubmit}>
          <div className="mop-search__tabs">
            <MopModeTabs idPrefix="mop-hero" variant="hero" />
          </div>
          <div className="mop-search__row">
            <div>
              <label htmlFor="mop-hero-usage">{s.usageLabel}</label>
              <span className="mop-field mop-field--icon mop-field--select">
                <MopIcon name="bike" strokeWidth={1.5} />
                <select id="mop-hero-usage" value={t.usage} onChange={(e) => t.setUsage(e.target.value as MopUsageId | "")}>
                  <option value="">{s.usagePlaceholder}</option>
                  {mopUsageOptions.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
                <MopIcon name="chevronDown" className="mop-field__caret" strokeWidth={1.8} />
              </span>
            </div>
            <div>
              <label htmlFor="mop-hero-place">{s.placeLabel}</label>
              <span className="mop-field mop-field--icon mop-field--select">
                <MopIcon name="pin" strokeWidth={1.5} />
                <input id="mop-hero-place" type="text" list="mop-places" value={t.place} placeholder={s.placePlaceholder} onChange={(e) => t.setPlace(e.target.value)} autoComplete="off" />
                <MopIcon name="chevronDown" className="mop-field__caret" strokeWidth={1.8} />
              </span>
            </div>
            <div>
              <label htmlFor="mop-hero-period">{s.periodLabel}</label>
              <span className="mop-field mop-field--icon mop-field--select">
                <MopIcon name="calendar" strokeWidth={1.5} />
                <select id="mop-hero-period" value={t.dates} onChange={(e) => t.setDates(e.target.value)}>
                  <option value="">{s.periodPlaceholder}</option>
                  {mopDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <MopIcon name="chevronDown" className="mop-field__caret" strokeWidth={1.8} />
              </span>
            </div>
            <button type="submit" className="mop-btn mop-btn--yellow">
              {s.submit}
              <MopIcon name="arrowUpRight" />
            </button>
          </div>
          <p className="mop-search__note">
            <MopIcon name="info" strokeWidth={1.5} />
            {s.note}
          </p>
          <datalist id="mop-places">
            {mopPlaces.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </form>
      </div>
    </section>
  );
}
