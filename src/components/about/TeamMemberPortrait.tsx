import Image from "next/image";
import type { TeamMemberProfile } from "@/content/team";
import { resolveTeamImageSrc } from "@/content/team";

type TeamMemberPortraitProps = {
  member: TeamMemberProfile;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function TeamMemberPortrait({ member, priority = false, sizes, className = "" }: TeamMemberPortraitProps) {
  const src = resolveTeamImageSrc(member);
  const width = member.image.width ?? 1200;
  const height = member.image.height ?? 1500;

  if (!src) {
    return (
      <div
        className={`about-team-portrait about-team-portrait--placeholder ${className}`.trim()}
        role="img"
        aria-label={member.image.alt}
      >
        <span className="about-team-portrait__initials" aria-hidden>{member.initials}</span>
      </div>
    );
  }

  return (
    <div className={`about-team-portrait about-team-portrait--photo ${className}`.trim()}>
      <Image
        src={src}
        alt={member.image.alt}
        width={width}
        height={height}
        sizes={sizes}
        className="about-team-portrait__img"
        style={member.image.focalPoint ? { objectPosition: member.image.focalPoint } : undefined}
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
