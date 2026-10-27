import { Reveal } from "@/components/motion/Reveal";
import { productsTransparency } from "@/content/products-page";

export function ProductTransparencySection() {
  const data = productsTransparency;

  return (
    <section className="prd-transparency section-spacing bg-brand-paper" aria-labelledby="prd-transparency-title">
      <div className="container-content">
        <Reveal>
          <h2 id="prd-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {data.title}
          </h2>
        </Reveal>
        <ul className="prd-transparency__list">
          {data.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="prd-transparency__note">{data.note}</p>
      </div>
    </section>
  );
}
