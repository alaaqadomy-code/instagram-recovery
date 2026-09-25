import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppCta } from "@/components/Cta";
import { articles, getArticle } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return { title: "الدليل غير موجود", robots: { index: false, follow: true } };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      locale: site.locale,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updated,
      url: `${site.url}/articles/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 3);

  const pageUrl = absoluteUrl(`/articles/${article.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.updated,
        inLanguage: "ar",
        author: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
        publisher: {
          "@type": "Organization",
          name: site.name,
          logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
        },
        mainEntityOfPage: pageUrl,
        keywords: article.keywords.join(", "),
        image: absoluteUrl("/opengraph-image"),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "الأدلّة", item: absoluteUrl("/articles") },
          { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-sm font-bold text-[#1d4ed8]">
        <Link href="/articles">أدلّة الاسترجاع</Link> · {article.category}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">{article.title}</h1>
      <p className="mt-4 text-sm text-slate-500">
        نُشر {article.date} · تحديث {article.updated} · {article.readMinutes} دقائق
      </p>
      <p className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-7 text-slate-700">
        كلمات يبحث عنها الزوار: {article.keywords.join(" · ")}
      </p>
      <div className="mt-8 space-y-8">
        {article.sections.map((section) => (
          <section key={section.heading || section.paragraphs[0]}>
            {section.heading ? <h2 className="text-2xl font-bold">{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="mt-3 leading-8 text-slate-700">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">أسئلة شائعة حول هذا الدليل</h2>
        <div className="mt-4 space-y-3">
          {article.faqs.map((item) => (
            <details key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-bold">{item.q}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="mt-12 rounded-3xl bg-[#0b1220] p-6 text-white">
        <p className="text-lg font-bold">هل تواجه هذه الحالة الآن؟</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">أرسل لقطة الشاشة عبر واتساب. لا نطلب كلمة المرور.</p>
        <WhatsAppCta className="mt-4">افحص حالة حسابك</WhatsAppCta>
      </div>
      {related.length ? (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold">أدلّة قريبة</h2>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-[#1d4ed8]">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/articles/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
