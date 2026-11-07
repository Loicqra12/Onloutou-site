import { LegalPageHero } from "@/components/legal/LegalPageHero";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";

type BreadcrumbItem = { label: string; href?: string };
type TocSection = { id: string; title: string };

type LegalDocumentProps = {
  breadcrumb: BreadcrumbItem[];
  title: string;
  intro: string;
  updatedAt: string;
  sections: readonly TocSection[];
  tocLabel: string;
  statusLine?: string;
  statusClassName?: string;
  children: React.ReactNode;
};

export function LegalDocument({
  breadcrumb,
  title,
  intro,
  updatedAt,
  sections,
  tocLabel,
  statusLine,
  statusClassName,
  children,
}: LegalDocumentProps) {
  return (
    <article className="leg-doc">
      <div className="leg-doc__inner">
        <LegalPageHero
          breadcrumb={breadcrumb}
          title={title}
          intro={intro}
          updatedAt={updatedAt}
          statusLine={statusLine}
          statusClassName={statusClassName}
        />
        <div className="leg-layout__grid">
          <LegalTableOfContents sections={sections} ariaLabel={tocLabel} />
          <div className="leg-content">
            {children}
            <p className="leg-back">
              <a href="#leg-hero-title">Retour en haut</a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
