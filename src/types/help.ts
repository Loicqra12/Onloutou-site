export type HelpAudience = "all" | "customer" | "business" | "partner" | "driver";

export type HelpArticleStatus = "verified" | "conditional" | "planned";

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
};

export type HelpRelatedLink = {
  label: string;
  href: string;
};

export type HelpArticle = {
  id: string;
  categoryId: string;
  question: string;
  shortAnswer: string;
  answer: string;
  audiences: HelpAudience[];
  keywords: string[];
  status: HelpArticleStatus;
  relatedLinks?: HelpRelatedLink[];
};

export type HelpServiceAvailability = "available" | "pilot" | "in-preparation" | "to-confirm";
