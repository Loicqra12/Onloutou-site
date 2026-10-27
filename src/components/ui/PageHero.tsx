import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { TitleReveal } from "@/components/motion/TitleReveal";

type PageHeroProps = {
  breadcrumb: BreadcrumbItem[];
  title: ReactNode;
  /** Les heros institutionnels sont sur fond sombre. */
  surface?: "light" | "dark";
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function PageHero({
  breadcrumb,
  title,
  surface = "dark",
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="bg-brand-charcoal text-brand-white">
      <div className="container-content section-spacing flex min-h-[min(52vh,28rem)] flex-col justify-center">
        <Breadcrumb items={breadcrumb} />
        <TitleReveal
          as="h1"
          className={`page-hero-title max-w-3xl font-display font-extrabold tracking-tight text-balance ${
            surface === "dark" ? "text-white" : "text-brand-ink"
          }`}
        >
          {title}
        </TitleReveal>
        <p className="prose-measure mt-5 text-base leading-relaxed text-[#cccccc] sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Button href={primaryCta.href} variant="primary">
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="link-motion inline-flex min-h-11 items-center text-sm font-bold text-brand-yellow"
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
