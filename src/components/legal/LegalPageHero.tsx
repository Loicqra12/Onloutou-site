import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LegalDocumentStatus } from "@/components/legal/LegalDocumentStatus";
import type { LegalDocumentStatus as LegalDocumentStatusType } from "@/types/legal";

type BreadcrumbItem = { label: string; href?: string };

type LegalPageHeroProps = {
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  titleId?: string;
  intro: string;
  status: LegalDocumentStatusType;
  statusBanner: { title: string; lead: string };
};

export function LegalPageHero({
  breadcrumb,
  eyebrow,
  title,
  titleId = "leg-hero-title",
  intro,
  status,
  statusBanner,
}: LegalPageHeroProps) {
  return (
    <header className="leg-hero bg-brand-charcoal text-brand-white">
      <div className="leg-hero__inner container-content">
        <Breadcrumb items={breadcrumb} />
        <p className="partners-eyebrow">{eyebrow}</p>
        <h1 id={titleId} className="leg-hero__title font-display font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="leg-hero__intro">{intro}</p>
        <LegalDocumentStatus status={status} banner={statusBanner} />
      </div>
    </header>
  );
}
