"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { cmeHero, cmeImage, cmeImageSize } from "@/content/trucks-hub";
import { useCme } from "./CmeContext";
import { CmeDate } from "./CmeDate";
import { CmeIcon } from "./CmeIcon";

export function CmeHero() {
  const t = useCme();
  const s = cmeHero.search;
  const [w, h] = cmeImageSize[cmeHero.image.id];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    t.runSearch();
  };

  return (
    <section className="cme-hero" aria-labelledby="cme-hero-title">
      <div className="cme-hero__stage">
        <div className="cme-hero__bg" aria-hidden="true" />
        <Image
          src={cmeImage(cmeHero.image.id)}
          alt={cmeHero.image.alt}
          width={w}
          height={h}
          priority
          sizes="(min-width: 1100px) 72vw, 100vw"
          className="cme-hero__img"
        />
        <div className="cme-hero__shade" aria-hidden="true" />
        <div className="cme-wrap cme-hero__copy">
          <nav aria-label="Fil d’Ariane" className="cme-crumbs">
            <ol>
              {cmeHero.breadcrumb.map((c, i) => (
                <li key={c.label}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                  {i < cmeHero.breadcrumb.length - 1 ? <span aria-hidden="true"> / </span> : null}
                </li>
              ))}
            </ol>
          </nav>
          <h1 id="cme-hero-title" className="cme-h1">
            {cmeHero.titleLines.map((l) => (
              <span key={l} className="cme-line">
                {l}
              </span>
            ))}
            <span className="cme-line">
              <span className="cme-underline">{cmeHero.titleUnderline}</span>
            </span>
          </h1>
          <p className="cme-hero__lead">
            {cmeHero.lead.map((l) => (
              <span key={l} className="cme-line">
                {l}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="cme-wrap cme-search-wrap">
        <form className="cme-search" role="search" aria-label="Rechercher un camion ou un engin" onSubmit={onSubmit}>
          <div className="cme-search__row">
            <div className="cme-search__col">
              <label htmlFor="cme-hero-what">{s.whatLabel}</label>
              <span className="cme-field cme-field--icon">
                <CmeIcon name="search" strokeWidth={1.5} />
                <input
                  id="cme-hero-what"
                  type="text"
                  value={t.query}
                  placeholder={s.whatPlaceholder}
                  onChange={(e) => t.setQuery(e.target.value)}
                  autoComplete="off"
                />
              </span>
            </div>
            <div className="cme-search__col">
              <label htmlFor="cme-hero-where">{s.whereLabel}</label>
              <span className="cme-field cme-field--icon">
                <CmeIcon name="pin" strokeWidth={1.5} />
                <input
                  id="cme-hero-where"
                  type="text"
                  value={t.place}
                  placeholder={s.wherePlaceholder}
                  onChange={(e) => t.setPlace(e.target.value)}
                  autoComplete="off"
                />
              </span>
            </div>
            <div className="cme-search__col">
              <label htmlFor="cme-hero-when">{s.whenLabel}</label>
              <CmeDate id="cme-hero-when" value={t.start} onChange={t.setStart} placeholder={s.whenPlaceholder} />
            </div>
            <button type="submit" className="cme-btn cme-btn--yellow">
              {s.submit}
              <CmeIcon name="arrowUpRight" />
            </button>
          </div>
          <div className="cme-search__foot">
            <p>
              <CmeIcon name="stack" strokeWidth={1.5} />
              <span>
                {s.missing}{" "}
                <a
                  href="#demande-camion-engin"
                  className="cme-underlink"
                  onClick={(e) => {
                    e.preventDefault();
                    t.scrollTo("demande-camion-engin");
                  }}
                >
                  {s.describe}
                  <CmeIcon name="arrowRight" strokeWidth={2} />
                </a>
              </span>
            </p>
            <p className="cme-search__note">
              <CmeIcon name="info" strokeWidth={1.5} />
              {s.note}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
