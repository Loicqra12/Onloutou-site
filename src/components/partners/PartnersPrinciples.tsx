import { partnersPrinciples } from "@/content/partners-page";

export function PartnersPrinciples() {
  return (
    <section className="partners-principles section-spacing bg-brand-paper" aria-labelledby="partners-principles-title">
      <div className="container-content">
        <h2 id="partners-principles-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Principes de collaboration
        </h2>
        <ol className="partners-principles__list">
          {partnersPrinciples.map((principle, index) => (
            <li key={principle}>
              <span className="partners-principles__num" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
              {principle}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
