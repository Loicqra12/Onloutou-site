import { CommerceHero } from "@/components/commerce/CommerceHero";
import { salesBreadcrumb, salesHero, salesMedia } from "@/content/sales-page";

export function SalesHero() {
  return (
    <CommerceHero
      variant="split"
      id="sales-hero-title"
      breadcrumb={salesBreadcrumb}
      eyebrow={salesHero.eyebrow}
      titleBefore={salesHero.titleBefore}
      titleAccent={salesHero.titleHighlight}
      intro={salesHero.intro}
      primary={salesHero.primaryCta}
      secondary={salesHero.secondaryCta}
      note={salesHero.caveat}
      media={salesMedia.hero}
    />
  );
}
