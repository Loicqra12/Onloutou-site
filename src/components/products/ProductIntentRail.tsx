"use client";

import {
  PRODUCT_REQUEST_PREFILL_KEY,
  productIntentRail,
  type ProductRequestPrefill,
} from "@/content/products-page";

function savePrefill(prefill: ProductRequestPrefill) {
  try {
    sessionStorage.setItem(PRODUCT_REQUEST_PREFILL_KEY, JSON.stringify(prefill));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("onloutou-product-prefill", { detail: prefill }));
}

export function ProductIntentRail() {
  const data = productIntentRail;

  return (
    <nav className="prd-intent" aria-labelledby="prd-intent-title">
      <div className="container-content">
        <p id="prd-intent-title" className="prd-intent__label">Choisir une intention</p>
        <ul className="prd-intent__list">
          {data.items.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="prd-intent__link link-motion"
                onClick={() => {
                  const prefill: ProductRequestPrefill = {};
                  if ("family" in item && item.family) prefill.familyLabel = item.family;
                  if ("mode" in item && item.mode) prefill.modeLabel = item.mode;
                  if (Object.keys(prefill).length) savePrefill(prefill);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
