import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { rentalFinalCta } from "@/content/rental-page";

export function RentalFinalCta() {
  const photo = rentalFinalCta.image;

  return (
    <section className="rental-final-cta" aria-labelledby="rental-final-cta-title">
      <div className="rental-final-cta__media">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 767px) 130vw, 100vw"
          className="rental-final-cta__bg"
          style={{ objectFit: "cover", objectPosition: photo.objectPosition }}
        />
      </div>
      <div className="rental-final-cta__veil" aria-hidden />
      <div className="container-content rental-final-cta__inner">
        <h2 id="rental-final-cta-title" className="rental-final-cta__title font-display font-extrabold tracking-tight">
          {rentalFinalCta.titleBefore}
          <HighlightedText surface="dark">{rentalFinalCta.titleHighlight}</HighlightedText>
        </h2>
        <p className="rental-final-cta__lead">{rentalFinalCta.lead}</p>
        <div className="rental-final-cta__actions">
          <Button href={rentalFinalCta.primary.href} variant="primary">
            {rentalFinalCta.primary.label}
          </Button>
          <a href={`tel:${rentalFinalCta.phoneTel}`} className="rental-final-cta__phone link-motion">
            {rentalFinalCta.phoneLabel} — {rentalFinalCta.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
