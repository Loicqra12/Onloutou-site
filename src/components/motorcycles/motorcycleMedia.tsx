import Image from "next/image";
import { motorcyclesMedia, motorcyclesRepresentativeCaption } from "@/content/motorcycles-page";
import type { MotorcycleProfileId } from "@/content/motorcycles-page";

export function MotorcycleProfileVisual({
  visual,
  profileId,
}: {
  visual: "schema" | "delivery";
  profileId: MotorcycleProfileId;
}) {
  if (visual === "delivery") {
    const m = motorcyclesMedia.urbanOps;
    return (
      <figure className="mot-profiles__figure">
        <Image
          src={m.src}
          alt={m.alt}
          width={m.width}
          height={m.height}
          sizes="(max-width: 1023px) 100vw, 50vw"
          className="mot-profiles__img"
          style={{ objectPosition: m.objectPosition }}
        />
        <figcaption>{motorcyclesRepresentativeCaption}</figcaption>
      </figure>
    );
  }

  const label =
    profileId === "scooter"
      ? "Repère urbain — scooter et proximité"
      : "Repère polyvalent — urbain et périurbain";

  return (
    <div className="mot-profiles__schema" aria-label={`Schéma conceptuel — ${label}`}>
      <span className="mot-profiles__node mot-profiles__node--core">Mission</span>
      <span className="mot-profiles__node">Zone</span>
      <span className="mot-profiles__node">Sécurité</span>
      <span className="mot-profiles__node">Fréquence</span>
      <p className="mot-profiles__schema-note">{motorcyclesRepresentativeCaption}</p>
    </div>
  );
}
