"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  mobAislePath,
  mobAisles,
  mobHeroPhoto,
  mobHub,
  mobGuide,
  mobOtherHref,
  mobPlaces,
  mobProductPath,
  searchMobilier,
} from "@/content/mobilier";
import { FamilyGuide } from "@/components/articles/FamilyGuide";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useMobRequest } from "./MobRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { useResponsivePlaceholder } from "@/components/articles/useResponsivePlaceholder";
import { periodPatch } from "@/lib/family-period";
export function MobHub() {
  const router = useRouter();
  const request = useMobRequest();
  const [query, setQuery] = useState(request.state.query);
  const [zone, setZone] = useState(request.state.zone);
  const [startDate, setStartDate] = useState(request.state.startDate);
  const [endDate, setEndDate] = useState(request.state.endDate);
  const queryPh = useResponsivePlaceholder(mobHub.search.queryPlaceholder, mobHub.search.queryPlaceholderShort);
  const placePh = useResponsivePlaceholder(mobHub.search.placePlaceholder, mobHub.search.placePlaceholderShort);

  const onExplore = (event: FormEvent) => {
    event.preventDefault();
    request.setMeta({ query, zone, ...periodPatch(startDate, endDate) });
    const match = searchMobilier(query);
    if (match.product) {
      router.push(mobProductPath(match.product.aisleId, match.product.slug));
      return;
    }
    if (match.aisle) {
      router.push(mobAislePath(match.aisle.id));
      return;
    }
    document.getElementById("mob-aisles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mob-page mob-page--hub">
      <section className="mob-hero" aria-labelledby="mob-hero-title">
        <div className="mob-hero__media" aria-hidden>
          <Image
            src={mobHeroPhoto.src}
            alt=""
            fill
            sizes="100vw"
            className="mob-hero__img"
            style={{ objectPosition: mobHeroPhoto.objectPosition }}
            quality={88}
            priority
          />
        </div>
        <div className="mob-hero__shade" aria-hidden />
        <div className="mob-hero__inner">
          <div className="mob-hero__copy">
            <p className="mob-eyebrow mob-eyebrow--gold">{mobHub.eyebrow}</p>
            <h1 id="mob-hero-title" className="mob-h1 mob-h1--hero">
              {mobHub.title}
              <br />
              <span className="mob-underline">{mobHub.titleAccent}</span>
            </h1>
            <p className="mob-lead mob-lead--hero">{mobHub.lead}</p>
          </div>
        </div>
                <div className="mob-search-wrap">
          <form className="mob-search" onSubmit={onExplore} role="search">
            <div className="mob-search__row">
              <div>
                <label htmlFor="mob-hero-article">{mobHub.search.queryLabel}</label>
                <span className="mob-field--icon">
                  <VhpIcon name="search" strokeWidth={1.5} />
                  <input
                    id="mob-hero-article"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={queryPh}
                  />
                </span>
              </div>
              <div>
                <label htmlFor="mob-hero-place">{mobHub.search.placeLabel}</label>
                <span className="mob-field--icon mob-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <input
                    id="mob-hero-place"
                    list="mob-places"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder={placePh}
                    autoComplete="off"
                  />
                  <VhpIcon name="chevronDown" className="mob-field__caret" strokeWidth={1.8} />
                </span>
              </div>
              <div>
                <FamilyDateRange
                  prefix="mob"
                  startId="mob-hero-start"
                  endId="mob-hero-end"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startPlaceholder={mobHub.search.datesPlaceholder}
                  endPlaceholder={mobHub.search.datesPlaceholder}
                />
              </div>
              <button type="submit" className="mob-btn mob-btn--yellow">
                {mobHub.search.submit}
                <VhpIcon name="arrowUpRight" />
              </button>
            </div>
            <datalist id="mob-places">
              {mobPlaces.map((place) => (
                <option key={place} value={place} />
              ))}
            </datalist>
            <p className="mob-search__note">
              <VhpIcon name="info" strokeWidth={1.5} />
              {mobHub.searchNote}
            </p>
          </form>
        </div>
      </section>

      <div className="mob-shell">
        <section id="mob-aisles" className="mob-aisles" aria-labelledby="mob-aisles-title">
          <p className="mob-eyebrow mob-eyebrow--gold">{mobHub.aislesEyebrow}</p>
          <h2 id="mob-aisles-title" className="mob-h2">{mobHub.aislesTitle}</h2>
          <ul className="mob-aisles__grid">
            {mobAisles.map((aisle) => (
              <li key={aisle.id}>
                <Link href={mobAislePath(aisle.id)} className="mob-aisle-card">
                  <Image src={aisle.image.src} alt="" width={aisle.image.width} height={aisle.image.height} sizes="(max-width : 700px) 50vw, 20vw" className="mob-aisle-card__img" />
                  <span className="mob-aisle-card__label">
                    {aisle.title}
                    <VhpIcon name="arrowRight" strokeWidth={1.8} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FamilyGuide
          prefix="mob"
          title={mobGuide.title}
          uses={mobGuide.uses}
          criteria={mobGuide.criteria}
          precisTitle={mobGuide.precisTitle}
          precis={mobGuide.precis}
          otherHref={mobOtherHref}
          otherCta={mobHub.other.cta}
          otherLead={mobGuide.otherLead}
        />
      </div>
    </div>
  );
}
