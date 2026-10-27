import type { ReactNode } from "react";

type HighlightedTextProps = {
  children: ReactNode;
  variant?: "marker" | "underline" | "accent";
  surface?: "light" | "dark";
  /** @deprecated Préférer `surface`. `on-dark` force un soulignement blanc. */
  tone?: "on-light" | "on-dark";
  className?: string;
};

export function HighlightedText({
  children,
  variant,
  surface,
  tone,
  className = "",
}: HighlightedTextProps) {
  const resolvedSurface = surface ?? (tone === "on-dark" ? "dark" : "light");
  const resolvedVariant =
    variant ?? (resolvedSurface === "dark" ? "underline" : "accent");

  if (resolvedVariant === "accent") {
    return (
      <span
        className={`highlight-accent highlight-accent--${resolvedSurface} ${className}`.trim()}
      >
        {children}
      </span>
    );
  }

  if (resolvedVariant === "underline") {
    return (
      <span
        className={`highlight-underline highlight-underline--${resolvedSurface} ${className}`.trim()}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={`highlight-marker ${className}`.trim()}>
      <span className="highlight-marker__ink" aria-hidden />
      <span className="highlight-marker__text">{children}</span>
    </span>
  );
}
