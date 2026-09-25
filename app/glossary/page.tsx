import type { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/lib/glossary";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "مصطلحات استرجاع حساب إنستغرام",
  description:
    "معنى التعطيل والباند والتعليق والحذف والاختراق والشادوبان، وكيف يختلف كل مسار استرجاع عن الآخر.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "مصطلحات استرجاع حساب إنستغرام",
    url: absoluteUrl("/glossary"),
    inLanguage: "ar",
    hasDefinedTerm: glossaryTerms.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-bold text-[#1d4ed8]">
        <Link href="/articles">أدلّة الاسترجاع</Link> · مصطلحات
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">ماذا تعني رسائل إنستغرام؟</h1>
      <p className="mt-4 leading-8 text-slate-600">
        التعطيل غير الباند، والحذف غير الاختراق. هذا المسرد يشرح المصطلحات التي تظهر على الشاشة حتى تختار نموذج
        المراجعة الصحيح. المصدر الرسمي يبقى مركز مساعدة إنستغرام، ونحن غير تابعين لميتا.
      </p>
      <dl className="mt-10 space-y-8">
        {glossaryTerms.map((item) => (
          <div key={item.term}>
            <dt className="text-xl font-extrabold">{item.term}</dt>
            <dd className="mt-2 leading-8 text-slate-700">{item.definition}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-12 text-sm leading-7 text-slate-600">
        ابدأ من{" "}
        <Link className="font-bold text-[#1d4ed8]" href="/articles/farq-muattal-mahdhuf">
          الفرق بين الحساب المعطّل والمحذوف
        </Link>{" "}
        أو من{" "}
        <Link className="font-bold text-[#1d4ed8]" href="/faq">
          الأسئلة الشائعة
        </Link>
        .
      </p>
    </article>
  );
}
