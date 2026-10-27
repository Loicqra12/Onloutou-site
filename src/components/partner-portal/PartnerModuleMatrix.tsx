import { partnerModuleMatrix } from "@/content/partner-portal-page";

export function PartnerModuleMatrix() {
  return (
    <section className="epp-matrix section-spacing bg-brand-white" aria-labelledby="epp-matrix-title">
      <div className="container-content">
        <h2 id="epp-matrix-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Modules prévus
        </h2>
        <div className="epp-matrix__wrap">
          <table className="epp-matrix__table">
            <thead>
              <tr>
                <th scope="col">Module</th>
                <th scope="col">Fonction prévue</th>
                <th scope="col">Statut initial</th>
              </tr>
            </thead>
            <tbody>
              {partnerModuleMatrix.map((row) => (
                <tr key={row.module}>
                  <th scope="row">{row.module}</th>
                  <td>{row.function}</td>
                  <td>
                    <span className="epp-matrix__status">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
