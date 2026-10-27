export function TeamCard({
  initials,
  name,
  role,
  bio,
  variant,
}: {
  initials: string;
  name: string;
  role: string;
  bio: string;
  variant?: "alt" | "join";
}) {
  if (variant === "join") {
    return (
      <article className="grid gap-6 rounded-[14px] bg-brand-ink p-7 text-white sm:grid-cols-[95px_1fr]">
        <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-[#444444] text-3xl text-brand-yellow sm:h-[95px] sm:w-[95px]">
          {initials}
        </div>
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-brand-yellow">
            {role}
          </span>
          <h3 className="mt-2 font-display text-xl font-extrabold">{name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#aaaaaa]">{bio}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="interactive-card team-card-motion grid gap-6 rounded-[14px] bg-[#f9f8f4] p-7 sm:grid-cols-[95px_1fr]">
      <div
        className={`relative flex h-[130px] items-center justify-center overflow-hidden rounded-[10px] font-display text-3xl font-extrabold sm:h-[120px] sm:w-[95px] ${
          variant === "alt" ? "bg-brand-yellow text-brand-ink" : "bg-brand-ink text-brand-yellow"
        }`}
        aria-hidden
      >
        {initials}
        <span
          className={`absolute -bottom-5 h-10 w-28 rotate-[-25deg] ${
            variant === "alt" ? "bg-brand-ink" : "bg-brand-yellow"
          }`}
        />
      </div>
      <div>
        <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8a7000]">
          {role}
        </span>
        <h3 className="mt-2 font-display text-xl font-extrabold">{name}</h3>
        <p className="mt-2 text-xs leading-relaxed text-[#6d6d6d]">{bio}</p>
      </div>
    </article>
  );
}
