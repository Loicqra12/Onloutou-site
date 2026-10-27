"use client";

import { Reveal } from "@/components/motion/Reveal";
import { TeamMemberPortrait } from "@/components/about/TeamMemberPortrait";
import { TeamSocialLinks } from "@/components/about/TeamSocialLinks";
import { skillsEcosystem } from "@/content/about-page";
import {
  aboutTeamIntro,
  getAboutTeamFounder,
  getAboutTeamGridMembers,
  type TeamMemberProfile,
} from "@/content/team";

function TeamExpertiseTags({ items }: { items: string[] }) {
  const visible = items.slice(0, 5);
  return (
    <ul className="about-team-tags">
      {visible.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function TeamQuote({ member }: { member: TeamMemberProfile }) {
  if (member.quoteStatus !== "approved") return null;
  return (
    <blockquote className="about-team-quote">
      <p>{member.quote}</p>
    </blockquote>
  );
}

function TeamRole({ member }: { member: TeamMemberProfile }) {
  return (
    <p className="about-team-role">
      <span className="about-team-role__text">{member.role}</span>
      {member.shortRole ? (
        <span className="about-team-role__sigle" aria-label={`Sigle : ${member.shortRole}`}>
          {member.shortRole}
        </span>
      ) : null}
    </p>
  );
}

function FounderSpotlight({ member }: { member: TeamMemberProfile }) {
  return (
    <article className="about-team-founder">
      <Reveal className="about-team-founder__media">
        <TeamMemberPortrait
          member={member}
          sizes="(max-width: 1023px) 72vw, 320px"
          className="about-team-founder__portrait"
        />
      </Reveal>
      <div className="about-team-founder__body">
        <Reveal delay={60}>
          <h3 className="about-team-founder__name">{member.name}</h3>
          <TeamRole member={member} />
        </Reveal>
        <Reveal delay={120}>
          <p className="about-team-founder__bio">{member.biography}</p>
          <TeamQuote member={member} />
          <TeamExpertiseTags items={member.expertise} />
          <TeamSocialLinks member={member} />
        </Reveal>
      </div>
    </article>
  );
}

function TeamGridCard({ member, delay }: { member: TeamMemberProfile; delay: number }) {
  return (
    <Reveal as="article" delay={delay} className="about-team-card">
      <TeamMemberPortrait
        member={member}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 280px"
        className="about-team-card__portrait"
      />
      <div className="about-team-card__body">
        <h3 className="about-team-card__name">{member.name}</h3>
        <TeamRole member={member} />
        <p className="about-team-card__bio">{member.biography}</p>
        {member.biographyExtra ? <p className="about-team-card__bio">{member.biographyExtra}</p> : null}
        <TeamQuote member={member} />
        <TeamExpertiseTags items={member.expertise} />
        <TeamSocialLinks member={member} />
      </div>
    </Reveal>
  );
}

export function AboutTeamSection() {
  const founder = getAboutTeamFounder();
  const gridMembers = getAboutTeamGridMembers();

  return (
    <section
      id="about-team"
      className="about-team section-spacing scroll-mt-28 bg-brand-paper"
      aria-labelledby="about-team-title"
    >
      <div className="container-content">
        <Reveal>
          <p className="about-team__eyebrow">{aboutTeamIntro.eyebrow}</p>
          <h2 id="about-team-title" className="about-team__title font-display text-3xl font-extrabold tracking-tight">
            {aboutTeamIntro.title}
          </h2>
          <p className="about-team__lead">{aboutTeamIntro.lead}</p>
        </Reveal>

        <div className="about-team__layout">
          <FounderSpotlight member={founder} />
          <div className="about-team__grid">
            {gridMembers.map((member, index) => (
              <TeamGridCard key={member.id} member={member} delay={80 + index * 70} />
            ))}
          </div>
        </div>

        <Reveal className="about-team-ecosystem" delay={120}>
          <article className="about-team-ecosystem__inner">
            <p className="about-team-ecosystem__title font-display text-lg font-extrabold text-brand-ink">
              {skillsEcosystem.title}
            </p>
            <p className="mt-2 text-sm text-brand-muted">{skillsEcosystem.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skillsEcosystem.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-brand-border bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-ink"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
