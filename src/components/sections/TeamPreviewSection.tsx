import { teamIntro, teamMembers } from "@/content/home";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TeamPreviewSection() {
  return (
    <section className="bg-brand-paper section-spacing-lg" aria-labelledby="team-heading">
      <div className="container-content">
        <SectionHeading
          number={teamIntro.number}
          eyebrow={teamIntro.eyebrow}
          title={teamIntro.title}
          titleHighlight={teamIntro.titleHighlight}
          compact
        />
        <h2 id="team-heading" className="sr-only">Équipe</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className={`grid gap-6 rounded-[14px] p-7 sm:grid-cols-[95px_1fr] ${
                member.variant === "join"
                  ? "bg-brand-ink text-white lg:col-span-2"
                  : "bg-[#f9f8f4]"
              }`}
            >
              {member.variant === "join" ? (
                <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#444444] text-3xl text-brand-yellow sm:h-[95px] sm:w-[95px]">
                  {member.initials}
                </div>
              ) : (
                <div
                  className={`relative flex h-[130px] items-center justify-center overflow-hidden rounded-[10px] font-display text-3xl font-extrabold sm:h-[120px] sm:w-[95px] ${
                    member.variant === "alt"
                      ? "bg-brand-yellow text-brand-ink"
                      : "bg-brand-ink text-brand-yellow"
                  }`}
                >
                  {member.initials}
                  <span
                    className={`absolute -bottom-5 h-10 w-28 rotate-[-25deg] ${
                      member.variant === "alt" ? "bg-brand-ink" : "bg-brand-yellow"
                    }`}
                    aria-hidden
                  />
                </div>
              )}
              <div>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-[0.12em] ${
                    member.variant === "join" ? "text-brand-yellow" : "text-[#8a7000]"
                  }`}
                >
                  {member.role}
                </span>
                <h3 className="mt-2 font-display text-xl font-extrabold">{member.name}</h3>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    member.variant === "join" ? "text-[#aaaaaa]" : "text-[#6d6d6d]"
                  }`}
                >
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
