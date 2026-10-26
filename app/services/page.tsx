import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { articlePath } from "@/lib/articles";
import { steps } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { gulfPages } from "@/lib/gulf-pages";
import { servicePages } from "@/lib/service-pages";
import { whatsappChatUrl } from "@/lib/site";

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

/** ما يثبت الملكية فعلاً لدى المراجع (2026-10-26: ما يسأل عنه المشتري ولا يجده على هذه الصفحة). */
const evidence: { item: string; why: string }[] = [
  {
    item: "اسم المستخدم كما تتذكره، أو رابط الحساب العام",
    why: "نفتح الرابط من متصفح غير مسجَّل الدخول لنرى ما يراه المراجع: حساب قائم، أو معطّل، أو غير موجود.",
  },
  {
    item: "لقطة شاشة للرسالة كاملة بتاريخها",
    why: "نص الرسالة هو ما يحدد النموذج. لقطة مقطوعة أو إعادة كتابة الرسالة من الذاكرة تؤدي إلى مسار خاطئ.",
  },
  {
    item: "البريد أو الرقم الذي كان مرتبطاً، وهل ما زال يصلك",
    why: "يفصل بين مسار استعادة وسيلة دخول ومسار إثبات ملكية بعد اختراق، وهما نموذجان مختلفان تماماً.",
  },
  {
    item: "تاريخ تقريبي لإنشاء الحساب، والجهاز الذي اعتدت الدخول منه",
    why: "أسئلة يطرحها نموذج إثبات الملكية نفسه، وتناقض الإجابات فيها يُضعف الملف أكثر من عدم الإجابة.",
  },
  {
    item: "صور قديمة من هاتفك نُشرت على الحساب، أو إشعارات بريدية سابقة من انستقرام",
    why: "دليل مادي على أنك من أنشأ المحتوى، وأقوى ما يمكن إرفاقه حين ضاعت كل وسائل التحقق.",
  },
  {
    item: "للحساب التجاري: فواتير الإعلانات أو اسم المتجر المرتبط بمدير الأعمال",
    why: "يربط الحساب بنشاط حقيقي ومصدر دخل، ويفتح مسارات دعم لا تتاح للحساب الشخصي.",
  },
];

/** ما يرفع فرص الحالة وما يخفضها، بالكلمات لا بالنسب. */
const odds: { strong: string; weak: string }[] = [
  {
    strong: "الرسالة تعرض مهلة اعتراض ما زالت سارية",
    weak: "مضت المهلة المكتوبة على الشاشة أو تقول الرسالة إن القرار نهائي",
  },
  {
    strong: "البريد المرتبط ما زال يصلك ولو من غير الحساب",
    weak: "ضاع البريد والرقم معاً ولا توجد وسيلة بديلة",
  },
  {
    strong: "لم تُرسل طلبات كثيرة قبل أن نبدأ",
    weak: "أُرسلت عشرات الطلبات بنصوص متناقضة أو عبر نماذج لا تطابق الحالة",
  },
  {
    strong: "الحساب أنشأته أنت ولديك ما يربطك بمحتواه",
    weak: "الحساب مشترى من شخص آخر، أو انتقل بينكما البريد والجهاز والبلد فجأة",
  },
  {
    strong: "راسلتنا في الساعات أو الأيام الأولى، خصوصاً في الاختراق",
    weak: "مضت شهور على الحذف الذاتي أو على تعطيل تكرر للسبب نفسه بعد عودة سابقة",
  },
];

const servicesFaqs = [
  {
    q: "هل Unlock Accounts تابعة لإنستغرام أو ميتا؟",
    a: "لا. نحن جهة عربية مستقلة لا علاقة رسمية لها بميتا ولا بانستقرام، ولا نملك قناة داخلية ولا واسطة. نعمل من خلال النماذج والمسارات الرسمية نفسها المتاحة لأي مستخدم، وما نضيفه هو قراءة صحيحة للرسالة، واختيار البوابة المناسبة، وصياغة طلب يُقرأ ويُفهم، ومتابعة الرد. القرار في كل طلب لميتا وحدها، ولهذا لا نضمن نتيجة ولا نقبل مالاً مقابل محاولة نعرف أنها لن تغيّر القرار.",
  },
  {
    q: "هل تحتاجون كلمة المرور أو رمز التحقق لتبدأوا؟",
    a: "لا، أبداً. نبدأ من لقطة الشاشة واسم المستخدم وما يثبت أنك المالك، ولا نطلب كلمة المرور ولا الرمز الذي يصل إلى جوالك ولا أي بيانات بنكية. من يطلب كلمة السر أو الرمز ليسترجع حسابك يعرّض الحساب والبريد لخطر أكبر، لأن الرمز نفسه هو ما يحتاجه المخترق لإكمال السيطرة. كل ما نحتاجه نستطيع العمل به دون أن ندخل حسابك ولو مرة واحدة.",
  },
  {
    q: "ما الأدلة التي تطلبونها لإثبات ملكية الحساب؟",
    a: "اسم المستخدم أو رابط الحساب، ولقطة الرسالة كاملة بتاريخها، والبريد أو الرقم الذي كان مرتبطاً وهل ما زال يصلك، وتاريخ تقريبي لإنشاء الحساب والجهاز الذي اعتدت الدخول منه. ويفيد كثيراً وجود صور قديمة من هاتفك نُشرت على الحساب، أو إشعارات بريدية سابقة من انستقرام. للحساب التجاري نطلب ما يربطه بنشاط حقيقي مثل فواتير الإعلانات أو اسم المتجر في مدير الأعمال. لا نطلب صورة هوية إلا إذا طلبها النموذج الرسمي نفسه.",
  },
  {
    q: "ماذا يحدث بعد أن أرسل لقطة الشاشة؟",
    a: "نقرأ نص الرسالة حرفياً، ثم نسألك عمّا بقي بيدك: البريد، والشريحة، والجهاز المعتاد، وهل أرسلت اعتراضاً من قبل ومتى. بعدها نكتب لك التشخيص بكلمات واضحة: نوع الحالة، والمهلة التي تهمك إن وُجدت، وتقديراً للفرص بثلاث درجات فقط مرتفعة أو متوسطة أو ضعيفة. ونذكر السعر والمدة المتوقعة قبل أي التزام. إن وافقت نجهز الأدلة، ونصوغ الطلب، ونرسله من المسار الصحيح مرة واحدة، ثم نقرأ معك كل رد.",
  },
  {
    q: "ما الذي يجعل حالتي قوية أو ضعيفة؟",
    a: "ترتفع الفرص إذا كانت مهلة الاعتراض ما زالت سارية، والبريد المرتبط يصلك ولو من غير الحساب، والحساب أنشأته أنت ولديك ما يربطك بمحتواه، ولم تُرسل قبلنا طلبات كثيرة متناقضة. وتنخفض إذا مضت المهلة أو قالت الرسالة إن القرار نهائي، أو ضاع البريد والرقم معاً، أو كان الحساب مشترى من شخص آخر، أو تكرر التعطيل للسبب نفسه بعد عودة سابقة. نقول لك أي الوصفين يطابق حالتك قبل أن تدفع شيئاً.",
  },
  {
    q: "كيف يُحدد السعر ومتى أدفع؟",
    a: "لا سعر موحد، لأن جهد حالة حذف ما زالت مهلتها مفتوحة يختلف جذرياً عن سرقة غُيّرت فيها كل البيانات. الفحص الأول مجاني ولا يلزمك بشيء، وبعده نذكر السعر والمدة المتوقعة لحالتك أنت، ولا دفع قبل التشخيص ولا رسوم تظهر في منتصف الطريق. وإن كان الحل خطوة أو خطوتين داخل التطبيق نكتبهما لك مجاناً ونقول صراحة إنك لا تحتاج خدمة مدفوعة.",
  },
  {
    q: "كم تستغرق الخدمة؟",
    a: "تختلف المدة حسب نوع الحالة وحسب رد ميتا، وهي الجزء الذي لا يملكه أحد غير المنصة. ما نستطيع ضبطه هو ألا يُهدر وقت في مسار خاطئ أو في طلب يُرسل ناقصاً فيعود بالرفض. نذكر لك المدى المتوقع لحالتك بعد الفحص وقبل أي دفع، وفي كل صفحة خدمة جدول بالمدد المعتادة لتلك الحالة. من يعدك برقم ثابت للجميع، أو بفتح فوري خلال دقائق، يصف شيئاً لا يملكه.",
  },
  {
    q: "هل أرسل الاعتراض بنفسي قبل أن أراسلكم؟",
    a: "إن ظهر زر الاعتراض فإرساله مرة واحدة بجملتين هادئتين لا يضر، وقد يكفي وحده في حالات كثيرة. ما يضر فعلاً هو تكرار الإرسال بنصوص متناقضة، أو اختيار نموذج لا يطابق رسالة الشاشة مثل استعمال «نسيت كلمة السر» لحساب معطّل بقرار من ميتا. إن كنت قد أرسلت شيئاً بالفعل فأخبرنا بنصه وتاريخه، لأن قراءة ما أُرسل سابقاً تحدد ما الذي أضعف الملف وكيف نعيد التقديم.",
  },
  {
    q: "ماذا يحدث إن وصل رفض من ميتا؟",
    a: "لا نعيد النص نفسه في اليوم نفسه، لأن تكرار طلب متشابه يُضعف الملف ولا يفتحه. نقرأ صيغة الرفض كما وصلت، ونضيف دليلاً لم يكن في الطلب الأول، أو نغيّر المسار إن تبيّن أن الحالة غير ما ظهر أولاً، مثل اختراق سبق التعطيل. وإن قرأنا في الرفض ما يدل على أن القرار نهائي فنقول لك بوضوح إن التوقف أفضل من الاستمرار، ونقترح ما يحمي بقية حساباتك.",
  },
  {
    q: "ما الذي لا تستطيع هذه الخدمة فعله؟",
    a: "لا نخترق حسابات، ولا نتجاوز المصادقة الثنائية، ولا ندّعي واسطة داخل انستقرام أو ميتا، ولا نضمن قرار المنصة ولا موعد وصوله. لا نفتح حساباً انتهت مهلة اعتراضه أو حُذف نهائياً بطلب منك، ولا نعيد متابعين أو محتوى فُقد، ولا نقبل طلباً يخص حساب غيرك مهما كانت القصة أو صلة القرابة. ولا نطلب كلمة المرور ولا رمز التحقق. ما نقدمه خبرة بالمسار الرسمي وصياغة الطلب والمتابعة، لا أكثر.",
  },
  {
    q: "هل تخدمون من هم خارج الخليج؟",
    a: "نعم. نخدم الناطقين بالعربية في أي بلد ما دام التواصل عبر واتساب ممكناً وصاحب الطلب هو مالك الحساب، ولدينا صفحات خاصة للسعودية والإمارات والكويت وقطر والبحرين وعُمان والأردن والعراق. اختلاف الدولة لا يغيّر المسار الرسمي كثيراً، لكنه قد يغيّر وثيقة الهوية التي يقبلها النموذج، والجهة الرسمية التي تُبلّغ عندها عن الاختراق، ولهذا فصلنا تلك التفاصيل في صفحة كل بلد بدل جمعها في صفحة واحدة.",
  },
];

export default function ServicesPage() {
  // 2026-10-26: Service يعيش هنا وعلى الرئيسية وصفحات الخدمة فقط، لا في التخطيط العام.
  // ولا سعر رقمي في المخطط لأن السعر حسب الحالة ويُحدد بعد الفحص.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl("/services")}#service`,
        name: "خدمات استرجاع حسابات انستقرام",
        serviceType: "استرجاع حساب انستقرام معطل أو مبند أو محذوف أو مسروق أو مغلق عبر المسارات الرسمية",
        description: metadata.description,
        url: absoluteUrl("/services"),
        provider: { "@id": `${absoluteUrl("/")}#organization` },
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "IQ"],
        availableLanguage: ["ar"],
        availableChannel: { "@type": "ServiceChannel", serviceUrl: whatsappChatUrl, availableLanguage: ["ar"] },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "خدمات استرجاع حسابات انستقرام حسب الحالة",
          itemListElement: servicePages.map((page) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: page.h1, url: absoluteUrl(`/services/${page.slug}`) },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl("/services")}#faq`,
        url: absoluteUrl("/services"),
        inLanguage: "ar",
        mainEntity: servicesFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "خدمات الاسترجاع", item: absoluteUrl("/services") },
        ],
      },
    ],
  };
  return (
    <div className="bg-[#f4efe6] text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          <h2 className="text-2xl font-extrabold">ما الأدلة التي نطلبها منك؟</h2>
          <p className="mt-3 max-w-3xl leading-8 text-[#44403c]">
            لا نطلب كلمة المرور ولا رمز التحقق ولا بيانات بنكية. ما يحتاجه المراجع هو ما يربطك بالحساب قبل أن يُفقد
            الوصول إليه، وهذه قائمة ما نطلبه ولماذا. لا يلزم أن تملكها كلها؛ كل بند موجود يرفع فرصك، وغيابه نعوّضه بغيره.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#142033] text-[#f6f1e8]">
                  <th className="p-4 text-right font-bold">ما نطلبه</th>
                  <th className="p-4 text-right font-bold">لماذا يهم المراجع</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((row, i) => (
                  <tr key={row.item} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                    <td className="border-t border-[#e6dcc8] p-4 font-bold">{row.item}</td>
                    <td className="border-t border-[#e6dcc8] p-4 text-[#44403c]">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#57534e]">
            صورة الهوية لا نطلبها إلا إذا طلبها النموذج الرسمي نفسه، وتُحذف من أجهزتنا بعد إغلاق الحالة كما في{" "}
            <Link href="/privacy-policy" className="font-bold text-[#9a3412] underline underline-offset-4">سياسة الخصوصية</Link>.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold">ما يرفع فرص حالتك وما يخفضها</h2>
          <p className="mt-3 max-w-3xl leading-8 text-[#44403c]">
            نقدّر الفرص بثلاث درجات فقط: مرتفعة أو متوسطة أو ضعيفة، بلا نسب مئوية مختلقة. والجدول التالي يشرح ما نبني
            عليه هذا التقدير، حتى تقرأ حالتك بنفسك قبل أن تراسل أي أحد.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#142033] text-[#f6f1e8]">
                  <th className="p-4 text-right font-bold">يرفع الفرص</th>
                  <th className="p-4 text-right font-bold">يخفض الفرص</th>
                </tr>
              </thead>
              <tbody>
                {odds.map((row, i) => (
                  <tr key={row.strong} className={i % 2 ? "bg-[#fbf7f0]" : "bg-white"}>
                    <td className="border-t border-[#e6dcc8] p-4 text-[#44403c]">{row.strong}</td>
                    <td className="border-t border-[#e6dcc8] p-4 text-[#44403c]">{row.weak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
