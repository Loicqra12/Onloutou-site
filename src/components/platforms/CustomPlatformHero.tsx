import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { PlatformTypeMock } from "@/components/platforms/PlatformTypeMock";
import { customPlatformsBreadcrumb, customPlatformsHero } from "@/content/custom-platforms-page";

export function CustomPlatformHero() {
  return (
    <section className="platform-hero platform-hero--light" aria-labelledby="platform-hero-title">
      <div className="platform-hero__inner container-content">
        <div className="platform-hero__copy">
          <Breadcrumb items={customPlatformsBreadcrumb} />
          <p className="platform-kicker">{customPlatformsHero.eyebrow}</p>
          <TitleReveal as="h1" id="platform-hero-title" className="platform-hero__title font-display font-extrabold tracking-tight text-balance">
            {customPlatformsHero.titleBefore}
            {customPlatformsHero.titleHighlight}
          </TitleReveal>
          <p className="platform-hero__intro">{customPlatformsHero.intro}</p>
          <p className="platform-hero__caveat">{customPlatformsHero.caveat}</p>
          <div className="platform-hero__actions">
            <Button href={customPlatformsHero.primaryCta.href} variant="primary">
              {customPlatformsHero.primaryCta.label}
            </Button>
            <a href={customPlatformsHero.secondaryCta.href} className="platform-hero__secondary link-motion">
              {customPlatformsHero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="platform-hero__visual">
          <PlatformTypeMock typeId="web" title="Plateforme Web" />
        </div>
      </div>
    </section>
  );
}
