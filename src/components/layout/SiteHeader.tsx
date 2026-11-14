"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { headerCta, headerNavigation } from "@/content/header-navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";

const DESKTOP_MIN_WIDTH = 1200;

export function SiteHeader() {
  const pathname = usePathname();

  // Remonter l'en-tête à chaque changement de route réinitialise menus et accordéons.
  return <HeaderShell key={pathname} pathname={pathname} />;
}

function HeaderShell({ pathname }: { pathname: string }) {
  const mobileNavId = useId();
  const barRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [drawerTop, setDrawerTop] = useState(96);
  const [scrolled, setScrolled] = useState(false);

  const measureDrawerTop = useCallback(() => {
    const bottom = barRef.current?.getBoundingClientRect().bottom;
    if (typeof bottom === "number") setDrawerTop(Math.round(bottom));
  }, []);

  const closeMobile = useCallback((restoreFocus = false) => {
    setMobileOpen(false);
    setExpanded([]);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    closeMobile();
  }, [closeMobile]);

  const toggleMobile = () => {
    if (mobileOpen) {
      closeMobile();
      return;
    }
    measureDrawerTop();
    setOpenMenu(null);
    setMobileOpen(true);
  };

  const toggleAccordion = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  // Échap et clic extérieur (menu mobile) ; le desktop gère les siens dans DesktopNavigation.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeMobile(true);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
        setMobileOpen(false);
        setExpanded([]);
      } else {
        setOpenMenu(null);
      }
      measureDrawerTop();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureDrawerTop]);

  // Le focus reste dans l'en-tête tant que le menu mobile est ouvert.
  const onHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!mobileOpen || event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ).filter((node) => node.offsetParent !== null || node === document.activeElement);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <header
      onKeyDown={onHeaderKeyDown}
      className={`site-header${scrolled ? " is-scrolled" : ""}${openMenu ? " is-menu-open" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
    >
      <AnnouncementBar />
      <div ref={barRef} className="site-header-bar">
        <BrandLogo theme="dark" />
        <DesktopNavigation
          pathname={pathname}
          openMenu={openMenu}
          onOpenMenu={setOpenMenu}
          onNavigate={closeAll}
        />
        <Link href={headerCta.href} className="site-header-cta" onClick={closeAll}>
          <span>{headerCta.label}</span>
          <span className="nh-arrow" aria-hidden>
            ↗
          </span>
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className="site-header-toggle"
          aria-expanded={mobileOpen}
          aria-controls={mobileNavId}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={toggleMobile}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <MobileNavigation
        id={mobileNavId}
        open={mobileOpen}
        pathname={pathname}
        expanded={expanded}
        top={drawerTop}
        onToggle={toggleAccordion}
        onClose={() => closeMobile(true)}
        onNavigate={closeAll}
      />
      <noscript>
        <nav className="site-header-noscript" aria-label="Navigation sans JavaScript">
          {headerNavigation.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/devenir-partenaire">Mettre mes articles en location</a>
          <a href="/espace-partenaire/connexion">Se connecter</a>
          <a href={headerCta.href}>{headerCta.label}</a>
        </nav>
      </noscript>
    </header>
  );
}
