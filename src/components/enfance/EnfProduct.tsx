"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ENF_DEMANDE_PATH,
  ENF_FAMILY_LABEL,
  ENF_ROOT,
  enfConfirmPhoto,
  enfContactHref,
  enfPlaces,
  enfProductCopy,
  enfProductPath,
  enfProducts,
  type EnfAisle,
  type EnfProduct,
} from "@/content/enfance";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useEnfRequest } from "./EnfRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function EnfProductView({ aisle, product }: { aisle: EnfAisle; product: EnfProduct }) {
  const request = useEnfRequest();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(Math.max(1, request.quantity(product.id) || 1));
  const added = request.has(product.id);
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const photo = gallery[active] ?? product.image;
  const complements = (product.complementaryIds ?? [])
    .map((id) => enfProducts.find((entry) => entry.id === id))
    .filter(Boolean) as EnfProduct[];

  const articleLabel = request.count <= 1 ? `${request.count} article` : `${request.count} articles`;
  const words = product.title.split(" ");
  const accent = words.slice(0, Math.min(2, words.length)).join(" ");
  const accentAt = product.title.indexOf(accent);

  return (
    <div className="enf-page enf-page--product">
      <header className="enf-product-intro">
        <p className="enf-eyebrow enf-eyebrow--gold">{enfProductCopy.eyebrow}</p>
        <h1 className="enf-h1">
          {accentAt >= 0 ? (
            <>
              <span className="enf-underline">{accent}</span>
              {product.title.slice(accent.length)}
            </>
          ) : (
            product.title
          )}
        </h1>
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
              <Link href={`${ENF_ROOT}/${aisle.id}`}>{aisle.title}</Link>
            </li>
            <li>
              <span aria-current="page">{product.title}</span>
            </li>
          </ol>
        </nav>
      </header>

      <div className="enf-product-layout">
        <div className="enf-gallery">
          <Image
            src={photo.src}
            alt={photo.alt || product.title}
            width={photo.width}
            height={photo.height}
            className="enf-gallery__main"
            sizes="(max-width: 900px) 100vw, 52vw"
            style={{ objectPosition: photo.objectPosition }}
            priority
          />
          {gallery.length > 1 ? (
            <ul className="enf-gallery__thumbs">
              {gallery.map((shot, index) => (
                <li key={`${shot.src}-${index}`}>
                  <button
                    type="button"
                    className={index === active ? "is-on" : undefined}
                    onClick={() => setActive(index)}
                    aria-label={`Vue ${index + 1}`}
                    aria-pressed={index === active}
                  >
                    <Image
                      src={shot.src}
                      alt=""
                      width={shot.width}
                      height={shot.height}
                      style={{ objectPosition: shot.objectPosition }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="enf-buy">
          <ul className="enf-buy__facts">
            {product.specs.map((spec) => (
              <li key={spec.label}>
                {spec.label}&nbsp;: {spec.value}
              </li>
            ))}
          </ul>

          <label className="enf-buy__field" htmlFor="enf-buy-place">
            <span>{enfProductCopy.placeLabel}</span>
            <span className="enf-field--icon enf-field--select">
              <VhpIcon name="pin" strokeWidth={1.5} />
              <select
                id="enf-buy-place"
                value={request.state.zone || ""}
                onChange={(e) => request.setMeta({ zone: e.target.value })}
              >
                <option value="">{enfProductCopy.placePlaceholder}</option>
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
            startId="enf-buy-start"
            endId="enf-buy-end"
            startDate={request.state.startDate}
            endDate={request.state.endDate}
            onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
            startPlaceholder="À préciser"
            endPlaceholder="À préciser"
          />

          <div className="enf-qty">
            <span>{enfProductCopy.qtyLabel}</span>
            <div className="enf-qty__ctrl">
              <button type="button" aria-label="Diminuer" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                <VhpIcon name="minus" strokeWidth={1.5} />
              </button>
              <strong aria-live="polite">{qty}</strong>
              <button type="button" aria-label="Augmenter" onClick={() => setQty((n) => n + 1)}>
                <VhpIcon name="plus" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="enf-btn enf-btn--yellow enf-btn--block"
            onClick={() => (added ? request.remove(product.id) : request.add(product.id, qty))}
          >
            {added ? enfProductCopy.added : enfProductCopy.add}
            <VhpIcon name="arrowUpRight" />
          </button>

          {request.count > 0 ? (
            <Link href={ENF_DEMANDE_PATH} className="enf-btn enf-btn--ghost enf-view-request">
              {enfProductCopy.viewRequest}&nbsp;· {articleLabel}
            </Link>
          ) : null}

          <p className="enf-note">
            <VhpIcon name="info" strokeWidth={1.5} />
            <span>{enfProductCopy.tariffNote}</span>
          </p>
        </div>
      </div>

      <div className="enf-details" aria-labelledby="enf-confirm-title">
        <section>
          <h2 id="enf-confirm-title">{enfProductCopy.confirmTitle}</h2>
          <p className="enf-confirm-flag">{enfProductCopy.confirmReviewFlag}</p>
          <ul className="enf-confirm-points">
            {product.confirmPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{enfProductCopy.deliveryTitle}</h2>
          <p className="enf-note">
            <VhpIcon name="truck" strokeWidth={1.5} />
            <span>
              <strong>{enfProductCopy.deliveryLead}</strong>
              {enfProductCopy.deliveryText}
            </span>
          </p>
          <p className="enf-note">
            <VhpIcon name="info" strokeWidth={1.5} />
            <span>{enfProductCopy.tariffNote}</span>
          </p>
        </section>
      </div>

      {complements.length ? (
        <section className="enf-complements" aria-labelledby="enf-complements-title">
          <h2 id="enf-complements-title">
            <span className="enf-underline">{enfProductCopy.complementAccent}</span>
            {enfProductCopy.complementTitle.slice(enfProductCopy.complementAccent.length)}
          </h2>
          <ul className="enf-complements__grid">
            {complements.map((item) => {
              const itemAdded = request.has(item.id);
              return (
                <li key={item.id} className="enf-complement-card">
                  <Link href={enfProductPath(item.aisleId, item.slug)}>
                    <Image
                      src={item.image.src}
                      alt=""
                      width={item.image.width}
                      height={item.image.height}
                      className="enf-complement-card__img"
                      sizes="(max-width: 700px) 100vw, 28vw"
                      style={{ objectPosition: item.image.objectPosition }}
                    />
                  </Link>
                  <div className="enf-complement-card__body">
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <button
                      type="button"
                      className="enf-btn enf-btn--yellow enf-btn--small"
                      onClick={() => (itemAdded ? request.remove(item.id) : request.add(item.id, 1))}
                    >
                      {itemAdded ? enfProductCopy.added : enfProductCopy.add}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="enf-counsel">
        <div className="enf-counsel__copy">
          <h2>{enfProductCopy.adviceTitle}</h2>
          <p>{enfProductCopy.adviceLead}</p>
          <Link href={enfContactHref} className="enf-btn enf-btn--yellow">
            {enfProductCopy.adviceCta}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </Link>
        </div>
        <figure className="enf-counsel__visual">
          <Image
            src={enfConfirmPhoto.src}
            alt={enfConfirmPhoto.alt}
            width={enfConfirmPhoto.width}
            height={enfConfirmPhoto.height}
            sizes="40vw"
            className="enf-counsel__img"
            style={{ objectPosition: enfConfirmPhoto.objectPosition }}
          />
        </figure>
      </section>

      <ol className="enf-steps">
        {enfProductCopy.steps.map((step) => (
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
