"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { homGeo, homIds } from "@/content/home-hub";
import { HomIcon } from "@/components/home/redesign/HomIcon";
import { HomTitle } from "@/components/home/redesign/HomMark";

type TabId = (typeof homGeo.tabs)[number]["id"];
type ViewId = (typeof homGeo.panel.views)[number]["id"];

const pinSpots = [
  { id: "v1", x: 30, y: 24 },
  { id: "v2", x: 78, y: 36 },
  { id: "v3", x: 20, y: 82 },
] as const;

function FleetMap({ tab }: { tab: TabId }) {
  return (
    <svg className="hom-map__svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="300" fill="#eceee8" />
      <g stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M0 40 C 80 30, 160 50, 250 30 S 360 20, 400 14" />
        <path d="M0 150 C 70 140, 140 170, 230 150 S 340 130, 400 120" />
        <path d="M60 0 C 70 60, 50 120, 70 190 S 90 260, 80 300" />
        <path d="M170 0 C 180 70, 160 130, 190 200 S 210 270, 200 300" />
        <path d="M290 0 C 280 60, 300 120, 280 180 S 310 260, 300 300" />
        <path d="M0 100 L 400 70" />
        <path d="M0 210 L 400 190" />
      </g>
      <path d="M0 232 C 40 214, 92 252, 152 244 S 232 270, 262 300 L0 300Z" fill="#cfe1ea" />
      <path d="M306 196 C 342 208, 364 244, 400 238 L400 300 L286 300 C 312 262, 292 226, 306 196Z" fill="#cfe1ea" />
      <g stroke="#f2cf3a" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M0 92 C 90 62, 170 122, 260 82 S 360 72, 400 52" />
        <path d="M42 0 C 92 92, 152 132, 202 182 S 302 250, 334 300" />
        <path d="M120 300 C 152 222, 252 152, 400 142" />
      </g>
      {tab === "alerter" ? (
        <circle cx="312" cy="108" r="54" fill="rgba(245,196,0,0.18)" stroke="#a77d00" strokeWidth="2" strokeDasharray="6 5" />
      ) : null}
      {tab === "suivre" ? (
        <path
          d="M80 246 C 70 182, 100 122, 120 70 S 250 92, 312 108"
          fill="none"
          stroke="#111"
          strokeWidth="2.5"
          strokeDasharray="7 6"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

export function HomGeo() {
  const [tab, setTab] = useState<TabId>("localiser");
  const [views, setViews] = useState<Record<TabId, ViewId>>({ localiser: "carte", suivre: "carte", alerter: "carte", analyser: "liste" });
  const { panel } = homGeo;
  const tabIds = homGeo.tabs.map((item) => item.id) as TabId[];

  // Changement volontaire uniquement : clic, flèches, Début/Fin, Entrée/Espace (bouton natif). Aucun minuteur.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: TabId) => {
    const index = tabIds.indexOf(id);
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % tabIds.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + tabIds.length) % tabIds.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabIds.length - 1;
    else return;
    event.preventDefault();
    setTab(tabIds[next]);
    document.getElementById(`hom-geo-tab-${tabIds[next]}`)?.focus();
  };
  return (
    <section id={homIds.geolocation} data-section="fleet" className="hom-geo" aria-labelledby="hom-geo-title">
      <span className="hom-stars" aria-hidden />
      <span className="hom-globe" aria-hidden>
        <span className="hom-globe__map" />
      </span>
      <div className="hom-wrap hom-wrap--above">
        <div className="hom-titleblock">
          <p className="hom-eyebrow hom-eyebrow--yellow hom-eyebrow--plain">{homGeo.eyebrow}</p>
          <h2 id="hom-geo-title" className="hom-h2 hom-h2--xl hom-h2--light">
            {homGeo.titleLines.map((line) => (
              <span key={line} className="hom-block">
                <HomTitle text={line} mark={homGeo.titleMark} variant="word" />
              </span>
            ))}
          </h2>
          <p className="hom-geo__lead">{homGeo.lead}</p>
        </div>

        <div className="hom-geo__grid">
          <div className="hom-geo__side">
            <div className="hom-geo-tabs" role="tablist" aria-orientation="vertical" aria-label="Capacités de géolocalisation et de supervision">
              {homGeo.tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`hom-geo-tab-${item.id}`}
                  aria-selected={tab === item.id}
                  aria-controls={`hom-geo-panel-${item.id}`}
                  tabIndex={tab === item.id ? 0 : -1}
                  className="hom-geo-tab"
                  onClick={() => setTab(item.id)}
                  onKeyDown={(event) => onTabKeyDown(event, item.id)}
                >
                  <span className="hom-geo-tab__body">
                    <span className="hom-geo-tab__title">
                      <span className="hom-geo-tab__number">{item.number}</span> {item.title}
                    </span>
                    <span className="hom-geo-tab__text">{item.text}</span>
                  </span>
                  <HomIcon name="chevronRight" className="hom-geo-tab__chevron" />
                </button>
              ))}
            </div>
            <Link href={homGeo.cta.href} className="hom-btn hom-btn--yellow hom-geo__cta">
              {homGeo.cta.label}
              <HomIcon name="arrowUpRight" className="hom-btn__icon" />
            </Link>
            <p className="hom-geo__note">{homGeo.note}</p>
          </div>

          <div className="hom-geo__main">
            <div className="hom-geo__stage">
              {homGeo.tabs.map((item) => {
                const active = tab === item.id;
                const view = views[item.id];
                const setView = (next: ViewId) => setViews((current) => ({ ...current, [item.id]: next }));
                return (
                  <div
                    key={item.id}
                    id={`hom-geo-panel-${item.id}`}
                    role="tabpanel"
                    aria-labelledby={`hom-geo-tab-${item.id}`}
                    className={`hom-geo-panel${active ? " is-active" : ""}`}
                    data-view={view}
                    data-tab={item.id}
                  >
                    <div className="hom-geo-panel__card">
                      <header className="hom-geo-panel__head">
                        <h3>{panel.title}</h3>
                        <span className="hom-geo-panel__badge">{panel.badge}</span>
                      </header>
                      <div className="hom-geo-panel__body">
                        <div className="hom-geo-panel__list">
                          <div className="hom-seg" role="group" aria-label="Affichage">
                            {panel.views.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                className={`hom-seg__btn${view === option.id ? " is-active" : ""}`}
                                aria-pressed={view === option.id}
                                onClick={() => setView(option.id)}
                              >
                                <HomIcon name={option.id === "carte" ? "pin" : "list"} className="hom-seg__icon" />
                                {option.label}
                              </button>
                            ))}
                          </div>
                          <p className="hom-geo-panel__list-title">{panel.listTitle}</p>
                          <ul>
                            {panel.vehicles.map((vehicle) => (
                              <li key={vehicle.id} className="hom-veh">
                                <span className="hom-veh__icon">
                                  <HomIcon name={vehicle.kind} />
                                </span>
                                <span className="hom-veh__body">
                                  <span className="hom-veh__name">{vehicle.label}</span>
                                  <span className="hom-veh__status">
                                    <i className={`hom-dot hom-dot--${vehicle.tone}`} aria-hidden />
                                    {vehicle.status}
                                  </span>
                                </span>
                                <HomIcon name="chevronRight" className="hom-veh__chevron" />
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="hom-map">
                          <FleetMap tab={item.id} />
                          <span className="hom-map__city">{panel.city}</span>
                          {pinSpots.map((spot) => {
                            const vehicle = panel.vehicles.find((entry) => entry.id === spot.id)!;
                            return (
                              <span key={spot.id} className="hom-pin" style={{ left: `${spot.x}%`, top: `${spot.y}%` }} aria-hidden>
                                <HomIcon name={vehicle.kind} />
                              </span>
                            );
                          })}
                          {item.id === "alerter" ? (
                            <div className="hom-map__card hom-map__card--alert">
                              <span className="hom-map__card-icon" aria-hidden>
                                !
                              </span>
                              <span>
                                <strong>{panel.alert.title}</strong>
                                <span>{panel.alert.detail}</span>
                              </span>
                            </div>
                          ) : (
                            <div className="hom-map__card">
                              <HomIcon name="pin" className="hom-map__card-pin" />
                              <span>
                                <strong>{panel.lastPosition.title}</strong>
                                <span>{panel.lastPosition.detail}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="hom-geo-panel__foot">{panel.footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
