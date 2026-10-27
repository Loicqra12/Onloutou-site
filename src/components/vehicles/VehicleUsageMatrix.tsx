import { vehiclesUsageMatrix } from "@/content/vehicles-page";

export function VehicleUsageMatrix() {
  const data = vehiclesUsageMatrix;

  return (
    <section className="veh-matrix section-spacing bg-brand-paper" aria-labelledby="veh-matrix-title">
      <div className="container-content">
        <h2 id="veh-matrix-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>

        <div className="veh-matrix__table-wrap">
          <table className="veh-matrix__table">
            <caption className="sr-only">Situations d’usage et points à examiner</caption>
            <thead>
              <tr>
                <th scope="col">Situation</th>
                <th scope="col">Points à examiner</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.situation}>
                  <th scope="row">{row.situation}</th>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="veh-matrix__cards">
          {data.rows.map((row) => (
            <li key={row.situation} className="veh-matrix__card">
              <h3>{row.situation}</h3>
              <p>{row.points}</p>
            </li>
          ))}
        </ul>

        <p className="veh-matrix__note">{data.note}</p>
      </div>
    </section>
  );
}
