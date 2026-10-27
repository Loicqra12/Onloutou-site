import { dataProcessingActivities } from "@/content/privacy";

const statusNote: Record<string, string> = {
  verified: "Vérifié",
  "to-confirm": "À confirmer",
  planned: "Prévu, non implémenté",
};

export function PrivacyProcessingTable() {
  return (
    <div
      className="leg-table-wrap"
      data-testid="privacy-data-table"
      tabIndex={0}
      role="region"
      aria-label="Tableau des traitements — défilement horizontal disponible sur petit écran"
    >
      <table className="leg-table">
        <caption className="leg-table__caption">
          Synthèse des traitements identifiés — fondements juridiques à valider
        </caption>
        <thead>
          <tr>
            <th scope="col">Traitement</th>
            <th scope="col">Données</th>
            <th scope="col">Finalités</th>
            <th scope="col">Stockage / destinataires</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          {dataProcessingActivities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.title}</td>
              <td>{activity.dataCategories.join(" ; ")}</td>
              <td>{activity.purposes.join(" ; ")}</td>
              <td>
                {[activity.storage, activity.recipients.join(", ")].filter(Boolean).join(" — ") || "—"}
              </td>
              <td>{statusNote[activity.status] ?? activity.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
