import type { NextConfig } from "next";

// فرع pages-export-trial: تصدير ساكن لـCloudflare Pages.
// redirects() وheaders() الأصلية محفوظة حرفياً في scripts/pages-export/next-config.cpanel.ts
// ويولّد منها scripts/pages-export/build-redirects.mjs الملفين out/_redirects وout/_headers.
const nextConfig: NextConfig = {
  output: "export",
  generateBuildId: async () => "5k8XfUZ6RfD8cslvt5p84",
  poweredByHeader: false,
  trailingSlash: false,
  reactStrictMode: true,
  images: { unoptimized: true },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
