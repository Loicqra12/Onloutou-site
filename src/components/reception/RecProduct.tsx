"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  REC_DEMANDE_PATH,
  REC_FAMILY_LABEL,
  REC_ROOT,
  getRecProduct,
  recAislePath,
  recContactHref,
  recPlaces,
  recProductCopy,
  recProductPath,
  recSceneShowroom,
  recUnitsFor,
  type RecAisle,
  type RecProduct,
} from "@/content/reception";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useRecRequest } from "./RecRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function RecProductView({ aisle, product }: { aisle: RecAisle; product: RecProduct }) {
  const request = useRecRequest();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(Math.max(1, request.quantity(product.id) || 1));
  const added = request.has(product.id);
  const photo = product.gallery[active] ?? product.image;
  const units = recUnitsFor(product, qty);
  const liveLabel =
    product.unitKind === "lot"
      ? `${qty} lot${qty > 1 ? "s" : ""} = ${units} ${product.unitLabel}`
      : `${qty} ${product.unitLabel}`;

  const complements =
    product.id === "assiettes-plates-blanches"
      ? ([getRecProduct("verrerie-bar", "verres-a-eau"), getRecProduct("nappes-housses", "nappe-blanche")].filter(
          Boolean,
        ) as RecProduct[])
      : [];

  // Shared chair: redirect to mobilier fiche
  if (product.sharedHref) {
    if (typeof window !== "undefined") {
      // client navigation handled below via effect-less link banner
    }
  }

  const title = product.title;
  const accent = title.split(" ").slice(0, 2).join(" ");
  const accentAt = title.indexOf(accent);

  return (
    <div className="rec-page rec-page--product">
      <header className="rec-product-intro">
        <p className="rec-eyebrow rec-eyebrow--gold">{recProductCopy.eyebrow}</p>
        <h1 className="rec-h1">
          {accentAt >= 0 ? (
            <>
              <span className="rec-underline">{accent}</span>
              {title.slice(accent.length)}
            </>
          ) : (
            title
          )}
        </h1>
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
              <Link href={recAislePath(aisle.id)}>{aisle.title}</Link>
            </li>
            <li>
              <span aria-current="page">{product.title}</span>
            </li>
          </ol>
        </nav>
      </header>

      {product.sharedHref ? (
        <p className="rec-tariff-banner" style={{ marginTop: 12 }}>
          <VhpIcon name="info" strokeWidth={1.5} />
          <span>
            Cette chaise est aussi proposée dans Mobilier & décoration.{" "}
            <Link href={product.sharedHref}>Ouvrir la fiche partagée →</Link>
          </span>
        </p>
      ) : null}

      <div className="rec-product-layout">
        <div className="rec-gallery">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width : 900px) 100vw, 48vw"
            className="rec-gallery__main"
            style={{ objectPosition: photo.objectPosition }}
            quality={86}
            priority
          />
          {product.gallery.length > 1 ? (
            <ul className="rec-gallery__thumbs">
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

        <div className="rec-buy">
          <ul className="rec-buy__facts">
            {product.specs.map((s) => (
              <li key={s.label}>{s.value}</li>
            ))}
          </ul>
          <label className="rec-buy__field">
            <span>{recProductCopy.placeLabel}</span>
            <span className="rec-field--icon rec-field--select">
              <VhpIcon name="pin" strokeWidth={1.5} />
              <select value={request.state.zone} onChange={(e) => request.setMeta({ zone: e.target.value })}>
              <option value="">Choisir</option>
              {recPlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
              <VhpIcon name="chevronDown" className="rec-field__caret" strokeWidth={1.8} />
            </span>
          </label>
          <FamilyDateRange
            prefix="rec"
            startId="rec-buy-start"
            endId="rec-buy-end"
            startDate={request.state.startDate}
            endDate={request.state.endDate}
            onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
            startPlaceholder="À préciser"
            endPlaceholder="À préciser"
          />
          <div className="rec-qty">
            <span>{product.unitQtyLabel}</span>
            <div className="rec-qty__ctrl">
              <button type="button" aria-label="Diminuer" onClick={() => setQty((v) => Math.max(1, v - 1))}>
                <VhpIcon name="minus" strokeWidth={1.5} />
              </button>
              <strong aria-live="polite">{qty}</strong>
              <button type="button" aria-label="Augmenter" onClick={() => setQty((v) => v + 1)}>
                <VhpIcon name="plus" strokeWidth={1.5} />
              </button>
            </div>
            <span className="rec-qty-unit">
              {product.unitKind === "lot" ? "LOTS" : product.unitKind === "set" ? "SETS" : "PIÈCES"}
            </span>
          </div>
          <p className="rec-lot-live" aria-live="polite">
            {liveLabel}
          </p>
          <button
            type="button"
            className="rec-btn rec-btn--yellow rec-btn--block"
            aria-pressed={added}
            onClick={() => (added ? request.remove(product.id) : request.add(product.id, qty))}
          >
            {added ? recProductCopy.added : recProductCopy.add}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </button>
          <Link href={REC_DEMANDE_PATH} className="rec-back">
            ← {recProductCopy.back}
          </Link>
        </div>
      </div>


      <div className="rec-details">
        <section>
          <h2>{recProductCopy.specsTitle}</h2>
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
          <h2>{recProductCopy.deliveryTitle}</h2>
          <p className="rec-note">
            <VhpIcon name="truck" strokeWidth={1.5} />
            <span>
              <strong>{recProductCopy.deliveryLead}</strong>
              {recProductCopy.deliveryText}
            </span>
          </p>
          <p className="rec-note">
            <VhpIcon name="info" strokeWidth={1.5} />
            <span>
              <strong>{recProductCopy.tariffTitle}</strong>
              {recProductCopy.tariffText}
            </span>
          </p>
        </section>
      </div>

      {complements.length ? (
        <section className="rec-complements" aria-labelledby="rec-complements-title">
          <h2 id="rec-complements-title">
            <span className="rec-underline">Pour</span> compléter votre réception
          </h2>
          <ul className="rec-complements__grid">
            {complements.map((item) => {
              const isAdded = request.has(item.id);
              return (
                <li key={item.id} className="rec-complement-card">
                  <Link href={recProductPath(item.aisleId, item.slug)} className="rec-complement-card__media">
                    <Image
                      src={item.image.src}
                      alt=""
                      width={item.image.width}
                      height={item.image.height}
                      sizes="280px"
                      style={{ objectFit: "cover", objectPosition: item.image.objectPosition }}
                    />
                  </Link>
                  <div className="rec-complement-card__body">
                    <strong>{item.title}</strong>
                    <span className="rec-unit-badge">{item.unitBadge}</span>
                    <button
                      type="button"
                      className="rec-btn rec-btn--yellow rec-btn--small"
                      aria-pressed={isAdded}
                      onClick={() =>
                        isAdded
                          ? request.remove(item.id)
                          : request.add(item.id, item.id === "nappe-blanche" ? 10 : 9)
                      }
                    >
                      {isAdded ? recProductCopy.added : recProductCopy.add}
                      <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="rec-tariff-banner">
        <VhpIcon name="info" strokeWidth={1.5} />
        <span>
          <strong>{recProductCopy.tariffTitle}</strong>
        </span>
      </p>

      <section className="rec-counsel">
        <div className="rec-counsel__copy">
          <h2>{recProductCopy.adviceTitle}</h2>
          <p>{recProductCopy.adviceLead}</p>
          <Link href={recContactHref} className="rec-btn rec-btn--yellow">
            {recProductCopy.adviceCta}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </Link>
        </div>
        <figure className="rec-counsel__visual">
          <Image
            src={recSceneShowroom.src}
            alt={recSceneShowroom.alt}
            width={recSceneShowroom.width}
            height={recSceneShowroom.height}
            sizes="40vw"
            className="rec-counsel__img"
            style={{ objectPosition: recSceneShowroom.objectPosition }}
          />
        </figure>
      </section>
      <ol className="rec-steps">
        {recProductCopy.steps.map((step) => (
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
