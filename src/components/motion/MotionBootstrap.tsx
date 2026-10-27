"use client";

import { useLayoutEffect } from "react";
import {
  activateMotionReady,
  activateReducedMotion,
  markAllRevealed,
  MOTION_FAILSAFE_MS,
  prefersReducedMotion,
  prepareMotionTargets,
  revealPendingInView,
} from "@/components/motion/enable-motion";

/** Prépare les reveals après le premier layout. Le contenu reste visible tant qu’aucun état pending n’est posé. */
export function MotionBootstrap() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      activateReducedMotion();
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      prepareMotionTargets();
      activateMotionReady();
    });

    const failsafe = window.setTimeout(() => {
      markAllRevealed();
    }, MOTION_FAILSAFE_MS);

    const onPageShow = (event: PageTransitionEvent) => {
      if (prefersReducedMotion() || event.persisted) {
        markAllRevealed();
        return;
      }
      revealPendingInView();
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
