import Link from "next/link";

export function PrdCrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Fil d’Ariane">
      <ol className="prd-crumb">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 ? <span className="prd-crumb__sep">/</span> : null}
            {item.href && index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
