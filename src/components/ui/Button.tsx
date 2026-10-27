import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "dark" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-yellow text-brand-ink border border-brand-yellow hover:bg-brand-yellow-hover",
  dark: "bg-brand-ink text-brand-white border border-brand-ink hover:bg-[#292929]",
  outline:
    "bg-transparent text-brand-ink border border-brand-border hover:border-brand-ink",
};

type SharedProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = SharedProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type LinkButtonProps = SharedProps &
  ComponentPropsWithoutRef<typeof Link> & { href: string };

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps | LinkButtonProps) {
  const motion =
    variant === "primary"
      ? "btn-motion-primary"
      : variant === "dark"
        ? "btn-motion-dark"
        : "";

  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-bold transition-colors active:scale-[0.98]";

  const classes = `${base} ${variants[variant]} ${motion} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as LinkButtonProps;
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
