"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TitleReveal } from "@/components/motion/TitleReveal";
import { Button } from "@/components/ui/Button";
import {
  buildPlatformBriefSummary,
  buildPlatformWhatsAppUrl,
  customPlatformsBriefOptions,
} from "@/content/custom-platforms-page";
import { site } from "@/content/site";

export function PlatformProjectBrief() {
  const [solutionLabel, setSolutionLabel] = useState(customPlatformsBriefOptions.solutionTypes[0].label);
  const [usersLabel, setUsersLabel] = useState(customPlatformsBriefOptions.users[0].label);
  const [problemLabel, setProblemLabel] = useState(customPlatformsBriefOptions.problems[0].label);
  const [integrationsLabel, setIntegrationsLabel] = useState(customPlatformsBriefOptions.integrations[0].label);
  const [maturityLabel, setMaturityLabel] = useState(customPlatformsBriefOptions.maturity[0].label);
  const [timelineLabel, setTimelineLabel] = useState(customPlatformsBriefOptions.timelines[0].label);

  const selection = useMemo(
    () => ({
      solutionLabel,
      usersLabel,
      problemLabel,
      integrationsLabel,
      maturityLabel,
      timelineLabel,
    }),
    [solutionLabel, usersLabel, problemLabel, integrationsLabel, maturityLabel, timelineLabel],
  );

  const summary = useMemo(() => buildPlatformBriefSummary(selection), [selection]);
  const whatsappHref = useMemo(() => buildPlatformWhatsAppUrl(selection), [selection]);

  const fieldsets = [
    { legend: "01 · Type de solution", name: "platform-solution", options: customPlatformsBriefOptions.solutionTypes, value: solutionLabel, set: setSolutionLabel },
    { legend: "02 · Utilisateurs concernés", name: "platform-users", options: customPlatformsBriefOptions.users, value: usersLabel, set: setUsersLabel },
    { legend: "03 · Problème principal", name: "platform-problem", options: customPlatformsBriefOptions.problems, value: problemLabel, set: setProblemLabel },
    { legend: "04 · Systèmes à connecter", name: "platform-integrations", options: customPlatformsBriefOptions.integrations, value: integrationsLabel, set: setIntegrationsLabel },
    { legend: "05 · Niveau d’avancement", name: "platform-maturity", options: customPlatformsBriefOptions.maturity, value: maturityLabel, set: setMaturityLabel },
    { legend: "06 · Calendrier", name: "platform-timeline", options: customPlatformsBriefOptions.timelines, value: timelineLabel, set: setTimelineLabel },
  ] as const;

  const recap = [
    { label: "Solution", value: solutionLabel },
    { label: "Utilisateurs", value: usersLabel },
    { label: "Objectif", value: problemLabel },
    { label: "Intégration", value: integrationsLabel },
    { label: "Avancement", value: maturityLabel },
    { label: "Calendrier", value: timelineLabel },
  ];

  return (
    <section
      id="brief-projet"
      className="platform-brief section-spacing scroll-mt-28"
      aria-labelledby="platform-brief-title"
    >
      <div className="container-content">
        <p className="platform-kicker">Votre projet</p>
        <TitleReveal as="h2" id="platform-brief-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Préparer mon projet
        </TitleReveal>
        <p className="platform-brief__lead">
          Sélectionnez des repères pour structurer un premier message — aucune donnée n’est enregistrée sur ce site.
        </p>

        <div className="platform-brief__layout">
          <form className="platform-brief__form" onSubmit={(e) => e.preventDefault()}>
            {fieldsets.map((fs) => (
              <fieldset key={fs.name} className="platform-brief__fieldset">
                <legend>{fs.legend}</legend>
                <div className="platform-brief__options">
                  {fs.options.map((opt) => (
                    <label key={opt.id} className="platform-brief__option">
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
          </form>

          <aside className="platform-brief__summary" aria-live="polite">
            <p className="platform-brief__summary-label">Votre brief</p>
            <dl>
              {recap.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd key={row.value}>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p key={summary} className="platform-brief__summary-text">
              {summary}
            </p>
            <div className="platform-brief__actions">
              <Button href={whatsappHref} variant="primary">
                Envoyer mon brief sur WhatsApp
              </Button>
              <Link href="/contact" className="platform-brief__contact link-motion">
                Continuer sur la page contact
              </Link>
              <a href={`tel:${site.phoneTel}`} className="platform-brief__phone">
                {site.phoneDisplay}
              </a>
            </div>
          </aside>
        </div>

        <noscript>
          <p className="platform-brief__noscript">
            Sans JavaScript, parcourez les options ci-dessus sous forme de liste et utilisez la page{" "}
            <Link href="/contact">contact</Link> pour nous écrire.
          </p>
        </noscript>
      </div>
    </section>
  );
}
