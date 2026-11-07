import Image from "next/image";
import Link from "next/link";
import { abtIds, abtTeam } from "@/content/about-hub";
import { AbtIcon } from "./AbtIcon";

type SocialLink = { network: "linkedin" | "github"; href: string };

function SocialIcon({ network }: { network: SocialLink["network"] }) {
  if (network === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
        <path fill="currentColor" d="M6.5 9H3.7v11.2h2.8V9ZM5.1 3.2A1.7 1.7 0 1 0 5.1 6.6 1.7 1.7 0 0 0 5.1 3.2ZM20.3 20.2h-2.8v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H10.8V9h2.7v1.5h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4v6.8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
      <path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function PersonLinks({ name, links }: { name: string; links?: readonly SocialLink[] }) {
  if (!links?.length) return null;
  const labels = { linkedin: "LinkedIn", github: "GitHub" };
  return (
    <ul className="abt-social">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${labels[link.network]} de ${name} (s’ouvre dans un nouvel onglet)`}>
            <SocialIcon network={link.network} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function AbtTeam() {
  const f = abtTeam.founder;
  return (
    <section id={abtIds.team} className="abt-team" aria-labelledby="abt-team-title">
      <p className="abt-eyebrow abt-eyebrow--line abt-eyebrow--dark">{abtTeam.eyebrow}</p>
      <h2 id="abt-team-title" className="abt-h2">
        {abtTeam.title}
      </h2>
      <p className="abt-team__lead">{abtTeam.lead}</p>

      <article className="abt-founder">
        <Image
          src={f.image.src}
          alt={`Portrait de ${f.name}`}
          width={f.image.width}
          height={f.image.height}
          quality={86}
          sizes="(max-width: 700px) 100vw, 420px"
          className="abt-founder__img"
          style={{ objectPosition: f.image.position }}
        />
        <div className="abt-founder__body">
          <p className="abt-founder__tag">{f.tag}</p>
          <h3 className="abt-founder__name">{f.name}</h3>
          <p className="abt-founder__role">{f.role}</p>
          <PersonLinks name={f.name} links={f.social} />
          <p className="abt-founder__text">{f.text}</p>
        </div>
      </article>

      <ul className="abt-members">
        {abtTeam.members.map((m) => (
          <li key={m.name} className="abt-member">
            <Image
              src={m.image.src}
              alt={`Portrait de ${m.name}`}
              width={m.image.width}
              height={m.image.height}
              quality={86}
              sizes="(max-width: 520px) 280px, (max-width: 700px) 40vw, 220px"
              className="abt-member__img"
              style={{ objectPosition: m.image.position }}
            />
            <div className="abt-member__body">
              <span className="abt-tag">{m.tag}</span>
              <h3 className="abt-member__name">{m.name}</h3>
              {"title" in m && m.title ? <p className="abt-member__role">{m.title}</p> : null}
              <p className="abt-member__role">{m.role}</p>
              <PersonLinks name={m.name} links={"social" in m ? m.social : undefined} />
              <p className="abt-member__text">{m.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="abt-team__cta">
        <p className="abt-team__cta-title">{abtTeam.cta.title}</p>
        <Link href={abtTeam.cta.href} className="abt-btn abt-btn--dark">
          {abtTeam.cta.label}
          <AbtIcon name="arrowUpRight" className="abt-btn__icon" />
        </Link>
      </div>
    </section>
  );
}