import Image from "next/image";
import { getApprovedHistoryImage } from "@/content/history-images";

type HistoricalImageProps = {
  assetId: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function HistoricalImage({
  assetId,
  className = "",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: HistoricalImageProps) {
  const asset = getApprovedHistoryImage(assetId);
  if (!asset?.publicPath) return null;

  return (
    <figure className={`history-image ${className}`.trim()}>
      <div className="history-image__frame">
        <Image
          src={asset.publicPath}
          alt={asset.alt}
          width={asset.width!}
          height={asset.height!}
          sizes={sizes}
          className="history-image__img"
          priority={priority}
        />
      </div>
      {asset.credit ? <figcaption className="history-image__credit">{asset.credit}</figcaption> : null}
    </figure>
  );
}
