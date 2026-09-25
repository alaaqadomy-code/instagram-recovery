export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export type ArticleFaq = {
  q: string;
  a: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  date: string;
  updated: string;
  readMinutes: number;
  category: string;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
};

export function make(
  article: Omit<Article, "date" | "updated" | "readMinutes"> &
    Partial<Pick<Article, "date" | "updated" | "readMinutes">>,
): Article {
  const text = article.sections.flatMap((section) => section.paragraphs).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return {
    date: "2026-08-06",
    updated: "2026-09-24",
    readMinutes: Math.max(11, Math.min(16, Math.round(words / 160))),
    ...article,
  };
}
