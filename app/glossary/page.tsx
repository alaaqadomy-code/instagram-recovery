import type { Metadata } from "next";
import Link from "next/link";
import { articlePath, getArticle } from "@/lib/articles";
import { glossaryGroups, glossaryTerms } from "@/lib/glossary";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const pageTitle = "مصطلحات استرجاع حساب إنستغرام: ماذا تعني كل رسالة على الشاشة";
const pageDescription =
  "معنى التعطيل والتعليق والباند وحظر النشاط والحذف والاختراق والشادوبان ورموز الاسترداد، بنص الشاشة بالإنجليزية، وماذا تفعل في كل حالة.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/glossary",
    type: "website",
  },
};

export default function GlossaryPage() {
  // 2026-10-26: صفحة تعريفية — DefinedTermSet داخل WebPage، بلا Service.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/glossary")}#webpage`,
        url: absoluteUrl("/glossary"),
        name: pageTitle,
        description: pageDescription,
        inLanguage: "ar",
        isPartOf: { "@type": "WebSite", url: absoluteUrl("/"), name: site.name },
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
        mainEntity: { "@id": `${absoluteUrl("/glossary")}#terms` },
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${absoluteUrl("/glossary")}#terms`,
        name: "مصطلحات استرجاع حساب إنستغرام",
        url: absoluteUrl("/glossary"),
        inLanguage: "ar",
        hasDefinedTerm: glossaryTerms.map((item) => ({
          "@type": "DefinedTerm",
          name: item.term,
          ...(item.en ? { alternateName: item.en } : {}),
          description: item.definition,
          inDefinedTermSet: `${absoluteUrl("/glossary")}#terms`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "المدونة", item: absoluteUrl("/articles") },
          { "@type": "ListItem", position: 3, name: "مصطلحات", item: absoluteUrl("/glossary") },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-bold text-[#1d4ed8]">
        <Link href="/articles">المدونة</Link> · مصطلحات
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.4] sm:text-4xl">ماذا تعني رسائل إنستغرام؟</h1>
      <p className="mt-4 leading-8 text-slate-600">
        التعطيل غير الباند، والحذف غير الاختراق. هذا المسرد يشرح المصطلحات التي تظهر على الشاشة حتى تختار نموذج
        المراجعة الصحيح. المصدر الرسمي يبقى مركز مساعدة إنستغرام، ونحن غير تابعين لميتا.
      </p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-extrabold">كيف تستعمل هذا المسرد؟</h2>
        <p className="mt-2 leading-8 text-slate-700">
          ابدأ من الكلمة المكتوبة على شاشتك لا من وصفك لما حدث. إن كان هاتفك يعرض إنستغرام بالإنجليزية فابحث عن النص
          الإنجليزي المذكور تحت المصطلح. ثلاث كلمات تُخلط أكثر من غيرها: <strong>التعطيل</strong> يمنع الدخول بقرار من
          ميتا، و<strong>حظر النشاط</strong> يترك الدخول ويمنع إجراءً بعينه، و<strong>التعطيل المؤقت</strong> تختاره أنت
          من الإعدادات وتلغيه بتسجيل الدخول. لكل واحدة مسار مختلف، والخلط بينها أكثر سبب نراه لرفض الطلبات.
        </p>
        <p className="mt-2 leading-8 text-slate-700">
          المصطلحات مرتبة في خمس مجموعات: حالات الحساب، ثم الدخول والتحقق، ثم المراجعة والبلاغات، ثم الأمان والاحتيال،
          ثم أنواع الحسابات. وتحت كل مصطلح رابط إلى الدليل الذي يشرح خطواته كاملة.
        </p>
      </section>

      {glossaryGroups.map((group) => (
        <section key={group} className="mt-12">
          <h2 className="text-2xl font-extrabold">{group}</h2>
          <dl className="mt-6 space-y-8">
            {glossaryTerms
              .filter((item) => item.group === group)
              .map((item) => {
                const guide = item.slug ? getArticle(item.slug) : undefined;
                return (
                  <div key={item.term}>
                    <dt className="text-xl font-extrabold">
                      {item.term}
                      {item.en ? (
                        <span className="ms-2 text-sm font-semibold text-slate-500" dir="ltr">
                          {item.en}
                        </span>
                      ) : null}
                    </dt>
                    <dd className="mt-2 leading-8 text-slate-700">{item.definition}</dd>
                    <dd className="mt-2 leading-8 text-slate-600">{item.more}</dd>
                    {guide ? (
                      <dd className="mt-2 text-sm">
                        <Link className="font-bold text-[#1d4ed8]" href={articlePath(guide.slug)}>
                          {guide.title}
                        </Link>
                      </dd>
                    ) : null}
                  </div>
                );
              })}
          </dl>
        </section>
      ))}

      <p className="mt-12 text-sm leading-7 text-slate-600">
        ابدأ من{" "}
        <Link className="font-bold text-[#1d4ed8]" href={articlePath("farq-muattal-mahdhuf")}>
          الفرق بين الحساب المعطّل والمحذوف
        </Link>
        {" "}أو من{" "}
        <Link className="font-bold text-[#1d4ed8]" href="/faq">
          الأسئلة الشائعة
        </Link>
        ، وإن لم تعرف حالتك بعد فجرّب{" "}
        <Link className="font-bold text-[#1d4ed8]" href="/check">
          فحص حالة حساب انستقرام
        </Link>
        .
      </p>
    </article>
  );
}
