import type { NextConfig } from "next";

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
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.instagram-recover.com" }],
        destination: "https://instagram-recover.com/:path*",
        permanent: true,
      },
      { source: "/blog", destination: "/articles", permanent: true },
      { source: "/blog/:slug", destination: "/articles/:slug", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/how-it-works", destination: "/about", permanent: true },
      { source: "/articles/istirja-instagram-android-iphone", destination: "/articles/istirja-min-computer", permanent: true },
      { source: "/articles/hisab-muattal-huquq-nashr", destination: "/articles/taattil-huquq-nashr", permanent: true },
      { source: "/articles/baad-al-hasr-madha-tafal", destination: "/articles/istirja-hisab-instagram-muattal", permanent: true },
    ];
  },
};

export default nextConfig;
