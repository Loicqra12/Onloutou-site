import type { RecognitionSource } from "@/content/recognitions";

type RecognitionSourcesProps = {
  sources: RecognitionSource[];
  id?: string;
};

export function RecognitionSources({ sources, id }: RecognitionSourcesProps) {
  if (sources.length === 0) return null;
  return (
    <details className="recognition-sources" id={id}>
      <summary className="recognition-sources__summary">Sources et vérifications</summary>
      <ul className="recognition-sources__list">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              className="recognition-sources__link link-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              {source.label}
              <span className="recognition-sources__arrow" aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
