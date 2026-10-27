import { motorcyclesContextCriteria } from "@/content/motorcycles-page";

export function MotorcycleContextCriteria() {
  const data = motorcyclesContextCriteria;

  return (
    <section className="mot-context section-spacing bg-brand-paper" aria-labelledby="mot-context-title">
      <div className="container-content">
        <h2 id="mot-context-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.title}
        </h2>
        <div className="mot-context__grid">
          {data.groups.map((group, index) => (
            <div key={group.title} className="mot-context__group">
              <span className="mot-context__num">{index + 1}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
