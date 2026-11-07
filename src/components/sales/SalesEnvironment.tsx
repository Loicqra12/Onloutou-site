"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { MarkedPhrase } from "@/components/sales/MarkedPhrase";
import { imageCategoryDisclaimer, salesEnvironment, salesMedia } from "@/content/sales-page";

export function SalesEnvironment() {
  const rootRef = useRef<HTMLDivElement>(null);
  const photo = salesMedia.warehouse;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      root.classList.add("sales-env-active");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("sales-env-active");
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sales-env section-spacing" aria-labelledby="sales-env-title">
      <div className="container-content sales-env__layout">
        <figure className="sales-env__figure">
          <div className="sales-env__media">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1024px) 160vw, 85vw" quality={86}
              className="sales-env__img"
              style={{ objectPosition: photo.objectPosition }}
            />
          </div>
          <figcaption className="sales-env__caption">
            {salesEnvironment.caption} — {imageCategoryDisclaimer}
          </figcaption>
        </figure>
        <div ref={rootRef} className="sales-env__criteria">
          <p className="sales-eyebrow">Qualification technique</p>
          <TitleReveal as="h2" id="sales-env-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            <MarkedPhrase text={salesEnvironment.title} highlight={salesEnvironment.titleHighlight} />
          </TitleReveal>
          <ol className="sales-env__list">
            {salesEnvironment.groups.map((group, index) => (
              <li key={group.title} className="sales-env__item">
                <span className="sales-env__marker">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="sales-env__item-title">{group.title}</p>
                  <p className="sales-env__item-text">{group.items.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
