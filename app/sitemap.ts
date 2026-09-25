import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] =
    [
      { path: "/", changeFrequency: "weekly", priority: 1 },
      { path: "/services", changeFrequency: "weekly", priority: 0.9 },
      { path: "/articles", changeFrequency: "weekly", priority: 0.9 },
      { path: "/about", changeFrequency: "monthly", priority: 0.6 },
      { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
      { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
      { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
      { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: new Date("2026-09-24"),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: new Date(article.updated),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
