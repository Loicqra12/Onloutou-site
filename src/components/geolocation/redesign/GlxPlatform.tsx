"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { glxPlatform } from "@/content/geolocation-hub";
import { GlxIcon } from "./GlxIcon";

export function GlxPlatform() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = glxPlatform.tabs;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActive((active + 1) % tabs.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((active - 1 + tabs.length) % tabs.length);
    }
  };

  return (
    <section id={glxPlatform.id} className="glx-section glx-platform" aria-labelledby="glx-platform-title">
      <div className="glx-wrap glx-platform__grid">
        <div className="glx-platform__copy">
          <p className="glx-kicker">{glxPlatform.kicker}</p>
          <h2 id="glx-platform-title" className="glx-h2 glx-h2--md">
            <span className="glx-line">Une vision claire</span>
            <span className="glx-line">
              <span className="glx-underline">de vos actifs.</span>
            </span>
          </h2>
          <p className="glx-lead">{glxPlatform.lead}</p>
          <div role="tablist" aria-label="Vues de la plateforme" className="glx-platform__tabs" onKeyDown={onKeyDown}>
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${uid}-tab-${tab.id}`}
                aria-selected={active === i}
                aria-controls={`${uid}-panel`}
                tabIndex={active === i ? 0 : -1}
                className="glx-tab"
                onClick={() => setActive(i)}
              >
                <GlxIcon name={tab.icon} strokeWidth={1.8} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="glx-platform__stage">
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tabs[active].id}`} className="glx-platform__panel">
            <figure className="glx-platform__frame">
              <Image
                key={tabs[active].id}
                src={tabs[active].image.src}
                alt={tabs[active].image.alt}
                width={tabs[active].image.width}
                height={tabs[active].image.height}
                sizes="(max-width: 900px) 100vw, 66vw"
              />
            </figure>
          </div>
          <p className="glx-note">{glxPlatform.caption}</p>
        </div>
      </div>
    </section>
  );
}
