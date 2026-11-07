"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { temHero } from "@/content/tools-hub";
import { useTem } from "./TemContext";
import { TemDate } from "./TemDate";
import { TemIcon } from "./TemIcon";

export function TemHero() {
  const t = useTem();
  const s = temHero.search;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    t.runSearch();
  };

  return (
    <section className="tem-hero" aria-labelledby="tem-hero-title">
      <div className="tem-hero__top">
        <div className="tem-hero__copy">
          <p className="tem-kicker">{temHero.eyebrow}</p>
          <h1 id="tem-hero-title" className="tem-h1">
            <span className="tem-line">{temHero.titleBefore}</span>
            <span className="tem-line">
              <span className="tem-underline">{temHero.titleUnderline}</span>
            </span>
            <span className="tem-line">{temHero.titleAfter}</span>
          </h1>
          <p className="tem-hero__lead">
            {temHero.lead.map((l) => (
              <span key={l} className="tem-line">
                {l}
              </span>
            ))}
          </p>
        </div>
        <div className="tem-hero__visual">
          <Image
            src={temHero.image.src}
            alt={temHero.image.alt}
            width={temHero.image.width}
            height={temHero.image.height}
            sizes="(min-width: 1200px) 58vw, 100vw"
            priority
            className="tem-hero__img"
          />
        </div>
      </div>

      <div className="tem-wrap">
        <form className="tem-search" role="search" aria-label="Rechercher du matériel" onSubmit={onSubmit}>
          <div className="tem-search__row">
            <div className="tem-search__col">
              <label htmlFor="tem-hero-what">{s.whatLabel}</label>
              <span className="tem-field tem-field--icon">
                <TemIcon name="search" strokeWidth={1.5} />
                <input
                  id="tem-hero-what"
                  type="text"
                  value={t.query}
                  placeholder={s.whatPlaceholder}
                  onChange={(e) => t.setQuery(e.target.value)}
                  autoComplete="off"
                />
              </span>
            </div>
            <div className="tem-search__col">
              <label htmlFor="tem-hero-where">{s.whereLabel}</label>
              <span className="tem-field tem-field--icon">
                <TemIcon name="pin" strokeWidth={1.5} />
                <input
                  id="tem-hero-where"
                  type="text"
                  value={t.zone}
                  placeholder={s.wherePlaceholder}
                  onChange={(e) => t.setZone(e.target.value)}
                  autoComplete="off"
                />
              </span>
            </div>
            <div className="tem-search__col">
              <label htmlFor="tem-hero-when">{s.whenLabel}</label>
              <TemDate id="tem-hero-when" value={t.start} onChange={t.setStart} placeholder={s.whenPlaceholder} />
            </div>
            <button type="submit" className="tem-btn tem-btn--yellow">
              {s.submit}
              <TemIcon name="arrowUpRight" />
            </button>
          </div>
          <div className="tem-search__foot">
            <p>
              <TemIcon name="stack" strokeWidth={1.5} />
              <span>
                {s.missing}{" "}
                <a href="#demande-materiel" className="tem-underlink" onClick={(e) => { e.preventDefault(); t.scrollTo("demande-materiel"); }}>
                  {s.describe}
                  <TemIcon name="arrowUpRight" strokeWidth={2} />
                </a>
              </span>
            </p>
            <p className="tem-search__note">
              <TemIcon name="info" strokeWidth={1.5} />
              {s.note}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
