"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { footerTagline } from "@/content/home";
import { site } from "@/content/site";
import { legalFooterLinks } from "@/content/legal";
import { footerCompanyLinks, footerSolutionLinks } from "@/content/navigation";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { FooterBackToTop } from "@/components/layout/FooterBackToTop";
import { Reveal } from "@/components/motion/Reveal";
import { bindRevealObserver } from "@/components/motion/observeReveal";

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
          <p className="site-footer-place">{site.location}</p>
        </Reveal>
        <Reveal delay={80} className="site-footer-contact">
          <h2 className="site-footer-heading">Contact</h2>
          <a href={`tel:${site.phoneTel}`} className="site-footer-phone">
            {site.phoneDisplay}
          </a>
          <a
            href={site.whatsappUrl}
            className="site-footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Écrire sur WhatsApp
          </a>
          <Link href="/contact" className="site-footer-link">
            Formulaire de contact
          </Link>
          <p className="site-footer-place">{site.location}</p>
        </Reveal>
        <Reveal delay={140} className="site-footer-solutions">
          <h2 className="site-footer-heading">Solutions</h2>
          <ul>
            {footerSolutionLinks.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className="site-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={200} className="site-footer-company">
          <h2 className="site-footer-heading">Entreprise</h2>
          <ul>
            {footerCompanyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={240} className="site-footer-legal">
          <h2 className="site-footer-heading">Informations légales</h2>
          <ul>
            {legalFooterLinks.map((item) => (
              <li key={item.label}>
                {item.enabled && item.href ? (
                  <Link href={item.href} className="site-footer-link">{item.label}</Link>
                ) : (
                  <span className="site-footer-link site-footer-link--disabled" aria-disabled="true">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <div className="site-footer-base">
        <div className="container-content site-footer-base-inner">
          <p>
            © {site.copyrightYear} {site.name}. Tous droits réservés.
          </p>
          <p>
            {site.name} · {site.location}
          </p>
          <FooterBackToTop />
        </div>
      </div>
    </footer>
  );
}
