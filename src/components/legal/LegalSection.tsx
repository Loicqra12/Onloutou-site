type Props = {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
};

export function LegalSection({ id, number, title, children }: Props) {
  return (
    <section id={id} className="leg-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="leg-section__title font-display">
        <span className="leg-section__num">{number}.</span>
        <span>{title}</span>
      </h2>
      <div className="leg-section__body">{children}</div>
    </section>
  );
}
