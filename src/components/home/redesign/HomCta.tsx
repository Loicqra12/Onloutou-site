import Link from "next/link";
import { homCta, homIds } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";

export function HomCta() {
  return (
    <section id={homIds.cta} data-section="contact-cta" className="hom-cta" aria-labelledby="hom-cta-title">
      <div className="hom-wrap hom-cta__grid">
        <div className="hom-cta__copy">
          <h2 id="hom-cta-title" className="hom-cta__title">
            {homCta.titleLines.map((line) => (
              <span key={line} className="hom-block">
                {line}
              </span>
            ))}
          </h2>
          <p>{homCta.lead}</p>
        </div>
        <div className="hom-cta__actions">
          <Link href={homCta.primary.href} className="hom-btn hom-btn--dark">
            {homCta.primary.label}
            <HomIcon name="arrowUpRight" className="hom-btn__icon" />
          </Link>
          <a href={homCta.whatsapp.href} className="hom-btn hom-btn--outline-dark" target="_blank" rel="noopener noreferrer">
            {homCta.whatsapp.label}
            <HomIcon name="arrowUpRight" className="hom-btn__icon" />
            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
          </a>
        </div>
      </div>
    </section>
  );
}