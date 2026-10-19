import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { articlePath, getArticle } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { gulfPages } from "@/lib/gulf-pages";
import { getServiceExtras } from "@/lib/service-extras";
import { getServicePage, servicePages } from "@/lib/service-pages";
import { site, whatsappUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...servicePages, ...gulfPages].map((page) => ({ slug: page.slug }));
}

type Params = { params: Promise<{ slug: string }> };

async function resolve(params: Params["params"]) {
  const { slug } = await params;
  const key = decodeURIComponent(slug);
  return getServicePage(key) ?? gulfPages.find((p) => p.slug === key);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = await resolve(params);
  if (!page) return {};
  const url = `/services/${page.slug}`;
  return {
    title: { absolute: `${page.title} | ${site.name}` },
    description: page.description,
    keywords: [page.keyword, `${page.keyword} 2026`, `${page.keyword} السعودية`, "خدمة استرجاع حساب انستقرام"],
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.description, url, type: "website", locale: "ar_SA" },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const page = await resolve(params);
  if (!page) notFound();

  const url = absoluteUrl(`/services/${page.slug}`);
  const wa = `${whatsappUrl}?text=${encodeURIComponent(page.waMessage)}`;
  const related = page.related.map((slug) => getArticle(slug)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const others = [...servicePages, ...gulfPages].filter((p) => p.slug !== page.slug);
  const steps = page.sections.find((s) => s.steps)?.steps ?? [];
  const allSections = [...page.sections, ...getServiceExtras(page.slug)];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.h1,
        serviceType: page.keyword,
        description: page.description,
        url,
        provider: { "@id": `${absoluteUrl("/")}#organization` },
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "IQ"],
        availableChannel: { "@type": "ServiceChannel", serviceUrl: wa, availableLanguage: ["ar"] },
        offers: { "@type": "Offer", priceCurrency: "USD", price: "0", description: "فحص مجاني ثم سعر حسب الحالة يُحدد قبل أي دفع" },
      },
      {
        "@type": "HowTo",
        name: page.answer.heading,
        description: page.answer.text,
        step: steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, name: `الخطوة ${i + 1}`, text })),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "خدمات الاسترجاع", item: absoluteUrl("/services") },
          { "@type": "ListItem", position: 3, name: page.label, item: url },
        ],
      },
    ],
  };

  return (
    <div className="overflow-x-hidden bg-[#f4efe6] text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="مسار التنقل" className="mx-auto max-w-[1180px] px-5 pt-6 text-xs text-[#78716c] sm:px-8">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-[#9a3412]">الرئيسية</Link></li>
          <li aria-hidden="true">←</li>
          <li><Link href="/services" className="hover:text-[#9a3412]">خدمات الاسترجاع</Link></li>
          <li aria-hidden="true">←</li>
          <li className="font-bold text-[#1c1917]">{page.label}</li>
        </ol>
      </nav>

      <header className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-12 pt-6 sm:px-8 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-7">
          <p className="text-xs font-bold tracking-widest text-[#9a3412]">خدمة متخصصة · فحص مجاني · بلا كلمة مرور</p>
          <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.35] sm:text-5xl">{page.h1}</h1>
          <p className="mt-6 text-lg leading-8 text-[#44403c]">{page.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#075E54] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(7,94,84,0.3)] hover:bg-[#054c44]">
              <WhatsAppIcon className="h-5 w-5" />
              افحص حالة حسابك مجاناً
            </a>
            <Link href="/services" className="text-sm font-bold underline decoration-[#c4b49a] underline-offset-4">كل الخدمات</Link>
          </div>
          <p className="mt-5 text-sm text-[#78716c]">السعر حسب الحالة ويُحدد بعد الفحص وقبل أي دفع. لا نضمن قرار ميتا، ونرفض أي طلب يخص حساب غيرك.</p>
        </div>
        <aside className="rounded-sm bg-[#142033] p-6 text-[#f6f1e8] lg:col-span-5">
          <p className="text-sm font-bold text-[#fdba74]">هل هذه حالتك؟ الرسائل التي تدل عليها</p>
          <ul className="mt-5 space-y-3">
            {page.signals.map((s) => (
              <li key={s} className="flex gap-3 border-t border-white/10 pt-3 text-sm leading-7 first:border-t-0 first:pt-0">
                <span className="text-[#fdba74]">▸</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </aside>
      </header>

      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
          <p className="text-xs font-bold tracking-widest text-[#9a3412]">إجابة مباشرة</p>
          <h2 className="mt-2 text-2xl font-extrabold">{page.answer.heading}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">{page.answer.text}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        {allSections.map((section) => (
          <section key={section.heading} className="border-b border-[#e6dcc8] py-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 max-w-3xl leading-8 text-[#44403c]">{p}</p>
            ))}
            {section.bullets ? (
              <ul className="mt-6 grid max-w-3xl gap-3">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-3 rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-4 text-sm leading-7"><span className="text-[#9a3412]">▸</span><span>{b}</span></li>
                ))}
              </ul>
            ) : null}
            {section.steps ? (
              <ol className="mt-6 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
                {section.steps.map((s, i) => (
                  <li key={s} className="bg-[#fbf7f0] p-5">
                    <p className="text-2xl font-extrabold text-[#9a3412]">{i + 1}</p>
                    <p className="mt-2 text-sm leading-7 text-[#44403c]">{s}</p>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}

        <section className="border-b border-[#e6dcc8] py-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{page.table.caption}</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#142033] text-[#f6f1e8]">
                  {page.table.head.map((h) => <th key={h} className="p-4 text-right font-bold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((row, i) => (
                  <tr key={row[0]} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                    {row.map((cell, j) => <td key={j} className={`border-t border-[#e6dcc8] p-4 ${j === 0 ? "font-bold" : "text-[#44403c]"}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-8 border-b border-[#e6dcc8] py-12 lg:grid-cols-2">
          <div className="rounded-sm bg-[#142033] p-8 text-[#f6f1e8]">
            <h2 className="text-2xl font-extrabold">ابدأ الآن: أرسل لقطة الشاشة واسم المستخدم</h2>
            <p className="mt-3 text-sm leading-7 text-[#d6d3d1]">نرد بنوع الحالة والفرص المتوقعة والخطوة العاجلة. التقييم مجاني وبلا التزام، والسعر يُحدد بعده حسب الحالة.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-[#25D366] px-6 text-sm font-bold text-[#0b1220] hover:bg-[#1fb956]">
              <WhatsAppIcon className="h-5 w-5" />
              تواصل عبر واتساب
            </a>
            <p className="mt-4 text-xs text-[#a8a29e]">{site.whatsappDisplay} · الرد بالعربية</p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">ماذا لا نفعل؟</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#44403c]">
              <li>▸ لا نطلب كلمة المرور ولا رمز التحقق ولا بيانات بطاقة.</li>
              <li>▸ لا نخترق حسابات ولا ندّعي واسطة داخل ميتا.</li>
              <li>▸ لا نضمن قرار المنصة، ونقول صراحة إن كانت الفرص ضعيفة.</li>
              <li>▸ لا نقبل طلباً يخص حساب شخص آخر مهما كانت القصة.</li>
            </ul>
          </div>
        </section>

        <section className="border-b border-[#e6dcc8] py-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">أسئلة شائعة عن {page.keyword}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {page.faqs.map((f) => (
              <article key={f.q}>
                <h3 className="font-extrabold">{f.q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 py-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold">أدلة مفصلة لهذه الحالة</h2>
            <ul className="mt-4 divide-y divide-[#e6dcc8] border-y border-[#e6dcc8]">
              {related.map((a) => (
                <li key={a.slug} className="py-3">
                  <Link href={articlePath(a.slug)} className="font-bold leading-7 hover:text-[#9a3412]">{a.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-extrabold">خدمات أخرى</h2>
            <ul className="mt-4 divide-y divide-[#e6dcc8] border-y border-[#e6dcc8]">
              {others.map((p) => (
                <li key={p.slug} className="py-3">
                  <Link href={`/services/${p.slug}`} className="font-bold leading-7 hover:text-[#9a3412]">{p.h1}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
