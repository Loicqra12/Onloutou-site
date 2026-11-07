"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { HubRequestSavedPanel } from "@/components/forms/HubRequestSavedPanel";
import {
  buildPtnDlMessage,
  buildPtnDlWhatsAppUrl,
  ptnDlForm,
  ptnDlProfiles,
  ptnDlVehicles,
  ptnDlVehiclesIntro,
  type PtnDlProfileId,
  type PtnDlValues,
  type PtnDlVehicleId,
} from "@/content/partner-spaces-hub";
import { contactChannelError, parseContactChannel } from "@/lib/forms/ptnTypeToApi";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";
import { ptnImages, type PtnIconName } from "@/content/partners-hub";
import { PtnIcon } from "./PtnIcon";

const empty: PtnDlValues = { profile: "", name: "", channel: "", zone: "", transport: "", availability: "", experience: "" };

function IconField({ icon, area, children }: { icon: PtnIconName; area?: boolean; children: ReactNode }) {
  return (
    <div className={`ptn-input${area ? " ptn-input--area" : ""}`}>
      <PtnIcon name={icon} className="ptn-input__icon" />
      {children}
    </div>
  );
}

export function PtnDriverInterest() {
  const uid = useId();
  const [values, setValues] = useState<PtnDlValues>(empty);
  const [selected, setSelected] = useState<PtnDlVehicleId[]>([]);
  const [showError, setShowError] = useState(false);
  const { reference, saveError, pending, submit } = useHubRequestSubmit();
  const set = <K extends keyof PtnDlValues>(key: K, value: PtnDlValues[K]) => setValues((current) => ({ ...current, [key]: value }));

  const toggleVehicle = (id: PtnDlVehicleId) => {
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    setSelected(next);
    set(
      "transport",
      ptnDlVehicles
        .filter((vehicle) => next.includes(vehicle.id))
        .map((vehicle) => vehicle.label)
        .join(", "),
    );
  };

  const missing = {
    profile: values.profile === "",
    name: values.name.trim() === "",
    channel: contactChannelError(values.channel) !== null,
    zone: values.zone.trim() === "",
    transport: values.transport.trim() === "",
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
    const message = buildPtnDlMessage(values);
    const wa = buildPtnDlWhatsAppUrl(values);
    const channel = parseContactChannel(values.channel);
    const outcome = await submit({
      source: "devenir-livreur-interet",
      type: "PARTNER_DELIVERY",
      contactName: values.name.trim(),
      zone: values.zone.trim() || undefined,
      contactPhone: channel.phone,
      contactEmail: channel.email,
      message,
      payload: { ...values, intent: "driver-interest", transport: values.transport },
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    if (!outcome.saved && "apiDisabled" in outcome && outcome.apiDisabled) {
      window.open(wa, "_blank", "noopener,noreferrer");
    }
  };

  const f = ptnDlForm;
  const done = [values.zone.trim() !== "", values.transport.trim() !== "", values.experience.trim() !== ""];

  return (
    <>
      <section className="ptn-tiles ptn-tiles--choices ptn-dl-profiles" aria-label="Votre profil">
        <ul className="ptn-tiles__grid">
          {ptnDlProfiles.map((profile) => (
            <li key={profile.id}>
              <button
                type="button"
                className={`ptn-tile ptn-tile--button${values.profile === profile.id ? " is-selected" : ""}`}
                aria-pressed={values.profile === profile.id}
                onClick={() => set("profile", profile.id as PtnDlProfileId)}
              >
                <span className="ptn-tile__icon ptn-tile__icon--strong">
                  <PtnIcon name={profile.icon} />
                </span>
                <span className="ptn-tile__body">
                  <span className="ptn-tile__title">{profile.title}</span>
                  <span className="ptn-tile__text">{profile.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="ptn-dl-vehicles" aria-labelledby="ptn-dl-vehicles-title">
        <h2 id="ptn-dl-vehicles-title" className="ptn-h2 ptn-h2--feat">
          {ptnDlVehiclesIntro.title}
        </h2>
        <p className="ptn-form-section__lead">{ptnDlVehiclesIntro.lead}</p>
        <ul className="ptn-dl-vehicles__grid">
          {ptnDlVehicles.map((vehicle) => {
            const image = ptnImages[vehicle.image];
            const on = selected.includes(vehicle.id);
            return (
              <li key={vehicle.id}>
                <button
                  type="button"
                  className={`ptn-dl-vehicle${on ? " is-selected" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleVehicle(vehicle.id)}
                >
                  <span className={`ptn-pic ptn-scene-${vehicle.scene} ptn-dl-vehicle__pic`}>
                    {image ? (
                      <Image
                        src={image.src}
                        alt={vehicle.alt}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 700px) 45vw, 18vw"
                        className="ptn-pic__img"
                      />
                    ) : null}
                  </span>
                  <span className="ptn-dl-vehicle__label">{vehicle.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="ptn-dl-vehicles__note">{ptnDlVehiclesIntro.note}</p>
      </section>

      <section id={f.id} className="ptn-form-section ptn-dl-form" aria-labelledby="ptn-dl-form-title">
        <h2 id="ptn-dl-form-title" className="ptn-h2 ptn-h2--feat">
          {f.title}
        </h2>
        <p className="ptn-form-section__lead">{f.lead}</p>
        <div className="ptn-form-grid">
          <form className="ptn-form" onSubmit={onSubmit} noValidate>
            <p className="ptn-sr">{f.requiredSr}</p>
            <div className="ptn-field">
              <p className="ptn-label" id={`${uid}-profile-label`}>
                {f.profileLegend} <span className="ptn-req" aria-hidden="true">*</span>
              </p>
              <div className="ptn-pills" role="radiogroup" aria-labelledby={`${uid}-profile-label`} aria-required="true">
                {ptnDlProfiles.map((profile) => (
                  <label
                    key={profile.id}
                    className={`ptn-pill-radio ptn-pill-radio--wide${values.profile === profile.id ? " is-checked" : ""}${invalid("profile") ? " is-invalid" : ""}`}
                  >
                    <input
                      type="radio"
                      name="ptn-profile"
                      value={profile.id}
                      checked={values.profile === profile.id}
                      onChange={() => set("profile", profile.id)}
                    />
                    <span className="ptn-pill-radio__dot" aria-hidden="true" />
                    <span>{profile.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ptn-pair">
              <div className="ptn-field">
                <label htmlFor={`${uid}-name`}>
                  {f.name.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <input
                  id={`${uid}-name`}
                  className="ptn-plain-input"
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

            <div className="ptn-pair">
              <div className="ptn-field">
                <label htmlFor={`${uid}-zone`}>
                  {f.zone.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <IconField icon="pin">
                  <input
                    id={`${uid}-zone`}
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={invalid("zone")}
                    aria-describedby={describedBy}
                    placeholder={f.zone.placeholder}
                    value={values.zone}
                    onChange={(event) => set("zone", event.target.value)}
                  />
                </IconField>
              </div>
              <div className="ptn-field">
                <label htmlFor={`${uid}-transport`}>
                  {f.transport.label} <span className="ptn-req" aria-hidden="true">*</span>
                </label>
                <IconField icon="truck">
                  <input
                    id={`${uid}-transport`}
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={invalid("transport")}
                    aria-describedby={describedBy}
                    placeholder={f.transport.placeholder}
                    value={values.transport}
                    onChange={(event) => set("transport", event.target.value)}
                  />
                </IconField>
              </div>
            </div>

            <div className="ptn-pair">
              <div className="ptn-field">
                <label htmlFor={`${uid}-availability`}>{f.availability.label}</label>
                <IconField icon="calendar" area>
                  <textarea
                    id={`${uid}-availability`}
                    rows={3}
                    placeholder={f.availability.placeholder}
                    value={values.availability}
                    onChange={(event) => set("availability", event.target.value)}
                  />
                </IconField>
              </div>
              <div className="ptn-field">
                <label htmlFor={`${uid}-experience`}>{f.experience.label}</label>
                <IconField icon="doc" area>
                  <textarea
                    id={`${uid}-experience`}
                    rows={3}
                    placeholder={f.experience.placeholder}
                    value={values.experience}
                    onChange={(event) => set("experience", event.target.value)}
                  />
                </IconField>
              </div>
            </div>

            {errorVisible ? (
              <p id={errorId} className="ptn-form__error" role="alert">
                {f.error}
                {channelHint}
              </p>
            ) : null}
            <div className="ptn-form__submit">
              <p className="ptn-form__note">
                Pour déposer une candidature avec compte :{" "}
                <Link href="/espace-livreur/inscription">créer un dossier livreur</Link> (sans pièces sensibles ici).
              </p>
              <button type="submit" className="ptn-btn ptn-btn--yellow" disabled={pending}>
                {pending ? "Enregistrement…" : f.submit}
                <PtnIcon name="arrowRight" className="ptn-btn__icon" />
              </button>
              <p className="ptn-form__note">{f.submitNote}</p>
              <HubRequestSavedPanel
                reference={reference}
                saveError={saveError}
                pending={pending}
                whatsappUrl={buildPtnDlWhatsAppUrl(values)}
                whatsappLabel="Continuer sur WhatsApp"
                className="ptn-prepared"
              />
            </div>
          </form>

          <aside className="ptn-panel ptn-panel--points" aria-labelledby="ptn-dl-panel-title">
            <h3 id="ptn-dl-panel-title" className="ptn-panel__title">
              {f.panel.title}
            </h3>
            <p className="ptn-panel__lead">{f.panel.lead}</p>
            <ul className="ptn-points">
              {f.panel.items.map((item, index) => (
                <li key={item.title} className={done[index] ? "is-done" : ""} data-done={done[index] ? "true" : "false"}>
                  <span className="ptn-points__icon">
                    <PtnIcon name={item.icon} />
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="ptn-panel__info">
              <PtnIcon name="info" className="ptn-panel__info-icon" />
              <span>{f.panel.note}</span>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}