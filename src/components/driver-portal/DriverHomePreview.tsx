import { driverHomePreview } from "@/content/driver-portal-page";

export function DriverHomePreview() {
  const data = driverHomePreview;

  return (
    <div className="edl-home">
      <h3 className="edl-panel__title">{data.title}</h3>
      <ul className="edl-home__cards">
        {data.cards.map((card) => (
          <li key={card.label} className="edl-home__card">
            <span className="edl-home__card-label">{card.label}</span>
            <span className="edl-home__card-value">{card.value}</span>
          </li>
        ))}
      </ul>
      <section aria-labelledby="edl-home-steps">
        <h4 id="edl-home-steps" className="edl-home__steps-title">{data.stepsTitle}</h4>
        <ol className="edl-home__steps">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
