"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  INF_FAMILY_LABEL,
  INF_ROOT,
  getInfProduct,
  infAislePath,
  infContactHref,
  infPlaces,
  infProductCopy,
  infProductPath,
  infSceneShowroom,
  type InfAisle,
  type InfProduct,
} from "@/content/informatique";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useInfRequest } from "./InfRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function InfProductView({ aisle, product }: { aisle: InfAisle; product: InfProduct }) {
  const request = useInfRequest();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(Math.max(1, request.quantity(product.id) || 1));
  const added = request.has(product.id);
  const routerComplement =
    product.id === "portable-bureautique-14-pouces"
      ? getInfProduct("reseau-internet", "routeur-4g")
      : undefined;
  const photo = product.gallery[active] ?? product.image;
  const title = product.title;
  const accent = title.split(" ").slice(0, title.split(" ").length > 3 ? 2 : Math.min(2, title.split(" ").length)).join(" ") || title;
  const rest = title.startsWith(accent) ? title.slice(accent.length) : title;

  return (
    <div className="inf-page inf-page--product">
      <header className="inf-product-intro">
        <p className="inf-eyebrow inf-eyebrow--gold">{infProductCopy.eyebrow}</p>
        <h1 className="inf-h1">
          <span className="inf-underline">{accent}</span>
          {rest}
        </h1>
        {product.excerpt ? <p className="inf-lead">{product.excerpt}</p> : null}
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
              <Link href={infAislePath(aisle.id)}>{aisle.title}</Link>
            </li>
            <li>
              <span aria-current="page">{product.title}</span>
            </li>
          </ol>
        </nav>
      </header>

      <div className="inf-product-layout">
        <div className="inf-gallery">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width : 900px) 100vw, 48vw"
            className="inf-gallery__main"
            style={{ objectPosition: photo.objectPosition }}
            quality={86}
            priority
          />
          {photo.variant ? (
            <p className="inf-gallery__caption">
              {photo.variant} — deux finitions proposées comme variantes, à confirmer selon la disponibilité.
            </p>
          ) : null}
          {product.gallery.length > 1 ? (
            <ul className="inf-gallery__thumbs">
              {product.gallery.map((item, index) => (
                <li key={item.src}>
                  <button
                    type="button"
                    className={index === active ? "is-on" : undefined}
                    onClick={() => setActive(index)}
                    aria-label={item.variant || `Photo ${index + 1}`}
                    aria-current={index === active ? true : undefined}
                  >
                    <Image src={item.src} alt={item.variant || ""} width={item.width} height={item.height} sizes="80px" />
                    {item.variant ? <span className="inf-gallery__variant">{item.variant}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="inf-buy">
          <ul className="inf-buy__facts">
            {product.highlight ? <li>Capacité : {product.highlight}</li> : null}
            <li>Type : {product.typeLabel}</li>
          </ul>
          <label className="inf-buy__field">
            <span>{infProductCopy.placeLabel}</span>
            <span className="inf-field--icon inf-field--select">
              <VhpIcon name="pin" strokeWidth={1.5} />
              <select
              value={request.state.zone}
              onChange={(event) => request.setMeta({ zone: event.target.value })}
            >
              <option value="">Choisir</option>
              {infPlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
              <VhpIcon name="chevronDown" className="inf-field__caret" strokeWidth={1.8} />
            </span>
          </label>
          <FamilyDateRange
            prefix="inf"
            startId="inf-buy-start"
            endId="inf-buy-end"
            startDate={request.state.startDate}
            endDate={request.state.endDate}
            onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
            startPlaceholder="À préciser"
            endPlaceholder="À préciser"
          />
          <div className="inf-qty">
            <span>{infProductCopy.qtyLabel}</span>
            <div className="inf-qty__ctrl">
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
            className="inf-btn inf-btn--yellow inf-btn--block"
            aria-pressed={added}
            onClick={() => (added ? request.remove(product.id) : request.add(product.id, qty))}
          >
            {added ? infProductCopy.added : infProductCopy.add}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </button>
          <Link href={infAislePath(aisle.id)} className="inf-back">
            ← {infProductCopy.back}
          </Link>
        </div>
      </div>

      <div className="inf-details">
        <section>
          <h2>{product.connectivity ? infProductCopy.connectivityTitle : infProductCopy.specsTitle}</h2>
          {product.connectivity ? (
            <ul className="inf-connectivity">
              {product.connectivity.map((row) => (
                <li key={row.title}>
                  <strong>{row.title}</strong>
                  <span>{row.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <dl>
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        <section>
          <h2>{infProductCopy.deliveryTitle}</h2>
          <p className="inf-note">
            <VhpIcon name="truck" strokeWidth={1.5} />
            <span>
              <strong>{infProductCopy.deliveryLead}</strong>
              {infProductCopy.deliveryText}
            </span>
          </p>
          <p className="inf-note">
            <VhpIcon name="info" strokeWidth={1.5} />
            <span>
              <strong>{infProductCopy.tariffTitle}</strong>
              {infProductCopy.tariffText}
            </span>
          </p>
        </section>
      </div>

      {routerComplement ? (
        <section className="inf-complements" aria-labelledby="inf-complement-title">
          <h2 id="inf-complement-title">{infProductCopy.complementTitle}</h2>
          <div className="inf-complement">
            <Image src={routerComplement.image.src} alt="" width={routerComplement.image.width} height={routerComplement.image.height} />
            <div>
              <strong>{routerComplement.title}</strong>
              <p>{infProductCopy.complementLead}</p>
              <Link href={infProductPath(routerComplement.aisleId, routerComplement.slug)} className="inf-btn inf-btn--outline inf-btn--small">
                {infProductCopy.complementCta}
                <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <p className="inf-tariff-banner">
        <VhpIcon name="info" strokeWidth={1.5} />
        <span>
          <strong>{infProductCopy.tariffTitle}</strong> {infProductCopy.tariffText}
        </span>
      </p>

      <section className="inf-counsel">
        <div className="inf-counsel__copy">
          <h2>{infProductCopy.adviceTitle}</h2>
          <p>{infProductCopy.adviceLead}</p>
          <Link href={infContactHref} className="inf-btn inf-btn--yellow">
            {infProductCopy.adviceCta}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </Link>
        </div>
        <figure className="inf-counsel__visual">
          <Image
            src={infSceneShowroom.src}
            alt={infSceneShowroom.alt}
            width={infSceneShowroom.width}
            height={infSceneShowroom.height}
            sizes="40vw"
            className="inf-counsel__img"
            style={{ objectPosition: infSceneShowroom.objectPosition }}
          />
        </figure>
      </section>

      <ol className="inf-steps">
        {infProductCopy.steps.map((step) => (
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
