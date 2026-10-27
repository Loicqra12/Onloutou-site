"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import {
  PRODUCT_REQUEST_PREFILL_KEY,
  productsUseExplorer,
  type ProductUseCaseId,
  type ProductRequestPrefill,
} from "@/content/products-page";

function prefillUseCase(id: ProductUseCaseId) {
  const prefill: ProductRequestPrefill = { useCaseId: id };
  try {
    sessionStorage.setItem(PRODUCT_REQUEST_PREFILL_KEY, JSON.stringify(prefill));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("onloutou-product-prefill", { detail: prefill }));
}

export function ProductUseExplorer() {
  const data = productsUseExplorer;
  const [activeId, setActiveId] = useState<ProductUseCaseId>(data.cases[0].id);
  const active = data.cases.find((c) => c.id === activeId) ?? data.cases[0];

  return (
    <section
      id={data.id}
      className="prd-use section-spacing scroll-mt-28 bg-brand-white"
      aria-labelledby="prd-use-title"
    >
      <div className="container-content prd-use__layout">
        <Reveal>
          <h2 id="prd-use-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <div className="prd-use__nav" role="tablist" aria-label="Besoins opérationnels">
          {data.cases.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`prd-use-tab-${item.id}`}
              aria-selected={activeId === item.id}
              aria-controls={`prd-use-panel-${item.id}`}
              className={`prd-use__tab${activeId === item.id ? " prd-use__tab--active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div
          id={`prd-use-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`prd-use-tab-${active.id}`}
          className="prd-use__panel"
        >
          <p className="prd-use__tag">{data.tag}</p>
          <ul className="prd-use__suggestions">
            {active.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="prd-use__qual">Options à étudier — qualification nécessaire</p>
          <div className="prd-use__links">
            {active.links.map((link) => (
              <Link key={link.href} href={link.href} className="link-motion">{link.label}</Link>
            ))}
            {active.cta && (
              <a
                href={active.cta.href}
                className="prd-use__cta link-motion"
                onClick={() => prefillUseCase(active.id)}
              >
                {active.cta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
