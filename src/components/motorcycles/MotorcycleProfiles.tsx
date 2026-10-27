"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { MotorcycleProfileVisual } from "@/components/motorcycles/motorcycleMedia";
import { motorcyclesProfiles } from "@/content/motorcycles-page";

export function MotorcycleProfiles() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = motorcyclesProfiles.items;

  useEffect(() => {
    rootRef.current?.classList.add("mot-profiles--enhanced");
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
      id={motorcyclesProfiles.id}
      className="mot-profiles section-spacing bg-brand-white"
      aria-labelledby="mot-profiles-title"
      ref={rootRef}
    >
      <div className="container-content">
        <Reveal>
          <h2 id="mot-profiles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {motorcyclesProfiles.title}
          </h2>
        </Reveal>

        <div className="mot-profiles__layout">
          <div role="tablist" aria-label="Profils de motos" className="mot-profiles__nav" onKeyDown={onKeyDown}>
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
                  className={`mot-profiles__nav-btn${selected ? " mot-profiles__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="mot-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </button>
              );
            })}
          </div>

          <div className="mot-profiles__stage">
            {items.map((profile, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={profile.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${profile.id}`}
                  aria-labelledby={`${baseId}-tab-${profile.id}`}
                  className={`mot-profiles__panel${selected ? " mot-profiles__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <div className="mot-profiles__copy">
                    <h3>{profile.title}</h3>
                    <p className="mot-profiles__label">Usages pouvant être étudiés</p>
                    <ul>
                      {profile.usages.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                    <p className="mot-profiles__label">Critères</p>
                    <ul>
                      {profile.criteria.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <MotorcycleProfileVisual visual={profile.visual} profileId={profile.id} />
                </article>
              );
            })}
          </div>

          <div className="mot-profiles__stack">
            {items.map((profile) => (
              <article key={profile.id} className="mot-profiles__stack-item">
                <h3>
                  <span className="mot-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </h3>
                <MotorcycleProfileVisual visual={profile.visual} profileId={profile.id} />
                <ul>
                  {profile.usages.map((u) => (
                    <li key={u}>{u}</li>
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
