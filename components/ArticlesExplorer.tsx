"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { articleCategories, type Article } from "@/lib/articles";

export function ArticlesExplorer({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim();

  const filtered = useMemo(() => {
    if (!q) return articles;
    return articles.filter((article) => {
      const hay = `${article.title} ${article.description} ${article.keywords.join(" ")} ${article.category}`;
      return hay.includes(q);
    });
  }, [articles, q]);

  const grouped = articleCategories
    .map((category) => ({
      category,
      items: filtered.filter((article) => article.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="q" className="sr-only">
          ابحث في المدونة
        </label>
        <input
          id="q"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="مثال: استرجاع حساب انستقرام معطل"
          className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-base"
        />
      </form>
      {grouped.map((group) => (
        <section key={group.category} className="mt-12">
          <h2 className="text-2xl font-extrabold">{group.category}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 ? (
        <p className="mt-10 text-slate-600">لا توجد مقالة لهذه الكلمة بعد. راسلنا عبر واتساب لنكتبها.</p>
      ) : null}
    </>
  );
}
