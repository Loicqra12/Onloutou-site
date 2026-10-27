import Image from "next/image";
import { motorcyclesMedia, motorcyclesSafety } from "@/content/motorcycles-page";

export function MotorcycleSafetyCheck() {
  const data = motorcyclesSafety;
  const photo = motorcyclesMedia.inspection;

  return (
    <section className="mot-safety section-spacing bg-brand-white" aria-labelledby="mot-safety-title">
      <div className="container-content mot-safety__grid">
        <figure className="mot-safety__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 50vw"
            className="mot-safety__img"
            style={{ objectPosition: photo.objectPosition }}
          />
          <ol className="mot-safety__markers" aria-hidden>
            {[1, 2, 3].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
        </figure>
        <div>
          <h2 id="mot-safety-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <ol className="mot-safety__list">
            {data.checkpoints.map((item, index) => (
              <li key={item}>
                <span className="mot-safety__index">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <p className="mot-safety__disclaimer">{data.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
