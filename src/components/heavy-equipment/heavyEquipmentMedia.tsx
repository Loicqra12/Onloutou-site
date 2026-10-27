import type { HeavyEquipmentProfileId } from "@/content/trucks-machinery-page";
import { trucksMachineryRepresentativeCaption } from "@/content/trucks-machinery-page";

export function HeavyEquipmentProfileVisual({
  schemaLabel,
}: {
  profileId: HeavyEquipmentProfileId;
  schemaLabel: string;
}) {
  return (
    <div className="heq-profiles__schema" aria-label={`Schéma conceptuel — ${schemaLabel}`}>
      <span className="heq-profiles__node heq-profiles__node--core">Mission</span>
      <span className="heq-profiles__node">Terrain</span>
      <span className="heq-profiles__node">Charge</span>
      <span className="heq-profiles__node">Durée</span>
      <p className="heq-profiles__schema-note">{trucksMachineryRepresentativeCaption}</p>
    </div>
  );
}
