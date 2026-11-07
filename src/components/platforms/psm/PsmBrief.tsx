"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  buildPsmWhatsAppUrl,
  psmBrief,
  psmBriefDefaults,
  summarizeBrief,
  type PsmBriefState,
} from "@/content/platform-page";
import { site } from "@/content/site";
import { PsmIcon, type PsmIconName } from "./PsmIcon";

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function PsmBrief() {
  const uid = useId();
  const [state, setState] = useState<PsmBriefState>(psmBriefDefaults);

  const summary = useMemo(() => summarizeBrief(state), [state]);
  const whatsappHref = useMemo(() => buildPsmWhatsAppUrl(state), [state]);

  const setTool = (label: string) =>
    setState((s) => {
      if (label === "À définir") return { ...s, tools: s.tools.includes(label) ? [] : [label] };
      const without = s.tools.filter((t) => t !== "À définir");
      return { ...s, tools: toggle(without, label) };
    });

  const recap: { icon: PsmIconName; label: string; value: string }[] = [
    { icon: "monitor", label: "Solution", value: summary.tools },
    { icon: "users", label: "Utilisateurs", value: summary.users },
    { icon: "target", label: "Objectif", value: summary.problem },
    { icon: "link", label: "Intégration", value: summary.integration },
    { icon: "file", label: "Avancement", value: summary.maturity },
    { icon: "calendar", label: "Calendrier", value: summary.timeline },
  ];

  return (
    <section id={psmBrief.id} className="psm-section psm-section--paper psm-brief" aria-labelledby="psm-brief-title">
      <div className="psm-wrap">
        <p className="psm-kicker">{psmBrief.kicker}</p>
        <h2 id="psm-brief-title" className="psm-h2 psm-h2--single">
          {psmBrief.title}
        </h2>
        <p className="psm-lead">{psmBrief.lead}</p>

        <div className="psm-brief-grid">
          <form className="psm-form" onSubmit={(e) => e.preventDefault()} aria-label="Brief de projet">
            {/* 01 */}
            <div className="psm-card" role="group" aria-labelledby={`${uid}-q1`}>
              <div className="psm-q">
                <span className="psm-q-n">01</span>
                <p id={`${uid}-q1`} className="psm-q-title">
                  Quel outil souhaitez-vous ?
                </p>
                <span className="psm-q-hint">Plusieurs choix possibles.</span>
              </div>
              <div className="psm-tools">
                {psmBrief.tools.map((tool) => {
                  const checked = state.tools.includes(tool.label);
                  return (
                    <label key={tool.id} className={`psm-tool${checked ? " is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        name="psm-outil"
                        value={tool.label}
                        checked={checked}
                        onChange={() => setTool(tool.label)}
                      />
                      <PsmIcon name={tool.icon} className="psm-tool-icon" strokeWidth={1.6} />
                      <span className="psm-tool-label">{tool.label}</span>
                      <span className="psm-radio" aria-hidden="true">
                        <PsmIcon name="check" strokeWidth={3} />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 02 */}
            <div className="psm-card" role="group" aria-labelledby={`${uid}-q2`}>
              <div className="psm-q">
                <span className="psm-q-n">02</span>
                <p id={`${uid}-q2`} className="psm-q-title">
                  Pour quels utilisateurs ?
                </p>
              </div>
              <div className="psm-checks psm-checks--row">
                {psmBrief.users.map((u) => (
                  <label key={u} className="psm-check">
                    <input
                      type="checkbox"
                      name="psm-utilisateurs"
                      value={u}
                      checked={state.users.includes(u)}
                      onChange={() => setState((s) => ({ ...s, users: toggle(s.users, u) }))}
                    />
                    <span className="psm-box" aria-hidden="true">
                      <PsmIcon name="check" strokeWidth={3.2} />
                    </span>
                    <span>{u}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 03 */}
            <div className="psm-card">
              <div className="psm-q">
                <span className="psm-q-n">03</span>
                <label htmlFor={`${uid}-problem`} className="psm-q-title">
                  Quel problème souhaitez-vous résoudre ?
                </label>
              </div>
              <textarea
                id={`${uid}-problem`}
                name="psm-probleme"
                rows={3}
                className="psm-field psm-textarea"
                placeholder={psmBrief.problemPlaceholder}
                value={state.problem}
                onChange={(e) => setState((s) => ({ ...s, problem: e.target.value }))}
              />
            </div>

            {/* 04 */}
            <div className="psm-card" role="group" aria-labelledby={`${uid}-q4`}>
              <div className="psm-q">
                <span className="psm-q-n">04</span>
                <p id={`${uid}-q4`} className="psm-q-title">
                  Quels systèmes faut-il relier ?
                </p>
              </div>
              <div className="psm-checks psm-checks--grid">
                {psmBrief.systems.map((sys) => (
                  <label key={sys} className="psm-check">
                    <input
                      type="checkbox"
                      name="psm-systemes"
                      value={sys}
                      checked={state.systems.includes(sys)}
                      onChange={() => setState((s) => ({ ...s, systems: toggle(s.systems, sys) }))}
                    />
                    <span className="psm-box" aria-hidden="true">
                      <PsmIcon name="check" strokeWidth={3.2} />
                    </span>
                    <span>{sys}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 05 / 06 */}
            <div className="psm-card psm-card--pair">
              <div className="psm-pair">
                <div className="psm-q">
                  <span className="psm-q-n">05</span>
                  <label htmlFor={`${uid}-maturity`} className="psm-q-title">
                    Où en est votre projet ?
                  </label>
                </div>
                <div className="psm-select-wrap">
                  <select
                    id={`${uid}-maturity`}
                    name="psm-avancement"
                    className="psm-field psm-select"
                    value={state.maturity}
                    onChange={(e) => setState((s) => ({ ...s, maturity: e.target.value }))}
                  >
                    {psmBrief.maturity.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="psm-pair">
                <div className="psm-q">
                  <span className="psm-q-n">06</span>
                  <label htmlFor={`${uid}-timeline`} className="psm-q-title">
                    Quel calendrier envisagez-vous ?
                  </label>
                </div>
                <div className="psm-select-wrap">
                  <select
                    id={`${uid}-timeline`}
                    name="psm-calendrier"
                    className="psm-field psm-select"
                    value={state.timeline}
                    onChange={(e) => setState((s) => ({ ...s, timeline: e.target.value }))}
                  >
                    {psmBrief.timelines.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Précision */}
            <div className="psm-card">
              <label htmlFor={`${uid}-extra`} className="psm-q-title psm-q-title--plain">
                Une précision utile ? <span className="psm-optional">(facultatif)</span>
              </label>
              <textarea
                id={`${uid}-extra`}
                name="psm-precision"
                rows={2}
                className="psm-field psm-textarea psm-textarea--short"
                placeholder={psmBrief.extraPlaceholder}
                value={state.extra}
                onChange={(e) => setState((s) => ({ ...s, extra: e.target.value }))}
              />
            </div>
          </form>

          <aside className="psm-panel" aria-labelledby="psm-panel-title">
            <p className="psm-kicker psm-kicker--light">{psmBrief.panel.kicker}</p>
            <h3 id="psm-panel-title" className="psm-panel-title">
              {psmBrief.panel.titleLines.map((line) => (
                <span key={line} className="psm-line">
                  {line}
                </span>
              ))}
            </h3>
            <dl className="psm-recap" aria-live="polite">
              {recap.map((row) => (
                <div key={row.label}>
                  <PsmIcon name={row.icon} className="psm-recap-icon" strokeWidth={1.6} />
                  <div>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="psm-btn psm-btn--yellow psm-btn--block">
              {psmBrief.panel.whatsappLabel}
              <PsmIcon name="arrowUpRight" strokeWidth={2.2} />
            </a>
            <p className="psm-panel-hint">{psmBrief.panel.hint}</p>
            <hr />
            <Link href={psmBrief.panel.contactHref} className="psm-panel-contact">
              {psmBrief.panel.contactLabel}
            </Link>
            <a href={`tel:${site.phoneTel}`} className="psm-panel-phone">
              <span className="psm-icon-disc psm-icon-disc--light" aria-hidden="true">
                <PsmIcon name="phone" strokeWidth={2} />
              </span>
              {site.phoneDisplay}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
