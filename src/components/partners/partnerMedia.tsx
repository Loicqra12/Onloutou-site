import Image from "next/image";
import { partnersMedia } from "@/content/partners-page";
import type { PartnerProfileId } from "@/content/partners-page";

const partnersIllustrationCaption = "Illustration d’une collaboration opérationnelle.";

export function PartnerProfileVisual({
  profileId,
  visual,
}: {
  profileId: PartnerProfileId;
  visual: "schema" | "training" | "logistics";
}) {
  if (visual === "training") {
    const m = partnersMedia.training;
    return (
      <figure className="partners-profile__figure">
        <Image
          src={m.src}
          alt={m.alt}
          width={m.width}
          height={m.height}
          sizes="(max-width: 1023px) 100vw, 400px"
          className="partners-profile__img"
          style={{ objectPosition: m.objectPosition }}
        />
        <figcaption>{partnersIllustrationCaption}</figcaption>
      </figure>
    );
  }
  if (visual === "logistics") {
    const m = partnersMedia.logistics;
    return (
      <figure className="partners-profile__figure">
        <Image
          src={m.src}
          alt={m.alt}
          width={m.width}
          height={m.height}
          sizes="(max-width: 1023px) 100vw, 400px"
          className="partners-profile__img"
          style={{ objectPosition: m.objectPosition }}
        />
        <figcaption>{partnersIllustrationCaption}</figcaption>
      </figure>
    );
  }

  return (
    <div className="partners-profile__schema" aria-label={`Schéma conceptuel — ${profileId}`}>
      <span className="partners-profile__node partners-profile__node--core">Projet</span>
      <span className="partners-profile__wire" aria-hidden />
      <span className="partners-profile__node">Capacité</span>
      <span className="partners-profile__node">Zone</span>
      <span className="partners-profile__node">Échange</span>
      <p className="partners-profile__schema-note">Repère fonctionnel — pas un réseau de partenaires publié.</p>
    </div>
  );
}
