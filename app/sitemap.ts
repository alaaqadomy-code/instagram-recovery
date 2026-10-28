import { articlePublicSlug, articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { gulfPages } from "@/lib/gulf-pages";
import { servicePages } from "@/lib/service-pages";
import { SITEMAP_GULF_SLUGS, isSitemapArticle } from "@/lib/index-policy";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();
  const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number; lastModified?: Date }[] =
    [
      { path: "/", changeFrequency: "weekly", priority: 1, lastModified: buildDate },
      { path: "/services", changeFrequency: "weekly", priority: 0.9, lastModified: buildDate },
      { path: "/articles", changeFrequency: "weekly", priority: 0.9, lastModified: buildDate },
      { path: "/check", changeFrequency: "monthly", priority: 0.9, lastModified: buildDate },
      { path: "/how-it-works", changeFrequency: "monthly", priority: 0.85, lastModified: buildDate },
      { path: "/about", changeFrequency: "monthly", priority: 0.6, lastModified: buildDate },
      { path: "/faq", changeFrequency: "monthly", priority: 0.7, lastModified: buildDate },
      { path: "/contact", changeFrequency: "monthly", priority: 0.8, lastModified: buildDate },
    ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      ...(route.lastModified ? { lastModified: route.lastModified } : {}),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...[...servicePages, ...gulfPages.filter((page) => SITEMAP_GULF_SLUGS.has(page.slug))].map((page) => ({
      url: absoluteUrl(`/services/${page.slug}`),
      lastModified: buildDate,
      changeFrequency: "weekly" as const,
      priority: 0.95,
    })),
    ...articles.filter((article) => isSitemapArticle(articlePublicSlug(article))).map((article) => ({
      url: absoluteUrl(`/articles/${articlePublicSlug(article)}`),
      lastModified: new Date(article.updated),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}

export const dynamic = "force-static";
