"use client";

import { useState } from "react";
import { driverDisconnectedNotice, driverMissionPreview } from "@/content/driver-portal-page";

export function DriverMissionPreview() {
  const data = driverMissionPreview;
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="edl-missions">
      <h3 className="edl-panel__title">{data.title}</h3>
      <p className="edl-missions__empty">{data.empty}</p>
      {notice ? <p className="edl-missions__notice" role="status">{notice}</p> : null}
      <article className="edl-missions__example" aria-label="Exemple de structure de mission">
        <p className="edl-missions__example-tag">{data.exampleTag}</p>
        <dl className="edl-missions__dl">
          {data.structureLabels.map((label, index) => (
            <div key={label} className="edl-missions__row">
              <dt>{label}</dt>
              <dd>{data.exampleValues[index] ?? "—"}</dd>
            </div>
          ))}
        </dl>
        <div className="edl-missions__actions">
          {data.demoActions.map((action) => (
            <button
              key={action}
              type="button"
              className="edl-missions__action"
              onClick={() => setNotice(driverDisconnectedNotice)}
              aria-describedby="edl-mission-actions-hint"
            >
              {action}
            </button>
          ))}
        </div>
        <p id="edl-mission-actions-hint" className="edl-missions__hint">
          Actions démonstratives — {driverDisconnectedNotice}
        </p>
      </article>
    </div>
  );
}
