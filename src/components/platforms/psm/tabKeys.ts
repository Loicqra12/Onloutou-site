import type { KeyboardEvent } from "react";

/** Navigation clavier d’une liste d’onglets (flèches, Début, Fin). */
export function onTabKeyDown(
  event: KeyboardEvent<HTMLElement>,
  index: number,
  count: number,
  select: (next: number) => void,
  idOf: (i: number) => string,
  orientation: "horizontal" | "vertical" | "both" = "horizontal",
) {
  const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
  const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
  let target = -1;
  if (event.key === next || (orientation === "both" && (event.key === "ArrowRight" || event.key === "ArrowDown"))) {
    target = (index + 1) % count;
  } else if (event.key === prev || (orientation === "both" && (event.key === "ArrowLeft" || event.key === "ArrowUp"))) {
    target = (index - 1 + count) % count;
  } else if (event.key === "Home") target = 0;
  else if (event.key === "End") target = count - 1;
  if (target < 0) return;
  event.preventDefault();
  select(target);
  document.getElementById(idOf(target))?.focus();
}
