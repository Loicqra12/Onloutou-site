import Link from "next/link";

type SolutionCompanionLinkProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export function SolutionCompanionLink({ title, description, href, linkLabel }: SolutionCompanionLinkProps) {
  return (
    <section className="section-spacing border-t border-brand-border bg-brand-paper" aria-labelledby="solution-companion-title">
      <div className="container-content max-w-3xl">
        <h2 id="solution-companion-title" className="font-display text-xl font-extrabold">{title}</h2>
        <p className="mt-3 text-sm text-brand-muted">
          {description}{" "}
          <Link href={href} className="font-bold text-brand-yellow link-motion">
            {linkLabel} ↗
          </Link>
        </p>
      </div>
    </section>
  );
}
