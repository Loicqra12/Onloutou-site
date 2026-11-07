"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { HubRequestSavedPanel } from "@/components/forms/HubRequestSavedPanel";
import {
  buildPtnMessage,
  buildPtnWhatsAppUrl,
  ptnChecklistState,
  ptnForm,
  ptnTypeIds,
  ptnTypes,
  type PtnFormValues,
  type PtnTypeId,
} from "@/content/partners-hub";
import { contactChannelError, parseContactChannel, ptnTypeToApiType } from "@/lib/forms/ptnTypeToApi";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";
import { PtnIcon } from "./PtnIcon";

const empty: PtnFormValues = { type: "", name: "", zone: "", description: "", availability: "", goal: "", person: "", channel: "" };

const subscribeNever = () => () => {};

export function PtnProposalForm() {
  const uid = useId();
  const [picked, setPicked] = useState<PtnFormValues>(empty);
  const [showError, setShowError] = useState(false);
  const { reference, saveError, pending, submit } = useHubRequestSubmit();

  // Type présélectionné par une carte du hub : /devenir-partenaire?type=… (lu après l'hydratation).
  const search = useSyncExternalStore(subscribeNever, () => window.location.search, () => "");
  const urlType = new URLSearchParams(search).get("type") ?? "";
  const presetType: PtnFormValues["type"] = (ptnTypeIds as readonly string[]).includes(urlType) ? (urlType as PtnTypeId) : "";
  const values: PtnFormValues = { ...picked, type: picked.type || presetType };

  const set = <K extends keyof PtnFormValues>(key: K, value: PtnFormValues[K]) => setPicked((current) => ({ ...current, [key]: value }));

  const message = buildPtnMessage(values);
  const [activityOk, zoneOk, contactOk] = ptnChecklistState(values);
  const missing = {
    type: values.type === "",
    name: values.name.trim() === "",
    zone: values.zone.trim() === "",
    description: values.description.trim() === "",
    person: values.person.trim() === "",
    channel: contactChannelError(values.channel) !== null,
  };
  const hasMissing = Object.values(missing).some(Boolean);
  const errorVisible = showError && hasMissing;
  const channelHint = values.channel.trim() !== "" && contactChannelError(values.channel) ? ` ${contactChannelError(values.channel)}` : "";
  const invalid = (key: keyof typeof missing) => showError && missing[key];

  // Étapes : l'étape en cours est la première section incomplète.
  const sectionDone = [!missing.type && !missing.name && !missing.zone, !missing.description, !missing.person && !missing.channel];
  const current = sectionDone.findIndex((done) => !done);
  const reached = current === -1 ? 3 : current + 1;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasMissing) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const wa = buildPtnWhatsAppUrl(values);
    const channel = parseContactChannel(values.channel);
    const outcome = await submit({
      source: "devenir-partenaire-proposition",
      type: values.type ? ptnTypeToApiType(values.type) : "OTHER",
      contactName: values.person.trim(),
      organization: values.name.trim() || undefined,
      zone: values.zone.trim() || undefined,
      contactPhone: channel.phone,
      contactEmail: channel.email,
      message,
      payload: values as unknown as Record<string, unknown>,
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    if (!outcome.saved && "apiDisabled" in outcome && outcome.apiDisabled) {
      window.open(wa, "_blank", "noopener,noreferrer");
    }
  };

  const f = ptnForm;
  const errorId = `${uid}-error`;
  const describedBy = errorVisible ? errorId : undefined;

  return (
    <section id={f.id} className="ptn-form-section" aria-labelledby="ptn-form-title">
      <h2 id="ptn-form-title" className="ptn-h2">
        {f.title}
      </h2>
      <ol className="ptn-progress" aria-label="Étapes de la proposition">
        {f.steps.map((label, index) => (
          <li key={label} className={`ptn-progress__item${index < reached ? " is-reached" : ""}`}>
            <span className="ptn-progress__num">{String(index + 1).padStart(2, "0")}</span>
            <span className="ptn-progress__label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="ptn-form-grid">
        <form className="ptn-form" onSubmit={onSubmit} noValidate>
          <fieldset className="ptn-group">
            <legend className="ptn-group__title">
              <span className="ptn-group__num">01</span> {f.activity.title}
            </legend>
            <p className="ptn-label" id={`${uid}-type-label`}>
              {f.activity.typeLegend} <span className="ptn-req" aria-hidden="true">*</span>
            </p>
            <div className="ptn-types" role="radiogroup" aria-labelledby={`${uid}-type-label`} aria-required="true">
              {ptnTypes.map((type) => (
                <label key={type.id} className={`ptn-type${values.type === type.id ? " is-checked" : ""}${invalid("type") ? " is-invalid" : ""}`}>
                  <input
                    type="radio"
                    name="ptn-type"
                    value={type.id}
                    checked={values.type === type.id}
                    onChange={() => set("type", type.id)}
                  />
                  <span className="ptn-type__dot" aria-hidden="true" />
                  <span className="ptn-type__copy">
                    <strong>{type.label}</strong>
                    <span>{type.text}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="ptn-pair">
              <div className="ptn-field">
                <label htmlFor={`${uid}-name`}>
                  {f.activity.name.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  autoComplete="organization"
                  required
                  aria-required="true"
                  aria-invalid={invalid("name")}
                  aria-describedby={describedBy}
                  placeholder={f.activity.name.placeholder}
                  value={values.name}
                  onChange={(event) => set("name", event.target.value)}
                />
              </div>
              <div className="ptn-field">
                <label htmlFor={`${uid}-zone`}>
                  {f.activity.zone.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${uid}-zone`}
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={invalid("zone")}
                  aria-describedby={describedBy}
                  placeholder={f.activity.zone.placeholder}
                  value={values.zone}
                  onChange={(event) => set("zone", event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="ptn-group">
            <legend className="ptn-group__title">
              <span className="ptn-group__num">02</span> {f.proposal.title}
            </legend>
            <div className="ptn-field">
              <label htmlFor={`${uid}-description`}>
                {f.proposal.description.label} <span className="ptn-req" aria-hidden="true">*</span>
              </label>
              <textarea
                id={`${uid}-description`}
                rows={4}
                required
                aria-required="true"
                aria-invalid={invalid("description")}
                aria-describedby={describedBy}
                placeholder={f.proposal.description.placeholder}
                value={values.description}
                onChange={(event) => set("description", event.target.value)}
              />
            </div>
            <div className="ptn-pair">
              <div className="ptn-field">
                <label htmlFor={`${uid}-availability`}>{f.proposal.availability.label}</label>
                <input
                  id={`${uid}-availability`}
                  type="text"
                  placeholder={f.proposal.availability.placeholder}
                  value={values.availability}
                  onChange={(event) => set("availability", event.target.value)}
                />
              </div>
              <div className="ptn-field">
                <label htmlFor={`${uid}-goal`}>{f.proposal.goal.label}</label>
                <input
                  id={`${uid}-goal`}
                  type="text"
                  placeholder={f.proposal.goal.placeholder}
                  value={values.goal}
                  onChange={(event) => set("goal", event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="ptn-group">
            <legend className="ptn-group__title">
              <span className="ptn-group__num">03</span> {f.contact.title}
            </legend>
            <div className="ptn-pair">
              <div className="ptn-field">
                <label htmlFor={`${uid}-person`}>
                  {f.contact.person.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${uid}-person`}
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={invalid("person")}
                  aria-describedby={describedBy}
                  placeholder={f.contact.person.placeholder}
                  value={values.person}
                  onChange={(event) => set("person", event.target.value)}
                />
              </div>
              <div className="ptn-field">
                <label htmlFor={`${uid}-channel`}>
                  {f.contact.channel.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${uid}-channel`}
                  type="text"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={invalid("channel")}
                  aria-describedby={describedBy}
                  placeholder={f.contact.channel.placeholder}
                  value={values.channel}
                  onChange={(event) => set("channel", event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <p className="ptn-form__required">
            <span className="ptn-req" aria-hidden="true">*</span> {f.requiredNote}
          </p>
          {errorVisible ? (
            <p id={errorId} className="ptn-form__error" role="alert">
              {f.error}
              {channelHint}
            </p>
          ) : null}
          <div className="ptn-form__submit">
            <button type="submit" className="ptn-btn ptn-btn--yellow" disabled={pending}>
              {pending ? "Enregistrement…" : f.submit}
              <PtnIcon name="arrowRight" className="ptn-btn__icon" />
            </button>
            <p className="ptn-form__note">{f.submitNote}</p>
            <HubRequestSavedPanel
              reference={reference}
              saveError={saveError}
              pending={pending}
              whatsappUrl={buildPtnWhatsAppUrl(values)}
              whatsappLabel="Continuer sur WhatsApp"
              className="ptn-prepared"
            />
          </div>
        </form>

        <aside className="ptn-panel" aria-labelledby="ptn-panel-title">
          <h3 id="ptn-panel-title" className="ptn-panel__title">
            {f.panel.title}
          </h3>
          <div className="ptn-panel__body" aria-live="polite">
            {message ? (
              <p className="ptn-panel__message" data-testid="ptn-summary">
                {message}
              </p>
            ) : (
              <>
                <PtnIcon name="doc" className="ptn-panel__doc" />
                <p className="ptn-panel__empty">{f.panel.empty}</p>
              </>
            )}
          </div>
          <ul className="ptn-checklist" aria-label="Points à renseigner">
            {f.panel.checklist.map((item, index) => {
              const ok = [activityOk, zoneOk, contactOk][index];
              return (
                <li key={item} className={ok ? "is-ok" : ""} data-ok={ok ? "true" : "false"}>
                  <span className="ptn-checklist__tick" aria-hidden="true">
                    <PtnIcon name="check" />
                  </span>
                  <span>{item}</span>
                  <span className="ptn-sr">{ok ? " (renseigné)" : " (à renseigner)"}</span>
                </li>
              );
            })}
          </ul>
          <p className="ptn-panel__note">{f.panel.note}</p>
        </aside>
      </div>
    </section>
  );
}