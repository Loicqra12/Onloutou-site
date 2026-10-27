import Image from "next/image";
import { trucksMachineryMedia, trucksMachinerySafety } from "@/content/trucks-machinery-page";

export function SafetyInspection() {
  const data = trucksMachinerySafety;
  const photo = trucksMachineryMedia.safetyInspection;

  return (
    <section className="heq-safety section-spacing bg-brand-paper" aria-labelledby="heq-safety-title">
      <div className="container-content heq-safety__grid">
        <figure className="heq-safety__figure">
          <ol className="heq-safety__markers" aria-hidden>
            {[1, 2, 3].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 480px"
            className="heq-safety__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
        <div>
          <h2 id="heq-safety-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <ol className="heq-safety__list">
            {data.checkpoints.map((item, index) => (
              <li key={item}>
                <span className="heq-safety__index">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <aside className="heq-safety__panel" role="note">
            <p>{data.disclaimer}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
