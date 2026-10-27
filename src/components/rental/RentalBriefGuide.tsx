import { Reveal } from "@/components/motion/Reveal";
import { rentalBriefGuide } from "@/content/rental-page";

export function RentalBriefGuide() {
  return (
    <section className="rental-guide section-spacing bg-brand-charcoal text-brand-white" aria-labelledby="rental-guide-title">
      <div className="container-content rental-guide__layout">
        <ol className="rental-guide__progress" aria-hidden={false}>
          {rentalBriefGuide.fields.map((field, index) => (
            <li key={field}>
              <span className="rental-guide__num">{index + 1}</span>
              <span className="rental-guide__progress-label">{field}</span>
            </li>
          ))}
        </ol>
        <Reveal>
          <div className="rental-guide__sheet">
            <h2 id="rental-guide-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {rentalBriefGuide.title}
            </h2>
            <ul className="rental-guide__fields">
              {rentalBriefGuide.fields.map((field, index) => (
                <li key={field}>
                  <span className="rental-guide__field-num" aria-hidden>{index + 1}</span>
                  {field}
                </li>
              ))}
            </ul>
            <p className="rental-guide__closing">{rentalBriefGuide.closing}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
