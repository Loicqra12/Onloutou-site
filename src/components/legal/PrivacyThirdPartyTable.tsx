import { thirdPartyServices } from "@/content/privacy";

const statusLabel: Record<string, string> = {
  verified: "Vérifié dans le code ou les liens",
  "to-confirm": "À confirmer",
  planned: "Prévu",
};

export function PrivacyThirdPartyTable() {
  const active = thirdPartyServices.filter((s) => s.active);

  return (
    <div
      className="leg-table-wrap"
      data-testid="privacy-third-parties"
      tabIndex={0}
      role="region"
      aria-label="Tableau des sous-traitants — défilement horizontal disponible sur petit écran"
    >
      <table className="leg-table">
        <caption className="leg-table__caption">
          Services tiers actifs ou attendus — inventaire technique du dépôt
        </caption>
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">Fonction</th>
            <th scope="col">Données possibles</th>
            <th scope="col">Moment du transfert</th>
          </tr>
        </thead>
        <tbody>
          {active.map((service) => (
            <tr key={service.id}>
              <td>
                {service.website ? (
                  <a href={service.website} rel="noopener noreferrer" target="_blank">
                    {service.name}
                  </a>
                ) : (
                  service.name
                )}
                <span className="leg-table__meta"> — {statusLabel[service.status] ?? service.status}</span>
                {service.privacyUrl ? (
                  <>
                    {" "}
                    <a
                      href={service.privacyUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="leg-table__secondary-link"
                    >
                      Politique du service
                    </a>
                  </>
                ) : null}
              </td>
              <td>{service.purpose}</td>
              <td>{service.dataCategories.join(" ; ")}</td>
              <td>{service.transferMoment ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
