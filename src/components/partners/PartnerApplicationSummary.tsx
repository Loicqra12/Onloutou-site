"use client";

import { Button } from "@/components/ui/Button";
import {
  buildPartnerApplicationWhatsAppUrl,
  labelForOption,
  partnerApplicationAvailabilities,
  partnerApplicationCapacities,
  partnerApplicationGoals,
  partnerApplicationProfiles,
  partnerApplicationZones,
  type PartnerApplicationFormData,
} from "@/content/partner-application";

type Props = {
  data: PartnerApplicationFormData;
  understood: boolean;
  onUnderstoodChange: (value: boolean) => void;
  onEdit: () => void;
};

export function PartnerApplicationSummary({ data, understood, onUnderstoodChange, onEdit }: Props) {
  const whatsappHref = buildPartnerApplicationWhatsAppUrl(data);

  const rows = [
    { label: "Nom ou structure", value: data.nameOrStructure.trim() },
    { label: "Activité", value: data.activity.trim() || "—" },
    { label: "Profil", value: labelForOption(partnerApplicationProfiles, data.profileId) },
    { label: "Capacité proposée", value: labelForOption(partnerApplicationCapacities, data.capacityId) },
    { label: "Description", value: data.description.trim() },
    { label: "Zone", value: labelForOption(partnerApplicationZones, data.zoneId) },
    { label: "Disponibilité", value: labelForOption(partnerApplicationAvailabilities, data.availabilityId) },
    { label: "Objectif", value: labelForOption(partnerApplicationGoals, data.goalId) },
    { label: "Lien professionnel", value: data.professionalLink.trim() || "—" },
  ];

  return (
    <div className="become-partner-summary">
      <h3 className="become-partner-summary__title">Vérifiez votre proposition.</h3>
      <dl className="become-partner-summary__rows">
        {rows.map((row) => (
          <div key={row.label} className="become-partner-summary__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <button type="button" className="become-partner-summary__edit link-motion" onClick={onEdit}>
        Modifier mes informations
      </button>

      <label className="become-partner-summary__confirm">
        <input type="checkbox" checked={understood} onChange={(e) => onUnderstoodChange(e.target.checked)} />
        <span>
          Je comprends que cette prise de contact ne garantit ni validation, ni mission, ni rémunération.
        </span>
      </label>
      <div className="become-partner-summary__actions">
        {understood ? (
          <Button href={whatsappHref} variant="primary">Ouvrir WhatsApp avec ma proposition</Button>
        ) : (
          <Button type="button" variant="primary" disabled className="opacity-60">
            Ouvrir WhatsApp avec ma proposition
          </Button>
        )}
      </div>
    </div>
  );
}
