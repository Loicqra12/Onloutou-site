"use client";

import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { buildCtcWhatsAppUrl, ctcForm, ctcNeeds, type CtcNeedId, type CtcValues } from "@/content/contact-hub";
import { apiEnabled, submitContactRequest } from "@/lib/api/client";
import { newClientRequestId } from "@/lib/forms/serviceRequest";
import { CtcIcon } from "./CtcIcon";

const empty: CtcValues = { need: "", name: "", phone: "", email: "", organisation: "", zone: "", deadline: "", message: "" };

const phoneDigits = (value: string) => value.replace(/\D/g, "").length;
const subscribeNever = () => () => {};

function initialNeedFromUrl(): CtcNeedId | "" {
  if (typeof window === "undefined") return "";
  const need = new URLSearchParams(window.location.search).get("need") ?? "";
  return (ctcNeeds.some((n) => n.id === need) ? need : "") as CtcNeedId | "";
}

export function CtcForm() {
  const uid = useId();
  const urlNeed = useSyncExternalStore(subscribeNever, initialNeedFromUrl, () => "");
  const [rawValues, setValues] = useState<CtcValues>(empty);
  // Le besoin choisi à la main prime ; sinon on reprend ?need= de l’URL, sans effet.
  const values: CtcValues = { ...rawValues, need: rawValues.need || (urlNeed as CtcNeedId | "") };
  const [showError, setShowError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const clientRequestIdRef = useRef<string | null>(null);
  const set = <K extends keyof CtcValues>(key: K, value: CtcValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const missing = {
    need: values.need === "",
    name: values.name.trim() === "",
    phone: phoneDigits(values.phone) < 8,
    email: values.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()),
    message: values.message.trim() === "",
  };
  const hasMissing = Object.values(missing).some(Boolean);
  const errorVisible = showError && hasMissing;
  const invalid = (key: keyof typeof missing) => showError && missing[key];
  const errorId = `${uid}-error`;
  const describedBy = errorVisible ? errorId : undefined;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasMissing) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setSaveError(null);
    setReference(null);

    if (!apiEnabled()) {
      window.open(buildCtcWhatsAppUrl(values), "_blank", "noopener,noreferrer");
      return;
    }

    setPending(true);
    try {
      if (!clientRequestIdRef.current) {
        clientRequestIdRef.current = newClientRequestId();
      }
      const result = await submitContactRequest({
        source: "contact",
        need: values.need as CtcNeedId,
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        organisation: values.organisation.trim() || undefined,
        zone: values.zone.trim() || undefined,
        deadline: values.deadline.trim() || undefined,
        message: values.message.trim(),
        sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        clientRequestId: clientRequestIdRef.current,
      });

      if (!result.ok) {
        // 409 : la même clé a déjà enregistré un contenu différent (message modifié après
        // une réponse perdue). On repart d’une nouvelle clé pour que le prochain essai passe.
        if (result.status === 409) clientRequestIdRef.current = null;
        setSaveError(result.error || ctcForm.saveError);
        return;
      }
      setReference(result.data.reference);
    } finally {
      setPending(false);
    }
  };

  const openWhatsApp = () => {
    window.open(buildCtcWhatsAppUrl(values), "_blank", "noopener,noreferrer");
  };

  const f = ctcForm;
  return (
    <section className="ctc-form-card" aria-labelledby="ctc-form-title">
      <h2 id="ctc-form-title" className="ctc-h2 ctc-h2--form">
        {f.title}
      </h2>
      <form className="ctc-form" onSubmit={onSubmit} noValidate>
        <div className="ctc-field">
          <p className="ctc-label" id={`${uid}-need-label`}>
            {f.needLegend} <span className="ctc-req" aria-hidden="true">*</span>
          </p>
          <div className="ctc-needs" role="radiogroup" aria-labelledby={`${uid}-need-label`} aria-required="true">
            {ctcNeeds.map((item) => (
              <label key={item.id} className={`ctc-need${values.need === item.id ? " is-checked" : ""}${invalid("need") ? " is-invalid" : ""}`}>
                <input type="radio" name="ctc-need" value={item.id} checked={values.need === item.id} onChange={() => set("need", item.id)} />
                <CtcIcon name={item.icon} className="ctc-need__icon" />
                <span className="ctc-need__label">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="ctc-pair">
          <div className="ctc-field">
            <label htmlFor={`${uid}-name`} className="ctc-label">
              {f.name.label} <span className="ctc-req" aria-hidden="true">*</span>
            </label>
            <input
              id={`${uid}-name`}
              className="ctc-input"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={invalid("name")}
              aria-describedby={describedBy}
              placeholder={f.name.placeholder}
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
            />
          </div>
          <div className="ctc-field">
            <label htmlFor={`${uid}-organisation`} className="ctc-label">
              {f.organisation.label}
            </label>
            <input
              id={`${uid}-organisation`}
              className="ctc-input"
              type="text"
              autoComplete="organization"
              placeholder={f.organisation.placeholder}
              value={values.organisation}
              onChange={(event) => set("organisation", event.target.value)}
            />
          </div>
        </div>

        <div className="ctc-pair">
          <div className="ctc-field">
            <label htmlFor={`${uid}-phone`} className="ctc-label">
              {f.phone.label} <span className="ctc-req" aria-hidden="true">*</span>
            </label>
            <input
              id={`${uid}-phone`}
              className="ctc-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              aria-required="true"
              aria-invalid={invalid("phone")}
              aria-describedby={describedBy}
              placeholder={f.phone.placeholder}
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
            />
          </div>
          <div className="ctc-field">
            <label htmlFor={`${uid}-email`} className="ctc-label">
              {f.email.label}
            </label>
            <input
              id={`${uid}-email`}
              className="ctc-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={invalid("email")}
              aria-describedby={describedBy}
              placeholder={f.email.placeholder}
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
            />
          </div>
        </div>

        <div className="ctc-pair">
          <div className="ctc-field">
            <label htmlFor={`${uid}-zone`} className="ctc-label">
              {f.zone.label}
            </label>
            <input
              id={`${uid}-zone`}
              className="ctc-input"
              type="text"
              placeholder={f.zone.placeholder}
              value={values.zone}
              onChange={(event) => set("zone", event.target.value)}
            />
          </div>
          <div className="ctc-field">
            <label htmlFor={`${uid}-deadline`} className="ctc-label">
              {f.deadline.label}
            </label>
            <input
              id={`${uid}-deadline`}
              className="ctc-input"
              type="text"
              placeholder={f.deadline.placeholder}
              value={values.deadline}
              onChange={(event) => set("deadline", event.target.value)}
            />
          </div>
        </div>

        <div className="ctc-field">
          <label htmlFor={`${uid}-message`} className="ctc-label">
            {f.message.label} <span className="ctc-req" aria-hidden="true">*</span>
          </label>
          <textarea
            id={`${uid}-message`}
            className="ctc-input ctc-input--area"
            rows={4}
            required
            aria-required="true"
            aria-invalid={invalid("message")}
            aria-describedby={describedBy}
            placeholder={f.message.placeholder}
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
          />
        </div>

        <p className="ctc-form__required">
          <span className="ctc-req" aria-hidden="true">*</span> {f.requiredNote}
        </p>
        {errorVisible ? (
          <p id={errorId} className="ctc-form__error" role="alert">
            {missing.need || missing.name || values.message.trim() === ""
              ? f.error
              : missing.phone
                ? f.phoneError
                : f.emailError}
          </p>
        ) : null}
        {saveError ? (
          <p className="ctc-form__error" role="alert">
            {saveError}
          </p>
        ) : null}
        {reference ? (
          <p className="ctc-form__success" role="status">
            {f.saveSuccess(reference)}
          </p>
        ) : null}
        <div className="ctc-form__submit">
          <button type="submit" className="ctc-btn ctc-btn--yellow" disabled={pending}>
            {pending ? f.saving : f.submit}
            <CtcIcon name="arrowRight" className="ctc-btn__icon" />
          </button>
          {reference ? (
            <button type="button" className="ctc-btn ctc-btn--ghost" onClick={openWhatsApp}>
              {f.submitWhatsApp}
            </button>
          ) : null}
          <p className="ctc-form__note">{f.submitNote}</p>
        </div>
      </form>
    </section>
  );
}
