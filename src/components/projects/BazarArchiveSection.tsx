import Link from "next/link";
import { BazarArchiveGallery } from "@/components/projects/BazarArchiveGallery";
import { Button } from "@/components/ui/Button";
import { bazarProject, getBazarPublicTitle } from "@/content/bazar-project";

export function BazarArchiveSection() {
  const title = getBazarPublicTitle();

  return (
    <section
      id={bazarProject.anchor}
      className="bazar-archive section-spacing scroll-mt-28 bg-brand-charcoal text-brand-white"
      aria-labelledby="bazar-archive-title"
    >
      <div className="bazar-archive__rule" aria-hidden />
      <div className="container-content bazar-archive__grid">
        <div className="bazar-archive__copy">
          <p className="bazar-archive__eyebrow">{bazarProject.eyebrow}</p>
          <p className="bazar-archive__year" aria-hidden>{bazarProject.period}</p>
          <h2 id="bazar-archive-title" className="bazar-archive__title font-display font-extrabold tracking-tight text-balance">
            {title}
          </h2>
          {bazarProject.introParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="bazar-archive__text">
              {paragraph}
            </p>
          ))}
          <p className="bazar-archive__notice" role="note">{bazarProject.disclaimer}</p>
          <div className="bazar-archive__actions">
            <Button href={bazarProject.primaryCta.href} variant="primary">
              {bazarProject.primaryCta.label}
            </Button>
            <Link href={bazarProject.secondaryCta.href} className="bazar-archive__secondary link-motion">
              {bazarProject.secondaryCta.label}
              <span aria-hidden> →</span>
            </Link>
          </div>
        </div>
        <div className="bazar-archive__media">
          <BazarArchiveGallery
            images={bazarProject.images}
            categories={bazarProject.categories}
            period={bazarProject.period}
          />
        </div>
      </div>
    </section>
  );
}
