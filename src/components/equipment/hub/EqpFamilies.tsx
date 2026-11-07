"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { eqpFamilies } from "@/content/equipment-hub";
import { EqpIcon } from "./EqpIcon";

export function EqpFamilies() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = eqpFamilies.items;

  // Les ancres « famille-… » sélectionnent la famille correspondante.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      const index = items.findIndex((item) => item.anchor === hash);
      if (index >= 0) setActive(index);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items]);

  const select = useCallback(
    (index: number, focus = false) => {
      const next = (index + items.length) % items.length;
      setActive(next);
      if (focus) tabRefs.current[next]?.focus();
    },
    [items.length],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      select(active + 1, true);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(active - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(items.length - 1, true);
    }
  };

  return (
    <section id={eqpFamilies.id} className="eqp-section eqp-families" aria-labelledby="eqp-families-title">
      <div className="eqp-wrap">
        <p className="eqp-kicker">{eqpFamilies.kicker}</p>
        <h2 id="eqp-families-title" className="eqp-h2">
          {eqpFamilies.title}
        </h2>
        <p className="eqp-lead">{eqpFamilies.lead}</p>

        <div className="eqp-families__grid">
          <div role="tablist" aria-label="Familles d’équipements" aria-orientation="vertical" className="eqp-families__tabs" onKeyDown={onKeyDown}>
            {items.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  className="eqp-tab"
                  onClick={() => select(i)}
                >
                  <span className="eqp-tab__n">{item.number}</span>
                  <span className="eqp-tab__label">{item.label}</span>
                  <EqpIcon name="arrowRight" />
                </button>
              );
            })}
          </div>

          <div className="eqp-families__panels">
            {items.map((item, i) => {
              const selected = i === active;
              return (
                <div
                  key={item.id}
                  id={`${uid}-panel-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`${uid}-tab-${item.id}`}
                  className={`eqp-panel${selected ? "" : " eqp-panel--off"}`}
                >
                  <span id={item.anchor} className="eqp-anchor" aria-hidden="true" />
                  <div className={`eqp-panel__media${item.image.fit === "contain" ? " eqp-panel__media--contain" : ""}`}>
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes="(max-width: 900px) 100vw, 640px"
                      style={item.image.position ? { objectPosition: item.image.position } : undefined}
                    />
                  </div>
                  <h3 className="eqp-panel__title">{item.title}</h3>
                  <ul className="eqp-panel__features">
                    {item.features.map((f) => (
                      <li key={f.label}>
                        <EqpIcon name={f.icon} strokeWidth={1.5} />
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="eqp-panel__actions">
                    {item.links.map((link, li) =>
                      li === 0 ? (
                        <Link key={link.href} href={link.href} className="eqp-btn eqp-btn--yellow">
                          {link.label}
                          <EqpIcon name="arrowUpRight" />
                        </Link>
                      ) : (
                        <Link key={link.href} href={link.href} className="eqp-link">
                          {link.label}
                          <EqpIcon name="arrowUpRight" />
                        </Link>
                      ),
                    )}
                  </div>
                  <p className="eqp-note">{eqpFamilies.disclaimer}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
