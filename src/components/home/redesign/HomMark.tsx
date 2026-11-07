import type { ReactNode } from "react";

/**
 * Accent de titre court et choisi. Trois traitements, tous sans padding vertical hors flux :
 * - "box"  : rectangle jaune (signature du hero, un seul mot) ;
 * - "word" : mot jaune sur fond sombre ;
 * - "line" : petit trait jaune sous le mot, sur fond clair.
 * "box" et "line" sont des inline-block : leur hauteur entre dans la hauteur de ligne du titre, donc
 * le décor ne peut jamais déborder sur la ligne précédente, le paragraphe ou un bouton. À réserver à un seul mot.
 */
export type HomMarkVariant = "box" | "word" | "line";

export function HomMark({ children, variant = "line" }: { children: ReactNode; variant?: HomMarkVariant }) {
  return <span className={`hom-mark hom-mark--${variant}`}>{children}</span>;
}

/** Affiche `text` en accentuant sa fin (`mark` doit terminer `text`). Sans `mark`, le titre reste simple. */
export function HomTitle({ text, mark, variant }: { text: string; mark?: string; variant?: HomMarkVariant }) {
  if (!mark || !text.endsWith(mark)) return <>{text}</>;
  const before = text.slice(0, text.length - mark.length);
  return (
    <>
      {before}
      <HomMark variant={variant}>{mark}</HomMark>
    </>
  );
}