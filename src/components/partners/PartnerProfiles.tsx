"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PartnerProfileVisual } from "@/components/partners/partnerMedia";
import { partnersProfiles } from "@/content/partners-page";

export function PartnerProfiles() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = partnersProfiles.items;

  useEffect(() => {
    rootRef.current?.classList.add("partners-profiles--enhanced");
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
      id={partnersProfiles.id}
      className="partners-profiles section-spacing bg-brand-white"
      aria-labelledby="partners-profiles-title"
      ref={rootRef}
    >
      <div className="container-content">
        <Reveal>
          <h2 id="partners-profiles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {partnersProfiles.title}
          </h2>
        </Reveal>

        <div className="partners-profiles__layout">
          <div role="tablist" aria-label="Profils partenaires" className="partners-profiles__nav" onKeyDown={onKeyDown}>
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
                  className={`partners-profiles__nav-btn${selected ? " partners-profiles__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="partners-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </button>
              );
            })}
          </div>

          <div className="partners-profiles__stage">
            {items.map((profile, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={profile.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${profile.id}`}
                  aria-labelledby={`${baseId}-tab-${profile.id}`}
                  className={`partners-profiles__panel${selected ? " partners-profiles__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <div className="partners-profiles__copy">
                    <h3>{profile.title}</h3>
                    <ul>
                      {profile.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    {profile.note && <p className="partners-profiles__note">{profile.note}</p>}
                  </div>
                  <PartnerProfileVisual profileId={profile.id} visual={profile.visual} />
                </article>
              );
            })}
          </div>

          <div className="partners-profiles__accordion">
            {items.map((profile) => (
              <details key={profile.id} className="partners-profiles__details">
                <summary>
                  <span className="partners-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </summary>
                <div className="partners-profiles__details-body">
                  <ul>
                    {profile.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  {profile.note && <p className="partners-profiles__note">{profile.note}</p>}
                  <PartnerProfileVisual profileId={profile.id} visual={profile.visual} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
