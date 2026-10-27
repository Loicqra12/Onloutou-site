import Link from "next/link";

export type LegalRelatedLink = {
  href: string;
  label: string;
};

type LegalRelatedDocumentsProps = {
  title?: string;
  links: LegalRelatedLink[];
  currentPath?: string;
};

export function LegalRelatedDocuments({
  title = "Documents associés",
  links,
  currentPath,
}: LegalRelatedDocumentsProps) {
  const items = links.filter((link) => link.href !== currentPath);

  if (items.length === 0) return null;

  return (
    <nav className="leg-related" aria-label={title}>
      <p className="leg-related__title">{title}</p>
      <ul className="leg-related__list">
        {items.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="leg-related__link link-motion">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
