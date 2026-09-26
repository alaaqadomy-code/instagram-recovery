import type { Metadata } from "next";
import { ArticlesExplorer } from "@/components/ArticlesExplorer";
import { articles } from "@/lib/articles";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "المدونة",
  description:
    "مقالات عربية في المدونة، خطوة بخطوة لكل حالة: معطّل، مبنّد، معلّق، مخترق، محذوف، أو مشكلة دخول.",
  alternates: { canonical: "/articles" },
  keywords: ["أدلة استرجاع انستقرام", "استرجاع حساب انستقرام معطل", "فك باند انستقرام"],
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold text-[#1d4ed8]">المدونة</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">
        المدونة: خطوة بخطوة لكل حالة استرجاع
      </h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        شروحات عملية من فريق استرجاع انستا لكل حالة على حدة، بلغة واضحة وخطوات يمكن تطبيقها من أندرويد أو آيفون.
      </p>
      <ArticlesExplorer articles={articles} />
    </div>
  );
}
