"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { DriverAvailabilityPreview } from "@/components/driver-portal/DriverAvailabilityPreview";
import { DriverHomePreview } from "@/components/driver-portal/DriverHomePreview";
import { DriverMissionPreview } from "@/components/driver-portal/DriverMissionPreview";
import { DriverPreviewTabs } from "@/components/driver-portal/DriverPreviewTabs";
import { DriverProfilePreview } from "@/components/driver-portal/DriverProfilePreview";
import type { DriverPreviewTabId } from "@/content/driver-portal-page";
import { driverPortalPreviewSection, driverPreviewTabs } from "@/content/driver-portal-page";

export function DriverPortalPreview() {
  const baseId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<DriverPreviewTabId>("home");

  useEffect(() => {
    rootRef.current?.classList.add("edl-preview--ready");
  }, []);

  const selectTab = useCallback((id: DriverPreviewTabId) => {
    setActiveTab(id);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = driverPreviewTabs.findIndex((t) => t.id === activeTab);
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const next = driverPreviewTabs[(currentIndex - 1 + driverPreviewTabs.length) % driverPreviewTabs.length];
      selectTab(next.id);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = driverPreviewTabs[(currentIndex + 1) % driverPreviewTabs.length];
      selectTab(next.id);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(driverPreviewTabs[0].id);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(driverPreviewTabs[driverPreviewTabs.length - 1].id);
    }
  };

  const section = driverPortalPreviewSection;

  return (
    <section
      ref={rootRef}
      id={section.id}
      className="edl-preview section-spacing bg-brand-off-white"
      aria-labelledby="edl-preview-title"
    >
      <div className="container-content">
        <div className="edl-preview__editorial">
          <Reveal>
            <h2 id="edl-preview-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Aperçu mobile du futur espace livreur
            </h2>
            <p className="edl-preview__lead">
              Interface conceptuelle pensée pour le terrain — sans connexion, sans mission ni position réelle.
            </p>
          </Reveal>
          <div className="edl-preview__device" aria-label="Prévisualisation de l’application">
            <div className="edl-preview__shell">
              <div className="edl-preview__topbar">
                <div className="edl-preview__brand">
                  <span className="edl-preview__brand-main">{section.topBar.brand}</span>
                  <span className="edl-preview__brand-sub">{section.topBar.context}</span>
                </div>
                <span className="edl-preview__top-tag">{section.topBar.tag}</span>
              </div>
              <p className="edl-preview__disclaimer">{section.disclaimer}</p>
              <div className="edl-preview__panels">
                {driverPreviewTabs.map((tab) => {
                  const selected = tab.id === activeTab;
                  return (
                    <div
                      key={tab.id}
                      role="tabpanel"
                      id={`${baseId}-panel-${tab.id}`}
                      aria-labelledby={`${baseId}-tab-${tab.id}`}
                      hidden={!selected}
                      className={`edl-preview__panel${selected ? " edl-preview__panel--active" : ""}`}
                    >
                      {tab.id === "home" ? <DriverHomePreview /> : null}
                      {tab.id === "availability" ? <DriverAvailabilityPreview /> : null}
                      {tab.id === "missions" ? <DriverMissionPreview /> : null}
                      {tab.id === "profile" ? <DriverProfilePreview /> : null}
                    </div>
                  );
                })}
              </div>
              <DriverPreviewTabs
                activeTab={activeTab}
                onSelect={selectTab}
                baseId={baseId}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
