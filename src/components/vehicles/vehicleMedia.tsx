import Image from "next/image";
import { vehiclesMedia, vehiclesRepresentativeCaption } from "@/content/vehicles-page";
import type { VehicleProfileId } from "@/content/vehicles-page";

type ImageKey = "mobility" | "pickup" | "utility";

const keyMap: Record<ImageKey, keyof typeof vehiclesMedia> = {
  mobility: "mobility",
  pickup: "pickup",
  utility: "utility",
};

export function VehicleProfileImage({
  imageKey,
}: {
  imageKey: ImageKey;
  profileId: VehicleProfileId;
}) {
  const m = vehiclesMedia[keyMap[imageKey]];

  return (
    <figure className="veh-profiles__figure">
      <Image
        src={m.src}
        alt={m.alt}
        width={m.width}
        height={m.height}
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="veh-profiles__img"
        style={{ objectPosition: m.objectPosition }}
      />
      <figcaption>{vehiclesRepresentativeCaption}</figcaption>
    </figure>
  );
}
