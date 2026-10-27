"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import { headerNavigation, isNavActive } from "@/content/header-navigation";
import { MegaMenu } from "@/components/navigation/MegaMenu";

type DesktopNavigationProps = {
  pathname: string;
  openMenu: string | null;
  activeFamily: string;
  triggerRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onTriggerEnter: (id: string) => void;
  onTriggerLeave: () => void;
  onTriggerClick: (id: string) => void;
  onPanelEnter: () => void;
  onPanelLeave: () => void;
  onFamilyChange: (id: string) => void;
  onNavigate: () => void;
};

export function DesktopNavigation({
  pathname,
  openMenu,
  activeFamily,
  triggerRefs,
  onTriggerEnter,
  onTriggerLeave,
  onTriggerClick,
  onPanelEnter,
  onPanelLeave,
  onFamilyChange,
  onNavigate,
}: DesktopNavigationProps) {
  return (
    <nav className="site-nav-desktop" aria-label="Navigation principale">
      <ul className="site-nav-list">
        {headerNavigation.map((item) => {
          if (item.type === "link") {
            const active = isNavActive(pathname, item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`site-nav-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const active = isNavActive(pathname, item.href);
          const expanded = openMenu === item.id;
          const panelId = `mega-${item.id}`;

          return (
            <li key={item.id} className="site-nav-item">
              <button
                type="button"
                ref={(node) => {
                  triggerRefs.current[item.id] = node;
                }}
                className={`site-nav-trigger${active ? " is-active" : ""}${expanded ? " is-open" : ""}`}
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-label={`${item.label}, ouvrir le menu`}
                onPointerEnter={() => onTriggerEnter(item.id)}
                onPointerLeave={onTriggerLeave}
                onFocus={() => onTriggerEnter(item.id)}
                onClick={() => onTriggerClick(item.id)}
              >
                <span>{item.label}</span>
                <span className={`site-nav-chevron${expanded ? " is-open" : ""}`} aria-hidden>
                  ▾
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {headerNavigation.map((item) =>
        item.type === "menu" ? (
          <MegaMenu
            key={item.id}
            menu={item.menu}
            panelId={`mega-${item.id}`}
            open={openMenu === item.id}
            activeFamily={activeFamily}
            onFamilyChange={onFamilyChange}
            onNavigate={onNavigate}
            onPointerEnter={onPanelEnter}
            onPointerLeave={onPanelLeave}
          />
        ) : null,
      )}
    </nav>
  );
}
