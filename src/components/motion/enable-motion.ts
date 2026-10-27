export const MOTION_SELECTOR = ".motion-reveal, .title-reveal, .logo-band, .home-cta, .site-footer, .home-show, .home-terrain";
export const MOTION_FAILSAFE_MS = 1400;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealIfInView(element: Element) {
  const rect = element.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewHeight * 0.92 && rect.bottom > 0;
}

export function getMotionState(node: HTMLElement) {
  return node.dataset.motionState;
}

export function markMotionVisible(node: HTMLElement) {
  node.dataset.motionState = "visible";
  node.classList.add("is-revealed");
}

export function markMotionPending(node: HTMLElement) {
  if (node.dataset.motionState === "visible") return;
  node.dataset.motionState = "pending";
  node.classList.remove("is-revealed");
}

export function clearMotionPending(node: HTMLElement) {
  if (node.dataset.motionState !== "pending") return;
  delete node.dataset.motionState;
  node.classList.remove("is-revealed");
}

export function markAllRevealed() {
  document.querySelectorAll(MOTION_SELECTOR).forEach((node) => {
    markMotionVisible(node as HTMLElement);
  });
  document.documentElement.classList.add("hero-entrance-active");
}

export function activateReducedMotion() {
  document.documentElement.classList.add("motion-reduce", "hero-entrance-active");
  markAllRevealed();
  document.documentElement.classList.add("motion-ready");
}

export function activateMotionReady() {
  document.documentElement.classList.add("motion-ready");
}

export function prepareMotionTargets() {
  document.querySelectorAll(MOTION_SELECTOR).forEach((node) => {
    const element = node as HTMLElement;
    if (element.dataset.motionState === "visible") return;
    if (revealIfInView(element)) {
      markMotionVisible(element);
      return;
    }
    markMotionPending(element);
  });
}

export function revealPendingInView() {
  document.querySelectorAll(`${MOTION_SELECTOR}[data-motion-state="pending"]`).forEach((node) => {
    const element = node as HTMLElement;
    if (revealIfInView(element)) markMotionVisible(element);
  });
}
