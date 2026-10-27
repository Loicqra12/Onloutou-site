import type { SiteMedia } from "@/content/media";
import { Reveal } from "@/components/motion/Reveal";

type AnimatedSvgFigureProps = {
  media: SiteMedia;
  title?: string;
  description?: string;
  disclaimer?: string;
  caption?: string;
};

export function AnimatedSvgFigure({
  media,
  title,
  description,
  disclaimer,
  caption,
}: AnimatedSvgFigureProps) {
  return (
    <Reveal>
      <figure className="overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-paper shadow-[var(--shadow-card)]">
        {(title || description) && (
          <div className="border-b border-brand-border px-5 py-4 sm:px-6">
            {title && (
              <h3 className="font-display text-xl font-extrabold tracking-tight text-brand-ink sm:text-2xl">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{description}</p>
            )}
          </div>
        )}
        {/* img natif pour préserver les animations CSS internes du SVG */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
        {(disclaimer || caption) && (
          <figcaption className="space-y-2 border-t border-brand-border px-5 py-4 text-xs leading-relaxed text-brand-muted sm:px-6">
            {disclaimer && (
              <p className="font-semibold text-brand-ink">{disclaimer}</p>
            )}
            {caption && <p>{caption}</p>}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
