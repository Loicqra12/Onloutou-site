import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { rentalFaq, rentalFaqAside, rentalFaqTitle } from "@/content/rental-page";

export function RentalFaq() {
  return (
    <section className="rental-faq section-spacing" aria-labelledby="service-faq-title">
      <div className="container-content rental-faq__grid">
        <div className="rental-faq__intro">
          <h2 id="service-faq-title" className="rental-faq__title font-display font-extrabold tracking-tight">
            {rentalFaqTitle}
          </h2>
          <p className="rental-faq__lead">{rentalFaqAside.text}</p>
          <Button href={rentalFaqAside.cta.href} variant="primary" className="rental-faq__cta">
            {rentalFaqAside.cta.label}
            <span aria-hidden> →</span>
          </Button>
          <ul className="rental-faq__portraits">
            {rentalFaqAside.portraits.map((photo) => (
              <li key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 899px) 32vw, 14vw"
                  className="rental-faq__portrait"
                  style={{ objectPosition: photo.objectPosition }}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="rental-faq__list">
          {rentalFaq.map((item, index) => (
            <details key={item.question} open={index === 0 ? true : undefined} className="rental-faq__item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
