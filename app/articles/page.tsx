import type { Metadata } from "next";
import { ArticlesExplorer } from "@/components/ArticlesExplorer";
import { articleCategories, articles } from "@/lib/articles";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "المدونة",
  description:
    "مقالات عربية تشرح كل حالة لحساب انستقرام خطوة بخطوة: معطّل، ومبنّد، ومعلّق، ومخترق، ومحذوف، ومشاكل الدخول وكود التحقق، بمسارات ميتا الرسمية.",
  alternates: { canonical: "/articles" },
  keywords: ["أدلة استرجاع انستقرام", "استرجاع حساب انستقرام معطل", "فك باند انستقرام"],
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header>
      <p className="text-sm font-bold text-[#1d4ed8]">المدونة</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">
        أدلة استرجاع انستقرام: خطوة بخطوة لكل حالة
      </h1>
      </header>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        شروحات عملية من فريق Unlock Accounts لكل حالة على حدة، بلغة واضحة وخطوات يمكن تطبيقها من أندرويد أو آيفون.
      </p>
      <ArticlesExplorer
        articles={articles.map(({ slug, title, description, keywords, category, image }) => ({ slug, title, description, keywords, category, image }))}
        categories={articleCategories}
      />
    </div>
  );
}
