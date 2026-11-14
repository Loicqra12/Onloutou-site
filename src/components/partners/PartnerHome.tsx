"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { dpPaths, dpSpace } from "@/content/devenir-partenaire";
import { DpIcon } from "@/components/partners/DpIcon";
import { DpPicture } from "@/components/partners/DpPicture";
import { firstName, usePartnerSession } from "@/components/partners/usePartnerSession";
import { isProfileComplete, type PartnerProduct, type PartnerProfile } from "@/lib/partner-profile";
import { PartnerArticlesHome } from "@/components/partners/PartnerArticlesHome";
import { PartnerProfileRefused } from "@/components/partners/PartnerProfileRefused";
import type { PartnerArticle } from "@/lib/partner-articles";

export function PartnerHome() {
  const { user } = usePartnerSession();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [products, setProducts] = useState<PartnerProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [me, list] = await Promise.all([
        apiFetch<{ profile: PartnerProfile }>("/partner/me"),
        apiFetch<{ products?: PartnerProduct[]; items?: PartnerProduct[] }>("/partner/products"),
      ]);
      if (!me.ok) {
        setError(me.error);
        return;
      }
      setProfile(me.data.profile);
      if (list.ok) setProducts(list.data.products ?? list.data.items ?? []);
    })();
  }, []);

  if (error) {
    return <p className="ps-error" role="alert">{error}</p>;
  }
  if (!profile && !error) {
    return <p>Chargement du profil…</p>;
  }
  if (!profile) return null;

  const name = firstName(profile.user.displayName ?? user?.displayName);
  if (profile.status === "REJECTED") {
    return <PartnerProfileRefused name={name} reason={profile.rejectionReason} />;
  }
  if (profile.status === "APPROVED") {
    return (
      <PartnerArticlesHome
        name={name}
        commune={profile.commune}
        organization={profile.commercialName || profile.organizationName}
        articles={products as PartnerArticle[]}
      />
    );
  }
  const complete = isProfileComplete(profile);
  const status = profile.status;
  const step1Done = complete;
  const step2Current = complete;
  const step3Locked = true;

  let banner: { kind: string; title: string; text: string; cta?: { href: string; label: string } } | null = null;
  if (status === "DRAFT" || (status === "SUBMITTED" && !complete)) {
    banner = {
      kind: "",
      title: dpSpace.bannerTitle,
      text: dpSpace.bannerText,
      cta: { href: dpPaths.account, label: dpSpace.bannerCta },
    };
  } else if (status === "SUBMITTED") {
    banner = { kind: "info", title: dpSpace.reviewingTitle, text: dpSpace.reviewingText };
  }

  return (
    <>
      <p className="ps-crumb">
        <Link href={dpPaths.home}>{dpSpace.spaceRoot}</Link>
        {" / "}
        <span>{dpSpace.breadcrumbHome}</span>
      </p>
      <div className="ps-head">
        <div>
          <h1>{dpSpace.welcome.replace("{name}", name)}</h1>
          <p>{dpSpace.welcomeLead}</p>
        </div>
        <Link href={dpPaths.articles} className="ps-btn">
          {dpSpace.prepare} +
        </Link>
      </div>

      {banner ? (
        <div className={`ps-banner${banner.kind ? ` ps-banner--${banner.kind}` : ""}`}>
          <div className="ps-banner__mark">
            <DpIcon name="shield" />
            <div className="ps-banner__text">
              <h2>{banner.title}</h2>
              <p>{banner.text}</p>
            </div>
          </div>
          {banner.cta ? (
            <Link href={banner.cta.href} className="ps-btn ps-btn--yellow">
              {banner.cta.label} →
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="ps-tracker" aria-label="Étapes">
        <div className={`ps-step${step1Done ? " is-done" : " is-current"}`}>
          <span className="ps-step__n">1</span>
          {dpSpace.steps.profile}
        </div>
        <span className="ps-step__line" aria-hidden />
        <div className={`ps-step${step2Current ? " is-current" : ""}`}>
          <span className="ps-step__n">2</span>
          {dpSpace.steps.article}
        </div>
        <span className="ps-step__line" aria-hidden />
        <div className={`ps-step${step3Locked ? " is-locked" : " is-current"}`}>
          <span className="ps-step__n">3</span>
          <span>
            {dpSpace.steps.send}
            {step3Locked ? <span className="ps-step__lock"><DpIcon name="lock" /> {dpSpace.steps.locked}</span> : null}
          </span>
        </div>
      </div>

      <div className="ps-grid">
        <section className="ps-panel" aria-labelledby="ps-articles-title">
          <h2 id="ps-articles-title">{dpSpace.articlesTitle}</h2>
          {products.length === 0 ? (
            <>
              <p className="ps-muted">{dpSpace.articlesEmpty}</p>
              <DpPicture image={dpSpace.firstImage} sizes="(max-width: 900px) 100vw, 60vw" />
              <h3>{dpSpace.firstTitle}</h3>
              <p>{dpSpace.firstText}</p>
              <Link href={dpPaths.articles} className="ps-btn ps-btn--yellow">
                {dpSpace.firstCta} →
              </Link>
            </>
          ) : (
            <ul>
              {products.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> — {item.status}
                </li>
              ))}
            </ul>
          )}
          <p className="ps-foot-note">
            <DpIcon name="info" /> {dpSpace.visibility}
          </p>
        </section>
        <aside className="ps-side-card">
          <h2>{dpSpace.sideTitle}</h2>
          <ul>
            {dpSpace.side.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <DpIcon name={item.icon} />
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
