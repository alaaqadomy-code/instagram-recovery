import type { NextConfig } from "next";
import { titleToPublicSlug } from "./lib/arabic-slug";
import { articleRedirects } from "./lib/article-redirects";
import { articles } from "./lib/articles";

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
    const hosts = ["www.unlockaccounts.com", "instagram-recover.com", "www.instagram-recover.com"] as const;
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
      ...currentLatin,
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.unlockaccounts.com" }],
        destination: "https://unlockaccounts.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "instagram-recover.com" }],
        destination: "https://unlockaccounts.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.instagram-recover.com" }],
        destination: "https://unlockaccounts.com/:path*",
        permanent: true,
      },
      { source: "/blog", destination: "/articles", permanent: true },
      { source: "/blog/:slug", destination: "/articles/:slug", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/how-it-works", destination: "/about", permanent: true },
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
};

export default nextConfig;
