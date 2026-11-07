"use client";

import { useEffect } from "react";

/** Éléments révélés au défilement (conteneurs uniquement : jamais les titres/paragraphes eux-mêmes). */
const REVEAL = [
  ".hom-titleblock",
  ".hom-head",
  ".hom-partners__item",
  ".hom-acc__item",
  ".hom-universes__media",
  ".hom-equip__tile",
  ".hom-equip__links",
  ".hom-equip__request",
  ".hom-geo-tab",
  ".hom-geo__stage",
  ".hom-gestures__list > li",
  ".hom-method__copy",
  ".hom-module",
  ".hom-build__foot",
  ".hom-ptabs",
  ".hom-pgallery",
  ".hom-recog__card",
  ".hom-recog__cta",
  ".hom-bcp",
  ".hom-company__media",
  ".hom-company__copy",
  ".hom-cta__copy",
  ".hom-cta__actions",
].join(",");

const MARKS = ".hom-mark";
/** Groupes à apparition successive des enfants (méthode circulaire) : une seule fois, puis tout reste stable. */
const STAGGER = ".hom-cycle";

/**
 * Révélation douce au défilement. Sans JavaScript ou avec prefers-reduced-motion,
 * rien n’est masqué : l’état « armé » n’est posé qu’après l’hydratation.
 */
export function HomMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hom-page");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(`${REVEAL},${MARKS},${STAGGER}`));
    const counters = new Map<Element, number>();
    const armed: HTMLElement[] = [];
    for (const el of targets) {
      // Déjà bien à l’écran : on ne le masque pas. Le bas du premier écran reste éligible,
      // sinon une section seulement aperçue au chargement ne s’anime jamais.
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 80 && rect.top < window.innerHeight * 0.62) continue;
      armed.push(el);
      const parent = el.parentElement;
      if (parent && !el.matches(MARKS) && !el.matches(STAGGER)) {
        const index = counters.get(parent) ?? 0;
        counters.set(parent, index + 1);
        el.style.setProperty("--hom-delay", `${Math.min(index, 6) * 70}ms`);
      }
      el.dataset.reveal = "pending";
    }
    root.classList.add("hom-motion");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -4% 0px" },
    );
    armed.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("hom-motion");
      armed.forEach((el) => {
        delete el.dataset.reveal;
        el.style.removeProperty("--hom-delay");
      });
    };
  }, []);

  return null;
}