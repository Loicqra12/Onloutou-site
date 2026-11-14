"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  REC_DEMANDE_PATH,
  REC_FAMILY_LABEL,
  REC_ROOT,
  recAisleCopy,
  recContactHref,
  recOtherHref,
  recPlaces,
  recProductPath,
  matchRecFilters,
  productsForRecAisle,
  type RecAisle,
} from "@/content/reception";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useRecRequest } from "./RecRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function RecAisle({ aisle }: { aisle: RecAisle }) {
  const request = useRecRequest();
  const catalogCount = productsForRecAisle(aisle.id).length;
  const compact = catalogCount <= 1 && aisle.filters.length === 0;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of aisle.filters) initial[group.id] = group.options[0]?.id ?? "tous";
    return initial;
  });

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productsForRecAisle(aisle.id).filter((product) => {
      if (!matchRecFilters(product, filters)) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.excerpt.toLowerCase().includes(q) ||
        product.keywords.some((word) => word.includes(q) || q.includes(word))
      );
    });
  }, [aisle.id, filters, query]);

  const showOtherSearch = aisle.id === "vaisselle-couverts";

  return (
    <div className="rec-page rec-page--aisle">
      <div className={aisle.bandImage ? "rec-aisle-hero-band" : undefined}>
        {aisle.bandImage ? (
          <>
            <div className="rec-aisle-hero-band__media" aria-hidden>
              <Image
                src={aisle.bandImage.src}
                alt=""
                fill
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: aisle.bandImage.objectPosition }}
                priority
              />
            </div>
            <div className="rec-aisle-hero-band__shade" aria-hidden />
          </>
        ) : null}
        <div className={aisle.bandImage ? "rec-aisle-hero-band__inner" : undefined}>
      <header className="rec-aisle-hero">
        <p className="rec-eyebrow rec-eyebrow--gold">{recAisleCopy.eyebrow}</p>
        <h1 className="rec-h1">
          <span className="rec-underline">{aisle.title}</span>
        </h1>
        <p className="rec-lead">{aisle.lead}</p>
        <nav className="rec-crumb" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">
                <VhpIcon name="home" strokeWidth={1.5} />
                <span className="visually-hidden">Accueil</span>
              </Link>
            </li>
            <li>
              <Link href={REC_ROOT}>{REC_FAMILY_LABEL}</Link>
            </li>
            <li>
              <span aria-current="page">{aisle.title}</span>
            </li>
          </ol>
        </nav>
        <div className="rec-aisle-tools">
          <label className="rec-field--icon rec-aisle-tools__search">
            <VhpIcon name="search" strokeWidth={1.5} className="rec-search__icon" />
            <span className="visually-hidden">{recAisleCopy.searchPlaceholder}</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={recAisleCopy.searchPlaceholder} />
          </label>
          <label className="rec-field--icon">
            <VhpIcon name="pin" strokeWidth={1.5} className="rec-search__icon" />
            <span className="visually-hidden">Commune</span>
            <select value={request.state.zone} onChange={(e) => request.setMeta({ zone: e.target.value })}>
              <option value="">Ville ou commune</option>
              {recPlaces.map((place) => (
                <option key={place} value={place}>{place}</option>
              ))}
            </select>
          </label>
          <FamilyDateRange
              prefix="rec"
              startId="rec-aisle-start"
              endId="rec-aisle-end"
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


      <div className={"rec-aisle-layout" + (compact ? " is-compact" : "")}>
        <aside className="rec-filters">
          <h2 className="rec-filters__title">{recAisleCopy.filterTitle}</h2>
          {aisle.filters.map((group) => (
            <fieldset key={group.id} className="rec-filters__group">
              <legend>{group.label}</legend>
              {group.kind === "radio" ? (
                group.options.map((option) => (
                  <label key={option.id} className={"rec-radio" + (filters[group.id] === option.id ? " is-on" : "")}>
                    <input type="radio" name={"rec-filter-" + group.id} checked={filters[group.id] === option.id} onChange={() => setFilters((prev) => ({ ...prev, [group.id]: option.id }))} />
                    <span>{option.label}</span>
                  </label>
                ))
              ) : (
                <label className="rec-field--icon rec-filters__select">
                  <select value={filters[group.id]} onChange={(e) => setFilters((prev) => ({ ...prev, [group.id]: e.target.value }))}>
                    {group.options.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </label>
              )}
            </fieldset>
          ))}
          <Link href={recContactHref} className="rec-advice">
            <VhpIcon name="headset" strokeWidth={1.5} />
            <span>
              <strong>{recAisleCopy.adviceTitle}</strong>
              {recAisleCopy.adviceText}
            </span>
          </Link>
        </aside>

        <div className="rec-results">
          <div className="rec-results__count">
            <strong>{recAisleCopy.resultsTitle}</strong>
            <span>{recAisleCopy.resultsLead}</span>
          </div>
          {products.length === 0 ? (
            <div className="rec-empty">
              <strong>{recAisleCopy.emptyTitle}</strong>
              <p>{recAisleCopy.emptyLead}</p>
              <Link href={recOtherHref} className="rec-btn rec-btn--yellow">Décrire mon besoin</Link>
            </div>
          ) : (
            <ul className="rec-product-grid">
              {products.map((product) => {
                const added = request.has(product.id);
                return (
                  <li key={product.id} className="rec-product-card">
                    <Image src={product.image.src} alt="" width={product.image.width} height={product.image.height} className="rec-product-card__img" sizes="(max-width : 900px) 100vw, 28vw" />
                    <p className="rec-product-card__kicker">{product.kicker}</p>
                    <h3 className="rec-product-card__title">{product.title}</h3>
                    <span className="rec-unit-badge">{product.unitBadge}</span>
                    <p className="rec-product-card__excerpt">{product.excerpt}</p>
                    {product.illustrative ? <p className="rec-product-card__excerpt">{recAisleCopy.emptyIllustrative}</p> : null}
                    <div className="rec-product-card__actions">
                  <Link href={recProductPath(product.aisleId, product.slug)} className="rec-product-card__sheet">{recAisleCopy.seeSheet} →</Link>
                    <button type="button" className={`rec-btn rec-btn--yellow`} aria-pressed={added} onClick={() => (added ? request.remove(product.id) : request.add(product.id, Math.max(1, request.quantity(product.id) || 1)))}>
                      {added ? recAisleCopy.added : "+ " + recAisleCopy.add}
                    </button>
                  </div>
                  </li>
                );
              })}
            </ul>
          )}

          {showOtherSearch ? (
            <form
              className="rec-other"
              onSubmit={(event) => {
                event.preventDefault();
                window.location.href = recOtherHref;
              }}
            >
              <label className="rec-other__field">
                <span className="visually-hidden">{recAisleCopy.exploreOtherTitle}</span>
                <VhpIcon name="search" strokeWidth={1.5} className="rec-search__icon" />
                <input type="search" placeholder={recAisleCopy.exploreOtherTitle} />
              </label>
              <a href={recOtherHref} className="rec-btn rec-btn--ghost">
                {recAisleCopy.exploreOtherTitle}
                <VhpIcon name="arrowRight" strokeWidth={1.8} />
              </a>
            </form>
          ) : null}
          <p className="rec-availability">
            <VhpIcon name="info" strokeWidth={1.5} />
            {recAisleCopy.availabilityNote}
          </p>
        </div>
      </div>

      {request.count > 0 ? (
        <div className="rec-bar">
          <div className="rec-bar__thumbs">
            {request.itemsWithProduct.slice(0, 3).map((item) => (
              <Image key={item.id} src={item.image.src} alt="" width={52} height={52} className="rec-bar__thumb" />
            ))}
          </div>
          <div className="rec-bar__copy">
            <p>
              <strong>{recAisleCopy.barTitle}</strong> · {request.count} {recAisleCopy.barDevices}
            </p>
          </div>
          <Link href={recOtherHref} className="rec-bar__link">{recAisleCopy.barOther}</Link>
          <Link href={REC_DEMANDE_PATH} className="rec-btn rec-btn--yellow">
            {recAisleCopy.barContinue}
            <VhpIcon name="arrowRight" strokeWidth={1.8} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
export { RecAisle as RecAisleView };
