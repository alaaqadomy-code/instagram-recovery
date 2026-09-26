import { appealArticles, businessArticles } from "./articles/appeal";
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
import type { Article } from "./articles/types";

export type { Article, ArticleFaq, ArticleSection } from "./articles/types";

export const articles: Article[] = [
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
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getAllSlugs() {
  return articles.map((article) => article.slug);
}

export const articleCategories = [...new Set(articles.map((article) => article.category))];
