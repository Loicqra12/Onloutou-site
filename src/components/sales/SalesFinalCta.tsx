import Image from "next/image";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { salesFinalCta } from "@/content/sales-page";

export function SalesFinalCta() {
  const photo = salesFinalCta.image;

  return (
    <section className="sales-final-cta" aria-labelledby="sales-final-cta-title">
      <div className="sales-final-cta__media">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 767px) 130vw, 100vw"
          className="sales-final-cta__bg"
          style={{ objectFit: "cover", objectPosition: photo.objectPosition }}
        />
      </div>
      <div className="sales-final-cta__veil" aria-hidden />
      <div className="container-content sales-final-cta__inner">
        <TitleReveal as="h2" id="sales-final-cta-title" className="sales-final-cta__title font-display font-extrabold tracking-tight">
          {salesFinalCta.titleBefore}
          <HighlightedText variant="marker" className="sales-marker">
            {salesFinalCta.titleHighlight}
          </HighlightedText>
        </TitleReveal>
        <p className="sales-final-cta__lead">{salesFinalCta.lead}</p>
        <div className="sales-final-cta__actions">
          <Button href={salesFinalCta.primary.href} variant="primary">
            {salesFinalCta.primary.label}
          </Button>
          <a href={`tel:${salesFinalCta.phoneTel}`} className="sales-final-cta__phone link-motion">
            {salesFinalCta.phoneLabel} — {salesFinalCta.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
