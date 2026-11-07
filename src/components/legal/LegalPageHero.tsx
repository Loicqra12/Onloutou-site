import Link from "next/link";
import { LegalPrintButton } from "@/components/legal/LegalPrintButton";
import { formatLegalDateFr } from "@/content/legal";

type BreadcrumbItem = { label: string; href?: string };

type LegalPageHeroProps = {
  breadcrumb: BreadcrumbItem[];
  title: string;
  titleId?: string;
  intro: string;
  updatedAt: string;
  statusLine?: string;
  statusClassName?: string;
};

export function LegalPageHero({
  breadcrumb,
  title,
  titleId = "leg-hero-title",
  intro,
  updatedAt,
  statusLine,
  statusClassName,
}: LegalPageHeroProps) {
  return (
    <header className="leg-doc__header">
      <nav aria-label="Fil d’Ariane" className="leg-crumb">
        <ol>
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <li key={`${item.label}-${index}`}>
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {isLast || !item.href ? (
                  <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <p className="leg-doc__kicker">Informations légales</p>
      <h1 id={titleId} className="leg-doc__title font-display">
        {title}
      </h1>
      <p className="leg-doc__intro">{intro}</p>
      {statusLine ? (
        <p className={statusClassName ? `leg-doc__status ${statusClassName}` : "leg-doc__status"} role="status">
          {statusLine}
        </p>
      ) : null}
      <div className="leg-doc__meta">
        <p>
          Mis à jour le <time dateTime={updatedAt}>{formatLegalDateFr(updatedAt)}</time>
        </p>
        <LegalPrintButton />
      </div>
    </header>
  );
}
