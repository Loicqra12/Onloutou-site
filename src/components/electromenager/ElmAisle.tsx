"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ELM_DEMANDE_PATH,
  ELM_FAMILY_LABEL,
  ELM_ROOT,
  elmAisleCopy,
  elmCapacityFilters,
  elmContactHref,
  elmOtherHref,
  elmPlaces,
  elmProductPath,
  matchesCapacity,
  productsForAisle,
  type ElmAisle,
  type ElmProductType,
} from "@/content/electromenager";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useElmRequest } from "./ElmRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function ElmAisleView({ aisle }: { aisle: ElmAisle }) {
  const request = useElmRequest();
  const catalogCount = productsForAisle(aisle.id).length;
  const compact = catalogCount <= 1 && aisle.typeFilters.length <= 1;
  const [type, setType] = useState<"tous" | ElmProductType>("tous");
  const [capacity, setCapacity] = useState<(typeof elmCapacityFilters)[number]["id"]>("toutes");
  const [query, setQuery] = useState("");
  const showCapacity = aisle.id === "froid-conservation";

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productsForAisle(aisle.id).filter((product) => {
      if (type !== "tous" && product.type !== type) return false;
      if (showCapacity && !matchesCapacity(product, capacity)) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.excerpt.toLowerCase().includes(q) ||
        product.keywords.some((word) => word.includes(q) || q.includes(word))
      );
    });
  }, [aisle.id, type, capacity, query, showCapacity]);

  return (
    <div className="elm-page elm-page--aisle">
      <header className="elm-aisle-hero">
        <p className="elm-eyebrow elm-eyebrow--gold">{elmAisleCopy.eyebrow}</p>
        <h1 className="elm-h1">
          {aisle.title.includes("&") ? (
            <>
              {aisle.title.split("&")[0].trim()} &{" "}
              <span className="elm-underline">{aisle.title.split("&")[1].trim()}</span>
            </>
          ) : (
            <span className="elm-underline">{aisle.title}</span>
          )}
        </h1>
        <p className="elm-lead">{aisle.lead}</p>
        <nav className="elm-crumb" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">
                <VhpIcon name="home" strokeWidth={1.5} />
                <span className="visually-hidden">Accueil</span>
              </Link>
            </li>
            <li>
              <Link href={ELM_ROOT}>{ELM_FAMILY_LABEL}</Link>
            </li>
            <li>
              <span aria-current="page">{aisle.title}</span>
            </li>
          </ol>
        </nav>
        <div className="elm-aisle-tools">
          <label className="elm-field--icon elm-aisle-tools__search">
            <VhpIcon name="search" strokeWidth={1.5} className="elm-search__icon" />
            <span className="visually-hidden">{elmAisleCopy.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={elmAisleCopy.searchPlaceholder}
            />
          </label>
          <label className="elm-field--icon">
            <VhpIcon name="pin" strokeWidth={1.5} className="elm-search__icon" />
            <span className="visually-hidden">Ville ou commune</span>
            <select
              value={request.state.zone}
              onChange={(event) => request.setMeta({ zone: event.target.value })}
            >
              <option value="">Ville ou commune</option>
              {elmPlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>
          <FamilyDateRange
              prefix="elm"
              startId="elm-aisle-start"
              endId="elm-aisle-end"
              startDate={request.state.startDate}
              endDate={request.state.endDate}
              onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
              startPlaceholder="Début"
              endPlaceholder="Fin"
            />
        </div>
      </header>

      <div className={"elm-aisle-layout" + (compact ? " is-compact" : "")}>
        <aside className="elm-filters">
          <h2 className="elm-filters__title">{elmAisleCopy.filterTitle}</h2>
          <fieldset className="elm-filters__group">
            <legend>{elmAisleCopy.typeLegend}</legend>
            {aisle.typeFilters.map((option) => (
              <label key={option.id} className={`elm-radio${type === option.id ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="elm-type"
                  value={option.id}
                  checked={type === option.id}
                  onChange={() => setType(option.id)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          {showCapacity ? (
            <div className="elm-filters__group">
              <p className="elm-filters__legend">{elmAisleCopy.capacityLegend}</p>
              <label className="elm-field--icon elm-filters__select">
                <VhpIcon name="chevronDown" strokeWidth={1.5} className="elm-search__icon" />
                <select
                  value={capacity}
                  onChange={(event) =>
                    setCapacity(event.target.value as (typeof elmCapacityFilters)[number]["id"])
                  }
                >
                  {elmCapacityFilters.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
          <Link href={elmContactHref} className="elm-advice">
            <VhpIcon name="headset" strokeWidth={1.5} />
            <span>
              <strong>{elmAisleCopy.adviceTitle}</strong>
              {elmAisleCopy.adviceText}
            </span>
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </Link>
        </aside>

        <div className="elm-results">
          <p className="elm-results__count">
            <strong>{elmAisleCopy.count(products.length)}</strong>
            <span>{elmAisleCopy.countLead}</span>
          </p>
          <ul className="elm-product-grid">
            {products.length === 0 ? (
              <li className="elm-empty">
                <h2>Aucun appareil proposé dans ce filtre</h2>
                <p>La disponibilité dépend des dates et de la réponse du partenaire. Décrivez votre besoin pour une recherche personnalisée.</p>
                <Link href={elmOtherHref} className="elm-btn elm-btn--yellow">
                  Décrire mon besoin
                  <VhpIcon name="arrowRight" strokeWidth={1.8} />
                </Link>
              </li>
            ) : null}
            {products.map((product) => {
              const added = request.has(product.id);
              return (
                <li key={product.id} className="elm-product-card">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    width={product.image.width}
                    height={product.image.height}
                    sizes="(max-width : 900px) 100vw, 32vw"
                    className="elm-product-card__img"
                    style={{ objectPosition: product.image.objectPosition }}
                  />
                  <p className="elm-product-card__kicker">{product.kicker}</p>
                  <h3 className="elm-product-card__title">{product.title}</h3>
                  <p className="elm-product-card__excerpt">{product.excerpt}</p>
                  <div className="elm-product-card__actions">
                  <Link href={elmProductPath(aisle.id, product.slug)} className="elm-product-card__sheet">
                    {elmAisleCopy.seeSheet} →
                  </Link>
                  <button
                    type="button"
                    className={`elm-btn elm-btn--yellow`}
                    aria-pressed={added}
                    onClick={() => (added ? request.remove(product.id) : request.add(product.id, 1))}
                  >
                    {added ? <VhpIcon name="check" strokeWidth={1.5} /> : <VhpIcon name="plus" strokeWidth={1.5} />}
                    {added ? elmAisleCopy.added : elmAisleCopy.add}
                  </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {request.itemsWithProduct.length > 0 ? (
        <div className="elm-bar" role="region" aria-label="Ma demande">
          <div className="elm-bar__thumbs">
            {request.itemsWithProduct.map((item) => (
              <Image
                key={item.id}
                src={item.image.src}
                alt={item.title}
                width={72}
                height={72}
                className="elm-bar__thumb"
              />
            ))}
          </div>
          <div className="elm-bar__copy">
            <p>
              <strong>{elmAisleCopy.barTitle(request.itemsWithProduct.length)}</strong>
            </p>
            <p>{elmAisleCopy.barNote}</p>
          </div>
          <Link href={elmOtherHref} className="elm-bar__link">
            {elmAisleCopy.other}
          </Link>
          <Link href={ELM_DEMANDE_PATH} className="elm-btn elm-btn--yellow">
            {elmAisleCopy.continue}
            <VhpIcon name="arrowRight" strokeWidth={1.8} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
