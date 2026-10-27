type TocSection = { id: string; title: string };

type LegalTableOfContentsProps = {
  sections: readonly TocSection[];
  ariaLabel: string;
  topHref?: string;
};

export function LegalTableOfContents({
  sections,
  ariaLabel,
  topHref = "#leg-hero-title",
}: LegalTableOfContentsProps) {
  return (
    <nav className="leg-toc" aria-label={ariaLabel}>
      <p className="leg-toc__title">Sommaire</p>
      <ol className="leg-toc__list">
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="leg-toc__link">
              {section.title}
            </a>
          </li>
        ))}
      </ol>
      <a href={topHref} className="leg-toc__top link-motion">Retour en haut</a>
    </nav>
  );
}
