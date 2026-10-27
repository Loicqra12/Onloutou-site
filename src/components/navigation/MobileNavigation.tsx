"use client";

import Link from "next/link";
import { headerCta, headerNavigation, isNavActive } from "@/content/header-navigation";
import type { NavEntry } from "@/types/navigation";

type MobileNavigationProps = {
  id: string;
  open: boolean;
  pathname: string;
  accordion: string | null;
  onAccordion: (id: string | null) => void;
  onNavigate: () => void;
};

function MobileEntry({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  if (entry.type === "info") {
    return (
      <li className="site-mobile-info">
        <span>{entry.label}</span>
        {entry.note ? <small>{entry.note}</small> : null}
      </li>
    );
  }

  return (
    <li>
      <Link href={entry.href} className="site-mobile-sublink" onClick={onNavigate}>
        {entry.label}
      </Link>
    </li>
  );
}

export function MobileNavigation({
  id,
  open,
  pathname,
  accordion,
  onAccordion,
  onNavigate,
}: MobileNavigationProps) {
  return (
    <nav
      id={id}
      className="site-nav-mobile"
      hidden={!open}
      inert={!open}
      aria-label="Navigation principale"
    >
      <ul className="site-mobile-list">
        {headerNavigation.map((item) => {
          if (item.type === "link") {
            const active = isNavActive(pathname, item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`site-mobile-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const expanded = accordion === item.id;
          const panelId = `mobile-${item.id}`;
          const active = isNavActive(pathname, item.href);

          return (
            <li key={item.id} className="site-mobile-item">
              <button
                type="button"
                className={`site-mobile-trigger${active ? " is-active" : ""}`}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => onAccordion(expanded ? null : item.id)}
              >
                <span>{item.label}</span>
                <span aria-hidden className={`site-nav-chevron${expanded ? " is-open" : ""}`}>
                  ▾
                </span>
              </button>
              <div id={panelId} hidden={!expanded} className="site-mobile-panel">
                {item.menu.layout === "cards" ? (
                  <ul>
                    {(item.menu.cards ?? []).map((card) =>
                      card.href ? (
                        <li key={card.id}>
                          <Link href={card.href} className="site-mobile-sublink" onClick={onNavigate}>
                            {card.title}
                          </Link>
                        </li>
                      ) : (
                        <li key={card.id} className="site-mobile-info">
                          <span>{card.title}</span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  item.menu.groups.map((group) => (
                    <div key={group.id} className="site-mobile-group">
                      {group.href ? (
                        <Link href={group.href} className="site-mobile-group-title" onClick={onNavigate}>
                          {group.title}
                        </Link>
                      ) : (
                        <p className="site-mobile-group-title">{group.title}</p>
                      )}
                      <ul>
                        {group.items.map((entry, entryIndex) => (
                          <MobileEntry
                            key={`${group.id}-${entryIndex}`}
                            entry={entry}
                            onNavigate={onNavigate}
                          />
                        ))}
                      </ul>
                    </div>
                  ))
                )}
                {item.menu.overviewHref ? (
                  <Link href={item.menu.overviewHref} className="site-mobile-overview" onClick={onNavigate}>
                    {item.menu.overviewLabel ?? "En savoir plus"}
                  </Link>
                ) : null}
                {item.menu.footerCta ? (
                  <Link href={item.menu.footerCta.href} className="site-mobile-overview" onClick={onNavigate}>
                    {item.menu.footerCta.label}
                  </Link>
                ) : null}
                {item.menu.visual?.cta ? (
                  <Link href={item.menu.visual.cta.href} className="site-mobile-overview" onClick={onNavigate}>
                    {item.menu.visual.cta.label}
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <Link href={headerCta.href} className="site-mobile-cta" onClick={onNavigate}>
        {headerCta.label}
      </Link>
    </nav>
  );
}
