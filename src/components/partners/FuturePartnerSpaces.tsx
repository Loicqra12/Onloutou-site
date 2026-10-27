"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { partnersFutureSpaces } from "@/content/partners-page";

function SpaceMock({ title, features }: { title: string; features: string[] }) {
  return (
    <div className="partners-space-mock" aria-label={`Aperçu conceptuel — ${title}`}>
      <header className="partners-space-mock__head">
        <span className="partners-space-mock__badge">Concept</span>
        <span>{title}</span>
      </header>
      <ul className="partners-space-mock__list">
        {features.map((f) => (
          <li key={f}>
            <span>{f}</span>
            <span className="partners-space-mock__pill">À définir</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FuturePartnerSpaces() {
  const baseId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<"partner" | "delivery">("partner");
  const data = partnersFutureSpaces;

  useEffect(() => {
    rootRef.current?.classList.add("partners-future--tabs-ready");
  }, []);

  return (
    <section
      ref={rootRef}
      id={data.id}
      className="partners-future section-spacing bg-brand-white"
      aria-labelledby="partners-future-title"
    >
      <div className="container-content">
        <h2 id="partners-future-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <p className="partners-future__disclaimer">{data.disclaimer}</p>

        <div className="partners-future__tabs" role="tablist" aria-label="Aperçus conceptuels">
          <button
            type="button"
            role="tab"
            id={`${baseId}-tab-partner`}
            aria-selected={active === "partner"}
            aria-controls={`${baseId}-panel-partner`}
            className={`partners-future__tab${active === "partner" ? " partners-future__tab--active" : ""}`}
            onClick={() => setActive("partner")}
          >
            {data.partnerSpace.label}
          </button>
          <button
            type="button"
            role="tab"
            id={`${baseId}-tab-delivery`}
            aria-selected={active === "delivery"}
            aria-controls={`${baseId}-panel-delivery`}
            className={`partners-future__tab${active === "delivery" ? " partners-future__tab--active" : ""}`}
            onClick={() => setActive("delivery")}
          >
            {data.deliverySpace.label}
          </button>
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel-partner`}
          aria-labelledby={`${baseId}-tab-partner`}
          hidden={active !== "partner"}
          className="partners-future__panel"
        >
          <SpaceMock title={data.partnerSpace.label} features={data.partnerSpace.features} />
          {data.partnerSpace.previewHref ? (
            <p className="partners-future__preview-link">
              <Link href={data.partnerSpace.previewHref} className="link-motion">
                {data.partnerSpace.previewCta}
              </Link>
            </p>
          ) : null}
        </div>
        <div
          role="tabpanel"
          id={`${baseId}-panel-delivery`}
          aria-labelledby={`${baseId}-tab-delivery`}
          hidden={active !== "delivery"}
          className="partners-future__panel"
        >
          <SpaceMock title={data.deliverySpace.label} features={data.deliverySpace.features} />
          {data.deliverySpace.previewHref ? (
            <p className="partners-future__preview-link">
              <Link href={data.deliverySpace.previewHref} className="link-motion">
                {data.deliverySpace.previewCta}
              </Link>
            </p>
          ) : null}
        </div>

        <div className="partners-future__stack">
          <SpaceMock title={data.partnerSpace.label} features={data.partnerSpace.features} />
          <SpaceMock title={data.deliverySpace.label} features={data.deliverySpace.features} />
        </div>
      </div>
    </section>
  );
}
