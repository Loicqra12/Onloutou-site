"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { HelpArticle, HelpAudience } from "@/types/help";
import { filterHelpArticles } from "@/lib/help-search";
import { helpArticles, helpCategories } from "@/content/help-center";

type HelpCenterContextValue = {
  query: string;
  setQuery: (value: string) => void;
  clearQuery: () => void;
  audience: HelpAudience;
  setAudience: (value: HelpAudience) => void;
  filteredArticles: HelpArticle[];
  resultCount: number;
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string | null) => void;
  openArticleIds: Set<string>;
  toggleArticle: (id: string) => void;
  openArticle: (id: string) => void;
};

const HelpCenterContext = createContext<HelpCenterContextValue | null>(null);

export function useHelpCenter() {
  const ctx = useContext(HelpCenterContext);
  if (!ctx) throw new Error("useHelpCenter must be used within HelpCenterProvider");
  return ctx;
}

export function HelpCenterProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<HelpAudience>("all");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [openArticleIds, setOpenArticleIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const hash = window.location.hash.replace("#", "");
    if (hash && helpArticles.some((a) => a.id === hash)) return new Set([hash]);
    return new Set();
  });

  const filteredArticles = useMemo(
    () => filterHelpArticles(helpArticles, query, audience),
    [query, audience],
  );

  const clearQuery = useCallback(() => setQuery(""), []);

  const toggleArticle = useCallback((id: string) => {
    setOpenArticleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openArticle = useCallback((id: string) => {
    setOpenArticleIds((prev) => new Set(prev).add(id));
    const article = helpArticles.find((a) => a.id === id);
    if (article) setActiveCategoryId(article.categoryId);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      const summary = el?.querySelector("summary");
      if (summary instanceof HTMLElement) summary.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash || !helpArticles.some((a) => a.id === hash)) return;
      setOpenArticleIds((prev) => new Set(prev).add(hash));
      const article = helpArticles.find((a) => a.id === hash);
      if (article) setActiveCategoryId(article.categoryId);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!activeCategoryId) return;
    const onScroll = () => {
      for (const category of helpCategories) {
        const section = document.getElementById(category.id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom > 140) {
          setActiveCategoryId(category.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeCategoryId]);

  const value: HelpCenterContextValue = {
    query,
    setQuery,
    clearQuery,
    audience,
    setAudience,
    filteredArticles,
    resultCount: filteredArticles.length,
    activeCategoryId,
    setActiveCategoryId,
    openArticleIds,
    toggleArticle,
    openArticle,
  };

  return <HelpCenterContext.Provider value={value}>{children}</HelpCenterContext.Provider>;
}
