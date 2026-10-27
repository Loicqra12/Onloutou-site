import { Reveal } from "@/components/motion/Reveal";
import type { RecognitionEntry } from "@/content/recognitions";
import { RecognitionMedia } from "@/components/recognitions/RecognitionMedia";
import { RecognitionSources } from "@/components/recognitions/RecognitionSources";

type RecognitionFeatureProps = {
  entry: RecognitionEntry;
};

export function RecognitionFeature({ entry }: RecognitionFeatureProps) {
  return (
    <Reveal as="article" className="recognition-feature">
      <div className="recognition-feature__visual">
        <RecognitionMedia entry={entry} variant="feature" priority />
      </div>
      <div className="recognition-feature__body">
        <p className="recognition-feature__meta">
          <span className="recognition-feature__year">{entry.year}</span>
          <span className="recognition-feature__status">{entry.status}</span>
        </p>
        <h3 className="recognition-feature__title">{entry.title}</h3>
        <p className="recognition-feature__summary">{entry.summary}</p>
        <RecognitionSources sources={entry.sources} />
      </div>
    </Reveal>
  );
}
