import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import { projectsBreadcrumb, projectsHero, projectsMedia } from "@/content/projects-page";

export function ProjectsHero() {
  const photo = projectsMedia.reunion;

  return (
    <section className="proj-hero bg-brand-charcoal text-brand-white" aria-labelledby="proj-hero-title">
      <div className="proj-hero__shell container-content">
        <div className="proj-hero__copy">
          <Breadcrumb items={projectsBreadcrumb} />
          <p className="proj-hero__ref" aria-hidden>{projectsHero.editorialRef}</p>
          <p className="proj-eyebrow">{projectsHero.eyebrow}</p>
          <h1 id="proj-hero-title" className="proj-hero__title font-display font-extrabold tracking-tight text-balance">
            {projectsHero.titleBefore}
            <HighlightedText surface="dark">{projectsHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="proj-hero__intro">{projectsHero.intro}</p>
          <p className="proj-hero__caveat">{projectsHero.caveat}</p>
          <div className="proj-hero__actions">
            <Button href={projectsHero.primaryCta.href} variant="primary">
              {projectsHero.primaryCta.label}
            </Button>
            <a href={projectsHero.secondaryCta.href} className="proj-hero__secondary link-motion">
              {projectsHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={80} className="proj-hero__visual">
          <figure className="proj-hero__figure">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="proj-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
