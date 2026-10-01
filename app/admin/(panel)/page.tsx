import { Dashboard, type ArticleStat } from "@/components/admin/Dashboard";
import { resolveSearchWindow } from "@/lib/admin/ranges";
import { getGsc } from "@/lib/admin/search-console";
import { getAdminReport } from "@/lib/analytics.js";
import { articlePath, articles } from "@/lib/articles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const query = await searchParams;
  const report = getAdminReport(query.range);
  const searchWindow = resolveSearchWindow(report.range);
  const gsc = await getGsc(searchWindow);
  const hits = new Map(report.articleHits.map((row) => [row.path, row]));
  const rows: ArticleStat[] = articles
    .map((article) => {
      const path = articlePath(article.slug);
      const legacy = hits.get(`/articles/${article.slug}`);
      const hit = hits.get(path);
      return {
        title: article.title,
        path,
        published: article.updated,
        category: article.category,
        visits: (hit?.visits ?? 0) + (legacy?.visits ?? 0),
        visitors: (hit?.visitors ?? 0) + (legacy?.visitors ?? 0),
      };
    })
    .sort((a, b) => b.visits - a.visits || a.title.localeCompare(b.title, "ar"));

  return (
    <Dashboard
      report={report}
      articles={rows}
      publishedCount={articles.length}
      gsc={gsc}
      searchLabel={searchWindow.label}
    />
  );
}
