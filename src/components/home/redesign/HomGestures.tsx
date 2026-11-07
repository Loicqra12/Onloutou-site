import Image from "next/image";
import { homGestures } from "@/content/home-hub";

export function HomGestures() {
  return (
    <section id="terrain" className="hom-gestures" aria-labelledby="hom-gestures-title">
      <div className="hom-wrap">
        <div className="hom-titleblock">
          <p className="hom-eyebrow hom-eyebrow--rule-after">{homGestures.eyebrow}</p>
          <h2 id="hom-gestures-title" className="hom-h2 hom-h2--xl">
            {homGestures.title}
          </h2>
        </div>
        <ul className="hom-gestures__list">
          {homGestures.items.map((item) => (
            <li key={item.label}>
              <figure className="hom-gestures__item">
                <span className="hom-gestures__frame">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 16vw"
                    className="hom-gestures__img"
                    style={{ objectPosition: item.position }}
                  />
                </span>
                <figcaption>{item.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}