"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { headerNavigation, isNavActive } from "@/content/header-navigation";
import { MegaMenu } from "@/components/navigation/MegaMenu";

const OPEN_DELAY = 110;
const SWITCH_DELAY = 70;
const CLOSE_DELAY = 220;

type DesktopNavigationProps = {
  pathname: string;
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onNavigate: () => void;
};

function Chevron() {
  return (
    <svg className="site-nav-chevron" viewBox="0 0 10 10" fill="none" aria-hidden focusable="false">
      <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Navigation principale (≥ 1200 px).
 * Souris : survol avec courte temporisation. Clavier : Entrée / Espace / ↓ ouvrent,
 * ← → parcourent la barre, ↑ ↓ parcourent le panneau, Échap ferme et rend le focus au bouton.
 */
export function DesktopNavigation({ pathname, openMenu, onOpenMenu, onNavigate }: DesktopNavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<number | null>(null);
  const pointerType = useRef<string>("mouse");

  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!openMenu) return;

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      clearTimer();
      onOpenMenu(null);
      const trigger = navRef.current?.querySelector<HTMLElement>(`[aria-controls="mega-${openMenu}"]`);
      const active = document.activeElement;
      if (trigger && (!active || active === document.body || navRef.current?.contains(active))) {
        trigger.focus();
      }
    };

    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;
      if (target && navRef.current?.contains(target)) return;
      clearTimer();
      onOpenMenu(null);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu, onOpenMenu]);

  const scheduleOpen = (id: string | null, event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    const delay = id === null ? CLOSE_DELAY : openMenu ? SWITCH_DELAY : OPEN_DELAY;
    timer.current = window.setTimeout(() => onOpenMenu(id), delay);
  };

  const scheduleClose = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    timer.current = window.setTimeout(() => onOpenMenu(null), CLOSE_DELAY);
  };

  const onTriggerClick = (id: string, event: MouseEvent) => {
    clearTimer();
    // Un clic souris sur un menu ouvert au survol le garde ouvert ; tactile et clavier basculent.
    if (event.detail > 0 && pointerType.current === "mouse") {
      onOpenMenu(id);
      return;
    }
    onOpenMenu(openMenu === id ? null : id);
  };

  const focusFirstLink = (id: string) => {
    window.requestAnimationFrame(() => {
      navRef.current?.querySelector<HTMLElement>(`#mega-${id} a[href]`)?.focus();
    });
  };

  const onItemBlur = (id: string, event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null;
    if (openMenu === id && next && !event.currentTarget.contains(next)) onOpenMenu(null);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const target = event.target as HTMLElement;
    const panel = target.closest<HTMLElement>(".mega-panel");

    if (panel) {
      const links = Array.from(panel.querySelectorAll<HTMLElement>("a[href]"));
      const index = links.indexOf(target);
      if (index === -1) return;
      let next: number | null = null;
      if (event.key === "ArrowDown") next = (index + 1) % links.length;
      else if (event.key === "ArrowUp") next = (index - 1 + links.length) % links.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = links.length - 1;
      if (next !== null) {
        event.preventDefault();
        links[next]?.focus();
      }
      return;
    }

    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(".site-nav-control"),
    );
    const index = controls.indexOf(target);
    if (index === -1) return;

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      controls[(index + step + controls.length) % controls.length]?.focus();
    } else if (event.key === "ArrowDown" && target.hasAttribute("aria-controls")) {
      event.preventDefault();
      const id = target.getAttribute("aria-controls")?.replace(/^mega-/, "");
      if (id) {
        clearTimer();
        onOpenMenu(id);
        focusFirstLink(id);
      }
    }
  };

  return (
    <nav ref={navRef} className="site-nav-desktop" aria-label="Navigation principale">
      <ul className="site-nav-list" onKeyDown={onListKeyDown} onPointerDown={(e) => {
          pointerType.current = e.pointerType;
        }}>
        {headerNavigation.map((item) => {
          const current = isNavActive(pathname, item.href);

          if (item.type === "link") {
            return (
              <li key={item.id} className="site-nav-item" onPointerEnter={(e) => scheduleOpen(null, e)}>
                <Link
                  href={item.href}
                  className={`site-nav-control site-nav-link${current ? " is-current" : ""}`}
                  aria-current={current ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const expanded = openMenu === item.id;
          const panelId = `mega-${item.id}`;

          return (
            <li
              key={item.id}
              className="site-nav-item"
              onPointerEnter={(e) => scheduleOpen(item.id, e)}
              onPointerLeave={scheduleClose}
              onBlur={(e) => onItemBlur(item.id, e)}
            >
              <button
                type="button"
                className={`site-nav-control site-nav-trigger${current ? " is-current" : ""}${expanded ? " is-open" : ""}`}
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-current={current ? "page" : undefined}
                onClick={(e) => onTriggerClick(item.id, e)}
              >
                <span>{item.label}</span>
                <Chevron />
              </button>
              <MegaMenu
                menu={item.menu}
                panelId={panelId}
                open={expanded}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
