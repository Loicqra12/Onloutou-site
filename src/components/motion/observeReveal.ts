import {
  clearMotionPending,
  getMotionState,
  markMotionPending,
  markMotionVisible,
  MOTION_FAILSAFE_MS,
  prefersReducedMotion,
  revealIfInView,
} from "@/components/motion/enable-motion";

const REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: "0px 0px -6% 0px",
};

const TITLE_REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.2,
  rootMargin: "0px 0px -5% 0px",
};

type ObserverBucket = {
  observer: IntersectionObserver;
  nodes: Map<Element, { failsafe: number }>;
};

const buckets = new Map<string, ObserverBucket>();

function bucketKey(options: IntersectionObserverInit) {
  return JSON.stringify(options);
}

function getBucket(options: IntersectionObserverInit): ObserverBucket {
  const key = bucketKey(options);
  let bucket = buckets.get(key);
  if (!bucket) {
    const nodes = new Map<Element, { failsafe: number }>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const node = entry.target as HTMLElement;
        const meta = nodes.get(node);
        if (!meta) continue;
        window.clearTimeout(meta.failsafe);
        nodes.delete(node);
        observer.unobserve(node);
        markMotionVisible(node);
      }
    }, options);
    bucket = { observer, nodes };
    buckets.set(key, bucket);
  }
  return bucket;
}

function observeWithShared(node: HTMLElement, options: IntersectionObserverInit) {
  const bucket = getBucket(options);
  const failsafe = window.setTimeout(() => {
    if (getMotionState(node) === "visible") return;
    bucket.nodes.delete(node);
    bucket.observer.unobserve(node);
    markMotionVisible(node);
  }, MOTION_FAILSAFE_MS);

  bucket.nodes.set(node, { failsafe });
  bucket.observer.observe(node);

  return () => {
    const meta = bucket.nodes.get(node);
    if (meta) {
      window.clearTimeout(meta.failsafe);
      bucket.nodes.delete(node);
    }
    bucket.observer.unobserve(node);
    clearMotionPending(node);
  };
}

export function bindRevealObserver(
  node: HTMLElement,
  options: IntersectionObserverInit = REVEAL_OPTIONS,
) {
  if (prefersReducedMotion()) {
    markMotionVisible(node);
    return () => undefined;
  }

  if (getMotionState(node) === "visible") {
    return () => undefined;
  }

  if (revealIfInView(node)) {
    markMotionVisible(node);
    return () => undefined;
  }

  markMotionPending(node);
  return observeWithShared(node, options);
}

export function bindTitleRevealObserver(node: HTMLElement) {
  return bindRevealObserver(node, TITLE_REVEAL_OPTIONS);
}
