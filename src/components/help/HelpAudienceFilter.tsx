"use client";

import { useHelpCenter } from "@/components/help/HelpCenterProvider";
import { helpAudienceFilters } from "@/content/help-center";
import type { HelpAudience } from "@/types/help";

export function HelpAudienceFilter() {
  const { audience, setAudience } = useHelpCenter();

  return (
    <div className="hlp-audience" role="group" aria-label="Filtrer par profil">
      <ul className="hlp-audience__list">
        {helpAudienceFilters.map((filter) => {
          const selected = audience === filter.id;
          return (
            <li key={filter.id}>
              <button
                type="button"
                className={`hlp-audience__btn${selected ? " hlp-audience__btn--active" : ""}`}
                aria-pressed={selected}
                onClick={() => setAudience(filter.id as HelpAudience)}
              >
                {filter.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
