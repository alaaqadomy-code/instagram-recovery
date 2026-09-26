# Graph Report - instagram-recovery  (2026-09-26)

## Corpus Check
- 133 files · ~292,495 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 500 nodes · 687 edges · 72 communities (18 shown, 54 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9964a394`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- package.json
- pathlib
- articles.ts
- app/page.tsx
- compilerOptions
- request/route.ts
- next.config.ts
- opengraph-image.tsx
- server.extract-deploy.js
- postcss.config.mjs
- AEO/GEO Assessment Report: instagram-recovery
- server.js
- إنسترجع — موقع استرجاع حسابات إنستغرام المعطّلة
- AEO work log
- AGENTS.md
- server.deploy-build.js
- server.debug.js
- _gen_planner_d.py
- ref_fs
- instagram-recovery-keywords-keyword-planner_32ec0665.md
- كلمات استرجاع حساب إنستغرام
- فجوة الكلمات الـ69 مقابل المقالات
- planner-69-slug-map.md

## God Nodes (most connected - your core abstractions)
1. `next` - 31 edges
2. `absoluteUrl()` - 19 edges
3. `Article` - 17 edges
4. `compilerOptions` - 16 edges
5. `site` - 15 edges
6. `make()` - 13 edges
7. `WhatsAppCta()` - 9 edges
8. `articles` - 7 edges
9. `article_ts()` - 7 edges
10. `whatsappUrl` - 7 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `getArticle()`  [EXTRACTED]
  app/page.tsx → lib/articles.ts
- `GlossaryPage()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/glossary/page.tsx → lib/seo.ts
- `GET()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/llms-full.txt/route.ts → lib/seo.ts
- `robots()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/robots.ts → lib/seo.ts
- `sitemap()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/sitemap.ts → lib/seo.ts

## Import Cycles
- None detected.

## Communities (72 total, 54 thin omitted)

### Community 0 - "next"
Cohesion: 0.05
Nodes (44): metadata, values, ArticlePage(), dynamic, dynamicParams, generateMetadata(), Props, metadata (+36 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (35): BlogSearch(), issues, RequestForm(), eslintConfig, dependencies, next, react, react-dom (+27 more)

### Community 2 - "pathlib"
Cohesion: 0.06
Nodes (30): collections, Build Excel from Google Keyword Planner extracts (2026-09-26)., datetime, hashlib, Image, ImageDraw, importlib_util, math (+22 more)

### Community 3 - "articles.ts"
Cohesion: 0.09
Nodes (30): dynamic, metadata, ArticleCard(), ArticlesExplorer(), appealArticles, businessArticles, articleCategories, caseArticles (+22 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.08
Nodes (23): metadata, beats, deskFaqs, guideGroups, HomePage(), hrefByTitle, intake, ledger (+15 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "request/route.ts"
Cohesion: 0.36
Nodes (7): clientIp(), hits, Payload, persist(), POST(), rateLimited(), ref_path

### Community 8 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 9 - "server.extract-deploy.js"
Cohesion: 0.12
Nodes (11): app, { createServer }, { execSync }, fs, handle, logFile, next, { parse } (+3 more)

### Community 11 - "AEO/GEO Assessment Report: instagram-recovery"
Cohesion: 0.22
Nodes (8): AEO/GEO Assessment Report: instagram-recovery, All 29 Items, High Impact, Low Impact, Med Impact, 🚀 Quick Wins (High Impact + Low Difficulty), Suggestions by Priority, Summary

### Community 12 - "server.js"
Cohesion: 0.15
Nodes (12): app, { createServer }, decodePassengerEnv(), fs, handle, next, originalPath(), { parse } (+4 more)

### Community 13 - "إنسترجع — موقع استرجاع حسابات إنستغرام المعطّلة"
Cohesion: 0.33
Nodes (5): SEO, إنسترجع — موقع استرجاع حسابات إنستغرام المعطّلة, الأمان, التشغيل محلياً, هوية المشروع

### Community 17 - "server.deploy-build.js"
Cohesion: 0.12
Nodes (12): ref_child_process, app, buildFlag, { createServer }, { execSync }, fs, handle, next (+4 more)

### Community 18 - "server.debug.js"
Cohesion: 0.15
Nodes (13): ref_http, ref_url, app, { createServer }, fs, handle, log(), logFile (+5 more)

### Community 19 - "_gen_planner_d.py"
Cohesion: 0.11
Nodes (17): clamp(), main(), One-shot: expand then clamp planner-d articles to 900–1100 words., Extra expansions for planner articles 60–69., expand(), main(), Expand planner-d articles to ~900–1100 words then rewrite planner-d.ts., article_ts() (+9 more)

### Community 21 - "instagram-recovery-keywords-keyword-planner_32ec0665.md"
Cohesion: 0.50
Nodes (3): Sheet: استرجاع فقط, Sheet: الأكثر بحثاً, Sheet: ملاحظات

### Community 67 - "كلمات استرجاع حساب إنستغرام"
Cohesion: 0.25
Nodes (7): الأعلى بحثاً, الحساب المعطّل داخل القائمة, كلمات استرجاع حساب إنستغرام, ما ظهر في النتائج واستُبعد من الترتيب, ملاحظات الإملاء, نطاق 100 – 1 ألف, نطاق 1 ألف – 10 ألف

### Community 68 - "فجوة الكلمات الـ69 مقابل المقالات"
Cohesion: 0.50
Nodes (3): الناقص فقط, فجوة الكلمات الـ69 مقابل المقالات, ملخص

## Knowledge Gaps
- **157 isolated node(s):** `metadata`, `values`, `Payload`, `hits`, `Props` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 302 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `articles.ts`, `app/page.tsx`, `request/route.ts`, `next.config.ts`, `opengraph-image.tsx`, `server.extract-deploy.js`, `server.js`, `server.deploy-build.js`, `server.debug.js`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **Why does `react` connect `package.json` to `next`, `articles.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `metadata`, `values`, `Payload` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.05379746835443038 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `pathlib` be split into smaller, more focused modules?**
  _Cohesion score 0.06463414634146342 - nodes in this community are weakly interconnected._
- **Should `articles.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09098639455782313 - nodes in this community are weakly interconnected._