"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MegaMenuConfig, NavEntry, NavVisual } from "@/types/navigation";
import { MegaMenuVisual } from "@/components/navigation/MegaMenuVisual";

type MegaMenuProps = {
  menu: MegaMenuConfig;
  panelId: string;
  open: boolean;
  activeFamily: string;
  onFamilyChange: (id: string) => void;
  onNavigate: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

function EntryItem({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  if (entry.type === "info") {
    return (
      <li className="mega-info">
        <span className="mega-info-label">{entry.label}</span>
        {entry.note ? <span className="mega-info-note">{entry.note}</span> : null}
      </li>
    );
  }

  return (
    <li>
      <Link href={entry.href} className="mega-link" prefetch={false} onClick={onNavigate}>
        {entry.label}
      </Link>
    </li>
  );
}

function NavGroupIcon({ iconId }: { iconId?: string }) {
  if (!iconId) return null;
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    "aria-hidden": true,
  } as const;
  switch (iconId) {
    case "car":
      return (
        <svg {...common}>
          <path d="M3 17h18M5 17V9l2-4h10l2 4v8M9 13h6" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </svg>
      );
    case "bike":
      return (
        <svg {...common}>
          <circle cx="6" cy="17" r="3" />
          <circle cx="18" cy="17" r="3" />
          <path d="M6 17l4-8h4l2 4M14 9l2 4" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <rect x="1" y="8" width="13" height="9" rx="1" />
          <path d="M14 10h4l3 3v4h-7V8" />
          <circle cx="5" cy="17" r="2" />
          <circle cx="18" cy="17" r="2" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.4 6.4l1.6 1.6M16 16l1.6 1.6M17.6 6.4 16 8M8 16l-1.6 1.6" />
        </svg>
      );
    case "signal":
      return (
        <svg {...common}>
          <path d="M2 12a10 10 0 0 1 10-10M6 12a6 6 0 0 1 6-6M10 12a2 2 0 0 1 2-2" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}

export function MegaMenu({
  menu,
  panelId,
  open,
  activeFamily,
  onFamilyChange,
  onNavigate,
  onPointerEnter,
  onPointerLeave,
}: MegaMenuProps) {
  const [seen, setSeen] = useState(open);

  if (open && !seen) setSeen(true);

  const currentVisual: NavVisual | undefined = menu.visuals
    ? menu.visuals[activeFamily] ?? (menu.defaultVisual ? menu.visuals[menu.defaultVisual] : undefined)
    : menu.visual;

  if (!open && !seen) {
    return <div id={panelId} hidden className="mega-panel" />;
  }

  return (
    <div
      id={panelId}
      hidden={!open}
      inert={!open}
      className="mega-panel"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="mega-bridge" aria-hidden />
      <div className="mega-panel-inner">
        {menu.layout === "columns-visual" ? (
          <div className="mega-grid mega-grid--solutions">
            <div className="mega-columns">
              {menu.groups.map((group) => (
                <div
                  key={group.id}
                  className={`mega-column${activeFamily === group.id ? " is-active" : ""}`}
                  onPointerEnter={() => onFamilyChange(group.id)}
                  onFocusCapture={() => onFamilyChange(group.id)}
                >
                  {group.href ? (
                    <Link href={group.href} className="mega-column-title" prefetch={false} onClick={onNavigate}>
                      {group.title}
                    </Link>
                  ) : (
                    <p className="mega-column-title">{group.title}</p>
                  )}
                  {group.description ? <p className="mega-column-desc">{group.description}</p> : null}
                  <ul className="mega-list">
                    {group.items.map((entry, entryIndex) => (
                      <EntryItem
                        key={`${group.id}-${entryIndex}`}
                        entry={entry}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {currentVisual && menu.visuals ? (
              <div className="mega-visual-stack" aria-live="polite">
                {Object.entries(menu.visuals).map(([id, visual]) => (
                  <div
                    key={id}
                    className={`mega-visual-layer${id === activeFamily ? " is-current" : ""}`}
                  >
                    <MegaMenuVisual visual={visual} onNavigate={onNavigate} />
                  </div>
                ))}
              </div>
            ) : currentVisual ? (
              <MegaMenuVisual visual={currentVisual} onNavigate={onNavigate} />
            ) : null}
          </div>
        ) : null}

        {menu.layout === "list-visual" || menu.layout === "simple-visual" ? (
          <div className="mega-grid mega-grid--split">
            <div className="mega-list-block">
              {menu.groups.map((group) => (
                <div key={group.id}>
                  <p className="mega-column-title">{group.title}</p>
                  {group.description ? <p className="mega-column-desc">{group.description}</p> : null}
                  <ul className="mega-list mega-list--wide">
                    {group.items.map((entry, entryIndex) => (
                      <EntryItem
                        key={`${group.id}-${entryIndex}`}
                        entry={entry}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </ul>
                </div>
              ))}
              {menu.overviewHref ? (
                <Link href={menu.overviewHref} className="mega-overview" onClick={onNavigate}>
                  <span>{menu.overviewLabel ?? "En savoir plus"}</span>
                  <span aria-hidden className="mega-cta-arrow">
                    ↗
                  </span>
                </Link>
              ) : null}
            </div>
            {menu.visual ? (
              <MegaMenuVisual
                visual={menu.visual}
                onNavigate={onNavigate}
                compact={menu.layout === "simple-visual"}
              />
            ) : null}
          </div>
        ) : null}

        {menu.layout === "cards" ? (
          <div className="mega-cards-wrap">
            {menu.overviewHref ? (
              <Link href={menu.overviewHref} className="mega-overview mega-overview--cards" onClick={onNavigate}>
                <span>{menu.overviewLabel ?? "En savoir plus"}</span>
                <span aria-hidden className="mega-cta-arrow">↗</span>
              </Link>
            ) : null}
            <div className="mega-cards">
              {(menu.cards ?? []).map((card) => {
                const body = (
                  <>
                    <div className="mega-card-media">
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        width={card.image.width}
                        height={card.image.height}
                        sizes="(max-width: 1199px) 0px, 28vw"
                        className="mega-card-image"
                        style={{ objectPosition: card.image.objectPosition }}
                      />
                    </div>
                    <div className="mega-card-copy">
                      <p className="mega-card-title">{card.title}</p>
                      <p className="mega-card-desc">{card.description}</p>
                    </div>
                  </>
                );

                return card.href ? (
                  <Link key={card.id} href={card.href} className="mega-card" prefetch={false} onClick={onNavigate}>
                    {body}
                  </Link>
                ) : (
                  <article key={card.id} className="mega-card is-static">
                    {body}
                  </article>
                );
              })}
            </div>
            {menu.footerCta ? (
              <Link href={menu.footerCta.href} className="mega-overview" prefetch={false} onClick={onNavigate}>
                <span>{menu.footerCta.label}</span>
                <span aria-hidden className="mega-cta-arrow">
                  ↗
                </span>
              </Link>
            ) : null}
          </div>
        ) : null}

        {menu.layout === "columns-3-visual" ? (
          <div className="mega-grid mega-grid--3col">
            <div className="mega-columns--3">
              {menu.groups.map((group) => (
                <div
                  key={group.id}
                  className={`mega-column${activeFamily === group.id ? " is-active" : ""}`}
                  onPointerEnter={() => onFamilyChange(group.id)}
                  onFocusCapture={() => onFamilyChange(group.id)}
                >
                  {group.href ? (
                    <Link href={group.href} className="mega-column-title" prefetch={false} onClick={onNavigate}>
                      {group.title}
                    </Link>
                  ) : (
                    <p className="mega-column-title">{group.title}</p>
                  )}
                  {group.description ? <p className="mega-column-desc">{group.description}</p> : null}
                  <ul className="mega-list">
                    {group.items.map((e, i) => (
                      <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {currentVisual && menu.visuals ? (
              <div className="mega-visual-stack" aria-live="polite">
                {Object.entries(menu.visuals).map(([id, visual]) => (
                  <div
                    key={id}
                    className={`mega-visual-layer${id === activeFamily ? " is-current" : ""}`}
                  >
                    <MegaMenuVisual visual={visual} onNavigate={onNavigate} />
                  </div>
                ))}
              </div>
            ) : currentVisual ? (
              <MegaMenuVisual visual={currentVisual} onNavigate={onNavigate} />
            ) : null}
          </div>
        ) : null}

        {menu.layout === "grid-icon-visual" ? (
          <div className="mega-grid mega-grid--icon-visual">
            <div className="mega-icon-grid">
              {menu.groups.map((group) => (
                <div key={group.id} className="mega-icon-group">
                  <span className="mega-icon-badge">
                    <NavGroupIcon iconId={group.iconId} />
                  </span>
                  {group.href ? (
                    <Link href={group.href} className="mega-column-title" prefetch={false} onClick={onNavigate}>
                      {group.title}
                    </Link>
                  ) : (
                    <p className="mega-column-title">{group.title}</p>
                  )}
                  {group.description ? <p className="mega-column-desc">{group.description}</p> : null}
                  <ul className="mega-list">
                    {group.items.map((e, i) => (
                      <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {menu.visual ? <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} /> : null}
          </div>
        ) : null}

        {menu.layout === "two-col-visual-footer" ? (
          <div className="mega-grid mega-grid--two-visual">
            <div>
              <div className="mega-two-col">
                {menu.groups.map((group) => (
                  <div key={group.id}>
                    <p className="mega-column-title">{group.title}</p>
                    <ul className="mega-list">
                      {group.items.map((e, i) => (
                        <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {menu.footerCta ? (
                <Link href={menu.footerCta.href} className="mega-overview" prefetch={false} onClick={onNavigate}>
                  <span>{menu.footerCta.label}</span>
                  <span aria-hidden className="mega-cta-arrow">↗</span>
                </Link>
              ) : null}
            </div>
            {menu.visual ? <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} /> : null}
          </div>
        ) : null}

        {menu.layout === "three-col-flat" ? (
          <div className="mega-three-flat">
            {menu.groups.map((group) => (
              <div key={group.id}>
                <p className="mega-column-title">{group.title}</p>
                <ul className="mega-list mega-list--wide">
                  {group.items.map((e, i) => (
                    <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {menu.layout === "two-col-visual" ? (
          <div className="mega-grid mega-grid--split">
            <div className="mega-two-groups-col">
              {menu.groups.map((group) => (
                <div key={group.id}>
                  <p className="mega-column-title">{group.title}</p>
                  <ul className="mega-list mega-list--wide">
                    {group.items.map((e, i) => (
                      <EntryItem key={`${group.id}-${i}`} entry={e} onNavigate={onNavigate} />
                    ))}
                  </ul>
                </div>
              ))}
              {menu.overviewHref ? (
                <Link href={menu.overviewHref} className="mega-overview" onClick={onNavigate}>
                  <span>{menu.overviewLabel ?? "En savoir plus"}</span>
                  <span aria-hidden className="mega-cta-arrow">↗</span>
                </Link>
              ) : null}
            </div>
            {menu.visual ? (
              <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} compact />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
