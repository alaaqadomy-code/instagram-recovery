# Graph Report - instagram-recovery  (2026-09-25)

## Corpus Check
- 54 files · ~23,323 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .ico 1)

## Summary
- 232 nodes · 389 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- next
- package.json
- absoluteUrl
- articles.ts
- app/page.tsx
- compilerOptions
- request/route.ts
- react
- opengraph-image.tsx
- next.config.ts
- postcss.config.mjs
- AEO/GEO Assessment Report: instagram-recovery
- server.js
- إنسترجع — موقع استرجاع حسابات إنستغرام المعطّلة
- AEO work log
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `next` - 26 edges
2. `absoluteUrl()` - 18 edges
3. `compilerOptions` - 16 edges
4. `site` - 15 edges
5. `WhatsAppCta()` - 9 edges
6. `Article` - 8 edges
7. `whatsappUrl` - 8 edges
8. `articles` - 7 edges
9. `make()` - 5 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `GlossaryPage()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/glossary/page.tsx → lib/seo.ts
- `GET()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/llms-full.txt/route.ts → lib/seo.ts
- `robots()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/robots.ts → lib/seo.ts
- `sitemap()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/sitemap.ts → lib/seo.ts
- `FaqJsonLd()` --calls--> `absoluteUrl()`  [EXTRACTED]
  components/FaqJsonLd.tsx → lib/seo.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "next"
Cohesion: 0.10
Nodes (19): metadata, values, app_globals, cairo, metadata, viewport, metadata, metadata (+11 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (31): eslintConfig, dependencies, next, react, react-dom, devDependencies, eslint, eslint-config-next (+23 more)

### Community 2 - "absoluteUrl"
Cohesion: 0.12
Nodes (19): ArticlePage(), dynamic, dynamicParams, generateMetadata(), Props, GlossaryPage(), metadata, dynamic (+11 more)

### Community 3 - "articles.ts"
Cohesion: 0.17
Nodes (14): dynamic, metadata, ArticleCard(), ArticlesExplorer(), appealArticles, businessArticles, articleCategories, caseArticles (+6 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.11
Nodes (19): metadata, metadata, metadata, metadata, stats, metadata, GhostCta(), Props (+11 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "request/route.ts"
Cohesion: 0.31
Nodes (8): clientIp(), hits, Payload, persist(), POST(), rateLimited(), ref_fs, ref_path

### Community 7 - "react"
Cohesion: 0.25
Nodes (4): BlogSearch(), issues, RequestForm(), react

### Community 8 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 11 - "AEO/GEO Assessment Report: instagram-recovery"
Cohesion: 0.22
Nodes (8): AEO/GEO Assessment Report: instagram-recovery, All 29 Items, High Impact, Low Impact, Med Impact, 🚀 Quick Wins (High Impact + Low Difficulty), Suggestions by Priority, Summary

### Community 12 - "server.js"
Cohesion: 0.22
Nodes (8): ref_http, ref_url, app, { createServer }, handle, next, { parse }, port

### Community 13 - "إنسترجع — موقع استرجاع حسابات إنستغرام المعطّلة"
Cohesion: 0.40
Nodes (4): SEO, إنسترجع — موقع استرجاع حسابات إنستغرام المعطّلة, الأمان, التشغيل محلياً

## Knowledge Gaps
- **92 isolated node(s):** `metadata`, `values`, `Payload`, `hits`, `Props` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 121 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `absoluteUrl`, `articles.ts`, `app/page.tsx`, `request/route.ts`, `react`, `opengraph-image.tsx`, `next.config.ts`, `server.js`?**
  _High betweenness centrality (0.418) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `articles.ts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `metadata`, `values`, `Payload` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.10241820768136557 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `absoluteUrl` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10795454545454546 - nodes in this community are weakly interconnected._