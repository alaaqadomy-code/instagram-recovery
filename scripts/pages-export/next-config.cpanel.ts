import type { NextConfig } from "next";
import { titleToPublicSlug } from "../../lib/arabic-slug";
import { articleRedirects, mergedSlugToFinal } from "../../lib/article-redirects";
import { articles, rawArticles } from "../../lib/articles";
import { retiredDrafts20261010 } from "../../lib/retired-drafts-2026-10-10";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  generateBuildId: async () => "5k8XfUZ6RfD8cslvt5p84",
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/admin",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" }],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/icon.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    const hosts = ["www.unlockaccounts.com"] as const;
    const toPublicDestination = (destination: string) => {
      if (!destination.startsWith("/articles/")) return destination;
      const slug = destination.slice("/articles/".length);
      const article = articles.find((item) => item.slug === slug);
      if (!article) return destination;
      return `/articles/${titleToPublicSlug(article.title)}`;
    };
    const direct = articleRedirects.flatMap((item) => {
      const blog = item.source.replace("/articles/", "/blog/");
      const paths = [item.source, `${item.source}/`, blog, `${blog}/`];
      return [
        ...hosts.flatMap((host) =>
          paths.map((source) => ({
            source,
            has: [{ type: "host" as const, value: host }],
            destination: `https://unlockaccounts.com${toPublicDestination(item.destination)}`,
            statusCode: 301 as const,
          })),
        ),
        ...paths.map((source) => ({
          source,
          destination: toPublicDestination(item.destination),
          statusCode: 301 as const,
        })),
      ];
    });

    const legacy = [
      ["/articles/istirja-instagram-android-iphone", "/articles/istirja-min-mutasaffih"],
      ["/blog/istirja-instagram-android-iphone", "/articles/istirja-min-mutasaffih"],
      ["/articles/hisab-muattal-huquq-nashr", "/articles/taattil-huquq-nashr"],
      ["/blog/hisab-muattal-huquq-nashr", "/articles/taattil-huquq-nashr"],
      ["/articles/baad-al-hasr-madha-tafal", "/articles/istirja-hisab-instagram-muattal"],
      ["/blog/baad-al-hasr-madha-tafal", "/articles/istirja-hisab-instagram-muattal"],
    ].flatMap(([source, destination]) => {
      const paths = [source, `${source}/`];
      return [
        ...hosts.flatMap((host) =>
          paths.map((path) => ({
            source: path,
            has: [{ type: "host" as const, value: host }],
            destination: `https://unlockaccounts.com${toPublicDestination(destination)}`,
            statusCode: 301 as const,
          })),
        ),
        ...paths.map((path) => ({
          source: path,
          destination: toPublicDestination(destination),
          statusCode: 301 as const,
        })),
      ];
    });

    const bySlug = new Map(rawArticles.map((article) => [article.slug, article]));
    const livePaths = new Set(articles.map((article) => `/articles/${titleToPublicSlug(article.title)}`));
    const encodePath = (value: string) =>
      value
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");

    // دفعة 10 أكتوبر 2026 المحذوفة: 123 رابطاً ← 16 مقالاً أماً، قفزة واحدة إلى صفحة حية.
    const retiredSources = new Set<string>();
    const retired = retiredDrafts20261010.flatMap((item) => {
      const target = articles.find((article) => article.slug === item.target);
      if (!target) throw new Error(`Retired draft target is not published: ${item.slug} -> ${item.target}`);
      if (livePaths.has(item.source)) throw new Error(`Retired draft source is still live: ${item.source}`);
      if (retiredSources.has(item.source)) throw new Error(`Duplicate retired draft source: ${item.source}`);
      retiredSources.add(item.source);
      const destination = `/articles/${titleToPublicSlug(target.title)}`;
      const encoded = encodePath(item.source);
      const latin = `/articles/${item.slug}`;
      const sources = [encoded, encoded.replace("/articles/", "/blog/"), latin, latin.replace("/articles/", "/blog/")];
      const paths = sources.flatMap((path) => [path, `${path}/`]);
      return [
        ...hosts.flatMap((host) =>
          paths.map((path) => ({
            source: path,
            has: [{ type: "host" as const, value: host }],
            destination: `https://unlockaccounts.com${destination}`,
            statusCode: 301 as const,
          })),
        ),
        ...paths.map((path) => ({ source: path, destination, statusCode: 301 as const })),
      ];
    });

    const seenArabic = new Set<string>(retiredSources);
    const arabicMerged = [...mergedSlugToFinal].flatMap(([fromSlug, toSlug]) => {
      const source = bySlug.get(fromSlug);
      const dest = bySlug.get(toSlug);
      if (!source || !dest) return [];
      const sourcePath = `/articles/${titleToPublicSlug(source.title)}`;
      const destPath = `/articles/${titleToPublicSlug(dest.title)}`;
      if (sourcePath === destPath || livePaths.has(sourcePath) || seenArabic.has(sourcePath)) return [];
      seenArabic.add(sourcePath);
      // Node matches redirects against the percent-encoded pathname.
      const encodedSource = sourcePath
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
      const paths = [encodedSource, `${encodedSource}/`];
      return [
        ...hosts.flatMap((host) =>
          paths.map((path) => ({
            source: path,
            has: [{ type: "host" as const, value: host }],
            destination: `https://unlockaccounts.com${destPath}`,
            statusCode: 301 as const,
          })),
        ),
        ...paths.map((path) => ({
          source: path,
          destination: destPath,
          statusCode: 301 as const,
        })),
      ];
    });

    const currentLatin = articles.flatMap((article) => {
      const source = `/articles/${article.slug}`;
      const blog = source.replace("/articles/", "/blog/");
      const destination = `/articles/${titleToPublicSlug(article.title)}`;
      const paths = [source, `${source}/`, blog, `${blog}/`];
      return [
        ...hosts.flatMap((host) =>
          paths.map((path) => ({
            source: path,
            has: [{ type: "host" as const, value: host }],
            destination: `https://unlockaccounts.com${destination}`,
            statusCode: 301 as const,
          })),
        ),
        ...paths.map((path) => ({ source: path, destination, statusCode: 301 as const })),
      ];
    });

    return [
      ...legacy,
      ...direct,
      ...retired,
      ...arabicMerged,
      ...currentLatin,
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.unlockaccounts.com" }],
        destination: "https://unlockaccounts.com/:path*",
        permanent: true,
      },
      { source: "/blog", destination: "/articles", permanent: true },
      { source: "/blog/:slug", destination: "/articles/:slug", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
};

export default nextConfig;
