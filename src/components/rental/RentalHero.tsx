import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { rentalBreadcrumb, rentalHero, rentalMedia, rentalPositioning } from "@/content/rental-page";

export function RentalHero() {
  const photo = rentalMedia.hero;

  return (
    <section className="rental-hero" aria-labelledby="rental-hero-title">
      <div className="rental-hero__media">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="100vw"
          className="rental-hero__bg"
          style={{ objectFit: "cover", objectPosition: photo.objectPosition }}
        />
      </div>
      <div className="rental-hero__veil" aria-hidden />
      <div className="rental-hero__copy container-content">
        <Breadcrumb items={rentalBreadcrumb} />
        <p className="rental-eyebrow">{rentalHero.eyebrow}</p>
        <h1 id="rental-hero-title" className="rental-hero__title font-display font-extrabold tracking-tight text-balance">
          {rentalHero.titleBefore}
          <HighlightedText surface="dark" variant="accent">{rentalHero.titleHighlight}</HighlightedText>
        </h1>
        <p className="rental-hero__intro">{rentalHero.intro}</p>
        <p className="rental-hero__positioning">{rentalPositioning}</p>
        <div className="rental-hero__actions">
          <Button href={rentalHero.primaryCta.href} variant="primary">
            {rentalHero.primaryCta.label}
          </Button>
          <a href={rentalHero.secondaryCta.href} className="rental-hero__secondary">
            {rentalHero.secondaryCta.label}
            <span aria-hidden> ↓</span>
          </a>
        </div>
        <p className="rental-hero__caveat">{rentalHero.caveat}</p>
      </div>
    </section>
  );
}
