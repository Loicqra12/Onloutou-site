type Props = {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
};

export function LegalSubArticle({ id, number, title, children }: Props) {
  return (
    <div className="leg-subblock" id={id}>
      <h3 className="leg-sub" id={`${id}-title`}>
        <span className="leg-section__num">{number}</span>
        <span>{title}</span>
      </h3>
      <div className="leg-sub__body">{children}</div>
    </div>
  );
}
