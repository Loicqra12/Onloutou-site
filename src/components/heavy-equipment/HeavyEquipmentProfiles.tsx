"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { HeavyEquipmentProfileVisual } from "@/components/heavy-equipment/heavyEquipmentMedia";
import { trucksMachineryProfiles } from "@/content/trucks-machinery-page";

export function HeavyEquipmentProfiles() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = trucksMachineryProfiles.items;

  useEffect(() => {
    rootRef.current?.classList.add("heq-profiles--enhanced");
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
    <section
      id={trucksMachineryProfiles.id}
      className="heq-profiles section-spacing bg-brand-white"
      aria-labelledby="heq-profiles-title"
      ref={rootRef}
    >
      <div className="container-content">
        <Reveal>
          <h2 id="heq-profiles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {trucksMachineryProfiles.title}
          </h2>
        </Reveal>

        <div className="heq-profiles__layout">
          <div role="tablist" aria-label="Familles de camions et engins" className="heq-profiles__nav" onKeyDown={onKeyDown}>
            {items.map((profile, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={profile.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${profile.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${profile.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`heq-profiles__nav-btn${selected ? " heq-profiles__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="heq-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </button>
              );
            })}
          </div>

          <div className="heq-profiles__stage">
            {items.map((profile, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={profile.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${profile.id}`}
                  aria-labelledby={`${baseId}-tab-${profile.id}`}
                  className={`heq-profiles__panel${selected ? " heq-profiles__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <div className="heq-profiles__copy">
                    <h3>{profile.title}</h3>
                    <p className="heq-profiles__label">Usages pouvant être étudiés</p>
                    <ul>
                      {profile.usages.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                    <p className="heq-profiles__label">Critères</p>
                    <ul>
                      {profile.criteria.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <HeavyEquipmentProfileVisual profileId={profile.id} schemaLabel={profile.schemaLabel} />
                </article>
              );
            })}
          </div>

          <div className="heq-profiles__stack">
            {items.map((profile) => (
              <article key={profile.id} className="heq-profiles__stack-item">
                <h3>
                  <span className="heq-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </h3>
                <HeavyEquipmentProfileVisual profileId={profile.id} schemaLabel={profile.schemaLabel} />
                <p className="heq-profiles__label">Usages pouvant être étudiés</p>
                <ul>
                  {profile.usages.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
                <p className="heq-profiles__label">Critères</p>
                <ul>
                  {profile.criteria.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
