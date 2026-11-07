import { CommerceHero } from "@/components/commerce/CommerceHero";
import { rentalBreadcrumb, rentalHero, rentalMedia } from "@/content/rental-page";

export function RentalHero() {
  return (
    <CommerceHero
      variant="photo"
      id="rental-hero-title"
      breadcrumb={rentalBreadcrumb}
      eyebrow={rentalHero.eyebrow}
      titleBefore={rentalHero.titleBefore}
      titleAccent={rentalHero.titleHighlight}
      intro={rentalHero.intro}
      primary={rentalHero.primaryCta}
      secondary={rentalHero.secondaryCta}
      note={rentalHero.caveat}
      media={rentalMedia.hero}
    />
  );
}
