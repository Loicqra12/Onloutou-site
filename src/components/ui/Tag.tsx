export function Tag({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] ${
        dark
          ? "border-[#4c4c4c] text-[#bbbbbb]"
          : "border-brand-border text-brand-muted"
      }`}
    >
      {children}
    </span>
  );
}
