"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { bindRevealObserver } from "@/components/motion/observeReveal";

type RevealElement = "div" | "section" | "li" | "article" | "span" | "p" | "h2";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealElement;
};

export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={`motion-reveal ${className}`.trim()}
      style={{ "--motion-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
