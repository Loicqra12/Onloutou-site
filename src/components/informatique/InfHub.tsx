"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  infAislePath,
  infAisles,
  infHeroPhoto,
  infHub,
  infGuide,
  infOtherHref,
  infPlaces,
  infProductPath,
  searchInformatique,
} from "@/content/informatique";
import { FamilyGuide } from "@/components/articles/FamilyGuide";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useInfRequest } from "./InfRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { useResponsivePlaceholder } from "@/components/articles/useResponsivePlaceholder";
import { periodPatch } from "@/lib/family-period";
export function InfHub() {
  const router = useRouter();
  const request = useInfRequest();
  const [query, setQuery] = useState(request.state.query);
  const [zone, setZone] = useState(request.state.zone);
  const [startDate, setStartDate] = useState(request.state.startDate);
  const [endDate, setEndDate] = useState(request.state.endDate);
  const queryPh = useResponsivePlaceholder(infHub.search.queryPlaceholder, infHub.search.queryPlaceholderShort);
  const placePh = useResponsivePlaceholder(infHub.search.placePlaceholder, infHub.search.placePlaceholderShort);

  const onExplore = (event: FormEvent) => {
    event.preventDefault();
    request.setMeta({ query, zone, ...periodPatch(startDate, endDate) });
    const match = searchInformatique(query);
    if (match.product) {
      router.push(infProductPath(match.product.aisleId, match.product.slug));
      return;
    }
    if (match.aisle) {
      router.push(infAislePath(match.aisle.id));
      return;
    }
    document.getElementById("inf-aisles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="inf-page inf-page--hub">
      <section className="inf-hero" aria-labelledby="inf-hero-title">
        <div className="inf-hero__media" aria-hidden>
          <Image
            src={infHeroPhoto.src}
            alt=""
            fill
            sizes="100vw"
            className="inf-hero__img"
            style={{ objectPosition: infHeroPhoto.objectPosition }}
            quality={88}
            priority
          />
        </div>
        <div className="inf-hero__shade" aria-hidden />
        <div className="inf-hero__inner">
          <div className="inf-hero__copy">
            <p className="inf-eyebrow inf-eyebrow--gold">{infHub.eyebrow}</p>
            <h1 id="inf-hero-title" className="inf-h1 inf-h1--hero">
              {infHub.title}
              <br />
              <span className="inf-underline">{infHub.titleAccent}</span>
            </h1>
            <p className="inf-lead inf-lead--hero">{infHub.lead}</p>
          </div>
        </div>
                <div className="inf-search-wrap">
          <form className="inf-search" onSubmit={onExplore} role="search">
            <div className="inf-search__row">
              <div>
                <label htmlFor="inf-hero-article">{infHub.search.queryLabel}</label>
                <span className="inf-field--icon">
                  <VhpIcon name="search" strokeWidth={1.5} />
                  <input
                    id="inf-hero-article"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={queryPh}
                  />
                </span>
              </div>
              <div>
                <label htmlFor="inf-hero-place">{infHub.search.placeLabel}</label>
                <span className="inf-field--icon inf-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <input
                    id="inf-hero-place"
                    list="inf-places"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder={placePh}
                    autoComplete="off"
                  />
                  <VhpIcon name="chevronDown" className="inf-field__caret" strokeWidth={1.8} />
                </span>
              </div>
              <div>
                <FamilyDateRange
                  prefix="inf"
                  startId="inf-hero-start"
                  endId="inf-hero-end"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startPlaceholder={infHub.search.datesPlaceholder}
                  endPlaceholder={infHub.search.datesPlaceholder}
                />
              </div>
              <button type="submit" className="inf-btn inf-btn--yellow">
                {infHub.search.submit}
                <VhpIcon name="arrowUpRight" />
              </button>
            </div>
            <datalist id="inf-places">
              {infPlaces.map((place) => (
                <option key={place} value={place} />
              ))}
            </datalist>
            <p className="inf-search__note">
              <VhpIcon name="info" strokeWidth={1.5} />
              {infHub.searchNote}
            </p>
          </form>
        </div>
      </section>

      <div className="inf-shell">
        <section id="inf-aisles" className="inf-aisles" aria-labelledby="inf-aisles-title">
          <p className="inf-eyebrow inf-eyebrow--gold">{infHub.aislesEyebrow}</p>
          <h2 id="inf-aisles-title" className="inf-h2">{infHub.aislesTitle}</h2>
          <ul className="inf-aisles__grid">
            {infAisles.map((aisle) => (
              <li key={aisle.id}>
                <Link href={infAislePath(aisle.id)} className="inf-aisle-card">
                  <Image src={aisle.image.src} alt="" width={aisle.image.width} height={aisle.image.height} sizes="(max-width : 700px) 50vw, 20vw" className="inf-aisle-card__img" />
                  <span className="inf-aisle-card__label">
                    {aisle.title}
                    <VhpIcon name="arrowRight" strokeWidth={1.8} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FamilyGuide
          prefix="inf"
          title={infGuide.title}
          uses={infGuide.uses}
          criteria={infGuide.criteria}
          precisTitle={infGuide.precisTitle}
          precis={infGuide.precis}
          otherHref={infOtherHref}
          otherCta={infHub.other.cta}
          otherLead={infGuide.otherLead}
        />
      </div>
    </div>
  );
}
