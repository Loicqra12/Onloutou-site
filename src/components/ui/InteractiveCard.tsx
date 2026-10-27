import type { ReactNode } from "react";

/** Carte non cliquable : léger relief au survol (desktop uniquement via CSS). */
export function InteractiveCard({
  children,
  className = "",
  as = "article",
}: {
  children: ReactNode;
  className?: string;
  as?: "article" | "div";
}) {
  const Tag = as;
  return <Tag className={`interactive-card ${className}`}>{children}</Tag>;
}
