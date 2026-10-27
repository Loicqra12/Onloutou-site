"use client";

import Image from "next/image";
import Link from "next/link";
import type { NavVisual } from "@/types/navigation";

type MegaMenuVisualProps = {
  visual: NavVisual;
  onNavigate: () => void;
  compact?: boolean;
};

export function MegaMenuVisual({ visual, onNavigate, compact = false }: MegaMenuVisualProps) {
  return (
    <aside className={`mega-visual${compact ? " is-compact" : ""}`}>
      <div className="mega-visual-frame">
        <Image
          src={visual.image.src}
          alt={visual.image.alt}
          width={visual.image.width}
          height={visual.image.height}
          sizes="(max-width: 1199px) 0px, 320px"
          className="mega-visual-image"
          style={{ objectPosition: visual.image.objectPosition }}
        />
      </div>
      {visual.title ? <p className="mega-visual-title">{visual.title}</p> : null}
      {visual.subtitle ? <p className="mega-visual-subtitle">{visual.subtitle}</p> : null}
      {!visual.title && visual.caption ? <p className="mega-visual-caption">{visual.caption}</p> : null}
      {visual.cta ? (
        <Link
          href={visual.cta.href}
          prefetch={false}
          className="mega-visual-cta"
          target={visual.cta.external ? "_blank" : undefined}
          rel={visual.cta.external ? "noopener noreferrer" : undefined}
          onClick={onNavigate}
        >
          <span>{visual.cta.label}</span>
          <span aria-hidden className="mega-cta-arrow">
            ↗
          </span>
        </Link>
      ) : null}
    </aside>
  );
}
