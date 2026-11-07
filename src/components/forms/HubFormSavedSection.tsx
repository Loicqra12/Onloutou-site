import type { ReactNode } from "react";
import { HubRequestSavedPanel } from "@/components/forms/HubRequestSavedPanel";
import { attachmentPendingNotice } from "@/lib/forms/serviceRequest";

type Props = {
  prepared: boolean;
  prepareError: string;
  reference: string | null;
  saveError: string | null;
  pending: boolean;
  whatsappUrl: string;
  message: string;
  whatsappLabel?: string;
  preparedClassName: string;
  renderWhatsAppFallback: (url: string, message: string) => ReactNode;
  showAttachmentNotice?: boolean;
};

/** Panneau succès API, repli WhatsApp hors ligne, ou erreur — pattern hubs équipements. */
export function HubFormSavedSection({
  prepared,
  prepareError,
  reference,
  saveError,
  pending,
  whatsappUrl,
  message,
  whatsappLabel = "Continuer sur WhatsApp",
  preparedClassName,
  renderWhatsAppFallback,
  showAttachmentNotice,
}: Props) {
  return (
    <>
      {prepareError ? (
        <p className="vhp-error" role="alert">
          {prepareError}
        </p>
      ) : null}
      {reference ? (
        <HubRequestSavedPanel
          reference={reference}
          saveError={null}
          pending={pending}
          whatsappUrl={whatsappUrl}
          whatsappLabel={whatsappLabel}
          className={preparedClassName}
        />
      ) : null}
      {!reference && saveError ? (
        <>
          <p className="vhp-error" role="alert">
            {saveError}
          </p>
          <p className="vhp-summary__note" role="note">
            Vous pouvez réessayer ou contacter ONLOUTOU par un autre canal. Tant que l’enregistrement échoue, aucun dossier n’est créé.
          </p>
          {prepared ? renderWhatsAppFallback(whatsappUrl, message) : null}
        </>
      ) : null}
      {!reference && !saveError && prepared ? renderWhatsAppFallback(whatsappUrl, message) : null}
      {showAttachmentNotice ? <p className="vhp-summary__note">{attachmentPendingNotice}</p> : null}
    </>
  );
}
