import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { Reveal } from "@/components/motion/Reveal";
import { becomePartnerBreadcrumb, becomePartnerHero, becomePartnerMedia } from "@/content/become-partner-page";

export function BecomePartnerHero() {
  const photo = becomePartnerMedia.hero;

  return (
    <section className="become-partner-hero bg-brand-charcoal text-brand-white" aria-labelledby="become-partner-hero-title">
      <span className="become-partner-hero__accent" aria-hidden />
      <div className="become-partner-hero__inner container-content">
        <div className="become-partner-hero__copy">
          <Breadcrumb items={becomePartnerBreadcrumb} />
          <p className="partners-eyebrow">{becomePartnerHero.eyebrow}</p>
          <h1 id="become-partner-hero-title" className="become-partner-hero__title font-display font-extrabold tracking-tight text-balance">
            {becomePartnerHero.titleBefore}
            <HighlightedText surface="dark">{becomePartnerHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="become-partner-hero__intro">{becomePartnerHero.intro}</p>
          <p className="become-partner-hero__notice">{becomePartnerHero.notice}</p>
          <ol className="become-partner-hero__steps" aria-label="Étapes du parcours">
            {becomePartnerHero.steps.map((label, index) => (
              <li key={label}>
                <span className="become-partner-hero__step-num">{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <div className="become-partner-hero__actions">
            <Button href={becomePartnerHero.primaryCta.href} variant="primary">{becomePartnerHero.primaryCta.label}</Button>
            <a href={becomePartnerHero.secondaryCta.href} className="become-partner-hero__secondary link-motion">
              {becomePartnerHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <Reveal delay={60} className="become-partner-hero__visual">
          <figure>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1023px) 100vw, 42vw"
              className="become-partner-hero__img"
              style={{ objectPosition: photo.objectPosition }}
              priority
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
