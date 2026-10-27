"use client";

import { HelpQuestion } from "@/components/help/HelpQuestion";
import { useHelpCenter } from "@/components/help/HelpCenterProvider";
import { helpCategories } from "@/content/help-center";

export function HelpArticleList() {
  const { filteredArticles, query } = useHelpCenter();
  const hasQuery = query.trim().length > 0;

  if (hasQuery && filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className="hlp-articles">
      {helpCategories.map((category) => {
        const articles = filteredArticles.filter((a) => a.categoryId === category.id);
        if (articles.length === 0) return null;

        return (
          <section
            key={category.id}
            id={category.id}
            className="hlp-category scroll-mt-28"
            aria-labelledby={`hlp-cat-${category.id}`}
          >
            <h2 id={`hlp-cat-${category.id}`} className="hlp-category__title font-display text-2xl font-extrabold">
              {category.title}
            </h2>
            <p className="hlp-category__desc">{category.description}</p>
            <div className="hlp-category__list">
              {articles.map((article) => (
                <HelpQuestion key={article.id} article={article} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
