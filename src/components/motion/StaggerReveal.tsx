"use client";

import { Children, type ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  step?: number;
  as?: "div" | "ul";
  itemAs?: "div" | "li" | "article";
};

export function StaggerReveal({
  children,
  className = "",
  itemClassName = "",
  step = 70,
  as = "div",
  itemAs = "div",
}: StaggerRevealProps) {
  const items = Children.toArray(children);
  const Tag = as;
  const resolvedItemAs = as === "ul" ? "li" : itemAs;

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <Reveal
          key={index}
          delay={index * step}
          className={itemClassName}
          as={resolvedItemAs}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
