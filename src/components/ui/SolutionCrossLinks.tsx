import Link from "next/link";
import { detailedSolutionPages } from "@/content/solutions-hub";

export function SolutionCrossLinks({ currentHref }: { currentHref: string }) {
  const links = detailedSolutionPages.filter((page) => page.href !== currentHref);
  return (
    <section className="section-spacing border-t border-brand-border bg-brand-paper">
      <div className="container-content">
        <h2 className="font-display text-2xl font-extrabold">Autres solutions</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="block rounded-[var(--radius-card)] border border-brand-border bg-brand-white px-4 py-3 text-sm font-semibold hover:border-brand-yellow"
              >
                <span className="block text-[10px] font-bold uppercase text-brand-muted">
                  {page.universe}
                </span>
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
