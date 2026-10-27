import Image from "next/image";
import type { SiteMedia } from "@/content/media";
import { Reveal } from "@/components/motion/Reveal";

type EditorialMediaProps = {
  media: SiteMedia;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function EditorialMedia({
  media,
  sizes,
  priority = false,
  className = "",
  imageClassName = "",
}: EditorialMediaProps) {
  return (
    <Reveal className={className}>
      <figure className="editorial-media overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-white shadow-[var(--shadow-card)]">
        <div className="relative w-full">
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes={sizes}
            priority={priority}
            className={`editorial-media__img h-auto w-full object-cover ${imageClassName}`.trim()}
          />
        </div>
        {media.caption && (
          <figcaption className="border-t border-brand-border px-4 py-3 text-xs leading-relaxed text-brand-muted">
            {media.caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
