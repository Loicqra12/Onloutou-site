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
          Chaque ligne relie un traitement identifié à ses données, ses finalités, le fondement retenu dans cette
          rédaction, ses destinataires et sa conservation. Cette qualification doit encore être reprise dans la
          formalité auprès de l’Autorité de protection.
        </caption>
        <thead>
          <tr>
            <th scope="col">Traitement</th>
            <th scope="col">Données</th>
            <th scope="col">Finalités</th>
            <th scope="col">Fondement retenu</th>
            <th scope="col">Destinataires</th>
            <th scope="col">Conservation</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          {dataProcessingActivities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.title}</td>
              <td>{activity.dataCategories.join(" ; ")}</td>
              <td>{activity.purposes.join(" ; ")}</td>
              <td>{activity.legalBasis ?? "—"}</td>
              <td>{activity.recipients.join(", ") || "—"}</td>
              <td>{activity.retention ?? activity.storage ?? "—"}</td>
              <td>{statusNote[activity.status] ?? activity.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
