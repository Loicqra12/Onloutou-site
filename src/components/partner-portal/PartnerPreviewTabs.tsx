"use client";

import type { PartnerPreviewTabId } from "@/content/partner-portal-page";
import { partnerPreviewTabs } from "@/content/partner-portal-page";

type Props = {
  activeTab: PartnerPreviewTabId;
  onSelect: (id: PartnerPreviewTabId) => void;
  baseId: string;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

export function PartnerPreviewTabs({ activeTab, onSelect, baseId, onKeyDown }: Props) {
  const indexOf = (id: PartnerPreviewTabId) => partnerPreviewTabs.findIndex((t) => t.id === id);

  return (
    <div
      role="tablist"
      aria-label="Aperçus du portail"
      className="epp-preview__tabs"
      onKeyDown={onKeyDown}
    >
      {partnerPreviewTabs.map((tab) => {
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
            className={`epp-preview__tab${selected ? " epp-preview__tab--active" : ""}`}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
      <span
        className="epp-preview__tab-indicator"
        style={{
          ["--epp-tab-index" as string]: indexOf(activeTab),
          ["--epp-tab-count" as string]: partnerPreviewTabs.length,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
