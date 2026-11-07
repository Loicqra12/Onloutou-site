"use client";

import { useState } from "react";
import { CommercialRequestActions } from "@/components/forms/CommercialRequestActions";
import { hubContactValidationError } from "@/lib/forms/hubPrepare";
import type { ServiceRequestApiType } from "@/lib/forms/serviceRequest";

type Props = {
  source: string;
  type: ServiceRequestApiType;
  zone?: string;
  message: string;
  payload?: Record<string, unknown>;
  whatsappUrl: string;
  whatsappLabel?: string;
  submitLabel?: string;
  className?: string;
};

export function BriefContactSave({
  source,
  type,
  zone,
  message,
  payload,
  whatsappUrl,
  whatsappLabel,
  submitLabel = "Enregistrer ma demande",
  className = "rental-builder__actions",
}: Props) {
  const fieldsClassName = "brief-contact";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <div className={className}>
      <div className={fieldsClassName}>
        <label>
          Nom ou structure
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label>
          Téléphone
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        </label>
        <label>
          E-mail (facultatif)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
      </div>
      {localError ? (
        <p className="rental-builder__error" role="alert">
          {localError}
        </p>
      ) : null}
      <CommercialRequestActions
        source={source}
        type={type}
        contactName={name.trim() || phone.trim() || "Contact ONLOUTOU"}
        contactPhone={phone.trim() || undefined}
        contactEmail={email.trim() || undefined}
        zone={zone}
        message={message}
        payload={payload}
        whatsappUrl={whatsappUrl}
        whatsappLabel={whatsappLabel}
        submitLabel={submitLabel}
        onBeforeSubmit={() => {
          const err = hubContactValidationError(name, phone, email);
          if (err) {
            setLocalError(err);
            return false;
          }
          setLocalError(null);
          return true;
        }}
      />
    </div>
  );
}
