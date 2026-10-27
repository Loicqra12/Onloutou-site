import { becomePartnerAudiences } from "@/content/become-partner-page";

export function BecomePartnerAudiences() {
  const data = becomePartnerAudiences;

  return (
    <section className="become-partner-audiences section-spacing bg-brand-paper" aria-labelledby="become-partner-audiences-title">
      <div className="container-content">
        <h2 id="become-partner-audiences-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          À qui s’adresse cette page ?
        </h2>
        <div className="become-partner-audiences__bands">
          {data.items.map((item, index) => (
            <article key={item.id} className="become-partner-audiences__band">
              <span className="become-partner-audiences__band-num" aria-hidden>{index + 1}</span>
              <div>
                <h3 className="become-partner-audiences__band-title">{item.title}</h3>
                <p className="become-partner-audiences__band-label">Pour proposer :</p>
                <ul>
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <p className="become-partner-audiences__footnote">{data.footnote}</p>
      </div>
    </section>
  );
}
