import { appealArticles, businessArticles } from "./articles/appeal";
import { caseArticles } from "./articles/cases";
import { loginArticles } from "./articles/login";
import { securityArticles } from "./articles/security";
import type { Article } from "./articles/types";

export type { Article, ArticleFaq, ArticleSection } from "./articles/types";

export const articles: Article[] = [
  ...caseArticles,
  ...securityArticles,
  ...loginArticles,
  ...appealArticles,
  ...businessArticles,
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getAllSlugs() {
  return articles.map((article) => article.slug);
}

export const articleCategories = [...new Set(articles.map((article) => article.category))];
