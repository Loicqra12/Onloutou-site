"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { bindTitleRevealObserver } from "@/components/motion/observeReveal";

type TitleRevealProps = {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "div";
  id?: string;
};

export function TitleReveal({ children, className = "", as = "div", id }: TitleRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    return bindTitleRevealObserver(node);
  }, []);

  const Tag = as;

  return (
    <Tag ref={ref as never} id={id} className={`title-reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
