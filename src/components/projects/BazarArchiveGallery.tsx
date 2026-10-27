"use client";

import Image from "next/image";
import { useState } from "react";
import type { BazarCategory, BazarGalleryImage } from "@/content/bazar-project";

type BazarArchiveGalleryProps = {
  images: BazarGalleryImage[];
  categories: BazarCategory[];
  period: string;
};

type GalleryPlate =
  | { kind: "image"; data: BazarGalleryImage }
  | { kind: "category"; data: BazarCategory; period: string };

function buildPlates(images: BazarGalleryImage[], categories: BazarCategory[], period: string): GalleryPlate[] {
  if (images.length > 0) {
    return images.map((data) => ({ kind: "image", data }));
  }
  return categories.slice(0, 6).map((data) => ({ kind: "category", data, period }));
}

export function BazarArchiveGallery({ images, categories, period }: BazarArchiveGalleryProps) {
  const plates = buildPlates(images, categories, period);
  const loop = [...plates, ...plates];
  const [userPaused, setUserPaused] = useState(false);
  const hasMotion = plates.length > 0;

  return (
    <div className={`bazar-gallery${userPaused ? " is-paused" : ""}`} data-bazar-gallery>
      <div className="bazar-gallery__viewport" tabIndex={0} aria-label="Galerie d’archives du catalogue 2017">
        <div className="bazar-gallery__track" aria-hidden={false}>
          {loop.map((plate, index) => {
            const key = `${plate.kind}-${plate.kind === "image" ? plate.data.id : plate.data.id}-${index}`;
            if (plate.kind === "image") {
              const img = plate.data;
              return (
                <figure
                  key={key}
                  className={`bazar-gallery__item bazar-gallery__item--photo${img.offsetClass ? ` ${img.offsetClass}` : ""}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 767px) 72vw, 280px"
                    className="bazar-gallery__photo"
                    loading="lazy"
                  />
                  <figcaption className="bazar-gallery__caption">{img.caption}</figcaption>
                </figure>
              );
            }
            const cat = plate.data;
            return (
              <figure
                key={key}
                className={`bazar-gallery__item bazar-gallery__item--category bazar-gallery__item--offset-${index % 3}`}
              >
                <p className="bazar-gallery__plate-year" aria-hidden>{plate.period}</p>
                <h3 className="bazar-gallery__plate-title">{cat.title}</h3>
                <ul className="bazar-gallery__plate-list">
                  {cat.items.slice(0, 4).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <figcaption className="bazar-gallery__caption">Archive catalogue — {cat.title}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
      {hasMotion ? (
        <button
          type="button"
          className="bazar-gallery__pause"
          aria-pressed={userPaused}
          onClick={() => setUserPaused((value) => !value)}
        >
          {userPaused ? "Reprendre le défilement" : "Pause du défilement"}
        </button>
      ) : null}
    </div>
  );
}
