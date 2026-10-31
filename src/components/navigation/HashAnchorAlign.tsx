"use client";

import { useEffect } from "react";

/** Durée pendant laquelle l'ancre est réalignée si la mise en page évolue (images, hydratation). */
const SETTLE_MS = 3000;

function resolveTarget(id: string) {
  const anchor = document.getElementById(id);
  if (!anchor) return null;
  const selectors = anchor.dataset.anchorTarget?.split("|") ?? [];
  for (const selector of selectors) {
    const candidate = document.querySelector<HTMLElement>(selector);
    if (candidate && candidate.getClientRects().length > 0) return candidate;
  }
  return anchor;
}

/**
 * Accès direct ou actualisation d'une URL avec ancre : le navigateur défile vers la cible avant
 * que la page soit stabilisée (hydratation, polices, images). Tant que le visiteur n'a pas
 * lui-même défilé, la cible est réalignée sous l'en-tête fixe (marge : --anchor-offset).
 * Une ancre peut déléguer l'alignement à un autre élément : `data-anchor-target` liste des
 * sélecteurs (séparés par « | »), le premier élément visible est aligné (ex. domaines des projets).
 */

export function HashAnchorAlign() {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    const id = decodeURIComponent(raw);

    const align = () => {
      resolveTarget(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    };

    const events = ["wheel", "touchstart", "keydown", "pointerdown", "hashchange"] as const;
    const observer = new ResizeObserver(align);
    let timer = 0;

    const stop = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, stop));
    };

    events.forEach((name) => window.addEventListener(name, stop, { passive: true }));
    observer.observe(document.body);
    timer = window.setTimeout(stop, SETTLE_MS);
    align();

    return stop;
  }, []);

  return null;
}
