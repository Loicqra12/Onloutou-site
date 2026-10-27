import Image from "next/image";
import { trucksMachineryLogisticsStory, trucksMachineryMedia } from "@/content/trucks-machinery-page";

export function OperationsStory() {
  const data = trucksMachineryLogisticsStory;
  const photo = trucksMachineryMedia.logisticsDepot;

  return (
    <section className="heq-logistics section-spacing bg-brand-paper" aria-labelledby="heq-logistics-title">
      <div className="container-content heq-logistics__grid">
        <div>
          <h2 id="heq-logistics-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="heq-logistics__lead">{data.lead}</p>
          <ol className="heq-logistics__steps">
            {data.steps.map((step, index) => (
              <li key={step}>
                <span className="heq-logistics__step-num">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="heq-logistics__disclaimer">{data.disclaimer}</p>
        </div>
        <figure className="heq-logistics__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 480px"
            className="heq-logistics__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
      </div>
    </section>
  );
}
