"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PartnerDashboardPreview } from "@/components/partner-portal/PartnerDashboardPreview";
import { PartnerPreviewTabs } from "@/components/partner-portal/PartnerPreviewTabs";
import { PartnerProductFormPreview } from "@/components/partner-portal/PartnerProductFormPreview";
import { PartnerProductsPreview } from "@/components/partner-portal/PartnerProductsPreview";
import type { PartnerNavItemId, PartnerPreviewTabId } from "@/content/partner-portal-page";
import {
  moduleStatusLabel,
  partnerPortalModules,
  partnerPortalPreviewSection,
  partnerPreviewTabs,
  partnerProductFormPreview,
} from "@/content/partner-portal-page";

const navToTab: Partial<Record<PartnerNavItemId, PartnerPreviewTabId>> = {
  overview: "overview",
  products: "products",
  "add-product": "product-form",
};

const scrollNavIds: PartnerNavItemId[] = ["subscription", "sponsoring"];

export function PartnerPortalPreview() {
  const baseId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<PartnerPreviewTabId>("overview");
  const [navNotice, setNavNotice] = useState<string | null>(null);

  useEffect(() => {
    rootRef.current?.classList.add("epp-preview--ready");
  }, []);

  const selectTab = useCallback((id: PartnerPreviewTabId) => {
    setActiveTab(id);
    setNavNotice(null);
  }, []);

  const onNavClick = (id: PartnerNavItemId) => {
    const tab = navToTab[id];
    if (tab) {
      selectTab(tab);
      return;
    }
    if (scrollNavIds.includes(id)) {
      const target = document.getElementById(`epp-section-${id}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      setNavNotice(null);
      return;
    }
    setNavNotice(partnerProductFormPreview.disconnectedNotice);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = partnerPreviewTabs.findIndex((t) => t.id === activeTab);
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const next = partnerPreviewTabs[(currentIndex - 1 + partnerPreviewTabs.length) % partnerPreviewTabs.length];
      selectTab(next.id);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = partnerPreviewTabs[(currentIndex + 1) % partnerPreviewTabs.length];
      selectTab(next.id);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(partnerPreviewTabs[0].id);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(partnerPreviewTabs[partnerPreviewTabs.length - 1].id);
    }
  };

  const section = partnerPortalPreviewSection;

  return (
    <section
      ref={rootRef}
      id={section.id}
      className="epp-preview section-spacing bg-brand-off-white"
      aria-labelledby="epp-preview-title"
    >
      <div className="container-content">
        <Reveal>
          <h2 id="epp-preview-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Aperçu du futur espace partenaire
          </h2>
          <p className="epp-preview__lead">
            Interface conceptuelle pour visualiser l’organisation prévue — sans connexion ni données réelles.
          </p>
        </Reveal>

        <div className="epp-preview__shell">
          <div className="epp-preview__topbar">
            <div className="epp-preview__brand">
              <span className="epp-preview__brand-main">{section.topBar.brand}</span>
              <span className="epp-preview__brand-sub">{section.topBar.context}</span>
            </div>
            <span className="epp-preview__top-tag">{section.topBar.tag}</span>
          </div>

          <div className="epp-preview__body">
            <nav className="epp-preview__nav" aria-label="Navigation du portail (aperçu)">
              <ul>
                {partnerPortalModules.map((item) => {
                  const tabMatch = navToTab[item.id];
                  const isActive = tabMatch === activeTab;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`epp-preview__nav-btn${isActive ? " epp-preview__nav-btn--active" : ""}`}
                        onClick={() => onNavClick(item.id)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span>{item.label}</span>
                        <span className="epp-preview__nav-status">{moduleStatusLabel(item.status)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="epp-preview__main">
              <p className="epp-preview__disclaimer">{section.disclaimer}</p>
              {navNotice ? <p className="epp-preview__nav-notice" role="status">{navNotice}</p> : null}

              <PartnerPreviewTabs
                activeTab={activeTab}
                onSelect={selectTab}
                baseId={baseId}
                onKeyDown={onKeyDown}
              />

              {partnerPreviewTabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <div
                    key={tab.id}
                    role="tabpanel"
                    id={`${baseId}-panel-${tab.id}`}
                    aria-labelledby={`${baseId}-tab-${tab.id}`}
                    hidden={!selected}
                    className={`epp-preview__panel${selected ? " epp-preview__panel--active" : ""}`}
                  >
                    {tab.id === "overview" ? <PartnerDashboardPreview /> : null}
                    {tab.id === "products" ? (
                      <PartnerProductsPreview onAddProduct={() => selectTab("product-form")} />
                    ) : null}
                    {tab.id === "product-form" ? <PartnerProductFormPreview /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
