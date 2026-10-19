// بناء الإنتاج لـCloudflare Pages بمتغيرات الموقع الحي (قيم عامة ظاهرة في HTML، ليست أسراراً).
// الاستعمال: node scripts/build-pages.mjs
//   ثم: wrangler pages deploy out --project-name unlockaccounts --branch main --commit-dirty=true
// يحذف out/ ثم يشغّل next build ثم scripts/pages-export/build-redirects.mjs (يولّد out/_redirects وout/_headers).
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const env = {
  ...process.env,
  NEXT_PUBLIC_SITE_URL: "https://unlockaccounts.com",
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-JMWMDN048D",
  NEXT_PUBLIC_WHATSAPP: "962795827790",
  NEXT_PUBLIC_EMAIL: "hello@unlockaccounts.com",
};
fs.rmSync("out", { recursive: true, force: true });
const run = (cmd) => {
  const r = spawnSync(cmd, { shell: true, stdio: "inherit", env });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
run("npx next build");
run("node scripts/pages-export/build-redirects.mjs");

// فحص ذاتي: المتغيرات مخبوزة في الرئيسية، والملفات الأساسية موجودة.
const home = fs.readFileSync("out/index.html", "utf8");
const must = ["G-JMWMDN048D", "wa.me/962795827790", 'href="https://unlockaccounts.com"'];
for (const m of must) if (!home.includes(m)) { console.error(`مفقود في out/index.html: ${m}`); process.exit(1); }
for (const f of ["_redirects", "_headers", "robots.txt", "sitemap.xml", "llms.txt", "404.html"])
  if (!fs.existsSync(`out/${f}`)) { console.error(`ملف مفقود: out/${f}`); process.exit(1); }
console.log("build-pages: OK");
