"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { homIds, homProjects } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";
import { HomTitle } from "@/components/home/redesign/HomMark";

export function HomProjects() {
  const [activeId, setActiveId] = useState<string>(homProjects.items[0].id);

  // Ouverture volontaire : clic, Entrée ou Espace (boutons natifs). Pas d'ouverture au survol ni au simple focus
  // (un survol en défilant ou un Tab ne doit pas faire bouger la galerie). Flèches / Début / Fin : déplacent le focus.
  const onLabelKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const labels = Array.from(event.currentTarget.closest(".hom-pgallery")?.querySelectorAll<HTMLButtonElement>(".hom-ppanel__label") ?? []);
    const index = labels.indexOf(event.currentTarget);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % labels.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + labels.length) % labels.length;
    else if (event.key === "Home") next = 0;
    else next = labels.length - 1;
    event.preventDefault();
    labels[next]?.focus();
  };

  return (
    <section id={homIds.projects} data-section="projects" className="hom-projects" aria-labelledby="hom-projects-title">
     <div className="hom-wrap hom-wrap--above">
        <header className="hom-head hom-head--center">
          <div>
            <p className="hom-eyebrow hom-eyebrow--rule-after">{homProjects.eyebrow}</p>
            <h2 id="hom-projects-title" className="hom-h2 hom-h2--xl">
              <HomTitle text={homProjects.title} mark={homProjects.titleMark} variant="line" />
            </h2>
          </div>
          <div className="hom-head__side">
            <p>{homProjects.aside}</p>
            <Link href={homProjects.link.href} className="hom-link hom-link--small">
              {homProjects.link.label}
              <HomIcon name="arrowUpRight" className="hom-link__icon" />
            </Link>
          </div>
        </header>

        <div className="hom-ptabs" role="group" aria-label="Domaines d’intervention">
          {homProjects.items.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={activeId === item.id}
              aria-controls={`hom-ppanel-${item.id}`}
              className="hom-ptab"
              onClick={() => setActiveId(item.id)}
            >
              {item.index} {item.tab}
            </button>
          ))}
        </div>

        <div className="hom-pgallery">
          {homProjects.items.map((item) => {
            const open = item.id === activeId;
            return (
              <article
                key={item.id}
                id={`hom-ppanel-${item.id}`}
                aria-label={item.title}
                className={`hom-ppanel${open ? " is-open" : ""}`}
              >
                <Image
                  src={item.src}
                  alt={open ? item.alt : ""}
                  aria-hidden={open ? undefined : true}
                  width={item.width}
                  height={item.height}
                  sizes={open ? "(max-width: 900px) 100vw, 46vw" : "(max-width: 900px) 100vw, 16vw"}
                  className="hom-ppanel__img"
                  style={{ objectPosition: item.position }}
                />
                <div className="hom-ppanel__shade" aria-hidden />
                <button
                  type="button"
                  id={`hom-plabel-${item.id}`}
                  className="hom-ppanel__label"
                  aria-expanded={open}
                  aria-controls={`hom-pbody-${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  onKeyDown={onLabelKeyDown}
                >
                  <span className="hom-ppanel__tab">
                    <span className="hom-ppanel__index">{item.index}</span> {item.tab}
                  </span>
                  <HomIcon name="chevronDown" className="hom-ppanel__chevron" />
                </button>
                <div
                  id={`hom-pbody-${item.id}`}
                  role="region"
                  aria-labelledby={`hom-plabel-${item.id}`}
                  aria-hidden={!open}
                  className="hom-ppanel__body"
                >
                  <div className="hom-ppanel__content">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.cta ? (
                      <Link href={item.cta.href} className="hom-link hom-link--yellow hom-link--small" tabIndex={open ? undefined : -1}>
                        {item.cta.label}
                        <HomIcon name="arrowUpRight" className="hom-link__icon" />
                      </Link>
                    ) : null}
                    {item.note ? <p className="hom-ppanel__note">{item.note}</p> : null}
                  </div>
                </div>              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}