import { TitleReveal } from "@/components/motion/TitleReveal";
import { EditorialNotice } from "@/components/ui/EditorialNotice";
import { HistoryTimeline } from "@/components/company-history/HistoryTimeline";
import {
  companyHistoryMilestones,
  companyJourneyIntro,
  historicalMetricsNote,
} from "@/content/company-history";

export function CompanyJourney() {
  return (
    <section id="parcours" className="section-spacing scroll-mt-28" aria-labelledby="company-journey-title">
      <div className="container-content max-w-3xl">
        <TitleReveal
          as="h2"
          id="company-journey-title"
          className="font-display text-3xl font-extrabold tracking-tight"
        >
          {companyJourneyIntro.title}
        </TitleReveal>
        <p className="mt-3 text-sm text-brand-muted">{companyJourneyIntro.lead}</p>
        <div className="mt-10">
          <HistoryTimeline entries={companyHistoryMilestones} />
        </div>
        <div className="mt-10">
          <EditorialNotice>{historicalMetricsNote}</EditorialNotice>
        </div>
      </div>
    </section>
  );
}
