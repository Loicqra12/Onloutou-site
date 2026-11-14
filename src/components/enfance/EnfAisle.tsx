"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ENF_FAMILY_LABEL,
  ENF_ROOT,
  enfAisleCopy,
  enfProductCopy,
  enfOtherHref,
  enfPlaces,
  enfProductPath,
  matchEnfFilters,
  productsForEnfAisle,
  type EnfAisle,
} from "@/content/enfance";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useEnfRequest } from "./EnfRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function EnfAisleView({ aisle }: { aisle: EnfAisle }) {
  const request = useEnfRequest();
  const catalogCount = productsForEnfAisle(aisle.id).length;
  const compact = catalogCount <= 1 && aisle.filters.length === 0;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of aisle.filters) initial[group.id] = group.options[0]?.id ?? "tous";
    return initial;
  });

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productsForEnfAisle(aisle.id).filter((product) => {
      if (!matchEnfFilters(product, filters)) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.excerpt.toLowerCase().includes(q) ||
        product.keywords.some((word) => word.includes(q) || q.includes(word))
      );
    });
  }, [aisle.id, filters, query]);

  return (
    <div className="enf-page enf-page--aisle">
      <div className="enf-aisle-hero-band">
        <div className="enf-aisle-hero-band__media" aria-hidden>
          <Image
            src={aisle.image.src}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: aisle.image.objectPosition ?? "50% 45%" }}
            priority
          />
        </div>
        <div className="enf-aisle-hero-band__shade" aria-hidden />
        <div className="enf-aisle-hero-band__inner">
          <header className="enf-aisle-hero">
            <p className="enf-eyebrow enf-eyebrow--gold">{enfAisleCopy.eyebrow}</p>
            <h1 className="enf-h1">
              <span className="enf-underline">{aisle.title}</span>
            </h1>
            <p className="enf-lead">{aisle.lead}</p>
            <nav className="enf-crumb" aria-label="Fil d’Ariane">
              <ol>
                <li>
                  <Link href="/">
                    <VhpIcon name="home" strokeWidth={1.5} />
                    <span className="visually-hidden">Accueil</span>
                  </Link>
                </li>
                <li>
                  <Link href={ENF_ROOT}>{ENF_FAMILY_LABEL}</Link>
                </li>
                <li>
                  <span aria-current="page">{aisle.title}</span>
                </li>
              </ol>
            </nav>
            <div className="enf-aisle-tools">
              <label className="enf-aisle-tools__search" htmlFor="enf-aisle-search">
                <span className="visually-hidden">{enfAisleCopy.searchPlaceholder}</span>
                <span className="enf-field--icon">
                  <VhpIcon name="search" strokeWidth={1.5} />
                  <input
                    id="enf-aisle-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={enfAisleCopy.searchPlaceholder}
                  />
                </span>
              </label>
              <label htmlFor="enf-aisle-place">
                <span className="visually-hidden">{enfAisleCopy.placeLabel}</span>
                <span className="enf-field--icon enf-field--select">
                  <VhpIcon name="pin" strokeWidth={1.5} />
                  <select
                    id="enf-aisle-place"
                    value={request.state.zone || "Cocody"}
                    onChange={(e) => request.setMeta({ zone: e.target.value })}
                    aria-label={enfAisleCopy.placeLabel}
                  >
                    {enfPlaces.map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>
                  <VhpIcon name="chevronDown" className="enf-field__caret" strokeWidth={1.8} />
                </span>
              </label>
              <FamilyDateRange
                prefix="enf"
                startId="enf-aisle-start"
                endId="enf-aisle-end"
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

      <div className={"enf-aisle-layout" + (compact ? " is-compact" : "")}>
        <aside className="enf-filters">
          {aisle.filters.map((group) => (
            <details key={group.id} className="enf-filter-group" open>
              <summary>{group.label}</summary>
              <ul>
                {group.options.map((option) => (
                  <li key={option.id}>
                    <label className="enf-radio">
                      <input
                        type="radio"
                        name={`enf-filter-${group.id}`}
                        checked={(filters[group.id] ?? "tous") === option.id}
                        onChange={() => setFilters((prev) => ({ ...prev, [group.id]: option.id }))}
                      />
                      <span>{option.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </aside>

        <div className="enf-aisle-main">
          <p className="enf-aisle-note">{enfAisleCopy.availabilityNote}</p>
          {products.length === 0 ? (
            <div className="enf-empty">
              <p className="enf-aisle-note">{enfAisleCopy.emptyLead}</p>
              <Link href={enfOtherHref} className="enf-btn enf-btn--yellow">Décrire mon besoin</Link>
            </div>
          ) : (
            <ul className="enf-product-grid">
              {products.map((product) => {
                const added = request.has(product.id);
                return (
                <li key={product.id} className="enf-product-card">
                  <Image
                    src={product.image.src}
                    alt=""
                    width={product.image.width}
                    height={product.image.height}
                    className="enf-product-card__img"
                    sizes="(max-width: 900px) 100vw, 28vw"
                    style={{ objectPosition: product.image.objectPosition }}
                  />
                  <h2 className="enf-product-card__title">{product.title}</h2>
                  <div className="enf-product-card__actions">
                  <Link
                    href={enfProductPath(product.aisleId, product.slug)}
                    className="enf-product-card__sheet"
                  >
                    {enfAisleCopy.seeArticle} →
                  </Link>
                  <button
                    type="button"
                    className="enf-btn enf-btn--yellow"
                    aria-pressed={added}
                    onClick={() => (added ? request.remove(product.id) : request.add(product.id, 1))}
                  >
                    {added ? enfProductCopy.added : enfProductCopy.add}
                  </button>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
          <p className="enf-aisle-other">
            <Link href={enfOtherHref}>{enfAisleCopy.otherLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
