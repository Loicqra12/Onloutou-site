"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BriefContactSave } from "@/components/forms/BriefContactSave";
import {
  buildProjectBriefSummary,
  buildProjectWhatsAppUrl,
  projectsBriefOptions,
} from "@/content/projects-page";

export function ProjectBriefBuilder() {
  const [domainLabel, setDomainLabel] = useState(projectsBriefOptions.domains[0].label);
  const [situationLabel, setSituationLabel] = useState(projectsBriefOptions.situations[0].label);
  const [usersLabel, setUsersLabel] = useState(projectsBriefOptions.users[0].label);
  const [needLabel, setNeedLabel] = useState(projectsBriefOptions.needs[0].label);
  const [zoneLabel, setZoneLabel] = useState(projectsBriefOptions.zones[0].label);
  const [timelineLabel, setTimelineLabel] = useState(projectsBriefOptions.timelines[0].label);

  const selection = useMemo(
    () => ({
      domainLabel,
      situationLabel,
      usersLabel,
      needLabel,
      zoneLabel,
      timelineLabel,
    }),
    [domainLabel, situationLabel, usersLabel, needLabel, zoneLabel, timelineLabel],
  );

  const summary = useMemo(() => buildProjectBriefSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildProjectWhatsAppUrl(selection), [selection]);

  const fieldsets = [
    { legend: "Domaine principal", name: "proj-domain", options: projectsBriefOptions.domains, value: domainLabel, set: setDomainLabel },
    { legend: "Situation actuelle", name: "proj-situation", options: projectsBriefOptions.situations, value: situationLabel, set: setSituationLabel },
    { legend: "Utilisateurs concernés", name: "proj-users", options: projectsBriefOptions.users, value: usersLabel, set: setUsersLabel },
    { legend: "Besoin attendu", name: "proj-need", options: projectsBriefOptions.needs, value: needLabel, set: setNeedLabel },
    { legend: "Zone", name: "proj-zone", options: projectsBriefOptions.zones, value: zoneLabel, set: setZoneLabel },
    { legend: "Calendrier", name: "proj-timeline", options: projectsBriefOptions.timelines, value: timelineLabel, set: setTimelineLabel },
  ] as const;

  return (
    <section
      id="brief-projet"
      className="proj-brief section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="proj-brief-title"
    >
      <div className="container-content proj-brief__inner">
        <h2 id="proj-brief-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Préparer mon projet
        </h2>
        <p className="proj-brief__lead">
          Structurez votre besoin : la demande peut être enregistrée en ligne avec une référence (sans engagement ni devis automatique).
        </p>

        <form className="proj-brief__form" onSubmit={(e) => e.preventDefault()}>
          {fieldsets.map((fs) => (
            <fieldset key={fs.name} className="proj-brief__fieldset">
              <legend>{fs.legend}</legend>
              <div className="proj-brief__options">
                {fs.options.map((opt) => (
                  <label key={opt.id} className="proj-brief__option">
                    <input
                      type="radio"
                      name={fs.name}
                      value={opt.label}
                      checked={fs.value === opt.label}
                      onChange={() => fs.set(opt.label)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <div className="proj-brief__summary" aria-live="polite">
            <p className="proj-brief__summary-label">Résumé</p>
            <p className="proj-brief__summary-text">{summary}</p>
          </div>

          <div className="proj-brief__actions">
            <BriefContactSave
              source="projets-brief"
              type="CUSTOM_PLATFORM"
              zone={zoneLabel}
              message={summary}
              payload={selection}
              whatsappUrl={whatsappHref}
              whatsappLabel="Envoyer le brief sur WhatsApp"
              className="proj-brief__actions"
            />
            <Link href="/contact" className="proj-brief__contact link-motion">Continuer sur la page contact</Link>
          </div>
        </form>

        <noscript>
          <p className="proj-brief__noscript">
            Sans JavaScript, parcourez les options ci-dessus et contactez-nous via la{" "}
            <Link href="/contact">page contact</Link>.
          </p>
        </noscript>
      </div>
    </section>
  );
}
