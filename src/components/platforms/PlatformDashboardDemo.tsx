import { TitleReveal } from "@/components/motion/TitleReveal";
import { customPlatformsDashboard } from "@/content/custom-platforms-page";

const demoRows = [
  { label: "Opération", scope: "Équipe", status: "À qualifier" },
  { label: "Contrôle d’équipement", scope: "Terrain", status: "À vérifier" },
  { label: "Dossier partenaire", scope: "Administration", status: "En préparation" },
  { label: "Installation", scope: "Technique", status: "À valider" },
];

const demoAside = ["Documents à compléter", "Demandes à qualifier", "Éléments à examiner"];

export function PlatformDashboardDemo() {
  return (
    <section
      id="exemple-dashboard"
      className="platform-dashboard section-spacing scroll-mt-28"
      aria-labelledby="platform-dashboard-title"
    >
      <div className="container-content">
        <p className="platform-kicker platform-kicker--on-dark">Pilotage métier</p>
        <TitleReveal as="h2" id="platform-dashboard-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {customPlatformsDashboard.title}
        </TitleReveal>
        <p className="platform-dashboard__lead">{customPlatformsDashboard.lead}</p>

        <ul className="platform-dashboard__annotations" aria-label="Repères de lecture">
          {customPlatformsDashboard.annotations.map((label) => (
            <li key={label} className="platform-dashboard__annotation">
              <span className="platform-dashboard__annotation-dot" aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <figure className="platform-dashboard__figure">
          <div className="platform-dash-ui" aria-label="Interface de démonstration">
            <aside className="platform-dash-ui__nav" aria-hidden>
              <span className="platform-dash-ui__brand">
                <span className="platform-mock__dot" />
                ONLOUTOU
              </span>
              <span className="is-active">Vue d’ensemble</span>
              <span>Demandes</span>
              <span>Interventions</span>
              <span>Documents</span>
              <span>Rapports</span>
            </aside>
            <div className="platform-dash-ui__main">
              <header className="platform-dash-ui__toolbar">
                <p>Suivi des opérations</p>
                <span>Filtres adaptés</span>
              </header>
              <ul className="platform-dash-ui__rows">
                {demoRows.map((row) => (
                  <li key={row.label}>
                    <strong>{row.label}</strong>
                    <span>{row.scope}</span>
                    <em>{row.status}</em>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="platform-dash-ui__aside" aria-hidden>
              <p>À examiner</p>
              <ul>
                {demoAside.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
          <figcaption>{customPlatformsDashboard.disclaimer}</figcaption>
        </figure>
      </div>
    </section>
  );
}
