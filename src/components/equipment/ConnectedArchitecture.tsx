import { connectedArchitecture, connectedEquipmentMedia } from "@/content/connected-equipment-page";

export function ConnectedArchitecture() {
  const data = connectedArchitecture;
  const svg = connectedEquipmentMedia.architectureSvg;

  return (
    <section
      id={data.id}
      className="cec-arch section-spacing bg-brand-paper scroll-mt-28"
      aria-labelledby="cec-arch-title"
    >
      <div className="container-content">
        <h2 id="cec-arch-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="cec-arch__layout">
          <figure className="cec-arch__figure">
            {/* img natif pour préserver les animations internes du SVG (brief) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={svg.src}
              alt={svg.alt}
              width={svg.width}
              height={svg.height}
              className="cec-arch__svg"
              loading="lazy"
            />
          </figure>
          <div className="cec-arch__layers">
            {data.layers.map((layer) => (
              <article key={layer.number} className="cec-arch__layer">
                <span className="cec-arch__layer-num">{layer.number}</span>
                <h3>{layer.title}</h3>
                <ul>
                  {layer.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
            <p className="cec-arch__notice">{data.notice}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
