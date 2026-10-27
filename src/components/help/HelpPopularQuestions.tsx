"use client";

import { useHelpCenter } from "@/components/help/HelpCenterProvider";
import { helpArticles, helpPopularArticleIds } from "@/content/help-center";

export function HelpPopularQuestions() {
  const { openArticle, filteredArticles } = useHelpCenter();
  const popular = helpPopularArticleIds
    .map((id) => helpArticles.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .filter((a) => filteredArticles.some((f) => f.id === a.id));

  if (popular.length === 0) return null;

  return (
    <section className="hlp-popular section-spacing bg-brand-white" aria-labelledby="hlp-popular-title">
      <div className="container-content max-w-3xl">
        <h2 id="hlp-popular-title" className="font-display text-2xl font-extrabold tracking-tight">
          Questions fréquentes
        </h2>
        <ul className="hlp-popular__list">
          {popular.map((article) => (
            <li key={article.id}>
              <button type="button" className="hlp-popular__btn" onClick={() => openArticle(article.id)}>
                {article.question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
