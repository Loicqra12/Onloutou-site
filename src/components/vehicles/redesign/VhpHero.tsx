"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { vhpDates, vhpForm, vhpHero, vhpImage, vhpImageSize, vhpModes, vhpPlaces, vhpProfiles, vhpSearch, type VhpTypeId } from "@/content/vehicles-hub";
import { useVhp } from "./VhpContext";
import { VhpIcon } from "./VhpIcon";

export function VhpModeTabs({ idPrefix, variant }: { idPrefix: string; variant: "hero" | "form" }) {
  const t = useVhp();
  return (
    <div className={`vhp-modes vhp-modes--${variant}`} role="radiogroup" aria-label={vhpForm.modeLabel}>
      {vhpModes.map((m) => {
        const on = t.mode === m.id;
        return (
          <label key={m.id} className={on ? "vhp-mode is-on" : "vhp-mode"}>
            <input type="radio" name={`${idPrefix}-mode`} value={m.id} checked={on} onChange={() => t.setMode(m.id)} />
            <VhpIcon name={m.icon} strokeWidth={1.5} />
            <span>{m.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function VhpHero() {
  const t = useVhp();
  const s = vhpSearch;
  const [w, h] = vhpImageSize[vhpHero.image.id];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    t.scrollTo(vhpForm.id);
  };

  return (
    <section className="vhp-hero" aria-labelledby="vhp-hero-title">
      <div className="vhp-hero__stage">
        <div className="vhp-hero__bg" aria-hidden="true">
          <span className="vhp-hero__roof" />
          <span className="vhp-hero__ground" />
        </div>
        <Image
          src={vhpImage(vhpHero.image.id)}
          alt={vhpHero.image.alt}
          width={w}
          height={h}
          priority
          sizes="(min-width: 1100px) 72vw, 100vw"
          className="vhp-hero__img"
        />
        <div className="vhp-hero__shade" aria-hidden="true" />
        <div className="vhp-wrap vhp-hero__copy">
          <p className="vhp-kicker">{vhpHero.eyebrow}</p>
          <h1 id="vhp-hero-title" className="vhp-h1">
            {vhpHero.titleLines.map((l) => (
              <span key={l} className="vhp-line">
                {l}{" "}
              </span>
            ))}
            <span className="vhp-line">
              <span className="vhp-underline">{vhpHero.titleUnderline}</span>
              {vhpHero.titleAfter}
            </span>{" "}
            <span className="vhp-line">{vhpHero.titleLast}</span>
          </h1>
          <p className="vhp-hero__lead">{vhpHero.lead}</p>
        </div>
      </div>

      <div className="vhp-wrap vhp-search-wrap">
        <form className="vhp-search" role="search" aria-label="Définir mon besoin de véhicule" onSubmit={onSubmit}>
          <div className="vhp-search__tabs">
            <VhpModeTabs idPrefix="vhp-hero" variant="hero" />
          </div>
          <div className="vhp-search__row">
            <div>
              <label htmlFor="vhp-hero-type">{s.typeLabel}</label>
              <span className="vhp-field vhp-field--icon vhp-field--select">
                <VhpIcon name="car" strokeWidth={1.5} />
                <select id="vhp-hero-type" value={t.type} onChange={(e) => t.setType(e.target.value as VhpTypeId | "")}>
                  <option value="">{s.typePlaceholder}</option>
                  {vhpProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <VhpIcon name="chevronDown" className="vhp-field__caret" strokeWidth={1.8} />
              </span>
            </div>
            <div>
              <label htmlFor="vhp-hero-place">{s.placeLabel}</label>
              <span className="vhp-field vhp-field--icon vhp-field--select">
                <VhpIcon name="pin" strokeWidth={1.5} />
                <input id="vhp-hero-place" type="text" list="vhp-places" value={t.place} placeholder={s.placePlaceholder} onChange={(e) => t.setPlace(e.target.value)} autoComplete="off" />
                <VhpIcon name="chevronDown" className="vhp-field__caret" strokeWidth={1.8} />
              </span>
            </div>
            <div>
              <label htmlFor="vhp-hero-period">{s.periodLabel}</label>
              <span className="vhp-field vhp-field--icon vhp-field--select">
                <VhpIcon name="calendar" strokeWidth={1.5} />
                <select id="vhp-hero-period" value={t.dates} onChange={(e) => t.setDates(e.target.value)}>
                  <option value="">{s.periodPlaceholder}</option>
                  {vhpDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <VhpIcon name="chevronDown" className="vhp-field__caret" strokeWidth={1.8} />
              </span>
            </div>
            <button type="submit" className="vhp-btn vhp-btn--yellow">
              {s.submit}
              <VhpIcon name="arrowUpRight" />
            </button>
          </div>
          <p className="vhp-search__note">
            <VhpIcon name="info" strokeWidth={1.5} />
            {s.note}
          </p>
          <datalist id="vhp-places">
            {vhpPlaces.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </form>
      </div>
    </section>
  );
}
