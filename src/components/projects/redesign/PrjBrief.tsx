"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { hubContactValidationError } from "@/lib/forms/hubPrepare";
import { appendReferenceToWhatsAppUrl, requestRecordedMessage, useHubRequestSubmit } from "@/lib/forms/serviceRequest";
import {
  buildPrjMessage,
  buildPrjWhatsAppUrl,
  prjBrief,
  prjImages,
  type PrjBriefValues,
} from "@/content/projects-hub";
import Image from "next/image";
import { PrjIcon } from "./PrjIcon";

const empty: PrjBriefValues = { need: "", description: "", name: "", phone: "", email: "", organisation: "", place: "", deadline: "" };

export function PrjBrief() {
  const uid = useId();
  const [values, setValues] = useState<PrjBriefValues>(empty);
  const [showError, setShowError] = useState(false);
  const message = buildPrjMessage(values);
  const { reference, saveError, pending, submit, resetSubmit } = useHubRequestSubmit();
  const contactError = hubContactValidationError(values.name, values.phone, values.email);
  const descriptionInvalid = showError && values.description.trim() === "";
  const nameInvalid = showError && values.name.trim() === "";
  const contactInvalid = showError && contactError !== null && !nameInvalid;
  const errorVisible = descriptionInvalid || nameInvalid || contactInvalid;
  const hero = prjImages.hero;

  const set = (key: keyof PrjBriefValues) => (value: string) => {
    resetSubmit();
    setValues((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (values.description.trim() === "" || contactError !== null) {
      setShowError(true);
      return;
    }
    setShowError(false);
    const outcome = await submit({
      source: "projets-brief",
      type: "CUSTOM_PLATFORM",
      contactName: values.name.trim(),
      contactPhone: values.phone.trim() || undefined,
      contactEmail: values.email.trim() || undefined,
      organization: values.organisation.trim() || undefined,
      zone: values.place.trim() || undefined,
      message: buildPrjMessage(values),
      payload: { need: values.need, deadline: values.deadline.trim() || undefined },
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    if (outcome.apiDisabled) {
      window.open(buildPrjWhatsAppUrl(values), "_blank", "noopener,noreferrer");
    }
  };

  const fields = prjBrief.fields;

  return (
    <section id={prjBrief.id} className="prj-brief" aria-labelledby="prj-brief-title">
      <div className="prj-brief__backdrop" aria-hidden="true">
        <Image src={hero.src} alt="" width={hero.width} height={hero.height} sizes="48vw" className="prj-brief__backdrop-img" />
      </div>
      <header className="prj-head prj-brief__head">
        <p className="prj-eyebrow">{prjBrief.eyebrow}</p>
        <h2 id="prj-brief-title" className="prj-h2">
          {prjBrief.titleLines.map((line) => (
            <span key={line} className="prj-line">
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className="prj-lead">{prjBrief.lead}</p>
      </header>

      <div className="prj-brief__grid">
        <form className="prj-form" onSubmit={onSubmit} noValidate>
          <h3 className="prj-form__title">{prjBrief.formTitle}</h3>

          <fieldset className="prj-form__needs">
            <legend>{prjBrief.needLegend}</legend>
            <div className="prj-form__radios">
              {prjBrief.needs.map((need) => (
                <label key={need} className={`prj-radio${values.need === need ? " is-checked" : ""}`}>
                  <input
                    type="radio"
                    name="prj-need"
                    value={need}
                    checked={values.need === need}
                    onChange={() => set("need")(need)}
                  />
                  <span className="prj-radio__dot" aria-hidden="true" />
                  <span>{need}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="prj-field">
            <label htmlFor={`${uid}-description`}>
              {fields.description.label} <span className="prj-req" aria-hidden="true">*</span>
            </label>
            <textarea
              id={`${uid}-description`}
              name="description"
              rows={4}
              required
              aria-required="true"
              aria-invalid={descriptionInvalid}
              aria-describedby={errorVisible ? `${uid}-error` : undefined}
              placeholder={fields.description.placeholder}
              value={values.description}
              onChange={(event) => set("description")(event.target.value)}
            />
          </div>

          <div className="prj-form__pair">
            <div className="prj-field">
              <label htmlFor={`${uid}-name`}>
                {fields.name.label} <span className="prj-req" aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={nameInvalid}
                aria-describedby={errorVisible ? `${uid}-error` : undefined}
                placeholder={fields.name.placeholder}
                value={values.name}
                onChange={(event) => set("name")(event.target.value)}
              />
            </div>
            <div className="prj-field">
              <label htmlFor={`${uid}-organisation`}>{fields.organisation.label}</label>
              <input
                id={`${uid}-organisation`}
                name="organisation"
                type="text"
                autoComplete="organization"
                placeholder={fields.organisation.placeholder}
                value={values.organisation}
                onChange={(event) => set("organisation")(event.target.value)}
              />
            </div>
          </div>

          <div className="prj-form__pair">
            <div className="prj-field">
              <label htmlFor={`${uid}-phone`}>
                {fields.phone.label} <span className="prj-req" aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={contactInvalid}
                aria-describedby={errorVisible ? `${uid}-error` : undefined}
                placeholder={fields.phone.placeholder}
                value={values.phone}
                onChange={(event) => set("phone")(event.target.value)}
              />
            </div>
            <div className="prj-field">
              <label htmlFor={`${uid}-email`}>{fields.email.label}</label>
              <input
                id={`${uid}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={fields.email.placeholder}
                value={values.email}
                onChange={(event) => set("email")(event.target.value)}
              />
            </div>
          </div>

          <div className="prj-form__pair">
            <div className="prj-field">
              <label htmlFor={`${uid}-place`}>{fields.place.label}</label>
              <input
                id={`${uid}-place`}
                name="place"
                type="text"
                placeholder={fields.place.placeholder}
                value={values.place}
                onChange={(event) => set("place")(event.target.value)}
              />
            </div>
            <div className="prj-field">
              <label htmlFor={`${uid}-deadline`}>{fields.deadline.label}</label>
              <input
                id={`${uid}-deadline`}
                name="deadline"
                type="text"
                placeholder={fields.deadline.placeholder}
                value={values.deadline}
                onChange={(event) => set("deadline")(event.target.value)}
              />
            </div>
          </div>

          <p className="prj-form__required">
            <span className="prj-req" aria-hidden="true">*</span> {prjBrief.requiredNote}
          </p>
          {errorVisible ? (
            <p id={`${uid}-error`} className="prj-form__error" role="alert">
              {prjBrief.error}
            </p>
          ) : null}

          {saveError ? (
            <p className="prj-form__error" role="alert">
              {saveError}
            </p>
          ) : null}
          {reference ? (
            <p className="prj-form__success" role="status">
              {requestRecordedMessage(reference)}
            </p>
          ) : null}

          <button type="submit" className="prj-btn prj-btn--yellow prj-btn--block prj-btn--lg" disabled={pending}>
            {pending ? prjBrief.saving : prjBrief.submit}
            <PrjIcon name="arrowRight" className="prj-btn__icon" />
          </button>
          {reference ? (
            <a
              href={appendReferenceToWhatsAppUrl(buildPrjWhatsAppUrl(values), reference)}
              className="prj-btn prj-btn--outline prj-btn--block"
              target="_blank"
              rel="noopener noreferrer"
            >
              {prjBrief.whatsappAfter}
            </a>
          ) : null}
          <p className="prj-form__note">{prjBrief.submitNote}</p>
        </form>

        <aside className="prj-panel" aria-labelledby="prj-panel-title">
          <div className="prj-panel__head">
            <PrjIcon name="chat" className="prj-panel__icon" />
            <h3 id="prj-panel-title" className="prj-panel__title">
              {prjBrief.panel.title}
            </h3>
          </div>
          <div className="prj-panel__body" aria-live="polite">
            {message ? (
              <p className="prj-panel__message" data-testid="prj-summary">
                {message}
              </p>
            ) : (
              <>
                <span className="prj-panel__dash" aria-hidden="true" />
                <p className="prj-panel__empty">{prjBrief.panel.empty}</p>
              </>
            )}
          </div>
          <div className="prj-panel__contact">
            <p className="prj-panel__contact-title">{prjBrief.panel.contactTitle}</p>
            <Link href={prjBrief.panel.contact.href} className="prj-btn prj-btn--outline prj-btn--block">
              {prjBrief.panel.contact.label}
              <PrjIcon name="arrowUpRight" className="prj-btn__icon" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}