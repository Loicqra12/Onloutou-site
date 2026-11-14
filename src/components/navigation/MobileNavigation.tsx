"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { headerCta, headerNavigation, isNavActive } from "@/content/header-navigation";
import { HeaderAccessLinks } from "@/components/partners/HeaderAccessLinks";
import { NavIcon } from "@/components/navigation/NavIcon";
import type { MegaMenuConfig, NavGroup, NavIconId } from "@/types/navigation";

type MobileNavigationProps = {
  id: string;
  open: boolean;
  pathname: string;
  /** Identifiants des accordéons ouverts (plusieurs possibles). */
  expanded: string[];
  /** Distance (px) entre le haut du viewport et le bas de la barre principale. */
  top: number;
  onToggle: (id: string) => void;
  onClose: () => void;
  onNavigate: () => void;
};

type MobileSection = {
  key: string;
  title?: string;
  nodes: ReactNode[];
};

function Chevron() {
  return (
    <svg className="site-nav-chevron" viewBox="0 0 10 10" fill="none" aria-hidden focusable="false">
      <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Aplatit un méga-menu en sections de liens pour le mobile.
 * Un même lien (href) n'apparaît qu'une seule fois dans l'accordéon.
 */
function buildSections(
  menu: MegaMenuConfig,
  pathname: string,
  onNavigate: () => void,
): MobileSection[] {
  const seen = new Set<string>();
  const sections: MobileSection[] = [];

  const link = (
    key: string,
    label: string,
    href: string,
    options: { cta?: boolean; badge?: string; iconId?: NavIconId; yellow?: boolean } = {},
  ) => {
    if (seen.has(href)) return null;
    seen.add(href);
    return (
      <li key={key}>
        <Link
          href={href}
          prefetch={false}
          className={`site-mobile-sublink${options.cta ? " is-cta" : ""}${options.yellow ? " is-yellow" : ""}${options.iconId ? " has-icon" : ""}`}
          aria-current={!href.includes("#") && href === pathname ? "page" : undefined}
          onClick={onNavigate}
        >
          {options.iconId ? <NavIcon id={options.iconId} className="site-mobile-subicon" /> : null}
          <span>{label}</span>
          {options.badge ? <span className="mega-badge">{options.badge}</span> : null}
        </Link>
      </li>
    );
  };

  const push = (section: MobileSection) => {
    const nodes = section.nodes.filter(Boolean);
    if (nodes.length) sections.push({ ...section, nodes });
  };

  if (menu.overview) {
    push({ key: "overview", nodes: [link("overview", menu.overview.label, menu.overview.href)] });
  }

  const groupSection = (group: NavGroup): MobileSection => ({
    key: group.id,
    title: group.title,
    nodes: [
      ...(group.href && group.items.length === 0 ? [link(`${group.id}-self`, group.title, group.href)] : []),
      ...group.items.map((entry, index) =>
        link(`${group.id}-${index}`, entry.label, entry.href, { badge: entry.badge }),
      ),
      ...(group.id === menu.aside?.id && group.note
        ? [
            <li key={`${group.id}-note`} className="site-mobile-note">
              {group.note}
            </li>,
          ]
        : []),
    ],
  });

  if (menu.variant === "split-families" && menu.sections?.length) {
    menu.sections.forEach((section) => {
      const families = menu.groups.filter((group) => group.sectionId === section.id);
      push({
        key: section.id,
        title: section.title,
        nodes: [
          ...(section.hint
            ? [
                <li key={`${section.id}-hint`} className="site-mobile-note">
                  {section.hint}
                </li>,
              ]
            : []),
          ...families.map((group) =>
            link(group.id, group.title, group.href as string, { iconId: group.iconId }),
          ),
        ],
      });
    });
  } else {
    const linkedFamilies = menu.groups.filter((g) => g.href && g.items.length === 0);
    if (linkedFamilies.length) {
      push({ key: "families", nodes: linkedFamilies.map((g) => link(g.id, g.title, g.href as string)) });
    }
    menu.groups.filter((g) => !(g.href && g.items.length === 0)).forEach((g) => push(groupSection(g)));
  }

  if (menu.aside) push(groupSection(menu.aside));

  if (menu.cards?.length) {
    push({ key: "cards", nodes: menu.cards.map((c) => link(c.id, c.title, c.href)) });
  }

  const extras: ReactNode[] = [];
  if (menu.visual?.cta?.href && menu.visual.ctaStyle === "button") {
    extras.push(link("visual", menu.visual.cta.label, menu.visual.cta.href, { yellow: true }));
  }
  if (menu.promo) {
    extras.push(
      link("promo", `${menu.promo.title} ${menu.promo.cta.label}`, menu.promo.cta.href, { cta: true }),
    );
  }
  if (menu.visual?.cta && menu.visual.ctaStyle !== "button") {
    extras.push(link("visual", menu.visual.cta.label, menu.visual.cta.href, { cta: true }));
  }
  if (menu.footer?.cta) extras.push(link("footer", menu.footer.cta.label, menu.footer.cta.href, { cta: true }));
  push({ key: "extras", nodes: extras });

  return sections;
}

export function MobileNavigation({
  id,
  open,
  pathname,
  expanded,
  top,
  onToggle,
  onClose,
  onNavigate,
}: MobileNavigationProps) {
  return (
    <nav
      id={id}
      className="site-nav-mobile"
      hidden={!open}
      inert={!open}
      aria-label="Navigation principale (mobile)"
      style={{ "--nh-drawer-top": `${top}px` } as React.CSSProperties}
    >
      <ul className="site-mobile-list">
        <HeaderAccessLinks variant="mobile" onNavigate={onNavigate} />
        {headerNavigation.map((item) => {
          const current = isNavActive(pathname, item.href);

          if (item.type === "link") {
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`site-mobile-link${current ? " is-current" : ""}`}
                  aria-current={current ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const isOpen = expanded.includes(item.id);
          const panelId = `mobile-${item.id}`;
          const sections = buildSections(item.menu, pathname, onNavigate);

          return (
            <li key={item.id}>
              <button
                type="button"
                className={`site-mobile-trigger${current ? " is-current" : ""}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-current={current ? "page" : undefined}
                onClick={() => onToggle(item.id)}
              >
                <span>{item.label}</span>
                <Chevron />
              </button>
              <div id={panelId} hidden={!isOpen} className="site-mobile-panel">
                {sections.map((section) => (
                  <div key={section.key} className="site-mobile-group">
                    {section.title ? <p className="site-mobile-group-title">{section.title}</p> : null}
                    <ul>{section.nodes}</ul>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="site-mobile-actions">
        <Link href={headerCta.href} className="site-mobile-cta" onClick={onNavigate}>
          {headerCta.label}
          <span aria-hidden>↗</span>
        </Link>
        <button type="button" className="site-mobile-close" onClick={onClose}>
          Fermer
        </button>
      </div>
    </nav>
  );
}
