"use client";

import type { DriverPreviewTabId } from "@/content/driver-portal-page";
import { driverPreviewTabs } from "@/content/driver-portal-page";

type Props = {
  activeTab: DriverPreviewTabId;
  onSelect: (id: DriverPreviewTabId) => void;
  baseId: string;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

export function DriverPreviewTabs({ activeTab, onSelect, baseId, onKeyDown }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Navigation de l’aperçu livreur"
      className="edl-preview__tablist"
      onKeyDown={onKeyDown}
    >
      {driverPreviewTabs.map((tab) => {
        const selected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            className={`edl-preview__tab${selected ? " edl-preview__tab--active" : ""}`}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
