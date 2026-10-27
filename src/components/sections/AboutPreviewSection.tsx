"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { bindRevealObserver } from "@/components/motion/observeReveal";
import { prefersReducedMotion } from "@/components/motion/enable-motion";
import { metrics, metricsDisclaimer } from "@/content/home";
import { homeMedia, siteMedia } from "@/content/media";

/* ── Photo mosaic ─────────────────────────────────────────────────── */

const PHOTOS = [
  {
    id: "facade",
    ...homeMedia.about.facade,
    objectPosition: "center 52%",
    sizes: "(min-width: 1024px) 38vw, 100vw",
  },
  {
    id: "equipe",
    ...homeMedia.about.team,
    objectPosition: "center 18%",
    sizes: "(min-width: 1024px) 20vw, 48vw",
  },
  {
    id: "stand",
    ...siteMedia.about.standExposition,
    objectPosition: "center 30%",
    sizes: "(min-width: 1024px) 28vw, 52vw",
  },
] as const;

/* ── Metric counter helpers ───────────────────────────────────────── */

type ParsedMetric = { start: number; end: number; suffix: string };

function parseMetric(value: string): ParsedMetric {
  const clean = value.replace(/\s/g, "");
  if (clean === "2016") return { start: 2012, end: 2016, suffix: "" };
  const suffix = clean.replace(/\d/g, "");
  const num = parseInt(clean.replace(/\D/g, ""), 10);
  return { start: 0, end: isNaN(num) ? 0 : num, suffix };
}

function formatCount(n: number, suffix: string): string {
  if (n >= 1000) {
    const k = Math.floor(n / 1000);
    const r = String(n % 1000).padStart(3, "0");
    return `${k}\u00a0${r}${suffix}`;
  }
  return `${n}${suffix}`;
}

function animateCounter(el: HTMLElement, parsed: ParsedMetric, delay = 0): void {
  if (prefersReducedMotion()) {
    el.textContent = formatCount(parsed.end, parsed.suffix);
    return;
  }
  const { start, end, suffix } = parsed;
  const duration = 1400;

  setTimeout(() => {
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatCount(Math.round(start + (end - start) * eased), suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, delay);
}

/* ── Component ────────────────────────────────────────────────────── */

export function AboutPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterEls = useRef<(HTMLElement | null)[]>([]);
  const countersRan = useRef(false);

  /* Motion reveal */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  /* Counter animation — fires once when metrics enter viewport */
  useEffect(() => {
    const els = counterEls.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const container = els[0].closest("[data-section='company']");
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || countersRan.current) return;
        countersRan.current = true;
        observer.disconnect();
        els.forEach((el, i) => {
          animateCounter(el, parseMetric(metrics[i]?.value ?? "0"), i * 140);
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      data-section="company"
      className="home-about"
      aria-labelledby="home-about-title"
    >
      <div className="home-about-inner">
        {/* ── Photo mosaic ── */}
        <div className="home-about-mosaic" aria-hidden="true">
          {PHOTOS.map((photo, i) => (
            <div key={photo.id} className={`home-about-cell home-about-cell--${i + 1}`}>
              {/* Golden blade curtain — only visible when motion is active */}
              <span className="home-about-curtain" />
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={photo.sizes}
                className="home-about-image"
                style={{ objectPosition: photo.objectPosition }}
              />
            </div>
          ))}
        </div>

        {/* ── Editorial content ── */}
        <div className="home-about-content">
          <p className="home-about-eyebrow">07 · L&apos;entreprise</p>

          <h2 id="home-about-title" className="home-about-heading">
            Une présence ancrée dans les opérations
          </h2>

          <p className="home-about-lead">
            Une équipe et un écosystème de compétences mobilisés selon les besoins des projets, depuis Abidjan.
          </p>

          {/* Metrics */}
          <div className="home-about-metrics" aria-label="Repères ONLOUTOU">
            {metrics.map((m, i) => (
              <div key={m.label} className="home-about-metric">
                <span
                  className="home-about-metric-value"
                  ref={(el) => {
                    counterEls.current[i] = el;
                  }}
                  aria-label={`${m.value} — ${m.label}`}
                >
                  {m.value}
                </span>
                <span className="home-about-metric-sep" aria-hidden />
                <span className="home-about-metric-label" aria-hidden>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <p className="home-about-disclaimer">{metricsDisclaimer}</p>

          <Link href="/a-propos" className="home-about-link">
            <span className="home-about-link-text">Lire notre histoire</span>
            <span className="home-about-link-arrow" aria-hidden>
              ↗
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
