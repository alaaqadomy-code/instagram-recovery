import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { CompletedClientsCounter } from "@/components/CompletedClientsCounter";
import { LatestTicker } from "@/components/LatestTicker";
import { articles, getArticle } from "@/lib/articles";
import { cases } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "استرجاع حساب إنستغرام المعطّل | استرجاع انستا" },
  description:
    "مكتب عربي مستقل يقرأ رسالة إنستغرام، يطابقها بنموذج ميتا، ويساعدك على كتابة طلب المراجعة. أرسل لقطة الشاشة عبر واتساب. لا نطلب كلمة المرور.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "استرجاع حساب إنستغرام المعطّل | استرجاع انستا",
    description:
      "مكتب عربي مستقل يقرأ رسالة إنستغرام، يطابقها بنموذج ميتا، ويساعدك على كتابة طلب المراجعة.",
    url: "/",
    type: "website",
  },
};

const screenLines = [
  {
    quote: "تم تعطيل حسابك لانتهاك شروطنا",
    next: "ملف مراجعة من داخل التطبيق، بوقائع قصيرة وإثبات ملكية.",
  },
  {
    quote: "البريد أو الرقم تغيّر دون طلبك",
    next: "مسار الحسابات المخترقة، مع الإسراع إن كانت رسالة التراجع ما زالت صالحة.",
  },
  {
    quote: "المستخدم غير موجود",
    next: "نفحص إن كان الحذف بطلبك، وهل نافذة الدخول قبل الحذف النهائي ما زالت مفتوحة.",
  },
];

const beats = [
  {
    n: "١",
    title: "نسخ الرسالة",
    text: "نأخذ الجملة كما ظهرت على الشاشة. إعادة الصياغة هنا تغيّر معنى الحالة.",
  },
  {
    n: "٢",
    title: "النموذج المقابل",
    text: "نموذج التعطيل غير مسار السرقة، ونافذة الحذف غير إعادة تعيين كلمة السر.",
  },
  {
    n: "٣",
    title: "ترتيب الإثبات",
    text: "اليوزر، والتاريخ، ووسيلة ما زالت تعمل. كلمة السر تبقى عندك.",
  },
  {
    n: "٤",
    title: "شرح الرد",
    text: "حين يصل رد ميتا نترجمه، ثم نقرر إن كانت إعادة التقديم مفيدة.",
  },
];

const ledger = [
  {
    title: "تعطيل أو باند",
    text: "نقرأ سبب الإغلاق المكتوب ونجهّز اعتراضًا يثبت أنك صاحب الحساب.",
  },
  {
    title: "بيانات الدخول تغيّرت",
    text: "نوجّهك لمسار «حسابي اختُرق» وخطوات التراجع عن تبديل البريد إن بقيت المهلة.",
  },
  {
    title: "حذف أو إخفاء",
    text: "نحدد إن كانت مهلة إلغاء الحذف مفتوحة، أو إن الحساب مخفي ويحتاج تنشيطًا.",
  },
  {
    title: "دخول ومصادقة",
    text: "نرتّب إعادة التعيين عبر وسيلة ما زالت معك، دون استلام رمز الجوال.",
  },
  {
    title: "نص الاستئناف",
    text: "نكتبه بالعربية أو الإنجليزية. السيلفي أو الهوية فقط إذا طلبتهما المنصة.",
  },
  {
    title: "متجر أو توثيق",
    text: "ملف يراعي الإعلانات ومدير الأعمال، وبتفاصيل أقل في المحادثة.",
  },
];

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

const intake = [
  { k: "اليوزر", v: "كما تتذكره، حتى لو تغيّر بعده." },
  { k: "لقطة الشاشة", v: "الرسالة كاملة، ومعها الأزرار إن ظهرت." },
  { k: "أول يوم", v: "متى لاحظت المشكلة. التقريب يكفي." },
  { k: "الوسيلة القديمة", v: "هل البريد أو الشريحة ما زالا يفتحان؟" },
];

const deskFaqs = [
  {
    q: "من يفتح الحساب؟",
    a: "إنستغرام وميتا. نحن نجهّز الملف ونتابع الرد. القرار يبقى عندهما.",
  },
  {
    q: "ماذا يحدث قبل أي مبلغ؟",
    a: "نقرأ اللقطة ونذكر نوع الحالة والجهد المتوقع. بعدها تقرر أنت.",
  },
  {
    q: "هل تأخذون كلمة السر؟",
    a: "لا. ولا رمز التحقق الذي يصل إلى جوالك، ولا بيانات البطاقة.",
  },
  {
    q: "متى تتوقف المتابعة؟",
    a: "إذا رأينا أن الملف ضعيف نقول ذلك في الرسالة الأولى. حساب حُذف نهائيًا منذ مدة طويلة مثال على ذلك.",
  },
];

const readingSlugs = [
  "istirja-hisab-instagram-muattal",
  "istirja-hisab-mukhtaraq",
  "istirja-hisab-mahdhuf",
  "hisab-tijari-muattal",
  "istinaf-hisab-instagram",
];

const hrefByTitle = Object.fromEntries(cases.map((item) => [item.title, item.href]));

export default function HomePage() {
  const reading = readingSlugs
    .map((slug) => getArticle(slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article));
  const featured = reading[0];
  const rest = reading.slice(1);

  return (
    <div className="bg-[#f4efe6] text-[#1c1917]">
      <LatestTicker articles={articles} />
      <section className="border-b border-[#e6dcc8]">
        <div className="mx-auto grid max-w-[1180px] lg:grid-cols-12">
          <div className="px-5 py-12 sm:px-8 lg:col-span-7 lg:py-20">
            <p className="text-xs font-bold tracking-widest text-[#9a3412]">مكتب ملفات · مستقل عن ميتا</p>
            <h1 className="mt-4 max-w-xl text-[2rem] font-extrabold leading-[1.35] sm:text-5xl">
              استرجاع حساب إنستغرام يبدأ من الجملة المكتوبة على الشاشة
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#44403c]">
              أرسل لقطة الرسالة واسم المستخدم. نطابق النص بنموذج المساعدة لدى إنستغرام، ونكتب طلب المراجعة بهدوء، ونتابع حتى يصل رد واضح.
              الفحص الأول عبر واتساب، قبل أي اتفاق.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <WhatsAppCta>أرسل لقطة الشاشة</WhatsAppCta>
              <Link href="/services" className="text-sm font-bold text-[#1c1917] underline decoration-[#c4b49a] underline-offset-4">
                الأعمال التي ننجزها
              </Link>
            </div>
            <p className="mt-6 text-sm text-[#78716c]">
              {site.name} يساعد مالك الحساب فقط. طلب يخص حساب غيرك نعتذر عنه.
            </p>
          </div>

          <aside className="bg-[#142033] px-6 py-10 text-[#f6f1e8] sm:px-8 lg:col-span-5 lg:py-16">
            <p className="text-sm font-bold text-[#fdba74]">ثلاث جمل تتكرر في اللقطات</p>
            <ol className="mt-8 space-y-8">
              {screenLines.map((line, index) => (
                <li key={line.quote} className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
                  <p className="text-xs font-bold text-[#fdba74]">0{index + 1}</p>
                  <p className="mt-2 text-lg font-bold leading-8">«{line.quote}»</p>
                  <p className="mt-2 text-sm leading-7 text-[#d6d3d1]">{line.next}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">بعد وصول اللقطة</h2>
          <p className="mt-3 leading-8 text-[#57534e]">
            أربعة أعمال متتالية. نوقف السلسلة إذا ظهر أن المسار لا يناسب الجملة التي أرسلتها.
          </p>
        </div>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-4">
          {beats.map((beat) => (
            <li key={beat.title} className="bg-[#fbf7f0] p-6">
              <p className="text-3xl font-extrabold text-[#9a3412]">{beat.n}</p>
              <h3 className="mt-3 text-lg font-bold">{beat.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{beat.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">سجل الأعمال</h2>
            <p className="mt-4 leading-8 text-[#57534e]">
              كل سطر ملف مختلف. الصفحة الكاملة في{" "}
              <Link href="/services" className="font-bold text-[#9a3412] underline underline-offset-4">
                الخدمات
              </Link>
              .
            </p>
          </div>
          <ul className="divide-y divide-[#e6dcc8] border-y border-[#e6dcc8]">
            {ledger.map((row) => (
              <li key={row.title} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <h3 className="font-bold">{row.title}</h3>
                <p className="text-sm leading-7 text-[#57534e]">{row.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <h2 className="text-2xl font-extrabold sm:text-3xl">فهرس حسب ما تراه</h2>
        <p className="mt-3 max-w-2xl leading-8 text-[#57534e]">
          اختر المجموعة الأقرب للشاشة التي أمامك. كل رابط يفتح دليلًا منفصلًا، لأن الخلط بين المجموعات يضعف الملف.
        </p>
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
      </section>

      <section className="border-y border-[#e6dcc8]">
        <div className="mx-auto grid max-w-[1180px] lg:grid-cols-2">
          <div className="bg-[#142033] px-5 py-12 text-[#f6f1e8] sm:px-8">
            <h2 className="text-2xl font-extrabold">أربعة أسطر في أول رسالة</h2>
            <p className="mt-3 text-sm leading-7 text-[#d6d3d1]">
              هذا يكفي لمعرفة نوع الحالة. التفاصيل الزائدة نطلبها لاحقًا إذا احتاجها النموذج.
            </p>
            <dl className="mt-8 space-y-5">
              {intake.map((item, index) => (
                <div key={item.k} className="grid grid-cols-[auto_1fr] gap-4">
                  <dt className="font-bold text-[#fdba74]">0{index + 1}</dt>
                  <dd>
                    <p className="font-bold">{item.k}</p>
                    <p className="mt-1 text-sm leading-7 text-[#d6d3d1]">{item.v}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col justify-between bg-[#fbf7f0] px-5 py-12 sm:px-8">
            <div>
              <h2 className="text-2xl font-extrabold">قبل أن تدفع لأي جهة</h2>
              <p className="mt-4 leading-8 text-[#44403c]">
                من يعدك بفتح الحساب خلال ساعة، أو يطلب الرمز الذي وصل إلى جوالك، يسعى للدخول إلى ما تبقّى من الحساب.
                نرفض هذين الطلبين. إنستغرام لا يتصل ليطلب الرمز، ونحن كذلك.
              </p>
              <p className="mt-4 leading-8 text-[#44403c]">
                مركز المساعدة داخل instagram.com هو المرجع. الروابط التي تطلب كلمة السر خارج هذا النطاق تُترك مغلقة.
              </p>
            </div>
            <WhatsAppCta className="mt-8 w-fit">واتساب باللقطة واليوزر</WhatsAppCta>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold sm:text-3xl">من الأرشيف</h2>
          <Link href="/articles" className="text-sm font-bold text-[#9a3412] underline underline-offset-4">
            كل المقالات ({articles.length})
          </Link>
        </div>
        {featured ? (
          <div className="mt-8 grid gap-8 border-t border-[#e6dcc8] pt-8 lg:grid-cols-[1.3fr_0.7fr]">
            <article>
              <p className="text-xs font-bold text-[#9a3412]">{featured.category}</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-10">
                <Link href={`/articles/${featured.slug}`} className="hover:text-[#9a3412]">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-xl leading-8 text-[#57534e]">{featured.description}</p>
            </article>
            <ul className="divide-y divide-[#e6dcc8] border-y border-[#e6dcc8] lg:border-y-0 lg:border-s lg:ps-8">
              {rest.map((article) => (
                <li key={article.slug} className="py-3">
                  <p className="text-xs font-bold text-[#a8a29e]">{article.category}</p>
                  <Link href={`/articles/${article.slug}`} className="mt-1 block font-bold leading-7 hover:text-[#9a3412]">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="border-t border-[#e6dcc8] bg-[#fbf7f0]">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold">أربعة أجوبة مختصرة</h2>
            <Link href="/faq" className="text-sm font-bold text-[#9a3412] underline underline-offset-4">
              بقية الأسئلة
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {deskFaqs.map((item) => (
              <article key={item.q}>
                <h3 className="font-extrabold">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6dcc8]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-extrabold">اللقطة تكفي للبداية</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[#57534e]">
              نرد بنوع الحالة وما يمكن فعله الآن. إن كان المسار خطوتين داخل التطبيق سنكتبها لك.
            </p>
          </div>
          <WhatsAppCta>افتح واتساب</WhatsAppCta>
        </div>
      </section>

      <CompletedClientsCounter />
    </div>
  );
}
