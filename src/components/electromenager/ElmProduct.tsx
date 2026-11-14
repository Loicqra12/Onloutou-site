"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ELM_FAMILY_LABEL,
  ELM_ROOT,
  elmAislePath,
  elmContactHref,
  elmPlaces,
  elmProductCopy,
  elmSceneShowroom,
  type ElmAisle,
  type ElmProduct,
} from "@/content/electromenager";
import { VhpIcon } from "@/components/vehicles/redesign/VhpIcon";
import { useElmRequest } from "./ElmRequest";

import { FamilyDateRange } from "@/components/articles/FamilyDate";
import { periodPatch } from "@/lib/family-period";
export function ElmProductView({ aisle, product }: { aisle: ElmAisle; product: ElmProduct }) {
  const request = useElmRequest();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(Math.max(1, request.quantity(product.id) || 1));
  const added = request.has(product.id);
  const photo = product.gallery[active] ?? product.image;
  const title = product.title;
  const accent = title.split(" ").slice(0, title.split(" ").length > 3 ? 2 : Math.min(2, title.split(" ").length)).join(" ") || title;
  const rest = title.startsWith(accent) ? title.slice(accent.length) : title;

  return (
    <div className="elm-page elm-page--product">
      <header className="elm-product-intro">
        <p className="elm-eyebrow elm-eyebrow--gold">{elmProductCopy.eyebrow}</p>
        <h1 className="elm-h1">
          <span className="elm-underline">{accent}</span>
          {rest}
        </h1>
        {product.excerpt ? <p className="elm-lead">{product.excerpt}</p> : null}
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
              <Link href={elmAislePath(aisle.id)}>{aisle.title}</Link>
            </li>
            <li>
              <span aria-current="page">{product.title}</span>
            </li>
          </ol>
        </nav>
      </header>

      <div className="elm-product-layout">
        <div className="elm-gallery">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width : 900px) 100vw, 48vw"
            className="elm-gallery__main"
            style={{ objectPosition: photo.objectPosition }}
            quality={86}
            priority
          />
          {product.gallery.length > 1 ? (
            <ul className="elm-gallery__thumbs">
              {product.gallery.map((item, index) => (
                <li key={item.src}>
                  <button
                    type="button"
                    className={index === active ? "is-on" : undefined}
                    onClick={() => setActive(index)}
                    aria-label={`Photo ${index + 1}`}
                    aria-current={index === active ? true : undefined}
                  >
                    <Image src={item.src} alt="" width={item.width} height={item.height} sizes="120px" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="elm-buy">
          <ul className="elm-buy__facts">
            {product.capacityLabel ? <li>Capacité : {product.capacityLabel}</li> : null}
            <li>Type : {product.typeLabel}</li>
          </ul>
          <label className="elm-buy__field">
            <span>{elmProductCopy.placeLabel}</span>
            <span className="elm-field--icon elm-field--select">
              <VhpIcon name="pin" strokeWidth={1.5} />
              <select
              value={request.state.zone}
              onChange={(event) => request.setMeta({ zone: event.target.value })}
            >
              <option value="">Choisir</option>
              {elmPlaces.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
              <VhpIcon name="chevronDown" className="elm-field__caret" strokeWidth={1.8} />
            </span>
          </label>
          <FamilyDateRange
            prefix="elm"
            startId="elm-buy-start"
            endId="elm-buy-end"
            startDate={request.state.startDate}
            endDate={request.state.endDate}
            onChange={(startDate, endDate) => request.setMeta(periodPatch(startDate, endDate))}
            startPlaceholder="À préciser"
            endPlaceholder="À préciser"
          />
          <div className="elm-qty">
            <span>{elmProductCopy.qtyLabel}</span>
            <div className="elm-qty__ctrl">
              <button
                type="button"
                aria-label="Diminuer"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                <VhpIcon name="minus" strokeWidth={1.5} />
              </button>
              <strong aria-live="polite">{qty}</strong>
              <button type="button" aria-label="Augmenter" onClick={() => setQty((value) => value + 1)}>
                <VhpIcon name="plus" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="elm-btn elm-btn--yellow elm-btn--block"
            aria-pressed={added}
            onClick={() => (added ? request.remove(product.id) : request.add(product.id, qty))}
          >
            {added ? elmProductCopy.added : elmProductCopy.add}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </button>
          <Link href={elmAislePath(aisle.id)} className="elm-back">
            ← {elmProductCopy.back}
          </Link>
        </div>
      </div>

      <div className="elm-details">
        <section>
          <h2>{elmProductCopy.specsTitle}</h2>
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
          <h2>{elmProductCopy.deliveryTitle}</h2>
          <p className="elm-note">
            <VhpIcon name="truck" strokeWidth={1.5} />
            <span>
              <strong>{elmProductCopy.deliveryLead}</strong>
              {elmProductCopy.deliveryText}
            </span>
          </p>
          <p className="elm-note">
            <VhpIcon name="info" strokeWidth={1.5} />
            <span>
              <strong>{elmProductCopy.tariffTitle}</strong>
              {elmProductCopy.tariffText}
            </span>
          </p>
        </section>
      </div>

      <section className="elm-counsel">
        <div className="elm-counsel__copy">
          <h2>{elmProductCopy.adviceKicker}</h2>
          <p>{elmProductCopy.adviceLead}</p>
          <Link href={elmContactHref} className="elm-btn elm-btn--yellow">
            {elmProductCopy.adviceCta}
            <VhpIcon name="arrowUpRight" strokeWidth={1.5} />
          </Link>
        </div>
        <figure className="elm-counsel__visual">
          <Image
            src={elmSceneShowroom.src}
            alt={elmSceneShowroom.alt}
            width={elmSceneShowroom.width}
            height={elmSceneShowroom.height}
            sizes="40vw"
            className="elm-counsel__img"
            style={{ objectPosition: elmSceneShowroom.objectPosition }}
          />
        </figure>
      </section>

      <ol className="elm-steps">
        {elmProductCopy.steps.map((step) => (
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
