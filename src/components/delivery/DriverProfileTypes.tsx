import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { driverProfileTypesSection } from "@/content/driver-partner-page";

export function DriverProfileTypes() {
  const data = driverProfileTypesSection;

  return (
    <section className="drv-profiles section-spacing bg-brand-paper" aria-labelledby="drv-profiles-title">
      <div className="container-content">
        <Reveal>
          <h2 id="drv-profiles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        </Reveal>
        <ol className="drv-profiles__list">
          {data.profiles.map((profile, index) => (
            <Reveal
              key={profile.id}
              delay={index * 60}
              as="li"
              className={`drv-profiles__item${index % 2 === 1 ? " drv-profiles__item--reverse" : ""}`}
            >
              <figure className="drv-profiles__media editorial-media">
                <Image
                  src={profile.image.src}
                  alt={profile.image.alt}
                  width={profile.image.width}
                  height={profile.image.height}
                  sizes="(max-width: 1023px) 100vw, 44vw"
                  className="drv-profiles__img editorial-media__img"
                  style={{ objectPosition: profile.image.objectPosition }}
                />
              </figure>
              <div className="drv-profiles__copy">
                <span className="drv-profiles__num" aria-hidden>{profile.number}</span>
                <h3 className="font-display text-2xl font-extrabold">{profile.title}</h3>
                <p className="drv-profiles__desc">{profile.description}</p>
                <p className="drv-profiles__label">Informations à préparer</p>
                <ul>
                  {profile.prepare.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="drv-profiles__label">Points à vérifier</p>
                <ul>
                  {profile.verify.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
                <a href={profile.cta.href} className="drv-profiles__cta link-motion">{profile.cta.label}</a>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
