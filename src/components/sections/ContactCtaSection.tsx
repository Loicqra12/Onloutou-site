"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { contactCta } from "@/content/home";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { bindRevealObserver } from "@/components/motion/observeReveal";

function WhatsAppIcon() {
  return (
    <svg className="home-cta-wa" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2c-5.46 0-9.9 4.42-9.9 9.88 0 1.74.46 3.44 1.32 4.94L2 22l5.3-1.39a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.42 9.9-9.88C22 6.42 17.5 2 12.04 2Zm5.76 14.16c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.78-4.18-4.93-4.38-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1.01-2.41.26-.28.58-.35.77-.35h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.14.31-.28.48-.14.16-.3.37-.42.5-.14.14-.29.29-.12.56.16.28.73 1.2 1.56 1.95 1.07.96 1.97 1.26 2.25 1.4.28.14.44.12.6-.07.16-.2.7-.81.88-1.09.18-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z"
      />
    </svg>
  );
}

export function ContactCtaSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      data-section="contact-cta"
      className="home-cta"
      aria-labelledby="home-cta-title"
    >
      <svg className="home-cta-texture" viewBox="0 0 1200 520" aria-hidden="true" focusable="false">
        <g className="home-cta-dots">
          <circle cx="80" cy="90" r="3" />
          <circle cx="210" cy="160" r="2.5" />
          <circle cx="360" cy="70" r="2" />
          <circle cx="520" cy="210" r="3" />
          <circle cx="740" cy="120" r="2.5" />
          <circle cx="910" cy="250" r="3" />
          <circle cx="1080" cy="80" r="2" />
          <circle cx="160" cy="380" r="2.5" />
          <circle cx="430" cy="430" r="3" />
          <circle cx="680" cy="390" r="2" />
          <circle cx="980" cy="440" r="3" />
        </g>
        <path
          className="home-cta-route"
          pathLength="1"
          d="M40 420 C 180 360, 260 280, 390 250 S 620 220, 760 160 S 980 70, 1160 110"
        />
        <path
          className="home-cta-route home-cta-route--alt"
          pathLength="1"
          d="M90 80 C 240 140, 300 240, 480 300 S 760 360, 1120 390"
        />
      </svg>
      <div className="container-content home-cta-grid">
        <div className="home-cta-copy">
          <Reveal>
            <p className="home-cta-eyebrow">
              <span className="home-cta-eyebrow-line" aria-hidden />
              {contactCta.eyebrow}
            </p>
          </Reveal>
          <h2 id="home-cta-title" className="home-cta-title">
            <Reveal as="span" delay={80} className="home-cta-title-line">
              {contactCta.title}
            </Reveal>
            <Reveal as="span" delay={160} className="home-cta-title-line">
              {contactCta.titleLine2}
            </Reveal>
          </h2>
          <Reveal delay={260}>
            <p className="home-cta-lead">{contactCta.description}</p>
          </Reveal>
        </div>
        <Reveal delay={340} className="home-cta-actions">
          <Link href="/contact" className="home-cta-primary">
            {contactCta.primaryLabel}
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
          <a
            href={site.whatsappUrl}
            className="home-cta-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            {contactCta.whatsappLabel}
            <span className="btn-arrow" aria-hidden>
              ↗
            </span>
          </a>
          <a href={`tel:${site.phoneTel}`} className="home-cta-phone">
            {site.phoneDisplay}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
