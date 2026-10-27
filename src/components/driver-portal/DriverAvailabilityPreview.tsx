import { driverAvailabilityPreview } from "@/content/driver-portal-page";

export function DriverAvailabilityPreview() {
  const data = driverAvailabilityPreview;

  return (
    <div className="edl-avail">
      <h3 className="edl-panel__title">{data.title}</h3>
      <p className="edl-panel__lead">{data.lead}</p>
      <ul className="edl-avail__fields">
        {data.fields.map((field) => (
          <li key={field}>
            <label className="edl-avail__label">
              <span>{field}</span>
              <input type="text" disabled readOnly placeholder="—" className="edl-avail__input" />
            </label>
          </li>
        ))}
      </ul>
      <p className="edl-avail__notice">{data.notice}</p>
    </div>
  );
}
