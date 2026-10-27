import { partnerProductsPreview } from "@/content/partner-portal-page";

type Props = {
  onAddProduct: () => void;
};

export function PartnerProductsPreview({ onAddProduct }: Props) {
  const data = partnerProductsPreview;
  const row = data.demoRow;

  return (
    <div className="epp-products">
      <header className="epp-products__head">
        <div>
          <h3 className="epp-products__title">{data.title}</h3>
          <p className="epp-products__lead">{data.lead}</p>
        </div>
        <button type="button" className="epp-products__add" onClick={onAddProduct}>
          {data.addLabel}
        </button>
      </header>
      <div className="epp-products__filters" aria-label="Filtres de prévisualisation">
        <span className="epp-products__filter">Recherche</span>
        <span className="epp-products__filter">Catégorie</span>
        <span className="epp-products__filter">Statut</span>
        <span className="epp-products__filter">Disponibilité</span>
      </div>
      <p className="epp-products__empty">{data.empty}</p>
      <div className="epp-products__table-wrap">
        <table className="epp-products__table">
          <thead>
            <tr>
              {data.columns.map((col) => (
                <th key={col} scope="col">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="epp-products__row-demo">
              <td>
                <span className="epp-products__demo-tag">{row.tag}</span>
                {row.product}
              </td>
              <td>{row.category}</td>
              <td>{row.mode}</td>
              <td>{row.status}</td>
              <td>{row.availability}</td>
              <td>{row.updated}</td>
              <td>
                <span className="epp-products__muted">{row.actions}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="epp-products__future">
        Actions futures : {data.futureActions.join(" · ")}
      </p>
    </div>
  );
}
