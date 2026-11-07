"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { homIds, homUniverses } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";

export function HomUniverses() {
  const [activeId, setActiveId] = useState<string>(homUniverses.items[0].id);
  const active = homUniverses.items.find((item) => item.id === activeId) ?? homUniverses.items[0];
  const ids: string[] = homUniverses.items.map((item) => item.id);

  // Ouverture volontaire uniquement (clic, Entrée, Espace). Flèches / Début / Fin : déplacent seulement le focus. Aucun minuteur.
  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const index = ids.indexOf(id);
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % ids.length;
    else if (event.key === "ArrowUp") next = (index - 1 + ids.length) % ids.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ids.length - 1;
    else return;
    event.preventDefault();
    document.getElementById(`hom-acc-trigger-${ids[next]}`)?.focus();
  };

  return (
    <section id={homIds.universes} data-section="solutions" className="hom-universes" aria-labelledby="hom-universes-title">
      <span id={homIds.universesAlias} className="hom-alias" aria-hidden />
      <div className="hom-wrap">
        <header className="hom-head">
          <div>
            <p className="hom-eyebrow">{homUniverses.eyebrow}</p>
            <h2 id="hom-universes-title" className="hom-h2">
              {homUniverses.title}
            </h2>
          </div>
          <p className="hom-head__aside">{homUniverses.aside}</p>
        </header>

        <div className="hom-universes__grid">
          <ul className="hom-acc" aria-label="Nos univers">
            {homUniverses.items.map((item) => {
              const open = item.id === active.id;
              return (
                <li key={item.id} className={`hom-acc__item${open ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="hom-acc__trigger"
                    aria-expanded={open}
                    id={`hom-acc-trigger-${item.id}`}
                    aria-controls={`hom-acc-panel-${item.id}`}
                    onClick={() => setActiveId(item.id)}
                    onKeyDown={(event) => onTriggerKeyDown(event, item.id)}
                  >
                    <span className="hom-acc__number">{item.number}</span>
                    <span className="hom-acc__title">{item.title}</span>
                    <HomIcon name={open ? "chevronDown" : "plus"} className="hom-acc__icon" />
                  </button>
                  <div
                    id={`hom-acc-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`hom-acc-trigger-${item.id}`}
                    className="hom-acc__panel"
                    aria-hidden={!open}
                  >
                    <div className="hom-acc__panel-inner">
                      <div className="hom-acc__stack">
                        <div className="hom-acc__real">
                          <p>{item.text}</p>
                          <Link href={item.cta.href} className="hom-link hom-link--small" tabIndex={open ? undefined : -1}>
                            {item.cta.label}
                            <HomIcon name="arrowUpRight" className="hom-link__icon" />
                          </Link>
                        </div>
                        {/* Réserve la hauteur du plus grand panneau : aucun saut de mise en page à l'ouverture. */}
                        {homUniverses.items
                          .filter((other) => other.id !== item.id)
                          .map((other) => (
                            <div key={other.id} className="hom-acc__real hom-acc__ghost" aria-hidden inert>
                              <p>{other.text}</p>
                              <span className="hom-link hom-link--small">
                                {other.cta.label}
                                <HomIcon name="arrowUpRight" className="hom-link__icon" />
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>                </li>
              );
            })}
          </ul>

          <figure className="hom-universes__media">
            {homUniverses.items.map((item) => (
              <Image
                key={item.id}
                src={item.image.src}
                alt={item.id === active.id ? item.image.alt : ""}
                aria-hidden={item.id === active.id ? undefined : true}
                width={item.image.width}
                height={item.image.height}
                sizes="(max-width: 900px) 100vw, 56vw"
                className={`hom-universes__img${item.id === active.id ? " is-active" : ""}`}
                style={{ objectPosition: item.image.position }}
              />
            ))}
            {homUniverses.items.map((item) => (
              <div
                key={item.id}
                className={`hom-universes__caption${item.id === active.id ? " is-active" : ""}`}
                aria-hidden={item.id === active.id ? undefined : true}
              >
                <strong>{item.caption.title}</strong>
                <span>{item.caption.detail}</span>
              </div>
            ))}
          </figure>
        </div>
        <p className="hom-footnote">{homUniverses.footnote}</p>
      </div>
    </section>
  );
}