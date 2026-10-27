"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleProfileImage } from "@/components/vehicles/vehicleMedia";
import { vehiclesProfiles } from "@/content/vehicles-page";

export function VehicleProfiles() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = vehiclesProfiles.items;

  useEffect(() => {
    rootRef.current?.classList.add("veh-profiles--enhanced");
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
      id={vehiclesProfiles.id}
      className="veh-profiles section-spacing bg-brand-white"
      aria-labelledby="veh-profiles-title"
      ref={rootRef}
    >
      <div className="container-content">
        <Reveal>
          <h2 id="veh-profiles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {vehiclesProfiles.title}
          </h2>
        </Reveal>

        <div className="veh-profiles__layout">
          <div role="tablist" aria-label="Profils de véhicules" className="veh-profiles__nav" onKeyDown={onKeyDown}>
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
                  className={`veh-profiles__nav-btn${selected ? " veh-profiles__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="veh-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </button>
              );
            })}
          </div>

          <div className="veh-profiles__stage">
            {items.map((profile, index) => {
              const selected = index === activeIndex;
              return (
                <article
                  key={profile.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${profile.id}`}
                  aria-labelledby={`${baseId}-tab-${profile.id}`}
                  className={`veh-profiles__panel${selected ? " veh-profiles__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <div className="veh-profiles__copy">
                    <h3>{profile.title}</h3>
                    <p className="veh-profiles__label">Usages possibles</p>
                    <ul>
                      {profile.usages.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                    <p className="veh-profiles__label">Critères à examiner</p>
                    <ul>
                      {profile.criteria.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    {profile.note && <p className="veh-profiles__note">{profile.note}</p>}
                  </div>
                  <VehicleProfileImage imageKey={profile.imageKey} profileId={profile.id} />
                </article>
              );
            })}
          </div>

          <div className="veh-profiles__stack">
            {items.map((profile) => (
              <article key={profile.id} className="veh-profiles__stack-item">
                <h3>
                  <span className="veh-profiles__nav-num">{profile.number}</span>
                  {profile.title}
                </h3>
                <VehicleProfileImage imageKey={profile.imageKey} profileId={profile.id} />
                <ul>
                  {profile.usages.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
                {profile.note && <p className="veh-profiles__note">{profile.note}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
