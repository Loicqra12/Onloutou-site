import { cookieInventory } from "@/content/cookies";

const categoryLabel: Record<string, string> = {
  "strictly-necessary": "Strictement nécessaire",
  preferences: "Préférences",
  analytics: "Mesure d’audience",
  "external-media": "Médias / services externes",
  marketing: "Marketing",
  unknown: "À préciser",
};

export function CookieInventoryTable({ testId = "cookies-inventory" }: { testId?: string }) {
  const rows = cookieInventory.filter((item) => item.active);

  return (
    <div
      className="leg-table-wrap"
      data-testid={testId}
      tabIndex={0}
      role="region"
      aria-label="Inventaire des cookies — défilement horizontal disponible sur petit écran"
    >
      <table className="leg-table">
        <caption className="leg-table__caption">
          Inventaire des technologies identifiées — fondements et durées juridiques à valider
        </caption>
        <thead>
          <tr>
            <th scope="col">Technologie</th>
            <th scope="col">Fournisseur</th>
            <th scope="col">Finalité</th>
            <th scope="col">Déclencheur</th>
            <th scope="col">Durée</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                {item.name}
                <span className="leg-table__meta">
                  {item.technology.replace(/-/g, " ")} — {categoryLabel[item.category] ?? item.category} —{" "}
                  {item.status === "verified" ? "Vérifié" : "À confirmer"}
                </span>
              </td>
              <td>{item.provider}</td>
              <td>{item.purpose}</td>
              <td>{item.trigger}</td>
              <td>{item.duration ?? "À formaliser"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
