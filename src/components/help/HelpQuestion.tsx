"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useHelpCenter } from "@/components/help/HelpCenterProvider";
import type { HelpArticle } from "@/types/help";

type Props = {
  article: HelpArticle;
};

export function HelpQuestion({ article }: Props) {
  const { openArticleIds, toggleArticle } = useHelpCenter();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const open = openArticleIds.has(article.id);

  useEffect(() => {
    const el = detailsRef.current;
    if (el && el.open !== open) el.open = open;
  }, [open]);

  return (
    <details
      ref={detailsRef}
      id={article.id}
      className="hlp-q scroll-mt-28"
      onToggle={(event) => {
        const isOpen = event.currentTarget.open;
        if (isOpen !== open) toggleArticle(article.id);
      }}
    >
      <summary className="hlp-q__summary">{article.question}</summary>
      <div className="hlp-q__panel">
        <p className="hlp-q__answer">{article.answer}</p>
        {article.relatedLinks && article.relatedLinks.length > 0 ? (
          <ul className="hlp-q__links">
            {article.relatedLinks.slice(0, 3).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hlp-q__link link-motion">{link.label}</Link>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="hlp-q__permalink">
          <Link href={`/aide#${article.id}`} className="link-motion">Lien vers cette question</Link>
        </p>
      </div>
    </details>
  );
}
