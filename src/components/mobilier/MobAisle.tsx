"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MOB_DEMANDE_PATH,
  MOB_FAMILY_LABEL,
  MOB_ROOT,
  getMobAisle,
  mobAisleCopy,
  mobAislePath,
  mobContactHref,
  mobOtherHref,
  mobPlaces,
  mobProductPath,
  matchMobFilters,
  productsForMobAisle,
  type MobAisle,
} from "@/content/mobilier";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useMobRequest } from "./MobRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function MobAisle({ aisle }: { aisle: MobAisle }) {
  const request = useMobRequest();
  const catalogCount = productsForMobAisle(aisle.id).length;
  const compact = catalogCount <= 1 && aisle.filters.length === 0;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of aisle.filters) initial[group.id] = group.options[0]?.id ?? "tous";
    return initial;
  });

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productsForMobAisle(aisle.id).filter((product) => {
      if (!matchMobFilters(product, filters)) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.excerpt.toLowerCase().includes(q) ||
        product.keywords.some((word) => word.includes(q) || q.includes(word))
      );
    });
  }, [aisle.id, filters, query]);

  const exploreAisles =
    aisle.id === "assises-canapes"
      ? ([getMobAisle("tables-consoles"), getMobAisle("luminaires")].filter(Boolean) as NonNullable<ReturnType<typeof getMobAisle>>[])
      : [];

  return (
    <div className="mob-page mob-page--aisle">
      <div className={aisle.bandImage ? "mob-aisle-hero-band" : undefined}>
        {aisle.bandImage ? (
          <>
            <div className="mob-aisle-hero-band__media" aria-hidden>
              <Image
                src={aisle.bandImage.src}
                alt=""
                fill
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: aisle.bandImage.objectPosition }}
                priority
              />
            </div>
            <div className="mob-aisle-hero-band__shade" aria-hidden />
          </>
        ) : null}
        <div className={aisle.bandImage ? "mob-aisle-hero-band__inner" : undefined}>
      <header className="mob-aisle-hero">
        <p className="mob-eyebrow mob-eyebrow--gold">{mobAisleCopy.eyebrow}</p>
        <h1 className="mob-h1">
          <span className="mob-underline">{aisle.title}</span>
        </h1>
        <p className="mob-lead">{aisle.lead}</p>
        <nav className="mob-crumb" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">
                <VhpIcon name="home" strokeWidth={1.5} />
                <span className="visually-hidden">Accueil</span>
              </Link>
            </li>
            <li>
              <Link href={MOB_ROOT}>{MOB_FAMILY_LABEL}</Link>
            </li>
            <li>
              <span aria-current="page">{aisle.title}</span>
            </li>
          </ol>
        </nav>
        <div className="mob-aisle-tools">
          <label className="mob-field--icon mob-aisle-tools__search">
            <VhpIcon name="search" strokeWidth={1.5} className="mob-search__icon" />
            <span className="visually-hidden">{mobAisleCopy.searchPlaceholder}</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={mobAisleCopy.searchPlaceholder} />
          </label>
          <label className="mob-field--icon">
            <VhpIcon name="pin" strokeWidth={1.5} className="mob-search__icon" />
            <span className="visually-hidden">Commune</span>
            <select value={request.state.zone} onChange={(e) => request.setMeta({ zone: e.target.value })}>
              <option value="">Ville ou commune</option>
              {mobPlaces.map((place) => (
                <option key={place} value={place}>{place}</option>
              ))}
            </select>
          </label>
          <FamilyDateRange
              prefix="mob"
              startId="mob-aisle-start"
              endId="mob-aisle-end"
              startDate={request.state.startDate}
              endDate={request.state.endDate}
              onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
              startPlaceholder="Début"
              endPlaceholder="Fin"
            />
        </div>
      </header>
        </div>
      </div>


      <div className={"mob-aisle-layout" + (compact ? " is-compact" : "")}>
        <aside className="mob-filters">
          <h2 className="mob-filters__title">{mobAisleCopy.filterTitle}</h2>
          {aisle.filters.map((group) => (
            <fieldset key={group.id} className="mob-filters__group">
              <legend>{group.label}</legend>
              {group.kind === "radio" ? (
                group.options.map((option) => (
                  <label key={option.id} className={"mob-radio" + (filters[group.id] === option.id ? " is-on" : "")}>
                    <input type="radio" name={"mob-filter-" + group.id} checked={filters[group.id] === option.id} onChange={() => setFilters((prev) => ({ ...prev, [group.id]: option.id }))} />
                    <span>{option.label}</span>
                  </label>
                ))
              ) : (
                <label className="mob-field--icon mob-filters__select">
                  <select value={filters[group.id]} onChange={(e) => setFilters((prev) => ({ ...prev, [group.id]: e.target.value }))}>
                    {group.options.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </label>
              )}
            </fieldset>
          ))}
          <Link href={mobContactHref} className="mob-advice">
            <VhpIcon name="headset" strokeWidth={1.5} />
            <span>
              <strong>{mobAisleCopy.adviceTitle}</strong>
              {aisle.id === "assises-canapes" ? "Nos �quipes vous aident � choisir la bonne assise selon vos usages." : mobAisleCopy.adviceText}
            </span>
          </Link>
        </aside>

        <div className="mob-results">
          <div className="mob-results__count">
            <strong>{mobAisleCopy.resultsTitle}</strong>
            <span>{aisle.id === "assises-canapes" ? "Une s�lection d’assises adapt�es � vos besoins professionnels." : mobAisleCopy.resultsLead}</span>
          </div>
          {products.length === 0 ? (
            <div className="mob-empty">
              <strong>{mobAisleCopy.emptyTitle}</strong>
              <p>{mobAisleCopy.emptyLead}</p>
              <Link href={mobOtherHref} className="mob-btn mob-btn--yellow">Décrire mon besoin</Link>
            </div>
          ) : (
            <ul className="mob-product-grid">
              {products.map((product) => {
                const added = request.has(product.id);
                return (
                  <li key={product.id} className="mob-product-card">
                    <Image src={product.image.src} alt="" width={product.image.width} height={product.image.height} className="mob-product-card__img" sizes="(max-width : 900px) 100vw, 28vw" />
                    <p className="mob-product-card__kicker">{product.kicker}</p>
                    <h3 className="mob-product-card__title">{product.title}</h3>
                    <p className="mob-product-card__excerpt">{product.highlight || product.excerpt}</p>
                    {product.illustrative ? <p className="mob-product-card__excerpt">{mobAisleCopy.emptyIllustrative}</p> : null}
                    <div className="mob-product-card__actions">
                  <Link href={mobProductPath(product.aisleId, product.slug)} className="mob-product-card__sheet">{mobAisleCopy.seeSheet} →</Link>
                    <button type="button" className={`mob-btn mob-btn--yellow`} aria-pressed={added} onClick={() => (added ? request.remove(product.id) : request.add(product.id, Math.max(1, request.quantity(product.id) || 1)))}>
                      {added ? mobAisleCopy.added : "+ " + mobAisleCopy.add}
                    </button>
                  </div>
                  </li>
                );
              })}
            </ul>
          )}

          {exploreAisles.length ? (
            <div className="mob-explore-other">
              <div>
                <strong>{mobAisleCopy.exploreOtherTitle}</strong>
                <p>{mobAisleCopy.exploreOtherLead}</p>
              </div>
              <div className="mob-explore-cards">
                {exploreAisles.map((other) => (
                  <Link key={other.id} href={mobAislePath(other.id)} className="mob-explore-card">
                    <Image
                      src={other.image.src}
                      alt=""
                      width={120}
                      height={90}
                      sizes="120px"
                      style={{ objectFit: "cover", objectPosition: other.image.objectPosition }}
                    />
                    <span>{other.title}</span>
                    <span aria-hidden>?</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <p className="mob-availability">
            <VhpIcon name="info" strokeWidth={1.5} />
            {mobAisleCopy.availabilityNote}
          </p>
        </div>
      </div>

      {request.count > 0 ? (
        <div className="mob-bar">
          <div className="mob-bar__thumbs">
            {request.itemsWithProduct.slice(0, 3).map((item) => (
              <Image key={item.id} src={item.image.src} alt="" width={52} height={52} className="mob-bar__thumb" />
            ))}
          </div>
          <div className="mob-bar__copy">
            <p>
              <strong>{mobAisleCopy.barTitle}</strong> · {request.count} {mobAisleCopy.barDevices}
            </p>
          </div>
          <Link href={mobOtherHref} className="mob-bar__link">{mobAisleCopy.barOther}</Link>
          <Link href={MOB_DEMANDE_PATH} className="mob-btn mob-btn--yellow">
            {mobAisleCopy.barContinue}
            <VhpIcon name="arrowRight" strokeWidth={1.8} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
export { MobAisle as MobAisleView };
