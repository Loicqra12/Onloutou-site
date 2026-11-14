"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MegaMenuVisual } from "@/components/navigation/MegaMenuVisual";
import { NavIcon } from "@/components/navigation/NavIcon";
import type { MegaMenuConfig, NavCta, NavEntry, NavGroup } from "@/types/navigation";

type MegaMenuProps = {
  menu: MegaMenuConfig;
  panelId: string;
  open: boolean;
  pathname: string;
  onNavigate: () => void;
};

function isCurrentPage(pathname: string, href: string) {
  return !href.includes("#") && href === pathname;
}

function CtaLink({
  cta,
  onNavigate,
  className = "",
}: {
  cta: NavCta;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <Link href={cta.href} prefetch={false} className={`mega-cta ${className}`.trim()} onClick={onNavigate}>
      <span>{cta.label}</span>
      <span aria-hidden className="nh-arrow">
        ↗
      </span>
    </Link>
  );
}

function EntryItem({
  entry,
  pathname,
  onNavigate,
}: {
  entry: NavEntry;
  pathname: string;
  onNavigate: () => void;
}) {
  const current = isCurrentPage(pathname, entry.href);

  return (
    <li>
      <Link
        href={entry.href}
        prefetch={false}
        className="mega-link"
        aria-current={current ? "page" : undefined}
        onClick={onNavigate}
      >
        <span>{entry.label}</span>
        {entry.emphasis ? (
          <span aria-hidden className="mega-link-arrow">
            →
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function GroupColumn({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const titleId = `mega-group-${group.id}`;

  return (
    <section className="mega-group" aria-labelledby={titleId}>
      {group.iconId ? <NavIcon id={group.iconId} className="mega-group-icon" /> : null}
      <p id={titleId} className="mega-group-title">
        {group.title}
      </p>
      {group.description ? <p className="mega-group-desc">{group.description}</p> : null}
      <ul className="mega-links">
        {group.items.map((entry, index) => (
          <EntryItem key={`${group.id}-${index}`} entry={entry} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </ul>
      {group.note ? <p className="mega-group-note">{group.note}</p> : null}
    </section>
  );
}

/** Carte compacte « futurs espaces » : pages de présentation, avec badge d'état. */
function AsideCard({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const titleId = `mega-aside-${group.id}`;

  return (
    <section className="mega-aside-card" aria-labelledby={titleId}>
      {group.iconId ? <NavIcon id={group.iconId} className="mega-group-icon" /> : null}
      <p id={titleId} className="mega-group-title">
        {group.title}
      </p>
      {group.description ? <p className="mega-group-desc">{group.description}</p> : null}
      <ul className="mega-space-list">
        {group.items.map((entry, index) => (
          <li key={`${group.id}-${index}`} className="mega-space">
            <Link
              href={entry.href}
              prefetch={false}
              className="mega-space-link"
              aria-current={isCurrentPage(pathname, entry.href) ? "page" : undefined}
              onClick={onNavigate}
            >
              <NavIcon id="preview" className="mega-space-icon" />
              <span className="mega-space-text">
                <span className="mega-space-label">{entry.label}</span>
                {entry.badge ? <span className="mega-badge">{entry.badge}</span> : null}
              </span>
              <span aria-hidden className="mega-link-arrow">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {group.note ? <p className="mega-group-note">{group.note}</p> : null}
    </section>
  );
}

function FamilyLink({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={group.href ?? "#"}
      prefetch={false}
      className="mega-family"
      aria-current={group.href && isCurrentPage(pathname, group.href) ? "page" : undefined}
      onClick={onNavigate}
    >
      {group.iconId ? <NavIcon id={group.iconId} className="mega-group-icon" /> : null}
      <span>
        <span className="mega-group-title">{group.title}</span>
        {group.description ? <span className="mega-group-desc">{group.description}</span> : null}
      </span>
    </Link>
  );
}

export function MegaMenu({ menu, panelId, open, pathname, onNavigate }: MegaMenuProps) {
  const style = { "--mega-w": `${menu.width}px` } as CSSProperties;
  const hasAside = Boolean(menu.visual || menu.aside);
  const asideStyle: Record<string, string | number> = menu.asideWeight
    ? { "--mega-aside": `${menu.asideWeight}fr` }
    : {};

  return (
    <div
      id={panelId}
      hidden={!open}
      inert={!open}
      className="mega-panel"
      role="region"
      aria-label={menu.label}
      style={style}
    >
      <div className="mega-surface">
        <div className="mega-head">
          <p className="mega-eyebrow">{menu.eyebrow}</p>
          <span className="mega-head-rule" aria-hidden />
          {menu.overview ? <CtaLink cta={menu.overview} onNavigate={onNavigate} /> : null}
        </div>

        <div className="mega-body">
          {menu.variant === "columns" ? (
            <div
              className={`mega-columns${hasAside ? "" : " has-no-aside"}`}
              style={{ ...asideStyle, "--mega-n": menu.groups.length } as CSSProperties}
            >
              {menu.groups.map((group) => (
                <GroupColumn key={group.id} group={group} pathname={pathname} onNavigate={onNavigate} />
              ))}
              {menu.visual ? (
                <div className="mega-aside">
                  <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} />
                </div>
              ) : menu.aside ? (
                <div className="mega-aside">
                  <AsideCard group={menu.aside} pathname={pathname} onNavigate={onNavigate} />
                </div>
              ) : null}
            </div>
          ) : null}

          {menu.variant === "icon-grid" ? (
            <div className="mega-icon-layout" style={asideStyle as CSSProperties}>
              <div className="mega-families">
                {menu.groups.map((group) => (
                  <FamilyLink key={group.id} group={group} pathname={pathname} onNavigate={onNavigate} />
                ))}
                {menu.promo ? (
                  <div className="mega-promo">
                    <NavIcon id={menu.promo.iconId} className="mega-promo-icon" />
                    <div>
                      <p className="mega-promo-title">{menu.promo.title}</p>
                      <CtaLink cta={menu.promo.cta} onNavigate={onNavigate} className="mega-promo-link" />
                    </div>
                  </div>
                ) : null}
              </div>
              {menu.visual ? (
                <div className="mega-aside">
                  <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} />
                </div>
              ) : null}
            </div>
          ) : null}

          {menu.variant === "split-families" ? (
            <div className="mega-split" style={asideStyle as CSSProperties}>
              <div className="mega-split-cols">
                {(menu.sections ?? []).map((section) => (
                  <section key={section.id} className="mega-split-col" aria-labelledby={`mega-sec-${section.id}`}>
                    <p id={`mega-sec-${section.id}`} className="mega-split-title">
                      {section.title}
                    </p>
                    {section.hint ? <p className="mega-split-hint">{section.hint}</p> : null}
                    <ul className="mega-split-list">
                      {menu.groups
                        .filter((group) => group.sectionId === section.id)
                        .map((group) => (
                          <li key={group.id}>
                            <FamilyLink group={group} pathname={pathname} onNavigate={onNavigate} />
                          </li>
                        ))}
                    </ul>
                  </section>
                ))}
              </div>
              {menu.visual ? (
                <div className="mega-aside mega-split-aside">
                  <MegaMenuVisual visual={menu.visual} onNavigate={onNavigate} />
                  {menu.promo ? (
                    <p className="mega-split-promo">
                      <span>{menu.promo.title}</span>{" "}
                      <CtaLink cta={menu.promo.cta} onNavigate={onNavigate} className="mega-promo-link" />
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {menu.variant === "cards" ? (
            <>
              <ul className="mega-cards">
                {(menu.cards ?? []).map((card) => (
                  <li key={card.id}>
                    <Link href={card.href} prefetch={false} className="mega-card" onClick={onNavigate}>
                      <div className="mega-visual-frame">
                        <Image
                          src={card.image.src}
                          alt={card.image.alt}
                          width={card.image.width}
                          height={card.image.height}
                          sizes="360px"
                          className="mega-visual-image"
                          style={{ objectPosition: card.image.objectPosition }}
                        />
                      </div>
                      <span className="mega-card-row">
                        <span className="mega-visual-title">{card.title}</span>
                        <span aria-hidden className="mega-card-arrow">
                          →
                        </span>
                      </span>
                      <span className="mega-visual-subtitle">{card.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {menu.cardsNote ? <p className="mega-cards-note">{menu.cardsNote}</p> : null}
            </>
          ) : null}
        </div>

        {menu.footer ? (
          <div className={`mega-footer${menu.footer.cta ? "" : " is-note"}`}>
            <NavIcon id={menu.footer.iconId} className="mega-footer-icon" />
            <span>{menu.footer.text}</span>
            {menu.footer.cta ? <CtaLink cta={menu.footer.cta} onNavigate={onNavigate} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
