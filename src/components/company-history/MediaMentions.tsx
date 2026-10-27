import { Reveal } from "@/components/motion/Reveal";
import { mediaMentions, mediaMentionsSection } from "@/content/media-mentions";

export function MediaMentions() {
  return (
    <section
      id="presse"
      className="history-press section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="history-press-title"
    >
      <div className="container-content max-w-3xl">
        <Reveal>
          <h2 id="history-press-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {mediaMentionsSection.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">{mediaMentionsSection.lead}</p>
        </Reveal>
        <ul className="history-press__list">
          {mediaMentions.map((mention, index) => (
            <Reveal key={mention.id} as="li" delay={index * 45} className="history-press__item">
              <a
                href={mention.href}
                className="history-press__link link-motion"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="history-press__publisher">{mention.publisher}</span>
                <span className="history-press__label">{mention.label}</span>
                <span className="history-press__arrow" aria-hidden>↗</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
