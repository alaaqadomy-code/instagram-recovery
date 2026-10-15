import { appealArticles, businessArticles } from "./articles/appeal";
import { gapArticles } from "./articles/gaps-2026";
import { disabledIntentArticles } from "./articles/disabled-intents-2026";
import { gapArticles202610 } from "./articles/gaps-2026-10";
import { keywordGapArticles } from "./articles/keyword-gaps";
import { caseArticles } from "./articles/cases";
import { guideArticles } from "./articles/guides";
import { keywordArticlesA } from "./articles/keywords-a";
import { keywordArticlesB } from "./articles/keywords-b";
import { moreGuideArticles } from "./articles/guides-more";
import { loginArticles } from "./articles/login";
import { plannerArticlesA } from "./articles/planner-a";
import { plannerArticlesB } from "./articles/planner-b";
import { plannerArticlesC } from "./articles/planner-c";
import { plannerArticlesD } from "./articles/planner-d";
import { securityArticles } from "./articles/security";
import { draftArticles20261010 } from "./articles/drafts-2026-10-10";
import { tawthiqGapArticles } from "./articles/tawthiq-gaps";
import { titleToPublicSlug } from "./arabic-slug";
import type { Article } from "./articles/types";
import { publishArticles } from "./publish-articles";

export type { Article, ArticleFaq, ArticleSection } from "./articles/types";

export const batchArticles20261010 = draftArticles20261010;

export const rawArticles: Article[] = [
  ...plannerArticlesA,
  ...plannerArticlesB,
  ...plannerArticlesC,
  ...plannerArticlesD,
  ...keywordArticlesA,
  ...keywordArticlesB,
  ...guideArticles,
  ...moreGuideArticles,
  ...caseArticles,
  ...securityArticles,
  ...loginArticles,
  ...appealArticles,
  ...businessArticles,
  ...gapArticles,
  ...keywordGapArticles,
  ...disabledIntentArticles,
  ...gapArticles202610,
  ...batchArticles20261010,
  ...tawthiqGapArticles,
];

export const articles: Article[] = publishArticles(rawArticles);

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articlePublicSlug(article: Pick<Article, "title">) {
  return titleToPublicSlug(article.title);
}

export function articlePath(slug: string) {
  const article = getArticle(slug);
  if (!article) return `/articles/${slug}`;
  return `/articles/${articlePublicSlug(article)}`;
}

function decodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getArticleByPublicSlug(value: string) {
  const decoded = decodeSlug(value);
  return articles.find((article) => {
    const slug = articlePublicSlug(article);
    return slug === value || slug === decoded;
  });
}

export function getAllSlugs() {
  return articles.map((article) => article.slug);
}

export const articleCategories = [...new Set(articles.map((article) => article.category))];
