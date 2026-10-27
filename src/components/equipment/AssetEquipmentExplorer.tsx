"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  CONNECTED_ASSET_PREFILL_KEY,
  connectedAssetExplorer,
  connectedAssetRequestLabels,
  type ConnectedAssetId,
} from "@/content/connected-equipment-page";

function qualifyAsset(assetId: ConnectedAssetId) {
  try {
    sessionStorage.setItem(CONNECTED_ASSET_PREFILL_KEY, assetId);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent("onloutou-connected-asset", { detail: assetId }));
  document.getElementById("demande-connectee")?.scrollIntoView({ behavior: "smooth" });
}

export function AssetEquipmentExplorer() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = connectedAssetExplorer.items;

  useEffect(() => {
    rootRef.current?.classList.add("cec-explorer--enhanced");
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    }
  };

  return (
    <section className="cec-explorer section-spacing bg-brand-white" aria-labelledby="cec-explorer-title" ref={rootRef}>
      <div className="container-content">
        <h2 id="cec-explorer-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {connectedAssetExplorer.title}
        </h2>

        <div className="cec-explorer__layout">
          <div role="tablist" aria-label="Types d’actifs" className="cec-explorer__nav" onKeyDown={onKeyDown}>
            {items.map((item, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`cec-explorer__nav-btn${selected ? " cec-explorer__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="cec-explorer__stage">
            {items.map((item, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={item.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${item.id}`}
                  aria-labelledby={`${baseId}-tab-${item.id}`}
                  className={`cec-explorer__panel${selected ? " cec-explorer__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <AssetPanel item={item} onQualify={() => qualifyAsset(item.id)} />
                </article>
              );
            })}
          </div>

          <div className="cec-explorer__stack">
            {items.map((item) => (
              <article key={item.id} className="cec-explorer__stack-item">
                <h3>{item.label}</h3>
                <AssetPanel item={item} onQualify={() => qualifyAsset(item.id)} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AssetPanel({
  item,
  onQualify,
}: {
  item: (typeof connectedAssetExplorer.items)[number];
  onQualify: () => void;
}) {
  return (
    <div className="cec-explorer__detail">
      <p className="cec-explorer__label">Points à vérifier</p>
      <ul>
        {item.checks.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="cec-explorer__label">Familles d’équipements pouvant être étudiées</p>
      <ul>
        {item.families.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <p className="cec-explorer__label">Limites ou contraintes possibles</p>
      <ul>
        {item.limits.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p className="cec-explorer__tag">{connectedAssetExplorer.disclaimer}</p>
      <button type="button" className="cec-explorer__cta" onClick={onQualify}>
        Qualifier — {connectedAssetRequestLabels[item.id]}
      </button>
    </div>
  );
}
