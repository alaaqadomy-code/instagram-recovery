import Link from "next/link";
import type { Article } from "@/lib/articles";

const limit = 10;

function latestArticles(list: Article[]) {
  return list
    .map((article, index) => ({ article, index }))
    .sort((a, b) => {
      const byUpdated = b.article.updated.localeCompare(a.article.updated);
      if (byUpdated !== 0) return byUpdated;
      const byDate = b.article.date.localeCompare(a.article.date);
      if (byDate !== 0) return byDate;
      return a.index - b.index;
    })
    .slice(0, limit)
    .map((item) => item.article);
}

function TickerGroup({ articles, hidden }: { articles: Article[]; hidden?: boolean }) {
  return (
    <ul className="latest-ticker-group" aria-hidden={hidden || undefined}>
      {articles.map((article) => (
        <li key={hidden ? `dup-${article.slug}` : article.slug} className="flex items-center">
          <Link
            href={`/articles/${article.slug}`}
            className="whitespace-nowrap px-5 text-sm font-bold text-[#f6f1e8] hover:text-[#fdba74]"
            tabIndex={hidden ? -1 : undefined}
          >
            {article.title}
          </Link>
          <span className="text-[#fdba74]" aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function LatestTicker({ articles }: { articles: Article[] }) {
  const latest = latestArticles(articles);
  if (latest.length === 0) return null;

  return (
    <div className="flex items-stretch border-b border-[#e6dcc8] bg-[#142033]">
      <p className="flex shrink-0 items-center bg-[#9a3412] px-4 text-sm font-extrabold text-white">
        أحدث العناوين
      </p>
      <div className="latest-ticker min-w-0 flex-1 py-2.5" dir="ltr">
        <div className="latest-ticker-track">
          <TickerGroup articles={latest} />
          <TickerGroup articles={latest} hidden />
        </div>
      </div>
    </div>
  );
}
