"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { footerTagline } from "@/content/home";
import { headerUtility } from "@/content/header-navigation";
import { googleReviews, site, siteLanguage, siteSocialLinks } from "@/content/site";
import { legalFooterLinks } from "@/content/legal";
import { footerExploreLinks, footerPartnerLinks, footerSolutionLinks } from "@/content/navigation";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { FooterBackToTop } from "@/components/layout/FooterBackToTop";
import { Reveal } from "@/components/motion/Reveal";
import { bindRevealObserver } from "@/components/motion/observeReveal";

function PhoneGlyph() {
  return (
    <svg className="site-footer-glyph" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M6.6 3h2.9c.5 0 .9.3 1 .8l.7 3.2c.1.4 0 .8-.3 1.1L9.4 9.6a12 12 0 0 0 5 5l1.5-1.5c.3-.3.7-.4 1.1-.3l3.2.7c.5.1.8.5.8 1v2.9c0 .8-.6 1.5-1.4 1.5C10.9 19.9 4.1 13.1 4.1 4.4 4.1 3.6 4.8 3 5.6 3h1Z"
      />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg className="site-footer-glyph" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  );
}

function SocialGlyph({ id }: { id: (typeof siteSocialLinks)[number]["id"] }) {
  const common = { viewBox: "0 0 24 24", width: 18, height: 18, "aria-hidden": true as const, focusable: false as const };
  if (id === "facebook") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7Z" />
      </svg>
    );
  }
  if (id === "linkedin") {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M6.5 9H3.7v11.2h2.8V9ZM5.1 3.2A1.7 1.7 0 1 0 5.1 6.6 1.7 1.7 0 0 0 5.1 3.2ZM20.3 20.2h-2.8v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H10.8V9h2.7v1.5h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4v6.8Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path fill="currentColor" d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm1.6.3 7.4 5.1 7.4-5.1H4.6Zm14.8 1.7-6.7 4.6a1.2 1.2 0 0 1-1.4 0L4.6 8.5V17.5h14.8V8.5Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="m12 2.8 2.4 5.7 6.2.6-4.7 4 1.4 6.1L12 16.3 6.7 19.2 8.1 13.1 3.4 9.1l6.2-.6L12 2.8Z" />
    </svg>
  );
}

function ReviewStars({ value }: { value: number }) {
  return (
    <span className="site-footer-stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span key={index} className="site-footer-star">
            <StarIcon />
            <span className="site-footer-star__fill" style={{ width: `${fill * 100}%` }}>
              <StarIcon />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function FrenchFlag() {
  return (
    <svg className="site-footer-flag" viewBox="0 0 18 12" width="18" height="12" aria-hidden="true" focusable="false">
      <rect width="6" height="12" fill="#0055A4" />
      <rect x="6" width="6" height="12" fill="#fff" />
      <rect x="12" width="6" height="12" fill="#EF4135" />
    </svg>
  );
}

function FooterColumn({ title, delay, className, children }: { title: string; delay: number; className: string; children: ReactNode }) {
  return (
    <Reveal delay={delay} className={`site-footer-col ${className}`}>
      <h2 className="site-footer-heading">{title}</h2>
      {children}
    </Reveal>
  );
}

export function SiteFooter() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    return bindRevealObserver(node);
  }, []);

  return (
    <footer ref={rootRef} data-section="footer" className="site-footer">
      <span className="site-footer-rule" aria-hidden />
      <svg className="site-footer-texture" viewBox="0 0 1200 420" aria-hidden="true" focusable="false">
        <path
          className="site-footer-route"
          pathLength="1"
          d="M-20 320 C 160 250, 280 180, 460 200 S 780 280, 1220 90"
        />
        <path
          className="site-footer-route site-footer-route--alt"
          pathLength="1"
          d="M-40 80 C 220 140, 360 240, 620 220 S 940 120, 1240 260"
        />
        <circle cx="180" cy="270" r="2.5" />
        <circle cx="460" cy="200" r="2.5" />
        <circle cx="780" cy="250" r="2.5" />
        <circle cx="1040" cy="140" r="2.5" />
      </svg>
      <div className="container-content site-footer-grid">
        <Reveal className="site-footer-brand">
          <BrandLogo theme="dark" />
          <p className="site-footer-tagline">{footerTagline}</p>
          <a href={`tel:${site.phoneTel}`} className="site-footer-line site-footer-phone">
            <PhoneGlyph />
            <span>{site.phoneDisplay}</span>
          </a>
          <p className="site-footer-line site-footer-place">
            <PinGlyph />
            <span>{headerUtility.location}</span>
          </p>
          <section className="site-footer-reviews" aria-label={googleReviews.summary}>
            <p className="site-footer-reviews__title">{googleReviews.title}</p>
            <ReviewStars value={googleReviews.score} />
            <p className="site-footer-reviews__note">
              Note {googleReviews.scoreLabel} ({googleReviews.countLabel})
            </p>
            <a className="site-footer-reviews__action" href={googleReviews.href} target="_blank" rel="noopener noreferrer">
              {googleReviews.action}
              <span className="site-footer-reviews__sr"> (s’ouvre dans un nouvel onglet)</span>
            </a>
          </section>
        </Reveal>
        <FooterColumn title="Solutions" delay={80} className="site-footer-solutions">
          <ul>
            {footerSolutionLinks.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className="site-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn title="Explorer" delay={140} className="site-footer-explore">
          <ul>
            {footerExploreLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn title="Partenaires" delay={200} className="site-footer-partners">
          <ul>
            {footerPartnerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>
        <FooterColumn title="Informations légales" delay={240} className="site-footer-legal">
          <ul>
            {legalFooterLinks.map((item) => (
              <li key={item.label}>
                {"action" in item ? (
                  <button
                    type="button"
                    className="site-footer-link site-footer-link--button"
                    onClick={() => window.dispatchEvent(new Event("onloutou-open-cookies"))}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href} className="site-footer-link">{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </FooterColumn>
      </div>
      <div className="site-footer-base">
        <div className="container-content site-footer-base-inner">
          <p>
            © {site.copyrightYear} {site.name}. Tous droits réservés.
          </p>
          <p className="site-footer-lang">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M4 5h8.2a8 8 0 0 1 0 6H8l-4 4V5Zm2 2v5.2L7.2 11H12a6 6 0 0 0 0-4H6Zm8.2 1.2h5.6L20 6.5v8.3l-1.2-1.2h-4.6a8.2 8.2 0 0 1-1.5 2.2l2.1 2.2H20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-7.2a8.2 8.2 0 0 1 1.4 2.2Z" />
            </svg>
            <span>{siteLanguage.label}</span>
            <FrenchFlag />
            <span className="site-footer-reviews__sr">{siteLanguage.current}</span>
          </p>
          <nav className="site-footer-social" aria-label="Réseaux et e-mail">
            {siteSocialLinks.map((item) => {
              const external = item.href.startsWith("http");
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="site-footer-social__link"
                  aria-label={external ? `${item.label} (s’ouvre dans un nouvel onglet)` : item.label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <SocialGlyph id={item.id} />
                </a>
              );
            })}
          </nav>
          <FooterBackToTop />
        </div>
      </div>
    </footer>
  );
}