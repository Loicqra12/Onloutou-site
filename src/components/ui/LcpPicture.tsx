/* LCP : picture WebP + img PNG — requis pour export statique sans `/_next/image`. */
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { getLcpWebpSources } from "@/lib/media/lcp-variants";

type LcpPictureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

/**
 * Image LCP : WebP responsive pré-généré + fallback PNG.
 * Utilise <img> natif pour un preload/preconnect cohérent (export statique possible).
 */
export function LcpPicture({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  style,
  priority = false,
}: LcpPictureProps) {
  const webp = getLcpWebpSources(src);

  if (!webp) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        style={style}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  const mobileSrc = webp.mobile.replace(".w828.", ".w640.");
  const desktopSrc = webp.desktop;

  return (
    <picture>
      <source
        media="(max-width: 640px)"
        srcSet={`${mobileSrc} 640w, ${webp.mobile} 828w`}
        sizes={sizes}
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        srcSet={`${webp.mobile} 828w, ${desktopSrc} 1080w`}
        sizes={sizes}
        type="image/webp"
      />
      <source srcSet={`${desktopSrc} 1080w`} sizes={sizes} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        style={style}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
      />
    </picture>
  );
}
