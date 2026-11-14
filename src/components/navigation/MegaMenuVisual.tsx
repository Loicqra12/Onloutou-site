"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavVisual } from "@/types/navigation";

type MegaMenuVisualProps = {
  visual: NavVisual;
  onNavigate: () => void;
};

/** Carte visuelle : image bien cadrée, titre, sous-titre et appel à l'action optionnel. */
export function MegaMenuVisual({ visual, onNavigate }: MegaMenuVisualProps) {
  const { image, title, subtitle, cta } = visual;

  return (
    <aside className="mega-visual">
      <div className="mega-visual-frame">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="360px"
          className="mega-visual-image"
          style={{ objectPosition: image.objectPosition }}
        />
      </div>
      {title ? <p className="mega-visual-title">{title}</p> : null}
      {subtitle ? <p className="mega-visual-subtitle">{subtitle}</p> : null}
      {cta ? (
        <Link
          href={cta.href}
          prefetch={false}
          className={
            visual.ctaStyle === "button"
              ? "mega-btn-yellow"
              : "mega-cta mega-visual-link"
          }
          onClick={onNavigate}
        >
          <span>{cta.label}</span>
          <span aria-hidden>
            {visual.ctaStyle === "button" ? ">" : "↗"}
          </span>
        </Link>
      ) : null}
    </aside>
  );
}
