"use client";

import Image from "next/image";
import { useState } from "react";
import { psmImages, psmRoles } from "@/content/platform-page";
import { PsmIcon } from "./PsmIcon";
import { PsmWindowMock } from "./PsmMock";
import { onTabKeyDown } from "./tabKeys";

const tabId = (i: number) => `psm-role-tab-${i}`;
const panelId = "psm-role-panel";

export function PsmRoles() {
  const [active, setActive] = useState(0);
  const role = psmRoles.roles[active];

  return (
    <section className="psm-section psm-section--white" id={psmRoles.id} aria-labelledby="psm-roles-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmRoles.kicker}</p>
        <h2 id="psm-roles-title" className="psm-h2">
          {psmRoles.titleLines.map((line) => (
            <span key={line} className="psm-line">
              {line}
            </span>
          ))}
        </h2>
        <p className="psm-lead">{psmRoles.lead}</p>

        <div className="psm-roles-grid">
          <div className="psm-roles-list" role="tablist" aria-label="Rôles et parcours" aria-orientation="vertical">
            {psmRoles.roles.map((r, i) => (
              <button
                key={r.id}
                id={tabId(i)}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={panelId}
                tabIndex={i === active ? 0 : -1}
                className="psm-role-tab"
                onClick={() => setActive(i)}
                onKeyDown={(e) => onTabKeyDown(e, i, psmRoles.roles.length, setActive, tabId, "vertical")}
              >
                <PsmIcon name={r.icon} className="psm-role-icon" />
                <span className="psm-role-text">
                  <strong>{r.title}</strong>
                  <small>{r.text}</small>
                </span>
                <PsmIcon name="arrowUpRight" className="psm-role-arrow" strokeWidth={2} />
              </button>
            ))}
          </div>

          <div className="psm-roles-panel" role="tabpanel" id={panelId} aria-labelledby={tabId(active)} key={role.id}>
            {role.id === "admin" ? (
              <Image
                src={psmImages.access.src}
                alt={psmImages.access.alt}
                width={psmImages.access.width}
                height={psmImages.access.height}
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            ) : (
              <PsmWindowMock variant={role.id} label={`Exemple illustratif : espace ${role.title.toLowerCase()}.`} />
            )}
          </div>
        </div>
        <p className="psm-note">{psmRoles.caption}</p>
      </div>
    </section>
  );
}
