import { driverModuleMatrix } from "@/content/driver-portal-page";

export function DriverModuleMatrix() {
  return (
    <section className="edl-matrix section-spacing bg-brand-white" aria-labelledby="edl-matrix-title">
      <div className="container-content">
        <h2 id="edl-matrix-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Fonctions prévues
        </h2>
        <div className="edl-matrix__wrap">
          <table className="edl-matrix__table">
            <thead>
              <tr>
                <th scope="col">Module</th>
                <th scope="col">Fonction prévue</th>
                <th scope="col">Statut prudent</th>
              </tr>
            </thead>
            <tbody>
              {driverModuleMatrix.map((row) => (
                <tr key={row.module}>
                  <th scope="row">{row.module}</th>
                  <td>{row.function}</td>
                  <td>
                    <span className="edl-matrix__status">{row.status}</span>
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
