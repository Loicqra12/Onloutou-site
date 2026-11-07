"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { HubRequestSavedPanel } from "@/components/forms/HubRequestSavedPanel";
import {
  buildPtnDeliveryMessage,
  buildPtnDeliveryWhatsAppUrl,
  ptnDeliveryGoods,
  ptnDrvForm,
  type PtnDeliveryValues,
} from "@/content/partners-subpages";
import { contactChannelError, parseContactChannel } from "@/lib/forms/ptnTypeToApi";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";
import { PtnIcon } from "./PtnIcon";
import type { PtnIconName } from "@/content/partners-hub";

const empty: PtnDeliveryValues = { pickup: "", destination: "", goods: "", quantity: "", date: "", details: "", name: "", channel: "" };

function IconField({ icon, children }: { icon: PtnIconName; children: ReactNode }) {
  return (
    <div className="ptn-input">
      <PtnIcon name={icon} className="ptn-input__icon" />
      {children}
    </div>
  );
}

export function PtnDeliveryForm() {
  const uid = useId();
  const [values, setValues] = useState<PtnDeliveryValues>(empty);
  const [showError, setShowError] = useState(false);
  const { reference, saveError, pending, submit } = useHubRequestSubmit();
  const set = <K extends keyof PtnDeliveryValues>(key: K, value: PtnDeliveryValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const missing = {
    pickup: values.pickup.trim() === "",
    destination: values.destination.trim() === "",
    goods: values.goods === "",
    name: values.name.trim() === "",
    channel: contactChannelError(values.channel) !== null,
  };
  const hasMissing = Object.values(missing).some(Boolean);
  const errorVisible = showError && hasMissing;
  const channelHint = values.channel.trim() !== "" && contactChannelError(values.channel) ? ` ${contactChannelError(values.channel)}` : "";
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
    const message = buildPtnDeliveryMessage(values);
    const wa = buildPtnDeliveryWhatsAppUrl(values);
    const channel = parseContactChannel(values.channel);
    const outcome = await submit({
      source: "livraison-demande",
      type: "DELIVERY",
      contactName: values.name.trim(),
      zone: values.pickup.trim() || values.destination.trim() || undefined,
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

  const f = ptnDrvForm;
  const goodsLabel = ptnDeliveryGoods.find((item) => item.id === values.goods)?.label ?? "";
  const extras = [
    { label: "Bien", value: goodsLabel },
    { label: "Quantité et dimensions", value: values.quantity.trim() },
    { label: "Date souhaitée", value: values.date.trim() },
  ].filter((row) => row.value);

  return (
    <section id={f.id} className="ptn-form-section ptn-drv-form" aria-labelledby="ptn-drv-form-title">
      <h2 id="ptn-drv-form-title" className="ptn-h2">
        {f.title}
      </h2>
      <p className="ptn-form-section__lead">{f.lead}</p>

      <div className="ptn-form-grid">
        <form className="ptn-form" onSubmit={onSubmit} noValidate>
          <div className="ptn-pair">
            <div className="ptn-field">
              <label htmlFor={`${uid}-pickup`}>
                {f.pickup.label} <span className="ptn-req" aria-hidden="true">*</span>
              </label>
              <IconField icon="pin">
                <input
                  id={`${uid}-pickup`}
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={invalid("pickup")}
                  aria-describedby={describedBy}
                  placeholder={f.pickup.placeholder}
                  value={values.pickup}
                  onChange={(event) => set("pickup", event.target.value)}
                />
              </IconField>
            </div>
            <div className="ptn-field">
              <label htmlFor={`${uid}-destination`}>
                {f.destination.label} <span className="ptn-req" aria-hidden="true">*</span>
              </label>
              <IconField icon="pin">
                <input
                  id={`${uid}-destination`}
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={invalid("destination")}
                  aria-describedby={describedBy}
                  placeholder={f.destination.placeholder}
                  value={values.destination}
                  onChange={(event) => set("destination", event.target.value)}
                />
              </IconField>
            </div>
          </div>

          <div className="ptn-field">
            <p className="ptn-label" id={`${uid}-goods-label`}>
              {f.goodsLegend} <span className="ptn-req" aria-hidden="true">*</span>
            </p>
            <div className="ptn-pills" role="radiogroup" aria-labelledby={`${uid}-goods-label`} aria-required="true">
              {ptnDeliveryGoods.map((item) => (
                <label key={item.id} className={`ptn-pill-radio${values.goods === item.id ? " is-checked" : ""}${invalid("goods") ? " is-invalid" : ""}`}>
                  <input
                    type="radio"
                    name="ptn-goods"
                    value={item.id}
                    checked={values.goods === item.id}
                    onChange={() => set("goods", item.id)}
                  />
                  <span className="ptn-pill-radio__dot" aria-hidden="true" />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ptn-pair">
            <div className="ptn-field">
              <label htmlFor={`${uid}-quantity`}>{f.quantity.label}</label>
              <IconField icon="box">
                <input
                  id={`${uid}-quantity`}
                  type="text"
                  placeholder={f.quantity.placeholder}
                  value={values.quantity}
                  onChange={(event) => set("quantity", event.target.value)}
                />
              </IconField>
            </div>
            <div className="ptn-field">
              <label htmlFor={`${uid}-date`}>{f.date.label}</label>
              <IconField icon="calendar">
                <input
                  id={`${uid}-date`}
                  type="text"
                  placeholder={f.date.placeholder}
                  value={values.date}
                  onChange={(event) => set("date", event.target.value)}
                />
              </IconField>
            </div>
          </div>

          <div className="ptn-field">
            <label htmlFor={`${uid}-details`}>{f.details.label}</label>
            <div className="ptn-input ptn-input--area">
              <PtnIcon name="doc" className="ptn-input__icon" />
              <textarea
                id={`${uid}-details`}
                rows={3}
                placeholder={f.details.placeholder}
                value={values.details}
                onChange={(event) => set("details", event.target.value)}
              />
            </div>
          </div>

          <div className="ptn-pair">
            <div className="ptn-field">
              <label htmlFor={`${uid}-name`}>
                {f.name.label} <span className="ptn-req" aria-hidden="true">*</span>
              </label>
              <IconField icon="user">
                <input
                  id={`${uid}-name`}
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
              </IconField>
            </div>
            <div className="ptn-field">
              <label htmlFor={`${uid}-channel`}>
                {f.channel.label} <span className="ptn-req" aria-hidden="true">*</span>
              </label>
              <IconField icon="mail">
                <input
                  id={`${uid}-channel`}
                  type="text"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={invalid("channel")}
                  aria-describedby={describedBy}
                  placeholder={f.channel.placeholder}
                  value={values.channel}
                  onChange={(event) => set("channel", event.target.value)}
                />
              </IconField>
            </div>
          </div>

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
              whatsappUrl={buildPtnDeliveryWhatsAppUrl(values)}
              whatsappLabel="Continuer sur WhatsApp"
              className="ptn-prepared"
            />
          </div>
        </form>

        <aside className="ptn-panel ptn-panel--route" aria-labelledby="ptn-drv-panel-title">
          <h3 id="ptn-drv-panel-title" className="ptn-panel__title">
            {f.panel.title}
          </h3>
          <p className="ptn-panel__lead">{f.panel.lead}</p>
          <ol className="ptn-route" aria-live="polite">
            <li className={values.pickup.trim() ? "is-filled" : ""} data-testid="ptn-route-from">
              <PtnIcon name="pin" className="ptn-route__icon" />
              <span>{values.pickup.trim() || f.panel.pickupEmpty}</span>
            </li>
            <li className={values.destination.trim() ? "is-filled" : ""} data-testid="ptn-route-to">
              <PtnIcon name="pin" className="ptn-route__icon" />
              <span>{values.destination.trim() || f.panel.destinationEmpty}</span>
            </li>
          </ol>
          {extras.length > 0 ? (
            <dl className="ptn-route__extras" data-testid="ptn-route-extras">
              {extras.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <p className="ptn-panel__info">
            <PtnIcon name="info" className="ptn-panel__info-icon" />
            <span>{f.panel.note}</span>
          </p>
        </aside>
      </div>
    </section>
  );
}