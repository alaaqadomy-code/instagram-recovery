import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { GhostCta, WhatsAppCta } from "@/components/Cta";
import { articles } from "@/lib/articles";
import { cases, failReasons, faqs, methods, needItems, scamSigns, services, steps, whyCards } from "@/lib/content";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "استرجاع حساب إنستغرام المعطّل | استرجاع انستا" },
  description:
    "خدمة عربية مستقلة لاسترجاع حساب إنستغرام المعطّل أو المخترق أو المحذوف. فحص مجاني عبر واتساب، ومساعدة على استخدام نماذج ميتا وإنستغرام الرسمية دون طلب كلمة المرور. لسنا تابعين لميتا.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "استرجاع حساب إنستغرام المعطّل | استرجاع انستا",
    url: "/",
    type: "website",
  },
};

const stats = [
  { value: "6", label: "أنواع حالات نتعامل معها" },
  { value: "رسمي", label: "كل المسارات عبر نماذج ميتا" },
  { value: "مجانًا", label: "فحص حالة الحساب قبل الالتزام" },
  { value: "24/7", label: "استقبال الحالات عبر واتساب" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-grid">
        <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-[0_4px_16px_rgba(30,58,138,0.07)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1d4ed8]" />
              خدمة استرجاع حساب انستقرام
            </p>
            <h1 className="mt-5 max-w-3xl text-[1.9rem] font-extrabold leading-[1.35] text-slate-950 sm:text-5xl">
              استرجاع حساب انستقرام — معطّل، مخترق، مبند أو فقدت الوصول إليه؟
            </h1>
            <p className="mt-5 text-[clamp(1.4rem,3.4vw,2rem)] font-extrabold leading-[1.5] text-[#1d4ed8]">
              أنت في المكان الصحيح لاسترجاعه.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              نحدّد سبب المشكلة، نختار نموذج الاسترداد المناسب لدى ميتا وإنستغرام، ونساعدك على تقديم الطلب بشكل مرتّب بدل
              المحاولات العشوائية. من فحص الحالة حتى متابعة رد المنصة — بلا كلمة مرور. نحن خدمة مساعدة مستقلة وغير تابعين
              لميتا.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <WhatsAppCta>ابدأ استرجاع حسابك الآن</WhatsAppCta>
              <GhostCta href="/services">تعرّف على خدماتنا</GhostCta>
            </div>
            <div className="mt-7 hidden flex-wrap gap-5 text-sm font-semibold text-slate-500 sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="font-extrabold text-[#2563eb]">✓</span>
                مسارات رسمية فقط
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="font-extrabold text-[#2563eb]">✓</span>
                فحص الحالة قبل أي التزام
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="font-extrabold text-[#2563eb]">✓</span>
                سرّية تامة
              </span>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_16px_42px_rgba(30,58,138,0.12)] sm:p-7">
            <h2 className="text-xl font-extrabold text-slate-950">احكِ لنا ما حدث لحسابك</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              أرسل اسم المستخدم ولقطة شاشة للرسالة الظاهرة. نحدّد نوع الحالة وفرص الاسترجاع قبل أن تدفع أي مبلغ.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm leading-6 text-slate-700">
              <li className="flex gap-2">
                <span className="font-extrabold text-[#2563eb]">✓</span>
                تحديد نوع الحالة بدقّة (تعطيل / باند / اختراق / حذف)
              </li>
              <li className="flex gap-2">
                <span className="font-extrabold text-[#2563eb]">✓</span>
                رأي صريح في فرص الاسترجاع دون مبالغة
              </li>
              <li className="flex gap-2">
                <span className="font-extrabold text-[#2563eb]">✓</span>
                خطوات واضحة وتقدير قبل البدء
              </li>
            </ul>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1d4ed8] font-bold text-white shadow-[0_8px_20px_rgba(29,78,216,0.28)] hover:bg-[#1e3a8a]"
            >
              تواصل عبر واتساب
            </a>
            <p className="mt-3 text-center text-xs text-slate-500">لا نطلب كلمة السر ولا رمز التحقق</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.value} className="rounded-2xl border border-slate-200/80 bg-white px-5 py-5 text-center">
              <p className="text-2xl font-extrabold text-[#1d4ed8]">{item.value}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">لماذا تختار {site.name}؟</h2>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600">
          الفرق بين عودة الحساب وضياعه غالبًا هو الطلب الأول. المسار الخاطئ يستهلك الوقت والفرصة معًا.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {whyCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-slate-200/80 bg-white p-6">
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">ما المقصود بخدمة استرجاع الحساب؟</h2>
          <div className="mt-5 max-w-4xl space-y-4 text-base leading-8 text-slate-600">
            <p>
              الاسترجاع هو مجموعة إجراءات رسمية تعيد لك الوصول بعد تعطيل أو حظر أو تعليق أو اختراق أو حذف أو فقدان وسائل
              التحقق. الناس يبحثون بصيغ مختلفة — استعادة، استرداد، إرجاع، فتح حساب — والمقصود واحد: أن تعود إلى حسابك.
            </p>
            <p>
              إنستغرام لا يعالج كل حالة بنفس النموذج. المعطّل بقرار المنصة يحتاج مراجعة، والمخترق يحتاج مسار السرقة،
              والمحذوف بيدك تحكمه نافذة زمنية. دورنا قراءة الحالة ووضعك على الطريق الصحيح من أول محاولة، بلا ادّعاء واسطة
              داخل الشركة.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">خدمات الاسترجاع والاسترداد</h2>
            <p className="mt-3 text-slate-600">من التعطيل البسيط إلى الاختراق وحسابات الأعمال.</p>
          </div>
          <Link href="/services" className="hidden text-sm font-bold text-[#1d4ed8] sm:inline">
            كل الخدمات
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="rounded-2xl border border-slate-200/80 bg-white p-6">
              <h3 className="text-lg font-bold">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.text}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                {service.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">ما نوع المشكلة التي تواجه حسابك؟</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">
            حدّد حالتك وافتح دليلها. لكل حالة مسار مختلف، والمسار الخاطئ يضيع الوقت.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cases.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
              >
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                <p className="mt-3 text-sm font-bold text-[#1d4ed8]">افتح الدليل</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">كيف نسترجع الحساب؟ خمس خطوات</h2>
        <p className="mt-3 text-slate-600">ترتيب واضح بدل التجريب على حسابك.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <p className="text-sm font-extrabold text-[#1d4ed8]">0{index + 1}</p>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">طرق الاسترجاع: أيّها يناسبك؟</h2>
          <p className="mt-3 max-w-3xl leading-8 text-slate-600">
            لا توجد طريقة واحدة للجميع. المسار يتحدد بما تملكه فعلًا من وسائل وصول.
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {methods.map((method) => (
              <article key={method.title} className="rounded-2xl border border-slate-200/80 bg-white p-6">
                <h3 className="text-lg font-bold">{method.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{method.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">جدول سريع حسب الحالة</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-bold">الحالة</th>
                <th className="px-4 py-3 font-bold">ما تراه غالبًا</th>
                <th className="px-4 py-3 font-bold">المسار المناسب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-semibold">معطّل من المنصة</td>
                <td className="px-4 py-3 text-slate-600">رسالة انتهاك الشروط</td>
                <td className="px-4 py-3 text-slate-600">طلب مراجعة القرار</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">مبنّد / محظور</td>
                <td className="px-4 py-3 text-slate-600">منع دخول مع إشعار مخالفة</td>
                <td className="px-4 py-3 text-slate-600">اعتراض رسمي على الحظر</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">مخترق</td>
                <td className="px-4 py-3 text-slate-600">تغيّر البريد وكلمة السر</td>
                <td className="px-4 py-3 text-slate-600">مسار الحسابات المخترقة</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">محذوف بطلبك</td>
                <td className="px-4 py-3 text-slate-600">المستخدم غير موجود</td>
                <td className="px-4 py-3 text-slate-600">دخول ضمن مهلة ما قبل الحذف</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">لماذا تفشل المحاولات الفردية؟</h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {failReasons.map((item) => (
                <li key={item} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">ما الذي نحتاجه للبدء؟</h2>
            <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              {needItems.map((item, index) => (
                <li key={item} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  <strong className="text-[#1d4ed8]">{index + 1}.</strong> {item}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              لا نطلب في هذه المرحلة كلمة سر ولا بيانات بنكية. لا ترسل رمز التحقق لأي شخص.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">علامات النصب في سوق الاسترجاع</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {scamSigns.map((item) => (
            <p key={item} className="rounded-2xl border border-rose-100 bg-white p-5 text-sm leading-7 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold sm:text-3xl">أدلّة حسب كلمات البحث</h2>
            <Link href="/articles" className="text-sm font-bold text-[#1d4ed8]">
              كل الأدلّة
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold">أسئلة قبل البدء</h2>
        <div className="mt-6 space-y-3">
          {faqs.slice(0, 6).map((item) => (
            <details key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-bold">{item.q}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
        <Link href="/faq" className="mt-6 inline-block text-sm font-bold text-[#1d4ed8]">
          كل الأسئلة الشائعة
        </Link>
      </section>

      <section className="border-t border-slate-200 bg-[#0b1220] text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">الحساب ما زال قابلًا للفحص — ابدأ الآن</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
            أرسل اليوزر ولقطة الشاشة. نرد بتشخيص ونسبة تقديرية وخطوات واضحة. إن كانت الحالة تحلّ بخطوتين بنفسك سنقول ذلك.
          </p>
          <WhatsAppCta className="mt-8">تواصل عبر واتساب</WhatsAppCta>
        </div>
      </section>
    </>
  );
}
