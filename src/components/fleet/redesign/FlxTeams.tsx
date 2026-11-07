"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { flxTeams } from "@/content/fleet-hub";
import { FlxIcon } from "./FlxIcon";

export function FlxTeams() {
  const uid = useId();
  const [active, setActive] = useState<number>(flxTeams.defaultTab);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = flxTeams.tabs.length;

  const focusTab = (i: number) => {
    const next = (i + count) % count;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(count - 1);
    }
  };

  return (
    <section id={flxTeams.id} className="flx-section flx-teams" aria-labelledby="flx-teams-title">
      <div className="flx-wrap">
        <p className="flx-kicker">{flxTeams.kicker}</p>
        <h2 id="flx-teams-title" className="flx-h2 flx-h2--md">
          {flxTeams.title}
        </h2>

        <div role="tablist" aria-label="Lecture de la flotte par équipe" className="flx-tabs">
          {flxTeams.tabs.map((tab, i) => {
            const selected = i === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                className={selected ? "flx-tab is-active" : "flx-tab"}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <FlxIcon name={tab.icon} strokeWidth={1.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flx-panels">
          {flxTeams.tabs.map((tab, i) => {
            const selected = i === active;
            return (
              <div
                key={tab.id}
                role="tabpanel"
                id={`${uid}-panel-${tab.id}`}
                aria-labelledby={`${uid}-tab-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                inert={!selected}
                className={selected ? "flx-panel" : "flx-panel flx-panel--off"}
              >
                <div className="flx-panel__copy">
                  <h3>{tab.heading}</h3>
                  <ul>
                    {tab.items.map((it) => (
                      <li key={it.title}>
                        <span className="flx-ico">
                          <FlxIcon name={it.icon} strokeWidth={1.6} />
                        </span>
                        <span>
                          <strong>{it.title}</strong>
                          <span>{it.text}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flx-mock">
                  <div className="flx-mock__head">
                    <strong>{tab.card.title}</strong>
                    <span className="flx-mock__link">
                      {tab.card.link}
                      <FlxIcon name="arrowRight" strokeWidth={2} />
                    </span>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        {tab.card.columns.map((c) => (
                          <th key={c} scope="col">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tab.card.rows.map((r) => (
                        <tr key={r.cells[0]}>
                          <td>
                            <span className="flx-mock__id">
                              <span className="flx-mock__thumb">
                                <FlxIcon name={r.thumb ?? "van"} strokeWidth={1.4} />
                              </span>
                              <span>
                                <strong>{r.cells[0]}</strong>
                                <span>{r.sub[0]}</span>
                              </span>
                            </span>
                          </td>
                          <td>
                            <strong className="flx-mock__status">
                              <i className={`flx-dot flx-dot--${r.dot ?? "green"}`} aria-hidden="true" />
                              {r.cells[1]}
                            </strong>
                            <span>{r.sub[1]}</span>
                          </td>
                          <td>
                            <span className="flx-mock__action">
                              <span>
                                <strong>{r.action[0]}</strong>
                                <span>{r.action[1]}</span>
                              </span>
                              <FlxIcon name="chevronRight" strokeWidth={2} />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="flx-mock__note">{flxTeams.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
