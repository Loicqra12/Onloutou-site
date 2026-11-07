"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { HubRequestSavedPanel } from "@/components/forms/HubRequestSavedPanel";
import { appendReferenceToWhatsAppUrl, useHubRequestSubmit, type ServiceRequestApiType } from "@/lib/forms/serviceRequest";

type Props = {
  source: string;
  type: ServiceRequestApiType;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  zone?: string;
  message: string;
  payload?: Record<string, unknown>;
  whatsappUrl: string;
  whatsappLabel?: string;
  submitLabel?: string;
  className?: string;
  disabled?: boolean;
  onBeforeSubmit?: () => boolean;
};

export function CommercialRequestActions({
  source,
  type,
  contactName,
  contactPhone,
  contactEmail,
  zone,
  message,
  payload,
  whatsappUrl,
  whatsappLabel = "Continuer sur WhatsApp",
  submitLabel = "Enregistrer ma demande",
  className,
  disabled,
  onBeforeSubmit,
}: Props) {
  const { reference, saveError, pending, submit } = useHubRequestSubmit();
  const [offline, setOffline] = useState(false);

  async function onSaveClick() {
    if (onBeforeSubmit && !onBeforeSubmit()) return;
    setOffline(false);
    const outcome = await submit({
      source,
      type,
      contactName,
      contactPhone,
      contactEmail,
      zone,
      message,
      payload,
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    if (outcome.apiDisabled) {
      setOffline(true);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }

  const waHref = reference ? appendReferenceToWhatsAppUrl(whatsappUrl, reference) : whatsappUrl;

  return (
    <div className={className}>
      <Button type="button" variant="primary" disabled={disabled || pending} onClick={() => void onSaveClick()}>
        {pending ? "Enregistrement…" : submitLabel}
      </Button>
      {offline ? (
        <p role="alert">
          L’enregistrement en ligne est indisponible : WhatsApp s’ouvre sans dossier créé chez ONLOUTOU.
        </p>
      ) : null}
      <HubRequestSavedPanel
        reference={reference}
        saveError={saveError}
        pending={pending}
        whatsappUrl={waHref}
        whatsappLabel={whatsappLabel}
        className="commercial-request-actions__saved"
      />
    </div>
  );
}
