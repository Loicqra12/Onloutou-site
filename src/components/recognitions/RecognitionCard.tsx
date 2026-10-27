import { Reveal } from "@/components/motion/Reveal";
import type { RecognitionEntry } from "@/content/recognitions";
import { RecognitionMedia } from "@/components/recognitions/RecognitionMedia";
import { RecognitionSources } from "@/components/recognitions/RecognitionSources";

type RecognitionCardProps = {
  entry: RecognitionEntry;
  index: number;
};

export function RecognitionCard({ entry, index }: RecognitionCardProps) {
  return (
    <Reveal as="article" delay={120 + index * 80} className="recognition-card">
      <div className="recognition-card__visual">
        <RecognitionMedia entry={entry} variant="compact" />
      </div>
      <div className="recognition-card__body">
        <p className="recognition-card__meta">
          <span className="recognition-card__year">{entry.year}</span>
          <span className="recognition-card__status">{entry.status}</span>
        </p>
        <h3 className="recognition-card__title">{entry.title}</h3>
        <p className="recognition-card__summary">{entry.summary}</p>
        <RecognitionSources sources={entry.sources} />
      </div>
    </Reveal>
  );
}
