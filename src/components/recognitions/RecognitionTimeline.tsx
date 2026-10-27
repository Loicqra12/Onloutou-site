import type { RecognitionEntry } from "@/content/recognitions";
import { RecognitionCard } from "@/components/recognitions/RecognitionCard";

type RecognitionTimelineProps = {
  entries: RecognitionEntry[];
};

export function RecognitionTimeline({ entries }: RecognitionTimelineProps) {
  return (
    <ol className="recognition-timeline" aria-label="Autres distinctions et sélections">
      {entries.map((entry, index) => (
        <li key={entry.slug} className="recognition-timeline__item">
          <RecognitionCard entry={entry} index={index} />
        </li>
      ))}
    </ol>
  );
}
