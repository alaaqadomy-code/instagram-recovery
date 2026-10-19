// فرع pages-export: يولّد out/_redirects وout/_headers من redirects()/headers() الأصلية
// (scripts/pages-export/next-config.cpanel.ts، نسخة حرفية من next.config.ts على main).
// قواعد مضيف www (has: host) لا تُكتب: www يحوّله Cloudflare على الحافة قبل الأصل (مُقاس حياً 19 أكتوبر 2026).
// مطابقة Pages: المصدر يُطبَّع بـnew URL().pathname (ترميز النسبة)، فالصيغة الخام مكررة لا تلزم.
// القواعد الثابتة يجب أن تسبق أي قاعدة ديناميكية (بعد أول قاعدة ديناميكية يُحسب كل ما يليها ديناميكياً).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const { createJiti } = require("jiti");
const jiti = createJiti(path.join(root, "x.js"), { alias: { "@": root } });
const cfg = (await jiti.import(path.join(root, "scripts/pages-export/next-config.cpanel.ts"))).default;
const redirects = await cfg.redirects();
const out = path.join(root, "out");

const norm = (p) => new URL("//" + p, "relative://").pathname;
const status = (r) => r.statusCode ?? (r.permanent ? 308 : 307);
const isDynamic = (s) => /[:*(]/.test(s);
const staticLines = [];
const dynamicLines = [];
const seen = new Set();
let skippedHost = 0;
for (const r of redirects) {
  if (r.has) { skippedHost++; continue; }
  if (isDynamic(r.source)) {
    if (r.source === "/blog/:slug") dynamicLines.push(`/blog/:slug /articles/:slug ${status(r)}`, `/blog/:slug/ /articles/:slug ${status(r)}`); // Next يطابق :slug مع شرطة أخيرة اختيارية
    else if (r.source === "/:path+/") dynamicLines.push(`/*/ /:splat ${status(r)}`);
    else if (r.source === "/:path*") continue;
    else throw new Error(`قاعدة ديناميكية غير مترجمة: ${r.source}`);
    continue;
  }
  const src = norm(r.source);
  if (seen.has(src)) continue; // Next: أول تطابق يفوز
  seen.add(src);
  staticLines.push(`${src} ${encodeURI(decodeURI(r.destination))} ${status(r)}`);
}
// ملفات الصفحات المصدّرة: لا يجوز أن يكون مصدر تحويل صفحةً حية.
for (const line of staticLines) {
  const src = decodeURIComponent(line.split(" ")[0]);
  const f = path.join(out, src.replace(/\/$/, "") + ".html");
  if (!src.endsWith("/") && fs.existsSync(f)) throw new Error(`مصدر تحويل يطابق صفحة مصدّرة: ${src}`);
}
if (staticLines.length > 2000) throw new Error(`تجاوز حد القواعد الثابتة: ${staticLines.length}`);
if (dynamicLines.length > 100) throw new Error(`تجاوز حد القواعد الديناميكية: ${dynamicLines.length}`);
fs.writeFileSync(path.join(out, "_redirects"), [...staticLines, ...dynamicLines].join("\n") + "\n");

const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/icon.svg
  Cache-Control: public, max-age=31536000, immutable

/opengraph-image
  Content-Type: image/png

/sitemap.xml
  Cache-Control: public, max-age=3600, s-maxage=3600

/robots.txt
  Cache-Control: public, max-age=3600, s-maxage=3600
`;
fs.writeFileSync(path.join(out, "_headers"), headers);
console.log(JSON.stringify({ static: staticLines.length, dynamic: dynamicLines.length, skippedWwwHostRules: skippedHost, total: staticLines.length + dynamicLines.length }));
