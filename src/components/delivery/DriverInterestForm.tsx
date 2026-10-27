"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";
import {
  buildDriverPartnerWhatsAppMessage,
  buildDriverPartnerWhatsAppUrl,
  driverApplicationSection,
  driverConsentLabel,
  driverDataNotice,
  driverFormOptions,
} from "@/content/driver-partner-page";

export function DriverInterestForm() {
  const data = driverApplicationSection;

  const [profileTypeLabel, setProfileTypeLabel] = useState(driverFormOptions.profileTypes[0].label);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [zoneHints, setZoneHints] = useState<string[]>([]);
  const [zonesDetail, setZonesDetail] = useState("");
  const [transportLabel, setTransportLabel] = useState(driverFormOptions.transports[0].label);
  const [ownershipLabel, setOwnershipLabel] = useState(driverFormOptions.ownership[0].label);
  const [documents, setDocuments] = useState<string[]>([]);
  const [experienceLabel, setExperienceLabel] = useState(driverFormOptions.experience[0].label);
  const [availabilityLabel, setAvailabilityLabel] = useState(driverFormOptions.availability[0].label);
  const [missionTypes, setMissionTypes] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [showNameError, setShowNameError] = useState(false);

  const zonesLabels = useMemo(() => (zoneHints.length ? zoneHints.join(", ") : ""), [zoneHints]);
  const documentsLabels = useMemo(() => (documents.length ? documents.join(", ") : ""), [documents]);
  const missionLabels = useMemo(() => (missionTypes.length ? missionTypes.join(", ") : ""), [missionTypes]);

  const fields = useMemo(
    () => ({
      profileTypeLabel,
      name,
      city,
      zonesLabels,
      zonesDetail,
      transportLabel,
      ownershipLabel,
      documentsLabels,
      experienceLabel,
      availabilityLabel,
      missionLabels,
      phone,
      details,
    }),
    [
      profileTypeLabel,
      name,
      city,
      zonesLabels,
      zonesDetail,
      transportLabel,
      ownershipLabel,
      documentsLabels,
      experienceLabel,
      availabilityLabel,
      missionLabels,
      phone,
      details,
    ],
  );

  const summary = useMemo(() => buildDriverPartnerWhatsAppMessage(fields), [fields]);
  const whatsappHref = useMemo(() => buildDriverPartnerWhatsAppUrl(fields), [fields]);

  const toggle = (list: string[], label: string, set: (v: string[]) => void) => {
    set(list.includes(label) ? list.filter((x) => x !== label) : [...list, label]);
  };

  const canSubmit = consent && name.trim().length > 0;

  return (
    <section
      id={data.id}
      className="drv-form section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="drv-form-title"
    >
      <div className="container-content drv-form__inner">
        <h2 id="drv-form-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>

        <form
          className="drv-form__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) setShowNameError(true);
          }}
        >
          <fieldset className="drv-form__fieldset">
            <legend>Type de profil</legend>
            <div className="drv-form__options">
              {driverFormOptions.profileTypes.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="radio"
                    name="drv-profile"
                    checked={profileTypeLabel === opt.label}
                    onChange={() => setProfileTypeLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="drv-form__field">
            <label htmlFor="drv-name">Nom ou raison sociale</label>
            <input
              id="drv-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setShowNameError(false);
              }}
              aria-invalid={showNameError}
            />
            {showNameError && (
              <p className="drv-form__error" role="alert">Indiquez un nom ou une raison sociale pour générer le message.</p>
            )}
          </div>

          <div className="drv-form__field">
            <label htmlFor="drv-city">Ville ou commune</label>
            <input id="drv-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <fieldset className="drv-form__fieldset">
            <legend>Zones d’intervention (indicatif)</legend>
            <p className="drv-form__hint">Ne signifie pas une couverture garantie par ONLOUTOU.</p>
            <div className="drv-form__options">
              {driverFormOptions.zoneHints.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="checkbox"
                    checked={zoneHints.includes(opt.label)}
                    onChange={() => toggle(zoneHints, opt.label, setZoneHints)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            <label htmlFor="drv-zones-detail" className="sr-only">Précision zones</label>
            <input
              id="drv-zones-detail"
              type="text"
              placeholder="Précisez communes ou secteurs"
              value={zonesDetail}
              onChange={(e) => setZonesDetail(e.target.value)}
            />
          </fieldset>

          <fieldset className="drv-form__fieldset">
            <legend>Moyen de transport</legend>
            <div className="drv-form__options">
              {driverFormOptions.transports.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="radio"
                    name="drv-transport"
                    checked={transportLabel === opt.label}
                    onChange={() => setTransportLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="drv-form__fieldset">
            <legend>Propriété du moyen</legend>
            <div className="drv-form__options">
              {driverFormOptions.ownership.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="radio"
                    name="drv-ownership"
                    checked={ownershipLabel === opt.label}
                    onChange={() => setOwnershipLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="drv-form__fieldset">
            <legend>Documents disponibles (déclaratif)</legend>
            <div className="drv-form__options">
              {driverFormOptions.documents.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="checkbox"
                    checked={documents.includes(opt.label)}
                    onChange={() => toggle(documents, opt.label, setDocuments)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="drv-form__fieldset">
            <legend>Expérience</legend>
            <div className="drv-form__options">
              {driverFormOptions.experience.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="radio"
                    name="drv-exp"
                    checked={experienceLabel === opt.label}
                    onChange={() => setExperienceLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="drv-form__fieldset">
            <legend>Disponibilité indicative</legend>
            <div className="drv-form__options">
              {driverFormOptions.availability.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="radio"
                    name="drv-avail"
                    checked={availabilityLabel === opt.label}
                    onChange={() => setAvailabilityLabel(opt.label)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="drv-form__fieldset">
            <legend>Types de missions recherchées</legend>
            <div className="drv-form__options">
              {driverFormOptions.missionTypes.map((opt) => (
                <label key={opt.id} className="drv-form__option">
                  <input
                    type="checkbox"
                    checked={missionTypes.includes(opt.label)}
                    onChange={() => toggle(missionTypes, opt.label, setMissionTypes)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="drv-form__field">
            <label htmlFor="drv-phone">Téléphone</label>
            <input id="drv-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="drv-form__field">
            <label htmlFor="drv-details">Informations complémentaires</label>
            <textarea id="drv-details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          <label className="drv-form__consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{driverConsentLabel}</span>
          </label>

          <div className="drv-form__summary" aria-live="polite">
            <p className="drv-form__summary-label">Récapitulatif</p>
            <pre className="drv-form__summary-text">{summary}</pre>
          </div>

          <div className="drv-form__actions">
            {canSubmit ? (
              <Button href={whatsappHref} variant="primary" className="whatsapp-once-pulse">
                Envoyer mon profil par WhatsApp
              </Button>
            ) : (
              <Button type="button" variant="primary" disabled aria-disabled="true">
                Envoyer mon profil par WhatsApp
              </Button>
            )}
            <a href={`tel:${site.phoneTel}`} className="drv-form__phone link-motion">Appeler ONLOUTOU</a>
          </div>
        </form>

        <p className="drv-form__data-notice" role="note">{driverDataNotice}</p>

        <noscript>
          <p className="drv-form__noscript">
            Contactez ONLOUTOU par WhatsApp en précisant votre profil, zone et moyen de transport — sans pièces sensibles.
          </p>
        </noscript>
      </div>
    </section>
  );
}
