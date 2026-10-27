import Image from "next/image";
import { trucksMachineryMedia, trucksMachinerySiteTerrain } from "@/content/trucks-machinery-page";

export function SiteTerrainSection() {
  const data = trucksMachinerySiteTerrain;
  const photo = trucksMachineryMedia.siteOperations;

  return (
    <section className="heq-site section-spacing bg-brand-white" aria-labelledby="heq-site-title">
      <div className="container-content heq-site__grid">
        <figure className="heq-site__figure">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 767px) 100vw, 480px"
            className="heq-site__img"
            style={{ objectPosition: photo.objectPosition }}
          />
        </figure>
        <div>
          <h2 id="heq-site-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <ul className="heq-site__factors">
            {data.factors.map((factor, index) => (
              <li key={factor}>
                <span className="heq-site__factor-num">{String(index + 1).padStart(2, "0")}</span>
                {factor}
              </li>
            ))}
          </ul>
          <p className="heq-site__disclaimer">{data.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
