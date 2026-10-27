import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { LcpPicture } from "@/components/ui/LcpPicture";
import {
  productIllustrativeCaption,
  productsBreadcrumb,
  productsHero,
  productsPageMedia,
} from "@/content/products-page";

export function ProductsHero() {
  const { heroPrimary, heroSecondary, heroTertiary } = productsPageMedia;

  return (
    <section className="prd-hero bg-brand-charcoal text-brand-white" aria-labelledby="prd-hero-title">
      <div className="prd-hero__inner container-content">
        <div className="prd-hero__copy">
          <Breadcrumb items={productsBreadcrumb} />
          <p className="partners-eyebrow">{productsHero.eyebrow}</p>
          <h1 id="prd-hero-title" className="prd-hero__title font-display font-extrabold tracking-tight text-balance">
            {productsHero.titleBefore}
            <HighlightedText surface="dark">{productsHero.titleHighlight}</HighlightedText>
          </h1>
          <p className="prd-hero__intro">{productsHero.intro}</p>
          <p className="prd-hero__notice">{productsHero.notice}</p>
          <div className="prd-hero__actions">
            <Button href={productsHero.primaryCta.href} variant="primary">{productsHero.primaryCta.label}</Button>
            <a href={productsHero.secondaryCta.href} className="prd-hero__secondary link-motion">
              {productsHero.secondaryCta.label}
            </a>
          </div>
        </div>
        <figure className="prd-hero__mosaic prd-hero__visual">
            <LcpPicture
              src={heroPrimary.src}
              alt={heroPrimary.alt}
              width={heroPrimary.width}
              height={heroPrimary.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1023px) 100vw, 42vw"
              className="prd-hero__img prd-hero__img--main editorial-media__img"
              style={{ objectPosition: heroPrimary.objectPosition }}
              priority
            />
            <div className="prd-hero__mosaic-side hidden sm:grid">
              <Image
                src={heroSecondary.src}
                alt={heroSecondary.alt}
                width={heroSecondary.width}
                height={heroSecondary.height}
                sizes="(min-width: 640px) 22vw, 0px"
                loading="lazy"
                className="prd-hero__img prd-hero__img--secondary editorial-media__img"
                style={{ objectPosition: heroSecondary.objectPosition }}
              />
              <Image
                src={heroTertiary.src}
                alt={heroTertiary.alt}
                width={heroTertiary.width}
                height={heroTertiary.height}
                sizes="(min-width: 640px) 22vw, 0px"
                loading="lazy"
                className="prd-hero__img prd-hero__img--tertiary editorial-media__img"
                style={{ objectPosition: heroTertiary.objectPosition }}
              />
            </div>
            <p className="prd-hero__caption">{productIllustrativeCaption}</p>
            <div className="prd-hero__panel" aria-label="Étapes de qualification">
              <ol className="prd-hero__panel-steps">
                {productsHero.panelSteps.map((step, index) => (
                  <li key={step}>
                    <span>{step}</span>
                    {index < productsHero.panelSteps.length - 1 && (
                      <span className="prd-hero__wire" aria-hidden />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </figure>
      </div>
    </section>
  );
}
