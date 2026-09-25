# Graph Report - instagram-recovery  (2026-09-25)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 190 nodes · 334 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10

## God Nodes (most connected - your core abstractions)
1. `next` - 24 edges
2. `compilerOptions` - 16 edges
3. `site` - 13 edges
4. `absoluteUrl()` - 11 edges
5. `WhatsAppCta()` - 9 edges
6. `Article` - 8 edges
7. `whatsappUrl` - 8 edges
8. `make()` - 5 edges
9. `scripts` - 5 edges
10. `articles` - 5 edges

## Surprising Connections (you probably didn't know these)
- `robots()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/robots.ts → lib/seo.ts
- `sitemap()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/sitemap.ts → lib/seo.ts
- `FaqJsonLd()` --calls--> `absoluteUrl()`  [EXTRACTED]
  components/FaqJsonLd.tsx → lib/seo.ts
- `ArticlePage()` --calls--> `getArticle()`  [EXTRACTED]
  app/articles/[slug]/page.tsx → lib/articles.ts
- `ArticlePage()` --calls--> `absoluteUrl()`  [EXTRACTED]
  app/articles/[slug]/page.tsx → lib/seo.ts

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (13): metadata, values, metadata, metadata, metadata, metadata, GhostCta(), Props (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (31): eslintConfig, dependencies, next, react, react-dom, devDependencies, eslint, eslint-config-next (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (20): ArticlePage(), dynamic, dynamicParams, generateMetadata(), Props, app_globals, cairo, metadata (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (14): dynamic, metadata, ArticleCard(), ArticlesExplorer(), appealArticles, businessArticles, articleCategories, caseArticles (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (15): metadata, metadata, stats, metadata, WhatsAppCta(), FaqJsonLd(), cases, failReasons (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.31
Nodes (8): clientIp(), hits, Payload, persist(), POST(), rateLimited(), ref_fs, ref_path

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (4): BlogSearch(), issues, RequestForm(), react

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (3): alt, contentType, size

## Knowledge Gaps
- **71 isolated node(s):** `Props`, `Props`, `Payload`, `metadata`, `values` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 93 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`, `Community 8`, `Community 9`?**
  _High betweenness centrality (0.477) - this node is a cross-community bridge._
- **Why does `react` connect `Community 7` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `Payload` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10252100840336134 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._