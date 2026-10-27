import { driverProfilePreview } from "@/content/driver-portal-page";

export function DriverProfilePreview() {
  const data = driverProfilePreview;

  return (
    <div className="edl-profile">
      <h3 className="edl-panel__title">{data.title}</h3>
      {data.blocks.map((block) => (
        <section key={block.title} className="edl-profile__block" aria-labelledby={`edl-prof-${block.title}`}>
          <h4 id={`edl-prof-${block.title}`} className="edl-profile__block-title">{block.title}</h4>
          <ul className="edl-profile__list">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
      <p className="edl-profile__notice">{data.notice}</p>
    </div>
  );
}
