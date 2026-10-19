<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# unlockaccounts: الاستضافة والنشر (منذ 2026-10-19 17:59 عمّان)

- الموقع تصدير ساكن على **Cloudflare Pages** (مشروع `unlockaccounts`)، لا على cPanel. `next.config.ts` يستعمل `output: "export"`: لا مسارات API ولا Server Actions ولا `redirects()`/`headers()`/middleware فاعلة؛ التحويلات والرؤوس تُولَّد وقت البناء في `out/_redirects` و`out/_headers` عبر `scripts/pages-export/build-redirects.mjs` من `scripts/pages-export/next-config.cpanel.ts`.
- البناء: `node scripts/build-pages.mjs` (يمرّر `NEXT_PUBLIC_SITE_URL=https://unlockaccounts.com` و`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-JMWMDN048D` و`NEXT_PUBLIC_WHATSAPP=962795827790` و`NEXT_PUBLIC_EMAIL=hello@unlockaccounts.com`، ويفشل إن لم تُخبز في `out/index.html`).
- النشر: `wrangler pages deploy out --project-name unlockaccounts --branch main` بعد تصفير `CLOUDFLARE_API_TOKEN`، **بلا `--force`**.
- **ملغى:** أي نشر إلى cPanel (tgz و`server.extract-deploy.js` وPassenger و`scripts/cpanel-*.ps1`). cPanel احتياط للتراجع حتى 2 نوفمبر 2026 فقط.
- لا `git add -A`، ولا تضف `.next/` إلى أي commit (متتبَّع خطأً).
- التفاصيل في `CLAUDE.md` قسم «طريقة النشر الصحيحة».
