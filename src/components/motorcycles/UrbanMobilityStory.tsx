import Image from "next/image";
import { motorcyclesMedia, motorcyclesUrbanStory } from "@/content/motorcycles-page";

export function UrbanMobilityStory() {
  const data = motorcyclesUrbanStory;
  const photo = motorcyclesMedia.urbanOps;

  return (
    <section className="mot-urban section-spacing bg-brand-paper" aria-labelledby="mot-urban-title">
      <div className="container-content mot-urban__grid">
        <div>
          <h2 id="mot-urban-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="mot-urban__lead">{data.lead}</p>
          <ol className="mot-urban__steps">
            {data.steps.map((step, index) => (
              <li key={step}>
                <span className="mot-urban__step-num">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mot-urban__disclaimer">{data.disclaimer}</p>
        </div>
        <figure className="mot-urban__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 480px"
            className="mot-urban__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
    </section>
  );
}
