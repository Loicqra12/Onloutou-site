import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-[#aaaaaa]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden className="text-[#666666]">/</span>}
              {isLast || !item.href ? (
                <span className={isLast ? "font-semibold text-brand-yellow" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="-my-2 inline-block py-2 hover:text-brand-yellow">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
