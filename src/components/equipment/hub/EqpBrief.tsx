"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  buildEqpWhatsAppUrl,
  eqpBrief,
  eqpBriefDefaults,
  summarizeEqpBrief,
  type EqpBriefState,
} from "@/content/equipment-hub";
import { EqpIcon } from "./EqpIcon";

function Select({
  id,
  value,
  options,
  onChange,
  label,
}: {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="eqp-select">
      <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <EqpIcon name="chevronDown" />
    </div>
  );
}

export function EqpBrief() {
  const uid = useId();
  const [state, setState] = useState<EqpBriefState>(eqpBriefDefaults);
  const set = <K extends keyof EqpBriefState>(key: K, value: EqpBriefState[K]) => setState((s) => ({ ...s, [key]: value }));

  const summary = useMemo(() => summarizeEqpBrief(state), [state]);
  const whatsappHref = useMemo(() => buildEqpWhatsAppUrl(state), [state]);

  const toggleService = (label: string) =>
    setState((s) => ({
      ...s,
      services: s.services.includes(label) ? s.services.filter((v) => v !== label) : [...s.services, label],
    }));

  const recap: [string, string][] = [
    ["Famille", summary.family],
    ["Mode", summary.mode],
    ["Usage", summary.usage],
    ["Quantité", summary.quantity],
    ["Zone", summary.zone],
    ["Durée", summary.duration],
  ];
  if (summary.services) recap.push(["Services", summary.services]);

  return (
    <section id={eqpBrief.id} className="eqp-section eqp-brief" aria-labelledby="eqp-brief-title">
      <div className="eqp-wrap">
        <h2 id="eqp-brief-title" className="eqp-h2 eqp-h2--lg eqp-h2--dot">
          {eqpBrief.title}
          <span className="eqp-dot" aria-hidden="true">.</span>
        </h2>
        <p className="eqp-lead eqp-lead--sm">{eqpBrief.lead}</p>

        <div className="eqp-brief__grid">
          <form className="eqp-form" onSubmit={(e) => e.preventDefault()} aria-label="Demande d’équipement">
            <fieldset className="eqp-q">
              <legend>
                <span className="eqp-q__n">01</span>
                <span className="eqp-q__t">Famille recherchée</span>
                <span className="eqp-q__h">Sélectionnez une famille d’équipements.</span>
              </legend>
              <div className="eqp-tiles eqp-tiles--6">
                {eqpBrief.families.map((f) => (
                  <label key={f.id} className="eqp-tile">
                    <input
                      type="radio"
                      name={`${uid}-family`}
                      value={f.id}
                      checked={state.family === f.id}
                      onChange={() => set("family", f.id)}
                    />
                    <span className="eqp-tile__box">
                      <EqpIcon name={f.icon} strokeWidth={1.5} />
                      <span>{f.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="eqp-q">
              <legend>
                <span className="eqp-q__n">02</span>
                <span className="eqp-q__t">Mode envisagé</span>
                <span className="eqp-q__h">Quel mode souhaitez-vous explorer ?</span>
              </legend>
              <div className="eqp-tiles eqp-tiles--4">
                {eqpBrief.modes.map((m) => (
                  <label key={m.id} className="eqp-tile">
                    <input
                      type="radio"
                      name={`${uid}-mode`}
                      value={m.id}
                      checked={state.mode === m.id}
                      onChange={() => set("mode", m.id)}
                    />
                    <span className="eqp-tile__box">
                      <EqpIcon name={m.icon} strokeWidth={1.5} />
                      <span>{m.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="eqp-q">
              <label className="eqp-q__legend" htmlFor={`${uid}-usage`}>
                <span className="eqp-q__n">03</span>
                <span className="eqp-q__t">Usage principal</span>
                <span className="eqp-q__h">Dans quel contexte utilisez-vous cet équipement ?</span>
              </label>
              <Select id={`${uid}-usage`} label="Usage principal" value={state.usage} options={eqpBrief.usages} onChange={(v) => set("usage", v)} />
            </div>

            <div className="eqp-q eqp-q--split">
              <div>
                <label className="eqp-q__legend" htmlFor={`${uid}-qty`}>
                  <span className="eqp-q__n">04</span>
                  <span className="eqp-q__t">Quantité</span>
                  <span className="eqp-q__h">Combien d’unités ?</span>
                </label>
                <Select id={`${uid}-qty`} label="Quantité" value={state.quantity} options={eqpBrief.quantities} onChange={(v) => set("quantity", v)} />
              </div>
              <div>
                <label className="eqp-q__legend eqp-q__legend--zone" htmlFor={`${uid}-zone`}>
                  <span className="eqp-q__t">Zone</span>
                  <span className="eqp-q__h">Où en avez-vous besoin ?</span>
                </label>
                <Select id={`${uid}-zone`} label="Zone" value={state.zone} options={eqpBrief.zones} onChange={(v) => set("zone", v)} />
              </div>
            </div>

            <div className="eqp-q">
              <label className="eqp-q__legend" htmlFor={`${uid}-duration`}>
                <span className="eqp-q__n">05</span>
                <span className="eqp-q__t">Durée ou échéance</span>
                <span className="eqp-q__h">Quelle est votre période souhaitée ?</span>
              </label>
              <div className="eqp-input">
                <input
                  id={`${uid}-duration`}
                  type="text"
                  value={state.duration}
                  placeholder={eqpBrief.durationPlaceholder}
                  autoComplete="off"
                  onChange={(e) => set("duration", e.target.value)}
                />
                <EqpIcon name="calendar" strokeWidth={1.5} />
              </div>
            </div>

            <fieldset className="eqp-q">
              <legend>
                <span className="eqp-q__n">06</span>
                <span className="eqp-q__t">Accompagnement souhaité</span>
                <span className="eqp-q__h">Quels services vous intéressent ? (plusieurs choix possibles)</span>
              </legend>
              <div className="eqp-checks">
                {eqpBrief.services.map((label) => (
                  <label key={label} className="eqp-check">
                    <input type="checkbox" checked={state.services.includes(label)} onChange={() => toggleService(label)} />
                    <span className="eqp-check__box" aria-hidden="true">
                      <EqpIcon name="check" strokeWidth={3} />
                    </span>
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="eqp-note eqp-note--info eqp-form__notice">
              <EqpIcon name="info" />
              {eqpBrief.notice}
            </p>
          </form>

          <aside className="eqp-recap" aria-labelledby="eqp-recap-title">
            <h3 id="eqp-recap-title">Votre demande</h3>
            <p className="eqp-recap__lead">Récapitulatif de votre besoin.</p>
            <dl className="eqp-recap__list" aria-live="polite">
              {recap.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <a className="eqp-btn eqp-btn--yellow eqp-btn--block" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Préparer le message WhatsApp
              <EqpIcon name="arrowUpRight" />
            </a>
            <Link href="/contact" className="eqp-recap__alt">
              Continuer par le formulaire
              <EqpIcon name="arrowUpRight" />
            </Link>
            <p className="eqp-recap__note">Vous pourrez vérifier le message avant de l’envoyer.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
