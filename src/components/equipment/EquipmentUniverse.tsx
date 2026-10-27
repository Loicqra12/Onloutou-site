"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { equipmentFamilyImage } from "@/components/equipment/equipmentMedia";
import { equipmentHubUniverse } from "@/content/equipment-page";

export function EquipmentUniverse() {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const families = equipmentHubUniverse.families;

  useEffect(() => {
    rootRef.current?.classList.add("equip-universe--enhanced");
  }, []);

  const selectFamily = useCallback(
    (index: number) => {
      setActiveIndex((index + families.length) % families.length);
    },
    [families.length],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectFamily(activeIndex - 1);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectFamily(activeIndex + 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(families.length - 1);
    }
  };

  return (
    <section
      id={equipmentHubUniverse.id}
      className="equip-universe section-spacing bg-brand-white"
      aria-labelledby="equip-universe-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="equip-universe-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {equipmentHubUniverse.title}
          </h2>
        </Reveal>

        <div ref={rootRef} className="equip-universe__layout">
          <div
            role="tablist"
            aria-label="Familles d’équipements"
            className="equip-universe__nav"
            onKeyDown={onKeyDown}
          >
            {families.map((family, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  key={family.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-fam-tab-${family.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-fam-panel-${family.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`equip-universe__nav-btn${selected ? " equip-universe__nav-btn--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="equip-universe__nav-num">{family.number}</span>
                  {family.title}
                </button>
              );
            })}
          </div>

          <div className="equip-universe__panels">
            {families.map((family, index) => {
              const selected = index === activeIndex;
              const media =
                family.visual === "image" && family.imageKey ? equipmentFamilyImage(family.imageKey) : null;

              return (
                <article
                  key={family.id}
                  id={family.anchor}
                  role="tabpanel"
                  aria-labelledby={`${baseId}-fam-tab-${family.id}`}
                  className={`equip-universe__panel${selected ? " equip-universe__panel--active" : ""}`}
                  aria-hidden={!selected}
                >
                  <header className="equip-universe__panel-head">
                    <span className="equip-universe__panel-num">{family.number}</span>
                    <h3>{family.title}</h3>
                  </header>

                  {family.visual === "typographic" ? (
                    <div className="equip-universe__type-block" aria-hidden="false">
                      <p className="equip-universe__type-glyph" aria-hidden="true">{family.number}</p>
                      {family.note && <p className="equip-universe__type-note">{family.note}</p>}
                    </div>
                  ) : media ? (
                    <figure className="equip-universe__figure">
                      <Image
                        src={media.src}
                        alt={media.alt}
                        width={media.width}
                        height={media.height}
                        sizes="(max-width: 768px) 100vw, 480px"
                        className="equip-universe__img"
                        style={{ objectPosition: "objectPosition" in media ? media.objectPosition : undefined }}
                      />
                      {family.disclaimer && <figcaption>{family.disclaimer}</figcaption>}
                    </figure>
                  ) : null}

                  <ul className="equip-universe__usages">
                    {family.usages.map((usage) => (
                      <li key={usage}>{usage}</li>
                    ))}
                  </ul>

                  <div className="equip-universe__links">
                    {family.links.map((link) => (
                      <Link key={link.href} href={link.href} className="equip-universe__link link-motion">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="equip-universe__stack">
            {families.map((family) => {
              const media =
                family.visual === "image" && family.imageKey ? equipmentFamilyImage(family.imageKey) : null;
              return (
                <details key={family.id} id={`${family.anchor}-stack`} className="equip-universe__details">
                  <summary>
                    <span className="equip-universe__details-num">{family.number}</span>
                    {family.title}
                  </summary>
                  <div className="equip-universe__details-body">
                    {family.visual === "typographic" ? (
                      <p className="equip-universe__type-note">{family.note}</p>
                    ) : media ? (
                      <figure className="equip-universe__figure">
                        <Image
                          src={media.src}
                          alt={media.alt}
                          width={media.width}
                          height={media.height}
                          sizes="100vw"
                          className="equip-universe__img"
                        />
                        {family.disclaimer && <figcaption>{family.disclaimer}</figcaption>}
                      </figure>
                    ) : null}
                    <ul className="equip-universe__usages">
                      {family.usages.map((usage) => (
                        <li key={usage}>{usage}</li>
                      ))}
                    </ul>
                    <div className="equip-universe__links">
                      {family.links.map((link) => (
                        <Link key={link.href} href={link.href}>{link.label}</Link>
                      ))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
