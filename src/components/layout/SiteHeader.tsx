"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { headerCta, headerNavigation } from "@/content/header-navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { Button } from "@/components/ui/Button";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 260;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <HeaderShell key={pathname} pathname={pathname} />
  );
}

function HeaderShell({ pathname }: { pathname: string }) {
  const mobileNavId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accordion, setAccordion] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeFamily, setActiveFamily] = useState("louer");

  const clearTimers = () => {
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const closeDesktop = (restoreFocus = false) => {
    clearTimers();
    const current = openMenu;
    setOpenMenu(null);
    if (restoreFocus && current) triggerRefs.current[current]?.focus();
  };

  const closeAll = () => {
    closeDesktop();
    setMobileOpen(false);
    setAccordion(null);
  };

  const openDesktop = (id: string) => {
    clearTimers();
    setOpenMenu(id);
    const item = headerNavigation.find((i) => i.id === id && i.type === "menu");
    if (item?.type === "menu" && item.menu.defaultVisual) {
      setActiveFamily(item.menu.defaultVisual);
    }
  };

  const onTriggerEnter = (id: string) => {
    clearTimers();
    openTimer.current = window.setTimeout(() => openDesktop(id), OPEN_DELAY);
  };

  const onTriggerLeave = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  };

  const onTriggerClick = (id: string) => {
    if (openMenu === id) closeDesktop();
    else openDesktop(id);
  };

  const onPanelEnter = () => {
    clearTimers();
  };

  const onPanelLeave = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenu) {
        clearTimers();
        setOpenMenu(null);
        triggerRefs.current[openMenu]?.focus();
      } else if (mobileOpen) {
        setMobileOpen(false);
        setAccordion(null);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu, mobileOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || headerRef.current?.contains(target)) return;
      clearTimers();
      setOpenMenu(null);
      setMobileOpen(false);
      setAccordion(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (y > 24 ? true : y < 8 ? false : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1200) {
        setMobileOpen(false);
        setAccordion(null);
      } else {
        setOpenMenu(null);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const compact = scrolled && !openMenu && !mobileOpen;

  return (
    <header
      ref={headerRef}
      className={`site-header${compact ? " is-scrolled" : ""}${openMenu ? " is-menu-open" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
    >
      <AnnouncementBar />
      <div className="site-header-bar">
        <BrandLogo theme="dark" />
        <DesktopNavigation
          pathname={pathname}
          openMenu={openMenu}
          activeFamily={activeFamily}
          triggerRefs={triggerRefs}
          onTriggerEnter={onTriggerEnter}
          onTriggerLeave={onTriggerLeave}
          onTriggerClick={onTriggerClick}
          onPanelEnter={onPanelEnter}
          onPanelLeave={onPanelLeave}
          onFamilyChange={setActiveFamily}
          onNavigate={closeAll}
        />
        <Button href={headerCta.href} variant="primary" className="site-header-cta">
          {headerCta.label}
          <span className="btn-arrow" aria-hidden>
            ↗
          </span>
        </Button>
        <button
          ref={menuButtonRef}
          type="button"
          className="site-header-toggle"
          aria-expanded={mobileOpen}
          aria-controls={mobileNavId}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => {
            setMobileOpen((value) => !value);
            setAccordion(null);
          }}
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
        accordion={accordion}
        onAccordion={setAccordion}
        onNavigate={closeAll}
      />
      <noscript>
        <nav className="site-header-noscript" aria-label="Navigation sans JavaScript">
          {headerNavigation.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={headerCta.href}>{headerCta.label}</a>
        </nav>
      </noscript>
    </header>
  );
}
