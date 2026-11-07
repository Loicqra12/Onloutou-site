import Image from "next/image";
import { abtHistory, abtIds, abtImages, abtRecognition } from "@/content/about-hub";

export function AbtHistory() {
  return (
    <section id={abtIds.history} className="abt-history" aria-labelledby="abt-history-title">
      <div className="abt-history__copy">
        <p className="abt-eyebrow">{abtHistory.eyebrow}</p>
        <h2 id="abt-history-title" className="abt-h2">
          {abtHistory.title}
        </h2>
        <p className="abt-history__lead">{abtHistory.lead}</p>
        <ol className="abt-timeline">
          {abtHistory.items.map((item) => (
            <li key={item.title} className="abt-timeline__item">
              <span className="abt-timeline__year">{item.year}</span>
              <span className="abt-timeline__dot" aria-hidden="true" />
              <div className="abt-timeline__body">
                <h3 className="abt-timeline__title">{item.title}</h3>
                <p className="abt-timeline__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="abt-history__note">{abtHistory.note}</p>
      </div>
      <Image
        src={abtImages.history.src}
        alt={abtHistory.imageAlt}
        width={abtImages.history.width}
        height={abtImages.history.height}
        sizes="(max-width: 900px) 100vw, 46vw"
        className="abt-history__img"
      />
    </section>
  );
}

export function AbtRecognition() {
  return (
    <section id={abtIds.recognition} className="abt-recognition" aria-labelledby="abt-recognition-title">
      <h2 id="abt-recognition-title" className="abt-h2 abt-h2--light">
        {abtRecognition.title}
      </h2>
      <ul className="abt-recognition__grid">
        {abtRecognition.items.map((item) => (
          <li key={item.title} className="abt-recognition__card">
            <span className="abt-recognition__year">{item.year}</span>
            <div className="abt-recognition__body">
              <span className="abt-tag">{item.status}</span>
              <h3 className="abt-recognition__title">{item.title}</h3>
              <p className="abt-recognition__text">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}