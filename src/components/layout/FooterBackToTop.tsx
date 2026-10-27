"use client";

import { prefersReducedMotion } from "@/components/motion/enable-motion";

export function FooterBackToTop() {
  const onClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <button type="button" className="site-footer-top" onClick={onClick} aria-label="Retour en haut de page">
      Retour en haut
      <span aria-hidden>↑</span>
    </button>
  );
}
