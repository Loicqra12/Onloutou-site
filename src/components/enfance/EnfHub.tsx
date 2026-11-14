"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  enfAislePath,
  enfAisles,
  enfHeroPhoto,
  enfHub,
  enfGuide,
  enfOtherHref,
  enfPlaces,
  enfProductPath,
  searchEnfance,
} from "@/content/enfance";
import { FamilyGuide } from "@/components/articles/FamilyGuide";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useEnfRequest } from "./EnfRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { useResponsivePlaceholder } from "@/components/articles/useResponsivePlaceholder";
import { periodPatch } from "@/lib/family-period";
export function EnfHub() {
  const router = useRouter();
  const request = useEnfRequest();
  const [query, setQuery] = useState(request.state.query);
  const [zone, setZone] = useState(request.state.zone);
  const [startDate, setStartDate] = useState(request.state.startDate);
  const [endDate, setEndDate] = useState(request.state.endDate);
  const queryPh = useResponsivePlaceholder(enfHub.search.queryPlaceholder, enfHub.search.queryPlaceholderShort);
  const placePh = useResponsivePlaceholder(enfHub.search.placePlaceholder, enfHub.search.placePlaceholderShort);

  const onExplore = (event: FormEvent) => {
    event.preventDefault();
    request.setMeta({ query, zone, ...periodPatch(startDate, endDate) });
    const match = searchEnfance(query);
    if (match.product) {
      router.push(enfProductPath(match.product.aisleId, match.product.slug));
      return;
    }
    if (match.aisle) {
      router.push(enfAislePath(match.aisle.id));
      return;
    }
    document.getElementById("enf-aisles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="enf-page enf-page--hub">
      <section className="enf-hero" aria-labelledby="enf-hero-title">
        <div className="enf-hero__media" aria-hidden>
          <Image
            src={enfHeroPhoto.src}
            alt=""
            fill
            sizes="100vw"
            className="enf-hero__img"
            style={{ objectPosition: enfHeroPhoto.objectPosition }}
            quality={88}
            priority
          />
        </div>
        <div className="enf-hero__shade" aria-hidden />
        <div className="enf-hero__inner">
          <div className="enf-hero__copy">
            <p className="enf-eyebrow enf-eyebrow--gold">{enfHub.eyebrow}</p>
            <h1 id="enf-hero-title" className="enf-h1 enf-h1--hero">
              {enfHub.title}
              <br />
              <span className="enf-underline">{enfHub.titleAccent}</span>
            </h1>
            <p className="enf-lead enf-lead--hero">{enfHub.question}</p>
          </div>
        </div>
        <div className="enf-search-wrap">
          <form className="enf-search" onSubmit={onExplore} role="search">
            <div className="enf-search__row">
              <div>
                <label htmlFor="enf-hero-article">{enfHub.search.queryLabel}</label>
                <span className="enf-field--icon">
                  <VhpIcon name="search" strokeWidth={1.5} />
                  <input
                    id="enf-hero-article"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={queryPh}
                  />
                </span>
              </div>
              <div>
                <label htmlFor="enf-hero-place">{enfHub.search.placeLabel}</label>
                <span className="enf-field--icon enf-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <input
                    id="enf-hero-place"
                    list="enf-places"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder={placePh}
                    autoComplete="off"
                  />
                  <VhpIcon name="chevronDown" className="enf-field__caret" strokeWidth={1.8} />
                </span>
              </div>
              <div>
                <FamilyDateRange
                  prefix="enf"
                  startId="enf-hero-start"
                  endId="enf-hero-end"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startPlaceholder={enfHub.search.datesPlaceholder}
                  endPlaceholder={enfHub.search.datesPlaceholder}
                />
              </div>
              <button type="submit" className="enf-btn enf-btn--yellow">
                {enfHub.search.submit}
                <VhpIcon name="arrowUpRight" />
              </button>
            </div>
            <datalist id="enf-places">
              {enfPlaces.map((place) => (
                <option key={place} value={place} />
              ))}
            </datalist>
            <p className="enf-search__note">
              <VhpIcon name="info" strokeWidth={1.5} />
              {enfHub.searchNote}
            </p>
          </form>
        </div>
      </section>

      <div className="enf-shell">
        <section id="enf-aisles" className="enf-aisles" aria-labelledby="enf-aisles-title">
          <p className="enf-eyebrow enf-eyebrow--gold">{enfHub.aislesEyebrow}</p>
          <h2 id="enf-aisles-title" className="enf-h2">
            {enfHub.aislesTitle}
          </h2>
          <ul className="enf-aisles__grid">
            {enfAisles.map((aisle) => (
              <li key={aisle.id}>
                <Link href={enfAislePath(aisle.id)} className="enf-aisle-card">
                  <Image
                    src={aisle.image.src}
                    alt=""
                    width={aisle.image.width}
                    height={aisle.image.height}
                    sizes="(max-width: 700px) 50vw, 20vw"
                    className="enf-aisle-card__img"
                    style={{ objectPosition: aisle.image.objectPosition }}
                  />
                  <span className="enf-aisle-card__label">
                    {aisle.title}
                    <VhpIcon name="arrowRight" strokeWidth={1.8} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FamilyGuide
          prefix="enf"
          title={enfGuide.title}
          uses={enfGuide.uses}
          criteria={enfGuide.criteria}
          precisTitle={enfGuide.precisTitle}
          precis={enfGuide.precis}
          otherHref={enfOtherHref}
          otherCta={enfHub.other.cta}
          otherLead={enfGuide.otherLead}
        />
      </div>
    </div>
  );
}
