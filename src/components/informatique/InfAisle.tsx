"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  INF_DEMANDE_PATH,
  INF_FAMILY_LABEL,
  INF_ROOT,
  getInfAisle,
  infAisleCopy,
  infAislePath,
  infContactHref,
  infOtherHref,
  infPlaces,
  infProductPath,
  matchInfFilters,
  productsForInfAisle,
  type InfAisle,
} from "@/content/informatique";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useInfRequest } from "./InfRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function InfAisleView({ aisle }: { aisle: InfAisle }) {
  const request = useInfRequest();
  const catalogCount = productsForInfAisle(aisle.id).length;
  const compact = catalogCount <= 1 && aisle.filters.length === 0;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of aisle.filters) initial[group.id] = group.options[0]?.id ?? "tous";
    return initial;
  });

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productsForInfAisle(aisle.id).filter((product) => {
      if (!matchInfFilters(product, filters)) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.excerpt.toLowerCase().includes(q) ||
        product.keywords.some((word) => word.includes(q) || q.includes(word))
      );
    });
  }, [aisle.id, filters, query]);

  const network = getInfAisle("reseau-internet");

  return (
    <div className="inf-page inf-page--aisle">
      <header className="inf-aisle-hero">
        <p className="inf-eyebrow inf-eyebrow--gold">{infAisleCopy.eyebrow}</p>
        <h1 className="inf-h1">
          {aisle.title} <span className="inf-underline">{infAisleCopy.titleSuffix}</span>
        </h1>
        <p className="inf-lead">{aisle.lead}</p>
        <nav className="inf-crumb" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">
                <VhpIcon name="home" strokeWidth={1.5} />
                <span className="visually-hidden">Accueil</span>
              </Link>
            </li>
            <li>
              <Link href={INF_ROOT}>{INF_FAMILY_LABEL}</Link>
            </li>
            <li>
              <span aria-current="page">{aisle.title}</span>
            </li>
          </ol>
        </nav>
        <div className="inf-aisle-tools">
          <label className="inf-field--icon inf-aisle-tools__search">
            <VhpIcon name="search" strokeWidth={1.5} className="inf-search__icon" />
            <span className="visually-hidden">{infAisleCopy.searchPlaceholder}</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={infAisleCopy.searchPlaceholder} />
          </label>
          <label className="inf-field--icon">
            <VhpIcon name="pin" strokeWidth={1.5} className="inf-search__icon" />
            <span className="visually-hidden">Commune</span>
            <select value={request.state.zone} onChange={(e) => request.setMeta({ zone: e.target.value })}>
              <option value="">Ville ou commune</option>
              {infPlaces.map((place) => (
                <option key={place} value={place}>{place}</option>
              ))}
            </select>
          </label>
          <FamilyDateRange
              prefix="inf"
              startId="inf-aisle-start"
              endId="inf-aisle-end"
              startDate={request.state.startDate}
              endDate={request.state.endDate}
              onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
              startPlaceholder="Début"
              endPlaceholder="Fin"
            />
        </div>
      </header>

      <div className={"inf-aisle-layout" + (compact ? " is-compact" : "")}>
        <aside className="inf-filters">
          <h2 className="inf-filters__title">{infAisleCopy.filterTitle}</h2>
          {aisle.filters.map((group) => (
            <fieldset key={group.id} className="inf-filters__group">
              <legend>{group.label}</legend>
              {group.kind === "radio" ? (
                group.options.map((option) => (
                  <label key={option.id} className={"inf-radio" + (filters[group.id] === option.id ? " is-on" : "")}>
                    <input type="radio" name={"inf-filter-" + group.id} checked={filters[group.id] === option.id} onChange={() => setFilters((prev) => ({ ...prev, [group.id]: option.id }))} />
                    <span>{option.label}</span>
                  </label>
                ))
              ) : (
                <label className="inf-field--icon inf-filters__select">
                  <select value={filters[group.id]} onChange={(e) => setFilters((prev) => ({ ...prev, [group.id]: e.target.value }))}>
                    {group.options.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </label>
              )}
            </fieldset>
          ))}
          <Link href={infContactHref} className="inf-advice">
            <VhpIcon name="headset" strokeWidth={1.5} />
            <span>
              <strong>{infAisleCopy.adviceTitle}</strong>
              {aisle.id === "ordinateurs" ? "Nos équipes vous aident à choisir le bon ordinateur selon vos usages." : aisle.id === "smartphones-telephones" ? "Nos équipes vous aident à choisir le bon smartphone selon vos usages." : infAisleCopy.adviceText}
            </span>
          </Link>
        </aside>

        <div className="inf-results">
          <div className="inf-results__count">
            <strong>{infAisleCopy.resultsTitle}</strong>
            <span>{aisle.id === "ordinateurs" ? "Une sélection d’ordinateurs adaptés à vos besoins professionnels." : aisle.id === "smartphones-telephones" ? "Une sélection de smartphones et téléphones adaptés à vos besoins." : infAisleCopy.resultsLead}</span>
          </div>
          {products.length === 0 ? (
            <div className="inf-empty">
              <strong>{infAisleCopy.emptyTitle}</strong>
              <p>{infAisleCopy.emptyLead}</p>
              <Link href={infOtherHref} className="inf-btn inf-btn--yellow">Décrire mon besoin</Link>
            </div>
          ) : (
            <ul className="inf-product-grid">
              {products.map((product) => {
                const added = request.has(product.id);
                return (
                  <li key={product.id} className="inf-product-card">
                    <Image src={product.image.src} alt="" width={product.image.width} height={product.image.height} className="inf-product-card__img" sizes="(max-width : 900px) 100vw, 28vw" />
                    <p className="inf-product-card__kicker">{product.kicker}</p>
                    <h3 className="inf-product-card__title">{product.title}</h3>
                    <p className="inf-product-card__excerpt">{product.highlight || product.excerpt}</p>
                    {product.illustrative ? <p className="inf-product-card__excerpt">{infAisleCopy.emptyIllustrative}</p> : null}
                    <div className="inf-product-card__actions">
                  <Link href={infProductPath(product.aisleId, product.slug)} className="inf-product-card__sheet">{infAisleCopy.seeSheet} →</Link>
                    <button type="button" className={`inf-btn inf-btn--yellow`} aria-pressed={added} onClick={() => (added ? request.remove(product.id) : request.add(product.id, Math.max(1, request.quantity(product.id) || 1)))}>
                      {added ? infAisleCopy.added : "+ " + infAisleCopy.add}
                    </button>
                  </div>
                  </li>
                );
              })}
            </ul>
          )}

          {aisle.id === "ordinateurs" && network ? (
            <div className="inf-explore-other">
              <Image src={network.image.src} alt="" width={network.image.width} height={network.image.height} />
              <div>
                <strong>{infAisleCopy.exploreOtherTitle}</strong>
                <p>{infAisleCopy.exploreOtherLead}</p>
              </div>
              <Link href={infAislePath(network.id)}>{infAisleCopy.exploreOtherCta} →</Link>
            </div>
          ) : null}
          <p className="inf-availability">
            <VhpIcon name="info" strokeWidth={1.5} />
            {infAisleCopy.availabilityNote}
          </p>
        </div>
      </div>

      {request.count > 0 ? (
        <div className="inf-bar">
          <div className="inf-bar__thumbs">
            {request.itemsWithProduct.slice(0, 3).map((item) => (
              <Image key={item.id} src={item.image.src} alt="" width={52} height={52} className="inf-bar__thumb" />
            ))}
          </div>
          <div className="inf-bar__copy">
            <p>
              <strong>{infAisleCopy.barTitle}</strong> · {request.count} {infAisleCopy.barDevices}
            </p>
          </div>
          <Link href={infOtherHref} className="inf-bar__link">{infAisleCopy.barOther}</Link>
          <Link href={INF_DEMANDE_PATH} className="inf-btn inf-btn--yellow">
            {infAisleCopy.barContinue}
            <VhpIcon name="arrowRight" strokeWidth={1.8} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}