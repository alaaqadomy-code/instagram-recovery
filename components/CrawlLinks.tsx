import Link from "next/link";
import { crawlLinks } from "@/lib/crawl-links";
import { articlePath, getArticle } from "@/lib/articles";
import { gulfPages } from "@/lib/gulf-pages";
import { servicePages } from "@/lib/service-pages";

/**
 * كتلة روابط تحريرية داخل المحتوى للصفحات المفهرسة (درس 17 أكتوبر 2026: عزلة الزحف).
 * تربط المحاور (/articles و/services والخدمات وصفحات البلدان) ثم الأدلة الموزعة في lib/crawl-links.ts.
 */
export function CrawlLinks({ source, exclude }: { source: string; exclude?: string }) {
  const items = (crawlLinks[source] ?? [])
    .filter((slug) => slug !== exclude)
    .map((slug) => getArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const link = "font-semibold text-[#1d4ed8] underline-offset-4 hover:underline";

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6" aria-labelledby={`more-guides-${source}`}>
      <h2 id={`more-guides-${source}`} className="text-xl font-extrabold">
        أدلة أخرى تهمك
      </h2>
      <p className="mt-3 text-sm leading-8 text-slate-700">
        كل شروحاتنا مرتبة في{" "}
        <Link href="/articles" className={link}>مدونة استرجاع حساب انستقرام</Link>، وإن أردت من يتولى الحالة عنك فاطّلع على{" "}
        <Link href="/services" className={link}>خدمات استرجاع حساب انستقرام</Link> حسب نوع المشكلة:{" "}
        {servicePages.map((page, i) => (
          <span key={page.slug}>
            <Link href={`/services/${page.slug}`} className={link}>{page.h1}</Link>
            {i < servicePages.length - 1 ? "، " : ". "}
          </span>
        ))}
        ونخدم أصحاب الحسابات في كل بلد عربي:{" "}
        {gulfPages.map((page, i) => (
          <span key={page.slug}>
            <Link href={`/services/${page.slug}`} className={link}>{page.h1}</Link>
            {i < gulfPages.length - 1 ? "، " : ". "}
          </span>
        ))}
        وقبل أن تبدأ جرّب{" "}
        <Link href="/check" className={link}>فحص حالة حساب انستقرام</Link> واقرأ{" "}
        <Link href="/how-it-works" className={link}>كيف تعمل خدمة الاسترجاع</Link> و
        <Link href="/faq" className={link}>الأسئلة الشائعة عن استرجاع الحساب</Link>، وتعرّف على{" "}
        <Link href="/about" className={link}>فريق Unlock Accounts</Link> وعلى{" "}
        <Link href="/glossary" className={link}>قاموس مصطلحات انستقرام</Link>.
      </p>
      {items.length ? (
        <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {items.map((a) => (
            <li key={a.slug}>
              <Link href={articlePath(a.slug)} className={link}>
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
