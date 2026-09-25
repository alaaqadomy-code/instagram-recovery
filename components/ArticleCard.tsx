import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <p className="text-xs font-bold text-[#1d4ed8]">{article.category}</p>
      <h2 className="mt-2 text-lg font-bold leading-8 text-slate-900">
        <Link href={`/articles/${article.slug}`} className="hover:text-[#1d4ed8]">
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{article.description}</p>
      <p className="mt-4 text-xs font-semibold text-[#1d4ed8]">افتح الدليل ←</p>
    </article>
  );
}
