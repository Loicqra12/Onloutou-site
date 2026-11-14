"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  recAislePath,
  recAisles,
  recHeroPhoto,
  recHub,
  recGuide,
  recOtherHref,
  recPlaces,
  recProductPath,
  searchReception,
} from "@/content/reception";
import { FamilyGuide } from "@/components/articles/FamilyGuide";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useRecRequest } from "./RecRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { useResponsivePlaceholder } from "@/components/articles/useResponsivePlaceholder";
import { periodPatch } from "@/lib/family-period";
export function RecHub() {
  const router = useRouter();
  const request = useRecRequest();
  const [query, setQuery] = useState(request.state.query);
  const [zone, setZone] = useState(request.state.zone);
  const [startDate, setStartDate] = useState(request.state.startDate);
  const [endDate, setEndDate] = useState(request.state.endDate);
  const queryPh = useResponsivePlaceholder(recHub.search.queryPlaceholder, recHub.search.queryPlaceholderShort);
  const placePh = useResponsivePlaceholder(recHub.search.placePlaceholder, recHub.search.placePlaceholderShort);

  const onExplore = (event: FormEvent) => {
    event.preventDefault();
    request.setMeta({ query, zone, ...periodPatch(startDate, endDate) });
    const match = searchReception(query);
    if (match.product) {
      router.push(recProductPath(match.product.aisleId, match.product.slug));
      return;
    }
    if (match.aisle) {
      router.push(recAislePath(match.aisle.id));
      return;
    }
    document.getElementById("rec-aisles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rec-page rec-page--hub">
      <section className="rec-hero" aria-labelledby="rec-hero-title">
        <div className="rec-hero__media" aria-hidden>
          <Image
            src={recHeroPhoto.src}
            alt=""
            fill
            sizes="100vw"
            className="rec-hero__img"
            style={{ objectPosition: recHeroPhoto.objectPosition }}
            quality={88}
            priority
          />
        </div>
        <div className="rec-hero__shade" aria-hidden />
        <div className="rec-hero__inner">
          <div className="rec-hero__copy">
            <p className="rec-eyebrow rec-eyebrow--gold">{recHub.eyebrow}</p>
            <h1 id="rec-hero-title" className="rec-h1 rec-h1--hero">
              {recHub.title}
              <br />
              <span className="rec-underline">{recHub.titleAccent}</span>
            </h1>
            <p className="rec-lead rec-lead--hero">{recHub.lead}</p>
          </div>
        </div>
                <div className="rec-search-wrap">
          <form className="rec-search" onSubmit={onExplore} role="search">
            <div className="rec-search__row">
              <div>
                <label htmlFor="rec-hero-article">{recHub.search.queryLabel}</label>
                <span className="rec-field--icon">
                  <VhpIcon name="search" strokeWidth={1.5} />
                  <input
                    id="rec-hero-article"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={queryPh}
                  />
                </span>
              </div>
              <div>
                <label htmlFor="rec-hero-place">{recHub.search.placeLabel}</label>
                <span className="rec-field--icon rec-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <input
                    id="rec-hero-place"
                    list="rec-places"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder={placePh}
                    autoComplete="off"
                  />
                  <VhpIcon name="chevronDown" className="rec-field__caret" strokeWidth={1.8} />
                </span>
              </div>
              <div>
                <FamilyDateRange
                  prefix="rec"
                  startId="rec-hero-start"
                  endId="rec-hero-end"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startPlaceholder={recHub.search.datesPlaceholder}
                  endPlaceholder={recHub.search.datesPlaceholder}
                />
              </div>
              <button type="submit" className="rec-btn rec-btn--yellow">
                {recHub.search.submit}
                <VhpIcon name="arrowUpRight" />
              </button>
            </div>
            <datalist id="rec-places">
              {recPlaces.map((place) => (
                <option key={place} value={place} />
              ))}
            </datalist>
            <p className="rec-search__note">
              <VhpIcon name="info" strokeWidth={1.5} />
              {recHub.searchNote}
            </p>
          </form>
        </div>
      </section>

      <div className="rec-shell">
        <section id="rec-aisles" className="rec-aisles" aria-labelledby="rec-aisles-title">
          <p className="rec-eyebrow rec-eyebrow--gold">{recHub.aislesEyebrow}</p>
          <h2 id="rec-aisles-title" className="rec-h2">{recHub.aislesTitle}</h2>
          <ul className="rec-aisles__grid">
            {recAisles.map((aisle) => (
              <li key={aisle.id}>
                <Link href={recAislePath(aisle.id)} className="rec-aisle-card">
                  <Image src={aisle.image.src} alt="" width={aisle.image.width} height={aisle.image.height} sizes="(max-width : 700px) 50vw, 20vw" className="rec-aisle-card__img" />
                  <span className="rec-aisle-card__label">
                    {aisle.title}
                    <VhpIcon name="arrowRight" strokeWidth={1.8} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FamilyGuide
          prefix="rec"
          title={recGuide.title}
          uses={recGuide.uses}
          criteria={recGuide.criteria}
          precisTitle={recGuide.precisTitle}
          precis={recGuide.precis}
          otherHref={recOtherHref}
          otherCta={recHub.other.cta}
          otherLead={recGuide.otherLead}
        />
      </div>
    </div>
  );
}
