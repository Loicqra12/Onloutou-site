import Image from "next/image";
import { expImages, type ExpImageId } from "@/content/expertise-hub";

type ExpPictureProps = {
  id: ExpImageId;
  alt: string;
  scene: string;
  className?: string;
  priority?: boolean;
  sizes: string;
};

/** Cadre « scène » (fond dégradé) + photo détourée posée en bas. */
export function ExpPicture({ id, alt, scene, className = "", priority, sizes }: ExpPictureProps) {
  const image = expImages[id];
  return (
    <div className={`exp-pic exp-scene-${scene} ${className}`.trim()}>
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="exp-pic__img"
      />
    </div>
  );
}