import type { AdminRequestDetail } from "../lib/requestDetailView";
import { buildAdminRequestSections } from "../lib/requestDetailView";

type Props = {
  request: AdminRequestDetail;
};

function FieldList({ title, fields }: { title: string; fields: { label: string; value: string }[] }) {
  if (fields.length === 0) return null;
  return (
    <section className="adm-detail__block">
      <h4>{title}</h4>
      <dl className="adm-detail__dl">
        {fields.map((row) => (
          <div key={`${row.label}-${row.value}`}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function RequestDetail({ request }: Props) {
  const sections = buildAdminRequestSections(request);
  return (
    <div className="adm-detail">
      <FieldList title="Dossier" fields={sections.summary} />
      <FieldList title="Coordonnées" fields={sections.contact} />
      <FieldList title="Besoin" fields={sections.need} />
      <section className="adm-detail__block">
        <h4>Message</h4>
        <pre className="adm-detail__message">{sections.message}</pre>
      </section>
      {request.events.length > 0 ? (
        <section className="adm-detail__block">
          <h4>Historique</h4>
          <ol className="adm-detail__events">
            {request.events.map((ev) => (
              <li key={`${ev.createdAt}-${ev.status}`}>
                <strong>{ev.status}</strong>
                {ev.note ? ` — ${ev.note}` : null}
                <span className="adm-detail__event-date">{new Date(ev.createdAt).toLocaleString("fr-FR")}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {sections.need.length > 0 || Object.keys(request.payload ?? {}).length > 0 ? (
        <details className="adm-detail__technical">
          <summary>Données techniques (JSON)</summary>
          <pre>{sections.technicalJson}</pre>
        </details>
      ) : null}
    </div>
  );
}
