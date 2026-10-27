import type { HelpArticle, HelpAudience } from "@/types/help";
import { helpCategories } from "@/content/help-center";

export function normalizeHelpText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function articleSearchBlob(article: HelpArticle): string {
  const category = helpCategories.find((c) => c.id === article.categoryId);
  const parts = [
    article.question,
    article.shortAnswer,
    article.answer,
    ...article.keywords,
    category?.title ?? "",
    category?.description ?? "",
  ];
  return normalizeHelpText(parts.join(" "));
}

export function filterHelpArticles(
  articles: HelpArticle[],
  query: string,
  audience: HelpAudience,
): HelpArticle[] {
  const normalizedQuery = normalizeHelpText(query.trim());
  return articles.filter((article) => {
    const audienceMatch =
      audience === "all" || article.audiences.includes("all") || article.audiences.includes(audience);
    if (!audienceMatch) return false;
    if (!normalizedQuery) return true;
    return articleSearchBlob(article).includes(normalizedQuery);
  });
}
