"use client";

import { Suspense, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { articleFamilyFromSlug } from "@/content/article-families";
import {
  buildCtcWhatsAppUrl,
  ctcFamilyNote,
  ctcForm,
  ctcNeeds,
  type CtcNeedId,
  type CtcValues,
} from "@/content/contact-hub";
import { ELM_FAMILY_LABEL } from "@/content/electromenager";
import { apiEnabled, submitContactRequest } from "@/lib/api/client";
import { clearElmRequest, elmRequestMessage, readElmRequest } from "@/lib/electromenager-request";
import { newClientRequestId } from "@/lib/forms/serviceRequest";
import { CtcIcon } from "./CtcIcon";

const empty: CtcValues = {
  need: "",
  familyLabel: "",
  name: "",
  phone: "",
  email: "",
  organisation: "",
  zone: "",
  deadline: "",
  message: "",
};

const phoneDigits = (value: string) => value.replace(/\D/g, "").length;

function parseNeed(raw: string | null): CtcNeedId | "" {
  return ctcNeeds.some((item) => item.id === raw) ? (raw as CtcNeedId) : "";
}

function intentFromSearch(search: URLSearchParams): Pick<CtcValues, "need" | "familyLabel" | "message"> {
  const free = search.get("article") === "libre";
  if (free) return { need: "autre", familyLabel: "", message: "" };
  const family = articleFamilyFromSlug(search.get("famille"));
  const otherAppliance = search.get("appareil") === "libre";
  if (family) {
    return {
      need: parseNeed(search.get("need")) || "location",
      familyLabel: family.label,
      message: otherAppliance ? "Je cherche un autre appareil électroménager." : "",
    };
  }
  return { need: parseNeed(search.get("need")), familyLabel: "", message: "" };
}

export function CtcForm() {
  return (
    <Suspense fallback={<CtcFormFields intent={{ need: "", familyLabel: "", message: "" }} />}>
      <CtcFormFromUrl />
    </Suspense>
  );
}

function CtcFormFromUrl() {
  const searchParams = useSearchParams();
  const intent = intentFromSearch(searchParams);
  return <CtcFormFields intent={intent} />;
}

function CtcFormFields({ intent }: { intent: Pick<CtcValues, "need" | "familyLabel" | "message"> }) {
  const uid = useId();
  const [rawValues, setValues] = useState<CtcValues>({ ...empty, ...intent });
  const values: CtcValues = {
    ...rawValues,
    need: rawValues.need || intent.need,
    familyLabel: rawValues.need && rawValues.need !== "location" ? "" : rawValues.familyLabel || intent.familyLabel,
    message: rawValues.message || intent.message,
  };
  const [showError, setShowError] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const clientRequestIdRef = useRef<string | null>(null);
  const set = <K extends keyof CtcValues>(key: K, value: CtcValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    setValues((current) => ({
      ...current,
      need: intent.need,
      familyLabel: intent.familyLabel,
      message: intent.message || current.message,
    }));
  }, [intent.need, intent.familyLabel, intent.message]);

  useEffect(() => {
    if (intent.familyLabel !== ELM_FAMILY_LABEL) return;
    const cart = readElmRequest();
    if (!cart.items.length) return;
    setValues((current) => ({
      ...current,
      zone: current.zone || cart.zone,
      deadline: current.deadline || cart.dates,
      message: current.message.trim() ? current.message : elmRequestMessage(cart),
    }));
  }, [intent.familyLabel]);

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
  const familyVisible = values.need === "location" && values.familyLabel.trim() !== "";
  const freeVisible = values.need === "autre" && intent.familyLabel === "" && intent.need === "autre";

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
        familyLabel: familyVisible ? values.familyLabel.trim() : undefined,
        sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        clientRequestId: clientRequestIdRef.current,
      });

      if (!result.ok) {
        if (result.status === 409) clientRequestIdRef.current = null;
        setSaveError(result.error || ctcForm.saveError);
        return;
      }
      setReference(result.data.reference);
      if (values.familyLabel === ELM_FAMILY_LABEL) clearElmRequest();
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
          {familyVisible ? (
            <p className="ctc-family" role="status">
              <span className="ctc-family__kicker">{ctcFamilyNote.selected}</span>
              <strong>{values.familyLabel}</strong>
            </p>
          ) : null}
          {freeVisible ? (
            <p className="ctc-family ctc-family--free" role="status">
              {ctcFamilyNote.free}
            </p>
          ) : null}
          <div className="ctc-needs" role="radiogroup" aria-labelledby={`${uid}-need-label`} aria-required="true">
            {ctcNeeds.map((item) => (
              <label key={item.id} className={`ctc-need${values.need === item.id ? " is-checked" : ""}${invalid("need") ? " is-invalid" : ""}`}>
                <input
                  type="radio"
                  name="ctc-need"
                  value={item.id}
                  checked={values.need === item.id}
                  onChange={() => set("need", item.id)}
                />
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
