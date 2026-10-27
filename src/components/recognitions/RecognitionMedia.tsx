import Image from "next/image";
import type { RecognitionEntry } from "@/content/recognitions";
import { RecognitionTypographicVisual } from "@/components/recognitions/RecognitionTypographicVisual";

type RecognitionMediaProps = {
  entry: RecognitionEntry;
  variant?: "feature" | "compact";
  priority?: boolean;
};

export function RecognitionMedia({ entry, variant = "feature", priority = false }: RecognitionMediaProps) {
  if (entry.imageRightsStatus === "approved" && entry.image) {
    return (
      <figure className={`recognition-media recognition-media--${variant}`}>
        <div className="recognition-media__frame">
          <Image
            src={entry.image.src}
            alt={entry.image.alt}
            width={entry.image.width}
            height={entry.image.height}
            sizes={variant === "feature" ? "(max-width: 768px) 100vw, 42vw" : "(max-width: 768px) 100vw, 28vw"}
            className="recognition-media__img"
            priority={priority}
          />
        </div>
        {entry.imageCredit ? (
          <figcaption className="recognition-media__credit">{entry.imageCredit}</figcaption>
        ) : null}
      </figure>
    );
  }

  return <RecognitionTypographicVisual entry={entry} variant={variant} />;
}
