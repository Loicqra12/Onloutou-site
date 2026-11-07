"use client";

import type { ReactNode } from "react";
import { scrollToId } from "./TemContext";

export function TemLink({ target, className, children }: { target: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(target);
      }}
    >
      {children}
    </a>
  );
}
