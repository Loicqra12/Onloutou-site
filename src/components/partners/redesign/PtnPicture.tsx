import Image from "next/image";
import { ptnImages, type PtnImageId } from "@/content/partners-hub";

type PtnPictureProps = {
  id: PtnImageId;
  alt: string;
  scene: string;
  className?: string;
  priority?: boolean;
  sizes: string;
};

/** Cadre « scène » (fond dégradé) + visuel détouré posé en bas. */
export function PtnPicture({ id, alt, scene, className = "", priority, sizes }: PtnPictureProps) {
  const image = ptnImages[id];
  if (!image) return <div className={`ptn-pic ptn-scene-${scene} ${className}`.trim()} aria-hidden="true" />;
  return (
    <div className={`ptn-pic ptn-scene-${scene} ${className}`.trim()}>
      <Image
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="ptn-pic__img"
      />
    </div>
  );
}