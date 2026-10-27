type Props = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ id, title, children }: Props) {
  return (
    <section id={id} className="leg-section scroll-mt-28" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="leg-section__title font-display text-xl font-extrabold tracking-tight">
        {title}
      </h2>
      <div className="leg-section__body">{children}</div>
    </section>
  );
}
