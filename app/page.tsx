import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { WhatsAppCta } from "@/components/Cta";
import { CompletedClientsCounter } from "@/components/CompletedClientsCounter";
import { LatestTicker } from "@/components/LatestTicker";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { articlePath, articlePublicSlug, articles, getArticle } from "@/lib/articles";
import { cases, steps } from "@/lib/content";
import {
  failures,
  gulfPoints,
  homeAnswer,
  homeFaqs,
  methodsHome,
  needList,
  scamList,
  scenarios,
  timelineRows,
  whyUs,
} from "@/lib/home-content";
import { businessParas, comparisonRows, emotionalParas, extraFaqs, glossaryHome, screenMessages, timelineStory, urgencyRows } from "@/lib/home-content-extra";
import { evidenceRows, policy2026Paras, relapseMistakes, userTypes } from "@/lib/home-content-extra2";
import { absoluteUrl } from "@/lib/seo";
import { servicePages } from "@/lib/service-pages";
import { site, whatsappChatUrl } from "@/lib/site";

const TITLE = "استرجاع حساب انستقرام — معطّل، مبند، محذوف، مسروق أو مغلق | Unlock Accounts";
const DESC =
  "خدمة استرجاع حساب انستقرام المعطل والمبند والمحذوف والمسروق والمغلق عبر المسارات الرسمية. فحص مجاني من لقطة الشاشة عبر واتساب، بلا كلمة مرور، والسعر حسب الحالة. نخدم السعودية والخليج وكل الناطقين بالعربية.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  keywords: [
    "استرجاع حساب انستقرام",
    "استرجاع حساب انستقرام معطل",
    "استرجاع حساب انستقرام مسروق",
    "استرجاع حساب انستقرام محذوف",
    "فك باند انستقرام",
    "خدمة استرجاع حساب انستقرام",
    "استرجاع انستا",
  ],
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESC, url: "/", type: "website", locale: "ar_SA" },
};

const guideGroups = [
  {
    label: "قرار من المنصة",
    hint: "الرسالة تتحدث عن شروط أو مخالفة أو مهلة.",
    titles: ["حساب معطّل", "حساب مبنّد أو محظور", "حساب معلّق", "حساب مغلق أو مقفل", "مضى 180 يومًا", "الاستئناف والمراجعة"],
  },
  {
    label: "ملكية وسرقة",
    hint: "شخص آخر صار يصل، أو أنت حذفت ثم ندمت.",
    titles: ["حساب مخترق أو مسروق", "تغيّر البريد المرتبط", "حساب محذوف", "تعطيل مؤقت لم يُفتح", "إثبات الهوية بالسيلفي", "انتحال الشخصية"],
  },
  {
    label: "وسيلة الدخول",
    hint: "الحساب قائم، والعائق عندك: بريد، شريحة، أو تطبيق.",
    titles: ["نسيت كلمة السر", "بدون إيميل ولا رقم", "المصادقة الثنائية", "كود التحقق لا يصل", "حساب تجاري أو متجر", "حساب موثّق"],
  },
];

const readingSlugs = [
  "istirja-hisab-instagram-muattal",
  "ikhtiraq-hisab-alinstagram",
  "istirja-hisab-mahdhuf",
  "hisab-tijari-muattal",
  "istinaf-hisab-instagram",
];

const afterRecovery = [
  "كلمة سر جديدة قوية لا تُستخدم في أي موقع آخر، وتغيير كلمة سر البريد المرتبط أيضاً.",
  "المصادقة الثنائية عبر تطبيق مصادقة لا الرسائل النصية، مع حفظ الأكواد الاحتياطية في مكانين.",
  "إنهاء كل الجلسات النشطة من الأجهزة المجهولة ومراجعة التطبيقات المرتبطة.",
  "تحديث البريد والرقم إلى وسائل تملكها فعلاً وتستطيع فتحها بعد سنة.",
  "للحساب التجاري: تثبيته في مدير الأعمال، وإضافة مشرف ثانٍ موثوق، والنظر في Meta Verified.",
  "أسبوع هدوء بعد العودة: بلا متابعة جماعية ولا تطبيقات خارجية ولا تغييرات كبيرة في الملف.",
];

const hrefByTitle = Object.fromEntries(cases.map((item) => [item.title, item.href]));

function H2({ children }: { children: string }) {
  return <h2 className="text-2xl font-extrabold sm:text-3xl">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">{children}</p>;
}

export default function HomePage() {
  const reading = readingSlugs.map((slug) => getArticle(slug)).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const featured = reading[0];
  const rest = reading.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl("/")}#home-service`,
        name: "استرجاع حساب انستقرام",
        serviceType: "استرجاع حسابات انستقرام المعطلة والمبندة والمحذوفة والمسروقة والمغلقة",
        description: DESC,
        url: absoluteUrl("/"),
        provider: { "@id": `${absoluteUrl("/")}#organization` },
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "EG", "IQ"],
        availableChannel: { "@type": "ServiceChannel", serviceUrl: whatsappChatUrl, availableLanguage: ["ar"] },
        offers: { "@type": "Offer", priceCurrency: "USD", price: "0", description: "فحص مجاني ثم سعر حسب الحالة يُحدد قبل أي دفع" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "خدمات استرجاع حسابات انستقرام",
          itemListElement: servicePages.map((p) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: p.h1, url: absoluteUrl(`/services/${p.slug}`) },
          })),
        },
      },
      {
        "@type": "HowTo",
        name: homeAnswer.heading,
        description: homeAnswer.text,
        step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [...homeFaqs, ...extraFaqs].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="overflow-x-hidden bg-[#f4efe6] text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LatestTicker articles={articles} />

      {/* Hero */}
      <section className="border-b border-[#e6dcc8]">
        <div className="mx-auto grid max-w-[1180px] lg:grid-cols-12">
          <div className="px-5 py-12 sm:px-8 lg:col-span-7 lg:py-20">
            <p className="text-xs font-bold tracking-widest text-[#9a3412]">خدمة استرجاع حسابات انستقرام · فحص مجاني · بلا كلمة مرور</p>
            <h1 className="mt-4 max-w-2xl text-[2rem] font-extrabold leading-[1.35] sm:text-5xl">
              استرجاع حساب انستقرام معطّل أو مبنّد أو محذوف أو مسروق أو مغلق
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#44403c]">
              أرسل لقطة الرسالة التي ظهرت لك واسم المستخدم. نحدد نوع الحالة وفرصها مجاناً، نختار مسار ميتا الرسمي الصحيح،
              نكتب طلب المراجعة باحتراف، ونتابع حتى يعود الحساب. السعر حسب الحالة ويُحدد قبل أي دفع.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <WhatsAppCta icon>افحص حالة حسابك مجاناً</WhatsAppCta>
              <Link href="/services" className="text-sm font-bold underline decoration-[#c4b49a] underline-offset-4">
                خدماتنا الست
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#57534e]">
              <li>✓ لا نطلب كلمة المرور ولا رمز التحقق</li>
              <li>✓ مسارات ميتا الرسمية فقط</li>
              <li>✓ رد بالعربية عبر واتساب</li>
              <li>✓ نقول الحقيقة إن كانت الفرص ضعيفة</li>
            </ul>
          </div>

          <aside className="bg-[#142033] px-6 py-10 text-[#f6f1e8] sm:px-8 lg:col-span-5 lg:py-16">
            <p className="text-sm font-bold text-[#fdba74]">اختر حالتك</p>
            <ul className="mt-6 divide-y divide-white/10">
              {servicePages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}`} className="group flex items-center justify-between py-4">
                    <span>
                      <span className="block font-bold group-hover:text-[#fdba74]">{p.label}</span>
                      <span className="mt-1 block text-xs text-[#d6d3d1]">{p.signals[0]}</span>
                    </span>
                    <span className="text-[#fdba74]">←</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Direct answer */}
      <section className="border-b border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
          <p className="text-xs font-bold tracking-widest text-[#9a3412]">إجابة مباشرة</p>
          <h2 className="mt-2 text-2xl font-extrabold">{homeAnswer.heading}</h2>
          <P>{homeAnswer.text}</P>
        </div>
      </section>

      {/* What is the service */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>ما المقصود بخدمة استرجاع حساب انستقرام؟</H2>
        <P>
          حين يتوقف حسابك في انستقرام فجأة، تكون أمام واحدة من حالات محددة لدى ميتا، ولكل حالة بوابة رسمية مختلفة: زر اعتراض
          للتعطيل، نموذج «حسابي اختُرق» للسرقة، نافذة 30 يوماً للحذف، ومسار إثبات الهوية للقفل ومشاكل كود التحقق. المشكلة أن
          الرسائل تتشابه، والبوابات كثيرة، وكل محاولة خاطئة تُسجَّل في ملفك وتُضعف الفرص. خدمة الاسترجاع عندنا هي خبرة بهذه
          البوابات: نقرأ الجملة التي على شاشتك، نعرف أي باب تفتحه وأي باب تتجنبه، ونكتب ما يُقنع من يقف خلفه.
        </P>
        <P>
          نحن مكتب عربي مستقل غير تابع لميتا أو انستقرام. لا نملك واسطة داخل المنصة، ولا نخترق، ولا نشتري حسابات، ولا نقبل طلباً
          يخص حساب شخص آخر. ما نملكه هو مئات الحالات التي مررنا بها، ومعرفة بالفرق الدقيق بين «حساب معطل» و«حساب مقيد»
          و«حساب مقفل»، وبين رسالة يمكن التراجع عنها خلال ساعات وأخرى تحتاج ملف مراجعة كاملاً. والقرار النهائي يبقى عند
          انستقرام، ولهذا نرفض كلمة «ضمان» ونستبدلها بتقدير صريح للفرص قبل أن تدفع ريالاً واحداً.
        </P>
        <P>
          الفارق الذي يلاحظه عملاؤنا: المحاولة الفردية تمضي أسابيع بين نماذج متضاربة ورسائل غاضبة وتكرار بلا رد، بينما الملف
          المرتب يصل إلى المراجع الصحيح بصيغة يقرؤها ويفهمها خلال دقيقة. هذه الدقيقة هي ما نعمل من أجله.
        </P>
      </section>

      {/* Six services */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>خدمات استرجاع حسابات انستقرام: ست حالات، ستة مسارات</H2>
          <P>اضغط على حالتك لتقرأ تفاصيلها كاملة: الرسائل التي تدل عليها، خطوات العمل، المدة والفرص، والأسئلة الشائعة.</P>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {servicePages.map((p) => (
              <article key={p.slug} className="flex flex-col rounded-sm border border-[#e6dcc8] bg-white p-6">
                <p className="text-xs font-bold text-[#9a3412]">{p.label}</p>
                <h3 className="mt-2 text-lg font-extrabold leading-8">
                  <Link href={`/services/${p.slug}`} className="hover:text-[#9a3412]">
                    {p.h1}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#57534e]">{p.intro.slice(0, 220)}…</p>
                <Link href={`/services/${p.slug}`} className="mt-4 text-sm font-bold text-[#9a3412] underline underline-offset-4">
                  تفاصيل الخدمة ←
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>كيف نسترجع حسابك؟ خمس خطوات واضحة</H2>
        <P>
          المسار نفسه لكل حالة، ويختلف محتواه حسب نوعها. نوقف السلسلة في الخطوة الأولى إذا ظهر أن الفرص ضعيفة، ونخبرك بذلك
          بدل المضي في ملف لن ينجح.
        </P>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-[#fbf7f0] p-6">
              <p className="text-3xl font-extrabold text-[#9a3412]">0{i + 1}</p>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{s.text}</p>
            </li>
          ))}
        </ol>
        <P>
          في الخطوة الأولى نفتح رابط حسابك من متصفح دون تسجيل دخول ونقارن ما يراه الناس بما تراه أنت، لأن «المستخدم غير
          موجود» تظهر للمعطل والمحذوف والمقفل على حد سواء، والرسالة التي تظهر لك عند الدخول هي الفيصل. في الثانية نجمع ما
          يثبت الملكية دون أي سر: اليوزر، تاريخ الإنشاء التقريبي، البريد أو الرقم القديم، الأجهزة المعتادة، وفواتير الإعلانات
          إن وُجدت. في الثالثة نختار البوابة الرسمية الواحدة الصحيحة بدل إغراق ميتا بنماذج متضاربة. في الرابعة نكتب الطلب
          بلغة يفضلها المراجع: قصيرة، محددة، تثبت ولا تشتكي. وفي الخامسة نرتب تأمين الحساب حتى لا نعود للنقطة نفسها بعد شهر.
        </P>
      </section>

      {/* Why us */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>لماذا تختار Unlock Accounts لاسترجاع حسابك؟</H2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w) => (
              <article key={w.title}>
                <h3 className="border-b-2 border-[#1c1917] pb-2 text-lg font-extrabold">{w.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#57534e]">{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What we need + timeline */}
      <section className="mx-auto grid max-w-[1180px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <div className="min-w-0">
          <H2>ما الذي نحتاجه منك للبدء؟</H2>
          <P>أربعة أسطر في أول رسالة واتساب تكفي لمعرفة نوع الحالة. التفاصيل الزائدة نطلبها لاحقاً إذا احتاجها النموذج.</P>
          <dl className="mt-8 space-y-5">
            {needList.map((n, i) => (
              <div key={n.k} className="grid grid-cols-[auto_1fr] gap-4">
                <dt className="font-bold text-[#9a3412]">0{i + 1}</dt>
                <dd>
                  <p className="font-bold">{n.k}</p>
                  <p className="mt-1 text-sm leading-7 text-[#57534e]">{n.v}</p>
                </dd>
              </div>
            ))}
          </dl>
          <WhatsAppCta className="mt-8" icon>
            أرسل اللقطة واليوزر الآن
          </WhatsAppCta>
        </div>
        <div className="min-w-0">
          <H2>المدة والفرص المتوقعة لكل حالة</H2>
          <P>أرقام من واقع الحالات، لا وعود. المدة تعتمد على دورة مراجعة ميتا وعلى سرعة تحركك بعد المشكلة.</P>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#142033] text-[#f6f1e8]">
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-right">الفرص</th>
                  <th className="p-3 text-right">المدة</th>
                </tr>
              </thead>
              <tbody>
                {timelineRows.map((r, i) => (
                  <tr key={r[0]} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                    <td className="border-t border-[#e6dcc8] p-3 font-bold">{r[0]}</td>
                    <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[1]}</td>
                    <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>كيف تسير حالة نموذجية؟ ثلاثة أمثلة من واقع العمل</H2>
          <P>
            الأسماء والتفاصيل المميزة محذوفة حفاظاً على سرية العملاء. كل مثال يوضح نوع الحالة، والمسار الذي سلكناه، والنتيجة
            النموذجية لهذا النوع.
          </P>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {scenarios.map((s) => (
              <article key={s.title} className="rounded-sm border border-[#e6dcc8] bg-white p-6">
                <h3 className="text-lg font-extrabold leading-8">{s.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#57534e]">{s.text}</p>
              </article>
            ))}
          </div>
          <CompletedClientsCounter />
        </div>
      </section>


      {/* Screen messages guide */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>دليل الرسائل: ماذا تعني الجملة التي على شاشتك وما الخطوة الصحيحة؟</H2>
        <P>
          كل استرجاع يبدأ من هنا. هذه أكثر 12 رسالة نراها في لقطات الشاشة التي تصلنا، ومعنى كل واحدة، والخطوة الأولى الصحيحة
          لها، والخدمة التي تتولاها. إن لم تجد رسالتك فأرسلها لنا وسنحددها مجاناً.
        </P>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#142033] text-[#f6f1e8]">
                <th className="p-3 text-right">الرسالة</th>
                <th className="p-3 text-right">معناها</th>
                <th className="p-3 text-right">الخطوة الصحيحة</th>
                <th className="p-3 text-right">الخدمة</th>
              </tr>
            </thead>
            <tbody>
              {screenMessages.map((m, i) => {
                const svc = servicePages.find((p) => p.slug === m.service);
                return (
                  <tr key={m.msg} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                    <td className="border-t border-[#e6dcc8] p-3 font-bold">«{m.msg}»</td>
                    <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{m.meaning}</td>
                    <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{m.step}</td>
                    <td className="border-t border-[#e6dcc8] p-3">
                      {svc ? (
                        <Link href={`/services/${svc.slug}`} className="font-bold text-[#9a3412] underline underline-offset-4">
                          {svc.label}
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Urgency */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2">
          <div className="min-w-0">
            <H2>لماذا الآن؟ المهل الزمنية التي لا تنتظر</H2>
            <P>
              انستقرام تعمل بمهل صارمة، وأكثر الحسابات التي تضيع نهائياً لم تضع بسبب قرار ميتا بل بسبب انتظار صاحبها. هذه
              المهل الحقيقية لكل إجراء، وهي السبب في أن أول رسالة لنا تكون دائماً عن «كم بقي من الوقت».
            </P>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {urgencyRows.map((r, i) => (
                    <tr key={r[0]} className={i % 2 ? "bg-white" : "bg-[#f4efe6]"}>
                      <td className="border-t border-[#e6dcc8] p-3 font-bold">{r[0]}</td>
                      <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="min-w-0">
            <H2>المحاولة الذاتية مقابل الخدمة: مقارنة صريحة</H2>
            <P>لسنا ضد المحاولة بنفسك؛ أدلتنا المجانية كُتبت لذلك. لكن هذا ما يحدث عادة في الطريقين:</P>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#142033] text-[#f6f1e8]">
                    <th className="p-3 text-right">الجانب</th>
                    <th className="p-3 text-right">المحاولة الذاتية</th>
                    <th className="p-3 text-right">مع Unlock Accounts</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((r, i) => (
                    <tr key={r[0]} className={i % 2 ? "bg-white" : "bg-[#f4efe6]"}>
                      <td className="border-t border-[#e6dcc8] p-3 font-bold">{r[0]}</td>
                      <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[1]}</td>
                      <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline story */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>خط زمني: ماذا يحدث من أول رسالة واتساب حتى عودة الحساب؟</H2>
        <P>حتى لا تكون الخدمة صندوقاً أسود، هذا ما يجري بالضبط في كل مرحلة، وما نتوقعه منك فيها:</P>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timelineStory.map((t, i) => (
            <li key={t.when} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-5">
              <p className="text-xs font-bold text-[#9a3412]">0{i + 1} · {t.when}</p>
              <p className="mt-2 text-sm leading-7 text-[#44403c]">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Business accounts */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>استرجاع حسابات انستقرام التجارية والمتاجر والمؤثرين</H2>
          {businessParas.map((p) => (
            <P key={p.slice(0, 30)}>{p}</P>
          ))}
        </div>
      </section>

      {/* Emotional / reassurance */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>كلمة لمن فقد حسابه اليوم</H2>
        {emotionalParas.map((p) => (
          <P key={p.slice(0, 30)}>{p}</P>
        ))}
        <WhatsAppCta className="mt-8" icon>
          أرسل لقطة الشاشة الآن
        </WhatsAppCta>
      </section>

      {/* Glossary */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>مصطلحات تحتاج فهمها قبل أي خطوة</H2>
          <dl className="mt-8 grid gap-6 md:grid-cols-2">
            {glossaryHome.map((g) => (
              <div key={g.term}>
                <dt className="font-extrabold">{g.term}</dt>
                <dd className="mt-1 text-sm leading-7 text-[#57534e]">{g.def}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm">
            <Link href="/glossary" className="font-bold text-[#9a3412] underline underline-offset-4">
              قاموس المصطلحات الكامل
            </Link>
          </p>
        </div>
      </section>

      {/* Why individual attempts fail */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>لماذا تفشل أغلب المحاولات الفردية لاسترجاع الحساب؟</H2>
        <P>
          ليس لأن ميتا لا ترد، بل لأن الملف يصلها بشكل لا يمكن قبوله. هذه الأخطاء الستة نراها في أغلب الحالات التي تصلنا بعد
          أسابيع من المحاولة الذاتية، وبعضها يترك أثراً يصعب إصلاحه:
        </P>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {failures.map((f) => (
            <article key={f.title}>
              <h3 className="font-extrabold">{f.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Methods */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>طرق استرجاع حساب انستقرام: أيها يناسب حالتك؟</H2>
          <P>
            الناس يبحثون عن «استرجاع حساب انستقرام عن طريق اسم المستخدم» أو «من قوقل» أو «عن طريق الدعم الفني». كل طريقة
            صحيحة في حالة وخاطئة في أخرى، وهذا ملخص صريح لكل واحدة:
          </P>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {methodsHome.map((m) => (
              <article key={m.title} className="rounded-sm border border-[#e6dcc8] bg-white p-5">
                <h3 className="font-extrabold">{m.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">{m.text}</p>
              </article>
            ))}
          </div>
          <P>
            ملاحظة مهمة: انستقرام لا يسجّل الدخول بحساب قوقل. ما يقصده الباحثون بـ«الاسترجاع من قوقل» هو بريد Gmail المرتبط
            أو كلمة سر محفوظة في متصفح Chrome، وهذا أول ما نفحصه قبل أي نموذج. والدليل الكامل لكل طريقة تجده في المدونة.
          </P>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto grid max-w-[1180px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <div className="min-w-0">
          <H2>السعر: حسب الحالة، ويُحدد قبل أي دفع</H2>
          <P>
            لا نعلن سعراً موحداً لأنه سيكون كذبة: حساب محذوف خلال المهلة قد يعود بخطوتين مجانيتين، بينما حساب مسروق غُيّرت كل
            بياناته يحتاج ملف إثبات هوية ومتابعة لأسابيع. ما نلتزم به: فحص مجاني لرسالتك، ثم سعر ثابت ومدة متوقعة تُذكر لك
            قبل أي التزام، ولا رسوم مفاجئة في منتصف الطريق.
          </P>
          <P>
            وإن اتضح أن حالتك تُحل بتوجيه بسيط داخل التطبيق فسنكتبه لك في الرسالة نفسها دون مقابل، لأن العميل الذي نرشده
            مجاناً اليوم يعود إلينا غداً حين يحتاج خدمة حقيقية.
          </P>
        </div>
        <div className="rounded-sm bg-[#142033] p-8 text-[#f6f1e8]">
          <h2 className="text-2xl font-extrabold">ابدأ بالفحص المجاني</h2>
          <p className="mt-3 text-sm leading-7 text-[#d6d3d1]">
            لقطة الشاشة واسم المستخدم. نرد بنوع الحالة والفرص والخطوة العاجلة، ثم تقرر أنت.
          </p>
          <a
            href={whatsappChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-[#25D366] px-6 text-sm font-bold text-[#0b1220] hover:bg-[#1fb956]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            تواصل عبر واتساب
          </a>
          <p className="mt-4 text-xs text-[#a8a29e]">{site.whatsappDisplay} · الرد بالعربية</p>
        </div>
      </section>

      {/* Gulf */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>استرجاع حسابات انستقرام في السعودية والإمارات والخليج</H2>
          <P>
            نخدم أصحاب الحسابات في السعودية والإمارات والكويت وقطر والبحرين وعُمان والأردن، وكل من يتواصل بالعربية. الحساب
            التجاري في الخليج ليس صفحة اجتماعية بل مصدر رزق: متجر على سلة أو زد يبيع من انستقرام، عيادة تستقبل الحجوزات
            منه، صانع محتوى تعاقداته مرتبطة به. ولهذا تُعامل هذه الحالات بأولوية وبسرية كاملة.
          </P>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {gulfPoints.map((g) => (
              <li key={g} className="flex gap-3 rounded-sm border border-[#e6dcc8] bg-white p-4 text-sm leading-7">
                <span className="text-[#9a3412]">▸</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <P>
            التواصل كله عبر واتساب بالعربية وبتوقيت الخليج، ويمكن إتمام الحالة دون أي مكالمة إن فضّلت الكتابة. وللحسابات
            الموثقة بـ Meta Verified ولحسابات مدير الأعمال اعتبارات خاصة في الملف نشرحها عند الفحص.
          </P>
        </div>
      </section>

      {/* Scams */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>قبل أن تدفع لأي جهة: ست علامات للنصب في سوق استرجاع الحسابات</H2>
        <P>
          كل حساب معطل أو مسروق يجذب عشرات العروض في التعليقات وتيك توك ويوتيوب. أغلبها يأخذ المال ويختفي، وأخطرها يستولي
          على ما تبقى من حسابك. هذا ما يميز الخدمة الحقيقية عن الاحتيال:
        </P>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#142033] text-[#f6f1e8]">
                <th className="p-3 text-right">ما يقولونه</th>
                <th className="p-3 text-right">الحقيقة</th>
              </tr>
            </thead>
            <tbody>
              {scamList.map((s, i) => (
                <tr key={s.sign} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                  <td className="border-t border-[#e6dcc8] p-3 font-bold">{s.sign}</td>
                  <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{s.truth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          مركز المساعدة داخل instagram.com هو المرجع الوحيد. أي رابط يطلب كلمة السر خارج هذا النطاق يُترك مغلقاً، وانستقرام
          لا تتصل بأحد ولا ترسل رسائل واتساب لطلب رمز.
        </P>
      </section>

      {/* After recovery */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>ماذا بعد عودة الحساب؟ خطة التأمين التي نرتبها معك</H2>
          <P>
            الحساب العائد من تعطيل أو سرقة يكون تحت مراقبة أدق من غيره، والسارق يعود إن بقي الباب مفتوحاً. لذلك الاسترجاع
            عندنا لا ينتهي عند أول دخول ناجح، بل عند تأمين الحساب:
          </P>
          <ol className="mt-8 grid gap-3 md:grid-cols-2">
            {afterRecovery.map((t, i) => (
              <li key={t} className="flex gap-3 rounded-sm border border-[#e6dcc8] bg-white p-4 text-sm leading-7">
                <span className="font-extrabold text-[#9a3412]">{i + 1}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>


      {/* Evidence guide */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>دليل الأدلة: ما يقبله مراجع ميتا كإثبات ملكية وما لا يقبله</H2>
        <P>
          نصف قوة الطلب في الإثبات المرفق. هذا ما تعلمناه من مئات الملفات عن كل نوع من الأدلة: متى يُقبل، ومتى يضر، ومتى
          يكون طلبه علامة احتيال.
        </P>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#142033] text-[#f6f1e8]">
                <th className="p-3 text-right">الدليل</th>
                <th className="p-3 text-right">هل يُقبل؟</th>
                <th className="p-3 text-right">لماذا</th>
              </tr>
            </thead>
            <tbody>
              {evidenceRows.map((r, i) => (
                <tr key={r[0]} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                  <td className="border-t border-[#e6dcc8] p-3 font-bold">{r[0]}</td>
                  <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[1]}</td>
                  <td className="border-t border-[#e6dcc8] p-3 text-[#44403c]">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* User types */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>استرجاع حساب انستقرام حسب نوع المستخدم</H2>
          <P>لكل فئة أولويات مختلفة في الاسترجاع وفي التأمين بعده. هكذا نتعامل مع كل واحدة:</P>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {userTypes.map((u) => (
              <article key={u.title} className="rounded-sm border border-[#e6dcc8] bg-white p-6">
                <h3 className="text-lg font-extrabold">{u.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">{u.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Relapse mistakes */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>ثمانية أخطاء بعد الاسترجاع تعيد الحساب إلى الحظر</H2>
        <P>
          الحساب العائد يبقى تحت مراقبة مشددة لأسابيع. هذه الأخطاء رأيناها تُرجع حسابات استُرجعت بجهد كبير إلى نقطة
          الصفر خلال أيام، وبعضها يجعل الحظر الثاني نهائياً:
        </P>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {relapseMistakes.map((m, i) => (
            <li key={m} className="flex gap-3 rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-4 text-sm leading-7">
              <span className="font-extrabold text-[#9a3412]">{i + 1}.</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Policy 2026 */}
      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>ما الذي تغيّر في سياسات انستقرام 2026 ويؤثر على الاسترجاع؟</H2>
          {policy2026Paras.map((p) => (
            <P key={p.slice(0, 30)}>{p}</P>
          ))}
        </div>
      </section>

      {/* Guides index */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <H2>أدلة مفصلة لكل ما قد تراه على الشاشة</H2>
        <P>
          إلى جانب الخدمة، كتبنا أكثر من مئتي دليل عربي يشرح كل رسالة وكل حالة خطوة بخطوة، لمن يفضل المحاولة بنفسه أولاً.
          اختر المجموعة الأقرب للشاشة التي أمامك.
        </P>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {guideGroups.map((group) => (
            <div key={group.label}>
              <h3 className="border-b-2 border-[#1c1917] pb-2 text-lg font-extrabold">{group.label}</h3>
              <p className="mt-3 text-sm leading-7 text-[#78716c]">{group.hint}</p>
              <ul className="mt-4 space-y-1">
                {group.titles.map((title) => {
                  const href = hrefByTitle[title];
                  if (!href) return null;
                  return (
                    <li key={title}>
                      <Link href={href} className="block py-1.5 text-sm font-semibold hover:text-[#9a3412]">
                        {title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {featured ? (
          <div className="mt-12 grid gap-8 border-t border-[#e6dcc8] pt-8 lg:grid-cols-[1.3fr_0.7fr]">
            <article>
              <p className="text-xs font-bold text-[#9a3412]">{featured.category}</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-10">
                <Link href={`/articles/${articlePublicSlug(featured)}`} className="hover:text-[#9a3412]">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-xl leading-8 text-[#57534e]">{featured.description}</p>
            </article>
            <ul className="divide-y divide-[#e6dcc8] border-y border-[#e6dcc8] lg:border-y-0 lg:border-s lg:ps-8">
              {rest.map((a) => (
                <li key={a.slug} className="py-3">
                  <p className="text-xs font-bold text-[#a8a29e]">{a.category}</p>
                  <Link href={articlePath(a.slug)} className="mt-1 block font-bold leading-7 hover:text-[#9a3412]">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-6 text-sm">
          <Link href="/articles" className="font-bold text-[#9a3412] underline underline-offset-4">
            كل الأدلة ({articles.length})
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <H2>أسئلة شائعة عن استرجاع حساب انستقرام</H2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {[...homeFaqs, ...extraFaqs].map((f) => (
              <article key={f.q}>
                <h3 className="font-extrabold">{f.q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">{f.a}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm">
            <Link href="/faq" className="font-bold text-[#9a3412] underline underline-offset-4">
              بقية الأسئلة
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#e6dcc8]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-extrabold">اللقطة واليوزر يكفيان للبداية</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[#57534e]">
              نرد بنوع الحالة وما يمكن فعله الآن. إن كان المسار خطوتين داخل التطبيق سنكتبها لك مجاناً.
            </p>
          </div>
          <WhatsAppCta icon>افحص حالة حسابك مجاناً</WhatsAppCta>
        </div>
      </section>
    </div>
  );
}
