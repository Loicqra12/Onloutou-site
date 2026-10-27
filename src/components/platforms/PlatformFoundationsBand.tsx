import { customPlatformsFoundations, customPlatformsPositioning } from "@/content/custom-platforms-page";

export function PlatformFoundationsBand() {
  return (
    <section className="platform-foundations" aria-labelledby="platform-foundations-title">
      <div className="container-content platform-foundations__inner">
        <p id="platform-foundations-title" className="platform-foundations__intro">
          {customPlatformsFoundations.intro}
        </p>
        <p className="platform-foundations__positioning">{customPlatformsPositioning}</p>
        <ol className="platform-foundations__list">
          {customPlatformsFoundations.items.map((item, index) => (
            <li key={item} className="platform-foundations__item">
              <span className="platform-foundations__tag">{item}</span>
              {index < customPlatformsFoundations.items.length - 1 && (
                <span className="platform-foundations__sep" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
