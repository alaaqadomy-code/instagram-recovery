import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { steps } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

const pageTitle = "كيف نعمل في استرجاع حساب انستقرام: من لقطة الشاشة حتى عودة الحساب";

export const metadata: Metadata = {
  title: { absolute: `${pageTitle} | Unlock Accounts` },
  description:
    "شرح خطوة بخطوة لطريقة عملنا في استرجاع حساب انستقرام: فحص مجاني عبر واتساب، تشخيص من نص الرسالة، إثبات ملكية بلا كلمة مرور، اختيار البوابة الرسمية، صياغة الطلب ومتابعته.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: pageTitle,
    description: "من أول رسالة واتساب حتى تأمين الحساب بعد عودته: مراحل عملنا، ما نقبله وما نرفضه، ومتى لا نأخذ مالاً.",
    url: "/how-it-works",
    type: "website",
  },
};

const accepted = [
  "اسم المستخدم كما تتذكره، أو رابط الحساب العام.",
  "لقطة شاشة للرسالة التي تظهر عند محاولة الدخول، بنصها الكامل.",
  "البريد الإلكتروني أو رقم الهاتف الذي كان مرتبطاً بالحساب، وهل ما زلت تصل إليه.",
  "تاريخ تقريبي لإنشاء الحساب، والجهاز الذي اعتدت الدخول منه.",
  "صور قديمة من هاتفك نُشرت على الحساب، أو إشعارات بريدية سابقة من انستقرام.",
  "للحسابات التجارية: فواتير الإعلانات أو اسم المتجر المرتبط بمدير الأعمال إن وُجدت.",
];

const refused = [
  "كلمة المرور الحالية أو القديمة، مهما كان السبب.",
  "رمز التحقق الذي يصل إلى هاتفك أو بريدك عبر رسالة نصية.",
  "أكواد المصادقة الثنائية أو الأكواد الاحتياطية.",
  "بيانات البطاقة البنكية أو أي تحويل قبل اتفاق واضح على السعر.",
  "صورة هوية لشخص غير صاحب الحساب.",
];

const gateways = [
  {
    name: "زر الاعتراض داخل التطبيق",
    text: "يظهر عادة مع رسالة التعطيل مباشرة. هو أسرع البوابات وأقلها مساحة للكتابة، ويصلح عندما يكون الحساب معطلاً بقرار واضح ويعرض لك النظام خيار «الاعتراض» أو «طلب مراجعة».",
  },
  {
    name: "نماذج المساعدة",
    text: "نماذج منفصلة في مركز المساعدة لكل حالة: حساب معطل، حساب لا يظهر فيه زر اعتراض، حساب تجاري. تحتاج بيانات دقيقة متطابقة، وأي اختلاف في البريد أو الاسم بين نموذجين يُضعف الملف.",
  },
  {
    name: "مركز الحسابات",
    text: "البوابة المناسبة عندما يكون انستقرام مرتبطاً بفيسبوك أو بحساب أعمال. بعض قرارات التعطيل تظهر هنا مع مهلة اعتراض محددة، ولا تظهر في التطبيق نفسه.",
  },
  {
    name: "نموذج الاختراق",
    text: "مسار «أعتقد أن حسابي اختُرق» المخصص للحالات التي تغيّر فيها البريد أو الرقم أو كلمة المرور دون علمك. يختلف كلياً عن مسار التعطيل، واستخدامه لحساب معطل يضيّع الوقت.",
  },
  {
    name: "إثبات الهوية",
    text: "طلب فيديو سيلفي أو مستند رسمي. ليس بوابة تختارها بنفسك، بل خطوة تطلبها المنصة بعد أحد المسارات السابقة. نجهزك لها بحيث تطابق الصورة ما هو منشور على الحساب.",
  },
];

const writingRules = [
  { title: "وقائع لا مشاعر", text: "ماذا حدث، ومتى، وماذا رأيت على الشاشة. لا شكوى ولا تهديد ولا قصة طويلة." },
  { title: "إثبات ملكية في سطر", text: "تاريخ الإنشاء التقريبي، البريد المرتبط، نوع المحتوى. ما يكفي ليتأكد المراجع أنك المالك." },
  { title: "طلب واحد واضح", text: "نطلب مراجعة القرار أو إعادة الوصول. لا نجمع طلبين في رسالة واحدة." },
  { title: "لغة واحدة متماسكة", text: "عربية فصحى أو إنجليزية بسيطة حسب الحالة، دون خلط ودون اختصارات." },
  { title: "اتساق مع الطلبات السابقة", text: "البريد والاسم والتاريخ نفسها في كل تقديم. التناقض بين طلبين أخطر من الصمت." },
];

const replies = [
  { type: "طلب معلومات إضافية", meaning: "إشارة إيجابية. المراجع فتح الملف ويحتاج بياناً أو صورة. نرد خلال المهلة المحددة بالمطلوب فقط." },
  { type: "طلب إثبات الهوية", meaning: "المنصة تريد التأكد من أنك شخص حقيقي يطابق الحساب. نجهز السيلفي أو المستند قبل الرفع، فالرفض هنا يُغلق الباب مؤقتاً." },
  { type: "رد آلي بالرفض", meaning: "صياغة عامة بلا تفاصيل. غالباً لم يُقرأ الملف بعمق. نراجع المسار والصياغة قبل التفكير في إعادة التقديم." },
  { type: "رفض نهائي مع ذكر السياسة", meaning: "يُسمّى البند المخالف صراحة. الفرص هنا أضعف، ونقول ذلك لك بوضوح، مع ما تبقى من خيارات إن وُجدت." },
  { type: "لا رد", meaning: "الصمت ليس رفضاً دائماً. ننتظر المدة المعقولة للمسار، ثم نقرر إعادة التقديم بدل إغراق النظام برسائل متشابهة." },
];

const stopCases = [
  "حساب لا يملكه صاحب الطلب، مهما كانت القصة أو العلاقة.",
  "طلب اختراق حساب أو الدخول إلى حساب آخر أو حذف منشورات لدى غيرك.",
  "حساب يعتمد على انتحال شخصية أو علامة تجارية ليست لصاحبه.",
  "من يطلب ضماناً مكتوباً للنتيجة، لأن القرار بيد المنصة وحدها.",
  "حالة فحصناها ووجدنا الفرص شبه معدومة، فنقول ذلك ولا نأخذ المال.",
];

const faqItems = [
  {
    q: "هل أرسل لكم كلمة المرور لتبدؤوا العمل؟",
    a: "لا. لا نطلب كلمة المرور ولا رمز التحقق في أي مرحلة. كل الخطوات تجري من جهتك أو عبر نماذج رسمية نرشدك إلى ملئها، ونحن نساعد في التشخيص والصياغة والمتابعة.",
  },
  {
    q: "كم يستغرق الفحص الأولي؟",
    a: "يبدأ الرد خلال دقائق من وصول لقطة الشاشة واسم المستخدم في أوقات العمل. تحديد نوع الحالة والمسار المقترح يأتي في الرسائل الأولى، قبل أي كلام عن السعر.",
  },
  {
    q: "هل تضمنون عودة الحساب؟",
    a: "لا. لا توجد جهة صادقة تضمن قرار ميتا. ما نلتزم به هو تشخيص صحيح، ومسار رسمي مطابق للحالة، وصياغة واضحة، ومتابعة حتى يصل رد.",
  },
  {
    q: "متى أدفع؟",
    a: "بعد الفحص المجاني وبعد أن نتفق على السعر والمدة المتوقعة لحالتك تحديداً. لا دفع قبل التشخيص، ولا رسوم إضافية تظهر لاحقاً.",
  },
  {
    q: "قدمت اعتراضاً بنفسي وفشل، هل ما زال هناك مجال؟",
    a: "غالباً نعم، بشرط ألا تكون الطلبات السابقة متناقضة أو مكررة بكثرة. نقرأ ما أُرسل سابقاً، ونحدد ما الذي أضعف الملف، ثم نعيد التقديم بتوقيت وصياغة مختلفة.",
  },
  {
    q: "هل تعملون مع عملاء خارج السعودية؟",
    a: "نعم. نخدم السعودية ودول الخليج أساساً، ونقبل حالات من أي مكان ما دام التواصل عبر واتساب ممكناً وصاحب الطلب هو مالك الحساب.",
  },
];

export default function HowItWorksPage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: pageTitle,
    description: metadata.description,
    inLanguage: "ar",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text,
      url: `${absoluteUrl("/how-it-works")}#step-${index + 1}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "كيف نعمل", item: absoluteUrl("/how-it-works") },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="bg-[#f4efe6] text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <nav aria-label="مسار التنقل" className="text-xs text-[#78716c]">
          <Link href="/" className="hover:text-[#9a3412]">
            الرئيسية
          </Link>{" "}
          · <span className="text-[#44403c]">كيف نعمل</span>
        </nav>

        <p className="mt-6 text-xs font-bold tracking-widest text-[#9a3412]">طريقة العمل · فحص مجاني · بلا كلمة مرور</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">{pageTitle}</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">
          نحن مكتب عربي مستقل غير تابع لميتا ولا لانستقرام. لا نملك زراً سرياً يعيد الحسابات، ولا واسطة داخل الشركة، ولا
          نضمن نتيجة. ما نملكه هو خبرة مرتبة في قراءة رسائل المنصة، واختيار البوابة الرسمية الصحيحة، وكتابة طلب يُقرأ
          ويُفهم، ومتابعة الرد حتى النهاية. هذه الصفحة تشرح كل مرحلة بالتفصيل حتى تعرف ما الذي يحدث لحسابك قبل أن تراسلنا،
          وما الذي لن نطلبه منك أبداً.
        </p>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} id={`step-${index + 1}`} className="bg-[#fbf7f0] p-5">
              <p className="text-2xl font-extrabold text-[#9a3412]">0{index + 1}</p>
              <h2 className="mt-2 font-bold">{step.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{step.text}</p>
            </li>
          ))}
        </ol>

        {/* أول 10 دقائق */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold">ما يحدث في أول 10 دقائق</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            تبدأ القصة برسالة واتساب فيها شيئان فقط: لقطة شاشة للرسالة التي تراها عند محاولة الدخول، واسم المستخدم. لا
            نحتاج أكثر من ذلك للبدء، ولا نسألك عن كلمة المرور. في الدقائق الأولى نفتح رابط الحساب العام من متصفح غير
            مسجّل الدخول لنرى ما يراه الجمهور: هل الحساب موجود ولا يمكن الدخول إليه، أم اختفى تماماً، أم تغيّر اسمه أو
            صورته؟ هذا الفرق وحده يفصل بين حالة التعطيل وحالة الاختراق وحالة الحذف.
          </p>
          <p className="mt-4 leading-8 text-[#44403c]">
            ثم نرد عليك بثلاثة أسطر: نوع الحالة كما نراها، تقدير صريح للفرص (جيدة، متوسطة، ضعيفة)، والخطوة العاجلة التي
            عليك فعلها الآن حتى لو لم تتعامل معنا. في حالات الاختراق قد تكون هذه الخطوة ضغط رابط «التراجع عن التغيير» في
            بريدك القديم قبل أن تنتهي مهلته، وفي حالات الحذف قد تكون مجرد تسجيل دخول قبل انتهاء المهلة. كل هذا مجاني ولا
            يُلزمك بشيء. يمكنك البدء الآن من <Link href="/check" className="font-bold text-[#9a3412] underline underline-offset-4">صفحة الفحص المجاني</Link>.
          </p>
        </section>

        {/* التشخيص */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">التشخيص من الرسالة: لماذا الحرفية مهمة</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            كثيرون يلخصون ما رأوه بعبارة «حسابي مبند» أو «الحساب مقفول»، لكن انستقرام لا يستخدم كلمة واحدة لكل شيء.
            رسالة «تم تعطيل حسابك» تختلف عن «تم تعليق حسابك» وعن «لقد علّقنا هذا الحساب مؤقتاً» وعن «لم نتمكن من تسجيل
            دخولك». كل عبارة تقود إلى بوابة رسمية مختلفة ومهلة مختلفة. لهذا نطلب لقطة الشاشة لا الوصف، ونقرأ النص حرفاً
            بحرف، بما في ذلك الأزرار التي تظهر تحته: هل يوجد زر اعتراض؟ هل يُذكر بند بعينه من إرشادات المجتمع؟ هل تُذكر
            مهلة بالأيام؟
          </p>
          <p className="mt-4 leading-8 text-[#44403c]">
            الحرفية تحمينا أيضاً من الخطأ الأكثر شيوعاً الذي نراه: استخدام مسار «نسيت كلمة المرور» لحساب معطل، أو إرسال
            نموذج الاختراق لحساب محذوف. المسار الخطأ لا يضيّع الوقت فقط، بل يُسجَّل في ملف الحساب ويجعل الطلب الصحيح لاحقاً
            يبدو متناقضاً. إن كانت حالتك تعطيلاً فاقرأ صفحة{" "}
            <Link href="/services/استرجاع-حساب-انستقرام-معطل" className="font-bold text-[#9a3412] underline underline-offset-4">
              استرجاع حساب انستقرام معطل
            </Link>
            ، وإن تغيّر البريد أو الرقم دون علمك فحالتك على الأرجح في صفحة{" "}
            <Link href="/services/استرجاع-حساب-انستقرام-مسروق" className="font-bold text-[#9a3412] underline underline-offset-4">
              استرجاع حساب انستقرام مسروق
            </Link>
            .
          </p>
        </section>

        {/* إثبات الملكية */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">إثبات الملكية بلا أسرار</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            المراجع في ميتا لا يعرفك، ولا يرى وجهك، ويقرأ آلاف الطلبات. وظيفتنا أن نجمع ما يثبت أنك مالك الحساب بأقل عدد
            من الأسطر، دون أن نلمس أي بيان سري. القاعدة بسيطة: كل ما تحتاجه المنصة لإثبات الملكية هو معلومات تعرفها أنت
            وحدك عن تاريخ الحساب، لا مفاتيح الدخول إليه.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <h3 className="font-extrabold text-[#142033]">ما نقبله</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[#57534e]">
                {accepted.map((item) => (
                  <li key={item}>▸ {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <h3 className="font-extrabold text-[#9a3412]">ما نرفضه</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[#57534e]">
                {refused.map((item) => (
                  <li key={item}>✕ {item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-6 text-[#78716c]">
                إن طلب منك أي شخص هذه البيانات مقابل «فك فوري» فهذه علامة نصب، لا علامة خبرة.
              </p>
            </div>
          </div>
        </section>

        {/* البوابات الرسمية */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">اختيار البوابة الرسمية</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            لدى ميتا أكثر من مدخل واحد للطلبات، ولكل مدخل فريق مراجعة ومهلة ونوع بيانات مختلف. اختيار البوابة هو القرار
            الأهم في الملف كله، لأن الطلب الممتاز في البوابة الخطأ يُرفض آلياً. هذه البوابات الخمس وما يميز كل واحدة منها:
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {gateways.map((gateway) => (
              <article key={gateway.name} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
                <h3 className="font-extrabold">{gateway.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#57534e]">{gateway.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 leading-8 text-[#44403c]">
            نختار بوابة واحدة فقط لكل حالة ونلتزم بها. إرسال الطلب نفسه عبر ثلاث بوابات في يوم واحد لا يضاعف الفرص، بل
            يُنتج ثلاثة ملفات متداخلة قد يُغلق أحدها الآخر. تفاصيل كل حالة ومسارها في{" "}
            <Link href="/services" className="font-bold text-[#9a3412] underline underline-offset-4">
              صفحة الخدمات
            </Link>
            .
          </p>
        </section>

        {/* كتابة الطلب */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">كتابة الطلب: قواعد الصياغة الخمس</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            طلب المراجعة ليس رسالة شكوى ولا مقالاً. المراجع يقرأ بسرعة ويبحث عن ثلاثة أشياء: ما الحالة، ما الدليل على
            الملكية، وما المطلوب. نكتب الطلب بالعربية أو الإنجليزية حسب ما يخدم الحالة، ونلتزم بخمس قواعد ثابتة:
          </p>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
            {writingRules.map((rule, index) => (
              <li key={rule.title} className="bg-[#fbf7f0] p-5">
                <p className="text-lg font-extrabold text-[#9a3412]">{index + 1}</p>
                <h3 className="mt-1 text-sm font-bold">{rule.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#57534e]">{rule.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <h3 className="font-extrabold text-[#9a3412]">صياغة سيئة</h3>
              <p className="mt-3 text-sm leading-7 text-[#57534e]">
                «حسابي اتقفل من غير سبب!!! أنا ما سويت شي وهذا ظلم، صار لي سنين على الحساب وفيه كل ذكرياتي، رجعوه بسرعة
                الله يخليكم، هذي خامس مرة أرسل لكم ولا أحد يرد».
              </p>
              <p className="mt-3 text-xs leading-6 text-[#78716c]">
                لا يوجد اسم مستخدم، ولا بريد، ولا وصف للرسالة، والنبرة انفعالية، والاعتراف بتكرار الإرسال يضر بالملف.
              </p>
            </div>
            <div className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <h3 className="font-extrabold text-[#142033]">صياغة جيدة</h3>
              <p className="mt-3 text-sm leading-7 text-[#57534e]">
                «أنا مالك الحساب @username المنشأ عام 2017 والمرتبط بالبريد name@example.com. عند تسجيل الدخول تظهر رسالة
                «تم تعطيل حسابك» دون تحديد المخالفة. الحساب شخصي ينشر صور سفر وطعام، ولم أتلقَّ تحذيراً سابقاً. أرجو
                مراجعة القرار وإعادة الوصول إلى الحساب، ويسعدني تقديم أي إثبات إضافي».
              </p>
              <p className="mt-3 text-xs leading-6 text-[#78716c]">وقائع، إثبات ملكية، وصف للرسالة، طلب واحد، نبرة هادئة.</p>
            </div>
          </div>
        </section>

        {/* المتابعة وتفسير الرد */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">المتابعة وتفسير الرد</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            بعد التقديم يبدأ الجزء الذي يرتبك فيه أكثر الناس: الانتظار. ردود ميتا تصل عبر البريد أو داخل التطبيق، وبعضها
            آلي وبعضها من مراجع بشري، وقراءتها قراءة صحيحة تحدد الخطوة التالية. نتابع معك البريد والإشعارات، ونفسر لك كل
            رد بما يعنيه فعلاً لا بما تتمناه:
          </p>
          <div className="mt-6 overflow-hidden rounded-sm border border-[#e6dcc8]">
            {replies.map((reply, index) => (
              <div key={reply.type} className={`grid gap-2 p-5 md:grid-cols-[220px_1fr] ${index % 2 === 0 ? "bg-[#fbf7f0]" : "bg-[#f8f3ea]"}`}>
                <h3 className="text-sm font-extrabold text-[#142033]">{reply.type}</h3>
                <p className="text-sm leading-7 text-[#57534e]">{reply.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* إعادة التقديم */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">إعادة التقديم بذكاء</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            الرفض الأول ليس نهاية الطريق في كثير من الحالات، لكن إعادة إرسال النص نفسه في اليوم التالي هي أسرع طريقة
            لتحويل ملف قابل للمراجعة إلى ملف مهمل. قبل أي إعادة تقديم نسأل ثلاثة أسئلة: هل كانت البوابة صحيحة؟ هل كان
            هناك نقص في إثبات الملكية؟ هل اختلف شيء في البيانات بين الطلب الأول وما نريد إرساله الآن؟ إن كانت الإجابات
            تشير إلى خطأ قابل للتصحيح نعيد التقديم مرة واحدة بصياغة مختلفة وبيانات متطابقة وتوقيت مناسب للمسار.
          </p>
          <p className="mt-4 leading-8 text-[#44403c]">
            أما إن كان الرفض نهائياً ومعللاً ببند صريح، فنقول لك إن الفرص أصبحت ضعيفة ونترك لك القرار، بدل أن نبيعك محاولة
            رابعة وخامسة. الصدق في هذه النقطة جزء من الخدمة، لا استثناء منها.
          </p>
        </section>

        {/* التأمين */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">تأمين الحساب بعد العودة</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            عودة الحساب ليست آخر خطوة، بل الخطوة التي تمنع تكرار القصة. في أول ساعة بعد العودة نرشدك إلى ترتيب محدد:
            تغيير كلمة المرور من جهازك أنت إلى كلمة طويلة غير مستخدمة في أي خدمة أخرى، تفعيل المصادقة الثنائية عبر تطبيق
            مصادقة لا عبر الرسائل النصية، حفظ الأكواد الاحتياطية في مكان آمن خارج الهاتف، ومراجعة قائمة الأجهزة النشطة
            وتسجيل الخروج من كل جهاز لا تعرفه. ثم نراجع معك البريد ورقم الهاتف المرتبطين للتأكد من أنهما لك وحدك، ونفحص
            التطبيقات الخارجية المصرح لها بالوصول. كل ذلك تفعله أنت بيدك؛ نحن نشرح ونتابع فقط.
          </p>
        </section>

        {/* الحالات المرفوضة */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">ما الذي يتوقف عنده عملنا</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            حدود عملنا واضحة ولا نتجاوزها مهما كان العرض. نرفض الحالات التالية من أول رسالة، ونفضّل أن تعرفها قبل أن
            تراسلنا:
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {stopCases.map((item) => (
              <li key={item} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] px-5 py-4 text-sm leading-7 text-[#57534e]">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* السعر */}
        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">السعر حسب الحالة</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              لا نعلن سعراً موحداً لأن الجهد يختلف جذرياً: حساب محذوف ما زالت مهلته مفتوحة يحتاج دقائق، بينما حساب مسروق
              غُيّرت فيه كل البيانات يحتاج ملفاً كاملاً ومتابعة لأسابيع. بعد الفحص المجاني نخبرك بالسعر والمدة المتوقعة
              لحالتك أنت، قبل أي دفع، ولا نضيف رسوماً في منتصف الطريق. والسعر مقابل العمل والمتابعة، لا مقابل نتيجة لا
              نملك ضمانها.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">متى لا نأخذ مالاً</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              إن كان الحل خطوتين داخل التطبيق نكتبهما لك في الواتساب مجاناً وننتهي. وإن وجدنا بعد الفحص أن الفرص شبه
              معدومة نقول ذلك ولا نقبل الدفع. وإن اكتشفنا في أي مرحلة أن الحساب ليس لك نتوقف فوراً. الفحص الأولي نفسه
              مجاني دائماً ولا يُلزمك بشيء.
            </p>
          </div>
        </section>

        {/* الأسئلة الشائعة */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">أسئلة شائعة عن طريقة العمل</h2>
          <dl className="mt-6 grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
                <dt className="font-extrabold">{item.q}</dt>
                <dd className="mt-3 text-sm leading-7 text-[#57534e]">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-7 text-[#57534e]">
            مزيد من الأسئلة عن الحالات والمدد في{" "}
            <Link href="/faq" className="font-bold text-[#9a3412] underline underline-offset-4">
              صفحة الأسئلة الشائعة
            </Link>
            .
          </p>
        </section>

        <div className="mt-14 rounded-sm bg-[#142033] p-8 text-[#f6f1e8]">
          <p className="text-xl font-extrabold">ابدأ بالفحص المجاني الآن</p>
          <p className="mt-3 leading-7 text-[#d6d3d1]">
            أرسل لقطة الشاشة واسم المستخدم عبر واتساب، ونرد بنوع الحالة وتقدير الفرص والخطوة العاجلة. بلا كلمة مرور، وبلا
            التزام.
          </p>
          <WhatsAppCta className="mt-6">تواصل عبر واتساب</WhatsAppCta>
        </div>
      </div>
    </div>
  );
}
