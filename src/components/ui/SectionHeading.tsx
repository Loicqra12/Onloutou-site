import type { ReactNode } from "react";
import { TitleReveal } from "@/components/motion/TitleReveal";

type SectionHeadingProps = {
  number?: string;
  eyebrow?: string;
  title: ReactNode;
  titleHighlight?: string;
  markerHighlight?: string;
  description?: string;
  light?: boolean;
  compact?: boolean;
};

export function SectionHeading({
  number,
  eyebrow,
  title,
  titleHighlight,
  markerHighlight,
  description,
  light = false,
  compact = false,
}: SectionHeadingProps) {
  const continuation = markerHighlight || titleHighlight;

  return (
    <div
      className={`mb-10 grid gap-5 md:mb-14 ${
        compact
          ? "md:grid-cols-[auto_1fr]"
          : "lg:grid-cols-[180px_1fr_minmax(0,330px)] lg:items-end"
      }`}
    >
      {(number || eyebrow) && (
        <div className="flex items-center gap-3">
          {number && (
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border font-display text-[11px] font-extrabold ${
                light
                  ? "border-[#4c4c4c] text-[#9b9b9b]"
                  : "border-brand-border text-brand-muted"
              }`}
            >
              {number}
            </span>
          )}
          {eyebrow && (
            <span
              className={`text-[11px] font-extrabold uppercase tracking-[0.16em] ${
                light ? "text-[#bdbdbd]" : "text-brand-muted"
              }`}
            >
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <TitleReveal
        as="h2"
        className={`font-display text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl lg:col-start-2 ${
          light ? "text-white" : "text-brand-ink"
        }`}
      >
        {title}
        {continuation && (
          <>
            <br />
            <span
              className={
                light
                  ? "font-extrabold text-brand-yellow"
                  : "font-extrabold text-brand-ink/85"
              }
            >
              {continuation}
            </span>
          </>
        )}
      </TitleReveal>
      {description && (
        <p
          className={`text-[15px] leading-relaxed lg:col-start-3 lg:row-start-1 lg:row-end-3 lg:self-end ${
            light ? "text-[#aaaaaa]" : "text-brand-muted"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
