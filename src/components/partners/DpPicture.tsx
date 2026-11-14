import { dpImg } from "@/content/devenir-partenaire";

type Img = { file: string; webp: string; width: number; height: number; alt: string };

export function DpPicture({ image, className, sizes, priority = false }: { image: Img; className?: string; sizes?: string; priority?: boolean }) {
  const src = `${dpImg}/${image.webp}`;
  const png = `${dpImg}/${image.file}`;
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={src} />
      <img
        src={png}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    </picture>
  );
}
