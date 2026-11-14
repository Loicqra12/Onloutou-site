"use client";

import { useEffect, useState } from "react";

/** Raccourcit un placeholder sous une largeur donnée, sans changer le cadre du champ. */
export function useResponsivePlaceholder(
  full: string,
  short: string | undefined,
  query = "(max-width: 420px)",
): string {
  const compact = short && short.length > 0 ? short : full;
  const [value, setValue] = useState(full);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setValue(mq.matches ? compact : full);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [full, compact, query]);

  return value;
}
