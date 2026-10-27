import { EngagementIcon } from "@/components/rental/RentalBriefIcons";
import { Reveal } from "@/components/motion/Reveal";
import { rentalTransparency } from "@/content/rental-page";

export function RentalTransparency() {
  return (
    <section className="rental-transparency section-spacing" aria-labelledby="rental-transparency-title">
      <div className="container-content">
        <Reveal>
          <h2 id="rental-transparency-title" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {rentalTransparency.title}
          </h2>
        </Reveal>
        <ul className="rental-transparency__groups">
          {rentalTransparency.groups.map((group, index) => (
            <Reveal as="li" key={group.id} delay={index * 70} className="rental-transparency__group">
              <span className="rental-transparency__icon">
                <EngagementIcon id={group.id} />
              </span>
              <h3 className="rental-transparency__group-title">{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
        <p className="rental-transparency__note">{rentalTransparency.note}</p>
      </div>
    </section>
  );
}
