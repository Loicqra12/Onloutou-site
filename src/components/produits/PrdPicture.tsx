import { prdPhotos, prdSrc, type PrdPhoto } from "@/content/produits-hub";

export function PrdPicture({
  photo,
  className,
  priority = false,
}: {
  photo: PrdPhoto | keyof typeof prdPhotos;
  className?: string;
  priority?: boolean;
}) {
  const data = typeof photo === "string" ? prdPhotos[photo] : photo;
  return (
    <div className={className ? `prd-photo ${className}` : "prd-photo"}>
      <picture>
        <source type="image/webp" srcSet={prdSrc(data.webpFile ?? data.file, "webp")} />
        <img
          src={prdSrc(data.file, "png")}
          alt={data.alt}
          width={data.width}
          height={data.height}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
        />
      </picture>
    </div>
  );
}
