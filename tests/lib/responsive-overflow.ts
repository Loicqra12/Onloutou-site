/** Conteneurs autorisés à dépasser en largeur avec scroll interne (voir docs/responsive/route-inventory.md). */
export const HORIZONTAL_SCROLL_EXEMPT_SELECTORS = [
  ".leg-table-wrap",
  ".home-terrain-strip",
  ".home-show-track",
  ".epp-preview__nav ul",
  ".epp-products__table-wrap",
  ".epp-matrix__wrap",
  ".edl-matrix__wrap",
  ".hlp-nav",
  ".hlp-nav__list",
  ".sales-compare__table-wrap",
];

export type OverflowReport = {
  docScrollWidth: number;
  innerWidth: number;
  globalOverflow: boolean;
  offenders: Array<{
    tag: string;
    className: string;
    left: number;
    right: number;
    width: number;
  }>;
};

export async function evaluatePageOverflow(
  page: import("@playwright/test").Page,
): Promise<OverflowReport> {
  const exempt = HORIZONTAL_SCROLL_EXEMPT_SELECTORS;
  return page.evaluate((exemptSelectors) => {
    const innerWidth = window.innerWidth;
    const docScrollWidth = document.documentElement.scrollWidth;
    const globalOverflow = docScrollWidth > innerWidth + 1;

    const isInsideExempt = (el: Element | null) => {
      while (el) {
        for (const sel of exemptSelectors) {
          if (el.matches(sel)) return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const offenders: OverflowReport["offenders"] = [];
    const nodes = document.querySelectorAll("body *");

    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.offsetParent === null && getComputedStyle(node).position !== "fixed") continue;
      if (isInsideExempt(node)) continue;

      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;

      const style = getComputedStyle(node);
      if (style.visibility === "hidden" || style.display === "none") continue;

      const overflowsLeft = rect.left < -1;
      const overflowsRight = rect.right > innerWidth + 1;
      const widerThanViewport = rect.width > innerWidth + 1;

      if (overflowsLeft || overflowsRight || widerThanViewport) {
        offenders.push({
          tag: node.tagName.toLowerCase(),
          className: (node.className || "").toString().slice(0, 120),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
      }
    }

    offenders.sort((a, b) => b.width - a.width);
    return {
      docScrollWidth,
      innerWidth,
      globalOverflow,
      offenders: offenders.slice(0, 12),
    };
  }, exempt);
}
