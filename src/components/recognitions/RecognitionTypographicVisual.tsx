import Image from "next/image";
import { siteMedia } from "@/content/media";
import type { RecognitionEntry } from "@/content/recognitions";

type RecognitionTypographicVisualProps = {
  entry: RecognitionEntry;
  variant?: "feature" | "compact";
};

export function RecognitionTypographicVisual({
  entry,
  variant = "feature",
}: RecognitionTypographicVisualProps) {
  const emblem = siteMedia.logo;
  return (
    <div
      className={`recognition-typo${variant === "compact" ? " recognition-typo--compact" : ""}`}
      role="img"
      aria-label={entry.imageAlt}
    >
      <div className="recognition-typo__inner">
        <Image
          src={emblem.src}
          alt=""
          width={emblem.width}
          height={emblem.height}
          className="recognition-typo__emblem"
          aria-hidden
        />
        <p className="recognition-typo__year">{entry.year}</p>
        <p className="recognition-typo__status">{entry.status}</p>
        <p className="recognition-typo__event">{entry.title}</p>
      </div>
    </div>
  );
}
