import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppCta } from "@/components/Cta";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "من نحن — مكتب Unlock Accounts لاسترجاع حساب انستقرام عبر مسارات ميتا الرسمية" },
  description:
    "Unlock Accounts مكتب عربي مستقل غير تابع لميتا يساعد مالك الحساب على استرجاع حساب انستقرام المعطل أو المسروق أو المحذوف. فحص مجاني، بلا كلمة مرور، وبلا ضمان.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "من نحن — Unlock Accounts لاسترجاع حسابات انستقرام",
    description: "مكتب عربي مستقل يعمل عبر نماذج ميتا الرسمية فقط. فحص مجاني عبر واتساب، لا كلمة مرور، والسعر حسب الحالة.",
    url: "/about",
    type: "website",
  },
};

const steps = [
  {
    title: "الفحص المجاني من لقطة الشاشة",
    text: "ترسل عبر واتساب لقطة الرسالة التي تظهر لك واسم المستخدم. نقرأ نص الرسالة بدقة لأن كل صيغة تشير إلى مسار مختلف لدى ميتا.",
  },
  {
    title: "تحديد نوع الحالة والفرص",
    text: "نرد بتصنيف واضح: معطل، مبند، محذوف، مسروق، أو مغلق. ونقول صراحة إن كانت الفرص قوية أو ضعيفة أو شبه معدومة.",
  },
  {
    title: "سعر ومدة قبل أي دفع",
    text: "تعرف السعر الكامل والمدة المتوقعة قبل أن تدفع ريالاً واحداً. لا رسوم تظهر لاحقاً، وإن كان الحل خطوتين داخل التطبيق نكتبها لك مجاناً.",
  },
  {
    title: "تجهيز الطلب الرسمي",
    text: "نحدد إثبات الملكية المناسب لحالتك، ونصوغ الطلب بالصيغة التي تفهمها فرق المراجعة، ونرسله عبر النموذج الرسمي الصحيح.",
  },
  {
    title: "المتابعة وتأمين الحساب",
    text: "نتابع الرد ونتعامل مع الرفض الأولي إن حدث، وبعد العودة نرشدك إلى خطوات التأمين حتى لا تتكرر المشكلة.",
  },
];

const commitments = [
  {
    title: "لا كلمة مرور ولا رمز تحقق",
    text: "لا نطلب كلمة المرور أبداً، ولا رمز التحقق الذي يصلك برسالة. أي جهة تطلبهما ليست جهة استرجاع.",
  },
  {
    title: "لا ضمان على قرار ميتا",
    text: "القرار النهائي للمنصة وحدها. نضمن جودة العمل والمتابعة، ولا نضمن النتيجة، ونرفض كتابة «مضمون» في أي عرض.",
  },
  {
    title: "فحص مجاني دائماً",
    text: "تشخيص الحالة وتقدير الفرص بلا مقابل وبلا التزام. تدفع فقط إن قررت المتابعة بعد معرفة الصورة الكاملة.",
  },
  {
    title: "سعر مسبق ومكتوب",
    text: "السعر يحدد حسب الحالة ويُرسل لك مكتوباً قبل البدء. ما نتفق عليه هو ما تدفعه، دون إضافات في منتصف الطريق.",
  },
  {
    title: "سرية كاملة",
    text: "لقطات الشاشة وبيانات الملف تبقى بيننا وبين مالك الحساب فقط، ولا تُستخدم في أي عرض أو شهادة أو إعلان.",
  },
  {
    title: "مالك الحساب فقط",
    text: "نعمل حصراً مع صاحب الحساب الذي يستطيع إثبات ملكيته. لا نقبل طلباً يخص حساب شخص آخر مهما كان السبب.",
  },
];

const notDo = [
  "لا نخترق حسابات ولا نستعيد حساباً بطرق غير رسمية.",
  "لا ندّعي واسطة أو موظفاً داخل انستقرام أو ميتا.",
  "لا نطلب كلمة المرور أو رمز التحقق أو الدخول إلى بريدك.",
  "لا نبيع متابعين ولا نتعامل مع حسابات مخالفة لقواعد المنصة.",
  "لا نقبل حساباً لا يخص صاحب الطلب أو لا يمكن إثبات ملكيته.",
  "لا نأخذ مقابلاً عن حالة نعرف مسبقاً أن فرصها شبه معدومة.",
];

const audiences = [
  { title: "المتاجر الإلكترونية", text: "حساب المتجر هو واجهة البيع، وتوقفه يوماً واحداً يعني خسارة مباشرة. نعطي حالات المتاجر أولوية في السرعة." },
  { title: "العيادات والمراكز", text: "عيادات التجميل والأسنان والمراكز الطبية التي يتوقف حجزها على انستقرام، وتحتاج رجوع الحساب نفسه لا حساباً جديداً." },
  { title: "المؤثرون وصناع المحتوى", text: "حسابات بسنوات من المحتوى وعقود إعلانية معلّقة، حيث يكون التوثيق وتاريخ النشر عاملاً مهماً في الطلب." },
  { title: "الأفراد", text: "حسابات شخصية بذكريات وصور ومحادثات لا تُعوَّض. نتعامل معها بنفس الجدية ونقول صراحة إن كان الحل مجانياً وبسيطاً." },
];

const checklist = [
  "هل تطلب الخدمة كلمة المرور أو رمز التحقق؟ إن كان الجواب نعم فابتعد فوراً.",
  "هل تقول «مضمون 100%» أو «خلال ساعات»؟ لا أحد يملك قرار ميتا، والوعد القاطع علامة نصب.",
  "هل تحصل على فحص وتشخيص واضح قبل الدفع، أم يُطلب الدفع أولاً؟",
  "هل السعر مكتوب ومحدد قبل البدء، أم «نتفق لاحقاً»؟",
  "هل تطلب الخدمة إثبات أنك مالك الحساب؟ الجهة التي لا تسأل عن الملكية تسترجع حسابات الغير أيضاً.",
  "هل للخدمة موقع واضح وصفحة شروط وسياسة خصوصية، أم مجرد حساب على منصة ورقم؟",
  "هل تشرح لك المسار الرسمي الذي ستستخدمه، أم تتحدث عن «طرق خاصة» و«معارف داخل الشركة»؟",
];

const faqs = [
  {
    q: "هل Unlock Accounts تابع لشركة ميتا أو انستقرام؟",
    a: "لا. نحن مكتب عربي مستقل تماماً، لا تربطنا أي علاقة رسمية بميتا أو انستقرام، ولا نملك صلاحيات داخل المنصة. ما نقدمه هو خبرة في قراءة الحالة واختيار النموذج الرسمي الصحيح وصياغة الطلب ومتابعته.",
  },
  {
    q: "لماذا لا تضمنون استرجاع الحساب؟",
    a: "لأن القرار النهائي بيد فرق المراجعة في ميتا، ولا يملك أي طرف خارجي التحكم فيه. من يعدك بضمان إما يجهل كيف تعمل المنصة أو يريد المبلغ فقط. نحن نضمن جودة العمل والمتابعة والصدق في تقدير الفرص.",
  },
  {
    q: "كيف تعملون دون كلمة المرور؟",
    a: "نماذج الاستئناف وإثبات الملكية لدى ميتا لا تحتاج كلمة المرور أصلاً، بل تعتمد على بيانات يملكها صاحب الحساب فقط: البريد أو الرقم المرتبط، صور إثبات الهوية عند طلبها، وتاريخ الحساب. ولهذا من يطلب كلمة المرور لا يستخدم المسار الرسمي.",
  },
  {
    q: "كم يكلف استرجاع الحساب؟",
    a: "لا سعر موحداً لأن الحالات تختلف جذرياً في الجهد والمدة. بعد الفحص المجاني نرسل لك السعر والمدة المتوقعة مكتوبين، وتقرر أنت. وإن كان الحل بسيطاً وداخل التطبيق نشرحه لك مجاناً دون خدمة.",
  },
  {
    q: "من أين تعملون ومن تخدمون؟",
    a: "نعمل عن بُعد بالعربية، ونخدم بشكل أساسي عملاء السعودية ودول الخليج، إلى جانب باقي الدول العربية. كل التواصل عبر واتساب، ولا يلزم حضور أو اتصال هاتفي.",
  },
];

export default function AboutPage() {
  const organizationId = `${absoluteUrl("/")}#organization`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${absoluteUrl("/about")}#aboutpage`,
        url: absoluteUrl("/about"),
        name: "من نحن: مكتب Unlock Accounts لاسترجاع حسابات انستقرام",
        description: metadata.description,
        inLanguage: "ar",
        isPartOf: { "@type": "WebSite", url: absoluteUrl("/"), name: site.name },
        about: { "@id": organizationId },
        mainEntity: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: absoluteUrl("/"),
        description: site.description,
        areaServed: ["SA", "AE", "KW", "QA", "BH", "OM", "JO"],
        availableLanguage: ["ar"],
        knowsAbout: ["استرجاع حساب انستقرام", "استئناف تعطيل انستقرام", "إثبات ملكية حساب انستقرام"],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: `+${site.whatsapp}`,
          availableLanguage: ["ar"],
          url: absoluteUrl("/contact"),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl("/about")}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="bg-[#f4efe6] text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
        <p className="text-xs font-bold tracking-widest text-[#9a3412]">من نحن · مكتب مستقل غير تابع لميتا</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">من نحن: مكتب Unlock Accounts لاسترجاع حسابات انستقرام</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">
          Unlock Accounts مكتب عربي مستقل يساعد مالك الحساب على استرجاع حساب انستقرام المعطل أو المبند أو المحذوف أو
          المسروق أو المغلق، عبر نماذج ميتا الرسمية فقط. نفحص الحالة مجاناً عبر واتساب، لا نطلب كلمة مرور ولا رمز
          تحقق، ونحدد السعر حسب الحالة قبل أي دفع، ولا نعد بما لا نملكه: قرار المنصة ليس بيدنا ولا بيد أحد غيرها.
        </p>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">قصتنا ولماذا بدأنا</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              بدأ المكتب من ملاحظة بسيطة تكررت أمامنا: صاحب الحساب يرى رسالة «تم تعطيل حسابك» أو «لا يمكننا التحقق من
              هويتك»، فيبحث في جوجل ويوتيوب فيجد شروحات قديمة عن نماذج لم تعد موجودة، ثم يلجأ إلى حسابات تعرض
              «استرجاع مضمون خلال ساعات» وتطلب كلمة المرور ومبلغاً مقدماً، فيخسر المبلغ ويخسر أحياناً ما تبقى من فرصة
              الحساب.
            </p>
            <p className="mt-4 leading-8 text-[#44403c]">
              رأينا أن المشكلة ليست في غياب المسار الرسمي، فميتا توفر نماذج استئناف وإثبات ملكية لكل حالة تقريباً.
              المشكلة أن المسارات متفرعة، وصيغ الرسائل متشابهة، وخطأ واحد في اختيار النموذج أو في صياغة الطلب يُغلق
              الباب. فقررنا أن نكون الطرف الذي يقرأ الرسالة بدقة، ويعرف أي نموذج يناسبها، ويقول الحقيقة حتى حين تكون ضد
              بيع الخدمة.
            </p>
          </div>
          <div className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
            <h3 className="text-lg font-extrabold">ما الذي يميّز طريقتنا</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[#57534e]">
              <li>▸ التشخيص قبل أي شيء: لا نتحرك قبل تحديد نوع الحالة، لأن المسار الخاطئ يضيّع الفرصة.</li>
              <li>▸ المسارات الرسمية فقط: نماذج انستقرام وميتا، لا اختراق ولا التفاف على الحماية.</li>
              <li>▸ الصراحة في تقدير الفرص: نرفض الحالة إن كانت بلا أمل بدل أخذ مقابل لا طائل منه.</li>
              <li>▸ عربي بالكامل: الفحص والشرح والمتابعة بلغتك، من أول رسالة حتى عودة الحساب.</li>
            </ul>
            <p className="mt-5 text-sm leading-7 text-[#78716c]">
              تجد تفاصيل كل حالة وخطواتها في صفحة{" "}
              <Link href="/services" className="font-bold text-[#9a3412] underline underline-offset-4">
                خدمات الاسترجاع
              </Link>
              .
            </p>
          </div>
        </section>

        <h2 className="mt-16 text-2xl font-extrabold">كيف نعمل بالضبط؟ خمس خطوات من أول رسالة</h2>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-sm border border-[#e6dcc8] bg-[#e6dcc8] sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-[#fbf7f0] p-5">
              <p className="text-2xl font-extrabold text-[#9a3412]">0{index + 1}</p>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#57534e]">{step.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-16 text-2xl font-extrabold">ما نلتزم به أمام كل عميل</h2>
        <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">
          هذه ليست شعارات تسويقية بل قواعد عمل ثابتة، وأي مخالفة لها من أي شخص يتحدث باسمنا تعني أنه لا يمثلنا.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {commitments.map((item) => (
            <article key={item.title} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6">
              <h3 className="font-extrabold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#57534e]">{item.text}</p>
            </article>
          ))}
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">ما الذي لا نفعله؟</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              تحديد ما لا نفعله لا يقل أهمية عن وصف ما نفعله، لأنه الحد الفاصل بين خدمة مهنية وسوق النصب الذي نحذّر منه.
            </p>
            <ul className="mt-5 space-y-2 leading-8 text-[#44403c]">
              {notDo.map((item) => (
                <li key={item}>✕ {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">من نخدم؟</h2>
            <p className="mt-4 leading-8 text-[#44403c]">
              نخدم بشكل أساسي عملاء السعودية ودول الخليج، إلى جانب باقي الدول العربية، عن بُعد وبالعربية.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {audiences.map((a) => (
                <article key={a.title} className="rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-5">
                  <h3 className="font-bold">{a.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#57534e]">{a.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold">لماذا نرفض الوعود القاطعة؟</h2>
          <p className="mt-4 leading-8 text-[#44403c]">
            سوق «استرجاع الحسابات» في المنطقة العربية مليء بحسابات تعرض «استرجاع مضمون» و«فك البند خلال ساعة» وتطلب
            مبلغاً مقدماً وكلمة المرور أو رمز التحقق. آلية هذا النصب بسيطة: يُحوَّل المبلغ، ثم إما يُحجب العميل، أو
            يُستخدم رمز التحقق للاستيلاء على الحساب نفسه أو على حسابات أخرى مرتبطة به، أو يُرسَل طلب عشوائي يفسد فرصة
            الاستئناف الحقيقية.
          </p>
          <p className="mt-4 leading-8 text-[#44403c]">
            الحقيقة التي يعرفها كل من عمل في هذا المجال بجدية: لا يملك أي طرف خارجي قرار ميتا. ما يمكن التحكم فيه هو
            جودة التشخيص، واختيار النموذج الصحيح، ودقة إثبات الملكية، وصياغة الطلب، والمتابعة. هذه هي خدمتنا، ونقول
            ذلك بوضوح لأن الصدق في البداية أفضل من خيبة الأمل في النهاية.
          </p>
        </section>

        <h2 className="mt-16 text-2xl font-extrabold">كيف تتحقق من جدية أي خدمة استرجاع، بما فيها نحن؟</h2>
        <p className="mt-4 max-w-3xl leading-8 text-[#44403c]">
          طبّق هذه الأسئلة على أي جهة قبل أن تدفع لها، ونرحب بأن تطبقها علينا أولاً.
        </p>
        <ol className="mt-6 space-y-3">
          {checklist.map((item, index) => (
            <li key={item} className="flex gap-4 rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-4 leading-7 text-[#44403c]">
              <span className="shrink-0 font-extrabold text-[#9a3412]">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <h2 className="mt-16 text-2xl font-extrabold">أسئلة شائعة عن المكتب</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-sm border border-[#e6dcc8] bg-[#fbf7f0] p-5">
              <summary className="cursor-pointer list-none font-extrabold leading-7">{f.q}</summary>
              <p className="mt-3 leading-8 text-[#44403c]">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 leading-8 text-[#44403c]">
          المزيد من الأسئلة عن الحالات والمدد والأسعار في صفحة{" "}
          <Link href="/faq" className="font-bold text-[#9a3412] underline underline-offset-4">
            الأسئلة الشائعة
          </Link>
          ، أو راسلنا مباشرة من صفحة{" "}
          <Link href="/contact" className="font-bold text-[#9a3412] underline underline-offset-4">
            التواصل
          </Link>
          .
        </p>

        <div className="mt-12 rounded-sm bg-[#142033] p-8 text-[#f6f1e8]">
          <p className="text-xl font-extrabold">ابدأ بفحص مجاني لحالة حسابك</p>
          <p className="mt-3 leading-7 text-[#d6d3d1]">
            أرسل لقطة الشاشة واسم المستخدم عبر واتساب، ونرد بنوع الحالة وتقدير الفرص والخطوة العاجلة. بلا كلمة مرور،
            وبلا التزام.
          </p>
          <WhatsAppCta className="mt-6">تواصل عبر واتساب</WhatsAppCta>
        </div>
      </div>
    </div>
  );
}
