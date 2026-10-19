import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { articlePath } from "@/lib/articles";
import { steps } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { gulfPages } from "@/lib/gulf-pages";
import { servicePages } from "@/lib/service-pages";

export const metadata: Metadata = {
  title: { absolute: "خدمات استرجاع حسابات انستقرام — معطل، مبند، محذوف، مسروق، مغلق | Unlock Accounts" },
  description:
    "خدمات استرجاع حساب انستقرام لكل حالة: معطل، مبند أو محظور، محذوف، مسروق أو مخترق، مغلق، وبدون كود التحقق. فحص مجاني عبر واتساب، بلا كلمة مرور، والسعر حسب الحالة.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "خدمات استرجاع حسابات انستقرام",
    description: "خدمة متخصصة لكل حالة: معطل، مبند، محذوف، مسروق، مغلق، وبدون كود التحقق. فحص مجاني والسعر حسب الحالة.",
    url: "/services",
    type: "website",
  },
};

const S = (slug: string) => `/services/${slug}`;

/** أي خدمة تناسب ما تراه على الشاشة؟ (2026-10-19: إثراء المحور بمحتوى خاص به لا مقتطفات من صفحات الخدمة) */
const screenToService: { screen: string; state: string; path: string; prepare: string; href: string; name: string }[] = [
  {
    screen: "«تم تعطيل حسابك» أو «We suspended your account» مع عدد أيام متبقية للاعتراض",
    state: "تعطيل أو تعليق بقرار من ميتا",
    path: "زر «اعتراض» داخل التطبيق، أو نموذج مراجعة الحساب المعطل في مركز مساعدة إنستغرام",
    prepare: "لقطة الرسالة كاملة بتاريخها، واسم المستخدم، والبريد المرتبط",
    href: S("استرجاع-حساب-انستقرام-معطل"),
    name: "الحساب المعطل",
  },
  {
    screen: "منع من النشر أو التعليق أو المتابعة لفترة، أو «Action blocked» و«Try again later»",
    state: "حظر نشاط أو باند على الميزات، والحساب نفسه قائم",
    path: "الانتظار حتى انتهاء المدة، واختيار «أخبرنا» إن ظهر، ومراجعة «حالة الحساب» من الإعدادات",
    prepare: "لقطة رسالة الحظر، وما فعلته في الساعات التي سبقتها (أداة نشر، متابعة جماعية، روابط)",
    href: S("استرجاع-حساب-انستقرام-مبند"),
    name: "الحساب المبند",
  },
  {
    screen: "«المستخدم غير موجود» عند البحث عن اسمك، أو طلبت حذف الحساب بنفسك",
    state: "حذف ذاتي ما زالت مهلته مفتوحة، أو تعطيل يبدو للآخرين كحذف، أو تغيير لاسم المستخدم",
    path: "تسجيل الدخول العادي خلال مهلة الحذف إن كان الطلب منك؛ وإلا قراءة الحالة قبل أي نموذج",
    prepare: "تاريخ طلب الحذف إن كان منك، وآخر اسم مستخدم تتذكره",
    href: S("استرجاع-حساب-انستقرام-محذوف"),
    name: "الحساب المحذوف",
  },
  {
    screen: "تغيّر البريد أو الرقم أو كلمة السر دون علمك، أو وصلتك رسالة عن دخول لم تقم به",
    state: "اختراق أو سرقة",
    path: "رابط التراجع في رسالة إنستغرام التي تصل من نطاق mail.instagram.com، ثم مسار instagram.com/hacked",
    prepare: "البريد القديم ورسالة التغيير، وأي لقطة لمحادثة طلب فيها المخترق مالاً",
    href: S("استرجاع-حساب-انستقرام-مسروق"),
    name: "الحساب المسروق",
  },
  {
    screen: "«Confirm it's you» أو «Challenge required» أو قفل احترازي بعد سفر أو جهاز جديد",
    state: "قفل مؤقت بانتظار التحقق، لا عقوبة",
    path: "إكمال التحقق من التطبيق الرسمي على الجهاز والشبكة المعتادين، مرة واحدة بهدوء",
    prepare: "الجهاز الذي اعتدت الدخول منه، والشريحة أو البريد اللذان يصلهما الرمز",
    href: S("استرجاع-حساب-انستقرام-مغلق"),
    name: "الحساب المغلق",
  },
  {
    screen: "الرمز لا يصل إلى البريد أو الرقم، أو تظهر وسيلة لا تعرفها",
    state: "فقدان وسيلة التحقق",
    path: "«جرّب طريقة أخرى» في شاشة الدخول، ثم طلب المساعدة وإثبات الهوية إن ظهر",
    prepare: "أي بريد قديم ربطته بالحساب، ووجهك لفيديو السيلفي إن طُلب، وصور قديمة تعرف تفاصيلها",
    href: S("استرجاع-حساب-انستقرام-بدون-كود-التحقق"),
    name: "بدون كود التحقق",
  },
];

const noServiceNeeded: { case: string; text: string; slug: string; anchor: string }[] = [
  {
    case: "نسيت كلمة السر والبريد أو الرقم ما زال بيدك",
    text: "إعادة التعيين من شاشة الدخول تكفي، وتصلك رسالة خلال دقائق. لا تدفع لأحد مقابل خطوة يقدمها إنستغرام مجاناً.",
    slug: "naseet-kalimat-sirr-lilinstagram",
    anchor: "نسيت كلمة السر للانستقرام",
  },
  {
    case: "ألغيت تنشيط الحساب مؤقتاً بنفسك",
    text: "التعطيل المؤقت الذي تختاره من الإعدادات يزول بتسجيل الدخول العادي بالبيانات نفسها، ولا يحتاج نموذج مراجعة.",
    slug: "ilgha-tansheet-hisab-instagram",
    anchor: "إلغاء تنشيط حساب انستقرام",
  },
  {
    case: "حظر نشاط مؤقت بعد متابعة أو إعجابات كثيرة",
    text: "الحظر على الميزات يرتفع بعد مدة غالباً إن توقفت عن النشاط الذي سبّبه. الإلحاح بالمحاولة يطيله.",
    slug: "fak-shadowban-instagram",
    anchor: "فك شادوبان انستقرام",
  },
  {
    case: "رسالة «يُرجى الانتظار بضع دقائق»",
    text: "هذا حد محاولات دخول لا حكم على الحساب. التوقف ساعات ثم المحاولة مرة واحدة من الجهاز المعتاد يحل أغلب هذه الحالات.",
    slug: "hadd-muhawalat-instagram",
    anchor: "حد محاولات الدخول",
  },
];

const servicesFaqs = [
  {
    q: "هل Unlock Accounts تابعة لإنستغرام أو ميتا؟",
    a: "لا. نحن جهة عربية مستقلة لا علاقة رسمية لها بميتا. نعمل من خلال النماذج والمسارات الرسمية المتاحة لأي مستخدم، والقرار في كل طلب لميتا وحدها.",
  },
  {
    q: "هل تحتاجون كلمة المرور أو رمز التحقق لتبدأوا؟",
    a: "لا، أبداً. نبدأ من لقطة الشاشة واسم المستخدم، وما يثبت أنك المالك. من يطلب كلمة السر أو الرمز ليسترجع حسابك يعرّضه لخطر أكبر.",
  },
  {
    q: "كم تستغرق الخدمة؟",
    a: "تختلف المدة حسب الحالة ورد ميتا. نذكر لك المدة المتوقعة بعد الفحص وقبل أي دفع، وفي كل صفحة خدمة جدول بالمدد المعتادة لتلك الحالة.",
  },
  {
    q: "هل أرسل الاعتراض بنفسي قبل أن أراسلكم؟",
    a: "إن ظهر زر الاعتراض فإرساله مرة واحدة بجملتين هادئتين لا يضر. ما يضر هو تكرار الإرسال بنصوص متناقضة، أو اختيار نموذج لا يطابق رسالة الشاشة.",
  },
  {
    q: "هل تخدمون من هم خارج الخليج؟",
    a: "نعم. نخدم الناطقين بالعربية في أي بلد، ولدينا صفحات خاصة للسعودية والإمارات والكويت وقطر والبحرين وعُمان والأردن والعراق لأن وسائل التحقق والجهات الرسمية تختلف بينها.",
  },
];

export default function ServicesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl("/services"),
    mainEntity: servicesFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="bg-[#f4efe6] text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <p className="text-xs font-bold tracking-widest text-[#9a3412]">خدمات الاسترجاع · فحص مجاني · السعر حسب الحالة</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">خدمات استرجاع حسابات انستقرام لكل حالة</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">
          لكل مشكلة مسار رسمي مختلف لدى ميتا، ولهذا قسمنا الخدمة إلى ست حالات. اختر الأقرب لما تراه على شاشتك، أو أرسل
          لقطة الشاشة عبر واتساب ونحدد الحالة لك مجاناً. لا نطلب كلمة المرور، ولا نضمن قرار المنصة، ونقول صراحة إن كانت
          الفرص ضعيفة.
        </p>

        <section className="mt-8 max-w-3xl rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
          <p className="text-xs font-bold tracking-widest text-[#9a3412]">إجابة مباشرة</p>
          <h2 className="mt-2 text-xl font-extrabold">ما هي خدمة استرجاع حساب انستقرام؟</h2>
          <p className="mt-3 leading-8 text-[#44403c]">
            خدمة استرجاع حساب انستقرام في Unlock Accounts مساعدة بشرية بالعربية: نقرأ رسالة الشاشة كما هي، ونحدد أي مسار رسمي
            لدى ميتا يقابلها، ثم نرتب معك إثبات الملكية ونصوغ طلب المراجعة ونتابع الرد. لسنا تابعين لميتا، ولا نطلب كلمة
            المرور ولا رمز التحقق، والقرار النهائي في كل حالة لميتا وحدها. الفحص الأول مجاني عبر واتساب، والسعر حسب الحالة
            ويُحدد قبل أي دفع. وإن كان الحل خطوة تقدر عليها وحدك نكتبها لك ونقول إنك لا تحتاج خدمة.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold">أي خدمة تناسب ما تراه على الشاشة؟</h2>
          <p className="mt-3 max-w-3xl leading-8 text-[#44403c]">
            اختيار الخدمة يبدأ من الجملة المكتوبة على الشاشة لا من شعورك بما حدث. هذا الجدول يربط كل رسالة شائعة بالحالة التي
            تدل عليها، والمسار الرسمي الأقرب إليها، وما تجهزه قبل أن تراسلنا أو تراسل ميتا.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#142033] text-[#f6f1e8]">
                  <th className="p-4 text-right font-bold">ما تراه على الشاشة</th>
                  <th className="p-4 text-right font-bold">الحالة</th>
                  <th className="p-4 text-right font-bold">المسار الرسمي الأقرب</th>
                  <th className="p-4 text-right font-bold">ما تجهزه</th>
                  <th className="p-4 text-right font-bold">الخدمة</th>
                </tr>
              </thead>
              <tbody>
                {screenToService.map((row, i) => (
                  <tr key={row.href} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                    <td className="border-t border-[#e6dcc8] p-4 font-bold">{row.screen}</td>
                    <td className="border-t border-[#e6dcc8] p-4 text-[#44403c]">{row.state}</td>
                    <td className="border-t border-[#e6dcc8] p-4 text-[#44403c]">{row.path}</td>
                    <td className="border-t border-[#e6dcc8] p-4 text-[#44403c]">{row.prepare}</td>
                    <td className="border-t border-[#e6dcc8] p-4">
                      <Link href={row.href} className="font-bold text-[#9a3412] underline underline-offset-4">{row.name}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#57534e]">
            إن ظهرت على الشاشة رسالتان مختلفتان، مثل قفل احترازي ثم تعطيل، فالأحدث هي التي تحدد المسار. وإن لم تجد رسالتك في
            الجدول فجرّب <Link href="/check" className="font-bold text-[#9a3412] underline underline-offset-4">فحص حالة الحساب</Link> أو
            اقرأ معاني الكلمات في <Link href="/glossary" className="font-bold text-[#9a3412] underline underline-offset-4">مصطلحات انستقرام</Link>.
          </p>
        </section>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((page) => (
            <article key={page.slug} className="flex flex-col rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <p className="text-xs font-bold text-[#9a3412]">{page.label}</p>
              <h2 className="mt-2 text-xl font-extrabold leading-8">
                <Link href={`/services/${page.slug}`} className="hover:text-[#9a3412]">
                  {page.h1}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#57534e]">{page.answer.text.slice(0, 180)}…</p>
              <ul className="mt-4 space-y-1 text-xs text-[#78716c]">
                {page.signals.slice(0, 2).map((s) => (
                  <li key={s}>▸ {s}</li>
                ))}
              </ul>
              <Link href={`/services/${page.slug}`} className="mt-5 text-sm font-bold text-[#9a3412] underline underline-offset-4">
                تفاصيل الخدمة والخطوات ←
              </Link>
            </article>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold">استرجاع حسابات انستقرام في دول الخليج</h2>
        <p className="mt-3 max-w-3xl leading-8 text-[#44403c]">صفحات مخصصة لكل بلد: أنواع الحسابات الشائعة فيه، الجهات الرسمية للإبلاغ، وطريقة التواصل والدفع.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gulfPages.map((page) => (
            <Link key={page.slug} href={`/services/${page.slug}`} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-5 font-bold hover:border-[#9a3412]">
              {page.h1}
            </Link>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold">كيف تسير الخدمة من أول رسالة حتى عودة الحساب؟</h2>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-[#fbf7f0] p-5">
              <p className="text-2xl font-extrabold text-[#9a3412]">0{index + 1}</p>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{step.text}</p>
            </li>
          ))}
        </ol>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-extrabold">ماذا يحدث بعد أن ترسل لقطة الشاشة؟</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            نقرأ نص الرسالة حرفياً، لأن كلمة واحدة مثل «معلّق» أو «معطّل» أو «Challenge» تغيّر النموذج كله. ثم نسألك عمّا بقي
            بيدك: البريد المرتبط، والشريحة، والجهاز الذي اعتدت الدخول منه، وهل أرسلت اعتراضاً من قبل ومتى. هذه الإجابات
            تحدد إن كان الطريق مراجعة قرار، أم استعادة وسيلة دخول، أم إثبات ملكية بعد اختراق.
          </p>
          <p className="mt-4 leading-8 text-[#44403c]">
            بعدها نكتب لك التشخيص بكلمات واضحة: نوع الحالة، والمهلة التي تهمك إن وُجدت، وتقديراً للفرص بثلاث درجات فقط:
            مرتفعة أو متوسطة أو ضعيفة، بلا نسب مئوية مختلقة. ونذكر السعر والمدة المتوقعة قبل أي التزام. إن وافقت نجهز معك
            الأدلة، ونصوغ الطلب بالعربية أو الإنجليزية حسب الحالة، ونرتب إرساله من المسار الرسمي الصحيح مرة واحدة، ثم نتابع
            ما يصل إلى بريدك ونقرأ معك كل رد قبل أي خطوة تالية.
          </p>
          <p className="mt-4 leading-8 text-[#44403c]">
            وإذا وصل رفض فلا نعيد النص نفسه في اليوم نفسه. نقرأ صيغة الرفض، ونضيف دليلاً لم يكن في الطلب الأول أو نغيّر المسار
            إن تبيّن أن الحالة غير ما ظهر أولاً، مثل اختراق سبق التعطيل. ونقول لك بوضوح متى صار التوقف أفضل من الاستمرار.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold">متى لا تحتاج إلى خدمة مدفوعة؟</h2>
          <p className="mt-3 max-w-3xl leading-8 text-[#44403c]">
            جزء كبير من الرسائل التي تصلنا يُحل بخطوة واحدة من داخل التطبيق. هذه الحالات نشرح حلها مجاناً، ونرسل لك الدليل
            المناسب بدل عرض خدمة:
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {noServiceNeeded.map((item) => (
              <li key={item.slug} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-5">
                <h3 className="font-extrabold">{item.case}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">
                  {item.text} التفاصيل في{" "}
                  <Link href={articlePath(item.slug)} className="font-bold text-[#9a3412] underline underline-offset-4">{item.anchor}</Link>.
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-extrabold">متى نعتذر عن الطلب أو نقول إن الفرص ضعيفة؟</h2>
          <ul className="mt-4 space-y-3 leading-8 text-[#44403c]">
            <li>▸ الحساب ليس حسابك، أو تريد الدخول إلى حساب شريك أو قريب دون علمه. هذا طلب نرفضه مهما كانت القصة.</li>
            <li>▸ الحساب مشترى من شخص آخر، فإثبات الملكية فيه يعود إلى من أنشأه لا إليك، والمراجع يرى تغيّر البلد والجهاز فجأة.</li>
            <li>▸ الرسالة تقول إن القرار نهائي ولا يظهر أي مسار مراجعة، أو مضت مهلة الاعتراض المكتوبة على الشاشة.</li>
            <li>▸ الحساب حُذف بطلب منك وانتهت مهلة الحذف، فلا يبقى ما يُراجع.</li>
            <li>▸ تكرر التعطيل للسبب نفسه بعد عودة سابقة، أو أُرسلت عشرات الطلبات المتناقضة قبل أن تصلنا.</li>
          </ul>
          <p className="mt-4 leading-8 text-[#44403c]">
            في هذه الحالات نشرح السبب ونقترح ما يحمي بقية حساباتك، مثل تأمين البريد وإنهاء الجلسات الغريبة، ولا نأخذ مالاً
            مقابل محاولة نعرف أنها لن تغيّر القرار.
          </p>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">السعر حسب الحالة</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              لا سعر موحداً لأن جهد حالة الحذف خلال المهلة يختلف عن حالة سرقة غُيّرت فيها كل البيانات. نفحص مجاناً، ثم نحدد
              السعر والمدة المتوقعة قبل أي دفع، ولا رسوم مفاجئة في منتصف الطريق. وإن كان الحل خطوتين داخل التطبيق نكتبها لك
              مجاناً دون خدمة.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">ما الذي لا نفعله؟</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              لا نخترق حسابات، ولا ندّعي واسطة داخل انستقرام أو ميتا، ولا نطلب كلمة المرور أو رمز التحقق، ولا نضمن قرار
              المنصة، ولا نقبل طلباً يخص حساب غيرك. نقدم خبرة بالمسار الرسمي وصياغة الطلب والمتابعة.
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold">أسئلة شائعة عن خدمات استرجاع حساب انستقرام</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {servicesFaqs.map((f) => (
              <article key={f.q}>
                <h3 className="font-extrabold">{f.q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#57534e]">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-sm bg-[#142033] p-8 text-[#f6f1e8]">
          <p className="text-xl font-extrabold">افحص حالة حسابك مجاناً الآن</p>
          <p className="mt-3 leading-7 text-[#d6d3d1]">أرسل لقطة الشاشة واسم المستخدم، ونرد بنوع الحالة والفرص والخطوة العاجلة.</p>
          <WhatsAppCta className="mt-6">تواصل عبر واتساب</WhatsAppCta>
        </div>
      </div>
    </div>
  );
}
