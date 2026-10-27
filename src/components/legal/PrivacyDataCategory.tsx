type Category = {
  title: string;
  items: string[];
  status: "verified" | "to-confirm";
};

const statusLabel: Record<Category["status"], string> = {
  verified: "Détecté dans le site audité",
  "to-confirm": "Dépend de l’hébergement ou à confirmer",
};

type PrivacyDataCategoryProps = {
  category: Category;
};

export function PrivacyDataCategory({ category }: PrivacyDataCategoryProps) {
  return (
    <div className="leg-privacy-cat">
      <h3 className="leg-privacy-cat__title">{category.title}</h3>
      <p className="leg-note leg-privacy-cat__status">{statusLabel[category.status]}</p>
      <ul className="leg-list">
        {category.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
