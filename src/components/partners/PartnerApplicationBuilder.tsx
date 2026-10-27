"use client";

import { useCallback, useId, useRef, useState } from "react";
import { PartnerApplicationSummary } from "@/components/partners/PartnerApplicationSummary";
import { becomePartnerNoScriptForm, becomePartnerPrivacyNote } from "@/content/become-partner-page";
import {
  PARTNER_ACTIVITY_MAX,
  PARTNER_DESCRIPTION_MAX,
  PARTNER_NAME_MAX,
  partnerApplicationAvailabilities,
  partnerApplicationCapacities,
  partnerApplicationGoals,
  partnerApplicationProfiles,
  partnerApplicationZones,
  validatePartnerApplication,
  type PartnerApplicationFieldErrors,
  type PartnerApplicationFormData,
} from "@/content/partner-application";
import Link from "next/link";

const INITIAL: PartnerApplicationFormData = {
  nameOrStructure: "",
  activity: "",
  profileId: "",
  capacityId: "",
  description: "",
  zoneId: "",
  availabilityId: partnerApplicationAvailabilities[0].id,
  goalId: "",
  professionalLink: "",
};

const STEP_TITLES = ["Votre profil", "Votre capacité", "Zone et disponibilité", "Votre objectif", "Coordonnées et description"];

function OptionGrid({
  name,
  options,
  value,
  onChange,
  error,
  errorId,
}: {
  name: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  error?: string;
  errorId?: string;
}) {
  return (
    <div className="become-partner-options" role="group" aria-describedby={error ? errorId : undefined}>
      {options.map((opt) => (
        <label key={opt.id} className="become-partner-options__item">
          <input type="radio" name={name} value={opt.id} checked={value === opt.id} onChange={() => onChange(opt.id)} />
          <span>{opt.label}</span>
        </label>
      ))}
      {error ? (
        <p className="become-partner-field-error" id={errorId} role="alert">{error}</p>
      ) : null}
    </div>
  );
}

export function PartnerApplicationBuilder() {
  const baseId = useId();
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [review, setReview] = useState(false);
  const [data, setData] = useState<PartnerApplicationFormData>(INITIAL);
  const [errors, setErrors] = useState<PartnerApplicationFieldErrors>({});
  const [understood, setUnderstood] = useState(false);

  const focusStep = useCallback(() => {
    requestAnimationFrame(() => stepTitleRef.current?.focus());
  }, []);

  const patch = (partial: Partial<PartnerApplicationFormData>) => {
    setData((d) => ({ ...d, ...partial }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(partial) as (keyof PartnerApplicationFormData)[]) {
        delete next[key as keyof PartnerApplicationFieldErrors];
      }
      return next;
    });
  };

  const validateStep = (current: number): boolean => {
    const stepErrors: PartnerApplicationFieldErrors = {};
    if (current === 0 && !data.profileId) stepErrors.profileId = "Sélectionnez un profil.";
    if (current === 1 && !data.capacityId) stepErrors.capacityId = "Sélectionnez une capacité proposée.";
    if (current === 2 && !data.zoneId) stepErrors.zoneId = "Sélectionnez une zone.";
    if (current === 3 && !data.goalId) stepErrors.goalId = "Sélectionnez un objectif.";
    if (current === 4) {
      Object.assign(stepErrors, validatePartnerApplication(data));
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (step < STEP_TITLES.length - 1) {
      setStep((s) => s + 1);
      focusStep();
      return;
    }
    const allErrors = validatePartnerApplication(data);
    setErrors(allErrors);
    if (Object.keys(allErrors).length === 0) {
      setReview(true);
      focusStep();
    }
  };

  const goBack = () => {
    if (review) {
      setReview(false);
      setStep(STEP_TITLES.length - 1);
      focusStep();
      return;
    }
    if (step > 0) {
      setStep((s) => s - 1);
      focusStep();
    }
  };

  return (
    <section className="become-partner-form section-spacing bg-brand-paper" aria-labelledby="become-partner-form-title">
      <div className="container-content become-partner-form__inner">
        <h2 id="become-partner-form-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Construire votre proposition
        </h2>
        <p className="become-partner-form__lead">{becomePartnerPrivacyNote}</p>

        <div className="become-partner-form__client">
          <div className="become-partner-form__progress" aria-hidden={review}>
            {STEP_TITLES.map((title, index) => (
              <span
                key={title}
                className={`become-partner-form__progress-item${index === step && !review ? " is-active" : ""}${index < step || review ? " is-done" : ""}`}
              >
                <span className="become-partner-form__progress-num">{index + 1}</span>
                <span className="become-partner-form__progress-label">{title}</span>
              </span>
            ))}
          </div>

          {review ? (
            <PartnerApplicationSummary
              data={data}
              understood={understood}
              onUnderstoodChange={setUnderstood}
              onEdit={() => {
                setReview(false);
                setStep(STEP_TITLES.length - 1);
                focusStep();
              }}
            />
          ) : (
            <div className="become-partner-form__step">
              <h3 ref={stepTitleRef} tabIndex={-1} className="become-partner-form__step-title">
                Étape {step + 1} — {STEP_TITLES[step]}
              </h3>

              {step === 0 && (
                <OptionGrid
                  name={`${baseId}-profile`}
                  options={partnerApplicationProfiles}
                  value={data.profileId}
                  onChange={(id) => patch({ profileId: id })}
                  error={errors.profileId}
                  errorId={`${baseId}-profile-error`}
                />
              )}

              {step === 1 && (
                <OptionGrid
                  name={`${baseId}-capacity`}
                  options={partnerApplicationCapacities}
                  value={data.capacityId}
                  onChange={(id) => patch({ capacityId: id })}
                  error={errors.capacityId}
                  errorId={`${baseId}-capacity-error`}
                />
              )}

              {step === 2 && (
                <>
                  <p className="become-partner-form__field-label">Zone</p>
                  <OptionGrid
                    name={`${baseId}-zone`}
                    options={partnerApplicationZones}
                    value={data.zoneId}
                    onChange={(id) => patch({ zoneId: id })}
                    error={errors.zoneId}
                    errorId={`${baseId}-zone-error`}
                  />
                  <p className="become-partner-form__field-label">Disponibilité</p>
                  <OptionGrid
                    name={`${baseId}-availability`}
                    options={partnerApplicationAvailabilities}
                    value={data.availabilityId}
                    onChange={(id) => patch({ availabilityId: id })}
                  />
                </>
              )}

              {step === 3 && (
                <OptionGrid
                  name={`${baseId}-goal`}
                  options={partnerApplicationGoals}
                  value={data.goalId}
                  onChange={(id) => patch({ goalId: id })}
                  error={errors.goalId}
                  errorId={`${baseId}-goal-error`}
                />
              )}

              {step === 4 && (
                <div className="become-partner-form__fields">
                  <div className="become-partner-form__field">
                    <label htmlFor={`${baseId}-name`}>Votre nom ou le nom de votre structure</label>
                    <input
                      id={`${baseId}-name`}
                      type="text"
                      maxLength={PARTNER_NAME_MAX}
                      value={data.nameOrStructure}
                      onChange={(e) => patch({ nameOrStructure: e.target.value })}
                      aria-describedby={errors.nameOrStructure ? `${baseId}-name-error` : undefined}
                      autoComplete="organization"
                    />
                    {errors.nameOrStructure ? (
                      <p className="become-partner-field-error" id={`${baseId}-name-error`} role="alert">{errors.nameOrStructure}</p>
                    ) : null}
                  </div>

                  <div className="become-partner-form__field">
                    <label htmlFor={`${baseId}-activity`}>Activité principale (facultatif)</label>
                    <input
                      id={`${baseId}-activity`}
                      type="text"
                      maxLength={PARTNER_ACTIVITY_MAX}
                      value={data.activity}
                      onChange={(e) => patch({ activity: e.target.value })}
                      aria-describedby={errors.activity ? `${baseId}-activity-error` : undefined}
                    />
                    {errors.activity ? (
                      <p className="become-partner-field-error" id={`${baseId}-activity-error`} role="alert">{errors.activity}</p>
                    ) : null}
                  </div>

                  <div className="become-partner-form__field">
                    <label htmlFor={`${baseId}-description`}>Description courte</label>
                    <textarea
                      id={`${baseId}-description`}
                      maxLength={PARTNER_DESCRIPTION_MAX}
                      rows={5}
                      placeholder="Décrivez ce que vous proposez, les moyens disponibles et le type de projet recherché."
                      value={data.description}
                      onChange={(e) => patch({ description: e.target.value })}
                      aria-describedby={errors.description ? `${baseId}-description-error` : undefined}
                    />
                    {errors.description ? (
                      <p className="become-partner-field-error" id={`${baseId}-description-error`} role="alert">{errors.description}</p>
                    ) : null}
                  </div>

                  <div className="become-partner-form__field">
                    <label htmlFor={`${baseId}-link`}>Site ou profil professionnel (facultatif)</label>
                    <input
                      id={`${baseId}-link`}
                      type="url"
                      inputMode="url"
                      maxLength={200}
                      value={data.professionalLink}
                      onChange={(e) => patch({ professionalLink: e.target.value })}
                      aria-describedby={`${baseId}-link-hint${errors.professionalLink ? ` ${baseId}-link-error` : ""}`}
                    />
                    <p className="become-partner-form__hint" id={`${baseId}-link-hint`}>
                      Lien public uniquement. Ne transmettez aucun identifiant ou mot de passe.
                    </p>
                    {errors.professionalLink ? (
                      <p className="become-partner-field-error" id={`${baseId}-link-error`} role="alert">{errors.professionalLink}</p>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="become-partner-form__nav">
                {step > 0 ? (
                  <button type="button" className="become-partner-form__back" onClick={goBack}>
                    Étape précédente
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="become-partner-form__next btn-motion-primary" onClick={goNext}>
                  {step === STEP_TITLES.length - 1 ? "Vérifier le résumé" : "Étape suivante"}
                </button>
              </div>
            </div>
          )}

          {review ? (
            <button type="button" className="become-partner-form__back become-partner-form__back--review" onClick={goBack}>
              Revenir au formulaire
            </button>
          ) : null}
        </div>

        <noscript>
          <p className="become-partner-form__noscript">
            {becomePartnerNoScriptForm}{" "}
            <Link href="/contact">page Contact</Link>
          </p>
        </noscript>
      </div>
    </section>
  );
}
