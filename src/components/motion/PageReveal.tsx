"use client";

import { useEffect } from "react";

type Props = {
  /** Sélecteur du conteneur de la page (la révélation ne touche rien en dehors). */
  root: string;
  /** Éléments à révéler : conteneurs de cartes ou de blocs, jamais les titres ni les paragraphes eux-mêmes. */
  targets: string;
};

/**
 * Révélation douce au défilement pour les pages de service (opacité + léger glissement vers le haut, une seule fois).
 * Sans JavaScript, avec « réduire les animations » ou sans IntersectionObserver : rien n'est masqué.
 * L'état « armé » n'est posé qu'après l'hydratation ; ce qui est déjà bien à l'écran n'est jamais masqué.
 */
export function PageReveal({ root, targets }: Props) {
  useEffect(() => {
    const rootEl = document.querySelector<HTMLElement>(root);
    if (!rootEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const armed: HTMLElement[] = [];
    const counters = new Map<Element, number>();
    for (const el of Array.from(rootEl.querySelectorAll<HTMLElement>(targets))) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 80 && rect.top < window.innerHeight * 0.85) continue;
      const parent = el.parentElement;
      if (parent) {
        const index = counters.get(parent) ?? 0;
        counters.set(parent, index + 1);
        el.style.setProperty("--pr-delay", `${Math.min(index, 5) * 70}ms`);
      }
      el.dataset.pr = "pending";
      armed.push(el);
    }
    rootEl.classList.add("pr-motion");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.pr = "in";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );
    armed.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      rootEl.classList.remove("pr-motion");
      armed.forEach((el) => {
        delete el.dataset.pr;
        el.style.removeProperty("--pr-delay");
      });
    };
  }, [root, targets]);

  return null;
}
