import { partnerDashboardPreview } from "@/content/partner-portal-page";

export function PartnerDashboardPreview() {
  const data = partnerDashboardPreview;

  return (
    <div className="epp-dash">
      <div className="epp-dash__cards">
        {data.cards.map((card) => (
          <article key={card.title} className="epp-dash__card">
            <h3 className="epp-dash__card-title">{card.title}</h3>
            <p className="epp-dash__card-value">{card.value}</p>
          </article>
        ))}
        <article className="epp-dash__card epp-dash__card--actions">
          <h3 className="epp-dash__card-title">{data.actionsTitle}</h3>
          <ul className="epp-dash__actions">
            {data.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
      </div>
      <section className="epp-dash__activity" aria-labelledby="epp-activity-title">
        <h3 id="epp-activity-title" className="epp-dash__section-title">{data.activityTitle}</h3>
        <p className="epp-dash__empty">{data.activityEmpty}</p>
      </section>
      <section className="epp-dash__modules" aria-labelledby="epp-modules-chips-title">
        <h3 id="epp-modules-chips-title" className="epp-dash__section-title">{data.modulesTitle}</h3>
        <ul className="epp-dash__chips">
          {data.moduleChips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
