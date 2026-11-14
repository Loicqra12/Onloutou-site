"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  elmAislePath,
  elmAisles,
  elmHeroPhoto,
  elmHub,
  elmGuide,
  elmOtherHref,
  elmPlaces,
  elmProductPath,
  searchElectromenager,
} from "@/content/electromenager";
import { FamilyGuide } from "@/components/articles/FamilyGuide";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useElmRequest } from "./ElmRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { useResponsivePlaceholder } from "@/components/articles/useResponsivePlaceholder";
import { periodPatch } from "@/lib/family-period";
export function ElmHub() {
  const router = useRouter();
  const request = useElmRequest();
  const [query, setQuery] = useState(request.state.query);
  const [zone, setZone] = useState(request.state.zone);
  const [startDate, setStartDate] = useState(request.state.startDate);
  const [endDate, setEndDate] = useState(request.state.endDate);
  const queryPh = useResponsivePlaceholder(elmHub.search.queryPlaceholder, elmHub.search.queryPlaceholderShort);
  const placePh = useResponsivePlaceholder(elmHub.search.placePlaceholder, elmHub.search.placePlaceholderShort);

  const onExplore = (event: FormEvent) => {
    event.preventDefault();
    request.setMeta({ query, zone, ...periodPatch(startDate, endDate) });
    const match = searchElectromenager(query);
    if (match.product) {
      router.push(elmProductPath(match.product.aisleId, match.product.slug));
      return;
    }
    if (match.aisle) {
      router.push(elmAislePath(match.aisle.id));
      return;
    }
    document.getElementById("elm-aisles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleAisles = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return elmAisles;
    const match = searchElectromenager(query);
    if (match.aisle) return elmAisles.filter((aisle) => aisle.id === match.aisle?.id);
    return elmAisles.filter(
      (aisle) => aisle.title.toLowerCase().includes(q) || aisle.lead.toLowerCase().includes(q),
    );
  })();

  return (
    <div className="elm-page elm-page--hub">
      <section className="elm-hero" aria-labelledby="elm-hero-title">
        <div className="elm-hero__media" aria-hidden>
          <Image
            src={elmHeroPhoto.src}
            alt=""
            fill
            sizes="100vw"
            className="elm-hero__img"
            style={{ objectPosition: elmHeroPhoto.objectPosition }}
            quality={88}
            priority
          />
        </div>
        <div className="elm-hero__shade" aria-hidden />
        <div className="elm-hero__inner">
          <div className="elm-hero__copy">
            <p className="elm-eyebrow elm-eyebrow--gold">{elmHub.eyebrow}</p>
            <h1 id="elm-hero-title" className="elm-h1 elm-h1--hero">
              {elmHub.title}
              <br />
              <span className="elm-underline">{elmHub.titleAccent}</span>
            </h1>
            <p className="elm-lead elm-lead--hero">{elmHub.lead}</p>
          </div>
        </div>
                <div className="elm-search-wrap">
          <form className="elm-search" onSubmit={onExplore} role="search">
            <div className="elm-search__row">
              <div>
                <label htmlFor="elm-hero-article">{elmHub.search.queryLabel}</label>
                <span className="elm-field--icon">
                  <VhpIcon name="search" strokeWidth={1.5} />
                  <input
                    id="elm-hero-article"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={queryPh}
                  />
                </span>
              </div>
              <div>
                <label htmlFor="elm-hero-place">{elmHub.search.placeLabel}</label>
                <span className="elm-field--icon elm-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <input
                    id="elm-hero-place"
                    list="elm-places"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder={placePh}
                    autoComplete="off"
                  />
                  <VhpIcon name="chevronDown" className="elm-field__caret" strokeWidth={1.8} />
                </span>
              </div>
              <div>
                <FamilyDateRange
                  prefix="elm"
                  startId="elm-hero-start"
                  endId="elm-hero-end"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startPlaceholder={elmHub.search.datesPlaceholder}
                  endPlaceholder={elmHub.search.datesPlaceholder}
                />
              </div>
              <button type="submit" className="elm-btn elm-btn--yellow">
                {elmHub.search.submit}
                <VhpIcon name="arrowUpRight" />
              </button>
            </div>
            <datalist id="elm-places">
              {elmPlaces.map((place) => (
                <option key={place} value={place} />
              ))}
            </datalist>
            <p className="elm-search__note">
              <VhpIcon name="info" strokeWidth={1.5} />
              {elmHub.searchNote}
            </p>
          </form>
        </div>
      </section>

      <div className="elm-shell">
        <section id="elm-aisles" className="elm-aisles" aria-labelledby="elm-aisles-title">
          <p className="elm-eyebrow elm-eyebrow--gold">{elmHub.aislesEyebrow}</p>
          <h2 id="elm-aisles-title" className="elm-h2">
            {elmHub.aislesTitle}
          </h2>
          <ul className="elm-aisles__grid">
            {visibleAisles.map((aisle) => (
              <li key={aisle.id}>
                <Link href={elmAislePath(aisle.id)} className="elm-aisle-card">
                  <Image
                    src={aisle.image.src}
                    alt=""
                    width={aisle.image.width}
                    height={aisle.image.height}
                    sizes="(max-width : 700px) 100vw, 24vw"
                    className="elm-aisle-card__img"
                  />
                  <span className="elm-aisle-card__label">
                    {aisle.title}
                    <VhpIcon name="arrowRight" strokeWidth={1.8} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FamilyGuide
          prefix="elm"
          title={elmGuide.title}
          uses={elmGuide.uses}
          criteria={elmGuide.criteria}
          precisTitle={elmGuide.precisTitle}
          precis={elmGuide.precis}
          otherHref={elmOtherHref}
          otherCta={elmHub.other.cta}
          otherLead={elmGuide.otherLead}
        />
      </div>
    </div>
  );
}