import Image from "next/image";
import { prjImages, type PrjImageId } from "@/content/projects-hub";

type PrjPictureProps = {
  id: PrjImageId;
  alt: string;
  scene: string;
  className?: string;
  priority?: boolean;
  sizes: string;
  caption?: string;
};

/** Cadre « scène » (fond dégradé) + visuel posé en bas, légende facultative. */
export function PrjPicture({ id, alt, scene, className = "", priority, sizes, caption }: PrjPictureProps) {
  const image = prjImages[id];
  return (
    <div className={`prj-pic prj-scene-${scene} ${className}`.trim()}>
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="prj-pic__img"
      />
      {caption ? <span className="prj-caption">{caption}</span> : null}
    </div>
  );
}