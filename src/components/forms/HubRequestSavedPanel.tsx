import type { ReactNode } from "react";
import { appendReferenceToWhatsAppUrl, requestRecordedMessage } from "@/lib/forms/serviceRequest";

type Props = {
  reference: string | null;
  saveError: string | null;
  pending?: boolean;
  whatsappUrl: string;
  whatsappLabel?: string;
  offlineHint?: string;
  className?: string;
  children?: ReactNode;
};

export function HubRequestSavedPanel({
  reference,
  saveError,
  pending,
  whatsappUrl,
  whatsappLabel = "Continuer sur WhatsApp",
  offlineHint = "WhatsApp est facultatif : votre demande est déjà enregistrée sous la référence ci-dessus.",
  className = "vhp-prepared",
  children,
}: Props) {
  if (pending) {
    return (
      <p className="vhp-error" role="status">
        Enregistrement…
      </p>
    );
  }
  if (saveError) {
    return (
      <p className="vhp-error" role="alert">
        {saveError}
      </p>
    );
  }
  if (!reference) {
    return children ? <>{children}</> : null;
  }
  const wa = appendReferenceToWhatsAppUrl(whatsappUrl, reference);
  return (
    <div className={className} role="status">
      <h3>Demande enregistrée</h3>
      <p>{requestRecordedMessage(reference)}</p>
      <a href={wa} className="vhp-btn vhp-btn--black" target="_blank" rel="noopener noreferrer">
        {whatsappLabel}
      </a>
      <p className="vhp-summary__note">{offlineHint}</p>
    </div>
  );
}
