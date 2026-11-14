"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MOB_DEMANDE_PATH,
  MOB_FAMILY_LABEL,
  MOB_ROOT,
  getMobProduct,
  mobAislePath,
  mobContactHref,
  mobPlaces,
  mobProductCopy,
  mobProductPath,
  mobSceneShowroom,
  type MobAisle,
  type MobProduct,
} from "@/content/mobilier";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useMobRequest } from "./MobRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function MobProductView({ aisle, product }: { aisle: MobAisle; product: MobProduct }) {
  const request = useMobRequest();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(Math.max(1, request.quantity(product.id) || 1));
  const added = request.has(product.id);
  const complements =
    product.id === "fauteuil-en-rotin"
      ? [
          getMobProduct("tables-consoles", "table-basse-ronde"),
          getMobProduct("luminaires", "lampadaire-en-laiton"),
        ].filter(Boolean) as MobProduct[]
      : [];
  const photo = product.gallery[active] ?? product.image;
  const title = product.title;
  const accent = title.split(" ")[0] || title;
  const accentAt = title.indexOf(accent);

  return (
    <div className="mob-page mob-page--product">
      <header className="mob-product-intro">
        <p className="mob-eyebrow mob-eyebrow--gold">{mobProductCopy.eyebrow}</p>
        <h1 className="mob-h1">
          {accentAt >= 0 ? (
            <>
              <span className="mob-underline">{accent}</span>
              {title.slice(accent.length)}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="mob-lead">{product.excerpt}</p>
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
              <Link href={mobAislePath(aisle.id)}>{aisle.title}</Link>
            </li>
            <li>
              <span aria-current="page">{product.title}</span>
            </li>
          </ol>
        </nav>
      </header>

      <div className="mob-product-layout">
        <div className="mob-gallery">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width : 900px) 100vw, 48vw"
            className="mob-gallery__main"
            style={{ objectPosition: photo.objectPosition }}
            quality={86}
            priority
          />
          {product.gallery.length > 1 ? (
            <ul className="mob-gallery__thumbs">
              {product.gallery.map((item, index) => (
                <li key={item.src + index}>
                  <button
                    type="button"
                    className={index === active ? "is-on" : undefined}
                    onClick={() => setActive(index)}
                    aria-label={`Photo ${index + 1}`}
                    aria-current={index === active ? true : undefined}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      width={item.width}
                      height={item.height}
                      sizes="120px"
                      style={{ objectFit: "cover", objectPosition: item.objectPosition }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mob-buy">
          <ul className="mob-buy__facts">
            {product.dimensions ? <li>{product.dimensions}</li> : product.highlight ? <li>{product.highlight}</li> : null}
            {product.specs
              .filter((s) => s.label !== "Dimensions")
              .map((s) => (
                <li key={s.label}>
                  {s.label} : {s.value}
                </li>
              ))}
          </ul>
          <label className="mob-buy__field">
            <span>{mobProductCopy.placeLabel}</span>
            <span className="mob-field--icon mob-field--select">
              <VhpIcon name="pin" strokeWidth={1.5} />
              <select
              value={request.state.zone}
              onChange={(event) => request.setMeta({ zone: event.target.value })}
            >
              <option value="">Choisir</option>
              {mobPlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
              <VhpIcon name="chevronDown" className="mob-field__caret" strokeWidth={1.8} />
            </span>
          </label>
          <FamilyDateRange
            prefix="mob"
            startId="mob-buy-start"
            endId="mob-buy-end"
            startDate={request.state.startDate}
            endDate={request.state.endDate}
            onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
            startPlaceholder="À préciser"
            endPlaceholder="À préciser"
          />
          <div className="mob-qty">
            <span>{mobProductCopy.qtyLabel}</span>
            <div className="mob-qty__ctrl">
              <button
                type="button"
                aria-label="Diminuer"
                onClick={() => setQty((value: number) => Math.max(1, value - 1))}
              >
                <VhpIcon name="minus" strokeWidth={1.5} />
              </button>
              <strong aria-live="polite">{qty}</strong>
              <button type="button" aria-label="Augmenter" onClick={() => setQty((value: number) => value + 1)}>
                <VhpIcon name="plus" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="mob-btn mob-btn--yellow mob-btn--block"
            aria-pressed={added}
            onClick={() => (added ? request.remove(product.id) : request.add(product.id, qty))}
          >
            {added ? mobProductCopy.added : mobProductCopy.add}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </button>
          <Link href={MOB_DEMANDE_PATH} className="mob-back">
            ← {mobProductCopy.back}
          </Link>
        </div>
      </div>

      <div className="mob-details">
        <section>
          <h2>{mobProductCopy.specsTitle}</h2>
          <dl>
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h2>{mobProductCopy.deliveryTitle}</h2>
          <p className="mob-note">
            <VhpIcon name="truck" strokeWidth={1.5} />
            <span>
              <strong>{mobProductCopy.deliveryLead}</strong>
              {mobProductCopy.deliveryText}
            </span>
          </p>
          <p className="mob-note">
            <VhpIcon name="info" strokeWidth={1.5} />
            <span>
              <strong>{mobProductCopy.tariffTitle}</strong>
              {mobProductCopy.tariffText}
            </span>
          </p>
        </section>
      </div>

      {complements.length ? (
        <section className="mob-complements" aria-labelledby="mob-complements-title">
          <h2 id="mob-complements-title">
            <span className="mob-underline">Pour</span> compléter votre salon
          </h2>
          <ul className="mob-complements__grid">
            {complements.map((item) => {
              const isAdded = request.has(item.id);
              return (
                <li key={item.id} className="mob-complement-card">
                  <Link href={mobProductPath(item.aisleId, item.slug)} className="mob-complement-card__media">
                    <Image
                      src={item.image.src}
                      alt=""
                      width={item.image.width}
                      height={item.image.height}
                      sizes="280px"
                      style={{ objectFit: "cover", objectPosition: item.image.objectPosition }}
                    />
                  </Link>
                  <div className="mob-complement-card__body">
                    <strong>{item.title}</strong>
                    <p>{item.excerpt}</p>
                    <button
                      type="button"
                      className="mob-btn mob-btn--yellow mob-btn--small"
                      aria-pressed={isAdded}
                      onClick={() => (isAdded ? request.remove(item.id) : request.add(item.id, 1))}
                    >
                      {isAdded ? mobProductCopy.added : mobProductCopy.add}
                      <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="mob-tariff-banner">
        <VhpIcon name="info" strokeWidth={1.5} />
        <span>
          <strong>{mobProductCopy.tariffTitle}</strong> {mobProductCopy.tariffText}
        </span>
      </p>

      <section className="mob-counsel">
        <div className="mob-counsel__copy">
          <h2>{mobProductCopy.adviceTitle}</h2>
          <p>{mobProductCopy.adviceLead}</p>
          <Link href={mobContactHref} className="mob-btn mob-btn--yellow">
            {mobProductCopy.adviceCta}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </Link>
        </div>
        <figure className="mob-counsel__visual">
          <Image
            src={mobSceneShowroom.src}
            alt={mobSceneShowroom.alt}
            width={mobSceneShowroom.width}
            height={mobSceneShowroom.height}
            sizes="40vw"
            className="mob-counsel__img"
            style={{ objectPosition: mobSceneShowroom.objectPosition }}
          />
        </figure>
      </section>

      <ol className="mob-steps">
        {mobProductCopy.steps.map((step) => (
          <li key={step.n}>
            <span>{step.n}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
