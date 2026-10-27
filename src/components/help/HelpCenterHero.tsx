import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HighlightedText } from "@/components/ui/HighlightedText";
import { HelpSearch } from "@/components/help/HelpSearch";
import { HelpAudienceFilter } from "@/components/help/HelpAudienceFilter";
import { helpCenterBreadcrumb, helpCenterHero } from "@/content/help-center";

export function HelpCenterHero() {
  const data = helpCenterHero;

  return (
    <section className="hlp-hero bg-brand-charcoal text-brand-white" aria-labelledby="hlp-hero-title">
      <div className="hlp-hero__inner container-content">
        <Breadcrumb items={helpCenterBreadcrumb} />
        <p className="partners-eyebrow">{data.eyebrow}</p>
        <h1 id="hlp-hero-title" className="hlp-hero__title font-display font-extrabold tracking-tight text-balance">
          {data.titleBefore}
          <HighlightedText surface="dark">{data.titleHighlight}</HighlightedText>
        </h1>
        <p className="hlp-hero__intro">{data.intro}</p>
        <HelpSearch />
        <p className="hlp-hero__examples">{data.searchExamples}</p>
        <HelpAudienceFilter />
      </div>
    </section>
  );
}
